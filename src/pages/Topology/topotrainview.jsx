import React,{useState,useEffect,useRef, useCallback} from "react";
import southboundtr from '../../assets/img/Train_southbound_new.svg'
import northboundtr from '../../assets/img/Train_northbound_new.svg'
import { Prev } from "react-bootstrap/esm/PageItem";
// import TreeList from "./treelist";

const TrainView=({textName})=>{

    // const [trainData,setTrainData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [svgContent, setSvgContent] = useState("");
    const [error, setError] = useState("");
    const svgContainerRef = useRef(null);
    const [limitValueSel,setLimitValueSel] =  useState('2');
    const [limitLabelSel,setLimitLabelSel] = useState('45');
     const [trainValueSel,setTrainValueSel] =  useState('2');
    const [trainLabelSel,setTrainLabelSel] = useState('Global');
    const [offsetValueDisplay,setOffsetValueDisplay] = useState(1);
    const [offsetValue,setOffsetValue] = useState(0);
    const workersRef = useRef([]);
    const requestIdRef = useRef(0);
      const [trainData, setTrainData] = useState([]);
      const [processedTrains, setProcessedTrains] = useState([]);
       const [results, setResults] = useState([]);
    const [tableNodeSt, setTableNodeSt] = useState([]);

const [table1, setTable1] = useState([]);
const [table2, setTable2] = useState([]);
const [table3, setTable3] = useState([]);



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
    
        let url = '';
        switch (textName.data.mode) {
            case 'Trains':
                url = `api/v2/treeview/alltrains/${trainValueSel}?_s=&limit=${limitLabelSel}&offset=${offsetValue}`;
                break;
            case 'mainline':
                url = `api/v2/treeview/alltrains/${trainValueSel}?_s=&limit=45&offset=0`;
                break;
            default:
                return; 
        }
    
        const fetchData = async () => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
            setTrainData([]); 
    
            try {
                const username = 'admin';
                const password = 'admin';
                const token = btoa(`${username}:${password}`)
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization': `Basic ${token}`
                    },
                    signal: signal
                };
                const response = await fetch(url, options);
                const data = await response.json();
    
                if (response.ok) {
                    setTrainData(data || []);
                    setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    setIsError({ status: true, msg: error.message });
                }
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    
        return () => controller.abort(); 
    }, [textName, limitLabelSel, offsetValue,trainValueSel]);
    

useEffect(() => {
    const controller = new AbortController();
    
    let svg = 'TTC_SubwayMap.svg';

    if (textName !== "") {
        if (textName && textName.data && textName.data.mode=== 'Trains' || textName.data.mode === 'mainline') {
          svg = 'Train_southbound_new.svg';
          if (textName.text == 'line1') {
            svg = 'Line1.svg';
          } else if (textName.text == 'line4') {
            svg = 'line4-sec1.svg';
          }
      } else if (textName.data.mode == 'location') {
          svg =  textName.text+'.svg';
      } else if (textName.data.mode == 'facility') {
        svg =  'Station_Line1.svg';


    }
    }

    

    let url = 'images/' + svg;
    
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  
  
    return () => controller.abort();
  }, [textName,trainData]);

    //   useEffect(() => {
    //     if (!svgContent || !trainData.length) return; 
      
    //     const svgRoot = svgContainerRef.current;
    //     if (!svgRoot) return;
      
    //     trainData.forEach((item) => {
    //       const title = svgRoot.querySelector('#northboundtext');
    //      const secondPath = svgRoot.querySelectorAll('path.pointer')[1];

    //       if (title) {
    //         title.textContent = item.trainId; 
    //       }
    //        if (secondPath) {
    //       secondPath.setAttribute('fill', 'red'); // green

    //     }
    //     });
    //   }, [trainData, svgContent]);


//       useEffect(() => {
//     if (!svgContent || trainData.length === 0) return;

//     const modified = trainData.map(event => ({
//         ...event,
//         svgUp: injectTextToSvg(svgContent, event.trainId, event, 1),
//         svgDown: injectTextToSvg(svgContent, event.trainId, event, 6)
//     }));

