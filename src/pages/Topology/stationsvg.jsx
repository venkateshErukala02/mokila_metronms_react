import { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'
import { useSelector } from "react-redux";
 

const StationSvg = ({ textName, setTrainView, setStationView,setStationTagview, setTrainLabelDiply, setTrainId ,rdDataRef,trainView,trainId,stationNode,goToStationView,yardfacilitieData,yardfacilitieDataRef,trainData,trainDataRef ,stationIdFromSvg ,parentTextName,childrenTextName,lineName }) => {
    // const [trainData, setTrainData] = useState('')
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const stationStatusRef = useRef(null);
    const [manualTitle, setManualTitle] = useState(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0]?.tags] ;
    const rdDataTitle = rdDataRef.current === null ? [] : [rdDataRef.current[0]?.station] ;
    const stationNameDt =  useSelector((state) => state)
    const stationName =  useSelector((state) => state?.selectedPrevNode?.node?.lineName);
    // console.log('lpllpllp',stationNameDt);

   const effectiveTextName = textName && Object.keys(textName).length > 0
                        ? textName
                        : stationNode;


useEffect(() => {
  if (!stationNode) return;
  if (!textName?.data) {
    goToStationView(stationNode);
  }
}, [stationNode]);

// const resetTrainLayers = (svgRoot) => {
//   const selectors = [
//     '#top_train_layer',
//     '#bottom_train_layer',
//     '#toptrainclick',
//     '#toptrainclick2',
//     '#toptrainclick3',
//     '#toptrainclicktext',
//     '#bottomtrainclick',
//     '#bottomtrainclick1',
//     '#bottomtrainclick2',
//     '#bottomtrainclick3',
//     '#bottomtrainclicktext'
//   ];

//   selectors.forEach(sel => {
//     const el = svgRoot.querySelector(sel);
//     if (!el) return;

//     el.style.display = 'none';
//     el.style.visibility = 'hidden';
//     el.removeAttribute('train-id');
//   });
// };




// useEffect(() => {
//   if (textName?.text) {
//     setManualTitle(textName.text);

//     // clear rdData so it does not overwrite title
//     rdDataRef.current = null;
//   }
// }, [textName?.text]);


// useEffect(() => {
//   if (rdDataRef.current) {
//     setManualTitle(null);
//   }
// }, [rdDataTitle]);

// useLayoutEffect(() => {
//   if (!svgContent) return;

//   const svgRoot = svgContainerRef.current;
//   if (!svgRoot) return;

//   const titleElement = svgRoot.querySelector('#section_station_name');
//   if (!titleElement) return;

//   titleElement.textContent = manualTitle ?? rdDataTitle ?? '';
//   titleElement.classList.add("svgstationname");

// }, [svgContent, manualTitle, rdDataTitle]);



    const getTrainData = async () => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const url = `api/v2/treeview/trains/${textName.data.id}`;
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                // setTrainData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };


    const getStationStatusDt = async () => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const url = `api/v2/treeview/station/${textName.data.id}`;
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setStationStatus(data);
                stationStatusRef.current=data;       
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
        // getTrainData();
        // getStationStatusDt();

        const intervalId = setInterval(() => {
            // getTrainData();
            // getStationStatusDt();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [svgContent])

    useEffect(() => {
        if (textName?.data?.mode !== 'facility') {
            setStationStatus([]);
        }
    }, [textName]);



    // useLayoutEffect(() => {
    //     if (!svgContent) return;

    //     const svgRoot = svgContainerRef.current;

    //     const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"],[id^="TC"],[id^="C"]');

    //         allElements.forEach(el => {
    //             el.style.fill = "#FFFFFF";
    //         });

    //        const resetSVGNodeElements = () => {
    //         const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"]');

    //          allElements.forEach(el => {
    //                 el.style.fill = '#ffffff';
    //             });

    //         //  allElements.forEach(el => {
    //         //     el.style.fill = yardfacilitieData?.length === 0 ? '#ffffff' : '';
    //         // });
    //         const titleElement = svgRoot.querySelector('#section_station_name');
    //             if(titleElement){
    //                 titleElement.textContent = rdDataTitle;
    //             }
    //     };

    //     resetSVGNodeElements();


    //    if(yardfacilitieData?.length > 0){

    //     //     resetSVGNodeElements();
    //     // }else{
    //         // ref
    //      yardfacilitieDataRef?.current?.forEach((item) => { 
    //         let tt = item.position?.toLowerCase() + 'text'; 
    //         let posttext = svgRoot.querySelector(`#${tt}`);
    //         if (item.type === 'sta' || item.type === 'obc' || item.type === 'ioc' ){
    //             return;
    //         }
    //      const el = svgRoot.querySelector(`#${item.position}`);
    //         const title = svgRoot.querySelector(`#ts-${item.position}`);
    //             if (item.type !== 'sta' ) {
    //                  if (posttext) {
    //                     if (item.type=='transcoder') {
    //                         posttext.firstChild.nodeValue = 'T';
    //                     } else if (item.type=='encoder') {
    //                         posttext.firstChild.nodeValue = 'E';
    //                     }
    //                 }
    //                 if (title) {
    //                         title.textContent = item.ipAddress;
    //                     } else {
    //                         console.log(`Element with id ts-${item.position} not found`);
    //                     }
    //                 // title.textContent = item.ipAddress;
    //             if (el) {
    //                if (item.status === "down") {
    //                     el.style.fill = "red";
    //                 } else if (item.status === "up") {
    //                     el.style.fill = "rgb(102, 204, 51)";
    //                 }
    //                 // else{
    //                 //     el.style.fill = "";
    //                 // }
    //                 }
    //             }
                
    //     });
    // }
    // }, [yardfacilitieData, svgContent,yardfacilitieDataRef]);






    const Callfun = (element, vl) => {
        if (element != undefined) {
            element.style.display = vl;
        }

    }

    // useEffect(() => {
    //     if (!svgContent || textName?.data?.mode === 'facility' || !!lineName) {

    //         const svgRoot = svgContainerRef.current;
    //         if (!svgRoot) return;

    //         let svgArray = ['#toptrainclick', '#toptrainclick2', '#toptrainclicktext', '#toptrainclick3',
    //             '#bottomtrainclick', '#bottomtrainclick1', '#bottomtrainclick2', '#bottomtrainclick3', '#bottomtrainclicktext'
    //         ]

    //         svgArray.map((item) => {
    //             let bottomClick0 = svgRoot.querySelector(item);
    //             if (bottomClick0 != null)
    //                 Callfun(bottomClick0, 'none');
    //         })



    //         const el = svgRoot.querySelector(`#section_station_name`);
    //         if (el) {
    //             el.textContent = rdDataTitle;
    //             el.classList.add("svgstationname");
    //         }
    //     }
    // }, [textName?.text, svgContent,lineName]);

//     useEffect(() => {
//         if(lineName) return
//     const controller = new AbortController();

//     let svg = "";

//     if (textName !== "") {
//         const lineNa =
//             parentTextName?.data?.display || textName?.data?.mode;

//         if (!lineNa) return;

//         if (lineNa === "line1-sec1" || lineNa === "line1-sec2" || parentTextName?.data?.display == 'line1' || parentTextName?.data?.display == 'line2' || childrenTextName?.data?.display == 'line1-sec1' || childrenTextName?.data?.display == 'line1-sec2' || textName?.data?.mode === 'line1-sec1' || textName?.data?.mode === 'line1-sec2' ) {
//             svg = "Station_Line1.svg";
//         } else if (lineNa === "line4-sec1"  || parentTextName?.data?.display == 'line4' || childrenTextName?.data?.display == 'line4-sec1'
//             || textName?.data?.mode === 'line4-sec1'
//         ) {
//             svg = "Station_Line4.svg";
//         } else {
//             return;
//         }
//     } 
//     else {
        
//     }

//     setSvgContent("");

//     fetch(`images/${svg}`, {
//         signal: controller.signal,
//     })
//         .then((res) => res.text())
//         .then((data) => setSvgContent(data));

//     return () => controller.abort();
// }, [textName, lineName, parentTextName]);

useEffect(() => {
    const controller = new AbortController();

    let svg = "";

    // if (textName !== "" || textName =='') {
        const lineNa = lineName || stationName || parentTextName?.data?.display || textName?.data?.mode;;

        if (!lineNa) return;

        if (lineNa === "line1-sec1" || lineNa === "line1-sec2") {
            svg = "Station_Line1.svg";
        } else if (lineNa === "line4-sec1") {
            svg = "Station_Line4.svg";
        } else {
            return;
        }
    // } else {
       
    // }

    setSvgContent("");

    fetch(`images/${svg}`, {
        signal: controller.signal,
    })
        .then((res) => res.text())
    .then((data) => {
        if (!controller.signal.aborted) {
            setSvgContent(data);
        }
    })
    .catch((error) => {
        if (error.name !== "AbortError") {
            console.error("SVG fetch error:", error);
        }
    });

    return () => { controller.abort();
    }
}, [textName, lineName,stationName,parentTextName]);

    
//     useLayoutEffect(() => {
//     if (!svgContent || !trainData.length) return;

//     const svgRoot = svgContainerRef.current;
//     if (!svgRoot) return;

//      let svgTopArray = ['#toptrainclick', '#toptrainclick2', '#toptrainclicktext', '#toptrainclick3']

//       let svgBottomArray = ['#bottomtrainclick', '#bottomtrainclick1', '#bottomtrainclick2', '#bottomtrainclick3', '#bottomtrainclicktext'
//         ]

//     // resetTrainLayers(svgRoot); //

//     trainData.forEach((item) => {
//         let trainName = 'Train: ' + item.trainId + item.obc;

//         const isBottom =
//             item.direction === 'NBNE' ||
//             item.direction === 'NBSE' ||
//             item.direction === 'EB';

//         const isTop =
//             item.direction === 'SBNE' ||
//             item.direction === 'SBSE' ||
//             item.direction === 'WB';

//         if (isBottom) {
//             const textEl = svgRoot.querySelector('#bottomtrainclicktext');
//             if (textEl) textEl.textContent = trainName;

//             const layer = svgRoot.querySelector('#bottom_train_layer');
//             if (layer) {
//                 layer.style.display = 'block';
//                 layer.onclick = handleTrainClick; // 
//                 layer.setAttribute('train-id', item.trainId + item.obc);
//             }

//             svgBottomArray.forEach((id) => {
//                 const el = svgRoot.querySelector(id);
//                 if (el) Callfun(el, 'block');
//             });
//         }

//         if (isTop) {
//             const textEl = svgRoot.querySelector('#toptrainclicktext');
//             if (textEl) textEl.textContent = trainName;

//             const layer = svgRoot.querySelector('#top_train_layer');
//             if (layer) {
//                 layer.style.display = 'block';
//                 layer.onclick = handleTrainClick; // 
//                 layer.setAttribute('train-id', item.trainId + item.obc);
//             }

//             svgTopArray.forEach((id) => {
//                 const el = svgRoot.querySelector(id);
//                 if (el) Callfun(el, 'block');
//             });
//         }
//     });

// }, [svgContent, trainData, lineName]);


// useLayoutEffect(() => {
//   if (!svgContent) return;

//   const svgRoot = svgContainerRef.current;
//   if (!svgRoot) return;

//   const svgTopArray = [
//     '#toptrainclick',
//     '#toptrainclick2',
//     '#toptrainclicktext',
//     '#toptrainclick3'
//   ];

//   const svgBottomArray = [
//     '#bottomtrainclick',
//     '#bottomtrainclick1',
//     '#bottomtrainclick2',
//     '#bottomtrainclick3',
//     '#bottomtrainclicktext'
//   ];

//   //  - reset previous train SVG
//   [...svgTopArray, ...svgBottomArray].forEach((id) => {
//     const el = svgRoot.querySelector(id);

//     if (el) {
//       el.style.display = 'none';
//     }
//   });

//   ADD THIS - reset layers
//   const topLayer = svgRoot.querySelector('#top_train_layer');
//   const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

//   if (topLayer) {
//     topLayer.style.display = 'none';
//     topLayer.onclick = null;
//     topLayer.removeAttribute('train-id');
//   }

//   if (bottomLayer) {
//     bottomLayer.style.display = 'none';
//     bottomLayer.onclick = null;
//     bottomLayer.removeAttribute('train-id');
//   }

//   // Move this AFTER reset
//   if (!Array.isArray(trainData) || trainData.length === 0) {
//     return;
//   }
//   console.log('trainData',trainData)

//   trainData.forEach((item) => {
//     const trainName = 'Train: ' + item.trainId + item.obc;

//     const isBottom =
//       item.direction === 'NBNE' ||
//       item.direction === 'NBSE' ||
//       item.direction === 'EB';

//     const isTop =
//       item.direction === 'SBNE' ||
//       item.direction === 'SBSE' ||
//       item.direction === 'WB';

//     if (isBottom) {
//       const textEl = svgRoot.querySelector('#bottomtrainclicktext');

//       if (textEl) {
//         textEl.textContent = trainName;
//       }

//       const layer = svgRoot.querySelector('#bottom_train_layer');

//       if (layer) {
//         layer.style.display = 'block';
//         layer.onclick = handleTrainClick;
//         layer.setAttribute(
//           'train-id',
//           item.trainId + item.obc
//         );
//       }

//       svgBottomArray.forEach((id) => {
//         const el = svgRoot.querySelector(id);

//         if (el) {
//           el.style.display = 'block';
//         }
//       });
//     }

//     if (isTop) {
//       const textEl = svgRoot.querySelector('#toptrainclicktext');

//       if (textEl) {
//         textEl.textContent = trainName;
//       }

//       const layer = svgRoot.querySelector('#top_train_layer');

//       if (layer) {
//         layer.style.display = 'block';
//         layer.onclick = handleTrainClick;
//         layer.setAttribute(
//           'train-id',
//           item.trainId + item.obc
//         );
//       }

//       svgTopArray.forEach((id) => {
//         const el = svgRoot.querySelector(id);

//         if (el) {
//           el.style.display = 'block';
//         }
//       });
//     }
//   });

// }, [svgContent, trainData]);

const handleTrainClick = (event) => {
        let trainIcon = event.target.parentElement
        let trainId = trainIcon.getAttribute('train-id');
        setTrainView(true);
        setTrainId(trainId)
        setStationView(false);
        setStationTagview(false);
        setTrainLabelDiply(true);
    };



    // useEffect(() => {
    //     const svgRoot = svgContainerRef.current;
    
    //     if (!svgRoot) return;
    
    //     const sbElements = svgRoot.querySelectorAll('[id^="SB"],[id^="NB"]');
    //     sbElements.forEach((el) => {
    //     const id = el.getAttribute('id');
    //     const validTags = ["SBNE1", "SBNE2", "SBNE3", "SBNE4", "SBSE5", "SBSE6", "SBSE7", "SBSE8","NBSE1", "NBSE2", "NBSE3", "NBSE4", "NBNE5", "NBNE6", "NBNE7", "NBNE8"];
    //     if (validTags.includes(id)) {
    //       el.style.fill = '#cccccc';
    
    //       // Removing old Title if anything there
    //       const oldTitle = el.querySelector('title');
    //       if (oldTitle) oldTitle.remove();
    //     }
    //      const titleElement = svgRoot.querySelector('#section_station_name');
    //      if(titleElement){
    //         titleElement.textContent = rdDataTitle;
    //      }
    //   });
    
    
    //     const resetSVGTagElements = () => {
    //         const sbElements = svgRoot.querySelectorAll('[id^="SBSE"],[id^="SBNE"]');
    //         const nbElements = svgRoot.querySelectorAll('[id^="NBSE"],[id^="NBNE"]');
    //         const wbElements = svgRoot.querySelectorAll('[id^="WBWE"], [id^="WBEE"]');
    //         const ebElements = svgRoot.querySelectorAll('[id^="EBWE"], [id^="EBEE"]');
        
    //         sbElements.forEach((el) => (el.style.fill = '#cccccc'));
    //         nbElements.forEach((el) => (el.style.fill = '#cccccc'));
    //         wbElements.forEach((el) => (el.style.fill = '#cccccc'));
    //         ebElements.forEach((el) => (el.style.fill = '#cccccc'));
    //         const titleElement = svgRoot.querySelector('#section_station_name');
    //             if(titleElement){
    //                 titleElement.textContent = rdDataTitle

    //             }
    //     };

    //      const resetSVGNodeElements = () => {
    //          const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"], [id^="WBWE"], [id^="WBEE"], [id^="EBWE"], [id^="EBEE"]');
    
    //          allElements.forEach(el => {
    //             // el.style.fill = yardfacilitieData?.length === 0 ? '#ffffff' : '';
    //             el.style.fill = '#ffffff';
    //         });
    //         const titleElement = svgRoot.querySelector('#section_station_name');
    //             if(titleElement){
    //                 titleElement.textContent = rdDataTitle;
    //             }
    //     };
    //      resetSVGTagElements();
    //     if (!svgContent || !rdData || rdData.length === 0) {
    //         resetSVGTagElements();
    //         return;
    //     }
    
    //     const titleElement = svgRoot.querySelector('#section_station_name');
    //             if(titleElement){
    //               titleElement.textContent = rdDataTitle;    
    //             }
    //             if(yardfacilitieData?.length === 0){
    //                 resetSVGNodeElements();
    //             }
    //     if (rdData[0]?.length === 0 ) {
    //         resetSVGTagElements();

    //     }else {
    //         console.log('tagData',yardfacilitieDataRef);
    //         console.log('stationdevice',rdData);
    //           yardfacilitieDataRef?.current?.forEach((item) => { 
    //         let tt = item.position?.toLowerCase() + 'text'; 
    //         let posttext = svgRoot.querySelector(`#${tt}`);
    //         if (item.type === 'sta' || item.type === 'obc' || item.type === 'ioc' ){
    //             return;
    //         }
    //      const el = svgRoot.querySelector(`#${item.position}`);
    //         const title = svgRoot.querySelector(`#ts-${item.position}`);
    //             if (item.type !== 'sta' ) {
    //                  if (posttext) {
    //                     if (item.type=='transcoder') {
    //                         posttext.firstChild.nodeValue = 'T';
    //                     } else if (item.type=='encoder') {
    //                         posttext.firstChild.nodeValue = 'E';
    //                     }
    //                 }
    //                 if (title) {
    //                         title.textContent = item.ipAddress;
    //                     } else {
    //                         console.log(`Element with id ts-${item.position} not found`);
    //                     }
    //                 // title.textContent = item.ipAddress;
    //             if (el) {
    //                if (item.status === "down") {
    //                     el.style.fill = "red";
    //                 } else if (item.status === "up") {
    //                     el.style.fill = "rgb(102, 204, 51)";
    //                 }
    //                 // else{
    //                 //     el.style.fill = "";
    //                 // }
    //                 }
    //             }
                
    //     });

    //     rdData[0]?.forEach((sb) => {
    //         const position = sb.position?.trim().toUpperCase();
    //         const index = String(sb.index);
    //         const targetId = `${position}${index}`;
    //         const status = sb.status?.trim().toUpperCase();
    
    //         const color = status === "DOWN" ? "red" : "rgb(102, 204, 51)";
    //         const el = svgRoot.querySelector(`#${targetId}`);
    //         if (el) {
    //             el.style.fill = color;
    //             el.querySelector("title")?.remove();
    //             const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
    //             title.textContent = `${sb.tagId}`;
    //             el.appendChild(title);
    //         } 
    //     });
    //   }
    // }, [rdData, svgContent,yardfacilitieData ,yardfacilitieDataRef]);

        const getNodeLabel = (node) => {
        const mode = node.data?.mode;
      
        if (mode === "region" || mode === "location") {
        //   return node.data?.display || node.text || "Unknown";
        } else if (mode === "facility" || node.data?.parent === "yard_1") {
          return `Station- ${node.text}` || "Unnamed Facility";
        } else {
        //   return node.data?.display || node.text || "Unknown";
        }
      };

      useLayoutEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

  //RESET TAG ELEMENTS ONLY
  

  const sbElements = svgRoot.querySelectorAll(
    '[id^="SBSE"], [id^="SBNE"]'
  );

  const nbElements = svgRoot.querySelectorAll(
    '[id^="NBSE"], [id^="NBNE"]'
  );

   const nbrElements = svgRoot.querySelectorAll(
    '[id^="SB-R"], [id^="NB-R"]'
  );

  const wbElements = svgRoot.querySelectorAll(
    '[id^="WBWE"], [id^="WBEE"]'
  );

  const ebElements = svgRoot.querySelectorAll(
    '[id^="EBWE"], [id^="EBEE"]'
  );

  const titleElements = svgRoot.querySelectorAll(
    '[id^="ts-SB-R"], [id^="ts-NB-R"]'
  );

  const elementsTc = svgRoot.querySelectorAll(
    '[id^="TC"], [id^="C"]'
  );

  sbElements.forEach((el) => {
    el.style.fill = '#cccccc';
  });

  nbElements.forEach((el) => {
    el.style.fill = '#cccccc';
  });

  nbrElements.forEach((el) => {
    el.style.fill = '#FFFFFF';
  });

  wbElements.forEach((el) => {
    el.style.fill = '#cccccc';
  });

  ebElements.forEach((el) => {
    el.style.fill = '#cccccc';
  });

  titleElements.forEach((title) => {
    title.textContent = '';
  });

  elementsTc.forEach((el) => {
    el.style.fill = '#FFFFFF';
  });

  
  // RESET TRAIN ELEMENTS
  

  const trainElements = [
    '#toptrainclick',
    '#toptrainclick2',
    '#toptrainclicktext',
    '#toptrainclick3',
    '#bottomtrainclick',
    '#bottomtrainclick1',
    '#bottomtrainclick2',
    '#bottomtrainclick3',
    '#bottomtrainclicktext'
  ];

  trainElements.forEach((id) => {
    const el = svgRoot.querySelector(id);

    if (el) {
      el.style.display = 'none';
    }
  });

  const topLayer = svgRoot.querySelector('#top_train_layer');
  const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

  if (topLayer) {
    topLayer.style.display = 'none';
    topLayer.onclick = null;
    topLayer.removeAttribute('train-id');
  }

  if (bottomLayer) {
    bottomLayer.style.display = 'none';
    bottomLayer.onclick = null;
    bottomLayer.removeAttribute('train-id');
  }


  
  //  APPLY TAG DATA
  

  const titleElement =
    svgRoot.querySelector('#section_station_name');

  if (titleElement) {
    titleElement.textContent = rdDataTitle;
  }

  if (
    rdData &&
    rdData.length > 0 &&
    rdData[0]?.length > 0
  ) {

    yardfacilitieDataRef?.current?.forEach((item) => {

      if (
        item.type === 'sta' ||
        item.type === 'obc' ||
        item.type === 'ioc'
      ) {
        return;
      }

      const tt =
        item.position?.toLowerCase() + 'text';

      const posttext =
        svgRoot.querySelector(`#${tt}`);

      const el =
        svgRoot.querySelector(`#${item.position}`);

      const title =
        svgRoot.querySelector(`#ts-${item.position}`);

      if (posttext) {
        if (item.type === 'transcoder') {
          posttext.firstChild.nodeValue = 'T';
        }

        if (item.type === 'encoder') {
          posttext.firstChild.nodeValue = 'E';
        }
      }

      if (title) {
        title.textContent = item.ipAddress;
      }

      if (el) {
        if (item.status === 'down') {
          el.style.fill = 'red';
        } else if (item.status === 'up') {
          el.style.fill = 'rgb(102, 204, 51)';
        }
      }
    });


    rdData[0]?.forEach((sb) => {

      const position =
        sb.position?.trim().toUpperCase();

      const index = String(sb.index);

      const targetId =
        `${position}${index}`;

      const status =
        sb.status?.trim().toUpperCase();

      const color =
        status === 'DOWN'
          ? 'red'
          : 'rgb(102, 204, 51)';

      const el =
        svgRoot.querySelector(`#${targetId}`);

      if (el) {

        el.style.fill = color;

        el.querySelector('title')?.remove();

        const title =
          document.createElementNS(
            'http://www.w3.org/2000/svg',
            'title'
          );

        title.textContent = `${sb.tagId}`;

        el.appendChild(title);
      }
    });
  }


  
  //  APPLY TRAIN DATA LAST
  

  if (
    Array.isArray(trainData) &&
    trainData.length > 0
  ) {

    console.log('Applying TRAIN DATA:', trainData);

    trainData.forEach((item) => {

      const trainName =
        `Train: ${item.trainId}${item.obc}`;

      const direction =
        item.direction?.trim().toUpperCase();

      const isBottom =
        ['NBNE', 'NBSE', 'EB'].includes(direction);

      const isTop =
        ['SBNE', 'SBSE', 'WB'].includes(direction);


      
      // BOTTOM TRAIN
      

      if (isBottom) {

        const textEl =
          svgRoot.querySelector(
            '#bottomtrainclicktext'
          );

        const layer =
          svgRoot.querySelector(
            '#bottom_train_layer'
          );

        if (textEl) {
          textEl.textContent = trainName;
          textEl.style.display = 'block';
        }

        if (layer) {
          layer.style.display = 'block';

          layer.setAttribute(
            'train-id',
            `${item.trainId}${item.obc}`
          );

          layer.onclick = handleTrainClick;
        }

        [
          '#bottomtrainclick',
          '#bottomtrainclick1',
          '#bottomtrainclick2',
          '#bottomtrainclick3',
          '#bottomtrainclicktext'
        ].forEach((id) => {

          const el = svgRoot.querySelector(id);

          if (el) {
            el.style.display = 'block';
          }
        });
      }



      // TOP TRAIN
      

      if (isTop) {

        const textEl =
          svgRoot.querySelector(
            '#toptrainclicktext'
          );

        const layer =
          svgRoot.querySelector(
            '#top_train_layer'
          );

        if (textEl) {
          textEl.textContent = trainName;
          textEl.style.display = 'block';
        }

        if (layer) {
          layer.style.display = 'block';

          layer.setAttribute(
            'train-id',
            `${item.trainId}${item.obc}`
          );

          layer.onclick = handleTrainClick;
        }

        [
          '#toptrainclick',
          '#toptrainclick2',
          '#toptrainclick3',
          '#toptrainclicktext'
        ].forEach((id) => {

          const el = svgRoot.querySelector(id);

          if (el) {
            el.style.display = 'block';
          }
        });
      }

    });
  }

}, [
  svgContent,
  rdData,
  trainData,
  yardfacilitieData
]);

    
    


    return (
        <>
            <article className="border-allsd" style={{ textAlign: 'center', paddingTop: '56px', paddingBottom: '56px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationSvg;