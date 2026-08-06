import { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';
import TopoSectionTable from "./toposectiontable";
import { text } from "d3";
import StationNodeTable from "./stationNodetableview";
import { useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import {handleStationCircleId} from '../Action/action'
import YardTbone from "./yardonetb";


const TopoSvgViewer = ({textName,yardfacilitieData,setTrainView,setStationView,setTrainLabelDiply,setTrainId,getCircleId,getLineId,setStationTagview,setLineTagview,childrenTextName,parentTextName,getTextId}) => {
 const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState("");
  const svgContainerRef = useRef(null);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stationStatus,setStationStatus] = useState([]);
  const [trainData,setTrainData] = useState('');
  const selectedFileRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const lineIdRef = useRef(null);
    const circleIdRef = useRef(null);  
    const [lineId,setLineId] = useState(null);
    const [circleId,setCircleId] = useState(null);
    const [success, setSuccess] = useState('');
    const [svgVersion, setSvgVersion] = useState(0);
    const [yardData,setYardData] = useState('');

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
        } catch (err) {
          if (err.name === 'AbortError') {
          } else {
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

  const getYardData = async (urlStation) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
        const response = await fetch(urlStation, {
            method: "GET",
            headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            setYardData(data || []);
            //  yardfacilitieDataRef.current=data;
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
};

 const yardTextNameIntervalRef = useRef(null);

useEffect(()=>{
        if (!textName?.data) return;
        setTrainData('');
        if (circleId) return;
        if(textName?.data?.mode !== 'yard') return;
        let intervalId;
        const stationId = textName?.data?.id;
        if (!stationId) return;
        if (stationId === null) return;
        if( childrenTextName.length === 0   ) return;
        if(textName?.data?.mode === 'yard') return;
        if(!stationId  !== 'tagtable') {
        const urlStation= `api/v2/treeview/station/${childrenTextName[0]?.data?.id}`;
        // const urlTrains = `api/v2/treeview/trains/${stationId}`;
         if (yardTextNameIntervalRef.current) {
            clearInterval(yardTextNameIntervalRef.current)
        };
        getYardData(urlStation);
        // getTrainData(urlTrains);

          yardTextNameIntervalRef.current  = setInterval(() => {
            getYardData(urlStation);
            // getTrainData(urlTrains);
        }, 30000);
        }

         return () => {
             if (yardTextNameIntervalRef.current) {
            clearInterval(yardTextNameIntervalRef.current);
            yardTextNameIntervalRef.current = null;
            }
        };

    },[childrenTextName,parentTextName]); 


    useEffect(() => {

  const svgRoot = svgContainerRef.current;
  if (!svgRoot || !Array.isArray(yardData)) return;

  const resetSVGStyles = () => {
    const svgRoot = svgContainerRef.current; 
     const ids = ['FTT1', 'FTT2', 'FTT3'];
   ids.forEach((id) => {
    const rectElement = svgRoot.querySelector(`#${id}`);
    if (rectElement) {
      rectElement.setAttribute('fill', 'red');
      rectElement.setAttribute('stroke', '#231F20');
      rectElement.setAttribute('stroke-width', '0.5');
      rectElement.setAttribute('width', '15');
      rectElement.setAttribute('height', '15');
    }

    const titleElement = svgRoot.querySelector(`#${id} + title`);
    if (titleElement) {
      titleElement.textContent = ''; 
    }
   })
  };

  resetSVGStyles();

  yardData.forEach((yarditem) => {
     const position = yarditem.position;
     if(position === '-'){
      return;
     }
    const el = svgRoot.querySelector(`#${position}`);
    if (el){
    if (yarditem.status === "down") {
      el.setAttribute("fill", "red");
    } else if (yarditem.status === "up") {
      el.setAttribute("fill", "rgb(102, 204, 51)");
    }

      const titleEl = svgRoot.querySelector(`#${position} + title`);
      if (titleEl) {
        titleEl.textContent = `${yarditem.systemName} ${yarditem.ipAddress}`;
      }
      
    const textElements = svgRoot.querySelectorAll('.yardtexsty');
      textElements.forEach((textElement) => {
        textElement.style.fontSize = '20px';  
      });
    }


     return () => {
    resetSVGStyles(); 
  };
     
  });
}, [svgContent, yardData]);


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
        if (textName?.data.mode == 'region') {
          svg = 'TTC_SubwayMap.svg';
          if (textName?.text == 'line1') {
            svg = 'Line1.svg';
          } else if (textName?.text == 'line4') {
            svg = 'line4-sec1.svg';
          }
      } else if (textName?.data.mode == 'location') {
          svg =  textName?.data.display +'.svg';
      } else if (textName?.data.type == 'yard') {
         svg= textName?.data.display +'.svg';
      } else if (textName?.data.type == 'facility'){
        svg =  'Station_Line1.svg';
      }
    }

    

    let url = 'images/' + svg;
    setSvgContent('');
    fetch(url,controller.signal)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  
  
    return () => controller.abort();
  }, [textName]);
 

// useLayoutEffect(() => {
//   if (!svgContent) return;

//   const username = 'admin';
//   const password = 'admin';
//   const token = btoa(`${username}:${password}`);
//   const options = {
//     method: "GET",
//     headers: {
//       'Authorization': `Basic ${token}`
//     }
//   };

//   const fetchStationStatus = () => {
//     let call = "";
//     let currentTextName = textName;

//     if (!currentTextName || Object.keys(currentTextName).length === 0) {
//       call = "all";
//       currentTextName = { data: { mode: "global" } };
//     } else {
//       call = currentTextName.text === "Global" ? "all" : currentTextName.text;
//     }

//     if (
//       currentTextName.data.mode !== 'facility' &&
//       currentTextName.data.type !== 'facility'
//     ) {
//       fetch('api/v2/wayside/stationstatus?time=1800', options)
//         .then((res) => res.json())
//         .then((response) => {
//           const data = response.stations;
//           const svgRoot = svgContainerRef.current;
//           if (!svgRoot) return;

//           data.forEach(({ station, status }) => {
//             const el = svgRoot.querySelector(`#${station}`);
//             if (el) {
//               el.setAttribute("fill", status === "down" ? "red" : "green");
//             }
//           });
//         })
//         .catch();
//     } else if (currentTextName.data.mode === 'facility') {
//       // getStationStatusDt();
//       // getTrainData();
//     }
//   };

//   fetchStationStatus();

//   const interval = setInterval(fetchStationStatus, 30000);

//   return () => clearInterval(interval);
// }, [svgContent]);


const handleTrainClick = (event) => {
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
  //   // trainLayer.style.display = "none";
  //   // trainLayer.addEventListener('click', handleTrainClick);
  // }

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
        const texts = svgRoot.querySelectorAll("text");

        const circleHandlers = [];
        const textHandlers = [];

      circles.forEach((circle) => {
    const handler = () => {
      const circleId = circle.getAttribute("id");
      dispatch(handleStationCircleId(circleId));
      getCurrentId(circleId);
    };

    circle.addEventListener("click", handler);
    circleHandlers.push({ element: circle, handler });
  });

         texts.forEach((text) => {
    const handler = () => {
      const id = text.getAttribute("id");
      handleTextClick(id);
    };

    text.style.cursor = "pointer"; // UX improvement
    text.addEventListener("click", handler);
    textHandlers.push({ element: text, handler });
  });

  return () => {
    circleHandlers.forEach(({ element, handler }) => {
      element.removeEventListener("click", handler);
    });

    textHandlers.forEach(({ element, handler }) => {
      element.removeEventListener("click", handler);
    });
  };
        
}, [svgContent]);




