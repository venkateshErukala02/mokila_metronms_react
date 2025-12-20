import { useState, useEffect, useRef } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';


const YardSvgViewer = ({textName,yardfacilitieData}) => {
 const [svgContent, setSvgContent] = useState("");
  const svgContainerRef = useRef(null);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');


useEffect(() => {
    const controller = new AbortController();
    
    let svg = 'TTC_SubwayMap.svg';

    if (textName != "") {
        if (textName.data.mode == 'region') {
          svg = 'TTC_SubwayMap.svg';
          if (textName.text == 'line1') {
            svg = 'Line1.svg';
          } else if (textName.text == 'line4') {
            svg = 'line4-sec1.svg';
          }
      } else if (textName.data.mode == 'location') {
          svg =  textName.text+'.svg';
      } else if (textName.data.mode == 'facility') {
        if(textName.text === 'Finch trail track' || textName.text ==='VMC trail track'){
          svg= 'Finch_trail_track.svg';
        }else if(textName.text === 'Carhouse'){
          svg = 'carhouse.svg';
        }else{
        svg =  'Station_Line1.svg';  
        }
    }else if (textName.data.mode === 'yard'){
      if(textName.text === 'yard_1'){
          svg= 'davisville_track.svg'
      }else{
        svg = textName.data.display+'.svg';
      }
    }
    }

    let url = 'images/' + svg;
    setSvgContent('');
    fetch(url,controller.signal)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  
  
    return () => controller.abort();
  }, [textName]);
 
  

useEffect(() => {

  const svgRoot = svgContainerRef.current;
  if (!svgRoot || !Array.isArray(yardfacilitieData)) return;

  yardfacilitieData.forEach((yarditem) => {
   const position = yarditem.position.trim().replace(/^"|"$/g, "");
     if(position === '-'){
      return;
     }
    const el = svgRoot.querySelector(`#${position}`);
    if (el){
    const newFill = yarditem.status === "down" ? "red" : "rgb(102, 204, 51)";
      const currentStyle = el.getAttribute("style") || "";
      const updatedStyle = currentStyle.replace(/fill:[^;]+/, `fill:${newFill}`);
      el.setAttribute("style", updatedStyle);
  }
  });
}, [ yardfacilitieData]);



return (
  <>
  <article className="border-allsd" style={{textAlign:'center',paddingTop:'20px',paddingBottom:'20px'}}>
    <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }}  />
   </article>
    </>

);
};


export default YardSvgViewer;
