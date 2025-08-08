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


const ObcSummaryTab = ({ nodeItemDt,currentTab }) => {
   const [upTimeData, setUpTimeData] = useState([]);
   const [isLoading, setIsLoading] = useState("");
       const [isError, setIsError] = useState("");


       const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress)|| localStorage.getItem('nodeIpaddress');

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

//         if (!nodeItemDt || Object.keys(nodeItemDt).length === 0) {
//   return <div>Loading configuration...</div>;
// }

  return (
    <>

      <article className="row">
        <article
          className="col-md-12"
          style={{ padding: "10px", backgroundColor: "#cccccc" }}
        >

          <article className="container-fluid">
            <article className="row" style={{ display: "flex" }}>
              <article className="col-md-2" id="summary-1 div1" style={{minHeight:'850px',maxHeight:'850px',background:'white'}}>
                <article>

                  <article className="card" id="div2">
                    <article style={{ margin: "auto", textAlign: 'center' }}>
                      <img className="nodeimg" style={{width:'70px',height:'58px'}} src={obcimage} alt="node" />
                      {/* <label class="summarymode"> {nodeItemDt.nodeDesc}</label> */}
                      <label class="summarymode" style={{ display: 'block' }}> Cab - {nodeItemDt?.carnumber || "loading.."}</label>
                      <label class="summarysytem"><i class="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
                    </article>
                    <article style={{ margin: "auto" }}>
                      <article>
                        <article style={{ margin: "auto"}}>
                          <article>
                            <article>

                            </article>
                          </article>
                        </article>
                      </article>

                      <ul className="summarylist">
                        <li> 
                          {/* <i
                          className="serialnumbericon"
                          style={{ marginRight: "6px" }}
                        ></i> */}
                        <h6> IP<span> {nodeItemDt.obcnetip}</span></h6></li>
                        <li>
                          {/* <i
                          className="firmwareicon"
                          style={{ marginRight: "6px" }}
                        ></i> */}
                        <h6> Netmask<span> {nodeItemDt.obcnetmask}</span></h6></li>
                        <li>
                          {/* <img
                            src={radioimage}
                            alt=""
                            style={{ marginRight: "6px" }}
                          /> */}
                          <h6>Encoder <span>{nodeItemDt.encoderip}</span></h6>
                        </li>
                         <li>  
                          {/* <img
                          src={bootloader}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            marginRight: "6px",
                          }}
                        /> */}
                          <h6> Gateway<span>{nodeItemDt.obcnetgway} </span></h6></li>

                        {/* <li>   <img
                          src={ptmplinkimage}
                          alt="PTMP"
                          style={{ marginRight: "6px" }}
                        /> <h6>Link Type  <span className="">{nodeItemDt[0]?.linkType}</span></h6></li> */}
                        <li>
                          {/* <i
                            className="hardwareversionicon"
                            style={{ marginRight: "6px" }}
                          ></i> */}
                          <h6>NTP <span>{nodeItemDt.ntpserverip}</span></h6>
                        </li>
                       
                        
                        <li>
                          {/* <i
                          className="ethernetmacicon"
                          style={{ marginRight: "6px" }}
                        ></i> */}
                          <h6>Trainradioip<span> {nodeItemDt.trainradioip}</span></h6></li>
                        {/* <li>
                          <i
                            className="wirelessmacicon"
                            style={{ marginRight: "6px" }}
                          ></i>
                          <h6> Wireless MAC
                            <span>
                              {nodeItemDt.wirelessMAC}
                            </span>
                          </h6>
                        </li> */}
                        {/* <li>
                          <i className="staioncicon"></i>
                          <h6> Station
                            <span>
                              {nodeItemDt.station}
                            </span>
                          </h6>
                        </li> */}

                      </ul>

                    </article>
                  </article>
                </article>
              </article>

              <article className="col-md-10" style={{ background: 'white',borderLeft:'10px solid #cccccc',minHeight:'850px' }}>
                <article
                  style={{
                    backgroundColor: "white",
                   
                  }}
                >
                    <ObcGraphs/>

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