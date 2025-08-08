import React, { useState, useEffect,useRef } from "react";
import logo from '../../assets/img/keywestlogo.png'
// import { RadialBar, Tooltip, RadialBarChart } from "recharts";
import { PieChart, Pie, Cell, Legend, Tooltip, Label } from "recharts";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import {handleCurrentPie,clearPiename} from '../Action/action'
import '../Dashboard/dashboard.css';
import { useLocation } from 'react-router-dom';


const BsChart = ({ getDataStatus }) => {

  const [userData, setUserData] = useState({});
   const [activeChart, setActiveChart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });

  // const getHandleData=(value)=>{
  //   console.log('check',value);

  // }

  const getData = async () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const username = 'admin';
      const password = 'admin';
      const token = btoa(`${username}:${password}`);
      const url = 'api/v2/dashboard/networkstatus?filter=productCode&ar=';

      const options = {
        method: "GET",
        headers: {
          'Authorization': `Basic ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch(url, options);
      const data = await response.json();
      // console.log('newdata',data)
      if (response.ok) {
        setIsLoading(false);
        setUserData(data);
        setIsError({ status: false, msg: "" });
      } else {
        throw new Error("data not found");
      }
    } catch (error) {
      setIsLoading(false);
      setIsError({ status: true, msg: error.message });
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const extractValues = (obj) =>
    Object.entries(obj)
      .filter(([key]) => key !== "total")  // Exclude 'total'
      .map(([key, value]) => ({
        name: key,
        down: value.down,
        up: value.up,
        actualValue: value.down + value.up
      }));

  // const customOrder = ['ap', 'transcoder', 'cam', 'sta', 'encoder'];


  // const staArray = userData.sta ? extractValues(userData).sort((a, b) => {
  //   return customOrder.indexOf(a.name) - customOrder.indexOf(b.name);
  // }) : [];

  // const hasItem = (name) => staArray.some(item => item.name === name);

  // if (!hasItem('transcoder') && userData.transcoder === '') {
  //   staArray.splice(1, 0, {
  //     name:'transcoder',
  //     down: 0,
  //     up: 0,
  //   });

  // }

  // if (!hasItem('cam')) {
  //   staArray.splice(2, 0, {
  //     name:'cam',
  //     down: 0,
  //     up: 0
  //   });
  // }

  // if (!hasItem('obc')) {
  //   staArray.splice(3, 0, {
  //     name:'obc',
  //     down: 0,
  //    up: 0
  //   });
  // }

  // if (!hasItem('ioc')) {
  //   staArray.splice(6, 0, {
  //     name: "IOC",
  //     down: 0,
  //     up: 0
  //   });

  // }

  // if (!hasItem('ptmp')) {
  //   staArray.splice(7, 0, {
  //     name:'ptmp',
  //     down: 0,
  //      up: 0
  //   });  
  // }

  const staArrayRaw = userData.sta ? extractValues(userData) : [];

// Add missing items first
const hasItem = (name) => staArrayRaw.some(item => item.name === name);

if (!hasItem('transcoder')) {
  staArrayRaw.push({ name: 'transcoder', down: 0, up: 0 });
}

if (!hasItem('cam')) {
  staArrayRaw.push({ name: 'cam', down: 0, up: 0 });
}

if (!hasItem('obc')) {
  staArrayRaw.push({ name: 'obc', down: 0, up: 0 });
}

if (!hasItem('encoder')) {
  staArrayRaw.push({ name: 'encoder', down: 0, up: 0 });
}

if (!hasItem('ioc')) {
  staArrayRaw.push({ name: 'ioc', down: 0, up: 0 });
}

// if (!hasItem('ptmp')) {
//   staArrayRaw.push({ name: 'ptmp', down: 0, up: 0 });
// }

// Now apply sorting based on customOrder
const customOrder = ['ap', 'transcoder', 'cam', 'obc', 'sta', 'encoder','ioc'];
const staArray = staArrayRaw.sort((a, b) => {
  const indexA = customOrder.indexOf(a.name);
  const indexB = customOrder.indexOf(b.name);

  // Items not in customOrder go to the end
  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

  
 


  console.log('paiooia',staArray);


  const CustomTooltip = ({ active, payload,data }) => {
    if (active && payload && payload.length) {
      if (data[0].actualValue === 0) {
        return (
          <div className="custooltipbg">
            <p className="dowvla">{`Down: 0, Up: 0`}</p>
          </div>
        );
      }
  
      const downValue = payload.find(p => p.name === 'Down')?.value || 0;
      const upValue = payload.find(p => p.name === 'Up')?.value || 0;
  
      return (
        <div className="custooltipbg">
          <p className="dowvla">{`Down: ${downValue}, Up: ${upValue}`}</p>
        </div>
      );
    }
  
    return null;
  };

  
  // const CustomTooltip=()=>{
    
  // }

  
  
  

  const getRadialColor = (value, type) => {
    console.log('wsdfg', value)
    if (value.down !== null) {
      return value.down > 0 ? 'rgb(243 90 67)' : 'gray';
    } else if (value.up !== null) {
      return value.up > 0 ? 'rgb(165 213 125)' : 'gray';
    }
    return 'black';
  };

  const getClick = (index, item) => {
    dispatch(handleCurrentPie(index)); 
    console.log('iidd', index);
    console.log('lplplp', item)

    getDataStatus(index, item);
    setActiveChart(index);
   

  }



  const renderHeadname=(value)=>{
    switch (value) {
      case 'ap':
        return 'Station Nodes';
      case "transcoder":
        return 'Ip Transcoders  ';
      case "cam":
        return 'Ip Cameras';
      case "sta":
        return 'Train Radio';
      case "encoder":
        return 'Encoders';
      case "obc":
          return 'OBC';
      case "ioc":
         return 'IO Contoller';
      default:
        return '';
    }
  }

   const dispatch = useDispatch();

  const getIndividualhalfpieData=(item,entry)=>{
      dispatch(handleCurrentPie(item))
      let titleName = item;
        let titleStatus = entry;
      getDataStatus(titleName,titleStatus);
      // setIsActive(!isActive);
      setActiveChart(titleName);
   
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

//  const count = useSelector((state) => state);
  // const isVisible = useSelector((state) => state.visibility.isVisible);
  // const [currentTab,setCurrentTab] = useState('summary')
        // const [nodeItemDt, setNodeItemDt] = useState([]);


 
       
        const dataName = useSelector((state) => state.piename.piename);
         console.log('lplppplplplplppleeeeeeeeeeeee',dataName);
        const getChartClass=(item)=>{
          // if(item ===dataName){
          //   return 'active';
          // }else{
          //   return '';
          // }
           return item === dataName ? 'active' : '';
        }


        const location = useLocation();

      useEffect(() => {
          dispatch(clearPiename());
        }, [location.pathname]);
        


  return (
    <>
    <article ref={chartContainerRef}>
      <article className="container-fluid">
        <article className="row">

          {staArray.map((item, index) => {
            const isEmpty = item.up === 0 && item.down === 0;
            const actualValue = item.up+ item.down;
            const data = isEmpty ?[
              { name: "Up", value: 1, fill: "#e0e0e0",title: item.name,actualValue: actualValue } ,
              { name: "Down", value: item.down, fill: "#e0e0e0",title: item.name,actualValue: actualValue  } 
            ]:
              [
                { name: "Up", value: item.up, fill: "#90ee90",title: item.name,actualValue: actualValue  },
                { name: "Down", value: item.down, fill: "#f35a43",title:item.name,actualValue: actualValue  }
              ];

            return (
              <div
                key={`sta-${index}`}
                // className={`col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bsucont ${activeChart === item.name ? "active" : ""}`}
                 className={`col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bsucont ${getChartClass(item.name)}`}
                onClick={() => getClick( item.name,'all')}
              >
                <h3 className="radialheading">{renderHeadname(item.name)}</h3>

                <PieChart width={300} height={158}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="35%"
                    cy="85%"
                    startAngle={180}
                    isAnimationActive={false}
                    endAngle={0}
                    minAngle={2} 
                    innerRadius={44}
                    outerRadius={87}
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
                      const RADIAN = Math.PI / 180;
                      const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                      const x = cx + radius * Math.cos(-midAngle * RADIAN);
                      const y = cy + radius * Math.sin(-midAngle * RADIAN);
                      return value !== 0 ? (
                        <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="500">
                          {data[0].actualValue === 0 ? 0 : value}
                        </text>
                      ) : null;
                    }}
                    labelLine={false}
                    stroke='none'
                    activeShape={false}
                  >
                    {data.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.fill} style={{cursor:"pointer"}}
                      
                      onClick={(e)=> {
                        //  e.stopPropagation();
                          e.stopPropagation();
                         e.preventDefault();
                         setActiveChart(entry.title)
                        getIndividualhalfpieData(entry.title,entry.name.toLowerCase())}}  
                      />
                    ))}
                    {/* <Label
                      // value={item.actualValue}
                      value={item.actualValue === 0 ? 0 : item.actualValue}
                      position="center"
                      style={{ fill: "#000", fontSize: 15 }}
                    /> */}
                    <Label
                      value={(item.up === 0 && item.down === 0) ? 0 : item.actualValue}
                      position="center"
                      style={{ fill: "#000", fontSize: 15 }}
                    />

                  </Pie>
                  {data[0].actualValue === 0 ? <Tooltip content={<CustomTooltip data={data} />} /> : <Tooltip/>}
                </PieChart>
              </div>
            );
          })}

        </article>
      </article>
    </article>
    </>
  );
};

export default BsChart;
