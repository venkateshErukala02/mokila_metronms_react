import React, { useState, useEffect, useRef } from "react";
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


const TemperatureChart = ({ graphOption, graphOptionValue }) => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const counterRef = useRef(1);

    const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');

    const repalceItem = (newItem) => {
        setTemperatureData(prev => [...prev.slice(1), newItem])
    }

    const formatChartData = (apiData) => {
        const { timestamps, labels, columns } = apiData;

        return timestamps.map((timestamp, index) => {
            const Temperature = parseFloat(columns[0].values[index]);
            return {
                // timestamp: new Date(timestamp).toLocaleTimeString(), 
                timestamp: timestamp,
                // [labels[0]]: parseFloat(columns[0].values[index]),
                Temperature: isNaN(Temperature) ? 0 : Temperature,
            };
        });
    };



    const getServerStatusDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
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
                // console.log('ppppp',data);


                if (graphOption === 'live') {
                    let dt = new Date();
                    const dataNew = {
                        Temperature: data.temp || 0,
                        timestamp: dt.getTime(),
                        index: counterRef.current
                    }
                    repalceItem(dataNew)

                    if (counterRef.current > 360) {
                        counterRef.current = 1;
                    }
                    counterRef.current += 1;
                } else {
                    setTemperatureData([])
                    const formatted = formatChartData(data);
                    setTemperatureData(formatted);
                }
            } else if (response.status === 304) {
                console.log("304 Not Modified – using cached data.");
            } else if (response.status === 500) {
                throw new Error(`Unexpected serverError: ${response.status}`);
            }else if(response.status === 404){
                const data = await response.json();
                const formatted = formatChartData(data);
                    setTemperatureData(formatted);
            }
            else {
                throw new Error(`Unexpected response: ${response.status}`);
            }
        } catch (error) {
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
                let arr = { "timestamp": 0, "index": i, "Temperature": 0 }
                if (i == 0) {
                    arr = { "timestamp": 0, "index": i, "Temperature": 0 }
                } else if (i % 12 == 0) {
                    arr = { "timestamp": 0, "index": i, "Temperature": 0 }
                }
                defData.push(arr);
            }
            setTemperatureData(defData)
        }
        if (graphOption === 'live') {
            const setTime = setInterval(() => {
                const url = `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`;
                getServerStatusDt(url);
            }, 5000);

            return () => clearInterval(setTime);
        }


    }, [nodeDataId, graphOption]);
    


    useEffect(() => {
        let url = '';
        if (graphOption === 'live') {
            url = `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`
        }
        else {
            url=`rest/measurements/node%5B${nodeDataId}%5D.nodeSnmp%5B%5D?aggregation=AVERAGE&att=temp&duration=${graphOptionValue}`
        }
        getServerStatusDt(url);
    }, [graphOption, graphOptionValue]);




    const hourFormat = (graphOption) => {
        //debugger;
        if (graphOption === 'onehour') {
            return 'HH:mm';
        } else if (graphOption === 'oneday') {
            return 'HH:mm';
        } else if (graphOption === 'oneweek') {
            return 'MM/dd HH:mm';
        } else if (graphOption === 'onemonth') {
            return 'MMM dd';
        } else {
            return 'HH:mm';
        }
    };

    const CustomTooltip = ({ payload, label }) => {
        if (payload && payload.length) {
            const rawValue = payload[0]?.value ?? 0;
            const valueLat = Number(rawValue).toFixed(2);
            const latencyValue = isNaN(valueLat) ? "0.00" : valueLat;
            const timestamp = payload[0]?.payload?.timestamp;

            return (
                <div className="custom-tooltip">
                    <div>{format(new Date(timestamp), 'HH mm') || '0'}</div>
                    <div style={{ display: "inline-block", padding: 10 }}>
                        <div style={{ color: 'black' }}>
                            {payload[0]?.dataKey || "Temperature"} : {latencyValue || '0'}
                        </div>
                    </div>
                </div>
            )

        } else {
            return (
                <div className="custom-tooltip">
                    <div>6.00</div>
                    <div style={{ display: "inline-block", padding: 10 }}>
                        <div style={{ color: 'black' }}>
                            Temperature : 0
                        </div>
                    </div>
                </div>
            )

        }

        return null;
    };


    const CustomLegend = (props) => {
        const { payload } = props;

        return (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: 'center' }}>
                {payload.map((entry, index) => (
                    <li
                        key={`item-${index}`}
                        onMouseEnter={() => console.log("Hover:", entry.value)}
                        onMouseLeave={() => console.log("Leave:", entry.value)}
                        style={{ color: 'black', cursor: 'pointer' }}
                    >
                        <span style={{ marginRight: 10, color: '#4fc9e7' }}>●</span> {entry.value} (in &deg;C)
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <>
            <div>
                <article>
                    <ResponsiveContainer height={240}>
                        <AreaChart data={temperatureData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                            // tickFormatter={(tick) => `${tick}`}
                            />
                            {/* <YAxis /> */}
                            {/* <YAxis ticks={[0, 1, 2, 3, 4, 5]} /> */}
                            <YAxis domain={['auto', 'auto']} />
                            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
                            {/* <Legend  onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} /> */}
                            <Legend content={<CustomLegend />} />
                            <Area
                                type="monotone"
                                dataKey="Temperature"
                                stroke="#4fc9e7"
                                fill="#4fc9e7"
                                isAnimationActive={false}
                            />

                        </AreaChart>
                    </ResponsiveContainer>
                </article>
                {/* )} */}
            </div>


        </>
    );
};

export default TemperatureChart;
