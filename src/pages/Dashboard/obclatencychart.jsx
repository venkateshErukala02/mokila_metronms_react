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


const ObcLatencyChart = ({ graphOption, graphOptionValue ,currentTab }) => {
  const [gpItemDt, setGpItemDt] = useState([]);
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

  const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
  const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');

  const repalceItem = (newItem) => {
    setGpItemDt(prev => [...prev.slice(1), newItem])
  }

  const formatChartData = (apiData) => {
    const { timestamps, labels, columns } = apiData;

    return timestamps.map((timestamp, index) => {
      const latency = parseFloat(columns[0].values[index]);
      return {
        timestamp: timestamp,
        Latency: isNaN(latency) ? 0 : latency,
      };
    });
  };



  const getServerStatusDt = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {

       let requestBody = "";
        if(currentTab === 'transcoder'){
            requestBody = JSON.stringify({url:`http://${nodeIpaddress}:8084/obc/api/v1/connectivity/encoderip`, 
                timeout : 5,
            });
        }else if(currentTab === 'trainradio'){
            requestBody = JSON.stringify({url: `http://${nodeIpaddress}:8084/obc/api/v1/connectivity/trainradioip`,
                timeout : 5,
            });
        }

      const options =  graphOption === "live" ?  {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: requestBody,
            }  : {
                  method: "GET",
                  headers: {
                      "Content-Type": "application/json",
                  },
              };

      const response = await fetch(url, options);

      if (response.status === 200) {
        const data = await response.json();
        

        if (graphOption === 'live') {
          let latency = 0;
          let dt = new Date();

          if(currentTab === 'transcoder'){
            latency = data.encoderip || 0;
          }else if(currentTab === 'trainradio'){
            latency = data.trainradioip || 0;
          }

          const dataNew = {
            Latency: latency || 0,
            timestamp: dt.getTime(),
            index: counterRef.current
          }
          repalceItem(dataNew)

          if (counterRef.current > 360) {
            counterRef.current = 1;
          }
          counterRef.current += 1;
        } else {
          const formatted = formatChartData(data);
          setGpItemDt(formatted);
        }
      } else if (response.status === 304) {
      } else if (response.status === 500) {
        throw new Error(`Unexpected serverError: ${response.status}`);
      }
      else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      setIsError({ status: true, msg: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (graphOption === 'live') {
      const defData = []
      for (let i = 0; i <= 360; i++) {
        let arr = { "timestamp": 0, "index": i, "Latency": 0 }
        if (i == 0) {
          arr = { "timestamp": 0, "index": i, "Latency": 0 }
        } else if (i % 12 == 0) {
          arr = { "timestamp": 0, "index": i, "Latency": 0 }
        }
        defData.push(arr);
      }
      setGpItemDt(defData)
    }
    if (graphOption === 'live') {
      const setTime = setInterval(() => {
        const url = 'api/v2/troubleshoot/obc/trainlatency';
        getServerStatusDt(url);
      }, 30000);

      return () => clearInterval(setTime);
    }


  }, [nodeDataId, graphOption]);


  useEffect(() => {
    let url = '';
    if (graphOption === 'live') {
      url = 'api/v2/troubleshoot/obc/trainlatency';
    }
    else {
         if(currentTab === 'transcoder'){
            url =`api/v2/nodes/transcoder/${nodeDataId}?${graphOptionValue}&att=rtt`;
         }else if(currentTab === 'trainradio'){
            url =`api/v2/nodes/suradio/${nodeDataId}?${graphOptionValue}&att=rtt`;
        }
    }
    getServerStatusDt(url);
  }, [graphOption, graphOptionValue]);




  const hourFormat = (graphOption) => {
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
      const valueLat = payload[0]?.value
      const latencyValue = isNaN(valueLat) ? "0.00" : valueLat.toFixed(2);
      const timestamp = payload[0]?.payload?.timestamp;

      return (
        <div className="custom-tooltip">
          <div>{format(new Date(timestamp), 'HH mm') || '0'}</div>
          <div style={{ display: "inline-block", padding: 10 }}>
            <div style={{ color: 'black' }}>
              {payload[0]?.dataKey || "Latency"} : {latencyValue || '0'}
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
              Latency : 0
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
            onMouseEnter={() => console.log('')}
            onMouseLeave={() => console.log('')}
            style={{ color: 'black', cursor: 'pointer' }}
          >
            <span style={{ marginRight: 10, color: '#4fc9e7' }}>●</span> {entry.value} (in ms)
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
            <AreaChart data={gpItemDt}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
              // tickFormatter={(tick) => `${tick}`}
              />
              {/* <YAxis ticks={[0, 1, 2, 3, 4, 5]} /> */}
              <YAxis domain={['auto', 'auto']} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
              <Legend content={<CustomLegend />} />
              <Area
                type="monotone"
                dataKey="Latency"
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

export default ObcLatencyChart;
