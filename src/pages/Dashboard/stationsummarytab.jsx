import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import nodeimage from "../../assets/img/suinodeview.png";
import radioimage from "../../assets/img/radiomode.png";
import ptmplinkimage from "../../assets/img/PTMPlink.png";
import bootloader from "../../assets/img/bootloader.png";
import NetworkMonitoringDashboard from "./nodeviewchart";


const SnSummaryTab = ({ nodeItemDt }) => {

  // console.log('hhhhhhhh',nodeDataId);
  

  //  const [isLoading, setIsLoading] = useState("");
  //    const [isError, setIsError] = useState("");

  //    const count = useSelector((state) => state);
  //    const isVisible = useSelector((state) => state.visibility.isVisible);
  //    const [currentTab,setCurrentTab] = useState('summary');
  //          const [nodeItemDt, setNodeItemDt] = useState([]);



  //   const getServerStatusDt = async (url) => {
  //      setIsLoading(true);
  //      setIsError({ status: false, msg: "" });
  //      try {
  //        const username = "admin";
  //        const password = "admin";
  //        const token = btoa(`${username}:${password}`);
  //        const options = {
  //          method: "GET",
  //          headers: {
  //            "Authorization": `Basic ${token}`,   
  //            "Content-Type": "application/json",
  //          },
  //        };
  //        const response = await fetch(url,options);
  //        const data = await response.json();

  //        if (response.ok) {
  //          setIsLoading(false);


  //          setNodeItemDt(data);
  //          console.log("Fetched server status:", data);
  //          setIsError({ status: false, msg: "" });
  //        } else {
  //          throw new Error("Data not found");
  //        }
  //      } catch (error) {
  //        setIsLoading(false);
  //        setIsError({ status: true, msg: error.message });
  //        console.error("Fetch error:", error);
  //      }
  //    };

  //    useEffect(() => {
  //      const fetchData = async () => {
  //        let url = `api/v2//nodemanageview/summarydb?nodeId=${nodeDataId}`;
  //        await getServerStatusDt(url);
  //      };
  //      fetchData();
  //    }, [nodeDataId]);

  //    // useEffect(()=>{
  //    //   if(nodeDataId){
  //    //     localStorage.setItem('nodeId')
  //    //   }
  //    // },[nodeDataId])

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
                      <img className="nodeimg" src={nodeimage} alt="node" />
                      <label class="summarymode"> {nodeItemDt.nodeDesc}</label>
                      <label class="summarymode" style={{ display: 'block' }}> {nodeItemDt.station} ({nodeItemDt.systemName})</label>
                      <label class="summarysytem"><i class="fas fa-arrow-up fa-1x ng-scope "></i>{nodeItemDt.uptime}</label>
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
                          <h6> Bootloader Version <span>{nodeItemDt.softwareVersion} </span></h6></li>
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

              <article className="col-md-10" style={{ background: 'white',borderLeft:'10px solid #cccccc' }}>
                <article
                  style={{
                    backgroundColor: "white",
                   
                  }}
                >
                  <NetworkMonitoringDashboard />
                </article>
              </article>
            </article>
          </article>

        </article>
      </article>
    </>
  )
}

export default SnSummaryTab;