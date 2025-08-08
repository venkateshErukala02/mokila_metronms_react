import React, { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';


const LineSvgViewer = ({textName}) => {
 const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState("");
  const svgContainerRef = useRef(null);


//   useEffect(() => {
    // const fetchSvg = async (url) => {
    //   try {
    //     const username = "admin";
    //     const password = "admin";
    //     const token = btoa(`${username}:${password}`);

    //     // let url= `http://localhost:3000/ornms/images/${}.svg`;


    //     const response = await fetch(
    //       url,   
    //         {
    //       method: "GET",
    //       headers: {
    //         "Authorization": `Basic ${token}`,
    //         "Accept": "image/svg+xml"
    //       }
    //     });

    //     if (!response.ok) {
    //       throw new Error("Failed to fetch SVG");
    //     }

    //     const svgText = await response.text();
    //     setSvgContent(svgText);
    //   } catch (err) {
    //     console.error("SVG fetch error:", err);
    //     setError(err.message);
    //   }
    // };


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
            
          }

          },
            { signal });
          if (!res.ok) throw new Error("Failed to load SVG");
          const svgText = await res.text();
          setSvgContent(svgText);
          
          // Do something with svgText, e.g.:
          // document.getElementById('svg-container').innerHTML = svgText;
      
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
    let url = '';
  
    switch (textName) {
      // case 'Golbal':
      //   url = '/ornms/images/TTC_SubwayMap.svg';
      //   break;
      case 'line1':
        url = 'images/Line1.svg';
        break;
      case 'line4':
      case 'line4-sec1':
        url = 'images/line4-sec1.svg';
        break;
      case 'line1-sec1':
        url = 'images/line1-sec1.svg';
        break;
      case 'line1-sec2':
        url = 'images/line1-sec2.svg';
        break;
      default:
        url = 'images/Station_Line1.svg';
        break;
    }
  
    // Call fetchSvg with signal
    fetchSvg(url, controller.signal);
  
    // Cleanup on unmount or textName change
    return () => controller.abort();
  }, [textName]);

  if (svgContent){
    const text = document.getE
  }
  



  return (
    <div className="container-fluid">
      <div className="row">
        {/* <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        // ref={svgContainerRef}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        className="svgcontainer"
      />
    </div> */}

<div className="container-fluid">
      <div className="row">
        <div className="col-12">

          {/* Display train name above the SVG */}
          {textName && (
            <h5 className="train-name-heading" style={{ textAlign: "center", marginBottom: '10px' }}>
               {textName.text}
            </h5>
          )}

          {error && <p style={{ color: "red" }}>{error}</p>}
          <div
            className="svgcontainer"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        </div>
      </div>
      </div>
    </div>
    </div>
  );
};

export default LineSvgViewer;
