import { useState,useEffect, useRef } from "react";
import TreeList from "../Topology/treelist";
import '../ornms.css'
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import './../Topology/topology.css';
import TopoSvgViewer from "./toposvg";
import { text } from "d3";
import TopoSectionTable from "./toposectiontable";
import LineSvgViewer from "./topoLineSectsvg";
import StationNodeTableView from "./stationNodetableview";
import TrainView from "./topotrainview";
import YardView from "./yardview";
import YardTbsView from "./yardonetb";
import YardTbone from "./yardonetb";
import YardTbtwo from "./yardtwotb";
import TrainLineView from "./trainlineview";
import TrainLogs from "./trainlogs";
import StationSvg from "./stationsvg";
import WaysideTable from "../Wayside/waysidetable";
import WaysidePopupTable from "./waysidepopuptable";
import LineTagSvg from "../Wayside/linetagsvg";
import StationTagsTable from "../Wayside/stationtagstable";
import YardSvgViewer from "./yardsvg";
import MainlineView from "./mainlinetrainview";


const TopoPg = () => {

    const [textName, setTextName] = useState(null);
    const [parentTextName,setParentTextName] = useState(null);
    const [childrenTextName,setChildrenTextName] = useState(null);
    const [lineId, setLineId] = useState('');
    const [circleId, setCircleId] = useState('');
    const [stationCount, setStationCount] = useState(false);
    const [lineCount, setLineCount] = useState(false);
    const [lineTagview, setLineTagview] = useState(false);
    const [stationTagview, setStationTagview] = useState(false);
    const [rdData, setRdData] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentTagid, setCurrentTagid] = useState('');
    const rdDataRef =useRef(null);
    const [tagTypeValue, setTagTypeValue] = useState('all');
    const [allTagfailCount, setAllTagfailCount] = useState(false);
    const [tagTypeLabel,setTagTypeLabel] = useState('All');
    const [westSideView, setWestSideView] = useState('Line1');
    const [tagTableView,setTagTableView] = useState(false);
    const [selectedTab,setSelectedTab] = useState('linkview')
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [timeLeft, setTimeLeft] = useState(30);
    const [yardfacilitieData, setYardfacilitieData] = useState([]);
    const [selectedTreeNodeId, setSelectedTreeNodeId] = useState({});
    const [uniquefacilitieData,setUniquefacilitieData] = useState([]);
    const [stationNode, setStationNode] = useState(null);
    const [selectedPrevNodeId,setSelectedPrevNodeId] = useState({});
    const [prevIdActive,setPrevIdActive] = useState(false);
    const previousViewRef = useRef(null);
    // const textNameChangedRef = useRef(false);
    const [textNameChanged, setTextNameChanged] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const yardfacilitieDataRef = useRef(null);
    const trainDataRef = useRef(null);
    const [stationIdFromSvg, setStationIdFromSvg] = useState(null);
    const [trainData, setTrainData] = useState('');
    const [stationRefreshKey, setStationRefreshKey] = useState(0);
    const hasRun = useRef(false);
    const [enableStationPolling, setEnableStationPolling] = useState(true);

    const handleNodeClick = (value,parent) => {
        setTextNameChanged(true); 
        
        setCircleId('');
        setLineId('');
        setStationTagview(false);
        setLineTagview(false);
        setStationView(true);
        setTrainView(false);

        setTextName({...value});
        setParentTextName(parent);
        setTimeLeft(30);
        // nodeData
         setSelectedPrevNodeId({
        id: value.data?.id,         
        path: value.path || [],      
    });
    setPrevIdActive(false);

    previousViewRef.current = null;  
    }


const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState({ status: false, msg: "" });
const [trainView,setTrainView]= useState(false);
const [stationView,setStationView]= useState(true);
const [trainLabelDiply,setTrainLabelDiply] = useState(false);
const [trainId,setTrainId] = useState('');

useEffect(()=>{
    if (!stationNode) return;
    // setTextName(stationNode);
     goToStationView(stationNode);
},[stationNode]);

useEffect(()=>{
        if (!circleId) return;
        // let url= `api/v2/facilities?_s=uniqueName==${circleId}`;
        // getUniquefacilitieData(url);

    },[circleId]);

useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          return 30; 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);


    const getUniquefacilitieData = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            setUniquefacilitieData(data || []);
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
};
 

  const getYardfacilitieData = async (urlStation) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
        const response = await fetch(urlStation, {
            method: "GET",
            headers: {
                'Authorization': `Basic ${btoa('admin:admin')}`
            }
        });
        const data = await response.json();
        if (response.ok) {
            setYardfacilitieData(data || []);
             yardfacilitieDataRef.current=data;
            setIsError({ status: false, msg: "" });
        } else {
            throw new Error("Data not found");
        }
    } catch (error) {
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
};

  const getTrainData = async (urlTrains) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            // const url = `api/v2/treeview/trains/${textName.data.id}`;
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(urlTrains, options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setTrainData(data);
                trainDataRef.current = data;
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };
 const textNameIntervalRef = useRef(null);
const stationSvgIntervalRef = useRef(null);
// const prevStationIdRef = useRef(null);

useEffect(()=>{
        if (!textName?.data) return;
        setTrainData('');
        if (circleId) return;
        if(textName?.data?.mode !== 'facility') return;
        let intervalId;
        const stationId = textName?.data?.id;
        if (!stationId) return;
        if (stationId === null) return;
        if(!stationId || selectedTab !== 'tagtable') {
        const urlStation= `api/v2/treeview/station/${stationId}`;
        const urlTrains = `api/v2/treeview/trains/${stationId}`;
         if (textNameIntervalRef.current) {
            clearInterval(textNameIntervalRef.current)
        };
        getYardfacilitieData(urlStation);
        getTrainData(urlTrains);

          textNameIntervalRef.current  = setInterval(() => {
            getYardfacilitieData(urlStation);
            getTrainData(urlTrains);
        }, 30000);
        }

         return () => {
             if (textNameIntervalRef.current) {
            clearInterval(textNameIntervalRef.current);
            textNameIntervalRef.current = null;
            }
        };

    },[textName,selectedTab]); 

// const prevStationIdRef = useRef(null);
// const stationIdRef = useRef(null);

// useEffect(() => {
//   if (stationIdFromSvg) {
//     stationIdRef.current = stationIdFromSvg;
//   }
// }, [stationIdFromSvg]);

useEffect(() => {
  if (!enableStationPolling) return;
  if (stationRefreshKey < 0) return;
  if (!stationIdFromSvg) return;

  const stationId = stationIdFromSvg;

    const urlStation = `api/v2/treeview/station/${stationId}`;
    const urlTrains = `api/v2/treeview/trains/${stationId}`;
    const fetchData = () => {
    getYardfacilitieData(urlStation);
    getTrainData(urlTrains);
  };

//   if (prevStationIdRef.current !== stationId) {
//     prevStationIdRef.current = stationId;
    fetchData();
//   }

   if (stationSvgIntervalRef.current) clearInterval(stationSvgIntervalRef.current);


   stationSvgIntervalRef.current = setInterval(fetchData, 30000);

//   return () => clearInterval(intervalId);
 return () => {
    if (stationSvgIntervalRef.current) {
      clearInterval(stationSvgIntervalRef.current);
      stationSvgIntervalRef.current = null;
    }
  };

}, [stationRefreshKey, selectedTab, stationIdFromSvg, enableStationPolling]);


// useEffect(() => {
//   if (stationRefreshKey < 0) return;
//   if (!stationIdFromSvg) return;

//   const stationId = stationIdFromSvg;
//   const urlStation = `api/v2/treeview/station/${stationId}`;
//   const urlTrains = `api/v2/treeview/trains/${stationId}`;

//   const stationChanged = prevStationIdRef.current !== stationId;
//   const refreshTriggered = !stationChanged && stationRefreshKey >= 0;

//   if (stationChanged || refreshTriggered) {
//     prevStationIdRef.current = stationId;
//     getYardfacilitieData(urlStation);
//     getTrainData(urlTrains);
//   }

//   const intervalId = setInterval(() => {
//     getYardfacilitieData(urlStation);
//     getTrainData(urlTrains);
//   }, 30000);

//   return () => clearInterval(intervalId);

