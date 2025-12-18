import { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';


const LineSvgViewer = ({textName}) => {
 const [svgContent, setSvgContent] = useState("");
  const [error, setError] = useState("");
  const svgContainerRef = useRef(null);

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
        } catch (err) {
          if (err.name === 'AbortError') {
          } else {
          }
        }
      };
      

useEffect(() => {
    const controller = new AbortController();
    let url = '';
  
    switch (textName) {
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
  
    // Api call fetchSvg with signal
    fetchSvg(url, controller.signal);
  
    // Cleaning up on unmount or textName change
    return () => controller.abort();
  }, [textName]);

  if (svgContent){
    const text = document.getE
  }
  



  return (
    <div className="container-fluid">
      <div className="row">
<div className="container-fluid">
      <div className="row">
        <div className="col-12">
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
