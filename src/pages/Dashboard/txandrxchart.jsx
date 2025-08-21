import React, { useEffect, useRef, useState } from "react";
import { format } from 'date-fns'
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";
import { useSelector } from "react-redux";


const TxRxDiffchart = ({ graphOption, graphOptionValue,currentTab }) => {
    const [txData, setTxData] = useState(['1113783']);
    const [rxData, setRxData] = useState(['8005870']);
    const [differenceData, setDifferenceData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const counterRef = useRef(1);

    let lastTx = 0;
    let lastRx = 0;


    const formatChartData = (apiData) => {
        const { timestamps, labels, columns } = apiData;
        //  let arr = { "timestamp": 0, "index": i, "txDiff": 0, 'rxDiff': 0 }

        return timestamps.map((timestamp, index) => {
            return {
                timestamp: timestamp,
                [labels[0]]: parseFloat(columns[0].values[index])/1024,
                [labels[1]]: parseFloat(columns[1].values[index])/1024,
                totalbytes: parseFloat(columns[0].values[index])/1024 + parseFloat(columns[1].values[index])/1024,
                // [labels[2]]: parseFloat(columns[2].values[index]),
                traincab: 102
                
            };
        });
    };

    const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');



    const repalceItem = (newItem) => {
        setDifferenceData(prev => [...prev.slice(1), newItem])
    }


    const getServerStatusDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        let tx_bytes = 0;
        let rx_bytes = 0;
        let totalbytes = 0;
        let traincab = 0;
        const dt = new Date();
        try {
            const username = "admin";
            const password = "admin";
            const token = btoa(`${username}:${password}`);
            const options = {
                method: "GET",
                headers: {
                    "Authorization": `Basic ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url);
            
            if (response.status === 200) {
                const data = await response.json();

                if (graphOption === 'live') {
                    

                    tx_bytes = parseInt(data.tx_bytes) - lastTx;
                    rx_bytes = parseInt(data.rx_bytes) - lastRx;

                    if (lastTx == 0 && lastRx == 0) {
                        tx_bytes = 0;
                        rx_bytes = 0;
                    }

                    lastTx = parseInt(data.tx_bytes);
                    lastRx = parseInt(data.rx_bytes);

                    tx_bytes = tx_bytes < 0 ? 0 : tx_bytes/1024;
                    rx_bytes = rx_bytes < 0 ? 0 : rx_bytes/1024;


                    totalbytes = tx_bytes + rx_bytes;
                    let dataNew = {
                        totalbytes,
                        tx_bytes,
                        rx_bytes,
                        traincab,
                        timestamp: dt.getTime(),
                        index: counterRef.current
                    };

                    repalceItem(dataNew);

                    if (counterRef.current > 360) {
                        counterRef.current = 1;
                    }
                    counterRef.current += 1;                 
                } else {
                    const formatted = formatChartData(data);
                    setDifferenceData(Array.isArray(formatted) ? formatted : []);
                }
            } else if (response.status === 304) {
                console.log("304 Not Modified – using cached data.");
            } else if (response.status === 404) {
                console.log("404 Not Found – clearing data.");

                if (graphOption === 'live') {
                    // Clear live chart data
                    setDifferenceData([]); // Make sure this state exists and is used to render the live chart
                    lastTx = 0;
                    lastRx = 0;
                    counterRef.current = 1;
                } else {
                    try
                    {   
                        const text = await response.text();  // Try to read the body
                        const data = text ? JSON.parse(text) : {};  // Safely parse if it's not empty
                        const formatted = formatChartData(data);
                        setDifferenceData(Array.isArray(formatted) ? formatted : []);
                    } catch (err) {
                        const data =[];
                        const formatted = formatChartData(data);
                        setDifferenceData(Array.isArray(formatted) ? formatted : []);
                    }
                }
            } else {
                throw new Error(`Unexpected response: ${response.status}`);
            }
        } catch (error) {
            
            let dataNew = {
                totalbytes,
                tx_bytes,
                rx_bytes,
                traincab,
                timestamp: dt.getTime(),
                index: counterRef.current
            };

            repalceItem(dataNew);
            setIsError({ status: true, msg: error.message });
            console.error("Fetch error:", error);
        } finally {
            setIsLoading(false);
        }
    };


useEffect(() => {
    if (graphOption === 'live') {
        const defData = []      
        for (let i = 0; i <= 360; i++) {
            let arr = { "timestamp": 0, "index": i, "tx_bytes": 0, 'rx_bytes': 0, "totalbytes": 0 ,"traincab":0}
            defData.push(arr);
        }
        setDifferenceData(defData)
    }


    let interval;
    if (graphOption === 'live') {
        interval = setInterval(() => {
            const url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/netstats`;
            getServerStatusDt(url);
        }, 5000);
    }
    return () => clearInterval(interval);
}, [graphOption]);



