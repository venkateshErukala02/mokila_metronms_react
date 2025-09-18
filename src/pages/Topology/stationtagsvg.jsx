
import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'


const StationTagSvg = ({}) => {
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
        // }
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
    }, []);



    return (
        <>
            <article className="" style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default StationTagSvg;