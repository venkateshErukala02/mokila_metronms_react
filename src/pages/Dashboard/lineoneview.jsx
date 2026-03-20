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
    const username = 'admin';
          const password = 'admin';
          const token = btoa(`${username}:${password}`)
          const options = {
              method: "GET",
              headers: {
                  'Authorization': `Basic ${token}`
              }

          };
    fetch(`api/v2//dashboard/linestatus/${scopeValueSel}`,options) 
      .then((res) => res.json())
      .then((response) => {
        const data = response.data;
        const svgRoot = svgContainerRef.current;
        const circles = svgContainerRef.current.querySelectorAll("circle");
        if(svgRoot !== null){
          svgRoot.classList.add("special-svg");
        }

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
        data.forEach(({ station, status }) => {
          const el = svgRoot.querySelector(`#${station}`);
          if (el && status === "down") {
            el.setAttribute("fill", "red");
          }else if(el && status === "up") {
             el.setAttribute("fill", "green");
          }
        });
      });
  }, [svgContent]);


  const getCurrentId=(value,id)=>{
        getCircleId(value,id)
      }

  return (
    <article style={{textAlign:'center'}}>
    <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
    </article>
  );
};

export default SvgViewer;
