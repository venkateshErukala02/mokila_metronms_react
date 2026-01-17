import { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'
 

const StationSvg = ({ textName, setTrainView, setStationView, setTrainLabelDiply, setTrainId ,rdDataRef,trainView,trainId,stationNode}) => {
    const [trainData, setTrainData] = useState('')
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const stationStatusRef = useRef(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0].tags] ;
    const rdDataTitle = rdDataRef.current === null ? [] : [rdDataRef.current[0].station] ;

   const effectiveTextName = textName && Object.keys(textName).length > 0
                        ? textName
                        : stationNode;


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
        getTrainData();
        getStationStatusDt();
    }, [svgContent])

    useEffect(() => {
        if (textName?.data?.mode !== 'facility') {
            setStationStatus([]); 
        }
    }, [textName]);



    useLayoutEffect(() => {
        if (!svgContent || !stationStatus.length) return;

        const svgRoot = svgContainerRef.current;

        const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"],[id^="TC"],[id^="C"]');

            allElements.forEach(el => {
                el.style.fill = "#FFFFFF";
            });

           const resetSVGNodeElements = () => {
            const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"]');
    
             allElements.forEach(el => {
                el.style.fill = stationStatus.length === 0 ? '#ffffff' : '';
            });
            const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                    titleElement.textContent = rdDataTitle;
                }
        };

        if(stationStatus.length === 0){
            resetSVGNodeElements();
        }else{
         stationStatusRef?.current?.forEach((item) => { 
         const el = svgRoot.querySelector(`#${item.position}`);
            const title = svgRoot.querySelector(`#ts-${item.position}`);
                if (item.type !== 'sta' && title !== null) {
                title.textContent = item.ipAddress;
                if (el) {
                   if (item.status === "down") {
                    el.style.fill = "red";
                } else if (item.status === "up") {
                    el.style.fill = "rgb(102, 204, 51)";
                    }
                    }else{
                        el.style.fill = "#FFFFFF";
                    }
                }
                
        });
    }
    }, [stationStatus, svgContent]);






    const Callfun = (element, vl) => {
        if (element != undefined) {
            element.style.display = vl;
        }

    }

    useEffect(() => {
        if (!svgContent || textName.data?.mode === 'facility') {

            const svgRoot = svgContainerRef.current;
            if (!svgRoot) return;

            let svgArray = ['#toptrainclick', '#toptrainclick2', '#toptrainclicktext', '#toptrainclick3',
                '#bottomtrainclick', '#bottomtrainclick1', '#bottomtrainclick2', '#bottomtrainclick3', '#bottomtrainclicktext'
            ]

            svgArray.map((item) => {
                let bottomClick0 = svgRoot.querySelector(item);
                if (bottomClick0 != null)
                    Callfun(bottomClick0, 'none');
            })



            const el = svgRoot.querySelector(`#section_station_name`);
            if (el) {
                el.textContent = textName.text;
                el.classList.add("svgstationname");
            }
        }
    }, [textName.text, svgContent]);

    useEffect(() => {
        const controller = new AbortController();

        let svg = '';

        if (textName != "") {
            if (textName.data.mode == 'facility' && setStationStatus==='false') {
                svg = 'Station_Line1.svg';
            }else{
                svg = 'Station_Line1.svg'; 
            }
        }
         else {
            svg = 'Station_Line1.svg';
        }

        let url = 'images/' + svg;
        setSvgContent('');
        // Api call fetchSvg with signal
        fetch(url, controller.signal)
            .then((res) => res.text())
            .then((data) => {
                setSvgContent(data);
            });


        // Cleaning up on unmount or textName change
        return () => controller.abort();
    }, [textName]);

    useLayoutEffect(() => {
        if (!svgContent || !trainData.length) return;

        const svgRoot = svgContainerRef.current;

        let svgTopArray = ['#toptrainclick', '#toptrainclick2', '#toptrainclicktext', '#toptrainclick3']

        let svgBottomArray = ['#bottomtrainclick', '#bottomtrainclick1', '#bottomtrainclick2', '#bottomtrainclick3', '#bottomtrainclicktext'
        ]

        trainData.forEach((item) => {
            let trainName = 'Train: ' + item.trainId + item.obc;
            if (item.direction === 'NBNE') {
                const tnelement = svgRoot.querySelector('#bottomtrainclicktext');
                if (tnelement != null) {
                    tnelement.textContent = trainName;
                }

                const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

                if (bottomLayer) {
                    bottomLayer.setAttribute('train-id', item.trainId + item.obc);
                    bottomLayer.style.cursor = "pointer";
                    bottomLayer.addEventListener('click', handleTrainClick);
                }

                if (bottomLayer !== null)
                    bottomLayer.style.visibility = 'visible';
                svgBottomArray.map((i) => {
                    let bottomClick0 = svgRoot.querySelector(i);
                    if (bottomClick0 != null)
                        if (i !== '#bottomtrainclick3')
                            Callfun(bottomClick0, 'block');
                })
            } else if (item.direction === 'NBSE' || item.direction === 'EB') {
                const bottomLayer = svgRoot.querySelector('#bottom_train_layer');

                if (bottomLayer) {
                    bottomLayer.style.cursor = "pointer"; 
                    bottomLayer.addEventListener('click', handleTrainClick);
                }
                const tnelement = svgRoot.querySelector('#bottomtrainclicktext');
                if (tnelement != null) {
                    tnelement.textContent = trainName;
                }
                svgBottomArray.map((i) => {
                    let bottomClick0 = svgRoot.querySelector(i);
                    if (bottomClick0 != null)
                        if (i !== '#bottomtrainclick2')
                            Callfun(bottomClick0, 'block');
                })
            } else if (item.direction === 'SBNE') {
                const topLayer = svgRoot.querySelector('#top_train_layer');

                if (topLayer) {
                    topLayer.style.cursor = "pointer";
                    topLayer.addEventListener('click', handleTrainClick);
                }
                const tnelement = svgRoot.querySelector('#toptrainclicktext');
                if (tnelement != null) {
                    tnelement.textContent = trainName;
                }
                svgTopArray.map((i) => {
                    let bottomClick0 = svgRoot.querySelector(i);
                    if (bottomClick0 != null)
                        if (i !== '#toptrainclick2')
                            Callfun(bottomClick0, 'block');
                })
            } else if (item.direction === 'SBSE' || item.direction === 'WB') {
                const topLayer = svgRoot.querySelector('#top_train_layer');

                if (topLayer) {
                    topLayer.style.cursor = "pointer";
                    topLayer.addEventListener('click', handleTrainClick);
                }
                const tnelement = svgRoot.querySelector('#toptrainclicktext');
                if (tnelement != null) {
                    tnelement.textContent = trainName;
                }
                svgTopArray.map((i) => {
                    let bottomClick0 = svgRoot.querySelector(i);
                    if (bottomClick0 != null)
                        if (i !== '#toptrainclick3')
                            Callfun(bottomClick0, 'block');
                })
            }

        })

    }, [trainData, svgContent]);

    const handleTrainClick = (event) => {
        let trainIcon = event.target.parentElement
        let trainId = trainIcon.getAttribute('train-id');
        setTrainView(true);
        setTrainId(trainId)
        setStationView(false);
        setTrainLabelDiply(true);
    };



    useEffect(() => {
        const svgRoot = svgContainerRef.current;
    
        if (!svgRoot) return;
    
        const sbElements = svgRoot.querySelectorAll('[id^="SB"],[id^="NB"]');
        sbElements.forEach((el) => {
        const id = el.getAttribute('id');
        const validTags = ["SBNE1", "SBNE2", "SBNE3", "SBNE4", "SBSE5", "SBSE6", "SBSE7", "SBSE8","NBSE1", "NBSE2", "NBSE3", "NBSE4", "NBNE5", "NBNE6", "NBNE7", "NBNE8"];
        if (validTags.includes(id)) {
          el.style.fill = '#cccccc';
    
          // Removing old Title if anything there
          const oldTitle = el.querySelector('title');
          if (oldTitle) oldTitle.remove();
        }
         const titleElement = svgRoot.querySelector('#section_station_name');
         if(titleElement){
            titleElement.textContent = rdDataTitle;
         }
      });
    
    
        const resetSVGTagElements = () => {
            const sbElements = svgRoot.querySelectorAll('[id^="SBSE"],[id^="SBNE"]');
            const nbElements = svgRoot.querySelectorAll('[id^="NBSE"],[id^="NBNE"]');
        
            sbElements.forEach((el) => (el.style.fill = '#cccccc'));
            nbElements.forEach((el) => (el.style.fill = '#cccccc'));
            const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                    titleElement.textContent = rdDataTitle

                }
        };

         const resetSVGNodeElements = () => {
             const allElements = svgRoot.querySelectorAll('[id^="SB-R"], [id^="NB-R"]');
    
             allElements.forEach(el => {
                el.style.fill = stationStatus.length === 0 ? '#ffffff' : '';
            });
            const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                    titleElement.textContent = rdDataTitle;
                }
        };
    
        if (!svgContent || !rdData || rdData.length === 0) {
            resetSVGTagElements();
            return;
        }
    
        const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                  titleElement.textContent = rdDataTitle;    
                }
        if (rdData[0]?.length === 0) {
          if(stationStatus.length === 0){
            resetSVGNodeElements();
              }
            resetSVGTagElements();

        }else {
        rdData[0]?.forEach((sb) => {
            const position = sb.position?.trim().toUpperCase();
            const index = String(sb.index);
            const targetId = `${position}${index}`;
            const status = sb.status?.trim().toUpperCase();
    
            const color = status === "DOWN" ? "red" : "rgb(102, 204, 51)";
            const el = svgRoot.querySelector(`#${targetId}`);
            if (el) {
                el.style.fill = color;
                el.querySelector("title")?.remove();
                const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                title.textContent = `${sb.tagId}`;
                el.appendChild(title);
            } 
        });
      }
    }, [rdData, svgContent,stationStatus]);

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
    
    


    return (
        <>
            <article className="border-allsd" style={{ textAlign: 'center', paddingTop: '56px', paddingBottom: '56px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationSvg;