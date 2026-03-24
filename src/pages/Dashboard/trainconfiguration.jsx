import { useState, useEffect } from "react";
import '../../../src/pages/ornms.css';
import nodeimage from "../../assets/img/suinodeview.png";
import radioimage from "../../assets/img/radiomode.png";
import bootloader from "../../assets/img/bootloader.png";
import SignalIconn from "./configsignal";
import { useSelector } from "react-redux";





const TrainConfigurationTab = ({  }) => {


  const [nodeItemDt, setNodeItemDt] = useState([]);

     const nodeDataId = useSelector((state) => state.node?.node?.nodeId || state.node?.node?.id) ?? localStorage.getItem('nodeId');
     const nodeLocation = useSelector((state) => state.node.node.location) || localStorage.getItem('nodeLocation');
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
    const [isChanged, setIsChanged] = useState(false);
    const [canApply, setCanApply] = useState(false);
    const [config, setConfig] = useState([]);
    const [step, setStep] = useState(0);
    const [linkDetails, setLinkDetails] = useState(null);
    const [configData,setConfigData] = useState([]);
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
const [triggerConfig,setTriggerConfig] = useState(0);


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
    const countryOptions = [
  { label: "unitedStates5GHz", value: 1 },
  { label: "unitedStates5p8GHz", value: 2 },
  { label: "unitedStates2p4GHz", value: 3 },
  { label: "world5GHz", value: 4 },
  { label: "world4p9GHz", value: 5 },
  { label: "world2p4GHz", value: 6 },
  { label: "world2p3GHz", value: 7 },
  { label: "world2p5GHz", value: 8 },
  { label: "canada5GHz", value: 9 },
  { label: "wdeurope5p8GHz", value: 10 },
  { label: "wdeurope5p4GHz", value: 11 },
  { label: "wdeurope2p4GHz", value: 12 },
  { label: "russia5GHz", value: 13 },
  { label: "taiwan5GHz", value: 14 },
  { label: "wdunitedStates5GHz", value: 15 },
  { label: "canada5p8GHz", value: 16 },
  { label: "world6p4GHz", value: 17 },
  { label: "japan2p4GHz", value: 18 },
  { label: "japan4p9GHz", value: 19 },
  { label: "wduk5p8GHz", value: 20 },
  { label: "world5p9GHz", value: 21 },
  { label: "unitedStates5p3And5p8GHz", value: 22 },
  { label: "india5p8GHz", value: 23 },
  { label: "brazil5p4GHz", value: 24 },
  { label: "brazil5p8GHz", value: 25 },
  { label: "australia5p4GHz", value: 26 },
  { label: "australia5p8GHz", value: 27 },
  { label: "unitedStates4p9GHz", value: 28 },
  { label: "wdunitedStates4p9GHz", value: 29 },
  { label: "canada4p9GHz", value: 30 },
  { label: "wdjapan4p9GHz", value: 31 },
  { label: "wdlegacy5GHz", value: 32 },
  { label: "wdjapan5p6GHz", value: 33 },
  { label: "wdunitedStates5p8GHz", value: 34 },
  { label: "world5p8GHz", value: 35 },
  { label: "indonesia5p7GHz", value: 36 },
  { label: "minipcirussia6p4", value: 37 },
  { label: "unitedStates5p2And5p8GHz", value: 38 },
  { label: "egypt5p8GHz", value: 39 },
  { label: "reserved", value: 40 },
  { label: "thailand2p4GHz", value: 41 },
  { label: "thailand5p2GHz", value: 42 },
  { label: "thailand5p6GHz", value: 43 },
  { label: "us4p9And5GHz", value: 44 },
  { label: "us5p3And5p4GHz", value: 45 },
  { label: "malaysia5p4GHz", value: 46 },
  { label: "malaysia5p8GHz", value: 47 },
  { label: "afghanistan5p8GHz", value: 48 },
  { label: "canada5p2GHz", value: 49 },
  { label: "canada5p3And5p4GHz", value: 50 },
  { label: "singapore5p4GHz", value: 51 },
  { label: "singapore5p8GHz", value: 52 },
  { label: "nigeria5p3GHz", value: 53 },
  { label: "nigeria5p4GHz", value: 54 },
  { label: "nigeria5p8GHz", value: 55 },
  { label: "nigeria5p3And5p8GHz", value: 56 },
  { label: "china5p2GHz", value: 57 },
  { label: "china5p8GHz", value: 58 },
  { label: "bahrain2p4GHz", value: 59 },
  { label: "bahrain5p3GHz", value: 60 },
  { label: "bahrain5p8GHz", value: 61 },
  { label: "thailand5p4GHz", value: 62 },
  { label: "thailand5p8GHz", value: 63 },
  { label: "india5p2And5p8GHz", value: 64 },
  { label: "india5p3And5p4GHz", value: 65 },
  { label: "japan5p2GHz", value: 66 },
  { label: "japan5p3GHz", value: 67 },
  { label: "unitedStates5p8And5p9GHz", value: 68 },
  { label: "noCountry", value: 201 },
  { label: "worldCC", value: 202 },
  { label: "austria", value: 203 },
  { label: "belgium", value: 204 },
  { label: "belarus", value: 205 },
  { label: "bulgaria", value: 206 },
  { label: "canada", value: 207 },
  { label: "cyprus", value: 208 },
  { label: "czech", value: 209 },
  { label: "denmark", value: 210 },
  { label: "estonia", value: 211 },
  { label: "european", value: 212 },
  { label: "finland", value: 213 },
  { label: "france", value: 214 },
  { label: "germany", value: 215 },
  { label: "greece", value: 216 },
  { label: "hungary", value: 217 },
  { label: "iceland", value: 218 },
  { label: "ireland", value: 219 },
  { label: "italy", value: 220 },
  { label: "latvia", value: 221 },
  { label: "liechtenstein", value: 222 },
  { label: "lithuania", value: 223 },
  { label: "luxembourg", value: 224 },
  { label: "malta", value: 225 },
  { label: "netherlands", value: 226 },
  { label: "norway", value: 227 },
  { label: "poland", value: 228 },
  { label: "portugal", value: 229 },
  { label: "romania", value: 230 },
  { label: "russia", value: 231 },
  { label: "serbia", value: 232 },
  { label: "montenegro", value: 233 },
  { label: "slovakia", value: 234 },
  { label: "slovenia", value: 235 },
  { label: "spain", value: 236 },
  { label: "sweden", value: 237 },
  { label: "switzerland", value: 238 },
  { label: "taiwan", value: 239 },
  { label: "unitedKingdom", value: 240 },
  { label: "unitedStates", value: 241 },
  { label: "australia", value: 242 },
  { label: "egypt", value: 243 },
  { label: "israel", value: 244 },
  { label: "india", value: 245 },
  { label: "mexico", value: 246 },
  { label: "newzealand", value: 247 },
  { label: "us", value: 248 },
  { label: "jp", value: 249 },
  { label: "us0", value: 250 },
  { label: "us1", value: 251 },
  { label: "us2", value: 252 },
  { label: "argentina", value: 253 },
  { label: "brazil", value: 254 },
  { label: "china", value: 255 },
  { label: "hongKong", value: 256 },
  { label: "koreaRoc", value: 257 },
  { label: "singapore", value: 258 },
  { label: "southAfrica", value: 259 },
  { label: "indonesia", value: 260 },
  { label: "malaysia", value: 261 },
  { label: "thailand", value: 262 },
  { label: "thailandindoor", value: 263 },
  { label: "afghanistan", value: 264 },
  { label: "bahrain", value: 265 }
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


   const handleApplyConfiguration = async () => {
  try {
    setIsApplying(true);


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
      setIsError({ status: false, msg: "" });
      alert("Configuration applied successfully");
        setTriggerConfig((prev) => prev +1);

    } else {
      throw new Error("Data not found");
    }

  } catch (error) {
    setIsError({ status: true, msg: error.message });
  } finally {
    setIsApplying(false);
  }
};

    const handleCommit=async()=>{

      try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(`api/v2/nodelinks/radio/commit?nodeId=${nodeDataId}`,options);
              const text = await response.text();
        

            if (response?.ok === true || response.status === 200) {
                setIsLoading(false);
                setCanApply(true);
                 setIsSaving(false);
                 setIsChanged(false);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsSaving(false);
            setIsError({ status: true, msg: error.message });
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
            const response = await fetch(`api/v2/nodelinks/setRadio/Config?nodeId=${nodeDataId}&deviceType=TR`,options);
            // const data = await response.json();

        let data = null;

        const text = await response.text(); // read response safely
        if (text) {
            data = JSON.parse(text); // only parse if not empty
        }

            if (response?.ok === true || response?.status === 200) {
                setIsLoading(false);
               await handleCommit();

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
            let url = `api/v2/nodelinks/getRadio/Config?nodeId=${nodeDataId}&deviceType=TR`;
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
            let url = `api/v2/nodelinks/trainlinkstats?nodeId=${nodeDataId}`;
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
                            <article className="col-md-2" id="summary-1 div1" style={{ minHeight: '850px', maxHeight: '850px', background: 'white' }}>
                                <article>

                                    <article className="card" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" src={nodeimage} alt="node" />
                                            <label className="summarymode"> {nodeItemDt?.nodeDesc}</label>
                                            <label className="summarymode" style={{ display: 'block' }}> Cab Number ({nodeItemDt?.systemName?.replace("TR_", "")})</label>
                                            <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{nodeItemDt?.uptime}</label>
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
                                                    <h6>Radio Mode <span>{nodeItemDt.radioMode === 'sta' ? 'SU' : ''}</span></h6>
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
                                                    <h6> Bandwidth <span>{nodeItemDt.bandwidth} MHz</span></h6></li>
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
                                                                                     <select
                                                                                    className="config-input"
                                                                                    value={configData?.radioMode ?? ""}
                                                                                    // disabled
                                                                                    onChange={(e) => e.preventDefault()}
                                                                                    >
                                                                                    <option value="">Select Mode</option>

                                                                                    {radioModeOptions.map((opt) => (
                                                                                        <option key={opt.value} value={opt.value}>
                                                                                        {opt.label}
                                                                                        </option>
                                                                                    ))}
                                                                                    </select>
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Frequency Domain</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                   <select
                                                                                className="config-input"
                                                                                value={configData?.freqDomain ?? ""}
                                                                                onChange={(e) =>
                                                                                    handleStationConfigChange(
                                                                                    "freqDomain",
                                                                                    e.target.value === "" ? null : e.target.value
                                                                                    )
                                                                                }
                                                                                >
                                                                                <option value="">Select Frequency Domain</option>

                                                                                {countryOptions.map((opt) => (
                                                                                    <option key={opt.value} value={opt.value}>
                                                                                    {opt.label}
                                                                                    </option>
                                                                                ))}
                                                                                </select>
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Preferred Channel Bandwidth</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={configData?.bandwidth ?? ""}
                                                                                        onChange={(e) =>
                                                                                            handleStationConfigChange(
                                                                                                "bandwidth",
                                                                                                e.target.value === "" ? null : (e.target.value)
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
                                                                                    <input type="text" className="config-input" value={configData?.currentChannelBandwidth || ''}
                                                                                        disabled
                                                                                    />
                                                                                </article>
                                                                                </article>
                                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Operational Mode</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                    <select
                                                                                        className="config-input"
                                                                                        value={configData?.operationalMode ?? ""}
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
                                                                                        value={configData?.autoChannelSelection ?? ""}
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
                                                                                <input type="text" className="config-input" value={configData?.channel || ''}
                                                                                    onChange={(e) => handleStationConfigChange("prefChannel", Number(e.target.value) || 0)}
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Network Name</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={configData?.networkName || ''}

                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Active Channel</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <input type="text" className="config-input" value={configData?.channel || ''}

                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Satellite Density</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <select
                                                                                    className="config-input"
                                                                                    disabled
                                                                                    value={configData?.satelliteDensity ?? ""}
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
                                                                                <input type="text" className="config-input" value={configData?.txAntennaStatus || ''}
                                                                                    onChange={(e) => handleStationConfigChange("txAntennaStatus", Number(e.target.value) || 0)}
                                                                                    disabled
                                                                                />
                                                                            </article>
                                                                            </article>
                                                                            <article className="form-row-config "><label for="" className="col-4 config-label">Rx Antenna Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                                <div className="flex flex-row gap-4">
                                                                                    {["A1", "A2", "A3"].map((antenna) => {
                                                                                        const selected = getSelectedAntennas(configData?.rxAntennas);

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
                                                                        value={configData?.DDRSstatus ?? ""}
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
                                                                        value={configData?.dataStreams ?? ""}
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
                                                                    <input type="text" className="config-input"  value={
                                                                                !configData?.ddrsMaxDataRate || configData.ddrsMaxDataRate === "noSuchInstance"
                                                                                ? ""
                                                                                : configData.ddrsMaxDataRate
                                                                            }
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">DDRS Minimum Data Rate</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <input type="text" className="config-input"
                                                                       value={
                                                                                !configData?.ddrsMinDataRate || configData.ddrsMinDataRate === "noSuchInstance"
                                                                                ? ""
                                                                                : configData.ddrsMinDataRate
                                                                            }
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">ATPC Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <select
                                                                        className="config-input"
                                                                        value={configData?.atpcStatus ?? ""}
                                                                        onChange={(e) =>
                                                                            handleStationConfigChange(
                                                                                "atpcStatus",
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
                                                                    <input type="text" className="config-input" value={configData?.txRate || ''}
                                                                        disabled
                                                                    />
                                                                </article>
                                                                </article>
                                                                <article className="form-row-config "><label for="" className="col-5 config-label">Tx Antenna Status</label><article className="col-sm-4 col-md-4 col-lg-4">
                                                                    <div className="flex flex-row gap-4">
                                                                        {["A1", "A2", "A3"].map((antenna) => {
                                                                            const selected = getTxSelectedAntennas(configData?.txAntennas);

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
                                                                            type="button"
                                                                        onClick={currentUser !== 'Read-only' ?handleSaveConfiguration : undefined}
                                                                         disabled={!isChanged || isSaving || isReadOnly}
                                                                        style={{
                                                                            pointerEvents: (!isChanged || isSaving) ? 'none' : 'auto',
                                                                            opacity: (!isChanged || isSaving) ? 0.6 : 1          
                                                                        }}
                                                                        >
                                                                            {isSaving ? "Saving..." : "Save"}
                                                                        </button>

                                                                    </article>
                                                                    <article>
                                                                       <button
                                                                            className="createbtn"
                                                                            type="button"
                                                                            disabled={!canApply || isApplying || isReadOnly}
                                                                            onClick={currentUser !== 'Read-only' ? handleApplyConfiguration : undefined}
                                                                            style={{
                                                                                pointerEvents: (!canApply || isApplying) ? 'none' : 'auto',
                                                                                opacity: (!canApply || isApplying) ? 0.6 : 1
                                                                            }}
                                                                        >
                                                                            {isApplying ? "Applying..." : "Apply"}
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
                                                                            type="button"
                                                                        onClick={currentUser !== 'Read-only' ?  handleSaveConfiguration : undefined}
                                                                         disabled={!isChanged || isSaving || isReadOnly}
                                                                        style={{
                                                                            pointerEvents: (!isChanged || isSaving) ? 'none' : 'auto',
                                                                            opacity: (!isChanged || isSaving) ? 0.6 : 1          
                                                                        }}
                                                                        >
                                                                            {isSaving ? "Saving..." : "Save"}
                                                                        </button>

                                                    </article>
                                                    <article>
                                                         <button
                                                            className="createbtn"
                                                            type="button"
                                                            disabled={!canApply || isApplying || isReadOnly}
                                                            onClick={currentUser !== 'Read-only' ?  handleApplyConfiguration : undefined}
                                                            style={{
                                                                pointerEvents: (!canApply || isApplying) ? 'none' : 'auto',
                                                                opacity: (!canApply || isApplying) ? 0.6 : 1
                                                            }}
                                                        >
                                                            {isApplying ? "Applying..." : "Apply"}
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
                                                
                                                    <h6>Connected Station Name :</h6>
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

export default TrainConfigurationTab;
