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


const LocalSnr = ({ graphOption, graphOptionValue }) => {
  const [rssiData, setRssiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const counterRef = useRef(1);

  const formatChartData = (apiData) => {
  const { timestamps, labels, columns } = apiData;

  return timestamps.map((timestamp, index) => {
    const val0 = columns[0]?.values[index];
    const val1 = columns[1]?.values[index];
    const val2 = columns[2]?.values[index];

    const hasDecimal = typeof val2 === 'number' && !isNaN(val2) && val2 % 1 !== 0;

    if (hasDecimal) {
      return {
        timestamp: timestamp,
        [labels[0]]: 0,
        [labels[1]]: 0,
        [labels[2]]: 0,
      };
    } else {
      return {
        timestamp: timestamp,
        [labels[0]]: parseFloat(val0) || 0,
        [labels[1]]: parseFloat(val1) || 0,
        [labels[2]]: parseFloat(val2) || 0,
      };
    }
  });
};

   const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
   const stationDataCode = useSelector((state) => state.node.node.productCode) || localStorage.getItem('stationCode');
     const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpAddress');



  const repalceItem = (newItem) => {
    setRssiData(prev => [...prev.slice(1), newItem])
  }


  const getServerStatusDt = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    const dt = new Date();
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
                  rsnr: 0,
                  lsnr: 0,
                  traincab: 0,
                  timestamp: dt.getTime(),
                  index: counterRef.current
                }
               }else{
                dataNew = {
                  rsnr: data.links[0].localsnr,
                  lsnr: data.links[0].remotesnr,
                  traincab: data.links[0].traincab,
                  timestamp: dt.getTime(),
                  index: counterRef.current
                }
              }
             } else {
                dataNew = {
                  rsnr: 0,
                  lsnr: 0,
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
        } else {
      //  const filteredValues = data.columns[2].values.filter(num => typeof num === 'number' && !isNaN(num));

      //   const hasDecimal = filteredValues.some(num => num % 1 !== 0);

      //   if (hasDecimal) {
      //     data = {
      //       rsnr: 0,
      //       lsnr: 0,
      //       traincab: 0,
      //       timestamp: dt.getTime(),
      //       index: counterRef.current
      //     };
      //     const formatted = formatChartData(data);
      //     // setRssiData(formatted || []);
      //     setRssiData(Array.isArray(formatted) ? formatted : []);

      //   }else{
          const formatted = formatChartData(data);
          // setRssiData(formatted || []);
          setRssiData(Array.isArray(formatted) ? formatted : []);

        // }          

        }
        // setRssiData();
      } else if (response.status === 304) {
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
       
          let dataNew = {
            rsnr: 0,
            lsnr: 0,
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


  useEffect(() => {
    if (graphOption === 'live') {
      const defData = []
      for (let i = 0; i <= 360; i++) {
        let arr = { "timestamp": 0, "index": i, "rsnr": 0, "lsnr": 0,"traincab":0 }
        defData.push(arr);
      }
      setRssiData(defData)
    }

    let interval;
    if (graphOption === 'live') {
       const url =
                graphOption === 'live' && stationDataCode === 'TR'
                    ? `api/v2/nodelinks/getRadio/stats?nodeId=${nodeDataId}&deviceType=${stationDataCode}`
                    : `api/v2//nodelinks/constats?nodeId=${nodeDataId}`;

          getServerStatusDt(url);

      interval = setInterval(() => {
        getServerStatusDt(url);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [graphOption, stationDataCode, nodeDataId]);



  useEffect(() => {
    let url = '';
    if (graphOption === 'live') return;
      url =
        stationDataCode === 'TR'
        ?   `rest/measurements/node%5B${nodeDataId}%5D.trainindex%5B1.1%5D?aggregation=AVERAGE&att=lsnr,rsnr&duration=${graphOptionValue}`
      : `rest/measurements/node%5B${nodeDataId}%5D.worpindex%5B1.1%5D?aggregation=AVERAGE&att=lsnr,rsnr,traincab&duration=${graphOptionValue}`;
    
    getServerStatusDt(url);
  }, [graphOptionValue, graphOption, stationDataCode, nodeDataId]);




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
    const txRaw = payload[0]?.payload?.lsnr;
    const rxRaw = payload[1]?.payload?.rsnr;
     const cab = payload[0]?.payload?.traincab || "N/A";
    const timestamp = payload[0]?.payload?.timestamp;

    const snrValue = typeof txRaw === "number" ? parseInt(txRaw) : "0";
    const rsnrValue = typeof rxRaw === "number" ? parseInt(rxRaw) : "0";

    return (
      <div className="custom-tooltip">
        {stationDataCode === 'SN' ?  (<h1 style={{ paddingBottom: '0px',fontSize:'15px' }}>{cab}</h1>) :''}
        <div>{timestamp ? format(new Date(timestamp), 'HH:mm') : 'N/A'}</div>
        <span>SNR</span>

        <ul className="txrxlist">
          <li>LSNR : {snrValue}</li>
          <li>RSNR : {rsnrValue}</li>
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
            <span style={{ marginRight: 5, color: dotColor }}>●</span> {entry.value}
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
          <AreaChart data={rssiData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => format(new Date(timestamp), hourFormat(graphOption))}
              fontFamily="Lato-Regular"
              letterSpacing="0.2px" 
            />
            <YAxis ticks={[0,20,40,60,80]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }}/>
              <Legend content={<CustomLegend />} />
            <Area
              type="monotone"
              name="Local SNR"
              dataKey="rsnr"
              stroke="#f1a5a5"
              fill="#f1a5a5"
              isAnimationActive={false}
            />
            <Area
              type="monotone"
              name="Remote SNR"
              dataKey="lsnr"
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

export default LocalSnr;

