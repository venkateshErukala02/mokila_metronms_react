import { useState, useEffect, useRef, useMemo } from "react";
import '../../../src/pages/ornms.css';
import nodeimage from "../../assets/img/suinodeview.png";
import radioimage from "../../assets/img/radiomode.png";
import bootloader from "../../assets/img/bootloader.png";
import SignalIconn from "./configsignal";
import { useSelector } from "react-redux";



const CamConfigurationTab = ({ }) => {

    const count = useSelector((state) => state);
    const isVisible = useSelector((state) => state.visibility.isVisible);
    const nodeDataId = useSelector((state) => state.node?.node?.nodeId || state.node?.node?.id) ?? localStorage.getItem('nodeId');

    const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress || state.node?.node?.label);

    const currentUser = useSelector((state) => state?.loginuser?.node?.role);
    const isReadOnly = currentUser === 'Read-only';

    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");
    const [svgTemplate, setSvgTemplate] = useState("");
    const [localsnrSignal, setLocalsnrSignal] = useState(null);
    const [remotesnrSignal, setRemotesnrSignal] = useState(null);


    const initialConfig = {
        systemName: '',
        ipAddress: '',
        ssid: '',
        bandwidth: '',
        channel: '',
        radioMode: '',
        country: '',
        hardwareVersion: '',
        serialNumber: '',
        firmwareVersion: '',
        bootloaderVersion: '',
        EthernetMAC: '',
        WiFiMAC: '',
    };
    const svgContainerRef = useRef(null);
    const [configTab, setConfigTab] = useState("basic");
    const [isChanged, setIsChanged] = useState(false);
    const [canApply, setCanApply] = useState(false);
    const [config, setConfig] = useState([]);
    const [step, setStep] = useState(0);
    const [linkDetails, setLinkDetails] = useState(null);
    const [configData, setConfigData] = useState([]);
    const relevantKeys = [
        "channel",
        "bandwidth",
        "networkName",
        "rxAntennas",
        "autoChannelSelection",
        "operationalMode",
        "freqDomain",
        "ddrsStatus",
        "dataStreams",
        "atpcStatus",
        "txAntennas"
    ];

    // Initialize empty first
    const [changedConfig, setChangedConfig] = useState(
        relevantKeys.reduce((acc, key) => {
            acc[key] = '';
            return acc;
        }, {})
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [triggerConfig, setTriggerConfig] = useState(0);
    const [nodeItemDt, setNodeItemDt] = useState([]);

    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);
    const [showApplyPopup, setShowApplyPopup] = useState(false);
    const [showApplySuccessPopup, setShowApplySuccessPopup] = useState(false);


    useEffect(() => {
        if (nodeDataId) {
            localStorage.setItem('nodeId', nodeDataId);

        }
    }, [nodeDataId]);

    useEffect(() => {
        if (nodeIpaddress) {
            localStorage.setItem('nodeIpaddress', nodeIpaddress);
        }
    }, [nodeIpaddress]);

    const getActiveRectIds = (value) => {
        const active = [];

        if (value >= 10) active.push("rect1");
        if (value >= 30) active.push("rect2");
        if (value >= 50) active.push("rect3");
        if (value >= 60) active.push("rect4");
        if (value >= 80) active.push("rect5");

        return active;
    };

    // When API data (configData) arrives, update state
    useEffect(() => {
        if (configData) {
            const updatedConfig = relevantKeys.reduce((acc, key) => {
                acc[key] = configData[key] ?? '';
                return acc;
            }, {});
            setChangedConfig(updatedConfig);
        }
    }, [configData]);


    useEffect(() => {
        const controller = new AbortController();

        fetch("images/bars.svg", { signal: controller.signal })
            .then((res) => res.text())
            .then(setSvgTemplate)
            .catch(console.log);

        return () => controller.abort();
    }, []);

    const renderSvg = (svg, value, color) => {
        if (!svg) return "";

        const doc = new DOMParser().parseFromString(svg, "image/svg+xml");

        const activeRects = getActiveRectIds(value);

        // reset bars
        ["rect1", "rect2", "rect3", "rect4", "rect5"].forEach((id) => {
            const el = doc.getElementById(id);
            if (el) el.setAttribute("fill", "#ccc");
        });

        // active bars
        activeRects.forEach((id) => {
            const el = doc.getElementById(id);
            if (el) {
                el.setAttribute("fill", color);
                el.style.fill = color;
            }
        });

        // label
        const labelEl = doc.getElementById("siglbl");
        if (labelEl) {
            labelEl.textContent = value != null ? `${value} dB` : "";
            labelEl.setAttribute("font-weight", "bold");
        }

        return new XMLSerializer().serializeToString(doc);
    };



    const localSvg = useMemo(() => {
        return renderSvg(svgTemplate, localsnrSignal, "#169b16");
    }, [svgTemplate, localsnrSignal]);

    const remoteSvg = useMemo(() => {
        return renderSvg(svgTemplate, remotesnrSignal, "#169b16");
    }, [svgTemplate, remotesnrSignal]);


    const handleRowClick = (value) => {
        setConfigTab(value);
    }

    useEffect(() => {
        if (step < 2) {
            const timer = setTimeout(() => {
                setStep(step + 1);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [step]);

    const bandwidthOptions = ['20', '40'];
    const radioStatusOptions = [
        { label: "Enable", value: 1 },
        { label: "Disable", value: 2 }
    ];

    const radioModeOptions = [
        { label: "BSU", value: 4 },
        { label: "SU", value: 5 }
    ];

    const preferredChannelsOptions = [-2, -1, 0, 1, 2]
    const operationalModeOptions = ['HT', 'VHT']
    const frequencyExtensionOptions = [
        { label: "upperExtensionChannel", value: 1 },
        { label: "lowerExtensionChannel", value: 2 }
    ];
    const satelliteDensityOptions = [
        { label: "Disable", value: 1 },
        { label: "Large", value: 2 },
        { label: "Medium", value: 3 },
        { label: "Small", value: 4 },
        { label: "Mini", value: 5 },
        { label: "Micro", value: 6 }
    ];

    const dataStreamsOptions = [
        { label: "Single", value: 1 },
        { label: "Dual", value: 2 },
        { label: "Auto", value: 3 }
    ];
    const singleStOptions = [
        { label: "MCS0 (13.5Mbps)", value: 0 },
        { label: "MCS1 (27Mbps)", value: 1 },
        { label: "MCS2 (40.5Mbps)", value: 2 },
        { label: "MCS3 (54Mbps)", value: 3 },
        { label: "MCS4 (81Mbps)", value: 4 },
        { label: "MCS5 (108Mbps)", value: 5 },
        { label: "MCS6 (121.5Mbps)", value: 6 },
        { label: "MCS7 (135Mbps)", value: 7 }
    ];
    const dualStOptions = [
        { label: "MCS8 (27Mbps)", value: 8 },
        { label: "MCS9 (54Mbps)", value: 9 },
        { label: "MCS10 (81Mbps)", value: 10 },
        { label: "MCS11 (108Mbps)", value: 11 },
        { label: "MCS12 (121.5Mbps)", value: 12 },
        { label: "MCS13 (135Mbps)", value: 13 },
        { label: "MCS14 (202.5Mbps)", value: 14 },
        { label: "MCS15 (270Mbps)", value: 15 }
    ];
    const autoStOptions = [...singleStOptions, ...dualStOptions]
    const channelOptions = ["Auto", "36", "40", "44", "48", "149", "153", "157", "158", "161"];

    const [dataStream, setDataStream] = useState("Single");



    const getDdrsOptions = () => {
        if (dataStream === 1) return singleStOptions; // Single
        if (dataStream === 2) return dualStOptions;   // Dual
        if (dataStream === 3) return autoStOptions;   // Auto
        return [];
    };



    const getConfigSummaryDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {

            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url, options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);


                setNodeItemDt(data);
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
            let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
            await getConfigSummaryDt(url);
        };
        fetchData();
    }, [nodeDataId]);



    const handleStationConfigChange = (key, value) => {
        setConfigData(prev => ({
            ...prev,
            [key]: value
        }));

        setIsChanged(true);

        setChangedConfig((prev) => ({
            ...prev,
            [key]: value
        }));
    };




    const getTxSelectedAntennas = (value) => {
        if (!value) return [];
        return Object.keys(antennaMap).filter(
            key => value & antennaMap[key]
        );
    };


    const handleTxAntennaChange = (antenna, checked) => {
        let current = config?.config?.txAntennas || 0; // assume API stores numeric bitmask

        if (checked) {
            current |= antennaMap[antenna]; // add antenna
        } else {
            current &= ~antennaMap[antenna]; // remove antenna
        }

        handleStationConfigChange("txAntennas", current);
    };


    const antennaMap = {
        A1: 1,
        A2: 2,
        A3: 4
    };

    const getSelectedAntennas = (value) => {
        if (!value) return [];

        return Object.keys(antennaMap).filter(
            key => value & antennaMap[key]
        );
    };


    const handleRxAntennaChange = (antenna, checked) => {
        let current = config?.config?.rxAntennas || 0;

        if (checked) {
            current |= antennaMap[antenna]; // add
        } else {
            current &= ~antennaMap[antenna]; // remove
        }

        handleStationConfigChange("rxAntennas", current);
    };



    const getConfigDt = async (url) => {
        if (!url) {
            console.warn("URL is missing. API call skipped.");
            return;
        }
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


                setConfigData(data);
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
            let url = `api/v2/nodelinks/getRadio/Config?nodeId=${nodeDataId}&deviceType=SN`;
            await getConfigDt(url);
        };
        fetchData();
    }, [triggerConfig]);



    const getServiceCheckDt = async (url) => {
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

                const firstLink = data?.links?.[0] ?? null;
                const snrSignalLocal = firstLink?.localsnr;
                const snrSignalRemote = firstLink?.remotesnr;
                setLocalsnrSignal(snrSignalLocal);
                setRemotesnrSignal(snrSignalRemote);
                setLinkDetails(firstLink);
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
            let url = `api/v2/nodelinks/linkstats?nodeId=${nodeDataId}`;
            await getServiceCheckDt(url);
        };
        fetchData();
        const intervalId = setInterval(() => {
            fetchData();
        }, 30000);

        return () => clearInterval(intervalId);
    }, [nodeDataId]);


    const linkDetailsList = [
        { name: "lsnr", displayName: "Local SNR" },
        { name: "rsnr", displayName: "Remote SNR" },
        { name: "lsignal", displayName: "Local Signal" },
        { name: "rsignal", displayName: "Remote Signal" },
        { name: "lnoise", displayName: "Local Noise" },
        { name: "rnoise", displayName: "Remote Noise" },
        { name: "stationame", displayName: "Statio Name" },
        { name: "associatedipaddr", displayName: "Associatedipaddr" },
        { name: "associatedmacaddr", displayName: "Associatedmacaddr" },
    ];




    const handleApplyConfiguration = async () => {
        try {
            setIsApplying(true);

            const commitResponse = await handleCommit();

            if (!commitResponse?.ok) {
                throw new Error("Commit failed. Cannot apply configuration.");
            }

            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(
                `api/v2/nodelinks/radio/reboot?nodeId=${nodeDataId}`,
                options
            );

            let data = null;
            const text = await response.text();

            if (text) {
                data = JSON.parse(text);
            }

            if (response.ok) {
                setShowApplySuccessPopup(true);
                setIsError({ status: false, msg: "" });
                //   alert("Configuration applied successfully");
                setCanApply(false);
                setTriggerConfig((prev) => prev + 1);
                setTimeout(() => {
                    getConfigDt(
                        `api/v2/nodelinks/getRadio/Config?nodeId=${nodeDataId}&deviceType=SN`
                    );
                }, 120000);

            } else {
                throw new Error("Data not found");
            }

        } catch (error) {
            setIsError({ status: true, msg: error.message });
        } finally {
            setIsApplying(false);
        }
    };

    const handleCommit = async () => {

        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(`api/v2/nodelinks/radio/commit?nodeId=${nodeDataId}`, options);
            const text = await response.text();


            if (response?.ok === true || response.status === 200) {
                setIsLoading(false);
                setIsError({ status: false, msg: "" });
                return response;
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            // setIsSaving(false);
            setIsError({ status: true, msg: error.message });
            return null;
        }
    }



    const handleSaveConfiguration = async () => {
        try {
            setIsSaving(true);
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(changedConfig)
            };
            const response = await fetch(`api/v2/nodelinks/setRadio/Config?nodeId=${nodeDataId}&deviceType=SN`, options);
            // const data = await response.json();

            let data = null;

            const text = await response.text(); // read response safely
            if (text) {
                data = JSON.parse(text); // only parse if not empty
            }

            if (response?.ok === true || response?.status === 200) {
                setShowSaveSuccessPopup(true);
                setIsLoading(false);
                setCanApply(true);
                setIsSaving(false);
                setIsChanged(false);
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





    return (
        <>

            <article className="row">
                <article
                    className="col-md-12"
                    style={{ padding: "10px", backgroundColor: "#cccccc" }}
                >

                    <article className="container-fluid">
                        <article className="row" style={{ display: "flex" }}>
                            <article className="col-md-2 nodelistheight" id="summary-1 div1" style={{ minHeight: '956px', maxHeight: '1050px', background: 'white' }}>
                                <article>

                                    <article className="card" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" src={nodeimage} alt="node" />
                                            <label className="summarymode"> {nodeItemDt.nodeDesc}</label>
                                            <label className="summarymode" style={{ display: 'block' }}> {nodeItemDt.station} ({nodeItemDt.systemName})</label>
                                            <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{nodeItemDt.uptime}</label>
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
                                                    <h6>Radio Mode <span>{nodeItemDt.radioMode} </span></h6>
                                                </li>
                                                <li>
                                                    <i
                                                        className="hardwareversionicon"
                                                        style={{ marginRight: "6px" }}
                                                    ></i>
                                                    <h6>Hardware Version <span>{nodeItemDt.hardwareVersion}</span></h6>
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
                                                    <h6> Bandwidth <span>{nodeItemDt.bandwidth} MHz </span></h6></li>
                                                <li>  <img
                                                    src={bootloader}
                                                    alt=""
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        marginRight: "6px",
                                                    }}
                                                />
                                                    <h6> Channel <span>{nodeItemDt.channel} ({nodeItemDt.frequecy} MHz)  </span></h6></li>
                                                <li>  <img
                                                    src={bootloader}
                                                    alt=""
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        marginRight: "6px",
                                                    }}
                                                />
                                                    <h6> SSID <span>{nodeItemDt.ssid} </span></h6></li>
                                                <li> <i
                                                    className="serialnumbericon"
                                                    style={{ marginRight: "6px" }}
                                                ></i><h6> Serial Number<span> {nodeItemDt.serialNumber}</span></h6></li>
                                                <li><i
                                                    className="firmwareicon"
                                                    style={{ marginRight: "6px" }}
                                                ></i><h6> Firmware<span> {nodeItemDt.softwareVersion}</span></h6></li>
                                                <li><i
                                                    className="ethernetmacicon"
                                                    style={{ marginRight: "6px" }}
                                                ></i>
                                                    <h6>Ethernet MAC<span> {nodeItemDt.ethernetMAC}</span></h6></li>
                                                <li>
                                                    <i
                                                        className="wirelessmacicon"
                                                        style={{ marginRight: "6px" }}
                                                    ></i>
                                                    <h6> Wireless MAC
                                                        <span>
                                                            {nodeItemDt.wirelessMAC}
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
                                     <article className="col-12 cam-alignsystem">
                                        <article className="col-4">
                                <article className="form-row-config "><label for="" className="col-4 config-label" style={{fontSize:"16px"}}>System Name</label><article className="col-sm-5 col-md-5 col-lg-5 ">
                                    <input type="text" className="config-input" />
                                </article>
                                </article>
                                <article className="cam-alignbtn">
                                    <button  className="createbtn" type="button">Save</button>
                                </article>
                                <div style={{marginTop:"100px"}}>
                                 <iframe
                                    width="560"
                                    height="315"
                                    src="https://www.youtube.com/watch?v=oRdxUFDoQe0&list=RDoRdxUFDoQe0&start_radio=1"
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    />
                                    </div>
                                </article>
                                </article>
                                
                                    {/* <article className="container-fluid" style={{ borderBottom: '10px solid #cccccc' }}>
                                        <article style={{ padding: '15px' }}>
                                            <article className="row config-ht">

                                            </article>
                                        </article>
                                    </article> */}
                                </article>
                            </article>
                        </article>
                    </article>

                </article>
            </article>
        </>

    )
}

export default CamConfigurationTab;
