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


const TcSummaryTab = ({ transcoderData }) => {
    let cam1 = transcoderData?.RSTPURL?.["cam1.url"]
    let cam2 = transcoderData?.RSTPURL?.["cam2.url"]
    let cam3 = transcoderData?.RSTPURL?.["cam3.url"]
    let cam4 = transcoderData?.RSTPURL?.["cam4.url"]
    let bitrate = transcoderData?.Quad?.bitrate
    let prfle = transcoderData?.Quad?.profile
    let xps = transcoderData?.Quad?.xpos
    let yps = transcoderData?.Quad?.ypos


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
    const [bitRate,setBitRate] = useState(bitrate);
    const [profile,setProfile] = useState(prfle);
    const [xpos,setXpos] = useState(xps);
    const [ypos,setYpos] = useState(yps);
    const [camone,setCamone]=useState(cam1);
    const [camtwo,setCamtwo] = useState(cam2);
    const [camthree,setCamthree] = useState(cam3);
    const [camfour,setCamfour] = useState(cam4);
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
  
 const intervalRef = useRef(null);


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


      useEffect(() => {
        setCamone(cam1);
        setCamtwo(cam2);
        setCamthree(cam3);
        setCamfour(cam4);
        setBitRate(bitrate);
        setProfile(prfle);
        setXpos(xps);
        setYpos(yps);
    }, [cam1,cam2,cam3,cam4,bitrate,prfle,xps,yps])

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
                                            <label className="summarymode"> {transcoderData?.System?.ser}</label>
                                            <label className="summarymode" style={{ display: 'block' }}> {nodeLocation} ({transcoderData?.System?.sysname})</label>
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
                                                    <h6>NTP <span>{transcoderData?.System?.sntpip} </span></h6>
                                                </li>
                                                <li>
                                                    <i
                                                        className="hardwareversionicon"
                                                        style={{ marginRight: "6px" }}
                                                    ></i>
                                                    <h6>Hardware Version <span>{transcoderData?.System?.hardware}</span></h6>
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
                                                    <h6> Firmware Version <span>{transcoderData?.System?.firmware} </span></h6></li>


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
                                                            <input type="text" className="transcoderinput" value={bitRate}
                                                            onChange={(e)=> setBitRate(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Profile</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={profile} 
                                                            onChange={(e)=> setProfile(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Xpos</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={xpos} 
                                                            onChange={(e)=> setXpos(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-4 quadlis">Ypos</label><article className="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={ypos} 
                                                            onChange={(e)=> setYpos(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="" style={{textAlign:'center'}}>
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

                                              
                                                </article>
                                                    </article>
                                                </article>
                                              
                                            </article>
                                            <article className="col-8 col-md-8 rstcont">
                                                <h1 className="quadhead">RSTPURL</h1>
                                                < article className="">
                                                    <article className="card-sub">
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam1URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                                 <input type="text" className="transcoderinput" value={camone}
                                                                 onChange={(e)=> setCamone(e.target.value)}
                                                                 />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam2URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={camtwo} 
                                                            onChange={(e)=> setCamtwo(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam3URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={camthree}
                                                            onChange={(e)=> setCamthree(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Cam4URL</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={camfour} 
                                                            onChange={(e)=> setCamfour(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                    <article className="" style={{textAlign:'center'}}>
                                                         <button className="resetbtn" style={{marginRight:'15px'}}>Edit</button>
                                                      <button className="createbtn" >Save</button>
                                               
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