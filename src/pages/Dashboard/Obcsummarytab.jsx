import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import nodeimage from "../../assets/img/suinodeview.png";
import obcimage from '../../assets/img/obcimg1.png'
import radioimage from "../../assets/img/radiomode.png";
import ptmplinkimage from "../../assets/img/PTMPlink.png";
import bootloader from "../../assets/img/bootloader.png";
import NetworkMonitoringDashboard from "./nodeviewchart";
import TranscoderDashboard from "./transcoderdashboard";
import ObcGraphs from "./obcgraphs";
import TranscoderObcSubview from "./obcviewsubtabs/transcoderview";
import StationradioObcSubview from "./obcviewsubtabs/stationradioview";
import TrainradioObcSubview from "./obcviewsubtabs/trainradioview";


const ObcSummaryTab = ({ nodeItemDt, currentTab }) => {
  const [upTimeData, setUpTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");
  const [diskData, setDiskData] = useState("");
  const [currentObcsubTab, setCurrentObcsubTab] = useState('obc')

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress) || localStorage.getItem('nodeIpaddress');

  useEffect(() => {
    if (nodeIpaddress) {
      localStorage.setItem('nodeIpaddress', nodeIpaddress);
    }
  }, [nodeIpaddress]);



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




  useEffect(() => {
    const fetchData = async () => {
      let url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/uptime`;
      await getServerStatusDt(url);
    };
    fetchData();
  }, []);


  const getDiskData = async (url) => {
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
        setDiskData(data);
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

  useEffect(() => {
    const fetchData = async () => {
      let url = `http://localhost:8084/${currentTab}/api/v1/disk`;
      await getDiskData(url);
    };
    fetchData();
  }, []);


  const renderCurrentObcsubTab = (value) => {
    switch (value) {
      case 'obc':
        return <ObcGraphs />
        break;
      case 'transcoder':
         return <TranscoderObcSubview />
        break;
      case 'stationradio':
         return <StationradioObcSubview />
        break;
      case 'trainradio':
        return <TrainradioObcSubview />
        break
      default:
        break;
    }
  }


  const handleRowClick = (value) => {
    setCurrentObcsubTab(value);
  }


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
                      {/* <label class="summarymode"> {nodeItemDt.nodeDesc}</label> */}
                      <label class="summarymode" style={{ display: 'block' }}> Cab - {nodeItemDt?.carnumber || "loading.."}</label>
                      <label class="summarysytem"><i class="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
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
                          <h6> IP<span> {nodeItemDt.obcnetip}</span></h6></li>
                        <li>
                          <h6>Encoder <span>{nodeItemDt.encoderip}</span></h6>
                        </li>
                        <li>
                          <h6>NTP <span>{nodeItemDt.ntpserverip}</span></h6>
                        </li>
                        <li>
                          <h6>Total<span> {diskData.total}</span></h6></li>
                        <li>
                          <h6> Free
                            <span>
                              {diskData.free}
                            </span>
                          </h6>
                        </li>
                        <li>
                          <h6> Used
                            <span>
                              {diskData.used}
                            </span>
                          </h6>
                        </li>
                        <li>
                          <h6> Percentage
                            <span>
                              {diskData.percentage}
                            </span>
                          </h6>
                        </li>
                      </ul>
                    </article>
                  </article>
                </article>
              </article>

              <article className="col-md-10" style={{ background: 'white', borderLeft: '10px solid #cccccc', minHeight: '934px' }}>
                <article
                  style={{
                    backgroundColor: "white",

                  }}
                >
                  <article style={{padding:'15px'}}>
                   <article className="row">
                  <article className="col-md-12" style={{display:'flex',justifyContent:'center'}}>
                    <ul className="obcsublist">
                      <li  onClick={() => handleRowClick('obc')} className={`${currentObcsubTab === 'obc' ? 'active' : ''}`}><a>OBC</a></li>
                      <li  onClick={() => handleRowClick('transcoder')} className={`${currentObcsubTab === 'transcoder' ? 'active' : ''}`}><a>Transcoder</a></li>
                      <li onClick={() => handleRowClick('stationradio')} className={`${currentObcsubTab === 'stationradio' ? 'active' : ''}`}> <a>Station Radio</a></li>
                      <li onClick={() => handleRowClick('trainradio')} className={`${currentObcsubTab === 'trainradio' ? 'active' : ''}`}> <a> Train Radio</a></li>

                    </ul>
                  </article>
                 
                  <hr />
                  </article>
                  {renderCurrentObcsubTab(currentObcsubTab)}
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

export default ObcSummaryTab;