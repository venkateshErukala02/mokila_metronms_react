import React, { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';
import TopoSectionTable from "./toposectiontable";
import { text } from "d3";
import StationNodeTable from "./stationNodetableview";
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import {handleStationCircleId} from '../Action/action'


const TopoSvgViewer = ({textName,yardfaclData,setTrainView,setStationView,setTrainLabelDiply,setTrainId}) => {
 const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState("");
  const svgContainerRef = useRef(null);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stationStatus,setStationStatus] = useState([]);
  const [trainData,setTrainData] = useState('')


//   useEffect(() => {
    // const fetchSvg = async (url) => {
    //   try {
    //     const username = "admin";
    //     const password = "admin";
    //     const token = btoa(`${username}:${password}`);

    //     // let url= `http://localhost:3000images/${}.svg`;


    //     const response = await fetch(
    //       url,   
    //         {
    //       method: "GET",
    //       headers: {
    //         "Authorization": `Basic ${token}`,
    //         "Accept": "image/svg+xml"
    //       }
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch SVG");
    //     }

    //     const svgText = await response.text();
    //     setSvgContent(svgText);
    //   } catch (err) {
    //     console.error("SVG fetch error:", err);
    //     setError(err.message);
    //   }
    // };


    const fetchSvg = async (url, signal) => {
        try {
            const username = "admin";
            const password = "admin";
            const token = btoa(`${username}:${password}`);
          const res = await fetch(url, { 
            method: "GET",
            headers: {
              "Authorization": `Basic ${token}`,
              "Accept": "image/svg+xml"
            
          }

          },
            { signal });
          if (!res.ok) throw new Error("Failed to load SVG");
          const svgText = await res.text();
          setSvgContent(svgText);
          
          // Do something with svgText, e.g.:
          // document.getElementById('svg-container').innerHTML = svgText;
      
        } catch (err) {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            console.error('Fetch error:', err); 
          }
        }
      };


  const getStationStatusDt = async () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const url = `api/v2/treeview/station/${textName.data.id}`;
      const username ='admin';
      const password = 'admin';
      const token = btoa(`${username}:${password}`)
        const options = {
            method: "GET",
            headers:{
                'Authorization': `Basic ${token}`,
                'Accept':'application/json'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            setIsLoading(false);
            setStationStatus(data);
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
    }
};

 const getTrainData = async () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const url = `api/v2/treeview/trains/${textName.data.id}`;
      const username ='admin';
      const password = 'admin';
      const token = btoa(`${username}:${password}`)
        const options = {
            method: "GET",
            headers:{
                'Authorization': `Basic ${token}`,
                'Accept':'application/json'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            setIsLoading(false);
            setTrainData(data);
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
    }
};
      

useEffect(() => {
    const controller = new AbortController();
    
    let svg = 'TTC_SubwayMap.svg';

    if (textName != "") {
        if (textName.data.mode == 'region') {
          svg = 'TTC_SubwayMap.svg';
          if (textName.text == 'line1') {
            svg = 'Line1.svg';
          } else if (textName.text == 'line4') {
            svg = 'line4-sec1.svg';
          }
      } else if (textName.data.mode == 'location') {
          svg =  textName.text+'.svg';
      } else if (textName.data.mode == 'facility') {
        svg =  'Station_Line1.svg';
    }else if (textName.data.mode === 'yard'){
      if(textName.text === 'yard_1'){
          svg= 'davisville_track.svg'
      }else{
        svg = textName.data.display+'.svg';
      }
    }
    }

    

    let url = 'images/' + svg;
    setSvgContent('');
    // Call fetchSvg with signal
    fetch(url,controller.signal)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  
  
    // Cleanup on unmount or textName change
    return () => controller.abort();
  }, [textName]);
  
// 2. Fetch API data and update SVG once it's loaded
// useEffect(() => {
//   if (!svgContent) return;

//   // Simulated API call

//   const username = 'admin';
//         const password = 'admin';
//         const token = btoa(`${username}:${password}`)
//         const options = {
//             method: "GET",
//             headers: {
//                 'Authorization': `Basic ${token}`
//             }

//         };
//   let call = "";
//   if (textName.length == 0) {
//     call = "all";
//     textName = {"data":{"mode":"global"}}
//   } else {
//     if(textName.text==="Global"){
//       call = "all";
//     }else{
//       call = textName.text
//     }
//   }
//   if (textName.data.mode != 'facility' && textName.data.type != 'facility') {
//     fetch(`api/v2/dashboard/linestatus/${call}`,options) // Replace with your actual API
//     .then((res) => res.json())
//     .then((response) => {
//       // Example: data = { voughan_metropolitan_centre: "green", union: "red" }
//       const data = response.data;
//       const svgRoot = svgContainerRef.current;

