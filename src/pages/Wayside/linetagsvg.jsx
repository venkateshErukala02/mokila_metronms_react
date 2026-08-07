
import React, { useState, useEffect, useRef } from "react";
import { useLayoutEffect } from 'react';
import '../ornms.css'


const LineTagSvg = ({rdDataRef,lineId}) => {
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [stationStatus, setStationStatus] = useState([]);
    const [svgContent, setSvgContent] = useState("");
    const svgContainerRef = useRef(null);
    const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0]?.tags];
    const stNameDt = rdDataRef.current === null ? [] : rdDataRef.current[0]?.station;
    const stName = lineId?.trim() ||  stNameDt;
    // const stName = (lineId?.trim() || stNameDt || "").toLowerCase();

 useEffect(() => {
        const controller = new AbortController();
            // const list = ["Yonge", "Bayview", "Bessarion", "Leslie", "Don Mills"];

       const svg =
            stName ==="Yonge" ||
            stName.includes("Bayview") ||
            stName.includes("Bessarion") ||
            stName.includes("Leslie") ||
            stName.includes("Don Mills") ||
            stName.includes("DonMills")
                ? "tag_line4.svg"
                : "tag_line1.svg";

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
        const svgRoot = svgContainerRef.current;
    
        if (!svgRoot) return;

         const sbElements = svgRoot.querySelectorAll('[id^="SB"],[id^="NB"], [id^="WB"], [id^="EB"]');
                sbElements.forEach((el) => {
                const id = el.getAttribute('id');
                const validTags = [
                    "SB1", "SB2", "SB3", "SB4", "SB5", "SB6", "SB7", "SB8",
                    "NB1", "NB2", "NB3", "NB4", "NB5", "NB6", "NB7", "NB8",
                    "WB1", "WB2", "WB3", "WB4", "WB5", "WB6", "WB7", "WB8",
                    "EB1", "EB2", "EB3", "EB4", "EB5", "EB6", "EB7", "EB8"
                ];
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
            const wbElements = svgRoot.querySelectorAll('[id^="WB"]');
            const ebElements = svgRoot.querySelectorAll('[id^="EB"]');
    
            sbElements.forEach((el) => (el.style.fill = '#cccccc'));
            nbElements.forEach((el) => (el.style.fill = '#cccccc'));
            wbElements.forEach((el) => (el.style.fill = '#cccccc'));
            ebElements.forEach((el) => (el.style.fill = '#cccccc'));
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
              titleElement.textContent =  `${rdDataRef.current[0]?.station}`;    
            }else{
                  titleElement.textContent = 'N/A'
            }

        const dataList = rdData?.[0] || [];
        const sbList = dataList.filter(x => x.position?.trim().toUpperCase() === "SB");
        const nbList = dataList.filter(x => x.position?.trim().toUpperCase() === "NB");
        const wbList = dataList.filter(x => x.position?.trim().toUpperCase() === "WB");
        const ebList = dataList.filter(x => x.position?.trim().toUpperCase() === "EB");

        const sortByStatus = (a, b) => {
            const aStatus = a.status?.trim().toUpperCase();
            const bStatus = b.status?.trim().toUpperCase();

            if (aStatus === bStatus) return 0;
            if (aStatus === "DOWN") return -1;
            if (bStatus === "DOWN") return 1;
            return 0;
            };

        const applyTags = (list, prefix) => {
            list
            .sort(sortByStatus)
            .forEach((sb, i) => {
                const position = prefix + (i + 1); 
                const status = sb.status?.trim().toUpperCase();
                const color = status === "DOWN" ? "red" : "rgb(102, 204, 51)";

                const el = svgRoot.querySelector(`#${position}`);

                if (el) {
                el.style.fill = color;

                const oldTitle = el.querySelector("title");
                if (oldTitle) oldTitle.remove();

                const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
                title.textContent = sb.tagId;
                el.appendChild(title);
                }
            });
            };
            applyTags(sbList, "SB");
            applyTags(nbList, "NB");
            applyTags(wbList, "WB");
            applyTags(ebList, "EB");
    }, [rdData, svgContent]);
    

    return (
        <>
            <article className="" style={{ textAlign: 'center', paddingTop: '56px', paddingBottom: '56px' }}>
                <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
            </article>
        </>
    )
}

export default LineTagSvg;