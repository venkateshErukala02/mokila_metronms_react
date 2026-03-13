import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import transcoderImage from "../../assets/img/transcoderimg.jpeg";
import radioimage from "../../assets/img/radiomode.png";
import ptmplinkimage from "../../assets/img/PTMPlink.png";
import bootloader from "../../assets/img/bootloader.png";
import NetworkMonitoringDashboard from "./nodeviewchart";
import LatencyChart from "./latencychart";
import TranscoderDashboard from "./transcoderdashboard";
import { use } from "react";


const TcSummaryTab = ({  }) => {
    // let cam1 = transcoderData?.RSTPURL?.["cam1.url"]
    // let cam2 = transcoderData?.RSTPURL?.["cam2.url"]
    // let cam3 = transcoderData?.RSTPURL?.["cam3.url"]
    // let cam4 = transcoderData?.RSTPURL?.["cam4.url"]
    // let bitrate = transcoderData?.Quad?.bitrate
    // let prfle = transcoderData?.Quad?.profile
    // let xps = transcoderData?.Quad?.xpos
    // let yps = transcoderData?.Quad?.ypos
        const [transcoderData, setTranscoderData] = useState([]);



    const checkServicesList = [
    { name: "vtranscoder", displayName: "Transcoder Service" },
    { name: "gst-health", displayName: "GST Health" },
    { name: "gstreamer", displayName: "G Stream Service" },
    { name: "cam1", displayName: "Camera 1" },
    { name: "cam2", displayName: "Camera 2" },
    { name: "cam3", displayName: "Camera 3" },
    { name: "cam4", displayName: "Camera 4" },
  ];


    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");
    const [upTimeData, setUpTimeData] = useState([]);
    // const [bitRate,setBitRate] = useState(bitrate);
    // const [profile,setProfile] = useState(prfle);
    // const [xpos,setXpos] = useState(xps);
    // const [ypos,setYpos] = useState(yps);
    // const [camone,setCamone]=useState(cam1);
    // const [camtwo,setCamtwo] = useState(cam2);
    // const [camthree,setCamthree] = useState(cam3);
    // const [camfour,setCamfour] = useState(cam4);
    const [isEditMode,setIsEditMode] =useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tempData,setTempData] = useState('');
    const [serviceStatus,setServiceStatus]  = useState([]);
    const [parsedServices, setParsedServices] = useState(
    checkServicesList.map(item => ({ ...item, status: "checking",value: null }))
  );
  const [allParsedServices, setAllParsedServices] = useState([]);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalData, setTerminalData] = useState({
  camName: "",
  status: "unknown",
  pingHistory: [], // array to store ping values
  loading: true,
});

const [isSavingQuad,setIsSavingQuad] = useState(false);
const [isSavingRstpurl,setIsSavingRstpurl] = useState(false);
const [isApplyQuad,setIsApplyQuad] = useState(false);
const [isApplyRstpurl,setIsApplyRstpurl] = useState(false);
const [isApplyingQuad,setIsApplyingQuad] = useState(false);
const [isApplyingRstpurl,setIsApplyingRstpurl] = useState(false);
const [isChangedQuad,setIsChangedQuad] = useState(false);
const [isChangedRstpurl,setIsChangedRstpurl] = useState(false);
const [triggerConfig,setTriggerConfig] = useState(0);



