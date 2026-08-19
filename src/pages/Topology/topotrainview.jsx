import React,{useState,useEffect,useRef, useCallback} from "react";
import southboundtr from '../../assets/img/Train_southbound_new.svg'
import northboundtr from '../../assets/img/Train_northbound_new.svg'
import northgreen from '../../assets/Train_northboundgreen.svg'
import southred from '../../assets/Train_southboundgreen.svg'
import { Prev } from "react-bootstrap/esm/PageItem";
import '../ornms.css';

const TrainView=({textName,parentTextName,childrenTextName})=>{

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [svgContent, setSvgContent] = useState("");
    const [error, setError] = useState("");
    const svgContainerRef = useRef(null);
    const [limitValueSel,setLimitValueSel] =  useState('2');
    const [limitLabelSel,setLimitLabelSel] = useState('45');
     const [trainValueSel,setTrainValueSel] =  useState('select');
    const [trainLabelSel,setTrainLabelSel] = useState('Select');
    const [offsetValueDisplay,setOffsetValueDisplay] = useState(1);
    const [offsetValue,setOffsetValue] = useState(0);
    const workersRef = useRef([]);
    const requestIdRef = useRef(0);
      const [trainData, setTrainData] = useState([]);
      const [processedTrains, setProcessedTrains] = useState([]);
       const [results, setResults] = useState([]);
    const [tableNodeSt, setTableNodeSt] = useState([]);
const [apiUrl, setApiUrl] = useState("");
    const [svgContentNorth,setSvgContentNorth] = useState("");
    const [showPopup,setShowPopup] = useState(false);
    const [linkStatDt,setLinkStatDt] = useState([]);
    const [popupLoading, setPopupLoading] = useState(false);
    const [showWarningPopup,setShowWarningPopup] = useState(false);
const [table1, setTable1] = useState([]);
const [table2, setTable2] = useState([]);
const [table3, setTable3] = useState([]);


useEffect(() => {
    const fetchData = async () => {
        let url = "";

        if (!trainValueSel || trainValueSel === 'select') {
            const facId = parentTextName?.data?.id ?? '';
            url = `api/v2/treeview/alltrains/${facId}?_s=&limit=${limitLabelSel}&offset=${offsetValue}`;
        }

        else if (trainValueSel === 'mainline') {
            const node = childrenTextName.find(n => n?.data?.mode === 'mainline');
            if (node) {
                url = `api/v2/treeview/alltrains/${node.data.id}?_s=&limit=${limitLabelSel}&offset=${offsetValue}`;
            }
        }

        else if (trainValueSel === 'yard') {
            const node = childrenTextName.find(n => n?.data?.mode === 'yard');
            if (node) {
                url = `api/v2/treeview/alltrains/${node.data.id}?_s=&limit=${limitLabelSel}&offset=${offsetValue}`;
            }
        }

        if (url) {
            await getTopotrainMainlineData(url);
        }
    };

    fetchData();

      const intervalId = setInterval(() => {
        fetchData();
    }, 30000);

    return () => clearInterval(intervalId);

}, [trainValueSel, parentTextName, childrenTextName, limitLabelSel, offsetValue]);


const getTopotrainMainlineData = async (apiUrl) => {
    const controller = new AbortController();
    const signal = controller.signal;

    setIsLoading(true);
    setIsError({ status: false, msg: "" });

    try {
        const token = btoa("admin:admin");

        const response = await fetch(apiUrl, {
            method: "GET",
            headers: { Authorization: `Basic ${token}` },
            signal,
        });

        const data = await response.json();

        if (response.ok) {
            setTrainData(data || []);
        } else {
            throw new Error("data not found");
        }
    } catch (err) {
        if (err.name !== "AbortError") {
            setIsError({ status: true, msg: err.message });
        }
    } finally {
        setIsLoading(false);
    }

    return () => controller.abort();
};

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
  }, [textName]);



useEffect(() => {
    const controller = new AbortController();
    
    let svg = 'TTC_SubwayMap.svg';

    if (textName !== "") {
        if (textName && textName.data && textName.data.mode=== 'Trains' || textName.data.mode === 'mainline') {
          svg = 'Train_northbound_new.svg';
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
        setSvgContentNorth(data);
      });
  
  
    return () => controller.abort();
  }, [textName]);

    const injectTextToSvg = useCallback((svgString, trainId,event,digit) => {
        if (!svgString || !trainId ) return null
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
        const titleElement = svgDoc.querySelector('#northboundtext');
        const paths = svgDoc.querySelectorAll('path.pointer');
        let  shouldBeGreen = true;
        if (titleElement) {
            titleElement.textContent = trainId + (digit === 1 ? digit : '6');
            titleElement.style.fontSize = '15px'
        }
        if(trainLabelSel !== 'Mainline' && trainLabelSel !== 'Yard'){
            if (paths[0]) {
            const firstPath = paths[0];
               firstPath.setAttribute('fill', shouldBeGreen ? '#02d4c7' : '#e4837a');

            }
         }else{
            if (paths.length > 0 && (trainLabelSel === 'Mainline' || trainLabelSel === 'Yard')) {
                paths.forEach(path => {
                const firstNodeId = event?.cabNode1Status === false ? false : true;
                const secondNodeId = event?.cabNode6Status === false ? false : true;

                const isCab1Match = firstNodeId ;

                const isCab6Match = secondNodeId;
                let  shouldBeGreen = true;
                if (isCab1Match) { 
                    shouldBeGreen = true;
                }else if(isCab6Match){
                    shouldBeGreen = true;
                }else {
                    shouldBeGreen = false;
                }

                path.setAttribute('fill', shouldBeGreen ? '#02d4c7' : '#e4837a');
            });}   
        }
        
        return svgDoc.documentElement.outerHTML;
      },[trainLabelSel,textName,trainData]);

