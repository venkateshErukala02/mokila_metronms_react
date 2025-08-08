
import { EventSourcePolyfill } from 'event-source-polyfill';
import React, { useState, useEffect,useRef } from "react";
// import { RadialBar, Tooltip, RadialBarChart, Legend, Label } from "recharts";
import { PieChart, Pie, Cell,Legend,Tooltip,Label } from "recharts";
import '../ornms.css';
import { useSelector } from "react-redux";


import '../Dashboard/dashboard.css';
import { useDispatch } from 'react-redux';
import {handleCurrentPie} from '../Action/action'




const GdChart = ({ getDataStatus }) => {
  const [userDatapie, setUserDatapie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const COLORS = [ '#a5d478','#f1553df7'];
   const [activeChart, setActiveChart] = useState(false);

  const getDatapiech = () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });

    try {
      // const eventSource = new EventSource('api/v2//dashboard/nodes/counts_fsummary');

      // eventSource.onmessage = (event) => {
      //   const data = JSON.parse(event.data); // Parse the incoming event data

      //   setUserDatapie(data);
      //   setIsLoading(false);
      //   setIsError({ status: false, msg: "" });
      // };

      const username = 'admin';
      const password = 'admin';
      const encoded = btoa(`${username}:${password}`); // base64 encode

      const eventSource = new EventSourcePolyfill(
        'api/v2//dashboard/nodes/counts_fsummary',
        {
          headers: {
            Authorization: `Basic ${encoded}`,
          },
        }
      );

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setUserDatapie(data);
        setIsLoading(false);
      };
      eventSource.onerror = (error) => {
        console.error('Error occurred with EventSource:', error);
        setIsLoading(false);
        setIsError({ status: true, msg: "Error fetching data" });
        eventSource.close(); // Close the EventSource connection on error
      };

    } catch (error) {
      setIsLoading(false);
      setIsError({ status: true, msg: error.message });
    }
  };


  useEffect(() => {
    getDatapiech();
  }, []);

    const getActValue = (arr) => {
      return arr.reduce((total, item) =>  total +item.value, 0);
    }


    const COLOR_MAP = {
      active: '#a5d478',   // Good - Green
      inactive: '#f1553df7', // Down - Red
    };

  const pieData = Object.keys(userDatapie)
    .map((key, index) => {
      if (key === '') {
        return { name: key, value: 0 };
      } else {
        return { name: key, value: parseInt(userDatapie[key], 10) };
      }
    });
    
  const [activeItems, setActiveItems] = useState({});
  
const legendLabels = {
  active: "Good",
  inactive: "Down",
};
const legendOrder = ["active","inactive"];

useEffect(() => {
  if (pieData.length > 0 && Object.keys(activeItems).length === 0) {
    const initialActiveState = pieData.reduce((acc, item) => {
      acc[item.name] = true;
      return acc;
    }, {});
    setActiveItems(initialActiveState);
  }
}, [pieData]); 

const handleLegendClick = (label) => {
        const originalKey = Object.keys(legendLabels).find((key) => legendLabels[key] === label);
      if (originalKey) {
      setActiveItems((prevState) => ({
        ...prevState,
        [originalKey]: !prevState[originalKey],
      }));
}
};
const visibleData = pieData.filter(item => activeItems[item.name]);


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0];
    const name = entry.name;
    const value = entry.value;

    const displayName = legendLabels[name] || name;

    return (
      <div style={{ backgroundColor: '#222', color: '#fff', padding: '8px', borderRadius: '5px' }}>
        <p style={{ margin: 0 }}><strong>{displayName}: {value}</strong></p>
      </div>
    );
  }

  return null;
};
 
const dispatch = useDispatch();

const getIndividualfullpieData=(value,item)=>{
  dispatch(handleCurrentPie(item))
    setActiveChart(true);
  const valueMap={
    active :"good",
    inactive: "down"
  }
  if (valueMap[item]){
    const mappedValue = valueMap[item];
    console.log('errr',mappedValue)
    getDataStatus(value,mappedValue)
  }
  else if (value === 'fullradial'){
    getDataStatus(item,value)
  }
}

const getClickFullrd=(index,item)=>{
  dispatch(handleCurrentPie(item));
   getDataStatus(index, item);
   setActiveChart(true);
}


const chartContainerRef = useRef(null);

useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      chartContainerRef.current &&
      !chartContainerRef.current.contains(event.target)
    ) {
      setActiveChart(null);
    }
  };

  document.addEventListener("click", handleClickOutside);

  return () => {
    document.removeEventListener("click", handleClickOutside);
  };
}, []);

        const dataName = useSelector((state) => state.piename.piename);

        const getChartClass=()=>{
          if(activeChart && dataName === 'all'){
              return 'active';
           
          }else if(dataName === 'inactive' || dataName ==='active' ){
             return 'active';
          }
          else{
            return '';
          }
          //  return activeChart && dataName === 'all' ? 'active' : '';
        }



return (
  <>
    <div className='clearfix scopecontt' style={{ position: "relative" }} ref={chartContainerRef}>
      {/* <article className={`radialchartcont ${activeChart===true ? "active" : ""}`}  */}
      <article className={`radialchartcont ${getChartClass()}`} 

       onClick={() => getClickFullrd( 'fullradial','all')}
      >

        <PieChart width={279} height={334} className='righttt'>
          <Pie
            data={visibleData}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            innerRadius={60}
            startAngle={90}
            minAngle={2} 
            isAnimationActive={false}
            endAngle={450}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
              const RADIAN = Math.PI / 180;
              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              return value !== 0 ? (
                <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                  {value}
                </text>
              ) : null;
            }}
            labelLine={false}
            stroke='none'
          >
            {visibleData.map((entry, index) => {
              const isActive = activeItems[entry.name];
              return (
                <Cell
                  key={`cell-${index}`}
                  style={{cursor:"pointer"}}
                  // fill={COLORS[index % COLORS.length]}
                  // fill={isActive ?  COLORS[index % COLORS.length] : 'transparent' }
                  fill={isActive ? COLOR_MAP[entry.name] || '#ccc' : 'transparent'}
                  onClick={(e)=> {
                       e.stopPropagation();
                       e.preventDefault();
                    getIndividualfullpieData('fullradial',entry.name)}}  
                />
              );
            })}
            <Label value={getActValue(pieData)} position="center" fill="black" fontSize={16} fontWeight="bold" />
          </Pie>
          <Legend className='legendwrapper2'
           
            payload={
              pieData.slice(0, 4)
                .map((entry, index) => ({
                  value: legendLabels[entry.name] || entry.name,
                  type: 'square',
                  // color: COLORS[index % COLORS.length],
                  color : COLOR_MAP[entry.name] || '#ccc',
                  originalName: entry.name,
                }))
                .sort((a, b) => legendOrder.indexOf(a.originalName) - legendOrder.indexOf(b.originalName)) // Sort based on legendOrder
            }
            onClick={(e) => handleLegendClick(e.value)}
            formatter={(value) => {
              const originalKey = Object.keys(activeItems).find((key) => legendLabels[key] === value) || value;
              return (
                <span
                  style={{
                    textDecoration: activeItems[originalKey] ?  'none' : 'line-through', 
                  }}
                  className='labegood'
                >
                  {value}
                </span>
              );
            }}
          />
          <Tooltip content={<CustomTooltip />} />

        </PieChart>

      
      </article>
    </div>
  </>
)
}

export default GdChart;