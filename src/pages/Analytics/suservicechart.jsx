import React, { useState,useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend,Label } from 'recharts';
import '../ornms.css';


// data: {"nolink": "0", "active": "4", "inactive": "1", "unprovisioned": "0", "serdown": "0", "serup": "4"}#ef563d

const dataString = '{"nolink": "0", "active": "4", "inactive": "1", "unprovisioned": "0", "serdown": "0", "serup": "4"}';
const dataObject = JSON.parse(dataString);


const SuChart = ({toggleDropdown}) => {

    const [suData, setSuData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
  
    // const getDataSu = () => {
    //   setIsLoading(true);
    //   setIsError({ status: false, msg: "" });
  
    //   try {
    //     const eventSource = new EventSource('api/v2/dashboard/nodes/counts_fsummary');
  
    //     eventSource.onmessage = (event) => {
    //       const data = JSON.parse(event.data); // Parse the incoming event data
  
    //       setSuData(data);
    //       setIsLoading(false);
    //       setIsError({ status: false, msg: "" });
    //     };
  
    //     eventSource.onerror = (error) => {
    //       console.error('Error occurred with EventSource:', error);
    //       setIsLoading(false);
    //       setIsError({ status: true, msg: "Error fetching data" });
    //       eventSource.close(); // Close the EventSource connection on error
    //     };
  
    //   } catch (error) {
    //     setIsLoading(false);
    //     setIsError({ status: true, msg: error.message });
    //   }
    // };


      // useEffect(() => {
      //   getDataSu();
      // }, []);

      const COLORS = ['#ef563d', '#a5d478', '#ef563d', '#00aeef', '#FF5733', '#a5d478'];


      // const pieData = Object.keys(suData).map((key, index) => {
      //   if (key === 'serup') {
      //     return { name: key, value: parseInt(suData[key], 10) };
      //   } else {
      //     return { name: key, value: 0 };
      //   }
      // });
      const legendOrder = ["serdown", "serup","active", "nolink", "inactive", "unprovisioned"]; // Order to display


      const pieData = legendOrder.map((key, index) => {
        const value = dataObject[key] ? parseInt(dataObject[key], 10) : 0; // Ensure each key is considered
        return { name: key, value };
      });
      
      console.log('kkpkpk',pieData);
      

  const [activeItems, setActiveItems] = useState(
    pieData.reduce((acc, item) => {
      acc[item.name] = true;
      return acc;
    }, {})
  );

  const handleLegendClick = (label) => {
    const originalKey = Object.keys(legendLabels).find((key) => legendLabels[key] === label);
    
    if (originalKey) {
      setActiveItems((prevState) => ({
        ...prevState,
        [originalKey]: !prevState[originalKey],
      }));
    }
  };
  

  const legendLabels = {
    serdown: "Service Down",
    serup: "Service Up",
    active: "Good",
    nolink: "No Link",
    inactive: "Down",
    unprovisioned: "Unassigned",
   
  };


  return (
    <div className='clearfix suservcont' style={{position:"relative",width:'308px'}}>
      <h1 className='suservtitle'>SU Service status</h1>
      <PieChart width={279} height={279} className='suchtt'>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          outerRadius={120}
          innerRadius={60}
          startAngle={90}
          endAngle={450}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return value !== 0 ? (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={14} fontWeight="bold">
                  {value}
                </text>
              ) : null;
          }}
          labelLine={false}
          stroke='none'
        >
          {pieData.map((entry, index) => {
            const isActive = activeItems[entry.name];
            return (
              <Cell
                key={`cell-${index}`}
                fill={isActive ?  'white' : COLORS[index % COLORS.length] }
              />
            );
          })}
           {/* <Label value={pieData[inactive]} position="center" fill="black" fontSize={16} fontWeight="bold" /> */}
        </Pie>
        
        <Legend
        wrapperStyle={{ padding: '10px', bottom: '0px', width: '254px', left: '23px',fontFamily:"Lato-Regular",fontSize:'13px',letterSpacing:"0.2px"}}
        payload={
          pieData.filter(entry => entry.name === 'serup' || entry.name === 'serdown')
            .map((entry, index) => ({
              value: legendLabels[entry.name] || entry.name, 
              type: 'square',
              color: COLORS[index % COLORS.length],
              originalName: entry.name, 
            }))
            .sort((a, b) => legendOrder.indexOf(a.originalName) - legendOrder.indexOf(b.originalName)) // Sort based on legendOrder
        }
        onClick={(e) => handleLegendClick(e.value)} 
        formatter={(value) => {
          const originalKey = Object.keys(legendLabels).find((key) => legendLabels[key] === value) || value;
          return (
            <span
              style={{
                textDecoration: activeItems[originalKey] ?  'line-through' : 'none',
              }}
            >
              {value}
            </span>
          );
        }}
        />
        <Tooltip contentStyle={{ backgroundColor: '#222', color: '#fff', borderRadius: '5px'}} itemStyle={{color:"white"}} className="tooltipmag"
        formatter={(value, name) => {
            const customName = legendLabels[name] || name;  
            return [value, customName]; 
          }}
        />
      </PieChart>
    </div>
  );
};

 export default SuChart;

