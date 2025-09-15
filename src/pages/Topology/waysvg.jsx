import { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';
import { useLayoutEffect } from 'react';

const WaySvgViewer = ({ textName }) => {
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
      fetch(`api/v2/dashboard/linestatus/${call}`, options)
        .then((res) => res.json())
        .then((response) => {
          const data = response.data;
          const svgRoot = svgContainerRef.current;

          if (!svgRoot) return;

          data.forEach(({ station, status }) => {
            const el = svgRoot.querySelector(`#${station}`);
            if (el) {
              el.setAttribute("fill", status === "down" ? "red" : "green");
            }
          });
        });
    }
  }, [svgContent]);


  return (
    <>
      <article className="border-allsd" style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '20px', height : textName === 'Line21' ? '867.5px': 'auto'}}>
        <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
      </article>
    </>
  );
};


export default WaySvgViewer;