const [transcoderStats, setTranscoderStats] = useState({
     System: {
       firmware: '',
       hardware: '',
       device_name: '',
       temperature: '',
       ntp_status: '',
       sntpip:''
     },
     Quad: {
       bitrate: '',
       profile: '',
       xpos: '',
       ypos: ''
     },
     RSTPURL: {
      "cam1.url": "",
      "cam2.url": "",
      "cam3.url": "",
      "cam4.url": "",
     }
   });
 const [changedSections, setChangedSections] = useState({
  quad: false,
  rtsp: false
});

  
 const intervalRef = useRef(null);




     const getServerStatus = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
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
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                const { System, Quad, RSTPURL, temp, uptime } = data;

                setIsLoading(false);


                  setTranscoderStats({
        System: {
          firmware: System?.firmware ?? "N/A",
          hardware: System?.hardware ?? "N/A",
          device_name: System?.model ?? "N/A",
          syslogip: System?.syslogip ?? "N/A",
          temperature: temp ?? "N/A",
          uptime: uptime ?? "N/A",
          sntpip:System?.sntpip?? "N/A"
        },
        Quad: {
          bitrate: Quad?.bitrate ?? "N/A",
          profile: Quad?.profile ?? "N/A",
          xpos: Quad?.xpos ?? "N/A",
          ypos: Quad?.ypos ?? "N/A",
        },
        RSTPURL: {
          "cam1.url": RSTPURL?.["cam1.url"] ?? "",
          "cam2.url": RSTPURL?.["cam2.url"] ?? "",
          "cam3.url": RSTPURL?.["cam3.url"] ?? "",
          "cam4.url": RSTPURL?.["cam4.url"] ?? "",
        }
      });
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const nodeId = localStorage.getItem('nodeId');
            let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/config`;
          //let url = 'http://localhost:8980/transcoder/api/v1/config';

            await getServerStatus(url);
        };
        fetchData();
    }, []);



const handleRTSPChange = (cam, value) => {
    setIsChangedRstpurl(true);
  setTranscoderStats((prev) => ({
    ...prev,
    RSTPURL: {
       ...prev.RSTPURL,
      // [`${cam}.url`]: value
       [cam]: value
    }
  }));

  setChangedSections((prev) => ({ ...prev, rtsp: true }));
};
const handleQuadChange = (name, value) => {
    setIsChangedQuad(true);
  setTranscoderStats((prev) => ({
    ...prev,
    Quad: {
      ...prev.Quad,
      [name]: name === "bitrate" ? Number(value) * 1000 : value
    }
  }));

  setChangedSections((prev) => ({ ...prev, quad: true }));
};



  useEffect(() => {
  if (showTerminal && terminalData?.camName) {
    // const ip = navState?.ip || "unknown";

    intervalRef.current = setInterval(() => {
      fetchCamStatus('192.168.66.12', terminalData.camName);
    }, 1000); // 30 seconds
  }

  return () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
}, [showTerminal]);


    //   useEffect(() => {
    //     setCamone(cam1);
    //     setCamtwo(cam2);
    //     setCamthree(cam3);
    //     setCamfour(cam4);
    //     setBitRate(bitrate);
    //     setProfile(prfle);
    //     setXpos(xps);
    //     setYpos(yps);
    // }, [cam1,cam2,cam3,cam4,bitrate,prfle,xps,yps])

       const getServiceCheckStatus = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url);
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

    useEffect(() => {
        const fetchData = async () => {
            let url = `http://localhost:8980/metronms/api/v2/troubleshoot/transcoder/192.168.66.12/servicecheck`;
            await getServiceCheckStatus(url);
        };
        fetchData();
    }, []);


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
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
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
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setUpTimeData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

      const getTemperatureDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
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
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setTempData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/uptime`;
            await getServerStatusDt(url);
        };
        fetchData();
    }, []);


    useEffect(()=> {
         const fetchData = async () => {
            let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`;
            await getTemperatureDt(url);
        };
        fetchData();
    },[])


    const handleEditBit=()=>{
        setIsEditMode(true);
    }

    const nodeLocation = useSelector((state) => state.node.node.location) || localStorage.getItem('nodeLocation');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');



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