//     setProcessedTrains(modified);
// }, [svgContent, trainData,results]);  
      


   


    const injectTextToSvg = useCallback((svgString, trainId,event,digit) => {
        if (!svgString || !trainId ) return null
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const titleElement = svgDoc.querySelector('#northboundtext');
        const paths = svgDoc.querySelectorAll('path.pointer');
    //       const firstNodeId = Array.isArray(event.links) && event.links.length > 0
    // ? event.links[0].nodeId
    // : null;
    // const secondNode = Array.isArray(event.links) && event.links.length > 0 && 
    //  event.links[0].rtt === '' || undefined;
    console.log('lppll',event.links)
    // const secondNode =
    // Array.isArray(event.links) &&
    // event.links.length > 0 &&
    // event.links[0].rtt !== null;

    // const condition2 = 

// const condition = (firstNodeId === event.cabNode1 || firstNodeId === event.cabNode6) || secondNode;
// const condition = secondNode;


const firstNodeId = event.links?.[0]?.nodeId;

const validRtt = event.links?.[0]?.rtt;
const secondNode =
    validRtt != null &&
    validRtt !== "" &&
    !isNaN(validRtt);

const condition =
    (
        firstNodeId &&
        (firstNodeId === event.cabNode1 || firstNodeId === event.cabNode6)
    ) ||
    secondNode;

        if (titleElement) {
             titleElement.textContent = trainId + (digit === 1 ? digit : '6');
        }
        if (paths.length > 0) {
            const titleText = titleElement?.textContent || "";
            const firstNodeId = event.links?.[0]?.nodeId;
            const secondNodeId = event.links?.[1]?.nodeId;
            console.log(firstNodeId); // 1210  
    //         paths.forEach(path => {
    //             let shouldBeGreen = false;
    //             if(condition){
    //              const isCab1Match = ((firstNodeId === event.cabNode1));
    // const isCab6Match = ((secondNodeId === event.cabNode6));
 
    // const isNoDataCab1 = ((firstNodeId === 'nodata' || firstNodeId === 'undefined') && titleText.endsWith("1"));
    // const isNoDataCab6 = ((secondNodeId === 'nodata' || secondNodeId === 'undefined') && titleText.endsWith("6"));

    // // GREEN only if match exists 
    // if (isCab1Match ) {  
    //     console.log('pllkkkkkkk',isCab1Match) 
    //     shouldBeGreen = true;
    // }
    //   if (isCab6Match) {   
    //             console.log('jjojoojjooo',isCab1Match) 

    //     shouldBeGreen = true;
    // }
    // // RED only if NO match and we hit nodata
    // else if (isNoDataCab1 || isNoDataCab6) {
    //     shouldBeGreen = false;
    // }
    //         }
    //       path.setAttribute('fill',  shouldBeGreen ? "green" : "#e4837a"); // green
    //         });
       

    paths.forEach(path => {
    let shouldBeGreen = false;

    const firstNodeId = event.links?.[0]?.nodeId;
    const secondNodeId = event.links?.[1]?.nodeId;
    const titleText = titleElement?.textContent || "";

    // Check cab1
    const isCab1Match = firstNodeId === event.cabNode1 && titleText.endsWith("1");
    const isNoDataCab1 = firstNodeId === 'nodata' && titleText.endsWith("1");

    // Check cab6
    const isCab6Match = secondNodeId === event.cabNode6 && titleText.endsWith("6");
    const isNoDataCab6 = secondNodeId === 'nodata' && titleText.endsWith("6");

    // GREEN only if a match exists
    if (isCab1Match) { 
        shouldBeGreen = true;
    }else if(isCab6Match){
        shouldBeGreen = true;
    }else if (isNoDataCab1 || isNoDataCab6) {
        shouldBeGreen = false;
    }

    path.setAttribute('fill', shouldBeGreen ? 'green' : '#e4837a');
});




 
}  
        return svgDoc.documentElement.outerHTML;
      },[]);
    
     



const splitIntoThreeTables = (data) => {
    const t1 = [], t2 = [], t3 = [];
    data.forEach((item, index) => {
        if (index % 3 === 0) t1.push(item);
        else if (index % 3 === 1) t2.push(item);
        else t3.push(item);
    });
    return [t1, t2, t3];
};

