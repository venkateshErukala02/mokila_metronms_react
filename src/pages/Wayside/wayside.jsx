import { useSelector } from "react-redux";
import LeftNavList from "../Navbar/leftnavpage";
import { useState } from "react";
import TopoSvgViewer from "../Topology/toposvg";
import TopoSectionTable from "../Topology/toposectiontable";
import WestSvgViewer from "./waysidesvg";
import WaySvgViewer from "./waysidesvg";
import WaysideTable from "./waysidetable";
import WaysidePopupTable from "../Topology/waysidepopuptable";
import StationTagSvg from "./stationtagsvg";
import LineTagSvg from "./linetagsvg";
import StationTagsTable from "./stationtagstable";


const Wayside = () => {
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [westSideViewLabel, setWestSideViewLabel] = useState('Line21')
    const [westSideView, setWestSideView] = useState('Line1');
    const [circleId, setCircleId] = useState('');
    const [lineId,setLineId] =useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentTagid,setCurrentTagid]= useState('');
    const [stationTagview,setStationTagview]=useState(false);
    const [stationCount,setStationCount]=useState(false);
    const [lineTagview,setLineTagview]=useState(false);   
    const [lineCount,setLineCount]=useState(false);
    const [stationName,setStationName]= useState('');
    const [allTagfailCount,setAllTagfailCount]=useState(false);

    const handleWestside = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setWestSideView(selectElement.value);
        setWestSideViewLabel(label);

    }

    const getCircleId = (id,name) => {
        setCircleId(id);
        setStationTagview(true);
        setStationName(name);
        setStationCount(prev=> !prev);
    }
    const getLineId=(id)=>{
        setLineId(id);
        setLineTagview(true);
        setLineCount(prev=> !prev)
    }


    const renderSectComponent = (textName) => {
        switch (textName) {
            case 'Line21':
                return <>   <WaySvgViewer textName={textName} getCircleId={getCircleId} />
                </>
                break;
            case 'line1-sec1':
                return <>   <WaySvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId} />
                </>
                break;
            case 'line1-sec2':
                return <>   <WaySvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId} />
                </>
                break;
            case 'line4-sec1':
                return <>   <WaySvgViewer textName={textName} getCircleId={getCircleId} getLineId={getLineId} />
                </>
                break;
            default:
                return <>   <WaySvgViewer textName='Line21' getCircleId={getCircleId} getLineId={getLineId} /> </>
                break;
        }
    }

    const handleTagsPopup=(value,id)=>{
        setShowPopup(value);
        setCurrentTagid(id);
    }

    const getTabLabel = (westSideView) => {
         const mode = westSideView
      
        if (mode === "Line21" ) {
          return "Link View - Tags Map";
        }else {
          return "Link View"; 
        }
      };

      const renderTagView=(stationTagview,lineTagview,stationName)=>{
        if(stationTagview){
            return <>
                    <StationTagSvg stationName={stationName}/>
                    <StationTagsTable circleId={circleId}/>
                     </>
        }else if (lineTagview){
            return <>
                    <LineTagSvg/>
                       <StationTagsTable circleId={circleId}/>
                        </>;
        }else {
            return null;
        }
      }

      const handleStationTabview=()=>{
        setStationTagview(false);
        setLineTagview(false);
        setAllTagfailCount(prev =>!prev);
      }

    return (
        <>
            <article className="display-f">
                <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
                    <LeftNavList className='leftsidebar' />
                </article>
                <article className="container-fluid" style={{ position: 'relative' }}>
                    <article className="row">
                        <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <article className="border-allsd"  style={{ height: '867px'}}>
                            <h1 className="topoheading">Wayside Tags</h1>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Select :</label>
                            <select name="name" id="name" value={westSideView} onChange={handleWestside} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                <option value="Line21" label="Line1">Line1</option>
                                <option value="line1-sec1" label="Line1-sec1">Line1-sec1</option>
                                <option value="line1-sec2" label="Line1-sec2">Line1-sec2</option>
                                <option value="line4-sec1" label="Line4-sec1">Line4-sec1</option>
                            </select>
                            <WaysideTable allTagfailCount={allTagfailCount} westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount}/>
                            </article>
                        </article>
                        <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                            <article className="border-allsd">
                                 <ul className="clearfix linklist border-b">
                                    <li><button onClick=''>{getTabLabel(westSideView)}{stationTagview && (<span> - Station Tags<button onClick={handleStationTabview}>x</button></span>) }
                                         {lineTagview && (<span> - Line Tags<button onClick={handleStationTabview}>x</button></span>) }
                                        </button></li>
                                </ul>
                                <article style={{ margin: '5px 0px 0 0px' }}>
                                {stationTagview || lineTagview ===true ? <> {renderTagView(stationTagview,lineTagview,stationName)}</> : renderSectComponent(westSideView)}
                                </article>
                            </article>
                        </article>
                    </article>
                    {showPopup && (
                        <div className="popupStyle">
                            <div className="popupBoxStyle">
                                <WaysidePopupTable currentTagid={currentTagid}/>
                                <button onClick={() => setShowPopup(false)} className="clearfix createbtn" style={{marginTop:'20px',float:"right"}}>Close</button>
                            </div>
                        </div>
                    )}
                </article>
            </article>
        </>
    )
}

export default Wayside;