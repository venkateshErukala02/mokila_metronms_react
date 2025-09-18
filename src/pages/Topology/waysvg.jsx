import { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';
import { useLayoutEffect } from 'react';

const WaySvgViewer = ({ textName,getCircleId,getLineId }) => {
  const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState("");
  const svgContainerRef = useRef(null);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [stationStatus, setStationStatus] = useState([]);
  const [trainData, setTrainData] = useState('')

  const fetchSvg = async (url, signal) => {
    try {
      const username = "admin";
      const password = "admin";
      const token = btoa(`${username}:${password}`);
      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Authorization": `Basic ${token}`,
          "Accept": "image/svg+xml"

        },
        signal,

      },
        { signal });
      if (!res.ok) throw new Error("Failed to load SVG");
      const svgText = await res.text();
      setSvgContent(svgText);

    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
      } else {
        console.error('Fetch error:', err);
      }
    }
  };


  useEffect(() => {
    const controller = new AbortController();

    let svg = 'TTC_SubwayMap.svg';

    if (textName !== "") {
      svg = textName + '.svg';
    }

    let url = 'images/' + svg;
    setSvgContent('');
    fetchSvg(url, controller.signal)
    return () => controller.abort();
  }, [textName]);


  useLayoutEffect(() => {
    if (!svgContent) return;

    const username = 'admin';
    const password = 'admin';
    const token = btoa(`${username}:${password}`);
    const options = {
      method: "GET",
      headers: {
        'Authorization': `Basic ${token}`
      }
    };
    let call = '';
    if (textName === 'Line21') {
      call = 'all';
    } else {
      call = textName;
    }

    if (textName !== '') {
      fetch('api/v2/wayside/stationstatus?time=600', options)
        .then((res) => res.json())
        .then((response) => {
          const linesData = response.lines;
          const stationsData = response.stations;
          const svgRoot = svgContainerRef.current;

          if (!svgRoot) return;

          stationsData.forEach(( stationObj ) => {
             const stationId = Object.keys(stationObj)[0];   
            const stationStatus = stationObj[stationId];
            const el = svgRoot.querySelector(`#${stationId}`);
            if (el) {
              el.setAttribute("fill", stationStatus === "down" ? "red" : "green");
            }
          });

          linesData.forEach(( lineObj ) => {
            console.log(lineObj)
            const lineId = Object.keys(lineObj)[0];     
            const lineStatus = lineObj[lineId];
            const el = svgRoot.querySelector(`[id='${lineId}']`);
            if (el) {
              el.setAttribute("stroke", lineStatus === "down" ? "red" : "#ffcb09");
            }
          });

        });
    }
  }, [svgContent]);

  const getCurrentId=(id)=>{
        getCircleId(id)
      }

      const getCurrentElementId=(id)=>{
        getLineId(id)
      }




  useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

  const clickElements = svgRoot.querySelectorAll("polyline[id], path[id]");
  svgRoot.classList.add("special-svg");
  const handleClick = (event) => {
    const clickElement = event.currentTarget;
    const clickElementId = clickElement.getAttribute('id');
    if (clickElementId){
    getCurrentElementId(clickElementId);
      }  
  };

  clickElements.forEach((clickElement) => {
    clickElement.addEventListener("click", handleClick);
  });

  return () => {
    clickElements.forEach((clickElement) => {
      clickElement.removeEventListener("click", handleClick);
    });
  };
}, [svgContent]);


 useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;
  svgRoot.classList.add("special-svg");
  const circles = svgRoot.querySelectorAll("circle[id]");

  const handleClick = (event) => {
    const circle = event.currentTarget;
    const circleId = circle.getAttribute('id');
    if (circleId){
    getCurrentId(circleId);
      }  
  };

  circles.forEach((circle) => {
    circle.addEventListener("click", handleClick);
  });

  return () => {
    circles.forEach((circle) => {
      circle.removeEventListener("click", handleClick);
    });
  };
}, [svgContent]);

  return (
    <>
      <article className="" style={{ textAlign: 'center', paddingTop: '0px', marginTop: 'opx',paddingBottom: '0px',height : textName === 'Line21' ? '867px':'auto'}}>
        <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
      </article>
    </>
  );
};


export default WaySvgViewer;