// const createLinks = (item, results) => {
// //   const matchedNodes = tableNodeSt.filter(node => node.nodeid === item.nodeid);
// const matchedNodes = results.filter(r =>
//     r.nodeId === item.cabNode1 || r.nodeId === item.cabNode6
//   );
// //   const matchedNodes = results.filter((node, index) => 
// //     node?.nodeId === (item?.nodeid ?? 0)
// // );



//   if (matchedNodes.length === 0) {
//     return { ...item, links: [{nodeId : 'nodata'},{nodeId : 'nodata'}] };
//   }

//   const links = matchedNodes.map(node => ({
//     nodeId: node.nodeId,
//     rtt: node.data.rtt,
//     type: node.type || "station"
//   }));

//   return { ...item, links };
// };

const createLinks = (item, results) => {
  const link1 = results.find(r => r.nodeId === item.cabNode1);
  const link2 = results.find(r => r.nodeId === item.cabNode6);
   
  return {
    ...item,
    links: [
      link1
        ? { nodeId: link1.nodeId, rtt: link1.data.rtt }
        : { nodeId: "nodata" },

      link2
        ? { nodeId: link2.nodeId, rtt: link2.data.rtt }
        : { nodeId: "nodata" },
    ]
  };
};


// useEffect(() => {
//          if (processedTrains.length === 0) return;
//     // if (results.length > 0) return;
//         const enrichedData = processedTrains.map(item => createLinks(item, results));

//         const [t1, t2, t3] = splitIntoThreeTables(enrichedData);
//         setTable1(t1);
//         setTable2(t2);
//         setTable3(t3);
//         // setIsLoadingTableNode(false);
// }, [processedTrains, results]);


useEffect(() => {
    if (!svgContent || trainData.length === 0) return;

    // STEP 1 — attach links from results
    const withLinks = trainData.map(item => createLinks(item, results));

    // STEP 2 — generate SVGs using injectTextToSvg
    const modified = withLinks.map(event => ({
        ...event,
        svgUp: injectTextToSvg(svgContent, event.trainId, event, 1),
        svgDown: injectTextToSvg(svgContent, event.trainId, event, 6)
    }));

    setProcessedTrains(modified);

    // STEP 3 — split into tables
    const [t1, t2, t3] = splitIntoThreeTables(modified);
    setTable1(t1);
    setTable2(t2);
    setTable3(t3);

}, [svgContent, trainData, results]);




      const handleOffsetValueIncmt = () => {
        if(trainData.length >= Number(limitLabelSel)){
            setOffsetValue((prev) => prev + Number(limitLabelSel));
            if(trainData.length === 0){
                setOffsetValueDisplay((prev) => prev);
            }else{
                setOffsetValueDisplay((prev) => prev + 1);
            }
        }
       
        
      };


      const handleOffsetValueDcrmt = () => {
         if(Number(offsetValue)> 0 ){
        setOffsetValue((prev) => prev- Number(limitLabelSel));
        if(offsetValueDisplay === 1){
            setOffsetValueDisplay(1);
        }else{
        setOffsetValueDisplay((prev)=> prev -1)
        }
    }
      };


//       useEffect(() => {
//     if (trainData.length === 0) return;
    
//     workersRef.current.forEach(w => w.terminate());
//     workersRef.current = [];
    

//     setResults([]);
//     const reqId = ++requestIdRef.current;
//     const apiB = 'http://localhost:8980/metronms/api/v2/nodelinks/ping?nodeId=';
//     callApiBForEachNode(apiB,reqId);

// }, [trainData]);

      
// useEffect(() => {
//     // Terminate all running workers immediately
//     workersRef.current.forEach(w => w.terminate());
//     workersRef.current = [];
// }, [trainValueSel,textName.data.mode]);
   

useEffect(() => {
    if (trainData.length === 0) return;
    
    // 🔥 Clean previous workers BEFORE starting new ones
    workersRef.current.forEach(w => {
        try { w.terminate(); } catch {}
    });
    workersRef.current.length = 0;

    setResults([]);  
    const reqId = ++requestIdRef.current;
    const apiB = 'http://localhost:8980/metronms/api/v2/nodelinks/ping?nodeId=';
    callApiBForEachNode(apiB, reqId);

    return () => {
        // 🔥 Clean workers on unmount or before next effect run
        workersRef.current.forEach(w => {
            try { w.terminate(); } catch {}
        });
        workersRef.current.length = 0;
    };

}, [trainData]);


