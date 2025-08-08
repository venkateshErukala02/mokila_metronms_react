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


const TxChart = ({graphOption,graphOptionValue}) => {
 const [snrData, setSnrData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
 const counterRef = useRef(1);

  const formatChartData = (apiData) => {
  const { timestamps, labels, columns } = apiData;

  return timestamps.map((timestamp, index) => {
    //    const val0 = columns[0]?.values[index];
    // const val1 = columns[1]?.values[index];
    const val2 = columns[2]?.values[index];

    const hasDecimal = typeof val2 === 'number' && !isNaN(val2) && val2 % 1 !== 0;

    if(hasDecimal){
      return{
        timestamp: timestamp,
        [labels[0]]: 0,
        [labels[1]]: 0,
        [labels[2]]: 0,
      }
    }else{
      return {
      // timestamp: new Date(timestamp).toLocaleTimeString(), 
         timestamp: timestamp, 
      [labels[0]]: parseFloat(columns[0].values[index]),   
      [labels[1]]: parseFloat(columns[1].values[index]),
      [labels[2]]: parseFloat(columns[2].values[index]),
    };
    }
  });
};




  const repalceItem = (newItem) => {
    setSnrData(prev => [...prev.slice(1), newItem] || [])
  }




  const getServerStatusDt = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    let dt = new Date();
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
            if (data && data.links.length > 0) {
               const vallcl = data.links[0]?.traincab;
               const hasDecimal = typeof vallcl === 'number' && !isNaN(vallcl) && vallcl % 1 !== 0;
               if(hasDecimal){
                dataNew = {
                txrate: 0,
                remtexrate: 0,
                traincab: 0,
                timestamp: dt.getTime(),
                index: counterRef.current
              }
               }else{

              dataNew = {
                txrate: data.links[0].localtx,
                remtexrate: data.links[0].remotetx,
                traincab: data.links[0].traincab,
                timestamp: dt.getTime(),
                index: counterRef.current
              }  
            }
            } else {
              dataNew = {
                txrate: 0,
                remtexrate: 0,
                traincab: 0,
                timestamp: dt.getTime(),
                index: counterRef.current
              }
            }
            repalceItem(dataNew)

          if (counterRef.current > 360) {
            counterRef.current = 1;
          }
          counterRef.current += 1;
            
          }else{
          const formatted = formatChartData(data);
          // setSnrData(formatted || []);
          setSnrData(Array.isArray(formatted) ? formatted : []);

          }

      } else if (response.status === 304) {
        console.log("304 Not Modified – using cached data.");
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
        let dataNew = {
          txrate: 0,
          remtexrate: 0,
          traincab: 0,
          timestamp: dt.getTime(),
          index: counterRef.current
        }
        repalceItem(dataNew)
      setIsError({ status: true, msg: error.message });
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

   
   const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
     const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpAddress');


   useEffect(() => {
    if (graphOption === 'live') {
      const defData = []
      for (let i = 0; i <= 360; i++) {
        let arr = { "timestamp": 0, "index": i, "txrate": 0,'remtexrate':0,'traincab':0 }
        
        defData.push(arr);
      }
      setSnrData(defData)
    }
    let interval;
    if (graphOption === 'live') {
      interval = setInterval(() => {
          const url = `api/v2//nodelinks/constats?nodeId=${nodeDataId}`;
         //const url = `api/v2//nodelinks/linkstatstest?nodeId=${nodeDataId}`;
        getServerStatusDt(url);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [graphOption]); 

useEffect(() => {
  let url = '';
  if (graphOption === 'live') {
      url=`api/v2//nodelinks/constats?nodeId=${nodeDataId}`;
      //url = `api/v2//nodelinks/linkstatstest?nodeId=${nodeDataId}`;
  } else {
     url = `rest/measurements/node%5B${nodeDataId}%5D.worpindex%5B1.1%5D?aggregation=AVERAGE&att=txrate,remtexrate,traincab&duration=${graphOptionValue} `;
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



const CustomTooltip = ({payload, label }) => {
  if (payload && payload.length) {
    const txRaw = payload[0]?.payload?.txrate;
    const rxRaw = payload[1]?.payload?.remtexrate;
     const cab = payload[0]?.payload?.traincab || "";
    const timestamp = payload[0]?.payload?.timestamp;

    const snrValue = typeof txRaw === "number" ? txRaw.toFixed(2) : "0.00";
    const rsnrValue = typeof rxRaw === "number" ? rxRaw.toFixed(2) : "0.00";

    return (
      <div className="custom-tooltip">
        <h1 style={{ paddingBottom: '0px',fontSize:'15px' }}>{cab}</h1>
        <div>{timestamp ? format(new Date(timestamp), 'HH:mm') : 'N/A'}</div>
        <span>Bytes</span>

        <ul className="txrxlist">
          <li>Tx : {snrValue}</li>
          <li>Rx : {rsnrValue}</li>
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
        const dotColor = index === 0 ? '569de3' : index === 1 ? '#e39c56' : '#4fc9e7';

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
                      <AreaChart data={snrData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                        //type="number"
                         dataKey="timestamp"
                        tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                          fontFamily="Lato-Regular"
                          letterSpacing="0.2px"
                          orientation="bottom"
                        />
                        {/* <XAxis
                        orientation="bottom"
                          dataKey="name"
                          reversed
                          fontFamily="Lato-Regular"
                          letterSpacing="0.2px"
                        /> */}
                        <YAxis ticks={[0,1,2,3,4,5,6,7,8,9,10]} />
                        <Tooltip  content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
                        {/* <Legend  /> */}
                        <Legend content={<CustomLegend />} />
                        <Area
                          type="monotone"
                           dataKey='remtexrate'
                          name="Local Tx"
                          stroke="#e39c56"
                          fill="#569de3"
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          name="Remote Tx"
                            dataKey="txrate"
                          stroke="#3fc5e1"
                          fill="#e39c56"
                          isAnimationActive={false}
                        />
                       
                        
                      </AreaChart>
                    </ResponsiveContainer>
        </article>  
   </>
  );
};

export default TxChart;

