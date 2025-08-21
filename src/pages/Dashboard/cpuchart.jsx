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


const CpuChart = ({ graphOption,graphOptionValue,currentTab}) => {
  const [cpuData, setCpuData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  //const [counter, setCounter] = useState(1);
  const counterRef = useRef(1);
 const [opacity, setOpacity] = React.useState({
     uv: 1,
     pv: 1,
   });

  const handleMouseEnter = (o) => {
    const { dataKey } = o;

    setOpacity((op) => ({ ...op, [dataKey]: 0.5 }));
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;

    setOpacity((op) => ({ ...op, [dataKey]: 1 }));
  };

  const nodeDataId = useSelector((state) => state.node.node.nodeId) ||localStorage.getItem('nodeId');
  const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');

  const repalceItem = (newItem) => {
    setCpuData(prev=>[...prev.slice(1), newItem])
  }

  const formatChartData = (apiData) => {
    const { timestamps, labels, columns } = apiData;

    return timestamps.map((timestamp, index) => {
      return {
        // timestamp: new Date(timestamp).toLocaleTimeString(), 
        timestamp: timestamp || 0,
        cpu: columns[0].values[index] || 0,
        // [labels[1]]: parseFloat(columns[1].values[index])
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
        
        if (graphOption === 'live') {
             let dt = new Date();
            const dataNew = {
            cpu: data.cpu || 0,
            // lsnr: data.remotesnr,
            timestamp: dt.getTime() || 0,
            index: counterRef.current
          }
          repalceItem(dataNew)

          if (counterRef.current > 360) {
            counterRef.current = 1;
          }
          counterRef.current += 1;
        }else{
           const formatted = formatChartData(data);
          setCpuData(formatted);

           if (formatted.length === 0) {
        const now = new Date();
        const fallbackData = [];
        const interval = 5 * 60 * 1000; // every 5 minutes
        for (let i = 12; i >= 0; i--) {
          fallbackData.push({
            timestamp: now.getTime() - i * interval,
            cpu: 0,
          });
        }
        setCpuData(fallbackData);
      } else {
        setCpuData(formatted);
      }
        }
      } else if (response.status === 304) {
        console.log("304 Not Modified – using cached data.");
      } else {
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
        let arr = { "timestamp": 0, "index": i, "cpu": 0 }
        if (i == 0) {
          arr = { "timestamp": 0, "index": i, "cpu": 0 }
        } else if (i % 12 == 0) {
          arr = { "timestamp": 0, "index": i, "cpu": 0 }
        }
        defData.push(arr);
      }
      setCpuData(defData);


       const setTime =  setInterval(() => {
        // const url = `http://${nodeIpaddress}:8084/transcoder/api/v1/netstats`;
        const url=`http://${nodeIpaddress}:8084/${currentTab}/api/v1/cpu`;
       getServerStatusDt(url);
    }, 5000);
   
    return()=> clearInterval(setTime);
    }else{
      setCpuData([]);
    }
   
  }, [nodeDataId,graphOption]);


    useEffect(() => {
      let url='';
      if(graphOption ==='live'){
        //   url = `http://${nodeIpaddress}:8084/transcoder/api/v1/netstats`;
          url=`http://${nodeIpaddress}:8084/${currentTab}/api/v1/cpu`;
      }
      else{
        url =`rest/measurements/node%5B${nodeDataId}%5D.nodeSnmp%5B%5D?aggregation=AVERAGE&att=cpu&duration=${graphOptionValue}`;
      // url=`rest/measurements/node%5B${nodeDataId}%5D.nodeSnmp%5B%5D?aggregation=AVERAGE&att=tx_errors&duration=${graphOptionValue}`;
      }
      getServerStatusDt(url);
    }, [graphOption,graphOptionValue]);




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


  const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const rawCpu = payload?.[0]?.payload?.cpu;
    const cpuValue = Number(rawCpu);
const countDtt = isNaN(rawCpu) ? '0.00' : cpuValue.toFixed(2);

    // const countDtt = payload[0].payload.cpu.toFixed(2) || 0;
    // console.log('pkpppppp',countDtt);
    
    return (
      <div className="custom-tooltip" style={{color:'black'}}>
        
        <div>{format(new Date(payload[0].payload.timestamp),'HH mm') || 0}</div>
         <div style={{paddingTop:'20px'}}>{payload[0].name} : {countDtt || 0}</div>
        {/* {payload.map((pld) =>{
          const countDTT =  pld?.payload?.cpuDt;
          const countTx = countDTT === 'number' ? parseInt(countDTT) : '0';
        return (
          <div style={{ display: "inline-block", padding: 10 }}>
          <div style={{ color: 'black' }}>
                        {pld.dataKey}: {countTx}
                        </div>
          </div>
        )})} */}
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
        const dotColor = index === 0 ? 'red' : index === 1 ? 'green' : '#4fc9e7';

        return (
          <li
            key={`item-${index}`}
            onMouseEnter={() => console.log("Hover:", entry.value)}
            onMouseLeave={() => console.log("Leave:", entry.value)}
            style={{ color: itemColor, cursor: 'pointer', margin: '0 10px' }}
          >
            <span style={{ marginRight: 5, color: dotColor }}>●</span> {entry.value} (in percentage)
          </li>
        );
      })}
    </ul>
  );
};


  return (
    <>
      <div>
          <article>
            <ResponsiveContainer height={240}>
              <AreaChart data={cpuData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
                  // tickFormatter={(tick) => `${tick}`}
                />
                <YAxis domain={cpuData.length === 0 ? [0, 100] : ['auto', 'auto']} />

                <Tooltip  content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
                {/* <Legend onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} /> */}
                  <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  name="CPU"
                  stroke="rgb(208 116 116)"
                  fill="rgb(208 116 116)"
                  isAnimationActive={false}
                />
                
              </AreaChart>
            </ResponsiveContainer>
          </article>
      </div>

     
    </>
  );
};

export default CpuChart;
