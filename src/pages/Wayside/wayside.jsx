import { useSelector } from "react-redux";
import LeftNavList from "../Navbar/leftnavpage";
import { useEffect, useRef, useState } from "react";
import TopoSvgViewer from "../Topology/toposvg";
import TopoSectionTable from "../Topology/toposectiontable";
import WestSvgViewer from "./waysidesvg";
import WaySvgViewer from "./waysidesvg";
import WaysideTable from "./waysidetable";
import WaysidePopupTable from "../Topology/waysidepopuptable";
import StationTagSvg from "./stationtagsvg";
import LineTagSvg from "./linetagsvg";
import StationTagsTable from "./stationtagstable";
import '../ornms.css';
import './../Discovery/discovery.css';


const Wayside = () => {
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [westSideViewLabel, setWestSideViewLabel] = useState('Line21')
    const [westSideView, setWestSideView] = useState('Line1');
    const [tagTypeValue, setTagTypeValue] = useState('all');
    const [tagTypeLabel,setTagTypeLabel] = useState('All');
    const [circleId, setCircleId] = useState('');
    const [lineId, setLineId] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [currentTagid, setCurrentTagid] = useState('');
    const [stationTagview, setStationTagview] = useState(false);
    const [stationCount, setStationCount] = useState(false);
    const [lineTagview, setLineTagview] = useState(false);
    const [lineCount, setLineCount] = useState(false);
    const [allTagfailCount, setAllTagfailCount] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeCont, setActiveCont] = useState('Address');
    const [discAddValue, setDiscAddValue] = useState('');
    const [rdData, setRdData] = useState('');
    const rdDataRef =useRef(null);
    const [stationNamesData,setStationNamesData] = useState('');
    const prevIdRef = useRef(null);

    const handleWestside = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setWestSideView(selectElement.value);
        setWestSideViewLabel(label);

    }

     const handleTagType = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setTagTypeValue(selectElement.value);
        setTagTypeLabel(label);

    }
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const getCircleId = (id) => {
        setCircleId(id);
        setStationTagview(true);
        setStationCount(prev => !prev);
    }
    const getLineId = (id) => {
        setLineId(id);
        setLineTagview(true);
        setLineCount(prev => !prev)
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

    const handleTagsPopup = (value, id) => {
        setShowPopup(value);
        setCurrentTagid(id);
    }

    const getTabLabel = (westSideView) => {
       const mode = westSideView
        if (mode === "Line21") {
          return "Link View - Tags Map";
        }else {
          return "Link View";
        }
    };

       const fetchDataRadial = async (url) => {
        setIsLoading(true);
        setError({ status: false, msg: "" });
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
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setError({ status: true, msg: error.message });
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
    }

    if (url) {
        console.log("Fetching with URL:", url);
        fetchDataRadial(url);
    }
}, [circleId, lineId]);


    const renderTagView = (stationTagview, lineTagview) => {
        if (stationTagview) {
            return <>
                <StationTagSvg rdDataRef={rdDataRef} />
                <StationTagsTable rdDataRef={rdDataRef} />
            </>
        } else if (lineTagview) {
            return <>
                <LineTagSvg rdDataRef={rdDataRef}/>
                <StationTagsTable rdDataRef={rdDataRef} />
            </>;
        } else {
            return null;
        }
    }

    const handleStationTabview = () => {
        setStationTagview(false);
        setLineTagview(false);
        setAllTagfailCount(prev => !prev);
    }

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('upfile', selectedFile);

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch('api/v2/wayside/uploadtags', {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                setSuccess('File upload has started.');
                alert('File upload has started.')

                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleActiveCont = (value) => {
        setActiveCont(value);
    }

    const handleAddReset = () => {
        setDiscAddValue('');
        setError('');
        setSuccess('');
    };


      const fetchStationData = async (url) => {
        setIsLoading(true);
        setError({ status: false, msg: "" });
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
                   setStationNamesData([]) 
                }
                setStationNamesData(Array.isArray(data) ? data.codes : [data.codes]);
                console.log('plpplplp',stationNamesData)
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setError({ status: true, msg: error.message });
        }
    };


