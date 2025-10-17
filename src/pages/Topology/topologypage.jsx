import React, { useState,useEffect, useRef } from "react";
import TreeList from "../Topology/treelist";
import MapLat from "../Topology/mapcomp";
import TransmitTab from '../Topology/topologygraph';
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





const TopoPg = () => {

    const [textName, setTextName] = useState('');
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

    const isVisible = useSelector(state => state.visibility.isVisible);

    const handleNodeClick = (value) => {
         console.log('lplplp',value);
        setTextName(value);
    }


    const [yardfaclData, setYardfaclData] = useState([]);
const [isLoading, setIsLoading] = useState(false);
const [isError, setIsError] = useState({ status: false, msg: "" });
const [trainView,setTrainView]= useState(false);
const [stationView,setStationView]= useState(true);
const [trainLabelDiply,setTrainLabelDiply] = useState(false);
const [trainId,setTrainId] = useState('');


const getYardfaclData = async (url) => {
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
            setYardfaclData(data.nodes || []);
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
 
useEffect(() => {
    if (!textName?.data) return;
  
    let url = "";
  
    if (textName.data.mode === "yard") {
      if (textName.text === "yard_1") {
        url = `api/v2/dashboard/filternodes?ar=${textName.text}&facilities=davisville_track&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
      } else {
        url = `api/v2/dashboard/filternodes?ar=${textName.data.parent}&facilities=${textName.data.display}&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
      }
  
      getYardfaclData(url);
    }
  }, [textName]);
  


    const renderSectComponent=(textName)=>{
        switch (textName.text) {
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
            case 'line4-sec1':
                return  <>   <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                            <TopoSectionTable  textName={textName}/> </>
                    break;
    
            default:
                return <TopoSvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId}/>
                break;
        }
    }

    const renderSectFacility=(textName)=>{
        switch (textName.data.mode) {
            // case 'facility':
            //   return  <> <TopoSvgViewer textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId}/>
            //   <StationNodeTableView  textName={textName}/>
            //                </> 
            //     break;
            case 'facility':
              return  <> <StationSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} />
              <StationNodeTableView  textName={textName} rdDataRef={rdDataRef} />
                           </> 
                break;
            case 'Trains':
                return  <TrainView textName={textName}/>
                    break;
            case 'mainline':
                return  <TrainView textName={textName}/>
                    break;
            case 'yard':
                return  <>
                <TopoSvgViewer yardfaclData={yardfaclData} textName={textName}/>
                <YardTbone yardfaclData={yardfaclData} textName={textName} />
            <YardTbtwo textName={textName}/>
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
                <StationSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} />
              <StationNodeTableView  textName={textName} rdDataRef={rdDataRef} />
            </>
        } else if (lineTagview) {
            return <>
               <StationSvg textName={textName} setTrainLabelDiply={setTrainLabelDiply} setTrainView={setTrainView} setStationView={setStationView} setTrainId={setTrainId} rdDataRef={rdDataRef} />
              <StationNodeTableView  textName={textName} rdDataRef={rdDataRef} />
            </>;
        } else {
            return null;
        }
    }


     const getNodeLabel = (node) => {
    const mode = node.data?.mode;
  
    if (mode === "region" || mode === "location") {
      return node.data?.display || node.text || "Unknown";
    } else if (mode === "facility" || node.data?.parent === "yard_1") {
      return `Station- ${node.text}` || "Unnamed Facility";
    } else {
      return node.data?.display || node.text || "Unknown";
    }
  };

   const getTabLabel = (textName) => {
     const mode = textName.data?.mode;
  
    if (mode === "region" || mode === "location") {
      return `Link View - ${textName.data.display}`;
    }else if(mode === "location"){
        return 'Link View - Line-1';
    } else if(mode === "facility"){
        return 'Station View';
    } 
    else if (
      mode === "AP" || 
      mode === "CAM" || 
      mode === "transcoder" || 
      mode === "encoder"
    ) {
      return textName.data?.systemname || "Unnamed Device";
    } else if (textName.data?.parent === "yard_1") {
      return textName.text || "Unnamed Facility";
    } else if (textName.data?.parent === "yard") {
      return textName.data?.display || "Unnamed Yard";
    }else if (mode === 'global') {
      return "Link View"; 
    }else {
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

    const handleTrainVwVisible=()=>{
        setTrainView(false);
        setStationView(true);
        setTrainLabelDiply(false);
    }

    const handleStationVwVisible=()=>{
        setTrainView(false);
        setStationView(true);
    }
    const handleTrainVwTab=()=>{
        setTrainView(true);
        setStationView(false);
    }

    const getCircleId = (id) => {
        setCircleId(id);
        setStationTagview(true);
        setStationCount(prev => !prev);
        setStationView(false);

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

        // useEffect(() => {
        //     let url = '';
        //         if (circleId) {
        //             url = `api/v2/wayside/tagdetails?station=${circleId}`;
        //         } 
        //     if (url) fetchDataRadial(url);
        // }, [circleId]);

        // useEffect(() => {
        //     let url = '';
        //         if (lineId) {
        //             url = `api/v2/wayside/tagdetails?station=${lineId}`;
        //         } 
        //     if (url) fetchDataRadial(url);
        // }, [lineId]);

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
        console.log("Fetching with URL:", url);
        fetchDataRadial(url);
    }
}, [circleId, lineId,textName]);

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


    return (
        <article className="display-f">
           
           <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
            <LeftNavList  className='leftsidebar'/>
            </article>
            <article className="container-fluid">
            <article className="row">
                <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <article className="border-allsd" style={{ height: '90vh', margin: '5px 5px 0 5px' }}>
                        <article className="row">
                            <article className="col-7">
                                <h1 className="topoheading">Topology</h1>
                            </article>
                            <article className="col-4" style={{ float: 'right' }}>
                                <article style={{ float: 'right' }}>
                                    <button className="createbtn">Refresh</button>
                                </article>
                            </article>
                            <article className="row">
                                <article className="col-12">
                                    <span className="radioSelct">Radio Mode:</span>
                                    <select className="form-controlfirm" value="select" style={{ width: "auto" }} aria-invalid="false">
                                        <option value="0" label="All">All</option>
                                        <option value="1" selected="selected" label="AP">AP</option>
                                        <option value="2" label="SU">SU</option>
                                    </select>
                                </article>
                            </article>
                        </article>
                        <hr className="hrll" />
                        <article className="systemcont">
                            {/* <article className="row" style={{ paddingBottom: '25px' }}>
                                <article className="col-5">
                                    <label htmlFor="">
                                        <input type="radio" />
                                    </label>
                                    <span className="radioSelct">System Name</span>
                                </article>
                                <article className="col-5">
                                    <label htmlFor="">
                                        <input type="radio" />
                                    </label>
                                    <span className="radioSelct">IP address</span>
                                </article>
                            </article> */}
                            <article className="row">
                                <article className="col-6">
                                    <input type="text" className="clearfix form-controltopo" placeholder="IP Address" />
                                </article>
                                <article className="col-6">
                                    <article style={{float:'right'}}>
                                    <button className="createbtn">Search</button>
                                </article>
                                </article>
                            </article>
                        </article>
                        <hr  className="hrll" style={{marginBottom:'0px'}}/>
                        <article>
                        <TreeList getElementAtEvent={handleNodeClick} />
                            </article>
                            <article>
                                 <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Tag type :</label>
                                <select name="name" id="name" value={tagTypeValue} onChange={handleTagType} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    <option value="all" label="All">All</option>
                                   <option value="TDM" label="Tdm">Tdm</option>
                                   <option value="NTDM" label="Ntdm">Ntdm</option>
                                </select>
                                <WaysideTable allTagfailCount={allTagfailCount} westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount} tagTypeValue={tagTypeValue} />
                            </article>

                    </article>
                </article>
                <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                    <article className="border-allsd" style={{ margin: '5px 0px 0 0px' }}>

                        <ul className="clearfix linklist border-b">
                            <li><button onClick={handleStationVwVisible}>{getTabLabel(textName)}</button></li>
                           {trainLabelDiply ?  <li><a onClick={handleTrainVwTab}>{trainId}</a><button onClick={handleTrainVwVisible}>x</button></li> : '' }
                        </ul>
                     {textName?.data?.mode === 'facility' || textName?.data?.mode === 'location' || textName?.data?.mode === 'region' ? ( <article className="row">
                            <article className="col-3">
                              {trainView === true ?(<h1 className="mapheading">Train View : {trainId}</h1>) : (<h1 className="mapheading">{getNodeLabel(textName)}</h1>)}  
                            </article>
                            {/* <article className="col-9">
                                <article style={{ float: 'right' }}>
                                    <span className="systmtopo" style={{ marginRight: '10px' }}> Region</span>
                                    <label className="float-right systmtopo">
                                        <input type="checkbox" className="inptcheck" id="checksysname" aria-checked="true" aria-invalid="false" />System Name
                                        <span className="" style={{ marginTop: '0', top: '10px' }}></span>
                                    </label>
                                </article>
                            </article> */}


                        </article>) : ''}   
                    
                        <hr className="topohr" />


             
                    </article>

                        {stationView === true
                                ? (
                                    textName && textName.data &&
                                    (textName.data.mode === "facility" ||
                                        textName.data.mode === "Trains" ||
                                        textName.data.mode === "mainline" ||
                                        textName.data.mode === "yard")
                                        ? renderSectFacility(textName)
                                        : renderSectComponent(textName)
                                    ) :( (stationTagview || lineTagview) && renderTagView(stationTagview, lineTagview))}

                               {trainView === true ?  renderSectTrainView(trainView) :''}
                           
                                    {showPopup && (
                        <div className="popupStyle">
                            <div className="popupBoxStyle">
                                <WaysidePopupTable currentTagid={currentTagid} />
                                <button onClick={() => setShowPopup(false)} className="clearfix createbtn" style={{ marginTop: '20px', float: "right" }}>Close</button>
                            </div>
                        </div>
                    )}
                

                </article>
                </article>

            </article>
        </article>
    )
}

export default TopoPg;