useEffect(() => {
    let url = '';
    if (graphOption === 'live') {
        url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/netstats`;
    } else {
        url = `rest/measurements/node%5B${nodeDataId}%5D.nodeSnmp%5B%5D?aggregation=AVERAGE&att=rx_bytes,tx_bytes&duration=${graphOptionValue}`;
    }
    getServerStatusDt(url);
}, [graphOptionValue, graphOption]);




const hourFormat = (graphOption) => {
    //debugger;
    if (graphOption === 'onehour') {
        return 'HH:mm';
    } else if (graphOption === 'oneday') {
        return 'HH:mm';
    } else if (graphOption === 'oneweek') {
        return 'MMM/dd HH:mm';
    } else if (graphOption === 'onemonth') {
        return 'MMM dd';
    } else {
        return 'HH:mm';
    }
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const traincab = payload[0].payload.traincab || 0;
        const txValue = payload[1].payload.tx_bytes.toFixed(2) ||0;
        const rxValue = payload[2].payload.rx_bytes.toFixed(2) || 0;
        return (
            <div className="custom-tooltip">
               {/* <h1 style={{paddingBottom:'40px'}}>{traincab}</h1> */}
                <div>{format(new Date(payload[0].payload.timestamp), 'HH mm') || 0}</div>
                <span>Bytes</span>
                   {/* <div>Bytes</div> */}

                   <ul className="txrxlist">
                        <li>Tx : {txValue}</li>
                        <li>Rx : {rxValue}</li>
                   </ul>
                {/* {payload.map((pld) => (
                    // <div style={{ display: "inline-block", padding: 10 }}>
                    //    <div style={{ color: 'black' }}>
                    //     {pld.dataKey}: {pld.value != null ? pld.value.toFixed(2) : "0.00"}
                    //     </div>

                    // </div>
                    <ul className="txrxlist">
                        <li>
                            {pld.dataKey}: {pld.value != null ? pld.value.toFixed(2) : "0.00"}
                        </li>
                    </ul>
                ))} */}
                                     {/* <div>traincab : {traincab}</div> */}

            </div>
        );
    }

    return null;
};


const CustomLegend = (props) => {
    const { payload } = props;

    return (
        <ul style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {payload.map((entry, index) => {
                const itemColor = 'black';
                const dotColor = index === 0 ? '#dbd0f6' : index === 1 ? '#ffc99f' : '#a1d9fc';

                return (
                    <li
                        key={`item-${index}`}
                        onMouseEnter={() => console.log("Hover:", entry.value)}
                        onMouseLeave={() => console.log("Leave:", entry.value)}
                        style={{ color: itemColor, cursor: 'pointer', margin: '0 10px' }}
                    >
                        <span style={{ marginRight: 5, color: dotColor }}>●</span> {entry.value} (in kbps)
                    </li>
                );
            })}
        </ul>
    );
};


return (
    <>

        <article>
            <ResponsiveContainer height={240}>
                <AreaChart data={differenceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="timestamp"
                        tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                        fontFamily="Lato-Regular"
                        letterSpacing="0.2px"
                    />
                    {/* <YAxis ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} /> */}
                    <YAxis domain={differenceData.length === 0 ? [0, 5] : ['auto', 'auto']} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                    {/* <Legend /> */}
                    <Legend content={<CustomLegend />} />
                    <Area
                        type="monotone"
                        name="Total"
                        dataKey="totalbytes"
                        stroke="#dbd0f6"
                        fill="#dbd0f6"
                        color="black"
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        name="Tx"
                        dataKey="tx_bytes"
                        stroke="#ffc99f"
                        fill="#ffc99f"
                        // opacity={}
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        name="Rx"
                        dataKey="rx_bytes"
                        stroke="#a1d9fc"
                        fill="#a1d9fc"
                        isAnimationActive={false}
                    />

                </AreaChart>
            </ResponsiveContainer>
        </article>
    </>
);
};

export default TxRxDiffchart;