//       data.forEach(({ station, status }) => {
//         const el = svgRoot.querySelector(`#${station}`);
//         if (el && status === "down") {
//           el.setAttribute("fill", "red");
//         } else if (el && status === "up")  {
//           el.setAttribute("fill", "green");
//         }
//       });
//     });
//   } 
//   else {
//     if (textName.data.mode == 'facility')
//       getStationStatusDt();
//   }
  
// }, [svgContent]);


useLayoutEffect(() => {
  if (!svgContent) return;

  const username = 'admin';
  const password = 'admin';
  const token = btoa(`${username}:${password}`);
  const options = {
    method: "GET",
    headers: {
      'Authorization': `Basic ${token}`
    }
  };

  let call = "";
  if (!textName || Object.keys(textName).length === 0) {
    call = "all";
    textName = { data: { mode: "global" } };
  } else {
    call = textName.text === "Global" ? "all" : textName.text;
  }

  if (textName.data.mode !== 'facility' && textName.data.type !== 'facility') {
    fetch(`api/v2/dashboard/linestatus/${call}`, options)
      .then((res) => res.json())
      .then((response) => {
        const data = response.data;
        const svgRoot = svgContainerRef.current;

        if (!svgRoot) return;

        data.forEach(({ station, status }) => {
          const el = svgRoot.querySelector(`#${station}`);
          if (el) {
            el.setAttribute("fill", status === "down" ? "red" : "green");
          }
        });
      });
  } else if (textName.data.mode === 'facility') {
    getStationStatusDt();
    getTrainData();
  }
}, [svgContent]);

const handleTrainClick = (event) => {
  // const tainId = trainData.at
  // setTrainId();
  let trainIcon =  event.target.parentElement
  let trainId = trainIcon.getAttribute('train-id');
 setTrainView(true);
 setTrainId(trainId)
 setStationView(false);
 setTrainLabelDiply(true);
};




useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

  const trainLayer = svgRoot.querySelector('#bottom_train_layer');
  // if (trainLayer) {
  //   // trainLayer.style.display = "none"; // Optional: show hand cursor
  //   // trainLayer.addEventListener('click', handleTrainClick);
  // }

  // // Cleanup to prevent memory leaks
  // return () => {
  //   if (trainLayer) {
  //     trainLayer.removeEventListener('click', handleTrainClick);
  //   }
  // };
}, [svgContent]);

  const dispatch = useDispatch();
useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

        const circles = svgContainerRef.current.querySelectorAll("circle");

        circles.forEach((circle, index) => {
        circle.addEventListener("click", () => {
                      const circleId  = circle.getAttribute('id');
                       const title = circle.querySelector("title")?.textContent || "No Name";

                     dispatch(handleStationCircleId(circleId)); 

        })
      })
  
}, [svgContent]);



const Callfun=(element,vl)=>{
      console.log('hello');
      if (element != undefined) {
        element.style.display = vl;
      }
      
  }


useEffect(() => {
  if (!svgContent || textName.data?.mode === 'facility') {

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;
     
 let svgArray = ['#toptrainclick','#toptrainclick2','#toptrainclicktext','#toptrainclick3',
                  '#bottomtrainclick','#bottomtrainclick1','#bottomtrainclick2','#bottomtrainclick3','#bottomtrainclicktext'
 ]

          svgArray.map((item)=>{
            let bottomClick0 = svgRoot.querySelector(item);
            if (bottomClick0 != null)
              Callfun(bottomClick0,'none');
  })

 

  const el = svgRoot.querySelector(`#section_station_name`);
  if (el) {
    el.textContent = textName.text;
    el.classList.add("svgstationname");
  }
}
}, [textName.text, svgContent]);


useEffect(() => {
  if (!svgContent || textName.data?.mode !== 'yard') return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot || !Array.isArray(yardfaclData)) return;

  yardfaclData.forEach((item) => {
    const el = svgRoot.querySelector(`#${item.radioMode}`);
    if (!el) return;

    if (item.status === "Down") {
      el.setAttribute("fill", "red");
    } else if (item.status === "Up") {
      el.setAttribute("fill", "rgb(102, 204, 51)");
    }
  });
}, [textName.text, svgContent, yardfaclData]);


