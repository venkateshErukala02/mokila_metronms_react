import { useState, useEffect } from "react";
import '../../../src/pages/ornms.css';
import nodeimage from "../../assets/img/suinodeview.png";
import radioimage from "../../assets/img/radiomode.png";
import bootloader from "../../assets/img/bootloader.png";
import SignalIconn from "./configsignal";





const SnConfigurationTab = ({ nodeItemDt }) => {


    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");



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

    const [configTab, setConfigTab] = useState("basic");
    const [changedConfig, setChangedConfig] = useState({});
    const [isChanged, setIsChanged] = useState(false);
    const [canApply, setCanApply] = useState(false);
    const [config, setConfig] = useState([]);
    const [step, setStep] = useState(0);
    const [linkDetails, setLinkDetails] = useState(null);


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
    const radioModeOptions = ['SU', 'BSU'];
    const countryOptions = ["EU", "JP", "CN", "US"];
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
    const singleStOptions = ['MCS0  (13.5Mbps)', 'MCS1  (27Mbps) ', 'MCS2  (40.5Mbps)', 'MCS3  (54Mbps)', 'MCS4  (81Mbps)', 'MCS5  (108Mbps)', 'MCS6  (121.5Mbps)', 'MCS7  (135Mbps)']
    const dualStOptions = ['MCS8  (27Mbps)', 'MCS9  (54Mbps)', 'MCS10 (81Mbps)', 'MCS11 (108Mbps)', 'MCS12 (121.5Mbps)', 'MCS13 (135Mbps)', 'MCS14 (202.5Mbps)', 'MCS15 (270Mbps)']
    const autoStOptions = [...singleStOptions, ...dualStOptions]
    const channelOptions = ["Auto", "36", "40", "44", "48", "149", "153", "157", "158", "161"];

    const [dataStream, setDataStream] = useState("Single");


    const getDdrsOptions = () => {
        if (dataStream === "Single") return singleStOptions;
        if (dataStream === "Dual") return dualStOptions;
        return autoStOptions;
    };


    const serviceStatus = [
        { name: "Link Details", status: "running" },
    ];


    //   const getConfigSummaryDt = async (url) => {
    //     setIsLoading(true);
    //     setIsError({ status: false, msg: "" });
    //     try {
    //       const username = "admin";
    //       const password = "admin";
    //       const token = btoa(`${username}:${password}`);
    //       const options = {
    //         method: "GET",
    //         headers: {
    //           "Authorization": `Basic ${token}`,
    //           "Content-Type": "application/json",
    //         },
    //       };
    //       const response = await fetch(url, options);
    //       const data = await response.json();

    //       if (response.ok) {
    //         setIsLoading(false);


    //         setNodeItemDt(data);
    //         setIsError({ status: false, msg: "" });
    //       } else {
    //         throw new Error("Data not found");
    //       }
    //     } catch (error) {
    //       setIsLoading(false);
    //       setIsError({ status: true, msg: error.message });
    //     }
    //   };

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
    //       await getConfigSummaryDt(url);
    //     };
    //     fetchData();
    //   }, [nodeDataId]);



    //   const handleSaveConfiguration = async () => {
    //     try {
    //       const response1 = await trainradiosService.updateDeviceConfiguration(targetSessionId, changedConfig);

    //       if (response1?.ok === true || response1?.status === 200) {
    //         setIsChanged(false);
    //         const response2 = await trainradiosService.applyCommit(targetSessionId);

    //         if (response2?.ok === true || response2?.status === 200) {
    //           setCanApply(true);
    //         } else {
    //           console.error("Second API call failed:", response2);
    //         }
    //       } else {
    //         console.error("First API call did not succeed:", response1);
    //       }
    //     } catch (error) {
    //       console.error("API call failed:", error);
    //     }
    //   };


    //   const handleApplyConfiguration = async () => {
    //     const ip = location.state?.deviceInfo?.ip;

    //     if (!targetSessionId) {
    //       console.error("Session ID not found");
    //       return;
    //     }

    //     try {
    //       const resp = await trainradiosService.applyConfiguration(targetSessionId);
    //       console.log("Applied successfully:", resp);

    //       setCanApply(false);
    //       // await fetchConfiguration();

    //     } catch (error) {
    //       console.error("Apply failed:", error);
    //     }
    //   };



    const handleStationConfigChange = (key, value) => {
        setConfig((prev) => ({
            ...prev,
            config: {
                ...prev.config,
                [key]: value
            }
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


    const SignalStrength = ({ value }) => {
          const MIN = 0;
          const MAX = 0.25;
        
          const normalized = Math.min(
            Math.max((value - MIN) / (MAX - MIN), 0),
            1
          );
        
          const activeCells = Math.ceil(normalized * 5);
        
          const getClass = (cell) =>
            // cell <= activeCells ? 'fill-green-400' : 'fill-gray-400';
           cell <= activeCells ? "signal-active" : "signal-inactive";
        
          return <SignalIconn getClass={getClass} />;
        };


         const getServiceCheckDt = async (url) => {
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


                setLinkDetails(data.links);
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
            let url = `http://localhost:8980/metronms/api/v2/nodelinks/linkstats?nodeId=1429`;
            await getServiceCheckDt(url);
        };
        fetchData();
    }, []);

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





    return (
        <>

            <article className="row">
                <article
                    className="col-md-12"
                    style={{ padding: "10px", backgroundColor: "#cccccc" }}
                >

                    <article className="container-fluid">
                        <article className="row" style={{ display: "flex" }}>
                            <article className="col-md-2 nodelistheight" id="summary-1 div1" style={{ minHeight: '1112px', maxHeight: '1112px', background: 'white' }}>
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
                                    <article className="container-fluid" style={{ borderBottom: '10px solid #cccccc' }}>
                                        <article style={{ padding: '15px' }}>
                                            <article className="row config-ht">
                                                <article className="col-md-12" style={{ display: 'flex', justifyContent: 'center' }}>
                                                    <ul className="obcsublist">
                                                        <li onClick={() => handleRowClick('basic')} className={`${configTab === 'basic' ? 'active' : ''}`}><a>Basic</a></li>
                                                        <li onClick={() => handleRowClick('advance')} className={`${configTab === 'advance' ? 'active' : ''}`}><a>Advanced</a></li>

                                                    </ul>
                                                    <hr />
                                                </article>
                                                <hr />
                                                <article className="col-12 col-md-12">
                                                    < article>
                                                        {configTab === 'basic' && (
                                                            <article className="card-sub">
                                                                <article>
                                                                    <article className="row config-p">
                                                                        <article className="col-sm-6 col-md-6 col-lg-6">
                                                                            <article className="col-12">
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Radio Mode</label><article className="col-sm-4 col-md-4 col-lg-4 ">
                                                                                    <input type="text" className="config-input"
                                                                                        value={config?.config?.radioMode || ''}
                                                                                        disabled
                                                                                    />
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Frequency Domain</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={config?.config?.freqDomain ?? ""}
                                                                                        onChange={(e) =>
                                                                                            handleStationConfigChange(
                                                                                                "freqDomain",
                                                                                                e.target.value === "" ? null : e.target.value
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select Frequency Domain</option>

                                                                                        {countryOptions.map(opt => (
                                                                                            <option key={opt} value={opt}>
                                                                                                {opt}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Preferred Channel Bandwidth</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={config?.config?.bandwidth ?? ""}
                                                                                        onChange={(e) =>
                                                                                            handleStationConfigChange(
                                                                                                "bandwidth",
                                                                                                e.target.value === "" ? null : Number(e.target.value)
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select</option>

                                                                                        {bandwidthOptions.map(opt => (
                                                                                            <option key={opt} value={opt}>
                                                                                                {opt} MHz
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Active Bandwidth</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <input type="text" className="config-input" value={config?.config?.currentChannelBandwidth || ''}
                                                                                        disabled
                                                                                    />
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Operational Mode</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={config?.config?.operationalMode ?? ""}
                                                                                        onChange={(e) =>
                                                                                            handleStationConfigChange(
                                                                                                "operationalMode",
                                                                                                e.target.value === "" ? null : e.target.value
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select Mode</option>

                                                                                        {operationalModeOptions.map(opt => (
                                                                                            <option key={opt} value={opt}>
                                                                                                {opt}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Auto Channel Selection Bandwidth</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={config?.config?.autoChannelSelection ?? ""}
                                                                                        onChange={(e) =>
                                                                                            handleStationConfigChange(
                                                                                                "autoChannelSelection",
                                                                                                e.target.value === "" ? null : e.target.value
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        <option value="">Select Channel</option>

                                                                                        {radioStatusOptions.map(opt => (
                                                                                            <option key={opt.value} value={opt.value}>
                                                                                                {opt.label}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </article>
                                                                                </article>
                                                                            </article>
                                                                        </article>
                                                                        <article className="col-sm-6 col-md-6 col-lg-6">
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Preferred Channel </label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={config?.config?.prefChannel || ''}
                                                                                    onChange={(e) => handleStationConfigChange("preferredChannelBandwidth", Number(e.target.value) || 0)}
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Network Name</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={config?.config?.netname || ''}

                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Active Channel</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={config?.config?.prefChannel || ''}

                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Satellite Density</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <select
                                                                                    className="config-input"
                                                                                    disabled
                                                                                    value={config?.config?.satelliteDensity ?? ""}
                                                                                    onChange={(e) =>
                                                                                        handleStationConfigChange(
                                                                                            "satelliteDensity",
                                                                                            e.target.value === "" ? null : Number(e.target.value)
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    <option value="">Select Density</option>
                                                                                    {satelliteDensityOptions.map(opt => (
                                                                                        <option key={opt.value} value={opt.value}>
                                                                                            {opt.label}
                                                                                        </option>
                                                                                    ))}
                                                                                </select>
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Auto TX Antenna Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={config?.config?.txAntennaStatus || ''}
                                                                                    onChange={(e) => handleStationConfigChange("txAntennaStatus", Number(e.target.value) || 0)}
                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Rx Antenna Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <div className="flex flex-row gap-4">
                                                                                    {["A1", "A2", "A3"].map((antenna) => {
                                                                                        const selected = getSelectedAntennas(config?.config?.rxAntennas);

                                                                                        return (
                                                                                            <label key={antenna} className="flex vlanlabel checkbox-mr">
                                                                                                <input
                                                                                                    type="checkbox"
                                                                                                    checked={selected.includes(antenna)}
                                                                                                    onChange={(e) =>
                                                                                                        handleRxAntennaChange(antenna, e.target.checked)
                                                                                                    }
                                                                                                    className="config-checkbox"
                                                                                                />
                                                                                                {antenna}
                                                                                            </label>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </article>
                                                                            </article>
                                                                        </article>
                                                                    </article>
                                                                </article>
                                                            </article>
                                                        )}
                                                        {configTab === 'advance' && (
                                                            <article className="card-sub config-tab-wh">
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">DDRS Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <select
                                                                        className="config-input"
                                                                        value={config?.config?.DDRSstatus ?? ""}
                                                                        onChange={(e) =>
                                                                            handleStationConfigChange(
                                                                                "DDRSstatus",
                                                                                e.target.value === "" ? null : Number(e.target.value)
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">Select Status</option>

                                                                        {radioStatusOptions.map(opt => (
                                                                            <option key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Data Streams</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <select
                                                                        className="config-input"
                                                                        value={config?.config?.dataStreams ?? ""}
                                                                        onChange={(e) =>
                                                                            setDataStream(e.target.value === "" ? null : Number(e.target.value))
                                                                        }
                                                                    >
                                                                        <option value="">Select Data Stream</option>

                                                                        {dataStreamsOptions.map(opt => (
                                                                            <option key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">DDRS Maximum Data Rate</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" value={config?.config?.DDRSmaxDataRate || ''}
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">DDRS Minimum Data Rate</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input"
                                                                        value={config?.config?.DDRSminDataRate || ''}

                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">ATPC Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <select
                                                                        className="config-input"
                                                                        value={config?.config?.bandwidth ?? ""}
                                                                        onChange={(e) =>
                                                                            handleStationConfigChange(
                                                                                "bandwidth",
                                                                                e.target.value === "" ? null : e.target.value
                                                                            )
                                                                        }
                                                                    >
                                                                        <option value="">Select Channel</option> {/* Placeholder */}

                                                                        {radioStatusOptions.map((opt) => (
                                                                            <option key={opt.value} value={opt.value}>
                                                                                {opt.label}
                                                                            </option>
                                                                        ))}
                                                                    </select>
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Tx Rate</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input" value={config?.config?.txRate || ''}
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Tx Antenna Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <div className="flex flex-row gap-4">
                                                                        {["A1", "A2", "A3"].map((antenna) => {
                                                                            const selected = getTxSelectedAntennas(config?.config?.txAntennas);

                                                                            return (
                                                                                <label key={antenna} className="flex vlanlabel checkbox-mr">
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={selected.includes(antenna)}
                                                                                        onChange={(e) =>
                                                                                            handleTxAntennaChange(antenna, e.target.checked)
                                                                                        }
                                                                                        className="config-checkbox"
                                                                                    />
                                                                                    {antenna}
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </article>
                                                                </article>
                                                                <article className="config-savebtn">
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                        // onClick={handleAddBitrateData}
                                                                        // style={{
                                                                        //     pointerEvents: isEditMode ? 'auto' : 'none', 
                                                                        //     opacity: isEditMode ? 1 : 0.6               
                                                                        // }}
                                                                        >
                                                                            Save
                                                                        </button>

                                                                    </article>
                                                                    <article>
                                                                        <button
                                                                            className="createbtn"
                                                                        // onClick={handleAddBitrateData}
                                                                        // style={{
                                                                        //     pointerEvents: isEditMode ? 'auto' : 'none', 
                                                                        //     opacity: isEditMode ? 1 : 0.6               
                                                                        // }}
                                                                        >
                                                                            Apply
                                                                        </button>

                                                                    </article>

                                                                </article>
                                                            </article>

                                                        )}


                                                    </article>

                                                </article>
                                                {configTab === 'basic' && <article className="config-savebtn">
                                                    <article>
                                                        <button
                                                            className="createbtn"
                                                        // onClick={handleAddBitrateData}
                                                        // style={{
                                                        //     pointerEvents: isEditMode ? 'auto' : 'none', 
                                                        //     opacity: isEditMode ? 1 : 0.6               
                                                        // }}
                                                        >
                                                            Save
                                                        </button>

                                                    </article>
                                                    <article>
                                                        <button
                                                            className="createbtn"
                                                        // onClick={handleAddBitrateData}
                                                        // style={{
                                                        //     pointerEvents: isEditMode ? 'auto' : 'none', 
                                                        //     opacity: isEditMode ? 1 : 0.6               
                                                        // }}
                                                        >
                                                            Apply
                                                        </button>

                                                    </article>

                                                </article>}
                                            </article>
                                        </article>
                                    </article>
                                    <article>
                                            <>
                                                <h3 className="configlinktitle">
                                                    Connection Details
                                                </h3>

                                                <div className="container-grid ">       
                                            <ul className="configlist-st">
                                        {["stationame", "associatedmacaddr","local","lsignal","lsnr", ].map(
                                            (key, index) => {
                                            if (key === "stationame") {
                                                return (
                                                <li key={index} className="">
                                                
                                                    <h6>Connected Car :</h6>
                                                    <div className="">
                                                    <span className="">
                                                        {linkDetails?.stationame ?? ""} 
                                                    </span>
                                                    </div>
                                                </li>
                                                );
                                            }
                                                if (key === "associatedmacaddr") {
                                                return (
                                                <li key={index} className="">
                                                
                                                    <h6>Associated MAC Address :</h6>
                                                    <div className="">
                                                    <span className="">
                                                        {linkDetails?.associatedmacaddr ?? ""} 
                                                    </span>
                                                    </div>
                                                </li>
                                                );
                                            }
                                            if (key === "lsnr") {
                                                return (
                                                <li key={index} className="" style={{paddingTop:'0px'}}>
                                                    
                                                    <h6 style={{paddingTop:"40px"}}>SNR :</h6>
                                                    <span className="" style={{paddingTop:"37px"}}>
                                                        {linkDetails?.[key] === null || linkDetails?.[key] === ""
                                                        ? " --"
                                                        : linkDetails?.[key] + " dB"}
                                                    </span>
                                                    <SignalStrength value={linkDetails?.[key] || 0} />
                                                
                                                </li>
                                                );
                                            }
                                                if (key === "local") {
                                                return (
                                                <li key={index} className="">
                                                    
                                                    <h6 className="">Local</h6>
                                                </li>
                                                );
                                            }
                                            if (key === "lsignal") {
                                                return (
                                                <li key={index} className="">
                                                    
                                                    <h6>Singnal/Noise :</h6>
                                                    <div className="">
                                                    <span className="">
                                                        {linkDetails?.lsignal ?? "--"} dB / {linkDetails?.lnoise ?? "--"} dB
                                                    </span>
                                                    </div>
                                                </li>
                                                );
                                            }

                                            return (
                                                <li key={index} className="">
                                                <h6>{linkDetailsList.find((item) => item.name === key)?.displayName} :</h6>
                                                <span className="">{linkDetails?.[key] ?? ""}</span>
                                                </li>
                                            );
                                            }
                                        )}
                                        </ul>       

                                                <ul className="configlist-st">
                                        {["networkname", "associatedipaddr","remote","rsignal","rsnr"].map(
                                            (key, index) => {
                                                if (key === "networkname") {
                                                return (
                                                <li key={index} className="">
                                                    
                                                    <h6>Network Name :</h6>
                                                    <span className="">{linkDetails?.[key] ?? ""}</span>
                                                </li>
                                                );
                                            }
                                            if (key === "associatedipaddr") {
                                                return (
                                                <li key={index} className="">
                                                    
                                                    <h6>Associated IP Address :</h6>
                                                    <span className="">{linkDetails?.[key] ?? ""}</span>
                                                </li>
                                                );
                                            }
                                            if (key === "remote") {
                                                return (
                                                <li key={index} className="">
                                                    <h6 className="">Remote </h6>
                                                </li>
                                                );
                                            }
                                            if (key === "rsnr") {
                                                return (
                                                <li key={index} className="" style={{paddingTop:'0px'}}>
                                                    
                                                    <h6 style={{paddingTop:"40px"}}>SNR :</h6>
                                                    <span className="" style={{paddingTop:"37px"}}>
                                                        {linkDetails?.[key] === null || linkDetails?.[key] === ""
                                                        ? " --"
                                                        : linkDetails?.[key] + " dB"}
                                                    </span>
                                                    <SignalStrength value={linkDetails?.[key] || 0} />
                                                </li>
                                                );
                                            }
                                            if (key === "rsignal") {
                                                return (
                                                <li key={index} className="">
                                                    
                                                    <h6>Singnal/Noise :</h6>
                                                    <div className="">
                                                    <span className="">
                                                        {linkDetails?.rsignal ?? "--"} dB / {linkDetails?.rnoise ?? "--"} dB
                                                    </span>
                                                    </div>
                                                </li>
                                                );
                                            }

                                            return (
                                                <li key={index} className="">
                                                <h6>{linkDetailsList.find((item) => item.name === key)?.displayName} :</h6>
                                                <span className="">{linkDetails?.[key] ?? ""}</span>
                                                </li>
                                            );
                                            }
                                        )}
                                        </ul>
                                            </div>
                                            </>
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

export default SnConfigurationTab;