const fetchCamStatus = async (camName) => {
  const url = `http://localhost:8980/metronms/api/v2/troubleshoot/transcoder/192.168.66.12/cameraping/${camName}`;

  try {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });

    const username = "admin";
    const password = "admin";
    const token = btoa(`${username}:${password}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error("Data not found");
    }

    setTempData(data);

    // Parse microseconds
    let ms, bytes;

    if (data?.value) {
      const microseconds = parseFloat(data.value.replace("µs", ""));
      ms = microseconds / 1000;   // convert to milliseconds
      bytes = microseconds / 600; // your custom formula
    } else {
      ms = "N/A";
      bytes = 0;
    }

    setTerminalData(prev => ({
      ...prev,
      camName,
      status: data?.status || "unknown",
      pingHistory: [...(prev.pingHistory || []), { ms, bytes }],
      loading: false
    }));

    setIsLoading(false);

  } catch (err) {

    setIsLoading(false);
    setIsError({ status: true, msg: err.message });

    setTerminalData(prev => ({
      ...prev,
      camName,
      status: "error",
      pingHistory: [...(prev.pingHistory || []), { ms: "Error", bytes: 0 }],
      loading: false
    }));
  }
};

const handleCamStatus = async (camName) => {
//const ip = navState?.ip || "unknown";

  setShowTerminal(true);

  setTerminalData({
    camName,
    status: "loading",
    pingHistory: [],
    loading: true
  });

  await fetchCamStatus(camName);
  
};



const rebootQuadTranscoderService = async () => {
  try {
    setIsApplyingQuad(true);
    const ip = "192.168.66.12"; // replace with your dynamic IP if needed
    const stopUrl = `http://${ip}:8084/transcoder/api/v1/service/stop`;
    const startUrl = `http://${ip}:8084/transcoder/api/v1/service/start`;

    // Stop service
    const stopResponse = await fetch(stopUrl, { method: "POST" });
    if (!stopResponse.ok) {
      throw new Error(`Failed to stop transcoder. Status: ${stopResponse.status}`);
    }
    console.log("Transcoder stopped");

    // Wait 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Start service
    const startResponse = await fetch(startUrl, { method: "POST" });
    if (!startResponse.ok) {
      throw new Error(`Failed to start transcoder. Status: ${startResponse.status}`);
    }
    console.log("Transcoder started");

    // Show alert only if both requests succeeded
    setIsApplyQuad(false);
    setIsApplyingQuad(false);
    alert("Configuration applied successfully");
     setTriggerConfig((prev) => prev +1);
  } catch (error) {
    console.error("Error rebooting transcoder:", error);
    setIsApplyingQuad(false);
    setIsApplyQuad(false);

  }
};