useLayoutEffect(() => {
  if (!svgContent || !trainData.length) return;

  const svgRoot = svgContainerRef.current;

  let svgTopArray = ['#toptrainclick','#toptrainclick2','#toptrainclicktext','#toptrainclick3']

  let svgBottomArray = ['#bottomtrainclick','#bottomtrainclick1','#bottomtrainclick2','#bottomtrainclick3','#bottomtrainclicktext'
 ]
  
  trainData.forEach((item) => { 
    let trainName = 'Train: '+item.trainId + item.obc;
    if(item.direction==='NBNE'){
      const tnelement = svgRoot.querySelector('#bottomtrainclicktext');
      if (tnelement != null) {
          tnelement.textContent = trainName;
      }

      const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

       if (bottomLayer) {
          bottomLayer.setAttribute('train-id',item.trainId + item.obc);
          bottomLayer.style.cursor = "pointer"; // Optional: show hand cursor
          bottomLayer.addEventListener('click', handleTrainClick);
  }

      if(bottomLayer !== null)
        bottomLayer.style.visibility = 'visible';
          svgBottomArray.map((i)=>{
            let bottomClick0 = svgRoot.querySelector(i);
            if (bottomClick0 != null)
              if (i !== '#bottomtrainclick3')
                Callfun(bottomClick0 ,'block');
            })
    } else if (item.direction==='NBSE' || item.direction==='EB') {
      const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

       if (bottomLayer) {
    bottomLayer.style.cursor = "pointer"; // Optional: show hand cursor
    bottomLayer.addEventListener('click', handleTrainClick);
  }
        const tnelement = svgRoot.querySelector('#bottomtrainclicktext');
        if (tnelement != null) {
            tnelement.textContent = trainName;
        }
        svgBottomArray.map((i)=>{
            let bottomClick0 = svgRoot.querySelector(i);
            if (bottomClick0 != null)
              if (i !== '#bottomtrainclick2')
                Callfun(bottomClick0 ,'block');
            })
    } else if (item.direction==='SBNE') {
      const topLayer = svgRoot.querySelector('#top_train_layer');

       if (topLayer) {
    topLayer.style.cursor = "pointer"; // Optional: show hand cursor
    topLayer.addEventListener('click', handleTrainClick);
  }
      const tnelement = svgRoot.querySelector('#toptrainclicktext');
      if (tnelement != null) {
          tnelement.textContent = trainName;
      }
        svgTopArray.map((i)=>{
            let bottomClick0 = svgRoot.querySelector(i);
            if (bottomClick0 != null)
              if (i !== '#toptrainclick2')
                Callfun(bottomClick0 ,'block');
            })
    } else if (item.direction==='SBSE' || item.direction==='WB' ) {
      const topLayer = svgRoot.querySelector('#top_train_layer');

       if (topLayer) {
    topLayer.style.cursor = "pointer"; // Optional: show hand cursor
    topLayer.addEventListener('click', handleTrainClick);
  }
      const tnelement = svgRoot.querySelector('#toptrainclicktext');
      if (tnelement != null) {
          tnelement.textContent = trainName;
      }
        svgTopArray.map((i)=>{
            let bottomClick0 = svgRoot.querySelector(i);
            if (bottomClick0 != null)
              if (i !== '#toptrainclick3')
                Callfun(bottomClick0 ,'block');
            })
    }
 
  })

}, [trainData,svgContent]);

useEffect(() => {
  if (!svgContent || !stationStatus.length) return;

  const svgRoot = svgContainerRef.current;
  
  stationStatus.forEach((item) => { 
    const el = svgRoot.querySelector(`#${item.position}`);
    const title = svgRoot.querySelector(`#ts-${item.position}`);
        if (item.type !== 'sta') {
          title.textContent = item.ipAddress;
          if (el && item.status ==="down") {
            el.setAttribute("fill", "red");
          } else if (el && item.status ==="up") {
            el.setAttribute("fill", "rgb(102, 204, 51)");
          }
        }
        
  });
}, [stationStatus, svgContent]);

useEffect(() => {
  // Reset stationStatus if the new mode doesn't require it
  if (textName?.data?.mode !== 'facility') {
    setStationStatus([]);  // Clear old data
  }
}, [textName]);


return (
  <>
  <article className="border-allsd" style={{textAlign:'center',paddingTop:'20px',paddingBottom:'20px'}}>
    <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
   </article>
    </>

);
};


export default TopoSvgViewer;
