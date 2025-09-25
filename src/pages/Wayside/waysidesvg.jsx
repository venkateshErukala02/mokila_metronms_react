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
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');

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

  const getCurrentId=(id,stationName)=>{
        getCircleId(id,stationName)
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



    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    const handleUpload = async (e) => {
        e.preventDefault();
        // if (!selectedFile) {
        //     alert("Please select a file first.");
        //     return;
        // }
    
        setIsLoading(true);
        setError('');
        setSuccess('');
    
        const formData = new FormData();
        formData.append('upfile', selectedFile); // your API should accept a field named "file"
    
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch("api/v2/discovery/", {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
                body: formData, // Don't set Content-Type manually!
            });
    
            if (response.ok) {
                setSuccess('Discovery started successfully');
                alert('Discovery started successfully')

                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false);
        }
    };
    


useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

  svgRoot.classList.add("special-svg");

  const circles = svgRoot.querySelectorAll("circle[id], ellipse[id]");
  const texts = svgRoot.querySelectorAll("text[id]");

  const handleCircleClick = (event) => {
    if (event.button === 0) { // Left-click
      const circle = event.currentTarget;
      const circleId = circle.getAttribute("id");

      texts.forEach((text) => {
        const s = text.id.replace("_txt", "");
        if (s === circleId) {
          const stationName = text.textContent;
          getCurrentId(circleId, stationName);
        }
      });
    } else if (event.button === 2) { 
      event.preventDefault(); 
      console.log("Right-click detected");

      const existingMenu = document.querySelector(".custom-context-menu");
      if (existingMenu) {
        console.log("Removing existing menu");
        existingMenu.remove();
      }

      const textElement = event.currentTarget;
      const stationName = 'hello'; 
      console.log("Station name:", stationName);

      const menu = document.createElement("div");
      menu.className = "custom-context-menu";
      menu.style.position = "absolute";
      menu.style.left = `${event.pageX + 5}px`; 
      menu.style.top = `${event.pageY + 5}px`;
      menu.style.backgroundColor = "white";
      menu.style.border = "1px solid #ccc";
      menu.style.padding = "10px";
      menu.style.boxShadow = "0px 4px 6px rgba(0, 0, 0, 0.1)";
      menu.style.zIndex = "9999999";

      menu.innerHTML = `
        <p>Upload Tag Image</p>
           <article className="regioncont">
                            <label htmlFor="" className="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                            <div className="filename-display" id='filename-display'>
                            No File Slected
                            </div>
                            <input
                                className="dislineinputcl"
                                type="file"
                                onChange={handleFileChange}
                                id="hiddenFileInput"
                                style='width: 200px;display:none'
                            />
                            <button onClick='document.getElementById("hiddenFileInput").click()' class="attachcl">
                                <i class="fa-solid fa-paperclip"></i></button>
                            <button id ='uploadBtn' class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                            
                        </article>
        <button id="context-option-btn">Option 1</button>
         <button id="context-close-btn">Close Menu</button>
      `;

      document.body.appendChild(menu);
      document.getElementById('uploadBtn').addEventListener("click",handleUpload);
      document.getElementById('hiddenFileInput').addEventListener('click',handleFileChange)
       document.getElementById('hiddenFileInput').classList.add('dislineinputcl');
       document.getElementById('filename-display').textContent = selectedFile ? selectedFile.name : 'No file selected'
     

      const closeBtn = document.getElementById("context-close-btn");
      if (closeBtn) {
        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation(); 
          menu.remove(); 
        });
      }

      menu.addEventListener("mousedown", (e) => {
        e.stopPropagation(); 
      });

      const closeMenu = (e) => {
        if (!menu.contains(e.target)) {
          // menu.remove();
          // document.removeEventListener("mousedown", closeMenu);
        }
      };
      document.addEventListener("mousedown", closeMenu);
    }
  };

  circles.forEach((circle) => {
    circle.addEventListener("mousedown", handleCircleClick);
  });

  const preventDefaultContextMenu = (e) => {
    e.preventDefault(); 
  };

  document.addEventListener("contextmenu", preventDefaultContextMenu);


  return () => {
    circles.forEach((circle) => {
      circle.removeEventListener("mousedown", handleCircleClick);
    });

    const existingMenu = document.querySelector(".custom-context-menu");
    if (existingMenu) existingMenu.remove();
    document.removeEventListener("contextmenu", preventDefaultContextMenu);
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



