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


const RetriesChart = ({graphOption,graphOptionValue}) => {
 const [snrData, setSnrData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
 const counterRef = useRef(1);

  const formatChartData = (apiData) => {
  const { timestamps, labels, columns } = apiData;

  return timestamps.map((timestamp, index) => {
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
      const options = {
        method: "GET",
        headers: {
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
                sendretries: 0,
                sendfailures: 0,
                traincab: 0,
                timestamp: dt.getTime(),
                index: counterRef.current
              }
               }else{

              dataNew = {
                sendretries: data.links[0].sendRetries,
                sendfailures: data.links[0].sendFailures,
                traincab: data.links[0].traincab,
                timestamp: dt.getTime(),
                index: counterRef.current
              }  
            }
            } else {
              dataNew = {
                sendretries: 0,
                sendfailures: 0,
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
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
        let dataNew = {
          sendretries: 0,
          sendfailures: 0,
          traincab: 0,
          timestamp: dt.getTime(),
          index: counterRef.current
        }
        repalceItem(dataNew)
      setIsError({ status: true, msg: error.message });
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
        let arr = { "timestamp": 0, "index": i, "sendretries": 0,'sendfailures':0,'traincab':0 }
        
        defData.push(arr);
      }
      setSnrData(defData)
    }
    let interval;
    if (graphOption === 'live') {

       const url = `api/v2//nodelinks/constats?nodeId=${nodeDataId}`;

        getServerStatusDt(url);
        
      interval = setInterval(() => {
        getServerStatusDt(url);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [graphOption]); 

useEffect(() => {
  let url = '';
  if (graphOption === 'live') return;
     url = `rest/measurements/node%5B${nodeDataId}%5D.worpindex%5B1.1%5D?aggregation=AVERAGE&att=rsend,fsend,traincab&duration=${graphOptionValue} `;
  
  getServerStatusDt(url);

}, [graphOptionValue, graphOption,nodeDataId]); 


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
    const sendRetriesRaw = payload[0]?.payload?.sendRetries;
    const sendFailuresRaw = payload[1]?.payload?.sendFailures;
    const cab = payload[0]?.payload?.traincab || "N/A";
    const timestamp = payload[0]?.payload?.timestamp;

    const retriesValue = typeof sendRetriesRaw === "number" ? sendRetriesRaw.toFixed(2) : "0.00";
    const failuresValue = typeof sendFailuresRaw === "number" ? sendFailuresRaw.toFixed(2) : "0.00";

    return (
      <div className="custom-tooltip">
        <h1 style={{ paddingBottom: '0px',fontSize:'15px' }}>{cab}</h1>
        <div>{timestamp ? format(new Date(timestamp), 'HH:mm') : 'N/A'}</div>
        <span>Bytes</span>

        <ul className="txrxlist">
          <li>sendretries : {retriesValue}</li>
          <li>sendfailures : {failuresValue}</li>
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
            onMouseEnter={() => console.log('')}
            onMouseLeave={() => console.log('')}
            style={{ color: itemColor, cursor: 'pointer', margin: '0 10px' }}
          >
            <span style={{ marginRight: 5, color: dotColor }}>●</span> {entry.value} 
            {/* (in kbps) */}
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
                         dataKey="timestamp"
                        tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                          fontFamily="Lato-Regular"
                          letterSpacing="0.2px"
                          orientation="bottom"
                        />
                        <YAxis ticks={[0,1,2,3,4,5,6,7,8,9,10]} />
                        <Tooltip  content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
                        <Legend content={<CustomLegend />} />
                        <Area
                          type="monotone"
                           dataKey='sendfailures'
                          name="Send Failures"
                          stroke="#e39c56"
                          fill="#569de3"
                          isAnimationActive={false}
                        />
                        <Area
                          type="monotone"
                          name="Send Retries"
                            dataKey="sendretries"
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

export default RetriesChart;

