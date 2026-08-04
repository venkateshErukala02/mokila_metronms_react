import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import transcoderImage from "../../assets/img/transcoderimg.jpeg";
import radioimage from "../../assets/img/radiomode.png";
import ptmplinkimage from "../../assets/img/PTMPlink.png";
import bootloader from "../../assets/img/bootloader.png";
import NetworkMonitoringDashboard from "./nodeviewchart";
import LatencyChart from "./latencychart";
import TranscoderDashboard from "./transcoderdashboard";
import { use } from "react";
import obcimage from '../../assets/img/obcimg1.png'



const ObcMonitoringTab = ({ nodeItemDt, currentTab ,triggerCount}) => {

    const checkServicesList = [
        { name: "TDM Service", displayName: "TDM Service" },
        { name: "Driver", displayName: "Driver Service" },
        { name: "FTP Service", displayName: "FTP Service" },
        { name: "Train Radio Connectivity", displayName: "Train Radio" },
        { name: "NTP Server Connectivity", displayName: "NTP Server" },
        { name: "Encoder Connectivity", displayName: "Encoder" },
        { name: "FTP Server Connectivity", displayName: "FTP Server" },
    ];
    const nodeDataId = useSelector((state) => state.node?.node?.nodeId);
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');

       const currentUser = useSelector((state) => state?.loginuser?.node?.role);
          const isReadOnly = currentUser === 'Read-only';
      

    useEffect(()=>{
        if(nodeDataId){
          localStorage.setItem('nodeId',nodeDataId);
    
        }
      },[nodeDataId]);
    
      useEffect(()=>{
        if(nodeIpaddress){
          localStorage.setItem('nodeIpaddress',nodeIpaddress);
        }
      },[nodeIpaddress]);

      const ipValue = localStorage.getItem('nodeIpaddress')
    const nodeIdValue = localStorage.getItem('nodeId')


    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");
    const [upTimeData, setUpTimeData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tempData, setTempData] = useState('');
    const [serviceStatus, setServiceStatus] = useState([]);
    const [parsedServices, setParsedServices] = useState(
        checkServicesList.map(item => ({ ...item, status: "checking", value: null }))
    );
    const [allParsedServices, setAllParsedServices] = useState([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [terminalData, setTerminalData] = useState({
        camName: "",
        status: "unknown",
        pingHistory: [], // array to store ping values
        loading: true,
    });
    const [diskData, setDiskData] = useState("");
    const [triggerConfig,setTriggerConfig] = useState(0);
    const [configData,setConfigData] = useState({});
    const [changedData,setChangedData] = useState({});
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [isChanged,setIsChanged] = useState(false)
    const [canApply, setCanApply] = useState(false);
    const [isApplying,setIsApplying] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [showApplySuccessPopup, setShowApplySuccessPopup] = useState(false);
    const [showUploadSuccessPopup,setShowUploadSuccessPopup] = useState(false);
    const [uptimeIsLoading,setUptimeIsLoading] = useState(false);
    const [showWarningPopup, setShowWarningPopup] = useState(false);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {

            const response = await fetch(`api/v2/nodemanageview/obc/patch/${nodeDataId}?filename=${selectedFile.name}`, {
                method: "POST",
                headers: {
                     "Content-Type": "application/octet-stream",
                            
                },
                body: formData, 
            });

            if (response.ok) {
                setShowUploadSuccessPopup(true);
                setSuccess('File Uploaded successfully');
                // alert('File Uploaded successfully')

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


    // const downloadSampleCSV = () => {
    //     const csvContent = "data:text/csv;charset=utf-8,"
    //         + ["Name,Email,Age", "John Doe,john@example.com,30"].join("\n");
    //     const encodedUri = encodeURI(csvContent);
    //     const link = document.createElement("a");
    //     link.setAttribute("href", encodedUri);
    //     link.setAttribute("download", "Sample.csv");
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    useEffect(() => {
        if (nodeIpaddress) {
            localStorage.setItem('nodeIpaddress', nodeIpaddress);
        }
    }, [nodeIpaddress]);

    const getDiskData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/obc/api/v1/disk`,
            };
            const response = await fetch(url,options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setDiskData(data.data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let url = 'api/v2/troubleshoot/obc/disk';
    //         await getDiskData(url);
    //     };
    //     fetchData();

    //     // const intervalId = setInterval(fetchData, 30000);

    //     // return () => clearInterval(intervalId);
    // }, [nodeIpaddress, currentTab]);


    const getServiceCheckStatus = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/obc/api/v1/`,
            };
            const response = await fetch(url,options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setServiceStatus(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let url = `api/v2/troubleshoot/obc/${nodeIpaddress}/servicecheck`;
    //         await getServiceCheckStatus(url);
    //     };
    //     fetchData();
    // }, []);



    useEffect(() => {
        if (!serviceStatus || serviceStatus.length === 0) return;

        const parsedApi = serviceStatus; // already array

        let index = 0;

        const interval = setInterval(() => {
            if (index >= parsedApi.length) {
                clearInterval(interval);
                return;
            }

            const current = parsedApi[index];

            setParsedServices(prev =>
                prev.map(item => {
                    if (item.name === current.name) {
                        const value =
                            current.data && typeof current.data === "object"
                                ? Object.values(current.data)[0]
                                : null;

                        return {
                            ...item,
                            status: current.status,
                            value: value,
                        };
                    }
                    return item;
                })
            );

            index++;
        }, 700);

        return () => clearInterval(interval);

    }, [serviceStatus]);




    const serviceStatusDt = [
        { name: "Transcoder Service", status: "running" },
        { name: "G Stream Service", status: "running" },
    ];

    const cameraStatus = [
        { cam: "Cam 1", status: "working" },
        { cam: "Cam 2", status: "working" },
        { cam: "Cam 3", status: "not reachable" },
        { cam: "Cam 4", status: "working" },
    ];

    const logsData = [
        "[INFO] Transcoder started successfully",
    ];



    const getServerStatusDt = async (url) => {
        setUptimeIsLoading(true);
        setIsLoading(true);
        setIsError({ status: false, msg: "" });

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 10000);

        try {
            const options = {
                method: "POST",
                headers: {
                    // "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/obc/api/v1/uptime`,
                signal: controller.signal,
            };
            const response = await fetch(url,options);
            clearTimeout(timeout);

             if (response.status === 204) {
                setIsLoading(false);
                setShowWarningPopup(true);
                setIsError({ status: false, msg: "" });
                return;
            }

             const data = await response.json();

            if (response.ok && response.status === 200) {
                setUptimeIsLoading(false);
                setIsLoading(false);


                setUpTimeData(data.data);
                const urlService = `api/v2/troubleshoot/obc/${nodeIpaddress}/servicecheck`;
                const urlConfig = 'api/v2/troubleshoot/obc/config';
                const urlDisk = 'api/v2/troubleshoot/obc/disk';
                await Promise.all([
                    getServiceCheckStatus(urlService),
                    getConfigDt(urlConfig),
                    getDiskData(urlDisk),
                ])
                setIsError({ status: false, msg: "" });
            } else {
                setUptimeIsLoading(false);
                setShowWarningPopup(true);
                throw new Error("Data not found");
            }
        } catch (error) {
            clearTimeout(timeout);
            setIsLoading(false);
            setUptimeIsLoading(false);
            setShowWarningPopup(true);
            setIsError({ status: true, msg: error.message });
        }
    };

    // const getTemperatureDt = async (url) => {
    //     setIsLoading(true);
    //     setIsError({ status: false, msg: "" });
    //     try {
    //         const username = "admin";
    //         const password = "admin";
    //         const token = btoa(`${username}:${password}`);
    //         const options = {
    //             method: "GET",
    //             headers: {
    //                 "Authorization": `Basic ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //         };
    //         const response = await fetch(url);
    //         const data = await response.json();

    //         if (response.ok) {
    //             setIsLoading(false);


    //             setTempData(data);
    //             setIsError({ status: false, msg: "" });
    //         } else {
    //             throw new Error("Data not found");
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         setIsError({ status: true, msg: error.message });
    //     }
    // };

    useEffect(() => {
        const fetchData = async () => {
            let url = 'api/v2/troubleshoot/obc/uptime';
            await getServerStatusDt(url);
        };
        fetchData();
    }, [triggerCount]);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`;
    //         await getTemperatureDt(url);
    //     };
    //     fetchData();
    // }, [])


    const handleEditBit = () => {
        setIsEditMode(true);
    }

    const nodeLocation = useSelector((state) => state.node.node.location) || localStorage.getItem('nodeLocation');



    function formatValue(val) {
        if (!val) return "";

        // Match the numeric part and the unit
        const match = val.match(/^([\d.]+)([a-zµ]*)$/i);
        if (!match) return val;

        const number = parseFloat(match[1]);
        const unit = match[2] || "";

        // Round to 2 decimals
        const rounded = number.toFixed(2);

        return `${rounded}${unit}`;
    }  

    const getConfigDt = async (url) => {
             if (!url) {
                console.warn("URL is missing. API call skipped.");
                return;
            }
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/obc/api/v1/config`,
            };
            const response = await fetch(url,options);
            let res = await response.json();

            if (response.ok) {
                setIsLoading(false);
                  const configData =
            typeof res.data === "string"
                ? JSON.parse(res.data)
                : res.data;

            setConfigData(configData);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let url = 'api/v2/troubleshoot/obc/config';
    //         await getConfigDt(url);
    //     };
    //     fetchData();
    // }, [triggerConfig]);


  const handleObcConfigChange = (name, value) => {
  setConfigData((prev) => ({
    ...prev,
    [name]: value // update top-level key
  }));

   setIsChanged(true);

  setChangedData((prev) => ({
        ...prev,
        [name]:value
  }))
  
};


  const handleSaveConfiguration = async () => {
        try {
        //    setIsSaving(true); 
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                 body: JSON.stringify(configData)
            };
            const response = await fetch(`api/v2/nodemanageview/obc/setconfig/${nodeIdValue}`,options);
            // const data = await response.json();

                let data = null;

                const text = await response.text(); // read response safely
                if (text) {
                    data = JSON.parse(text); // only parse if not empty
        }

            if (response?.ok === true || response?.status === 200) {
                setShowSaveSuccessPopup(true);
                setIsLoading(false);

                // setConfigData(data);
                setCanApply(true);
                setIsChanged(false);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
      };


   const handleApplyConfiguration = async () => {
  try {
        setIsApplying(true); 
    const stopUrl = `api/v2/nodemanageview/obc/reboot/${nodeIdValue}`;

    // Stop service
    const stopResponse = await fetch(stopUrl, { method: "GET" });
    if (!stopResponse.ok) {
      throw new Error(`Failed to stop transcoder. Status: ${stopResponse.status}`);
    }
    console.log("Transcoder stopped");
        //   alert("Configuration applied successfully");

   

    if (stopResponse.status === 200) {
        setIsApplying(false); 
        setCanApply(false);
      setIsError({ status: false, msg: "" });
       setShowApplySuccessPopup(true);
    //   alert("Configuration applied successfully");/
         setTriggerConfig((prev) => prev +1);
    } else {
      throw new Error("Data not found");
    }

  } catch (error) {
    setIsError({ status: true, msg: error.message });
  } finally {
        setIsApplying(false); 
         setCanApply(false);
  }
};


  




    return (
        <>

            <article className="row">
                <article
                    className="col-md-12"
                    style={{ padding: "10px", backgroundColor: "#cccccc" }}
                >

                    <article className="container-fluid">
                        <article className="row" style={{ display: "flex" }}>
                            <article className="col-md-2" id="summary-1 div1" style={{ minHeight: '850px', maxHeight: '934px', background: 'white' }}>
                                <article>

                                    <article className="card" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" style={{ width: '70px', height: '58px' }} src={obcimage} alt="node" />
                                            {/* <label className="summarymode"> {nodeItemDt.nodeDesc}</label> */}
                                            <label className="summarymode" style={{ display: 'block' }}> Cab - {configData?.carnumber || ""}</label>
                                            <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
                                        </article>
                                        <article style={{ margin: "auto" }}>
                                            <article>
                                                <article style={{ margin: "auto" }}>
                                                    <article>
                                                        <article>

                                                        </article>
                                                    </article>
                                                </article>
                                            </article>

                                            <ul className="summarylist">
                                                <li>
                                                    <h6> IP<span> {configData?.trainradioip}</span></h6></li>
                                                <li>
                                                    <h6>Encoder <span>{configData?.encoderip}</span></h6>
                                                </li>
                                                <li>
                                                    <h6>NTP <span>{configData?.ntpserverip}</span></h6>
                                                </li>
                                                <li>
                                                    <h6>Total<span> {diskData?.total}</span></h6></li>
                                                <li>
                                                    <h6> Free
                                                        <span>
                                                            {diskData?.free}
                                                        </span>
                                                    </h6>
                                                </li>
                                                <li>
                                                    <h6> Used
                                                        <span>
                                                            {diskData?.used}
                                                        </span>
                                                    </h6>
                                                </li>
                                                <li>
                                                    <h6> Percentage
                                                        <span>
                                                            {diskData?.percentage}
                                                        </span>
                                                    </h6>
                                                </li>
                                            </ul>
                                        </article>
                                    </article>
                                </article>
                            </article>

                            <article className="col-md-10" style={{ background: 'white', borderLeft: '10px solid #cccccc' }}>
                                <article
                                    style={{
                                        backgroundColor: "white",

                                    }}
                                >
                                    <article className="container-fluid">
                                        <article className="row">
                                             <h1 className="config-head">Configuration</h1>
                                            <article className="col-12 col-md-12 rstcont" style={{display:'flex'}}>
                                                <article className="col-6">
                                                  <article className="card-sub config-tab-wh">
                                                              
                                                              <article className="form-row-config "><label for="" className="col-5 config-label">Car Number</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" 
                                                                    value={configData?.carnumber || ""}
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Train Radio IP</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" 
                                                                    value={configData?.trainradioip || ""}
                                                                         onChange={(e) => handleObcConfigChange("trainradioip", e.target.value)}
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Encoder IP</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input"
                                                                     value={configData?.encoderip ?? ""}
                                                                         onChange={(e) => handleObcConfigChange("encoderip", e.target.value)}
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">NTP IP </label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" 
                                                                     value={configData?.ntpserverip || ""}
                                                                        onChange={(e) => handleObcConfigChange("ntpserverip", e.target.value)} 
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">FTP Server IP</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input"
                                                                     value={configData?.ftpserverip || ""} 
                                                                         onChange={(e) => handleObcConfigChange("ftpserverip", e.target.value)}
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">FTP Server User</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input"
                                                                    value={configData?.ftpusername || ""}

                                                                         onChange={(e) => handleObcConfigChange("ftpusername", e.target.value)}
                                                                    />
                                                                </article>
                                                                </article>
                                                              
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">FTP Server Password</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" 
                                                                            value={configData?.ftppassword || ""}

                                                                        onChange={(e) => handleObcConfigChange("ftppassword", e.target.value)}
                                                                    />
                                                                </article>
                                                                </article>
                                                             
                                                                <article className="config-savebtn" style={{paddingLeft:"22px"}}>
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                              onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (currentUser !== 'Read-only') {
                                                                                setShowSavePopup(true);
                                                                                }
                                                                            }}
                                                                        //    onClick={currentUser !== 'Read-only' ?handleSaveConfiguration : undefined}
                                                                         disabled={!isChanged || isReadOnly}
                                                                        style={{
                                                                            pointerEvents: (!isChanged) ? 'none' : 'auto',
                                                                              cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                                            opacity: (!isChanged || isReadOnly) ? 0.6 : 1          
                                                                        }}
                                                                        >
                                                                            Save
                                                                        </button>
                                                                    </article>
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                             onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                if (currentUser !== 'Read-only') {
                                                                                setShowApplyPopup(true);
                                                                                }
                                                                            }}
                                                                            disabled={!canApply || isApplying || isReadOnly}
                                                                            // onClick={currentUser !== 'Read-only' ? handleApplyConfiguration : undefined}
                                                                            style={{
                                                                                pointerEvents: (!canApply || isApplying) ? 'none' : 'auto',
                                                                                  cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                                                opacity: (!canApply || isApplying || isReadOnly) ? 0.6 : 1
                                                                            }}
                                                                        >
                                                                            {isApplying ? "Applying..." : "Apply"}
                                                                        </button>
                                                                    </article>

                                                                </article>
                                                                 {showSavePopup && <>
                                    <article className="confirmdeletepopup">
                                        <article className="confirmdeletepopupboxstyle">
                                        <h1 className="confirmdeletetitle">Are you sure you want to Save configuration?</h1>
                                        <article className="f-r">
                                            <button
                                                className="confirmdeletebtn"
                                                onClick={() => setShowSavePopup(false)}
                                                >
                                                NO
                                                </button>
                                                <button
                                                className="confirmdeletebtn confirmdeletebtnyes"
                                                onClick={async () => {
                                                    await handleSaveConfiguration();
                                                    setShowSavePopup(false);
                                                }}
                                                >
                                                YES
                                                </button>
                                        </article>
                                        </article>
                                    </article>
                                    </>}
                                     {/* {loading && <div className="loader"></div>} */}


                                      {showSaveSuccessPopup && (
                                    <article className="confirmsuccesspopup">
                                        <article className="confirmsuccesspopupboxstyle">
                                            <article className="success-cont">
                                        <h1 className="confirmtitlesucess">Success</h1>
                                        <p className="confirmtextsucess">The configuration has been saved successfully.</p>
                                        </article>
                                        <article style={{ textAlign: 'end' }}>
                                            <button
                                            className="confirmdeletebtn confirmdeletebtnyes"
                                            onClick={() => setShowSaveSuccessPopup(false)}
                                            >
                                            OK
                                            </button>
                                        </article>
                                        </article>
                                    </article>
                                    )}

                                     {showApplyPopup && <>
                                    <article className="confirmdeletepopup">
                                        <article className="confirmdeletepopupboxstyle">
                                        <h1 className="confirmdeletetitle">Are you sure you want to Apply configuration?</h1>
                                        <article className="f-r">
                                            <button
                                                className="confirmdeletebtn"
                                                onClick={() => setShowApplyPopup(false)}
                                                >
                                                NO
                                                </button>
                                                <button
                                                className="confirmdeletebtn confirmdeletebtnyes"
                                                onClick={async () => {
                                                    setShowApplyPopup(false);
                                                    await handleApplyConfiguration();
                                                    setShowApplySuccessPopup(true);
                                                }}
                                                >
                                                YES
                                                </button>
                                        </article>
                                        </article>
                                    </article>
                                    </>}

                                      {showApplySuccessPopup && (
                                    <article className="confirmsuccesspopup">
                                        <article className="confirmsuccesspopupboxstyle">
                                            <article className="success-cont">
                                        <h1 className="confirmtitlesucess">Success</h1>
                                        <p className="confirmtextsucess">The configuration has been applied successfully.</p>
                                        </article>
                                        <article style={{ textAlign: 'end' }}>
                                            <button
                                            className="confirmdeletebtn confirmdeletebtnyes"
                                            onClick={() => setShowApplySuccessPopup(false)}
                                            >
                                            OK
                                            </button>
                                        </article>
                                        </article>
                                    </article>
                                    )}
                                         {showUploadSuccessPopup && (
                                    <article className="confirmsuccesspopup">
                                        <article className="confirmsuccesspopupboxstyle">
                                            <article className="success-cont">
                                        <h1 className="confirmtitlesucess">Success</h1>
                                        <p className="confirmtextsucess">The file has been uploaded successfully.</p>
                                        </article>
                                        <article style={{ textAlign: 'end' }}>
                                            <button
                                            className="confirmdeletebtn confirmdeletebtnyes"
                                            onClick={() => setShowUploadSuccessPopup(false)}
                                            >
                                            OK
                                            </button>
                                        </article>
                                        </article>
                                    </article>
                                    )}
                                                            </article>
                                                            </article>
                                                            <article className="col-6">
                                                                <article className="regioncont">
                                                                    <label htmlFor="" className="config-label" style={{ marginBottom: '1px',display:'block' }}>Patch file to upload</label>
                                                                    <div className="filename-display" style={{fontSize:'14px'}}>
                                                                        {selectedFile ? selectedFile.name : 'No file selected'}
                                                                    </div>
                                                                    <input
                                                                        className="dislineinputcl"
                                                                        type="file"
                                                                        onChange={handleFileChange}
                                                                        id="hiddenFileInput"
                                                                        style={{ display: "none" }}
                                                                    />
                                                                    <button
                                                                     onClick={
                                                                    currentUser !== "Read-only"
                                                                    ? () => document.getElementById("hiddenFileInput").click()
                                                                    : undefined
                                                                }
                                                                title={currentUser === "Read-only" ? "Permission required" : ""}
                                                                        disabled={isReadOnly} 
                                                                     className="attachcl">
                                                                        <i className="fa-solid fa-paperclip"></i></button>
                                                                    <button
                                                                     onClick={currentUser !== 'Read-only' ? handleUpload : undefined}
                                                                title={currentUser === "Read-only" ? "Permission required" : ""}
                                                                        disabled={isReadOnly} className="uploadcl" ><i className="fa-solid fa-upload"></i></button>

                                                                        </article>
                                                            </article>

                                            </article>
                                        </article>
                                    </article>

                                    <article className="align-pad">
                                        <h3 className="configlinktitle">
                                            Connection Details
                                        </h3>
                                        <article>
                                            <ul className="configlist">
                                                {parsedServices?.slice(0, 3).map((item, index) => (
                                                    <li key={index}>
                                                        <h6>{item.displayName}</h6>
                                                        {uptimeIsLoading ? (
                                                            <div className="loader"></div>
                                                        ) : item.status === "success" ? (
                                                            <span>✔ {item.status === "success" ? "Running" : "Failed"} </span>
                                                        ) : item.status === "failure" ? (
                                                            <span className="failure-color">✖ Failed</span>
                                                        ): (!upTimeData || upTimeData.length === 0) ? (
                                                            <span className="pulse"></span>
                                                        ) : (
                                                            <span className="pulse">Checking...</span>
                                                        )}
                                                    </li>
                                                ))}

                                                {parsedServices.length < Math.min(3, allParsedServices?.length || 3) && (
                                                    <li>
                                                        <span className="pulse">Checking...</span>
                                                        <span>⏳</span>
                                                    </li>
                                                )}
                                            </ul>

                                        </article>
                                        <div>
                                            <h3 className="configlinktitle">
                                                Device Connectivity
                                            </h3>
                                            <article>
                                                <ul className="configlist">
                                                    {parsedServices?.slice(3, 7).map((item, index) => (
                                                        <li
                                                            key={index}
                                                            className=""
                                                        >
                                                            <h6>{item.displayName}</h6>
                                                             {uptimeIsLoading ? (
                                                                <div className="loader"></div>
                                                            ) : item.status === "success" ? (
                                                                <span>✔ {item.status === "success" ? "Pinging" : "Failed"} ({item.value ? `${formatValue(item.value)}` : "0"})
                                                                </span>
                                                            ) : item.status === "failure" ? (
                                                                <span className="failure-color" style={{paddingRight:'39px'}}>✖ Not Pinging
                                                                </span>
                                                            ) : (!upTimeData || upTimeData.length === 0) ? (
                                                                <span className="pulse"></span>
                                                            ) : (
                                                                <span className="pulse">Checking...</span>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </article>
                                        </div>
                                    </article>

                                </article>
                            </article>
                        </article>
                    </article>

                </article>
            </article>

              {showWarningPopup && (
                <article className="confirmsuccesspopup">
                    <article className="confirmsuccesspopupboxstyle">
                        <article className="success-cont">
                            <h1 className="confirmtitlesucess">Warning</h1>
                            <p className="confirmtextsucess">OBC agent is not started/installed.</p>
                        </article>
                        <article style={{ textAlign: 'end' }}>
                            <button
                                className="confirmdeletebtn confirmdeletebtnyes"
                                onClick={() => {
                                    setShowWarningPopup(false);
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

export default ObcMonitoringTab;