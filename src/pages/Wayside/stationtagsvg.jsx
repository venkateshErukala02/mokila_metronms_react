
import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'


const StationTagSvg = ({rdDataRef}) => {
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0].tags] ;

 useEffect(() => {
        const controller = new AbortController();
              let  svg = 'Station_Line1_edit.svg';

        let url = 'images/' + svg;
        setSvgContent('');
        fetch(url, controller.signal)
            .then((res) => res.text())
            .then((data) => {
                setSvgContent(data);
            });
        return () => controller.abort();
    }, []);


//     useEffect(() => {
//     if (!svgContent) return;

//     const svgRoot = svgContainerRef.current;
//     const el = svgRoot.querySelector('#section_station_name');

//     if (el) {
//       el.textContent = `${stationName}`; 
//     }
//   }, [svgContent]); 

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
            <article className="" style={{ textAlign: 'center', paddingTop: '60px', paddingBottom: '60px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationTagSvg;