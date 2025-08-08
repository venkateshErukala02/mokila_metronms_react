import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, Label } from 'recharts';

const COLORS = [ '#f8d347','#a5d478', '#ef563d', '#00aeef', '#FF5733', '#C70039'];

const GdChart = ({ toggleDropdown, Dataget }) => {
  const [userDatapie, setUserDatapie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  // const getDatapiech = () => {
  //   setIsLoading(true);
  //   setIsError({ status: false, msg: "" });

  //   try {
  //     const eventSource = new EventSource('/skypoint/api/v2/dashboard/nodes/counts_fsummary');

  //     eventSource.onmessage = (event) => {
  //       const data = JSON.parse(event.data); // Parse the incoming event data

  //       setUserDatapie(data);
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


  const getDatapiech = () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
  
    const username = 'admin';
    const password = 'admin';
    const encodedCredentials = btoa(`${username}:${password}`); // Base64 encode the username and password
  
    try {
      // Create the EventSource with the correct URL
      const eventSource = new EventSource(
        `http://localhost:8980/ornms/api/v2/dashboard/nodes/counts_fsummary`
      );
  
      // Set up the Authorization header manually
      eventSource.headers = {
        Authorization: `Basic ${encodedCredentials}`,
      };
  
      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data); // Parse the incoming event data
        setUserDatapie(data);
        setIsLoading(false);
        setIsError({ status: false, msg: "" });
      };
  
      eventSource.onerror = (error) => {
        console.error('Error occurred with EventSource:', error);
        if (eventSource.readyState === EventSource.CLOSED) {
          // Try reconnecting after some time
          setTimeout(() => {
            getDatapiech(); // Retry the connection
          }, 5000); // Reconnect after 5 seconds
        }
      };
    } catch (error) {
      setIsLoading(false);
      setIsError({ status: true, msg: error.message });
    }
  };
  
  

  useEffect(() => {
    getDatapiech();
  }, []);

  const pieData = Object.keys(userDatapie).map((key, index) => {
    if (key === '') {
      return { name: key, value: 0 };
    } else {
      return { name: key, value: parseInt(userDatapie[key], 10) };
    }
  });

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
    active: "Good",
    nolink: "No Link",
    inactive: "Down",
    unprovisioned: "Unassigned",
    serdown: "Service Down",
    serup: "Service Up",
  };

  const legendOrder = ["active", "nolink", "inactive", "unprovisioned", "serdown", "serup"];

  return (
    <div className='clearfix scopecontt' style={{ position: "relative" }}>
      <article className='clearfix scpbg'>
        <ul className='clearfix scoplistdropdw'>
          <li><p style={{ display: 'inline-block' }}>Scope :</p> <span onClick={toggleDropdown}>Global <span className="fa fa-chevron-down highlightText v-align-tt iconsy"></span></span></li>
          <li><p>Regions  : <strong style={{ color: '#006fff' }}>2</strong></p></li>
        </ul>
      </article>
      <PieChart width={279} height={334} className='righttt'>
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
                // fill={COLORS[index % COLORS.length]}
                fill={isActive ?  'white' : COLORS[index % COLORS.length] }

              />
            );
          })}
          <Label value={`${userDatapie.inactive}`} position="center" fill="black" fontSize={16} fontWeight="bold" />
        </Pie>

        <Legend
          wrapperStyle={{ padding: '10px', bottom: '0px', width: '331px', left: '0px', fontFamily: "Lato-Regular", paddingTop: '0', fontSize: '15px', letterSpacing: '0.5px' }}
          payload={
            pieData.slice(0, 4)
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
                  textDecoration: activeItems[originalKey] ? 'line-through' :'none',
                }}
              >
                {value}
              </span>
            );
          }}
        />
        <Tooltip contentStyle={{ backgroundColor: '#222', color: '#fff', borderRadius: '5px' }} itemStyle={{ color: "white" }} className="tooltipmag" />
      </PieChart>
    </div>
  );
};

export default GdChart;