useEffect(() => {
    let url = '';
            url = 'api/v2/wayside/codes'; 
       if (url) fetchStationData(url);
}, []);



    return (
        <>
            <article className="display-f">
                <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
                    <LeftNavList className='leftsidebar' />
                </article>
                <article className="container-fluid" style={{ position: 'relative' }}>
                    <article className="row">
                        <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3" style={{position:'relative'}}>
                            <article className="border-allsd" style={{ height: '907px' }}>
                                <h1 className="topoheading">Wayside Tags</h1>
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Select :</label>
                                <select name="name" id="name" value={westSideView} onChange={handleWestside} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    <option value="Line21" label="Line1">Line1</option>
                                    <option value="line1-sec1" label="Line1-sec1">Line1-sec1</option>
                                    <option value="line1-sec2" label="Line1-sec2">Line1-sec2</option>
                                    <option value="line4-sec1" label="Line4-sec1">Line4-sec1</option>
                                </select>
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Tag type :</label>
                                <select name="name" id="name" value={tagTypeValue} onChange={handleTagType} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    <option value="all" label="All">All</option>
                                   <option value="TDM" label="Tdm">Tdm</option>
                                   <option value="NTDM" label="Ntdm">Ntdm</option>
                                </select>
                                <WaysideTable allTagfailCount={allTagfailCount} westSideView={westSideView} circleId={circleId} setShowPopup={setShowPopup} showPopup={showPopup} lineId={lineId} handleTagsPopup={handleTagsPopup} stationCount={stationCount} lineCount={lineCount} tagTypeValue={tagTypeValue} />
                                  <article className="tagupload-container">
                                        <ul className="clearfix discovlist" style={{paddingBottom:'40px'}}>
                        <li><button className={activeCont === 'Address' ? 'active' : ''} onClick={() => handleActiveCont('Address')}> Add Tag</button></li>
                        <li><button className={activeCont === 'Upload' ? 'active' : ''} onClick={() => handleActiveCont('Upload')}>Tag Upload</button></li>
                    </ul>
                    {activeCont === 'Address' && ( 
                        <article className="regioncontw">
                                            <ul className="clearfix ipaddlistone">
                            <li>
                                <input
                                    type="text"
                                    className="clearfix form-controldis searchbar"
                                    placeholder="Specific Tag"
                                    value={discAddValue}
                                    onChange={(e) => setDiscAddValue(e.target.value)}
                                />
                            </li>
                             <li>
                               <select name="name" id="name" value={westSideView} onChange={handleWestside} className="clearfix form-controldis searchbar">
                                    {stationNamesData.length !== 0 && stationNamesData[0].map((station,index) => {
                                        const dataNw = Object.keys(station);
                                        const staionNametitle = dataNw[0];
                                        return(
                                    <option key={index} value={staionNametitle} label={staionNametitle}>{staionNametitle}</option>
                                        )
                                    })}                                    
                                </select>
                            </li>
                        </ul>
                        <article style={{justifyContent:'center',display:'flex',marginTop:"10px"}}>
                                <button className="clearfix tagsubmit-button" onClick={handleUpload} disabled={isLoading}>
                                    {isLoading ? 'Submiting...' : 'Submit'}
                                </button>
                                <button className="clearfix resetbtn" onClick={handleAddReset}>
                                    Reset
                                </button>

                        </article>
                                            
                                        </article>)}
                                       {activeCont === 'Upload' && ( <article className="regioncontw" style={{paddingLeft:"20px"}}>
                                            <label htmlFor="" className="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                                            <div className="filename-display">
                                                {selectedFile ? selectedFile.name : 'No file selected'}
                                            </div>
                                            <input
                                                className="dislineinputcl"
                                                type="file"
                                                onChange={handleFileChange}
                                                id="hiddenFileInput"
                                                style={{ display: "none" }}
                                            />
                                            <button onClick={() => document.getElementById("hiddenFileInput").click()} class="attachcl">
                                                <i class="fa-solid fa-paperclip"></i></button>
                                            <button onClick={handleUpload} class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                                            

                                        </article>)}
                                    </article>
                            </article>
                        </article>
                        <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                           
                                <article className="border-allsd">
                                    <ul className="clearfix linklist border-b">
                                        <li><button onClick=''>{getTabLabel(westSideView)}{stationTagview && (<span> - Station Tags<button onClick={handleStationTabview}>x</button></span>)}
                                            {lineTagview && (<span> - Line Tags<button onClick={handleStationTabview}>x</button></span>)}
                                        </button></li>
                                    </ul>
                                        <article style={{ margin: '5px 0px 0 0px' }}>
                                            {stationTagview || lineTagview === true ? <> {renderTagView(stationTagview, lineTagview)}</> : renderSectComponent(westSideView)}
                                        </article>
                                </article>
                        </article>
                    </article>
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
        </>
    )
}

export default Wayside;