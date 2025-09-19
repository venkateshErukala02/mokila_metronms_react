
import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'


const StationTagSvg = ({stationName}) => {
    // const [trainData, setTrainData] = useState('')
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);

 useEffect(() => {
        const controller = new AbortController();

        // let svg = 'TTC_SubwayMap.svg';

        // if (textName === '') {
        //     if (textName.data.mode == 'facility') {
              let  svg = 'Station_Line1_edit.svg';
        //     }
       

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
  }, [svgContent]); // 


    return (
        <>
            <article className="" style={{ textAlign: 'center', paddingTop: '200px', paddingBottom: '200px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationTagSvg;