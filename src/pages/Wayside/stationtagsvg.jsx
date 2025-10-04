
import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'


const StationTagSvg = ({stationName,rdDataRef}) => {
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0]] ;

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


    useEffect(() => {
    if (!svgContent) return;

    const svgRoot = svgContainerRef.current;
    const el = svgRoot.querySelector('#section_station_name');

    if (el) {
      el.textContent = `${stationName}`; 
    }
  }, [svgContent]); 


useEffect(() => {
    const svgRoot = svgContainerRef.current;

    if (!svgRoot) return;

    const resetSVGElements = () => {
        const sbElements = svgRoot.querySelectorAll('[id^="SB"]');
        const nbElements = svgRoot.querySelectorAll('[id^="NB"]');

        sbElements.forEach((el) => (el.style.fill = '#cccccc'));
        nbElements.forEach((el) => (el.style.fill = '#cccccc'));
    };

    if (!svgContent || !rdData || rdData.length === 0 || !Object.keys(rdData[0] || {}).length) {
        resetSVGElements();
        return;
    }

    rdData.forEach((sb, index) => {
        const position = sb.position?.trim().toUpperCase();
        const status = sb.status?.trim().toUpperCase();

        const color = status === "DOWN" ? "red" : "rgb(102, 204, 51)";

        if (position === 'SB') {
            const id = `SB${index + 1}`;
            const el = svgRoot.querySelector(`#${id}`);
            if (el) el.style.fill = color;

        } else if (position === 'NB') {
            const id = `NB${index + 1}`;
            const el = svgRoot.querySelector(`#${id}`);
            if (el) el.style.fill = color;

        }
    });
}, [rdData, svgContent]);


    return (
        <>
            <article className="" style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationTagSvg;