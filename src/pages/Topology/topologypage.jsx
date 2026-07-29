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
import { useLocation } from "react-router-dom";
import LineNodeTableView from "./linetagNodetableview";


const TopoPg = () => {

    const [textName, setTextName] = useState();
    const [parentTextName,setParentTextName] = useState(null);
    const [childrenTextName,setChildrenTextName] = useState(null);
    const [lineId, setLineId] = useState('');
    const [circleId, setCircleId] = useState('');
    const [textId,setTextId] = useState(null);
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
    const [yardfacilitieData, setYardfacilitieData] = useState(null);
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
    const [expandedTreeDt,setExpandedTreeDt] = useState(null);
    const [prevTreeDt,setPrevTreeDt] = useState([]);
    const [sortField, setSortField] = useState('status');
    const [sortOrder, setSortOrder] = useState('desc');
    const childrenTextNameRef = useRef([]);
    const [lineName,setLineName] = useState('')

    const onLocationNameChange = (value) => {
        setLineName(value);
    };

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

// useEffect(()=>{
//     if (!stationNode) return;
//     // setTextName(stationNode);
//      goToStationView(stationNode);
// },[stationNode]);

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
        //if(textName?.data?.mode === 'yard') return;
        // if(textName?.data?.type !== 'facility') return;
        if (textName?.data?.type === 'region' || textName?.data?.type === 'location' || textName?.data?.type === 'Trains' || textName?.data?.type === 'mainline') return;
        let intervalId;
        let stationId = textName?.data?.id;
        // if (textName?.data?.actualType === 4) {
        //     stationId = childrenTextName[0]?.data?.id
        // }
        if (!stationId) return;
        if (stationId === null) return;
        if(!stationId || selectedTab !== 'tagtable') {
            let urlStation = '';
            if(textName?.data?.mode === 'yard'){
            const child = childrenTextNameRef.current?.[0];

            const currentChildId = child?.data?.id;
            const currentChildMode = child?.data?.mode;

            if (currentChildId && currentChildMode === 'yard_1') {
                 urlStation= `api/v2/treeview/station/${childrenTextName[0]?.data?.id}`;
            }
            else{
            //  urlStation= `api/v2/treeview/station/${stationId}`;
                }
            }else{
                urlStation= `api/v2/treeview/station/${stationId}`;
            }
        const urlTrains = `api/v2/treeview/trains/${stationId}`;
         if (textNameIntervalRef.current) {
            clearInterval(textNameIntervalRef.current)
        };
        getYardfacilitieData(urlStation);
        if(textName?.data?.type === 'facility') {
            getTrainData(urlTrains);
        }
        // if ((parentTextName?.data?.mode === 'mainline' && childrenTextName[0]?.data?.mode === 'facility')) {
        //         getTrainData(urlTrains);
        //     }

          textNameIntervalRef.current  = setInterval(() => {
            getYardfacilitieData(urlStation);
             if (textName?.data?.type === 'facility') {
                getTrainData(urlTrains);
            }
        }, 30000);
        }
    

         return () => {
             if (textNameIntervalRef.current) {
            clearInterval(textNameIntervalRef.current);
            textNameIntervalRef.current = null;
            }
        };

    },[textName,selectedTab,childrenTextName]); 

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
  setTrainData('');

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
        switch (textName?.data?.display) {
            case 'line1-sec1':
            case 'line1-sec2':
            case 'line4-sec1':
              return   <>   
              <article className="row">
                <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                    <article style={{padding:"200px 0px"}}>
                        <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId} getTextId={getTextId}/>
                    </article>
                </article>
                 <article className="col-sm-7 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
                         <TopoSectionTable  textName={textName} textId={textId} stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} 
                       expandedTreeDt={expandedTreeDt}/>
                    </article>
              </article>
                </>
                break;
            default:
                return <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId} getTextId={getTextId}/>
                break;
        }
    }

    

    const renderSectFacility=(textName)=>{
        switch (textName?.data?.type) {
            case 'facility':
               return ( <> <StationSvg trainId={trainId} textName={textName} setTrainLabelDiply={setTrainLabelDiply} trainView={trainView} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} setStationTagview={setStationTagview} setLineTagview={setLineTagview}  goToStationView={goToStationView} yardfacilitieData={yardfacilitieData} yardfacilitieDataRef={yardfacilitieDataRef} trainData={trainData} trainDataRef={trainDataRef} stationIdFromSvg={stationIdFromSvg} parentTextName={parentTextName} childrenTextName={childrenTextName} lineName={lineName}/>
              <StationNodeTableView  yardfacilitieData={yardfacilitieData} textName={textName} rdDataRef={rdDataRef} stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} expandedTreeDt={expandedTreeDt} onSortChange={onSortChange}/>
                      </> );
            /*{
                if(textName.data.display === 'davisville_track' || textName.data.display ==='wilson_track' || textName.text === 'Finch trail track' || textName.text ==='VMC trail track' ){
                    return(
                    <>
                      <TopoSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName}/>
                        <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} />
                       
                    </>
                    );
                }else if (textName.text === 'Carhouse' ){
                    return (
                        <>
                        <YardSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName}/>
                <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} />
            
                        </>
                    )
                }else{
                    return ( <> <StationSvg trainId={trainId} textName={textName} setTrainLabelDiply={setTrainLabelDiply} trainView={trainView} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} setStationTagview={setStationTagview} setLineTagview={setLineTagview}  goToStationView={goToStationView} yardfacilitieData={yardfacilitieData} yardfacilitieDataRef={yardfacilitieDataRef} trainData={trainData} trainDataRef={trainDataRef} stationIdFromSvg={stationIdFromSvg}/>
              <StationNodeTableView  yardfacilitieData={yardfacilitieData} textName={textName} rdDataRef={rdDataRef} stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} expandedTreeDt={expandedTreeDt}/>
                      </> );
                }
            }*/
                break;
            case 'Trains':
                return  <TrainView textName={textName} parentTextName={parentTextName} childrenTextName={childrenTextName}/>
                    break;
            case 'mainline':
                return  <MainlineView textName={textName}/>
                    break;
            case 'yard':
                return  <>
                <TopoSvgViewer yardfacilitieData={yardfacilitieData}  textName={textName} childrenTextName={childrenTextName} parentTextName={parentTextName} getTextId={getTextId} childrenTextNameRef={childrenTextNameRef}/>
                 <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} />
                {/* <YardTbone yardfacilitieData={yardfacilitieData} textName={textName} childrenTextName={childrenTextName}/> */}
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
                <StationSvg trainId={trainId} textName={textName} setTrainLabelDiply={setTrainLabelDiply} trainView={trainView} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} setStationTagview={setStationTagview} setLineTagview={setLineTagview}  goToStationView={goToStationView} yardfacilitieData={yardfacilitieData} yardfacilitieDataRef={yardfacilitieDataRef} trainData={trainData} trainDataRef={trainDataRef} stationIdFromSvg={stationIdFromSvg} parentTextName={parentTextName} childrenTextName={childrenTextName}lineName={lineName}/>
              <StationNodeTableView yardfacilitieData={yardfacilitieData} textName={textName} rdDataRef={rdDataRef} stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} expandedTreeDt={expandedTreeDt} onSortChange={onSortChange} />
            </>
        } else if (lineTagview) {
            return <>
               <LineTagSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef}  setLineTagview={setLineTagview} stationNode={stationNode}/>
              <LineNodeTableView yardfacilitieData={yardfacilitieData}  textName={textName} rdDataRef={rdDataRef} stationNode={stationNode} />
            </>;
        } else {
            return null;
        }
    }


    const getNodeLabel = (node) => {
    const type = node.data?.type;
    if (type === "region") {
      return node.data.display;
    }else if (type === "location") {
       return node.text;
    }else if (type === "facility") {
      return `Station- ${node.text}`;
    }else if (type === "yard") {
      return `Yard- ${node.text}`;
    } else {
      return '';
    }
  };

   const getTabLabel = (textName) => {
     const mode = textName?.data?.mode;
    const type = textName?.data?.type;
  
    if ((type === "region" || type === "location") && stationTagview === false  && lineTagview === false) {
      return (
      <span>
        Link View - {textName.data.display}
      </span>
    );
    }else if(mode === "location"){
        return (
      <span>
            Link View - {textName.data.display}
      </span>
    );
    } else if(type === "facility"){
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
        setStationView(true);
    }

    const handleLineVwdisable=()=>{
        setLineTagview(false);
        if (!previousViewRef.current) return;

    const prev = previousViewRef.current;
        setEnableStationPolling(false);
        setTextName(prev.textName);
        setStationView(prev.stationView);
        setTimeLeft(30);
        setStationTagview(prev.stationTagview);
        // setStationTagview(false);
        setLineTagview(prev.lineTagview);
        setTrainView(prev.trainView);
        setSelectedTreeNodeId(prev.textName.data.id);
        setPrevIdActive(true);
        previousViewRef.current = null;
        return;
    }

    const handleTrainVwVisible=()=>{
    if (!previousViewRef.current) return;

  const prev = previousViewRef.current;
    setEnableStationPolling(false);
    setTextName(prev.textName);
    setStationView(prev.stationView);
    setTimeLeft(30);
    setStationTagview(prev.stationTagview);
    // setStationTagview(false);
    setLineTagview(prev.lineTagview);
    setTrainView(prev.trainView);
    setSelectedTreeNodeId(prev.textName.data.id);
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

const previousView = useSelector(state => state.selectedPrevNode.node);

useEffect(() => {
  if (previousView) {
    setTextName(previousView.textName);
    setStationView(previousView.stationView);
    setStationTagview(previousView.stationTagview);
    setLineTagview(previousView.lineTagview);
    setTrainView(previousView.trainView);
    setPrevTreeDt(previousView.expandedTreeDt || []);
    setSelectedTreeNodeId({ id: previousView.textName.data.id,
            path: ["global", "region", "location"]});
    
  }
}, [previousView]);



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
          if (!previousViewRef.current) {
    previousViewRef.current = {
      textName,
      stationView,
      stationTagview,
      lineTagview,
      trainView,
    };
  }
        setLineId(id);
        setLineTagview(true);
        setLineCount(prev => !prev)
        setStationView(false);

    }

    const getTextId=(id)=>{
        setTextId(id);
    }


       const fetchDataRadial = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            // const username = 'admin';
            // const password = 'admin';
            // const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    // 'Authorization': `Basic ${token}`
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
    const circleIdMaptable = selectedTreeNodeId?.id;
    if(textName?.data?.type === 'facility'){
        url = `api/v2/wayside/tagdetails?station=${textName.data.display}&sortBy=${sortField}&order=${sortOrder}`;
    } else if (circleId) {
        url = `api/v2/wayside/tagdetails?station=${circleId}&sortBy=${sortField}&order=${sortOrder}`;
    }
    else if (lineId) {
        url = `api/v2/wayside/tagdetails?station=${lineId}&sortBy=${sortField}&order=${sortOrder}`;
    }
    //  else if (circleIdMaptable) {
    //     url = `api/v2/wayside/tagdetails?station=${circleIdMaptable}&sortBy=${sortField}&order=${sortOrder}`;
    // }
    // else if(textName?.data?.type === 'facility'){
    //     url = `api/v2/wayside/tagdetails?station=${textName.data.display}&sortBy=${sortField}&order=${sortOrder}`;
    // }

    if (url) {
        fetchDataRadial(url);

        const intervalId = setInterval(()=>{
            fetchDataRadial(url);
        },30000)

        return()=> clearInterval(intervalId);
    }
}, [circleId, lineId,textName,selectedTab,sortField,sortOrder,selectedTreeNodeId]);

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
        childrenTextNameRef.current = data;
        setChildrenTextName(data);
    };

    const handleExpandedPrevTreeData=(data)=>{
        setExpandedTreeDt(data);
    }

    const hasTagView = stationTagview || lineTagview;

    const hasMode =
  textName?.data &&
  ['facility', 'Trains', 'mainline', 'yard'].includes(textName.data.type);


const onSortChange = (field) => {

    let newOrder = "asc";

    if (sortField === field) {
        newOrder = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(newOrder);
};

    return (
        <article className="display-f">
           
           <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
            <LeftNavList  className='leftsidebar'/>
            </article>
            <article className="container-fluid">
            <article className="row sect-padd">
                <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <article className="border-allsd" style={{ height: '94vh', margin: '5px 5px 0 5px' }}>
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
                        <TreeList onTreeDataChange={handleExpandedPrevTreeData} getElementAtEvent={handleNodeClick} selectedNodeId={selectedTreeNodeId} circleId={circleId} onStationResolved={setStationNode} selectedPrevNodeId={selectedPrevNodeId} prevIdActive={prevIdActive}  onStationCircleIdChange={setStationIdFromSvg} stationRefreshKey={stationRefreshKey}
                       onChildrenData={handleChildrenData} prevTreeDt={prevTreeDt} selectedTreeNodeId ={selectedTreeNodeId}  onLocationNameChange={onLocationNameChange}
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
                    <WaysideTable allTagfailCount={allTagfailCount} westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount} textName={textName} stationTagview={stationTagview} selectedNodeId={selectedTreeNodeId} />
                    </article>
                    {((textName && textName?.data?.type === 'facility') ||  selectedTreeNodeId?.id )   ? (<article style={{margin:'5px',marginTop:'15px'}}>
                    <StationTagsTable textName={textName} circleId={circleId} lineId={lineId}  rdDataRef={rdDataRef} onSortChange={onSortChange}/>
                    </article>) : ('')}
                    {showPopup && (
                        <div className="popupStyle">
                        <div className="popupBoxStyle">
                            <WaysidePopupTable currentTagid={currentTagid} />
                            <button
                            type="button"
                            onClick={() => setShowPopup(false)}
                            className="createbtn"
                            style={{ marginTop: '32px', float: 'right' }}
                            >
                            Close
                            </button>
                        </div>
                        </div>
                    )}
                    </>
                ) : (
                    <>
                    {/* {((!textName && stationTagview === true)) &&(
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
                    )} */}

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
                     {((textName !== '' && lineTagview === true)) &&(
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
                              {/* {canGoBack && ( */}
                        <button className="createbtn" onClick={handleLineVwdisable}>
                            Back
                        </button>
                        {/* )} */}

                            </>
                            )}
                        </article>
                        </article>
                            </>
                    )}
                    {((['facility', 'location', 'region','yard'].includes(textName?.data?.type)) && stationTagview === false && lineTagview === false) && (
                        <article className="row">
                        <article className="col-4">
                            {trainView === true ? (
                            <h1 className="mapheading">Train View : {trainId}</h1>
                            ) : (
                                <>
                            {!stationTagview && <h1 className="mapheading">{getNodeLabel(textName)}</h1>}
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
  <button className="createbtn" onClick={handleLineVwdisable}>
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
                    {hasTagView
                        ? renderTagView(stationTagview, lineTagview)
                        : stationView
                           ? hasMode
                                ? renderSectFacility(textName)
                                : renderSectComponent(textName)
                                : null
                            
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




