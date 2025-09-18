import { useSelector } from "react-redux";
import LeftNavList from "../Navbar/leftnavpage";
import { useState } from "react";
import TopoSvgViewer from "./toposvg";
import TopoSectionTable from "./toposectiontable";
import WestSvgViewer from "./waysvg";
import WaySvgViewer from "./waysvg";
import WaysideTable from "./waysidetable";
import WaysidePopupTable from "./waysidepopuptable";
import StationTagSvg from "./stationtagsvg";
import LineTagSvg from "./linetagsvg";


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

    const handleWestside = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setWestSideView(selectElement.value);
        setWestSideViewLabel(label);

    }

    const getCircleId = (id) => {
        setCircleId(id);
        setStationTagview(true);
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

      const renderTagView=(stationTagview,lineTagview)=>{
        if(stationTagview){
            return <><StationTagSvg/> </>
        }else if (lineTagview){
            return <><LineTagSvg/></>;
        }else {
            return null;
        }
      }

      const handleStationTabview=()=>{
        setStationTagview(false);
        setLineTagview(false);
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
                                {/* <option value="" label="Select">Select</option> */}
                                <option value="Line21" label="Line1">Line1</option>
                                <option value="line1-sec1" label="Line1-sec1">Line1-sec1</option>
                                <option value="line1-sec2" label="Line1-sec2">Line1-sec2</option>
                                <option value="line4-sec1" label="Line4-sec1">Line4-sec1</option>
                            </select>
                            <WaysideTable westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount}/>
                            </article>
                        </article>
                        <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                            <article className="border-allsd">
                                 <ul className="clearfix linklist border-b">
                                    <li><button onClick=''>{getTabLabel(westSideView)}</button></li>

                                {stationTagview === true ?  <li><a onClick=''>Station Tags</a><button onClick={handleStationTabview}>x</button></li> : '' }
                                 {lineTagview === true ?  <li><a onClick=''>Line Tags</a><button onClick={handleStationTabview}>x</button></li> : '' }
                                </ul>
                                <article style={{ margin: '5px 0px 0 0px' }}>
                                {stationTagview || lineTagview ===true ? <> {renderTagView(stationTagview,lineTagview)}</> : renderSectComponent(westSideView)}
                                </article>
                            </article>
                        </article>
                        {/* <article className="row" style={{ margin: '5px 0px 5px 5px' }}>
                            <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 border-allsdnew" style={{ height: '0vh' }} > */}
                                {/* <WaysideTable westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup}/> */}
                            {/* </article> */}
                        {/* </article> */}
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