// }, [stationIdFromSvg]);


    // useEffect(()=>{
    //     if(!circleId) return;
    //     // let intervalId;
    //     // if(selectedTab) return;
    //     // if (selectedTab !== 'linkview') return;
    //     if(stationRefreshKey <0) return; 
    //     if (!stationIdFromSvg) return;
    //     const stationId = stationIdFromSvg;
    //     if (!stationId) return;
    //     if (stationId === null) return;
    //     // if(!stationId || selectedTab !== 'tagtable') {
    //     const urlStation= `api/v2/treeview/station/${stationId}`;
    //     const urlTrains = `api/v2/treeview/trains/${stationId}`;
    //      if (prevStationIdRef.current !== stationId) {
    //          prevStationIdRef.current = stationId;
    //     getYardfacilitieData(urlStation);
    //     getTrainData(urlTrains);
    //      }

    //     const intervalId = setInterval(() => {
    //         getYardfacilitieData(urlStation);
    //         getTrainData(urlTrains);
    //     }, 30000);
    //     // }

    //      return () => {
    //         if (intervalId) clearInterval(intervalId);
    //     };

    // },[stationIdFromSvg]); 


    // useEffect(()=>{
    //     // if(!circleId) return;
    //     // let intervalId;
    //     // if (selectedTab === 'linkview') return;
    //     if(stationRefreshKey <0) return; 
    //     if (!stationIdFromSvg) return;
    //     const stationId = stationIdFromSvg;
    //     if (!stationId) return;
    //     if (stationId === null) return;
    //     // if(!stationId || selectedTab !== 'tagtable') {
    //     const urlStation= `api/v2/treeview/station/${stationId}`;
    //     const urlTrains = `api/v2/treeview/trains/${stationId}`;
    //       if (prevStationIdRef.current === stationId) {
    //          prevStationIdRef.current = stationId;
    //     getYardfacilitieData(urlStation);
    //     getTrainData(urlTrains);
    //       } 
    //     const intervalId = setInterval(() => {
    //         getYardfacilitieData(urlStation);
    //         getTrainData(urlTrains);
    //     }, 30000);
    //     // }

    //      return () => {
    //         if (intervalId) clearInterval(intervalId);
    //     };

    // },[stationRefreshKey]); 

// useEffect(() => {
//   if (stationRefreshKey < 0) return;
//   if (!stationIdFromSvg) return;
// //   if (selectedTab) return;

//   const stationId = stationIdFromSvg;
//   const urlStation = `api/v2/treeview/station/${stationId}`;
//   const urlTrains = `api/v2/treeview/trains/${stationId}`;

//  
//   getYardfacilitieData(urlStation);
//   getTrainData(urlTrains);

//   const intervalId = setInterval(() => {
//     getYardfacilitieData(urlStation);
//     getTrainData(urlTrains);
//   }, 30000);

