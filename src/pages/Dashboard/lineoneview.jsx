import { dispatch } from "d3";
import React, { useEffect, useRef, useState } from "react";


const SvgViewer = ({scopeValueSel,getCircleId}) => {
  const svgContainerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  // const [svgContent, setSvgContent] = useState("");
  

  useEffect(() => {
    
    fetch(`images/${scopeValueSel}.svg`)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  }, [scopeValueSel]);

   useEffect(() => {
    if (!svgContent || !svgContainerRef.current) return;

    const svgRoot = svgContainerRef.current;
    svgRoot.classList.add("special-svg");

    const circles = svgRoot.querySelectorAll("circle");

    const handleCircleClick = (e) => {
        const circleId = e.target.getAttribute("id");
        getCurrentId(scopeValueSel, circleId);
    };

    circles.forEach(circle => {
        circle.addEventListener("click", handleCircleClick);
    });

    const fetchData = () => {
        const username = "admin";
        const password = "admin";
        const token = btoa(`${username}:${password}`);

        fetch(`api/v2//dashboard/linestatus/${scopeValueSel}?time=3600`, {
            method: "GET",
            headers: {
                Authorization: `Basic ${token}`,
            },
        })
            .then((res) => res.json())
            .then((response) => {
                const { lines, stations } = response;

                stations.forEach((stationObj) => {
                    const stationId = Object.keys(stationObj)[0];
                    const stationStatus = stationObj[stationId];

                    const el = svgRoot.querySelector(`#${stationId}`);
                    if (el) {
                        el.setAttribute("fill", stationStatus);
                    }
                });

                lines.forEach((lineObj) => {
                    const lineId = Object.keys(lineObj)[0];
                    const lineStatus = lineObj[lineId];

                    const el = svgRoot.querySelector(`#${lineId}`);
                    if (el) {
                        el.setAttribute("stroke", lineStatus);
                    }
                });
            })
            .catch(console.error);
    };

    fetchData();

    const intervalId = setInterval(fetchData, 30000);

    return () => {
        clearInterval(intervalId);

        circles.forEach(circle => {
            circle.removeEventListener("click", handleCircleClick);
        });
    };
}, [svgContent, scopeValueSel]);        



  const getCurrentId=(value,id)=>{
        getCircleId(value,id)
      }

  return (
    <article style={{textAlign:'center'}} className={scopeValueSel ==='line4-sec1' ? 'line-four-sec1-style' : ''}>
    <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
    </article>
  );
};

export default SvgViewer;