const splitIntoThreeTables = (data) => {
    const t1 = [], t2 = [], t3 = [];
    data.forEach((item, index) => {
        if (index % 3 === 0) t1.push(item);
        else if (index % 3 === 1) t2.push(item);
        else t3.push(item);
    });
    return [t1, t2, t3];
};


useEffect(() => {
    if (!svgContent || !svgContentNorth || trainData.length === 0) return;
     const modified = trainData.map(event => ({
        ...event,
        svgUpOne: injectTextToSvg(svgContent, event.trainId, event, 1),
        svgDownOne: injectTextToSvg(svgContentNorth, event.trainId, event, 1),
        svgUp: injectTextToSvg(svgContent, event.trainId, event, 6),
        svgDown: injectTextToSvg(svgContentNorth, event.trainId, event, 6)
    }));


    setProcessedTrains(modified);

    const [t1, t2, t3] = splitIntoThreeTables(modified);
    setTable1(t1);
    setTable2(t2);
    setTable3(t3);

}, [svgContent, svgContentNorth,trainData,trainLabelSel,textName]);


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
        setOffsetValueDisplay(1);
        setOffsetValue(0);
        let selectedIndex = event.target.selectedIndex;
        setLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setLimitLabelSel(label)
    }

      const handleTrains=(event)=>{
        setOffsetValueDisplay(1);
        setOffsetValue(0);
        setLimitValueSel('2');
        setLimitLabelSel('45');
        let selectedIndex = event.target.selectedIndex;
        let value = event.target.options[selectedIndex].value;
        setTrainValueSel(value);
        let label = event.target.options[selectedIndex].label;
        setTrainLabelSel(label);
    }


     const getServerStatusDt = async (url) => {
    setPopupLoading(true);
    setIsError({ status: false, msg: "" });
    const dt = new Date();
    try {
      const username = "admin";
      const password = "admin";
      const token = btoa(`${username}:${password}`);
      const options = {
        method: "GET",
        headers: {
          "Authorization": `Basic ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);

      if (response.status === 200) {
        const data = await response.json();
             if (data && data.links.length > 0) {
              setLinkStatDt(data.links)
            } 
      } else if (response.status === 304) {
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      setIsError({ status: true, msg: error.message });
    } finally {
      setPopupLoading(false);
    }
  };


    const handleTrainPopup=(id)=>{
    if (!id) {
        setShowWarningPopup(true);
        return;
    }
     setShowPopup(true);
      const  url = `api/v2//nodelinks/linkstats?nodeId=${id}`;
        getServerStatusDt(url);
  }


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
                                <article className="trainsel">
                                <label for="" className="selectlbl">Select Section :</label>
                                <select className="form-controll1" value={trainValueSel} onChange={handleTrains} style={{ width: "auto", display: 'inline-block' }} aria-invalid="false">
                                    <option value="select" label="Select" disabled>Select</option>
                                    <option value="mainline" label="Mainline">Mainline</option>
                                    <option value="yard" label="Yard">Yard</option>
                                </select>
                                </article>
                           {trainLabelSel !== 'Mainline' && trainLabelSel !== 'Yard' ? (
<article className="boundimg" >
                                <img src={northboundtr} alt="northtr" />
                                <img src={southboundtr} alt="southtr" style={{float:'right'}} />
                            </article>
                           ): (<article className="boundimg" >
                                <img src={northgreen} alt="northtr"/>
                                <img src={southred} alt="southtr" style={{float:'right'}} />
                            </article>)} 
                            {trainLabelSel !== 'Mainline' && trainLabelSel !== 'Yard' ? (<article className="boundimg">
                                <span className="southtxt">South Bound</span>
                                <span className="northtxt">North Bound</span>
                            </article>):(<article className="boundimg">
                                <span className="southtxt" style={{padding:"0 24px"}}>Up</span>
                                <span className="northtxt" style={{padding:"0 24px"}}>Down</span>
                            </article>)}
                            </article>
                            <hr />
                            <article style={{position:'relative',height:'82vh',overflow:'auto'}}>
                            {!isLoading && !isError.status && table1 && table1.length > 0 &&  <table className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3 bordeer-allsd" style={{ height: 'auto', margin:'0 20px' }}>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className="traintbone">


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
                                        __html: event.direction === 'NBNE' ? event.svgUpOne : event.svgDownOne
                                        }}
                                    />
                                    </td>

                                    <td className="col-8"><div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                     <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: event.direction === 'NBNE' ? event.svgUp : event.svgDown
                                        }}
                                    />
                                    </td>
                                    <td className="col-8">
                                        <div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
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
                    <tbody className="traintbone">


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
                                    <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: event.direction === 'NBNE' ? event.svgUpOne : event.svgDownOne
                                        }}
                                    />
                                    </td>
                                    <td className="col-8"><div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                 <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                   <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: event.direction === 'NBNE' ? event.svgUp : event.svgDown
                                        }}
                                    />
                                    </td>
                                    <td className="col-8"><div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
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
                    <tbody className="traintbone">


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
                                    <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: event.direction === 'NBNE' ? event.svgUpOne : event.svgDownOne
                                        }}
                                    />
                                    </td>
                                    <td className="col-8"><div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                 <tr key={index} className="col-12" style={{padding:'5px',position:'relative',borderBottom:'1px solid #212327d1'}}>
                                   <td className="col-4">
                                    <div
                                        dangerouslySetInnerHTML={{
                                        __html: event.direction === 'NBNE' ? event.svgUp : event.svgDown
                                        }}  
                                    />
                                    </td>
                                    <td className="col-8"><div><span>{event.station}</span> <br /> <span>{event.code}-{event.direction}</span>
                                        </div>
                                    <div style={{ marginTop: "5px" }} className="trainexpor">
                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleExport(event)}
                                        >
                                        <i className="fas fa-file-export"></i>
                                        </button>

                                        <button
                                        className="trainexporticon"
                                        // onClick={() => handleAdd(event)}
                                        >
                                        <i className="fa-solid fa-plus" onClick={()=> handleTrainPopup(event.nodeid)}></i>
                                        </button>
                                    </div>
                                    </td>
                                </tr>
                                </>
                                ))}


                    </tbody>
                </table>}

                                  {showPopup && (
                        <div className="firmwarepopupStyle">
                        <div className="trainpopupBoxStyle">
                            <article>
                                <i className="fa fa-close noticlose" role="button" tabindex="0" onClick={() => setShowPopup(false)} style={{ marginBottom: '5px', float: 'right',transform:'translateY(-8px)',fontSize:'15px',paddingRight:'12px' }}></i>
                           
                            </article>
                              {popupLoading ? (
                                <article style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        padding: "70px 0",
                                        fontSize: "15px"
                                    }}>
                                <p style={{paddingRight:'15px'}}>Loading...</p>
                                <div className="loader"></div>
                                </article>
                                ) : (
                            <article >
                            <article className="row" style={{marginTop:'20px',marginLeft:'20px'}}>
                                <article className="col-12" style={{display:'flex'}}>
                                    <article className="col-5">
                                         <label for="name" className="selectlbl">Cab Number</label>
                                    </article>
                                    <article className="col-1">
                                         <label for="name" className="selectlbl">:</label>
                                    </article>
                                    <article className="col-6">
                                         <label for="name" className="selectlbl">{linkStatDt?.[0]?.sysName}</label>
                                    </article>
                                </article>
                                <article className="col-12" style={{display:'flex'}}>
                                    <article className="col-5">
                                         <label for="name" className="selectlbl">LocalSnr  </label>
                                    </article>
                                    <article className="col-1">
                                         <label for="name" className="selectlbl">:</label>
                                    </article>
                                    <article className="col-6">
                                          <label htmlFor="name" className="selectlbl">
                                        {linkStatDt?.[0]?.localsnr}
                                        <i
                                            className="fa-solid fa-wifi"
                                            style={{
                                            color: linkStatDt?.[0]?.localsnr >= 30 ? 'green' : 'red',
                                            marginLeft: 10
                                            }}
                                        ></i>
                                        </label>
                                    </article>
                                </article>
                                <article className="col-12" style={{display:'flex'}}>
                                    <article className="col-5">
                                         <label for="name" className="selectlbl">Remote SNR</label>
                                    </article>
                                    <article className="col-1">
                                         <label for="name" className="selectlbl">:</label>
                                    </article>
                                    <article className="col-6">
                                      <label htmlFor="name" className="selectlbl">
                                        {linkStatDt?.[0]?.remotesnr}
                                        <i
                                            className="fa-solid fa-wifi"
                                            style={{
                                            color: linkStatDt?.[0]?.remotesnr >= 30 ? 'green' : 'red',
                                            marginLeft: 10
                                            }}
                                        ></i>
                                        </label>
                                    </article>
                                </article>
                            </article>
                            </article>
                        )}
                        </div>
                        </div>
                    )}

                            </article>
                            
            </article>

        </article>
           {showWarningPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Warning</h1>
                                    <p className="confirmtextsucess">Cab number is not found.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowWarningPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
        </>
    )
}

export default TrainView;