//   return () => clearInterval(intervalId);
// }, [stationIdFromSvg, stationRefreshKey, selectedTab]);



    const renderSectComponent=(textName)=>{
        switch (textName?.text) {
            case 'line1-sec1':
              return   <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                <TopoSectionTable  textName={textName}/> </>
                break;
            case 'line1-sec2':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                         <TopoSectionTable  textName={textName}/> </>
                    break;
            case 'line4-sec1':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                            <TopoSectionTable  textName={textName}/> </>
                    break;
            case 'line1':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                            </>
                    break;
            case 'line4':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                           </>
                    break;
            case 'Global':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                             </>
                    break;
            default:
                return <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                break;
        }
    }

    

    const renderSectFacility=(textName)=>{
        switch (textName?.data?.mode) {
            case 'facility':{
                if(textName.data.display === 'davisville_track' || textName.data.display ==='wilson_track' || textName.text === 'Finch trail track' || textName.text ==='VMC trail track' ){
                    return(
                    <>
                      <TopoSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName}/>
                        <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} />
                        {/* <YardTbtwo textName={textName}/> */}
                    </>
                    );
                }else if (textName.text === 'Carhouse' ){
                    return (
                        <>
                        <YardSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName}/>
                <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} />
            {/* <YardTbtwo textName={textName}/> */}
                        </>
                    )
                }else{
                    return ( <> <StationSvg trainId={trainId} textName={textName} setTrainLabelDiply={setTrainLabelDiply} trainView={trainView} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} setStationTagview={setStationTagview} setLineTagview={setLineTagview}  goToStationView={goToStationView} yardfacilitieData={yardfacilitieData} yardfacilitieDataRef={yardfacilitieDataRef} trainData={trainData} trainDataRef={trainDataRef} stationIdFromSvg={stationIdFromSvg}/>
              <StationNodeTableView  yardfacilitieData={yardfacilitieData} textName={textName} rdDataRef={rdDataRef} />
                      </> );
                }
            }
                break;
            case 'Trains':
                return  <TrainView textName={textName} parentTextName={parentTextName} childrenTextName={childrenTextName}/>
                    break;
            case 'mainline':
                return  <MainlineView textName={textName}/>
                    break;
            case 'yard':
                return  <>
                <TopoSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName} childrenTextName={childrenTextName}/>
                <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} childrenTextName={childrenTextName}/>
            {/* <YardTbtwo textName={textName}/> */}
                </>
                    break;
            default:
                return null;
                break;
        }
    }
     const renderTagView = (stationTagview, lineTagview) => {
        if (stationTagview) {
            return <>
                <StationSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} setStationTagview={setStationTagview} setLineTagview={setLineTagview} stationNode={stationNode}  goToStationView={goToStationView} yardfacilitieData={yardfacilitieData}  yardfacilitieDataRef={yardfacilitieDataRef} trainData={trainData} trainDataRef={trainDataRef} stationIdFromSvg={stationIdFromSvg}/>
              <StationNodeTableView yardfacilitieData={yardfacilitieData}  textName={textName} rdDataRef={rdDataRef} stationNode={stationNode} />
            </>
        } else if (lineTagview) {
            return <>
               <LineTagSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef}  setStationTagview={setStationTagview} setLineTagview={setLineTagview} stationNode={stationNode}/>
              <StationNodeTableView yardfacilitieData={yardfacilitieData}  textName={textName} rdDataRef={rdDataRef} stationNode={stationNode} />
            </>;
        } else {
            return null;
        }
    }


    const getNodeLabel = (node) => {
    const mode = node.data?.mode;
  
    if (mode === "region" || mode === "location") {
      return node.data?.display || node.text || "Unknown";
    }else if (mode === "facility" && (node.text === "Davisville" || node.text === "Wilson")) {
      return `Yard- ${node.text}` || "Unnamed Facility";
    }else if (mode === "facility" && (node.text === "Finch trail track" || node.text === "VMC trail track" || node.text === 'Carhouse')) {
      return `${node.text}` || "Unnamed Facility";
    }
    // else if (stationTagview === true) {
    //     return `Station- ${circleId}`;
    // }
    else if ( mode === "facility" || node.data?.parent === "yard_1") {
      return `Station- ${node.text}` || "Unnamed Facility";
    } else {
      return node.data?.display || node.text || "Unknown";
    }
  };

   const getTabLabel = (textName) => {
     const mode = textName?.data?.mode;
  
    if ((mode === "region" || mode === "location") && stationTagview === false  && lineTagview === false) {
      return (
      <span>
        Link View - {textName.data.display}
      </span>
    );
    }else if(mode === "location"){
        return (
      <span>
            Link View - {textName.data.display}
        {/* <span onClick={(e)=>{ 
            e.stopPropagation();
            handleStationTabview();}} style={{ marginLeft: '8px', cursor: 'pointer' }}>x</span> */}
      </span>
    );
    } else if(mode === "facility"){
         return (
      <span>
        Link View - Station View
      </span>)
    } 
    else if (
      mode === "AP" || 
      mode === "CAM" || 
      mode === "transcoder" || 
      mode === "encoder"
    ) {
      return textName.data?.systemname || "Unnamed Device";
    } else if (textName?.data?.parent === "yard_1") {
      return textName.text || "Unnamed Facility";
    } else if (textName?.data?.parent === "yard") {
      return textName.data?.display || "Unnamed Yard";
    }else if (mode === 'global') {
      return "Link View"; 
    }
//     else if (stationTagview === true){
//          return (
//       <span>
//         Link View - Station Tag
//         {/* <span onClick={(e)=>{ 
//             e.stopPropagation();
//             handleStationTabview();}} style={{ marginLeft: '8px', cursor: 'pointer' }}>x</span> */}
//       </span>
//    ) }
   else if (lineTagview === true){
         return (
      <span>
        Link View - Line Tag
        {/* <span onClick={(e)=>{ 
            e.stopPropagation();
            handleStationTabview();}} style={{ marginLeft: '8px', cursor: 'pointer' }}>x</span> */}
      </span>
   ) } 
   else {
      return "Link View"; 
    }
  };



    const renderSectTrainView=(trainView)=>{
        if(trainView){
            return <>
                <TrainLineView trainId={trainId}/>
                <TrainLogs trainId={trainId}/>
            </>
        }
    }

    const handleTrainStatusHide=()=>{
        setTrainView(false);
        setTrainLabelDiply(false);
        setStationTagview(true);
    }

    const handleTrainVwVisible=()=>{
    if (!previousViewRef.current) return;

  const prev = previousViewRef.current;
    setEnableStationPolling(false);
    setTextName(prev.textName);
    setStationView(prev.stationView);
    setTimeLeft(30);
    // setStationTagview(prev.stationTagview);
    setStationTagview(false);
    setLineTagview(prev.lineTagview);
    setTrainView(prev.trainView);
    setSelectedTreeNodeId(prev.selectedTreeNodeId);
    setPrevIdActive(true);
    previousViewRef.current = null;
    return;
  }
        // setTrainView(false);
        // setStationView(true);
        // setTrainLabelDiply(false);  
        // setStationTagview(false);
        // setLineTagview(false);
    // }

    const goToStationView = (stationNode) => {
  if (!previousViewRef.current) {
    previousViewRef.current = {
      textName,
      stationView,
      stationTagview,
      lineTagview,
      trainView,
    selectedTreeNodeId, 
    };
  }

  setTextNameChanged(false);         
  setTextName({ ...stationNode });
  setStationView(true);
  setStationTagview(false);
  setLineTagview(false);
  setTrainView(false);
};

    const handleStationVwVisible=()=>{
        setTrainView(false);
        setStationView(true);
    }
    const handleTrainVwTab=()=>{
        setTrainView(true);
        setStationView(false);
    }

    const getCircleId = (id) => {
          if (!previousViewRef.current) {
    previousViewRef.current = {
      textName,
      stationView,
      stationTagview,
      lineTagview,
      trainView,
    };
  }
        setEnableStationPolling(true);
        setCircleId(id);
        setSelectedTreeNodeId({ id: id,
            path: ["global", "region", "location"]}); 
        setStationTagview(true);
        setTimeLeft(30);
        setStationCount(prev => !prev);
        setStationView(false);
        setPrevIdActive(false);
        setStationRefreshKey(prev => prev + 1);
        // setTextName('');

    }
    const getLineId = (id) => {
        setLineId(id);
        setLineTagview(true);
        setLineCount(prev => !prev)
        setStationView(false);

    }


       const fetchDataRadial = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`
                }

            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                setIsLoading(false);
                if(Object.keys(data).length === 0){
                   setRdData([]) 
                }
                setRdData(Array.isArray(data) ? data : [data]);
                rdDataRef.current = Array.isArray(data) ? data : [data]
                setCircleId('');
                setLineId('');
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

        useEffect(() => {
    let url = '';
    if (circleId) {
        url = `api/v2/wayside/tagdetails?station=${circleId}`;
    } else if (lineId) {
        url = `api/v2/wayside/tagdetails?station=${lineId}`;
    }else if(textName?.data?.mode === 'facility'){
        url = `api/v2/wayside/tagdetails?station=${textName.data.display}`;
    }

    if (url) {
        fetchDataRadial(url);

        const intervalId = setInterval(()=>{
            fetchDataRadial(url);
        },30000)

        return()=> clearInterval(intervalId);
    }
}, [circleId, lineId,textName,selectedTab]);

    const handleTagsPopup = (value, id) => {
        setShowPopup(value);
        setCurrentTagid(id);
    }

     const handleTagType = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setTagTypeValue(selectElement.value);
        setTagTypeLabel(label);

    }
     const handleStationTabview = () => {
        if(stationTagview === true){
            setStationTagview(false);
        }
        if(lineTagview === true){
            setLineTagview(false);
        }
        setStationView(true);
        setAllTagfailCount(prev => !prev);
        if(textName?.data?.mode === 'facility'){

        }
    }

    const handleTagTableView=()=>{
        setTagTableView(true);
        setSelectedTab('tagtable');
        setTimeLeft(30);
    }

    const handleLinkView=()=>{
        setTagTableView(false);
        setSelectedTab('linkview');
        setTimeLeft(30);
    }

    const canGoBack = Boolean(previousViewRef.current);

    const handleChildrenData = (data) => {
        setChildrenTextName(data);
    };

    return (
        <article className="display-f">
           
           <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
            <LeftNavList  className='leftsidebar'/>
            </article>
            <article className="container-fluid">
            <article className="row sect-padd">
                <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <article className="border-allsd" style={{ height: '90vh', margin: '5px 5px 0 5px' }}>
                        <article className="row">
                            <article className="col-7">
                                <h1 className="topo-title">Topology</h1>
                            </article>
                            <article className="col-4" style={{ float: 'right' }}>
                                <article style={{ float: 'right' }}>
                                    {/* <button className="createbtn">Refresh</button> */}
                                </article>
                            </article>
                            <article className="row">
                                <article className="col-12">
                                    {/* <span className="radioSelct">Radio Mode:</span>
                                    <select className="form-controlfirm" value="select" style={{ width: "auto" }} aria-invalid="false">
                                        <option value="0" label="All">All</option>
                                        <option value="1" selected="selected" label="AP">AP</option>
                                        <option value="2" label="SU">SU</option>
                                    </select> */}
                                </article>
                            </article>
                        </article>
                        {/* <hr className="hrll" />
                        <article className="systemcont">
                            <article className="row">
                                <article className="col-6">
                                    <input type="text" className="form-controltopo" placeholder="IP Address" />
                                </article>
                                <article className="col-6">
                                    <article style={{float:'right'}}>
                                    <button className="createbtn">Search</button>
                                </article>
                                </article>
                            </article>
                        </article> */}
                        <hr  className="hrll" style={{marginBottom:'0px'}}/>
                        <article>
                        <TreeList getElementAtEvent={handleNodeClick} selectedNodeId={selectedTreeNodeId} circleId={circleId} onStationResolved={setStationNode} selectedPrevNodeId={selectedPrevNodeId} prevIdActive={prevIdActive}  onStationCircleIdChange={setStationIdFromSvg} stationRefreshKey={stationRefreshKey}
                       onChildrenData={handleChildrenData}
                       />
                            </article>
                            <article>
                            </article>

                    </article>
                </article>
                <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9 border-allsd" style={{ margin: '5px 0px 0 0px' }}>
                    <article className="">
                                    <article className="row border-b" style={{position:'relative'}}>
                                        <article className="col-6">
                        <ul className="linklist">
                            <li>
                            <button onClick={()=>{ handleStationVwVisible(); handleLinkView();}}  className={selectedTab === 'linkview' ? 'active' : ''}>
                                    {getTabLabel(textName)}
                                </button>
                            </li>

                           {trainLabelDiply ?  <li><a onClick={handleTrainVwTab}>{trainId}</a>
                           <button onClick={handleTrainStatusHide}>x</button>
                           </li> : '' }
                           <li>
                            <button onClick={handleTagTableView}  className={selectedTab === 'tagtable' ? 'active' : ''}>
                                    Tag Table
                                </button>
                           </li>
                        </ul>
                        </article>
                        <article className="col-6">
                          <h1 className="refreshtitle">Refreshing In :  <span style={{minWidth:'30px',maxWidth:'35px',display:"inline-block"}}> {timeLeft} </span> sec </h1>
                        </article>
                        </article>
                <>
                {tagTableView === true ? (
                    <>
                    <article style={{margin:'5px'}}>
                    <WaysideTable allTagfailCount={allTagfailCount} westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount} textName={textName}/>
                    </article>
                    {textName && textName?.data?.mode === 'facility' ? (<article style={{margin:'5px',marginTop:'15px'}}>
                    <StationTagsTable textName={textName} circleId={circleId} lineId={lineId}  rdDataRef={rdDataRef} />
                    </article>) : ('')}
                    {showPopup && (
                        <div className="popupStyle">
                        <div className="popupBoxStyle">
                            <WaysidePopupTable currentTagid={currentTagid} />
                            <button
                            type="button"
                            onClick={() => setShowPopup(false)}
                            className="createbtn"
                            style={{ marginTop: '20px', float: 'right' }}
                            >
                            Close
                            </button>
                        </div>
                        </div>
                    )}
                    </>
                ) : (
                    <>
                    {((!textName && stationTagview === true)) &&(
                            <>
                            <article className="row">
                        <article className="col-4">
                            {trainView === true ? (
                            <h1 className="mapheading">Train View : {trainId}</h1>
                            ) : (
                                <>
                            <h1 className="mapheading"> {rdDataRef.current?.[0]?.station && `Station- ${rdDataRef.current[0].station}`}</h1>
                            </>
                            )}
                        </article>
                        <article className="col-8" style={{justifyContent:'end',display:'flex',paddingTop:'6px',paddingRight:'8px'}}>
                          {trainView === true ? (
                           ''
                            ) : (
                                <>
                              {/* {stationView === false ? <button className="createbtn" type="button" onClick={handleTrainVwVisible}>Back</button> : ''} */}
                              {canGoBack && (
  <button className="createbtn" onClick={handleTrainVwVisible}>
    Back
  </button>
)}

                            </>
                            )}
                        </article>
                        </article>
                            </>
                    )}

                    {((textName !== '' && stationTagview === true)) &&(
                            <>
                            <article className="row">
                        <article className="col-4">
                            {trainView === true ? (
                            <h1 className="mapheading">Train View : {trainId}</h1>
                            ) : (
                                <>
                            <h1 className="mapheading"> {rdDataRef.current?.[0]?.station && `Station- ${rdDataRef.current[0].station}`}</h1>
                            </>
                            )}
                        </article>
                        <article className="col-8" style={{justifyContent:'end',display:'flex',paddingTop:'6px',paddingRight:'8px'}}>
                          {trainView === true ? (
                           ''
                            ) : (
                                <>
                              {/* {stationView === false ? <button className="createbtn" type="button" onClick={handleTrainVwVisible}>Back</button> : ''} */}
                              {canGoBack && (
  <button className="createbtn" onClick={handleTrainVwVisible}>
    Back
  </button>
)}

                            </>
                            )}
                        </article>
                        </article>
                            </>
                    )}
                    {((['facility', 'location', 'region'].includes(textName?.data?.mode)) && stationTagview === false) && (
                        <article className="row">
                        <article className="col-4">
                            {trainView === true ? (
                            <h1 className="mapheading">Train View : {trainId}</h1>
                            ) : (
                                <>
                            <h1 className="mapheading">{getNodeLabel(textName)}</h1>
                            </>
                            )}
                        </article>
                        <article className="col-8" style={{justifyContent:'end',display:'flex',paddingTop:'6px',paddingRight:'8px'}}>
                          {trainView === true ? (
                           ''
                            ) : (
                                <>
                              {/* {stationView === false ? <button className="createbtn" type="button" onClick={handleTrainVwVisible}>Back</button> : ''} */}
                              {canGoBack && (
  <button className="createbtn" onClick={handleTrainVwVisible}>
    Back
  </button>
)}

                            </>
                            )}
                        </article>
                        </article>
                    )}
                    <hr className="topohr" />

                    {/* {stationView === true ? (
                        textName?.data &&
                        ['facility', 'Trains', 'mainline', 'yard'].includes(textName.data.mode) ? (
                        renderSectFacility(textName)
                        ) : (
                        renderSectComponent(textName)
                        )
                    ) : (
                        (stationTagview || lineTagview) && renderTagView(stationTagview, lineTagview)
                    )} */}
                    {stationTagview || lineTagview
                        ? renderTagView(stationTagview, lineTagview)
                        : stationView && (
                            textName?.data &&
                            ['facility', 'Trains', 'mainline', 'yard'].includes(textName.data.mode)
                                ? renderSectFacility(textName)
                                : renderSectComponent(textName)
                            )
                        }


                    {trainView === true && renderSectTrainView(trainView)}
                    </>
                )}
                </>
                </article>
                </article>
                </article>

            </article>
        </article>
    )
}

export default TopoPg;