const rebootRstpTranscoderService = async () => {
  try {
    setIsApplyingRstpurl(true);
    const ip = "192.168.66.12"; // replace with your dynamic IP if needed
    const stopUrl = `http://${ip}:8084/transcoder/api/v1/service/stop`;
    const startUrl = `http://${ip}:8084/transcoder/api/v1/service/start`;

    // Stop service
    const stopResponse = await fetch(stopUrl, { method: "POST" });
    if (!stopResponse.ok) {
      throw new Error(`Failed to stop transcoder. Status: ${stopResponse.status}`);
    }
    console.log("Transcoder stopped");

    // Wait 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Start service
    const startResponse = await fetch(startUrl, { method: "POST" });
    if (!startResponse.ok) {
      throw new Error(`Failed to start transcoder. Status: ${startResponse.status}`);
    }
    console.log("Transcoder started");

    // Show alert only if both requests succeeded
    setIsApplyRstpurl(false);
    setIsApplyingRstpurl(false);
    alert("Configuration applied successfully");
     setTriggerConfig((prev) => prev +1);
  } catch (error) {
    console.error("Error rebooting transcoder:", error);
     setIsApplyRstpurl(false);
    setIsApplyingRstpurl(false);

  }
};


  const handleQuadConfiguration = async () => {

        try {
           setIsSavingQuad(true); 
            const requestBody = {
                            "section": 'Quad',
                            "values": { ...transcoderStats.Quad } 
                            }

            const options = {
                method: "POST",
                headers: {
                    // "Authorization": `Basic ${token}`,
                    "Content-Type": "application/json",
                    'Accept': '*/*'
                },
                body: JSON.stringify(requestBody)
            };
            const response = await fetch(`http://localhost:8980/metronms/api/v2/nodemanageview/tranquad/1170`,options);
            // const data = await response.json();

        let data = null;

        const text = await response.text(); // read response safely
        if (text) {
            data = JSON.parse(text); // only parse if not empty
        }

            if (response?.ok === true || response?.status === 200) {
                setIsLoading(false);
                setIsSavingQuad(false);
                setIsChangedQuad(false);
                setIsApplyQuad(true);
                    alert("Configuration Saved successfully")
                // await rebootTranscoderService();
            //    await handleCommit();

                // setConfigData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
      };



      const handleRstpurlConfiguration = async () => {

        try {
           setIsSavingRstpurl(true); 
           const requestBody = {
                            "section": 'Quad',
                            "values": { ...transcoderStats.RSTPURL } 
                            }
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                 body: JSON.stringify(requestBody)
            };
            const response = await fetch(`http://localhost:8980/metronms/api/v2/nodemanageview/trancam/1170`,options);
            // const data = await response.json();

        let data = null;

        const text = await response.text(); // read response safely
        if (text) {
            data = JSON.parse(text); // only parse if not empty
        }

            if (response?.ok === true || response?.status === 200) {
                    alert("Configuration Saved successfully")
                setIsLoading(false);
            //    await handleCommit();

                setIsSavingRstpurl(false);
                setIsApplyRstpurl(true);
                setIsChangedRstpurl(false);
                // setConfigData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
      };


  const handleSaveConfiguration = async () => {
  try {
    if (changedSections.quad) {
      await handleQuadConfiguration();
    }

    if (changedSections.rtsp) {
      await handleRstpurlConfiguration();
    }

    setChangedSections({ quad: false, rtsp: false });

    // setCanApply(true);
  } catch (error) {
    console.error("Error saving configuration:", error);
  }
};



// const handleSaveConfiguration = async () => {
//   const ip = location.state?.deviceInfo?.ip;
//   try {
//     if (changedSections.quad) {
//       await transcoderService.quadAPICall(ip, transcoderStats.Quad);
//     }

//     if (changedSections.rtsp) {
//       await transcoderService.rTSPAPICall(ip, transcoderStats.RTSPURL);
//     }

//     setChangedSections({ quad: false, rtsp: false });
//      setCanApply(true);


    return (
        <>

            <article className="row">
                <article
                    className="col-md-12"
                    style={{ padding: "10px", backgroundColor: "#cccccc" }}
                >

                    <article className="container-fluid">
                        <article className="row" style={{ display: "flex" }}>
                            <article className="col-md-2 nodelistheight" id="summary-1 div1" style={{minHeight:'1112px',maxHeight:'1112px',background:'white'}}>
                                <article>

                                    <article className="" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" src={transcoderImage} alt="transcoderImage" width="210px" height="190px" />
                                            <label className="summarymode"> {transcoderStats?.System?.ser}</label>
                                            <label className="summarymode" style={{ display: 'block' }}> {nodeLocation} ({transcoderStats?.System?.sysname})</label>
                                            <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
                                            <label className="summarymode" style={{ display: 'block',marginTop:'7px' }}>Temperature:{tempData.temp}</label>
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
                                                    <img
                                                        src={radioimage}
                                                        alt=""
                                                        style={{ marginRight: "6px" }}
                                                    />
                                                    <h6>NTP <span>{transcoderStats?.System?.sntpip} </span></h6>
                                                </li>
                                                <li>
                                                    <i
                                                        className="hardwareversionicon"
                                                        style={{ marginRight: "6px" }}
                                                    ></i>
                                                    <h6>Hardware Version <span>{transcoderStats?.System?.hardware}</span></h6>
                                                </li>
                                                <li>  <img
                                                    src={bootloader}
                                                    alt=""
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        marginRight: "6px",
                                                    }}
                                                />
                                                    <h6> Firmware Version <span>{transcoderStats?.System?.firmware} </span></h6>
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
                                            <article className="col-4 col-md-4 quadcont">
                                                <h1 className="quadhead">Quad</h1>
                                                < article className="">
                                                    <article className="card-sub">
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Bitrate</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                             <input
                                                            className="transcoderinput"
                                                            name="bitrate"
                                                             value={
                                                                transcoderStats?.Quad?.bitrate
                                                                ? transcoderStats.Quad.bitrate / 1000
                                                                : ""
                                                            }
                                                            onChange={(e) => handleQuadChange("bitrate", e.target.value)}
                                                            required
                                                        />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Profile</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                           <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.Quad?.profile ?? ""}
                                                            onChange={(e) => handleQuadChange("profile", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Xpos</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                           <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.Quad?.xpos ?? ""}
                                                            onChange={(e) => handleQuadChange("xpos", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Ypos</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                          <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.Quad?.ypos ?? ""}
                                                            onChange={(e) => handleQuadChange("ypos", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        {/* <article className="" style={{textAlign:'center'}}>
                                                              <button className="resetbtn" style={{marginRight:'15px'}} 
                                                              onClick={handleEditBit}
                                                              >Edit</button>
                                                      <button 
                                                        className="createbtn" 
                                                        // onClick={handleAddBitrateData}
                                                        style={{
                                                            pointerEvents: isEditMode ? 'auto' : 'none', 
                                                            opacity: isEditMode ? 1 : 0.5               
                                                        }}
                                                        >
                                                        Save
                                                        </button>

                                              
                                                </article> */}
                                                      <article className="config-savebtn">
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                        onClick={handleSaveConfiguration}
                                                                         disabled={!isChangedQuad || isSavingQuad}
                                                                        style={{
                                                                            pointerEvents: (!isChangedQuad || isSavingQuad) ? 'none' : 'auto',
                                                                            opacity: (!isChangedQuad || isSavingQuad) ? 0.6 : 1          
                                                                        }}
                                                                        >
                                                                            Save
                                                                            
                                                                        </button>

                                                                    </article>
                                                                    <article>
                                                                       <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                            disabled={!isApplyQuad}
                                                                            onClick={rebootQuadTranscoderService}
                                                                            style={{
                                                                                pointerEvents: (!isApplyQuad) ? 'none' : 'auto',
                                                                                opacity: (!isApplyQuad) ? 0.6 : 1
                                                                            }}
                                                                        >
                                                                            {isApplyingQuad ? "Applying..." : "Apply"}
                                                                            {/* Apply */}
                                                                        </button>
                                                                    </article>

                                                                </article>
                                                    </article>
                                                </article>
                                              
                                            </article>
                                            <article className="col-8 col-md-8 rstcont">
                                                <h1 className="quadhead">RSTPURL</h1>
                                                < article className="">
                                                    <article className="card-sub">
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam1URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                                <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.RSTPURL?.["cam1.url"] ?? ""}
                                                            onChange={(e) => handleRTSPChange("cam1.url", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam2URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                           <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.RSTPURL?.["cam2.url"] ?? ""}
                                                            onChange={(e) => handleRTSPChange("cam2.url", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam3URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                           <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.RSTPURL?.["cam3.url"] ?? ""}
                                                              onChange={(e) => handleRTSPChange("cam3.url", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam4URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                           <input
                                                            type="text"
                                                            className="transcoderinput"
                                                            value={transcoderStats?.RSTPURL?.["cam4.url"] ?? ""}
                                                            onChange={(e) => handleRTSPChange("cam4.url", e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                    {/* <article className="" style={{textAlign:'center'}}>
                                                         <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                        onClick={handleSaveConfiguration}
                                                                         disabled={!isChanged || isSaving}
                                                                        style={{
                                                                            pointerEvents: (!isChanged || isSaving) ? 'none' : 'auto',
                                                                            opacity: (!isChanged || isSaving) ? 0.6 : 1  
                                                                                    
                                                                        }}
                                                                        >
                                                                            {isSaving ? "Saving..." : "Save"}
                                                                        </button>
                                                      <button className="createbtn" >Save</button>
                                               
                                                </article> */}
                                                 <article className="config-savebtn">
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                        onClick={handleSaveConfiguration}
                                                                       disabled={!isChangedRstpurl || isSavingRstpurl}
                                                                        style={{
                                                                            pointerEvents: (!isChangedRstpurl || isSavingRstpurl) ? 'none' : 'auto',
                                                                            opacity: (!isChangedRstpurl || isSavingRstpurl) ? 0.6 : 1          
                                                                        }}
                                                                        >
                                                                            {/* {isSaving ? "Saving..." : "Save"} */}
                                                                            Save
                                                                        </button>

                                                                    </article>
                                                                    <article>
                                                                       <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                            onClick={rebootRstpTranscoderService}
                                                                             disabled={!isApplyRstpurl}
                                                                            style={{
                                                                                pointerEvents: (!isApplyRstpurl) ? 'none' : 'auto',
                                                                                opacity: (!isApplyRstpurl) ? 0.6 : 1
                                                                            }}
                                                                        >
                                                                            {isApplyingRstpurl ? "Applying..." : "Apply"}
                                                                        </button>
                                                                    </article>

                                                                </article>
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
                                            {item.status === "success" ? (
                                            <span>✔ {item.status === "success" ?  "Running" : "Failed" } </span>
                                            ) : item.status === "failure" ? (
                                            <span>✖ Failed</span>
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
                                        Check Camera Connectivity
                                        </h3>
                                        <article>
                                        <ul className="configlist">
                                        {parsedServices?.slice(3, 7).map((item, index) => (
                                            <li
                                            key={index}
                                            className=""
                                            >
                                            <h6>{item.displayName}</h6>
                                            {item.status === "success" ? (
                                                <span>✔ {item.status === "success" ?  "Pinging" : "Failed" } {item.value ? `(${formatValue(item.value)})` : ""}  
                                                <button type="button" className="createbtn" onClick={() => handleCamStatus(item.name)}>ping</button>
                                                 </span>
                                                ) : item.status === "failure" ? (
                                                <span className="">✖ Not Pinging {item.value ? `(${formatValue(item.value)})` : ""}  
                                                <button type="button" className="createbtn" onClick={() => handleCamStatus(item.name)}>ping</button>
                                                 </span>
                                                ) : (
                                                <span className="pulse">Checking...</span>
                                                )}
                                            </li>
                                        ))}
                                        </ul>
                                        </article>
                                        {showTerminal && (
                                            <div className="terminal-overlay">
                                                <div className="terminal-window">

                                                <button
                                                    className="terminal-close"
                                                    onClick={() => setShowTerminal(false)}
                                                >
                                                    ✖
                                                </button>

                                                <div className="terminal-body">
                                                    {terminalData?.loading ? (
                                                    <p className="terminal-loading">
                                                        Pinging {terminalData.camName}...
                                                    </p>
                                                    ) : (
                                                    <>
                                                        <p>Pinging $: {terminalData.camName}</p>

                                                        <ul className="terminal-list">
                                                        {terminalData.pingHistory.map((ping, index) => (
                                                            <li key={index}>
                                                            {Math.round(ping.bytes)} bytes from {'192.168.66.12'|| "unknown"} :
                                                            time =
                                                            {typeof ping.ms === "number"
                                                                ? ping.ms.toFixed(3)
                                                                : ping.ms} ms
                                                            </li>
                                                        ))}
                                                        </ul>
                                                    </>
                                                    )}
                                                </div>

                                                </div>
                                            </div>
                                            )}
                                        </div>
                                    </article>

                                </article>
                            </article>
                        </article>
                    </article>

                </article>
            </article>
        </>
    )
}

export default TcSummaryTab;