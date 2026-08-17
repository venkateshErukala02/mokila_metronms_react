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
import loaderImg from '../../assets/img/progress.gif'
import '../ornms.css'



const TcSummaryTab = ({ triggerCount }) => {
  
    const checkServicesList = [
    { name: "vtranscoder", displayName: "Transcoder Service" },
    { name: "gst-health", displayName: "GST Health" },
    { name: "gstreamer", displayName: "G Stream Service" },
    { name: "cam1", displayName: "Camera 1" },
    { name: "cam2", displayName: "Camera 2" },
    { name: "cam3", displayName: "Camera 3" },
    { name: "cam4", displayName: "Camera 4" },
  ];

   const currentUser = useSelector((state) => state?.loginuser?.node?.role);
          const isReadOnly = currentUser === 'Read-only';
        
    const [isLoading, setIsLoading] = useState("");
    const [uptimeIsLoading,setUptimeIsLoading] = useState(false);
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
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [tempData, setTempData] = useState({});
    const [serviceStatus, setServiceStatus] = useState([]);
    const [parsedServices, setParsedServices] = useState(
        checkServicesList.map(item => ({ ...item, status: "checking", value: null }))
    );
    const [allParsedServices, setAllParsedServices] = useState([]);
    const [showTerminal, setShowTerminal] = useState(false);
    const [showWarningPopup, setShowWarningPopup] = useState(false);
    const [hasFetchedUpTime, setHasFetchedUpTime] = useState(false);
    const [terminalData, setTerminalData] = useState({
        camName: "",
        status: "unknown",
        pingHistory: [], // array to store ping values
        loading: true,
    });

    const [isSavingQuad, setIsSavingQuad] = useState(false);
    const [isSavingRstpurl, setIsSavingRstpurl] = useState(false);
    const [isApplyQuad, setIsApplyQuad] = useState(false);
    const [isApplyRstpurl, setIsApplyRstpurl] = useState(false);
    const [isApplyingQuad, setIsApplyingQuad] = useState(false);
    const [isApplyingRstpurl, setIsApplyingRstpurl] = useState(false);
    const [isChangedQuad, setIsChangedQuad] = useState(false);
    const [isChangedRstpurl, setIsChangedRstpurl] = useState(false);
    const [triggerConfig, setTriggerConfig] = useState(0);

    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [showApplyQuadPopup,setShowApplyQuadPopup] = useState(false);
    const [showApplySuccessPopup, setShowApplySuccessPopup] = useState(false);



    const nodeDataId = useSelector((state) => state.node?.node?.nodeId || state.node?.node?.id) ?? localStorage.getItem('nodeId');
    const nodeLocation = useSelector((state) => state.node?.node?.location || state.node?.node?.facility) ?? localStorage.getItem('nodeLocation');
    const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress ||  state.node?.node?.label) ?? localStorage.getItem('nodeIpaddress');

    useEffect(() => {
        if (nodeDataId) {
            localStorage.setItem('nodeId', nodeDataId);

        }
    }, [nodeDataId]);
    const ipValue = localStorage.getItem('nodeIpaddress')
    const nodeIdValue = localStorage.getItem('nodeId')

    useEffect(() => {
        if (nodeIpaddress) {
            localStorage.setItem('nodeIpaddress', nodeIpaddress);
        }
    }, [nodeIpaddress]);

    const [transcoderStats, setTranscoderStats] = useState({
        System: {
            firmware: '',
            hardware: '',
            device_name: '',
            temperature: '',
            ntp_status: '',
            sntpip: ''
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
            "latency": ""
        }
    });
    const [changedSections, setChangedSections] = useState({
        quad: false,
        rtsp: false
    });


    const intervalRef = useRef(null);




    const getConfigStatus = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/transcoder/api/v1/config`,
            };
            const response = await fetch(url,options);
            const data = await response.json();

            if (response.ok) {
                const { System, Quad, RSTPURL, temp, uptime } = data.data;

                setIsLoading(false);


                setTranscoderStats({
                    System: {
                        firmware: System?.firmware ?? "N/A",
                        hardware: System?.hardware ?? "N/A",
                        device_name: System?.model ?? "N/A",
                        syslogip: System?.syslogip ?? "N/A",
                        temperature: temp ?? "N/A",
                        uptime: uptime ?? "N/A",
                        sntpip: System?.sntpip ?? "N/A"
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
                        "latency": RSTPURL?.latency ?? "",
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

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const nodeId = localStorage.getItem('nodeId');
    //         let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/config`;
    //       //let url = '/transcoder/api/v1/config';

    //         await getConfigStatus(url);
    //     };
    //     fetchData();
    // }, []);



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
                fetchCamStatus(nodeIpaddress, terminalData.camName);
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

        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 20000);

        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/transcoder/api/v1/`,
                signal: controller.signal,
            };
            const response = await fetch(url,options);
            clearTimeout(timeout);
            
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setServiceStatus(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
             clearTimeout(timeout);
            if (error.name === "AbortError") {
                    setIsError({
                    status: true,
                    msg: "Request timed out after 20 seconds",
                });
            } else {
                setIsError({
                    status: true,
                    msg: error.message,
                });
            }
            } finally {
                setIsLoading(false);
            }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         let url = `api/v2/troubleshoot/transcoder/${nodeIpaddress}/servicecheck`;
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
                body: `http://${nodeIpaddress}:8084/transcoder/api/v1/uptime`,
                signal: controller.signal,
            };
            const response = await fetch(url, options);
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
                setUpTimeData(data.data);
                setHasFetchedUpTime(true);
                const urlTemp = 'api/v2/troubleshoot/transcoder/temp';
                const urlService = `api/v2/troubleshoot/transcoder/${nodeIpaddress}/servicecheck`;
                const urlConfig = 'api/v2/troubleshoot/transcoder/config';
                await Promise.all([
                    getTemperatureDt(urlTemp),
                    getServiceCheckStatus(urlService),
                    getConfigStatus(urlConfig)
                ]);
                setIsError({ status: false, msg: "" });
            } else {
                setUptimeIsLoading(true)
                setShowWarningPopup(true);
                throw new Error("Data not found");
            }
        } catch (error) {
            clearTimeout(timeout);
            setUptimeIsLoading(false);
            setShowWarningPopup(true);
            // setIsError({ status: true, msg: error.message });
            if (error.name === "AbortError") {
                setIsError({
                    status: true,
                    msg: "Request timed out (10s)"
                });
            } else {
                setIsError({
                    status: true,
                    msg: error.message
                });
            }
        }
    };

    const getTemperatureDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`,
            };
            const response = await fetch(url,options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setTempData(data.data);
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
        if (!nodeIpaddress) return;
        const fetchData = async () => {
            let url = 'api/v2/troubleshoot/transcoder/uptime';
            await getServerStatusDt(url);
        };
        fetchData();
    }, [nodeIpaddress,triggerCount]);


    // useEffect(()=> {
    //      const fetchData = async () => {
    //         let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/temp`;
    //         await getTemperatureDt(url);
    //     };
    //     fetchData();
    // },[])


    const handleEditBit = () => {
        setIsEditMode(true);
    }




    //    function formatValue(val) {
    //   if (!val) return "";

    //   // Match the numeric part and the unit
    //   const match = val.match(/^([\d.]+)([a-zµ]*)$/i);
    //   if (!match) return val;

    //   const number = parseFloat(match[1]);
    //   const unit = match[2] || "";

    //   // Round to 2 decimals
    //   const rounded = number.toFixed(2);

    //   return `${rounded}${unit}`;
    // }

    function formatValue(val) {
        if (!val) return "";

        // Fix encoding issue
        val = val.replace(/Âµs/g, "µs");

        // Match the numeric part and the unit
        const match = val.match(/^([\d.]+)([a-zµ]*)$/i);
        if (!match) return val;

        const number = parseFloat(match[1]);
        const unit = match[2] || "";

        // Round to 2 decimals
        const rounded = number.toFixed(2);

        return `${rounded}${unit}`;
    }


    const fetchCamStatus = async (nodeIpaddress, camName) => {
        const url = `api/v2/troubleshoot/transcoder/${nodeIpaddress}/cameraping/${camName}`;

        try {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${nodeIpaddress}:8084/transcoder/api/v1/cam/${camName}`,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error("Data not found");
            }

            // setTempData(data);

            // Parse microseconds
            let ms, bytes;
            const pingValue = data?.data?.[camName];
            if (pingValue) {
                const microseconds = parseFloat(pingValue.replace("µs", ""));
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

        await fetchCamStatus(nodeIpaddress, camName);

    };



    const pingMs = parseFloat('620.372'.replace('µs', '')) / 1000;
    const bytes = 620.372 / 600;


    const rebootQuadTranscoderService = async () => {
        try {
            setIsApplyingQuad(true);
            // const stopUrl = `http://${nodeIpaddress}:8084/transcoder/api/v1/service/stop`;
            // const startUrl = `http://${nodeIpaddress}:8084/transcoder/api/v1/service/start`;

            // Stop service
            const stopResponse = await fetch('api/v2/troubleshoot/transcoder/stop', { method: "POST",body: `http://${nodeIpaddress}:8084/transcoder/api/v1/service/stop`});
            if (!stopResponse.ok) {
                throw new Error(`Failed to stop transcoder. Status: ${stopResponse.status}`);
            }
            console.log("Transcoder stopped");

            // Wait 10 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));

            // Start service
            const startResponse = await fetch('api/v2/troubleshoot/transcoder/start', { method: "POST",body: `http://${nodeIpaddress}:8084/transcoder/api/v1/service/start` });
            if (!startResponse.ok) {
                throw new Error(`Failed to start transcoder. Status: ${startResponse.status}`);
            }
            console.log("Transcoder started");

            // Show alert only if both requests succeeded
            setIsApplyQuad(false);
            setIsApplyingQuad(false);
            setShowApplySuccessPopup(true);
            // alert("Configuration applied successfully");
            setTriggerConfig((prev) => prev + 1);
        } catch (error) {
            console.error("Error rebooting transcoder:", error);
            setIsApplyingQuad(false);
            setIsApplyQuad(false);

        }
    };

    const rebootRstpTranscoderService = async () => {
        try {
            setIsApplyingRstpurl(true);
            // const stopUrl = `http://${nodeIpaddress}:8084/transcoder/api/v1/service/stop`;
            // const startUrl = `http://${nodeIpaddress}:8084/transcoder/api/v1/service/start`;

            // Stop service
            const stopResponse = await fetch('api/v2/troubleshoot/transcoder/stop', { method: "POST",body: `http://${nodeIpaddress}:8084/transcoder/api/v1/service/stop`, });
            if (!stopResponse.ok) {
                throw new Error(`Failed to stop transcoder. Status: ${stopResponse.status}`);
            }
            console.log("Transcoder stopped");

            // Wait 10 seconds
            await new Promise((resolve) => setTimeout(resolve, 10000));

            // Start service
            const startResponse = await fetch('api/v2/troubleshoot/transcoder/start', { method: "POST",body: `http://${nodeIpaddress}:8084/transcoder/api/v1/service/start` });
            if (!startResponse.ok) {
                throw new Error(`Failed to start transcoder. Status: ${startResponse.status}`);
            }
            console.log("Transcoder started");

            // Show alert only if both requests succeeded
            setIsApplyRstpurl(false);
            setIsApplyingRstpurl(false);
            setShowApplySuccessPopup(true);
            // alert("Configuration applied successfully");
            setTriggerConfig((prev) => prev + 1);
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
            const response = await fetch(`api/v2/nodemanageview/tranquad/${nodeIdValue}`, options);
            // const data = await response.json();

            let data = null;

            const text = await response.text(); // read response safely
            if (text) {
                data = JSON.parse(text); // only parse if not empty
            }

            if (response?.ok === true || response?.status === 200) {
                setShowSaveSuccessPopup(true);
                setIsLoading(false);
                setIsSavingQuad(false);
                setIsChangedQuad(false);
                setIsApplyQuad(true);
                // alert("Configuration Saved successfully")
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
            const response = await fetch(`api/v2/nodemanageview/trancam/${nodeIdValue}`, options);
            // const data = await response.json();

            let data = null;

            const text = await response.text(); // read response safely
            if (text) {
                data = JSON.parse(text); // only parse if not empty
            }

            if (response?.ok === true || response?.status === 200) {
                setShowSaveSuccessPopup(true);
                // alert("Configuration Saved successfully")
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
                            <article className="col-md-2 nodelistheight" id="summary-1 div1" style={{ minHeight: '864px', maxHeight: '890px', background: 'white' }}>
                                <article>

                                    <article className="" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" src={transcoderImage} alt="transcoderImage" width="210px" height="190px" />
                                            <label className="summarymode"> {transcoderStats?.System?.ser}</label>
                                            <label className="summarymode" style={{ display: 'block' }}> {nodeLocation} ({transcoderStats?.System?.sysname})</label>
                                            <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
                                            <label className="summarymode" style={{ display: 'block', marginTop: '7px' }}>Temperature : {tempData?.temp} °C</label>
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
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                            setShowSavePopup(true);
                                                                        }
                                                                    }}
                                                                    // onClick={currentUser !== 'Read-only' ? handleSaveConfiguration : undefined}
                                                                    disabled={!isChangedQuad || isSavingQuad || isReadOnly}
                                                                    style={{
                                                                        pointerEvents: (!isChangedQuad || isSavingQuad) ? 'none' : 'auto',
                                                                        cursor: isReadOnly ? "not-allowed" : "pointer",
                                                                        opacity: (!isChangedQuad || isSavingQuad || isReadOnly) ? 0.6 : 1
                                                                    }}
                                                                >
                                                                    Save

                                                                </button>

                                                            </article>
                                                            <article>
                                                                <button
                                                                    className="createbtn"
                                                                    type="button"
                                                                    disabled={!isApplyQuad || isReadOnly}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                            setShowApplyQuadPopup(true);
                                                                        }
                                                                    }}
                                                                    // onClick={currentUser !== 'Read-only' ? rebootQuadTranscoderService : undefined}
                                                                    style={{
                                                                        pointerEvents: (!isApplyQuad) ? 'none' : 'auto',
                                                                        cursor: isReadOnly ? "not-allowed" : "pointer",
                                                                        opacity: (!isApplyQuad || isReadOnly) ? 0.6 : 1
                                                                    }}
                                                                >
                                                                    {isApplyingQuad ? "Applying..." : "Apply"}
                                                                    {/* Apply */}
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



                                                        {showApplyQuadPopup && <>
                                                            <article className="confirmdeletepopup">
                                                                <article className="confirmdeletepopupboxstyle">
                                                                    <h1 className="confirmdeletetitle">Are you sure you want to Apply configuration?</h1>
                                                                    <article className="f-r">
                                                                        <button
                                                                            className="confirmdeletebtn"
                                                                            onClick={() => setShowApplyQuadPopup(false)}
                                                                        >
                                                                            NO
                                                                        </button>
                                                                        <button
                                                                            className="confirmdeletebtn confirmdeletebtnyes"
                                                                            onClick={async () => {
                                                                                setShowApplyQuadPopup(false);
                                                                                await rebootQuadTranscoderService();
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
                                                        <article className="form-row"><label for="" className="col-3 quadlis">Latency</label><article className="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input
                                                                type="text"
                                                                className="trans-latencyinput"
                                                                value={transcoderStats?.RSTPURL?.latency ?? ""}
                                                                onChange={(e) => handleRTSPChange("latency", e.target.value)}
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
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                            setShowSavePopup(true);
                                                                        }
                                                                    }}
                                                                    // onClick={currentUser !== 'Read-only' ? handleSaveConfiguration : undefined}
                                                                    disabled={!isChangedRstpurl || isSavingRstpurl || isReadOnly}
                                                                    style={{
                                                                        pointerEvents: (!isChangedRstpurl || isSavingRstpurl) ? 'none' : 'auto',
                                                                        cursor: isReadOnly ? "not-allowed" : "pointer",
                                                                        opacity: (!isChangedRstpurl || isSavingRstpurl || isReadOnly) ? 0.6 : 1
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
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                            setShowApplyPopup(true);
                                                                        }
                                                                    }}
                                                                    // onClick={currentUser !== 'Read-only' ? rebootRstpTranscoderService : undefined}
                                                                    disabled={!isApplyRstpurl || isReadOnly}
                                                                    style={{
                                                                        pointerEvents: (!isApplyRstpurl) ? 'none' : 'auto',
                                                                        cursor: isReadOnly ? "not-allowed" : "pointer",
                                                                        opacity: (!isApplyRstpurl || isReadOnly) ? 0.6 : 1
                                                                    }}
                                                                >
                                                                    {isApplyingRstpurl ? "Applying..." : "Apply"}
                                                                </button>
                                                            </article>

                                                        </article>
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
                                                                                await rebootRstpTranscoderService();
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
                                                    </article>
                                                </article>
                                            </article>
                                        </article>
                                    </article>

                                    <article className="align-pad">
                                        <h3 className="configlinktitle">
                                            Connection Details
                                        </h3>
                                        {/* <article className="loader"></article> */}
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
                                                        ) : (!upTimeData || upTimeData.length === 0) ? (
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
                                                Camera Connectivity
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
                                                                <span>✔ {item.status === "success" ? "Pinging" : "Failed"} {item.value ? `(${formatValue(item.value)})` : ""}
                                                                    <button type="button" className="createbtn" onClick={() => handleCamStatus(item.name)}>ping</button>
                                                                </span>
                                                            ) : item.status === "failure" ? (
                                                                <span className="failure-color" >✖ Not Pinging {item.value ? `(${formatValue(item.value)})` : ""}
                                                                    <button type="button" className="createbtn" onClick={() => handleCamStatus(item.name)}>ping</button>
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
                                                                                64 bytes from {nodeIpaddress || "unknown"} :
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

            {showWarningPopup && (
                <article className="confirmsuccesspopup">
                    <article className="confirmsuccesspopupboxstyle">
                        <article className="success-cont">
                            <h1 className="confirmtitlesucess">Warning</h1>
                            <p className="confirmtextsucess">Transcoder agent is not started/installed.</p>
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

export default TcSummaryTab;