// useEffect(() => {
//     workersRef.current.forEach(w => {
//         try { w.terminate(); } catch {}
//     });
//     workersRef.current.length = 0;
//      setResults([]);   
// }, [trainValueSel, textName.data.mode]);

// useEffect(() => {
//     setTable1([]);
//     setTable2([]);
//     setTable3([]);
//     setProcessedTrains([]);
//     setResults([]);
// }, [trainValueSel, textName.data.mode]);


    const handleLimitValue=(event)=>{
        let selectedIndex = event.target.selectedIndex;
        setLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setLimitLabelSel(label)
    }

      const handleTrains=(event)=>{
        let selectedIndex = event.target.selectedIndex;
        let value = event.target.options[selectedIndex].value;
        setTrainValueSel(value)
        let label = event.target.options[selectedIndex].label;
        setTrainLabelSel(label)
    }




const handleWorkerResponse = (event) => {
    const { nodeId, data, status, message } = event.data;
     if (status === 'done') return;

    // if (reqId !== requestIdRef.current) return;

    if (status === 'success') {
      console.log(`Worker for nodeId ${nodeId} completed successfully`, data);
      setResults(prev => [...prev, { nodeId, data }]);
      return;
    } 
    
    if (status === 'error') {
      console.error(`Worker for nodeId ${nodeId} failed: ${message}`);
       setResults(prev => [...prev, { nodeId : 'nodata', data }]);
      return
    }
  };

  const callApiBForEachNode = (apiB,reqId) => {

    trainData.forEach((item) => {


      const worker = new Worker(new URL('./worker.js', import.meta.url), { type: 'module' });

      workersRef.current.push(worker); 
      
    //   worker.onmessage = (event) => {
    //           if (reqId !== requestIdRef.current) return;

    //         handleWorkerResponse(event);  
    //         // worker.terminate();           
    //         };

    worker.onmessage = (event) => {
    // if (reqId !== requestIdRef.current) return;
     if (event.data.reqId !== requestIdRef.current) return;

    if (event.data.done) {
        // All nodeIds completed for this worker
        worker.terminate();
        workersRef.current = workersRef.current.filter(w => w !== worker);
        return;
    }

    // Normal API response
    handleWorkerResponse(event);
};

             worker.onerror = (err) => {
            console.error("Worker error:", err);
            worker.terminate();
            workersRef.current = workersRef.current.filter(w => w !== worker);
            };

      worker.postMessage({
        reqId,
        nodeIds: [item.cabNode1, item.cabNode6],  
        apiB: apiB  
      });

    });
//    setTimeout(() => {
//     workersRef.current.forEach((w) => w.terminate());
//     console.log('All workers terminated');
//     workersRef.current = [];
//   }, 5000); 
};
 




    return(
        <>
        <article className="">
            <article className="train-card">
                <article style={{position:'relative'}}>
            <article className="arrowposit">
                            <button className="sbarrow" onClick={handleOffsetValueDcrmt}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="sbarrow"><span>{offsetValueDisplay}</span></button>
                        <button className="sbarrow" onClick={handleOffsetValueIncmt}><i className="fa-solid fa-arrow-right"></i></button>
                            </article>
                           
                            <select className="form-controll1 pagenationsel" value={limitValueSel} onChange={handleLimitValue} style={{ width: "auto", display: 'inline-block' }} aria-invalid="false">
                                    <option value="0" label="15">15</option>
                                    <option value="1" label="30">30</option>
                                    <option value="2" label="45">45</option>
                                </select>

                                
                           
                            <article className="boundimg" >
                                <img src={northboundtr} alt="northtr" />
                                <img src={southboundtr} alt="southtr" style={{float:'right'}} />
                            </article>

                <select className="form-controll1 trainsel" value={trainValueSel} onChange={handleTrains} style={{ width: "auto", display: 'inline-block' }} aria-invalid="false">
                                    <option value="2" label="Global">Global</option>
                                    <option value="11" label="Mainline">Mainline</option>
                                    <option value="12" label="Yard">Yard</option>
                                </select>
                            <article className="boundimg">
                                <span className="southtxt">South Bound</span>
                                <span className="northtxt">North Bound</span>
                            </article>
                            </article>
                            <hr />
                            <article>
                            {!isLoading && !isError.status && table1 && table1.length > 0 &&  <table className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bordeer-allsd" style={{ height: 'auto', margin:'0 20px' }}>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className="clearfix traintbone">


                    {isLoading && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}

                                    {isError.status && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                                {isError.msg}
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError.status && (!table1 || table1.length === 0) && (
                                        <tr className="col-12 dashbdnodata">
                                       
                                                No Data Available
                                        </tr>
                                    )}
                                 {table1 && table1.map((event, index) => (
                                    <>
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgUp
                                        }}
                                    />
                                    {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                     {/* <h6 style={{ margin: '0px' }}>
                                    {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt)) 
                                        : 'Loading...'}
                                    </h6> */}
                                    </td>
                                    
                                     
                                    <td  className="col-4">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[0]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>

                                    <td className="col-4" style={{width:'400px'}}><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i> 
                                    </td>
                                </tr>
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                    <td className="col-4">
                                     <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgDown
                                        }}
                                    />
                                    {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                     <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt)) 
                                        : 'Loading...'} */}
                                    </h6>
                                    </td>
                                    
                                     
                                    <td  className="col-4">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[1]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>

                                    <td className="col-4" style={{width:'400px'}}><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i> 
                                    </td>
                                </tr>
                                </>
                                ))}

                    </tbody>
                </table>}
                {!isLoading && !isError.status && table1 && table1.length > 0 && <table className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bordeer-allsd" style={{ height: 'auto',margin:'0 20px'  }}>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className="clearfix traintbone">


                    {isLoading && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}

                                    {isError.status && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                                {isError.msg}
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError.status && (!table2 || table2.length === 0) && (
                                        <tr className="col-12 dashbdnodata">
                                       
                                                No Data Available
                                        </tr>
                                    )}
                                 {table2 && table2.map((event, index) => (
                                    <>
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-3">
                                     <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgUp
                                        }}
                                    />
                                   {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                   <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt)) 
                                        : 'Loading...'} */}
                                    </h6>

                                    </td>
                                     <td  className="col-4">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[0]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>
                                    <td className="col-5"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
                                 <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                    <td className="col-3">
                                     <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgDown
                                        }}
                                    />
                                   {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                   <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt)) 
                                        : 'Loading...'} */}
                                    </h6>

                                    </td>
                                     <td  className="col-4">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[1]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>
                                    <td className="col-5"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
                                </>
                                ))}


                    </tbody>
                </table>}
                {!isLoading && !isError.status && table1 && table1.length > 0 &&    <table className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bordeer-allsd" style={{ height: 'auto',margin:'0 20px'  }}>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className="clearfix traintbone">


                    {isLoading && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}

                                    {isError.status && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                                {isError.msg}
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError.status && (!table3 || table3.length === 0) && (
                                        <tr className="col-12 dashbdnodata">
                                       
                                                No Data Available
                                        </tr>
                                    )}
                                 {table3 && table3.map((event, index) => (
                                    <>
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-3">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgUp
                                        }}
                                    />
                                    {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                  <h6 style={{ margin: '0px' }}>
                                    
                                      {/* {event.links?.[0]?.rtt ?? "No Data"} */}
                                    </h6>
{/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt )) 
                                        : 'Loading...'} */}
                                    </td>
                                     <td  className="col-3">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[0]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>
                                    <td className="col-6"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
                                 <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                    <td className="col-3">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html:  event.svgDown
                                        }}
                                    />
                                    {/* <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6> */}
                                  <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => (link.rtt )) 
                                        : 'Loading...'} */}
                                      {/* {event.links?.[1]?.rtt ?? "No Data"} */}

                                    </h6>

                                    </td>
                                     <td  className="col-3">
                                      <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => 
                                            // link.rtt && link.rtt !== '' ? link.rtt : 'No data') 
                                            (link.rtt !== null && link.rtt !== undefined && link.rtt !== '' 
                                            ? link.rtt 
                                            : 'No data'))
                                        : 'no data...'} */}
                                         {event.links?.[1]?.rtt ?? "No Data"}
                                    </h6>  
                                    

                                    </td>
                                    <td className="col-6"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
                                </>
                                ))}


                    </tbody>
                </table>}
                            </article>
                            
            </article>

        </article>
        </>
    )
}

export default TrainView;