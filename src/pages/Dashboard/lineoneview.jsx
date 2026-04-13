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
    if (!svgContent) return;
    const fetchData = () => {
    const username = 'admin';
          const password = 'admin';
          const token = btoa(`${username}:${password}`)
          const options = {
              method: "GET",
              headers: {
                  'Authorization': `Basic ${token}`
              }

          };

    fetch(`api/v2//dashboard/linestatus/${scopeValueSel}?time=3600`,options) 
      .then((res) => res.json())
        .then((response) => {
          const linesData = response.lines;
          const stationsData = response.stations;
          const svgRoot = svgContainerRef.current;
           const circles = svgContainerRef.current.querySelectorAll("circle");
        svgRoot.classList.add("special-svg");
            circles.forEach((circle, index) => {
        circle.addEventListener("click", () => {
                      const circleId  = circle.getAttribute('id');
                      if(scopeValueSel ==='line1-sec1'){
                        getCurrentId(scopeValueSel,circleId);
          
                      }else if(scopeValueSel ==='line1-sec2'){
                        getCurrentId(scopeValueSel,circleId);
          
                      }else{
                        getCurrentId(scopeValueSel,circleId);
          
                      }
                    });
        });

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
        })
         .catch((err) => console.error(err));
      }

      fetchData();

  const intervalId = setInterval(fetchData, 30000);

  return () => clearInterval(intervalId);
  }, [svgContent,scopeValueSel]);


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
