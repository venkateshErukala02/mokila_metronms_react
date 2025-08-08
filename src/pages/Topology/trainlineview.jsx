import React, { useState,useEffect,useRef } from "react";
import '../ornms.css';

const TrainLineView=({trainId})=>{
        const [svgContent,setSvgContent] = useState('');
          const svgContainerRef = useRef(null);
           const [isError, setIsError] = useState({ status: false, msg: "" });
            const [isLoading, setIsLoading] = useState(false);
            const [trainPosition,setTrainPosition] = useState('');
        
           const getTrainStatusDt = async () => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const url = `api/v2/treeview/trainpos/${trainId}`;
      const username ='admin';
      const password = 'admin';
      const token = btoa(`${username}:${password}`)
        const options = {
            method: "GET",
            headers:{
                'Authorization': `Basic ${token}`,
                'Accept':'application/json'
            }
        };
        const response = await fetch(url, options);
        const data = await response.json();

        if (response.ok) {
            setIsLoading(false);
            setTrainPosition(data);
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
    }
};


useEffect(()=>{
    const fetchData=async()=>{
        await  getTrainStatusDt();
    }
    fetchData();
//      const intervalId = setInterval(() => {
//       getTrainStatusDt();
//   }, 30000); 

//   return () => clearInterval(intervalId);

},[]);

useEffect(()=>{
    // const fetchData=async()=>{
    //     await  getTrainStatusDt();
    // }
    // fetchData();
     const intervalId = setInterval(() => {
      getTrainStatusDt();
  }, 30000); 

  return () => clearInterval(intervalId);

},[trainPosition]);


useEffect(() => {
  if (!svgContent) return;

  const svgRoot = svgContainerRef.current;
  if (!svgRoot) return;

  const trainId = svgRoot.querySelector('#voughan_metropolitan');
  
    if(trainId !=null){
        trainId.style.visibility = 'visible';
    }

    let trainCircleStr = '#s'+trainPosition.station;
    const trainCircle = svgRoot.querySelector(trainCircleStr);
    if (trainCircle) {
        let cx = trainCircle.getAttribute("cx");
        let cy = trainCircle.getAttribute("cy");
        let ccx1 = parseFloat(cx) - 27;
        let ccx2 = parseFloat(cx) + 29;
        const tram = svgRoot.querySelector("#tram");
        if (tram) {
            tram.setAttribute("x1",ccx1)
            tram.setAttribute("x2",ccx2)
            tram.setAttribute("y1",cy)
            tram.setAttribute("y2",cy)
        }
        const rect = svgRoot.querySelector("#rectchange");
        let xrect =  parseFloat(ccx1) + 16;
        let yrect =  parseFloat(cy) - 10;
        rect.setAttribute('x',xrect);
        rect.setAttribute('y',yrect);
        if (trainPosition.direction =='SBNE' || trainPosition.direction =='SBSE' || trainPosition.direction =='WB') {
            const leftPoly = svgRoot.querySelector('#left');
            leftPoly.style.display = 'none';
            const rightPoly = svgRoot.querySelector('#right');
            rightPoly.style.display = '';  
            let r1 = parseFloat(cx) + 28.654;
            let r2 = parseFloat(cy) - 5.666;
            let r3 = parseFloat(cx) + 28.654;
            let r4 = parseFloat(cy) + 5.667;
            let r5 = parseFloat(cx) + 37.8;
            let r6 = parseFloat(cy);
            let rightPathArrow = r1 + ',' + r2 + ' ' + r3 + ',' + r4 + ' ' + r5 + ',' + r6;          
            rightPoly.setAttribute('points', rightPathArrow);
        } else if (trainPosition.direction =='NBNE' || trainPosition.direction =='NBSE' || trainPosition.direction =='EB') {
            const leftPoly = svgRoot.querySelector('#left');
            leftPoly.style.display = '';
            const rightPoly = svgRoot.querySelector('#right');
            rightPoly.style.display = 'none';
            let l1 = parseFloat(cx) - 26.263;
            let l2 = parseFloat(cy) - 5.666;
            let l3 = parseFloat(cx) - 26.263;
            let l4 = parseFloat(cy) + 5.667;
            let l5 = parseFloat(cx) - 35.409;
            let l6 = parseFloat(cy);
            let leftPathArrow = l1 + ',' + l2 + ' ' + l3 + ',' + l4 + ' ' + l5 + ',' + l6;
            leftPoly.setAttribute('points', leftPathArrow);

        } 
    }
    

  
}, [svgContent,trainPosition]);



    useEffect(() => {
        const controller = new AbortController();        
    
        let url = 'images/trainview_Line1.svg';
        setSvgContent('');
        // Call fetchSvg with signal
        fetch(url,controller.signal)
          .then((res) => res.text())
          .then((data) => {
            setSvgContent(data);
          });
      
      
        return () => controller.abort();
      }, []);

    return(
        <>
        {/* <h1>Train Line View</h1> */}
        <article className="border-allsd">
            <div ref={svgContainerRef} dangerouslySetInnerHTML={{ __html: svgContent }} />
</article>
        </>
    )
}

export default TrainLineView;