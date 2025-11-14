import React,{useState,useEffect,useRef} from "react";
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
    //   const [tableNodeSt, setTableNodeSt] = useState([]);

      const [trainData, setTrainData] = useState([]);
       const [results, setResults] = useState([]);
const [tableNodeSt, setTableNodeSt] = useState([]);
const [isLoadingTableNode, setIsLoadingTableNode] = useState(true);

// Populate table1, table2, table3
const [table1, setTable1] = useState([]);
const [table2, setTable2] = useState([]);
const [table3, setTable3] = useState([]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isError, setIsError] = useState({ status: false, msg: '' });


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
                return; // Exit early if mode is not recognized
        }
    
        const fetchData = async () => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
            setTrainData([]); // Clear previous data
    
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
    
        return () => controller.abort(); // Cleanup on unmount or textName change
    }, [textName, limitLabelSel, offsetValue,trainValueSel]);
    
      
    //   useEffect(() => {
    //     if (!textName || !textName.data) return;
    //     if (textName.data.mode !== 'Trains') return;
      
    //     const url = `api/v2/treeview/alltrains/2?_s=&limit=${limitLabelSel}&offset=${offsetValue}`;
    //     fetchData(url);
    //   }, [limitLabelSel, offsetValue]);
      


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
    
    // Call fetchSvg with signal
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        setSvgContent(data);
      });
  
  
    // Cleanup on unmount or textName change
    return () => controller.abort();
  }, [textName,trainData]);

      useEffect(() => {
        if (!svgContent || !trainData.length) return;
      
        const svgRoot = svgContainerRef.current;
        if (!svgRoot) return;
      
        trainData.forEach((item) => {
          const title = svgRoot.querySelector('#northboundtext');
          if (title) {
            title.textContent = item.trainId; // or item.ipAddress or whatever data you want
          }
        });
      }, [trainData, svgContent]);
      


   


    const injectTextToSvg = (svgString, trainId) => {
        if (!svgString || !trainId ) return null
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const titleElement = svgDoc.querySelector('#northboundtext');
        if (titleElement) {
          titleElement.textContent = trainId;
        }
        return svgDoc.documentElement.outerHTML;
      };
    //   const table1 = [];
    //   const table2 = [];
    //   const table3 = [];
     
    //   trainData.forEach((item, index) => {
    //     if (index % 3 === 0) {
    //       table1.push(item);
    //     } else if (index % 3 === 1) {
    //       table2.push(item);
    //     } else {
    //       table3.push(item);
    //     }
    //   });
    



// Split into 3 tables
const splitIntoThreeTables = (data) => {
    const t1 = [], t2 = [], t3 = [];
    data.forEach((item, index) => {
        if (index % 3 === 0) t1.push(item);
        else if (index % 3 === 1) t2.push(item);
        else t3.push(item);
    });
    return [t1, t2, t3];
};

// When trainData or tableNodeSt updates
// useEffect(() => {
//     if (trainData.length > 0 || results.length > 0) {
//         // Merge trainData and tableNodeSt with links
//         // const enrichedData = trainData.map(item => createLinks(item, results));

//         // Split into tables
//         const [t1, t2, t3] = splitIntoThreeTables(trainData);
//         setTable1(t1);
//         setTable2(t2);
//         setTable3(t3);
//         setIsLoadingTableNode(false);
//     }
// }, [trainData, results]);
useEffect(() => {
    if (trainData.length > 0) {
        const [t1, t2, t3] = splitIntoThreeTables(trainData);
        setTable1(t1);
        setTable2(t2);
        setTable3(t3);
    }
}, [trainData]);


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

    if (status === 'success') {
      console.log(`Worker for nodeId ${nodeId} completed successfully`, data);
      setResults((prevResults) => [...prevResults, { nodeId, data }]);
    } else {
      console.error(`Worker for nodeId ${nodeId} failed: ${message}`);
    }
  };

  // Function to create workers for each nodeId and call API B
  const callApiBForEachNode = (apiB) => {
    // For each object in dataA, spawn a new worker
    trainData.forEach((item) => {
      const worker = new Worker(new URL('./worker.jsx', import.meta.url), { type: 'module' });
      
      // Set up the worker's response handler
      worker.onmessage = handleWorkerResponse;

      // Post the message to the worker with the data for API B
      worker.postMessage({
        nodeId: (item.nodeid ?? 0),  // Use item id as nodeId
        apiB: apiB  // URL for API B
      });
    });
};

useEffect(() => {
    if (trainData.length > 0) {
    //   setIsLoading(true);
      const apiB = 'http://localhost:8980/metronms/api/v2/nodelinks/ping?nodeId=';  // Example API B

      // Start the workers
      callApiBForEachNode(apiB);
    }
  }, [trainData]);



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
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-6">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: injectTextToSvg(svgContent, event.trainId || `Train-${index}`),
                                        }}
                                    />
                                    <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6>
                                     {/* <h6 style={{ margin: '0px' }}>
                                    {event.links && event.links.length > 0 
                                        ? event.links.map(link => link.type).join(', ') 
                                        : 'Loading...'}
                                    </h6> */}

                                    </td>
                                    <td className="col-6" style={{width:'400px'}}><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
                                ))}

                                 {isLoadingTableNode && trainData.length > 0 && (
        <tr>
            <td colSpan="12" style={{ textAlign: 'center' }}>
                Loading additional data...
            </td>
        </tr>)}


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
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-3">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: injectTextToSvg(svgContent, event.trainId || `Train-${index}`),
                                        }}
                                    />
                                   <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6>
                                    {/* <h6 style={{ margin: '0px' }}>
                                    {event.links && event.links.length > 0 
                                        ? event.links.map(link => link.type).join(', ') 
                                        : 'Loading...'}
                                    </h6> */}

                                    </td>
                                    <td className="col-5"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
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
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative'}}>
                                    <td className="col-5">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: injectTextToSvg(svgContent, event.trainId || `Train-${index}`),
                                        }}
                                    />
                                    <h6 style={{margin:'0px'}}>Critical : {event.critical}</h6>
                                    <h6 style={{margin:'0px'}}>Major : {event.major}</h6>
                                    <h6 style={{margin:'0px'}}>Warning : {event.warning}</h6>
                                    <h6 style={{ margin: '0px' }}>
                                    {/* {event.links && event.links.length > 0 
                                        ? event.links.map(link => link.name).join(', ') 
                                        : 'Loading...'} */}
                                    </h6>

                                    </td>
                                    <td className="col-5"><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                    <i class="fas fa-file-export trainexpor" role="button" tabindex="0">
                                        </i>
                                    </td>
                                </tr>
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