const Callfun=(element,vl)=>{
      if (element != undefined) {
        element.style.display = vl;
      }
      
  }


useEffect(() => {
  if (!svgContent || textName?.data?.mode === 'facility') {

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
}, [textName?.text, svgContent]);


useEffect(() => {

  const svgRoot = svgContainerRef.current;
  if (!svgRoot || !Array.isArray(yardfacilitieData)) return;

  const resetSVGStyles = () => {
    const svgRoot = svgContainerRef.current; 
     const ids = ['FTT1', 'FTT2', 'FTT3'];
   ids.forEach((id) => {
    const rectElement = svgRoot.querySelector(`#${id}`);
    if (rectElement) {
      rectElement.setAttribute('fill', 'red');
      rectElement.setAttribute('stroke', '#231F20');
      rectElement.setAttribute('stroke-width', '0.5');
      rectElement.setAttribute('width', '15');
      rectElement.setAttribute('height', '15');
    }

    const titleElement = svgRoot.querySelector(`#${id} + title`);
    if (titleElement) {
      titleElement.textContent = ''; 
    }
   })
  };

  resetSVGStyles();

  yardfacilitieData.forEach((yarditem) => {
     const position = yarditem.position;
     if(position === '-'){
      return;
     }
    const el = svgRoot.querySelector(`#${position}`);
    if (el){
    if (yarditem.status === "down") {
      el.setAttribute("fill", "red");
    } else if (yarditem.status === "up") {
      el.setAttribute("fill", "rgb(102, 204, 51)");
    }

      let titleEl = svgRoot.querySelector(`#${position} + title`);

      if (!titleEl) {
        titleEl = svgRoot.querySelector(`#${position} > title`);
      }

      if (titleEl) {
        titleEl.textContent = `${yarditem.systemName} ${yarditem.ipAddress}`;
      }
      
    const textElements = svgRoot.querySelectorAll('.yardtexsty');
      textElements.forEach((textElement) => {
        textElement.style.fontSize = '20px';  
      });
    }


     return () => {
    resetSVGStyles(); 
  };
     
  });
}, [textName?.text, svgContent, yardfacilitieData]);


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
          bottomLayer.style.cursor = "pointer"; 
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
    bottomLayer.style.cursor = "pointer"; 
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
    topLayer.style.cursor = "pointer"; 
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
    topLayer.style.cursor = "pointer";
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
  if (textName?.data?.mode !== 'facility') {
    setStationStatus([]); 
  }
}, [textName]);





  // useLayoutEffect(() => {
  //   if (!svgContent) return;
  //   const fetchData = () => {
  //   const username = 'admin';
  //   const password = 'admin';
  //   const token = btoa(`${username}:${password}`);
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       // 'Authorization': `Basic ${token}`
  //     }
  //   };

  //   let currentLine =''

  //   if(textName?.text == 'line1'){
  //       currentLine= 'all'
  //   }else if(textName?.text == 'line4'){
  //       currentLine='line4-sec1'
  //   }else if(textName?.text == 'line1-sec1'){
  //       currentLine='line1-sec1'
  //   }else if(textName?.text == 'line1-sec2'){
  //       currentLine='line1-sec2'
  //   }else{
  //     currentLine= 'all'
  //   }

  //     // fetch(`api/v2/wayside/stationstatus?time=3600`, options)
  //       fetch(`api/v2//dashboard/linestatus/${currentLine}`, options)
  //       .then((res) => res.json())
  //       .then((response) => {
  //       //   const linesData = response.lines;
  //       //   const stationsData = response.stations;
  //       //   const svgRoot = svgContainerRef.current;

  //       //   if (!svgRoot) return;

  //       //   stationsData.forEach(( stationObj ) => {
  //       //      const stationId = Object.keys(stationObj)[0];   
  //       //     const stationStatus = stationObj[stationId];
  //       //     const el = svgRoot.querySelector(`#${stationId}`);
  //       //     if (el) {
  //       //       el.setAttribute("fill", stationStatus === "down" ? "red" : "green");
  //       //     }
  //       //   });

  //       //   linesData.forEach(( lineObj ) => {
  //       //     const lineId = Object.keys(lineObj)[0];     
  //       //     const lineStatus = lineObj[lineId];
  //       //     const el = svgRoot.querySelector(`[id='${lineId}']`);
  //       //     if (el) {
  //       //       el.setAttribute("stroke", lineStatus === "down" ? "red" : "#ffcb09");
  //       //     }
  //       //   });

  //         const data = response;
  //       const svgRoot = svgContainerRef.current;
  //       const circles = svgContainerRef.current.querySelectorAll("circle");
  //       if(svgRoot){
  //         svgRoot.classList.add("special-svg");
        

  //       // circles.forEach((circle, index) => {
  //       // circle.addEventListener("click", () => {
  //       //               const circleId  = circle.getAttribute('id');
  //       //               if(scopeValueSel ==='line1-sec1'){
  //       //                 getCurrentId(scopeValueSel,circleId);
          
  //       //               }else if(scopeValueSel ==='line1-sec2'){
  //       //                 getCurrentId(scopeValueSel,circleId);
          
  //       //               }else{
  //       //                 getCurrentId(scopeValueSel,circleId);
          
  //       //               }
  //       //             });
  //       // });
  //       Object.entries(data).forEach(([station, color]) => {
  //         const el = svgRoot.querySelector(`#${station}`);
  //         if (el) {
  //           el.setAttribute("fill", color);
  //         }
  //       });
  //     }

  //       })
  //       .catch((err) => console.error(err));
  //     }

  //     fetchData();

  // const intervalId = setInterval(fetchData, 30000);

  // return () => clearInterval(intervalId);

  // }, [svgContent,textName]);

   useLayoutEffect(() => {
    if(textName?.data.type == 'facility' ||  textName?.data.type == 'yard' || textName?.data.type == 'Trains' || textName?.data.type == 'mainline' ) return;
    if (!svgContent) return;
    const fetchData = () => {
    const username = 'admin';
    const password = 'admin';
    const token = btoa(`${username}:${password}`);
    const options = {
      method: "GET",
      headers: {
        // 'Authorization': `Basic ${token}`
      }
    };

    let currentLine =''

    if(textName?.data.type == 'location'){
        currentLine= `${textName?.data.display}`
    }else{
      currentLine= 'all';
    }

      // fetch(`api/v2/wayside/stationstatus?time=10`, options)
       fetch(`api/v2//dashboard/linestatus/${currentLine}?time=3600`, options)
        .then((res) => res.json())
        .then((response) => {
          const linesData = response.lines;
          const stationsData = response.stations;
          const svgRoot = svgContainerRef.current;

          if (!svgRoot) return;

          stationsData.forEach(( stationObj ) => {
             const stationId = Object.keys(stationObj)[0];   
            const stationStatus = stationObj[stationId];
            const el = svgRoot.querySelector(`#${stationId}`);
            if (el) {
              el.setAttribute("fill", stationStatus);
            }
          });

          linesData.forEach(( lineObj ) => {
            const lineId = Object.keys(lineObj)[0];     
            const lineStatus = lineObj[lineId];
            const el = svgRoot.querySelector(`[id='${lineId}']`);
            if (el) {
              el.setAttribute("stroke",lineStatus);
            }
          });

        //   const data = response.data;
        // const svgRoot = svgContainerRef.current;
        // const circles = svgContainerRef.current.querySelectorAll("circle");
        // if(svgRoot !== null){
        //   svgRoot.classList.add("special-svg");
        // }

        // circles.forEach((circle, index) => {
        // circle.addEventListener("click", () => {
        //               const circleId  = circle.getAttribute('id');
        //               if(scopeValueSel ==='line1-sec1'){
        //                 getCurrentId(scopeValueSel,circleId);
          
        //               }else if(scopeValueSel ==='line1-sec2'){
        //                 getCurrentId(scopeValueSel,circleId);
          
        //               }else{
        //                 getCurrentId(scopeValueSel,circleId);
          
        //               }
        //             });
        // });
        // data.forEach(({ station, status }) => {
        //   const el = svgRoot.querySelector(`#${station}`);
        //   if (el && status === "down") {
        //     el.setAttribute("fill", "red");
        //   }else if(el && status === "up") {
        //      el.setAttribute("fill", "green");
        //   }
        // });

        })
        .catch((err) => console.error(err));
      }

      fetchData();

  const intervalId = setInterval(fetchData, 30000);

  return () => clearInterval(intervalId);
  
  }, [svgContent,textName]);


    useEffect(() => {
    if (!svgContent) return;
  
    const svgRoot = svgContainerRef.current;
    if (!svgRoot) return;
  
    const clickElements = svgRoot.querySelectorAll("polyline[id], path[id], line[id]");
    svgRoot.classList.add("special-svg");
    
    const handleClick = (event) => {
      if(event.type === 'click' && event.button === 0){
      const clickElement = event.currentTarget;
      const clickElementId = clickElement.getAttribute('id');
      if (clickElementId){
      getCurrentElementId(clickElementId);
        // setLineTagview(true);
        }
      }else if (event.type === 'contextmenu' && event.button === 2) { 
        event.preventDefault(); 
  
         const clickElement = event.currentTarget;
      const id = clickElement.getAttribute('id');
        setLineId(id);
        lineIdRef.current = id;
        const existingMenu = document.querySelector(".custom-context-menu");
        if (existingMenu) {
          existingMenu.remove();
        }
  
        const textElement = event.currentTarget;
  
        const menu = document.createElement("div");
        menu.className = "custom-context-menu";
        menu.style.position = "absolute";
        menu.style.left = `${event.pageX + 5}px`; 
        menu.style.top = `${event.pageY + 5}px`;
        menu.style.backgroundColor = "white";
        menu.style.border = "1px solid #ccc";
        menu.style.padding = "10px";
        menu.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        menu.style.zIndex = "9999999";
  
        menu.innerHTML = `
          <h1 class='taguploadtitle'>Upload Tag Layout (.png)</h1>
             <article class="regioncont">
                              <label htmlFor="" class="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                              <div class="filename-display-wayside" id='filename-display'>
                              No file selected
                              </div>
                              <input
                                  class="dislineinputcl"
                                  type="file"
                                  onChange={handleFileChange}
                                  id="hiddenFileInput"
                                  style='width: 200px;display:none'
                              />
                              <button onClick='document.getElementById("hiddenFileInput").click()' class="attachcl">
                                  <i class="fa-solid fa-paperclip"></i></button>
                              <button id ='uploadBtn' class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                              
                          </article>
           <button class='tagupload-closebtn' id="context-close-btn">Close</button>
        `;
  
        document.body.appendChild(menu);
        document.getElementById('uploadBtn').addEventListener("click",(e)=> {handleUpload(e)});
        document.getElementById('hiddenFileInput').addEventListener('change', (e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                selectedFileRef.current = file;
                 const display = document.getElementById('filename-display');
                display.textContent = file.name;
              } else {
                setSelectedFile(null);
                selectedFileRef.current = null;
                 const display = document.getElementById('filename-display');
                 display.textContent = 'No file selected';
              }
            });
         document.getElementById('hiddenFileInput').classList.add('dislineinputcl');
        
       
  
        const closeBtn = document.getElementById("context-close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            menu.remove(); 
          });
        }
  
        menu.addEventListener("mousedown", (e) => {
          e.stopPropagation(); 
        });
  
        const closeMenu = (e) => {
          if (!menu.contains(e.target)) {
          menu.remove();
          document.removeEventListener("mousedown", closeMenu);
          }
        };
        document.addEventListener("mousedown", closeMenu);
      }
    };
  
    clickElements.forEach((clickElement) => {
      clickElement.addEventListener("click", handleClick);
      clickElement.addEventListener("contextmenu", handleClick);
    });
  
    return () => {
      clickElements.forEach((clickElement) => {
      clickElement.removeEventListener("click", handleClick);
        clickElement.removeEventListener("contextmenu", handleClick);
      });
    };
  }, [svgContent]);
  
  
  useEffect(() => {
    if (!svgContent) return;
  
    const svgRoot = svgContainerRef.current;
    if (!svgRoot) return;
  
    svgRoot.classList.add("special-svg");
  
    const circles = svgRoot.querySelectorAll("circle[id], ellipse[id]");
    const texts = svgRoot.querySelectorAll("text[id]");
  
    const handleCircleClick = (event) => {
      if (event.type ==='click' &&  event.button === 0) { //Left-click
        const circle = event.currentTarget;
        const circleId = circle.getAttribute("id");
  
        texts.forEach((text) => {
          const s = text.id.replace("_txt", "");
          if (s === circleId) {
            // getCurrentId(circleId);
           setStationTagview?.(true);
          }
        });
      } else if (event.type === 'contextmenu' && event.button === 2) { 
        event.preventDefault(); 
  
         const circle = event.currentTarget;
        const id = circle.getAttribute("id");
        setCircleId(id);
        circleIdRef.current = id;
  
        const existingMenu = document.querySelector(".custom-context-menu");
        if (existingMenu) {
          existingMenu.remove();
        }
  
        const textElement = event.currentTarget;
  
        const menu = document.createElement("div");
        menu.className = "custom-context-menu";
        menu.style.position = "absolute";
        menu.style.left = `${event.pageX + 5}px`; 
        menu.style.top = `${event.pageY + 5}px`;
        menu.style.backgroundColor = "white";
        menu.style.border = "1px solid #ccc";
        menu.style.padding = "10px";
        menu.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
        menu.style.zIndex = "9999999";
  
        menu.innerHTML = `
          <h1 class='taguploadtitle'>Upload Tag Layout (.png)</h1>
             <article class="regioncont">
                              <label htmlFor="" class="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                              <div class="filename-display-wayside" id='filename-display'>
                              No file selected
                              </div>
                              <input
                                  class="dislineinputcl"
                                  type="file"
                                  onChange={handleFileChange}
                                  id="hiddenFileInput"
                                  style='width: 200px;display:none'
                              />
                              <button onClick='document.getElementById("hiddenFileInput").click()' class="attachcl">
                                  <i class="fa-solid fa-paperclip"></i></button>
                              <button id ='uploadBtn' class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                              
                          </article>
           <button class='tagupload-closebtn' id="context-close-btn">Close</button>
        `;
  
        document.body.appendChild(menu);
        document.getElementById('uploadBtn').addEventListener("click",(e)=> {handleUpload(e)});
        document.getElementById('hiddenFileInput').addEventListener('change', (e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                selectedFileRef.current = file;
                 const display = document.getElementById('filename-display');
                display.textContent = file.name;
              } else {
                setSelectedFile(null);
                selectedFileRef.current = null;
                 const display = document.getElementById('filename-display');
                 display.textContent = 'No file selected';
              }
            });
         document.getElementById('hiddenFileInput').classList.add('dislineinputcl');
        
       
  
        const closeBtn = document.getElementById("context-close-btn");
        if (closeBtn) {
          closeBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            menu.remove(); 
          });
        }
  
        menu.addEventListener("mousedown", (e) => {
          e.stopPropagation(); 
        });
  
        const closeMenu = (e) => {
          if (!menu.contains(e.target)) {
            menu.remove();
            document.removeEventListener("mousedown", closeMenu);
          }
        };
        document.addEventListener("mousedown", closeMenu);
      }
    };
  
    circles.forEach((circle) => {
      circle.addEventListener("click", handleCircleClick);
      circle.addEventListener("contextmenu", handleCircleClick);
    });
  
    return () => {
      circles.forEach((circle) => {
        circle.removeEventListener("click", handleCircleClick);
        circle.removeEventListener("contextmenu", handleCircleClick);
      });
  
      const existingMenu = document.querySelector(".custom-context-menu");
      if (existingMenu) existingMenu.remove();
      
    };
  }, [svgContent]);
  
  const handleUpload = async (e) => {
          e.preventDefault();
          if (!selectedFileRef.current) {
              alert("Please select a file first.");
              return;
          }
  
          const idToUse = circleIdRef.current || lineIdRef.current;  
  
            if (!idToUse) {
              alert("No station selected!");
              return;
            }
                      
          setIsLoading(true);
          setIsError('');
          setSuccess('');
          
      
          const formData = new FormData();
          formData.append('upfile', selectedFile); 
      
          try {
              const username = 'admin';
              const password = 'admin';
              const token = btoa(`${username}:${password}`)
              const response = await fetch(`api/v2/wayside/uploadstaionimg/${idToUse}`, {
                  method: "POST",
                  headers: {
                      'Authorization': `Basic ${token}`
                  },
                  body: formData, 
              });
      
              if (response.ok) {
                  setSuccess('Discovery started successfully');
                  // alert('Discovery started successfully')
  
                  setSelectedFile(null);
              } else {
                  const errText = await response.text();
                  setIsError(`Error starting discovery: ${errText}`);
              }
          } catch (error) {
              setIsError('An error occurred while contacting the server.');
          } finally {
              setIsLoading(false);
          }
      };
  
         const getCurrentId=(id)=>{
          // setCircleId(id)
          getCircleId(id)
        }
  
        const getCurrentElementId=(id)=>{
          getLineId(id)
        }
  
  
        const handleTextClick=(id)=>{
          getTextId(id)
        }


return (
  <>
  <article className="" style={{textAlign:'center',paddingTop:'0px',paddingBottom:'0px'}}>
    <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
   </article>
   {/* <article>
    {textName?.data?.mode === 'yard' && <YardTbone yardData={yardData} yardfacilitieData={yardfacilitieData} textName={textName}/> }
    </article> */}
    </>

);
};


export default TopoSvgViewer;
