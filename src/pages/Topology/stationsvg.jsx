import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'
 

const StationSvg = ({ textName, setTrainView, setStationView, setTrainLabelDiply, setTrainId ,rdDataRef}) => {
    const [trainData, setTrainData] = useState('')
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0].tags] ;



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
        // Reset stationStatus if the new mode doesn't require it
        if (textName?.data?.mode !== 'facility') {
            setStationStatus([]);  // Clear old data
        }
    }, [textName]);



    useEffect(() => {
        if (!svgContent || !stationStatus.length) return;

        const svgRoot = svgContainerRef.current;

        stationStatus.forEach((item) => {
            const title = svgRoot.querySelector(`#ts-${item.position}`);
            const el = title?.parentNode;
            if (item.type !== 'sta') {
                if (title && item.ipAddress) {
                title.textContent = item.ipAddress;
                }
                if (el && item.status === "down") {
                    el.setAttribute("fill", "red");
                } else if (el && item.status === "up") {
                    el.setAttribute("fill", "rgb(102, 204, 51)");
                }
            }

        });
    }, [stationStatus, svgContent]);






    const Callfun = (element, vl) => {
        console.log('hello');
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
        //  else {
        //     svg = textName.data.display + '.svg';
        // }

        let url = 'images/' + svg;
        setSvgContent('');
        // Call fetchSvg with signal
        fetch(url, controller.signal)
            .then((res) => res.text())
            .then((data) => {
                setSvgContent(data);
            });


        // Cleanup on unmount or textName change
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
                    bottomLayer.style.cursor = "pointer"; // Optional: show hand cursor
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
                    bottomLayer.style.cursor = "pointer"; // Optional: show hand cursor
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
                    topLayer.style.cursor = "pointer"; // Optional: show hand cursor
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
                    topLayer.style.cursor = "pointer"; // Optional: show hand cursor
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
        // const tainId = trainData.at
        // setTrainId();
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
        const validTags = ["SB1", "SB2", "SB3", "SB4", "SB5", "SB6", "SB7", "SB8","NB1", "NB2", "NB3", "NB4", "NB5", "NB6", "NB7", "NB8"];
        if (validTags.includes(id)) {
          el.style.fill = '#cccccc';
    
          // Remove old <title> if any
          const oldTitle = el.querySelector('title');
          if (oldTitle) oldTitle.remove();
        }
         const titleElement = svgRoot.querySelector('#section_station_name');
         if(titleElement){
            titleElement.textContent = 'N/A';
         }
      });
    
    
        const resetSVGElements = () => {
            const sbElements = svgRoot.querySelectorAll('[id^="SB"]');
            const nbElements = svgRoot.querySelectorAll('[id^="NB"]');
    
            sbElements.forEach((el) => (el.style.fill = '#cccccc'));
            nbElements.forEach((el) => (el.style.fill = '#cccccc'));
            const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                    titleElement.textContent = 'N/A';
                }
        };
    
        if (!svgContent || !rdData || rdData.length === 0) {
            resetSVGElements();
            return;
        }
    
        const titleElement = svgRoot.querySelector('#section_station_name');
                if(titleElement){
                  titleElement.textContent =  `${rdDataRef.current[0].station}`;    
                }else{
                      titleElement.textContent = 'N/A'
                }
    
        rdData[0]?.forEach((sb, index) => {
            const position = sb.position?.trim().toUpperCase();
            const status = sb.status?.trim().toUpperCase();
    
            const color = status === "DOWN" ? "red" : "rgb(102, 204, 51)";
            const el = svgRoot.querySelector(`#${position}`);
            if (el) {
                el.style.fill = color;
                const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                title.textContent = `${sb.tagId}`;
                el.appendChild(title);
            } 
        });
    }, [rdData, svgContent]);
    


    return (
        <>
            <article className="border-allsd" style={{ textAlign: 'center', paddingTop: '56px', paddingBottom: '56px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationSvg;