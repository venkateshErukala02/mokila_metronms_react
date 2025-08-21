import React, { useState, useEffect } from "react";
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
                console.log("Fetched server status:", data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
            console.error("Fetch error:", error);
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
                console.log("Fetched server status:", data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
            console.error("Fetch error:", error);
        }
    };



    //  const handleAddBitrateData = async () => {
    //     if (!bitRate) {
    //         alert("Please select a file first.");
    //         return;
    //     }
    //     const requestBody =  {
    //         name: stationName,
    //         region : {id:stationSel},
    //         stcode: stationCode
    //     };
    //     const method = isEditMode ? 'POST' : 'POST';
    //     const url = isEditMode ? 'api/v2/facilities/update' :'api/v2/facilities'
    //     try {
    //         const username = 'admin';
    //         const password = 'admin';
    //         const token = btoa(`${username}:${password}`)
    //         const response = await fetch(url, {
    //             method,
    //             headers: {
    //                 'Authorization': `Basic ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //             body: JSON.stringify(requestBody),
    //         });
    //         if (response.ok) {
               
    //             // alert(isEditMode ? 'Station updated successfully' : 'Station created successfully')
    //             // handleProfileContclose();
    //             // if(refreshStationData) refreshStationData();
    //             // setStationName('');
    //             // setStationCode('');
    //         } else {
    //             setError('Error starting discovery');
    //         }
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setError('An error occurred while contacting the server.');
    //     } finally {
    //         setLoading(false); // Turn off loading state
    //     }

    // }



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
    return (
        <>

            <article className="row">
                <article
                    className="col-md-12"
                    style={{ padding: "10px", backgroundColor: "#cccccc" }}
                >

                    <article className="container-fluid">
                        <article className="row" style={{ display: "flex" }}>
                            <article className="col-md-2 nodelistheight" id="summary-1 div1" style={{minHeight:'850px',maxHeight:'850px',background:'white'}}>
                                <article>

                                    <article className="" id="div2">
                                        <article style={{ margin: "auto", textAlign: 'center' }}>
                                            <img className="nodeimg" src={transcoderImage} alt="transcoderImage" width="210px" height="190px" />
                                            <label class="summarymode"> {transcoderData?.System?.ser}</label>
                                            <label class="summarymode" style={{ display: 'block' }}> {nodeLocation} ({transcoderData?.System?.sysname})</label>
                                            <label class="summarysytem"><i class="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
                                            <label class="summarymode" style={{ display: 'block',marginTop:'7px' }}>Temperature:{tempData.temp}</label>
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
                                                {/* <li>   <img
                          src={ptmplinkimage}
                          alt="PTMP"
                          style={{ marginRight: "6px" }}
                        /> <h6>Link Type  <span className="">{nodeItemDt[0]?.linkType}</span></h6></li> */}
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
                                                        <article class="form-row"><label for="" class="col-4 quadlis">Bitrate</label><article class="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={bitRate}
                                                            onChange={(e)=> setBitRate(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-4 quadlis">Profile</label><article class="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={profile} 
                                                            onChange={(e)=> setProfile(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-4 quadlis">Xpos</label><article class="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={xpos} 
                                                            onChange={(e)=> setXpos(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-4 quadlis">Ypos</label><article class="col-sm-4 col-md-4 col-lg-5 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={ypos} 
                                                            onChange={(e)=> setYpos(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article className="" style={{textAlign:'center'}}>
                                                              <button className="resetbtn" style={{marginRight:'15px'}} 
                                                              onClick={handleEditBit}
                                                              >Edit</button>
                                                      {/* <button className="createbtn"  disabled={!isEditMode} onClick={handleAddBitrateData} >Save</button> */}
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
                                                        <article class="form-row"><label for="" class="col-3 quadlis">Cam1URL</label><article class="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                                 <input type="text" className="transcoderinput" value={camone}
                                                                 onChange={(e)=> setCamone(e.target.value)}
                                                                 />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-3 quadlis">Cam2URL</label><article class="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={camtwo} 
                                                            onChange={(e)=> setCamtwo(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-3 quadlis">Cam3URL</label><article class="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
                                                            <input type="text" className="transcoderinput" value={camthree}
                                                            onChange={(e)=> setCamthree(e.target.value)}
                                                            />
                                                        </article>
                                                        </article>
                                                        <article class="form-row"><label for="" class="col-3 quadlis">Cam4URL</label><article class="col-sm-9 col-md-9 col-lg-9 quadlisvalue">
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

                                    <TranscoderDashboard />

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