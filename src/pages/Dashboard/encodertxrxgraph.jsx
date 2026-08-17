import { useEffect, useRef, useState } from "react";
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


const EncoderTxChart = ({graphOption, graphOptionValue }) => {
    const [txrxData, setTxrxData] = useState([]);
    const counterRef = useRef(1);
    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress ||  state.node?.node?.label) ?? localStorage.getItem('nodeIpaddress');
  
      const nodeDataId = useSelector((state) => state.node?.node?.nodeId || state.node?.node?.id) ?? localStorage.getItem('nodeId');
  
  
       const repalceItem = (newItem) => {
      setTxrxData(prev => [...prev.slice(1), newItem]) 
    }
  
      useEffect(() => {
      let url = '';
      if (graphOption === 'live') {
         const url = `api/v2/nodelinks/encoder/stats?nodeId=${nodeDataId}`;
      } else {
        // url = `rest/measurements/node%5B${nodeDataId}%5D.worpindex%5B1.1%5D?aggregation=AVERAGE&att=lsnr,rsnr,traincab&duration=${graphOptionValue}`;
      }
      getServerStatusDt(url);
    }, [graphOptionValue, graphOption]);
  
  
    useEffect(() => {
      if (graphOption === 'live') {
        const defData = []
        for (let i = 0; i <= 360; i++) {
          let arr = { "timestamp": 0, "index": i, "rxBit": 0, "txBit": 0,
                    //  "camDesc1" : '',
                    // "camDesc2": '',
                    // "camDesc3" : '',
                    // "camDesc4": '',
                    // "camStatus1": '',
                    // "camStatus2": '',
                    // "camStatus3": '',
                    // "camStatus4": '',
                    // "systemName": '',
                    // "station": '',
                    // "serialNumber": '',
                    // "ethernetMAC" : '',
                    // "softwareVersion": '',
                  }
          defData.push(arr);
        }
        setTxrxData(defData)
      }
  
      let interval;
      if (graphOption === 'live') {
        interval = setInterval(() => {
          // api/v2/nodelinks/constats?nodeId=237
          //const url = `api/v2//nodelinks/linkstatstest?nodeId=${nodeDataId}`;
          const url = `api/v2/nodelinks/encoder/stats?nodeId=${nodeDataId}`;
          getServerStatusDt(url);
        }, 5000);
      }
      return () => clearInterval(interval);
    }, [graphOption]);
  
    useEffect(() => {
      if (nodeIpaddress) {
        localStorage.setItem('nodeIpaddress', nodeIpaddress);
      }
    }, [nodeIpaddress]);
  

    const getServerStatusDt = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
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
      const response = await fetch(url, options);

      if (response.status === 200) {
        const data = await response.json();
        
        if (graphOption === 'live') {
              
             let dataNew = {};
             if (data && Object.keys(data).length > 0 > 0) {
               if(data?.rxBit === 'null' && data?.txBit === 'null'){
                dataNew = {
                  rxBit: 0,
                  txBit: 0,
                  // camDesc1 : data.camDesc1,
                  // camDesc2: data.camDesc2,
                  // camDesc3 : data.camDesc3,
                  // camDesc4: data.camDesc4,
                  // camStatus1: data.camStatus1,
                  // camStatus2: data.camStatus2,
                  // camStatus3: data.camStatus3,
                  // camStatus4: data.camStatus4,
                  // systemName: data.systemName,
                  // station: data.station,
                  // serialNumber: data.serialNumber,
                  // ethernetMAC : data.ethernetMAC,
                  // softwareVersion: data.softwareVersion,
                  timestamp: dt.getTime(),
                  index: counterRef.current,
                }
               }else{
                dataNew = {
                  // rxBit: data.rxBit === 'null' ? '0' : data.rxBit,
                  // txBit: data.txBit === 'null' ? '0' : data.txBit,
                  rxBit: Number(data.rxBit) || 0,
                  txBit: Number(data.txBit) || 0,
                  // camDesc1 : data.camDesc1,
                  // camDesc2: data.camDesc2,
                  // camDesc3 : data.camDesc3,
                  // camDesc4: data.camDesc4,
                  // camStatus1: data.camStatus1,
                  // camStatus2: data.camStatus2,
                  // camStatus3: data.camStatus3,
                  // camStatus4: data.camStatus4,
                  // systemName: data.systemName,
                  // station: data.station,
                  // serialNumber: data.serialNumber,
                  // ethernetMAC : data.ethernetMAC,
                  // softwareVersion: data.softwareVersion,
                  timestamp: dt.getTime(),
                  index: counterRef.current,
                }
              }
             } else {
                dataNew = {
                  rxBit: 0,
                  txBit: 0,
                  // camDesc1 : data.camDesc1,
                  // camDesc2: data.camDesc2,
                  // camDesc3 : data.camDesc3,
                  // camDesc4: data.camDesc4,
                  // camStatus1: data.camStatus1,
                  // camStatus2: data.camStatus2,
                  // camStatus3: data.camStatus3,
                  // camStatus4: data.camStatus4,
                  // systemName: data.systemName,
                  // station: data.station,
                  // serialNumber: data.serialNumber,
                  // ethernetMAC : data.ethernetMAC,
                  // softwareVersion: data.softwareVersion,
                  timestamp: dt.getTime(),
                  index: counterRef.current,
                }
             }
                
          repalceItem(dataNew)

          if (counterRef.current > 360) {
            counterRef.current = 1;
          }
          counterRef.current += 1;
        } else {
          // const formatted = formatChartData(data);
          setTxrxData(Array.isArray(data) ? data : []);

        // }          

        }
        // setNodeItemDt();
      } else if (response.status === 304) {
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
        let dataNew = {};
          dataNew = {
                  rxBit: 0,
                  txBit: 0,
                  // camDesc1 : '',
                  // camDesc2: '',
                  // camDesc3 : '',
                  // camDesc4: '',
                  // camStatus1: '',
                  // camStatus2: '',
                  // camStatus3: '',
                  // camStatus4: '',
                  // systemName: '',
                  // station: '',
                  // serialNumber: '',
                  // ethernetMAC : '',
                  // softwareVersion: '',
                  timestamp: dt.getTime(),
                  index: counterRef.current,
                }
          repalceItem(dataNew);
      setIsError({ status: true, msg: error.message });
    } finally {
      setIsLoading(false);
    }
  };



    const hourFormat = (graphOption) => {
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
  
  
  
  const CustomTooltip = ({payload, label }) => {
    if (payload && payload.length) {
      const rxRaw = payload[0]?.payload?.rxBit;
      const txRaw = payload[1]?.payload?.txBit;
       const cab = payload[0]?.payload?.traincab || "";
      const timestamp = payload[0]?.payload?.timestamp;
  
      const txValue = typeof txRaw === "number" ? parseInt(txRaw) : "0";
      const rxValue = typeof rxRaw === "number" ? parseInt(rxRaw) : "0";
  
      return (
        <div className="custom-tooltip">
          <h1 style={{ paddingBottom: '0px',fontSize:'15px' }}>{cab}</h1>
          <div>{timestamp ? format(new Date(timestamp), 'HH:mm') : 'N/A'}</div>
  
          <ul className="txrxlist">
            <li>Rx : {rxValue}</li>
            <li>Tx : {txValue}</li>
          </ul>
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
          const dotColor = index === 0 ? '#f1a5a5' : index === 1 ? '#f2dcb3' : '#4fc9e7';
  
          return (
            <li
              key={`item-${index}`}
              onMouseEnter={() => console.log('')}
              onMouseLeave={() => console.log('')}
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
                                   <AreaChart data={txrxData}>
                                     <CartesianGrid strokeDasharray="3 3" />
                                     <XAxis
                                       dataKey="timestamp"
                                       tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                                       fontFamily="Lato-Regular"
                                       letterSpacing="0.2px" 
                                     />
                                     {/* <YAxis ticks={[0,2,4,6,8,10]} /> */}
                                     <YAxis domain={['auto', 'auto']} />
                                     <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
                                       <Legend content={<CustomLegend />} />
                                     <Area
                                       type="monotone"
                                       name="RX"
                                       dataKey="rxBit"
                                       stroke="#f1a5a5"
                                       fill="#f1a5a5"
                                       isAnimationActive={false}
                                     />
                                     <Area
                                       type="monotone"
                                       name="Tx"
                                       dataKey="txBit"
                                       stroke="#f2dcb3"
                                       fill="#f2dcb3"
                                       isAnimationActive={false}
                                     />
     
                                   </AreaChart>
                                 </ResponsiveContainer>
                               </article>
    </>
  );
};

export default EncoderTxChart;

