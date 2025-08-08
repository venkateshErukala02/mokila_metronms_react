// import React, { useState, useEffect, useRef } from "react";
// import '../ornms.css';
// import '../Dashboard/dashboard.css';


// const SvgViewer = ({scopeValueSel,getCircleId}) => {
//   const [svgContent, setSvgContent] = useState("");
//   const [svgStatusCircle, setSvgStatusCircle] = useState('');
//   const [error, setError] = useState("");
//   const svgContainerRef = useRef(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState({ status: false, msg: "" });


 

//     //   const getCircleData = async (url) => {
//     //     setIsLoading(true);
//     //     setIsError({ status: false, msg: "" });
//     //     try {
//     //         const username = 'admin';
//     //         const password = 'admin';
//     //         const token = btoa(`${username}:${password}`)
//     //         const options = {
//     //             method: "GET",
//     //             headers: {
//     //                 'Authorization': `Basic ${token}`
//     //             }

//     //         };
//     //         const response = await fetch(url, options);
//     //         const data = await response.json();
//     //         //   console.log('llol',response)
//     //         if (response.ok) {
//     //             setIsLoading(false);
//     //             setSvgStatusCircle(data || []);


//     //             // console.log('lpll',data)
//     //             setIsError({ status: false, msg: "" });
//     //         } else {
//     //             throw new Error("data not found");
//     //         }
//     //     } catch (error) {
//     //         setIsLoading(false);
//     //         setIsError({ status: true, msg: error.message });
//     //     }
//     // };

//     // useEffect(()=>{
//     //   let url= `api/v2//dashboard/linestatus/${scopeValueSel}`;
//     //  getCircleData(url);
      
//     // },[scopeValueSel])

//   useEffect(() => {
//     const fetchSvg = async () => {
//       try {
//         const username = "admin";
//         const password = "admin";
//         const token = btoa(`${username}:${password}`);

//         let url= `http://localhost:3000/ornms/images/${scopeValueSel}.svg`;


//         const response = await fetch(
//           url,
            
//             {
//           method: "GET",
//           headers: {
//             "Authorization": `Basic ${token}`,
//             "Accept": "image/svg+xml"
//           }
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch SVG");
//         }

//         const svgText = await response.text();
//         setSvgContent(svgText);
//       } catch (err) {
//         console.error("SVG fetch error:", err);
//         setError(err.message);
//       }
//     };

//     fetchSvg();
//   }, [scopeValueSel]);

//   useEffect(() => {


//     let url= `api/v2//dashboard/linestatus/${scopeValueSel}`;
//     const getCircleData = async () => {
//       setIsLoading(true);
//       setIsError({ status: false, msg: "" });
//       try {
//           const username = 'admin';
//           const password = 'admin';
//           const token = btoa(`${username}:${password}`)
//           const options = {
//               method: "GET",
//               headers: {
//                   'Authorization': `Basic ${token}`
//               }

//           };
//           const response = await fetch(url, options);
//           const data = await response.json();
//           //   console.log('llol',response)
//           if (response.ok) {
//               setIsLoading(false);
//               setSvgStatusCircle(data || []);


//               // console.log('lpll',data)
//               setIsError({ status: false, msg: "" });
//           } else {
//               throw new Error("data not found");
//           }
//       } catch (error) {
//           setIsLoading(false);
//           setIsError({ status: true, msg: error.message });
//       }
//   };

//     if (svgContainerRef.current) {
//       // Wait a moment for the SVG to be inserted into the DOM
//       const timer = setTimeout(() => {
//         const circles = svgContainerRef.current.querySelectorAll("circle");
//         console.log("Found circles:", circles.length);

//         // Example: change fill color of each circle
//         circles.forEach((circle, index) => {
//           circle.style.fill = "red";
//           circle.addEventListener("click", () => {
//             const circleId  = circle.getAttribute('id');
//             if(scopeValueSel ==='line1-sec1'){
//               getCurrentId(scopeValueSel,circleId);

//             }else if(scopeValueSel ==='line1-sec2'){
//               getCurrentId(scopeValueSel,circleId);

//             }else{
//               getCurrentId(scopeValueSel,circleId);

//             }
//           });
//         });
//       }, 100); // delay to ensure innerHTML has rendered

//       return () => clearTimeout(timer);
//     }
//   }, [svgContent,scopeValueSel]);


//   const getCurrentId=(value,id)=>{
//     getCircleId(value,id)
//   }


//   return (
//     <div className="container-fluid">
//       <div className="row">
//         <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <div
//         ref={svgContainerRef}
//         dangerouslySetInnerHTML={{ __html: svgContent }}
//         className="svgcontainer"
//       />
//     </div>
//     </div>
//     </div>
//   );
// };

// export default SvgViewer;



import { dispatch } from "d3";
import React, { useEffect, useRef, useState } from "react";


const SvgViewer = ({scopeValueSel,getCircleId}) => {
  const svgContainerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  // const [svgContent, setSvgContent] = useState("");
  

  // 1. Fetch SVG from URL
  useEffect(() => {
    
    fetch(`images/${scopeValueSel}.svg`)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  }, [scopeValueSel]);

           

  // 2. Fetch API data and update SVG once it's loaded
  useEffect(() => {
    if (!svgContent) return;

    // Simulated API call

    const username = 'admin';
          const password = 'admin';
          const token = btoa(`${username}:${password}`)
          const options = {
              method: "GET",
              headers: {
                  'Authorization': `Basic ${token}`
              }

          };
    fetch(`api/v2//dashboard/linestatus/${scopeValueSel}`,options) // Replace with your actual API
      .then((res) => res.json())
      .then((response) => {
        // Example: data = { voughan_metropolitan_centre: "green", union: "red" }
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
