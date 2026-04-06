import React,{useState,useEffect} from "react";
import '../ornms.css'
import './../Settings/settings.css';
import { useSelector } from "react-redux";


const StationSubCont=({handleSubContainer,refreshStationData,station,mode})=>{
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);

            const isEditMode = mode ==='edit';

            const [loading, setLoading] = useState(false);
            const [selectedFile, setSelectedFile] = useState(null);
        
            const [error, setError] = useState('');
            const [success, setSuccess] = useState('');
            const[linenameSel,setLinenameSel] = useState('');
            const [stationSel,setStationSel] = useState('');
            const [lineData,setLineData]= useState('');
            const [selStationData,setSelStationData] = useState('');
            const [stationName,setStationName] = useState('');
            const [stationCode,setStationCode] = useState('');
            const [showAddedSuccessPopup, setShowAddedSuccessPopup] = useState(false);
            const [showSuccessMessage,setShowScuccessMessage] = useState('');
    const handleProfileContclose=(e)=>{
          e.preventDefault(); 
        handleSubContainer();
        setStationName('');
        setLinenameSel('');
        setStationSel('');
        setStationCode('');
        setSelectedFile(null);
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // const getSelectedLine = () => {
    //     return lineData.find(item => item.data.id === Number(linenameSel));
    // };
    
    // const getSelectedStation = () => {
    //     return selStationData.find(item => item.data.id === Number(stationSel));
    // };
    

  

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;
    
        setLoading(true);
        setError('');
        setSuccess('');
    
        const formData = new FormData();
        formData.append('upfile', selectedFile); // your API should accept a field named "file"
    
        try {
            // const username = 'admin';
            // const password = 'admin';
            // const token = btoa(`${username}:${password}`)
            const response = await fetch("api/v2/facilities/uploaddiscctx", {
                method: "POST",
                headers: {
                    // 'Authorization': `Basic ${token}`,
                    // "Content-Type": "application/json",
                },
                body: formData, // Don't set Content-Type manually!
            });
    
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                // alert('Discovery started successfully')
            setShowScuccessMessage(
                    'The file upload has been updated successfully.'                )
                  setShowAddedSuccessPopup(true);
                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };

    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["name,Section,Station Code", "Pioneer Village,line1-sec1,PNV"].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleSelectLine=(e)=>{
        setLinenameSel(e.target.value);
    }

    const getLineData = async (url) => {
        setLoading(true);
        setError({ status: false, msg: "" });
        try {
            const username = 'admin';
                const password = 'admin';
                const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
          

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setLoading(false);
                setLineData(data);
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setLoading(false);
            setError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        const fetchLines = async () => {
        const url= 'api/v2/treeview/regions'
       await getLineData(url) 
        };

        fetchLines();
    },[])



    const getSelStationData = async (url) => {
        setLoading(true);
        setError({ status: false, msg: "" });
        try {
            const username = 'admin';
                const password = 'admin';
                const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
          

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setLoading(false);
                setSelStationData(data);
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setLoading(false);
            setError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        if(linenameSel && linenameSel !== '-1'){
            const url=`api/v2/treeview/regions/${linenameSel}/locations`;

            getSelStationData(url);
        }
       
    },[linenameSel])

    const handleSelectStation=(e)=>{
        setStationSel(Number(e.target.value))
    }


    const handleAddStation = async (e) => {
          e.preventDefault(); 
        if (!stationName?.trim()) return;
        const requestBody = isEditMode ? {
            id:station.id,
            latitude:'0',
            locationId:stationSel,
            locationName: station.locationName,
            longitude:'0',
            name:stationName,
            regionId:station.regionId,
            regionName:station.regionName,
            stcode:stationCode

        }: {
            name: stationName,
            region : {id:stationSel},
            stcode: stationCode
        };
        const method = isEditMode ? 'POST' : 'POST';
        const url = isEditMode ? 'api/v2/facilities/update' :'api/v2/facilities'
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
               
                // handleProfileContclose();
                 setShowScuccessMessage(
                    isEditMode ? 'The station has been updated successfully.':
                    'The station has been created successfully.'
                )
                  setShowAddedSuccessPopup(true);
                if(refreshStationData) refreshStationData();
                setStationName('');
                setLinenameSel('');
                setStationSel('');
                setStationCode('');
                setSelectedFile(null);
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }

    }


   useEffect(()=>{
    if(isEditMode && station){
        setStationName(station.name || '');
        setLinenameSel(station.regionId || '');
        setStationSel(station.locationId || '');
        setStationCode(station.stcode || '');
    }else{
        setStationName('');
        setLinenameSel('');
        setStationSel('');
        setStationCode('');

    }
   },[mode,station]);

    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">Station</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Station Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={stationName}
                                onChange={e=> setStationName(e.target.value)}
                                />
                                <article>
                                    <label className="vlanlabel">Line</label>
                                    <article>
                                        <select className="vlaninput" defaultValue={-1} value={linenameSel} onChange={handleSelectLine}>
                                            <option value="-1" defaultValue>Select</option>
                                            {lineData && lineData.map((item,index)=>(
                                                <option value={item.data.id} key={index}>{item.text}</option>
                                            ))}
                                        </select>

                                    </article>
                                </article>
                                <article>
                                    <label className="vlanlabel">Select Section</label>
                                    <article>
                                        <select className="vlaninput" defaultValue={-1} value={stationSel} onChange={handleSelectStation}> 
                                            <option value="-1" defaultValue>Select</option>
                                          {selStationData && selStationData.map((item,index)=>(
                                            <option value={item.data.id} key={index} >{item.text}</option>
                                          ))}
                                        </select>

                                    </article>
                                </article>
                                <label className="settinglabelsub">Station Code</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={stationCode}
                                onChange={e=> setStationCode(e.target.value)}

                                />
                          {isEditMode &&   <article>
                            <p className="notepara">Note:</p>
                            <ul className="notelist"><li>Special characters single quote(') and space are not allowed</li><li>A maximum of 32 characters can be added</li></ul>
                            </article>} 

                                <article className="uploadcont">
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button type="button" className="cancelbtn" onClick={handleProfileContclose}>Cancel</button>
                                        <button type="button" onClick={currentUser !== "Read-only" ? handleAddStation : undefined}
                                        className={`creatsetingbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`} title={currentUser === "Read-only" ? "Permission required" : ""}

                                        disabled={currentUser === "Read-only"}
                                        >
                                        {isEditMode ? 'Update' : 'Create'}
                                    </button>
                                </center>
                                <hr className="hrnote" />
                               {!isEditMode && <article className="regioncont">                                        
                                    <label htmlFor="" className="disfilelabel" style={{marginBottom:'15px'}}>Select your file</label>
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
                                     <button type="button" 
                                     onClick={currentUser !== "Read-only" ? () => document.getElementById("hiddenFileInput").click(): undefined} className="attachcl"  disabled={currentUser === "Read-only"}>
                                <i className="fa-solid fa-paperclip"></i></button>
                            <button type="button" onClick={currentUser !== "Read-only" ? handleUpload : undefined}   disabled={currentUser === "Read-only"} className="uploadcl"><i className="fa-solid fa-upload"></i></button>
                            <button type="button" onClick={downloadSampleCSV} className="createbtn">Sample.csv<i className="fa fa-file-text" aria-hidden="true"></i></button>

                                </article>} 
                                </article>
                                </form>

                            </article>

                        </article>
        </article>

            {showAddedSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">{showSuccessMessage}</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() =>{ setShowAddedSuccessPopup(false);
                                            handleProfileContclose();
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

export default StationSubCont;