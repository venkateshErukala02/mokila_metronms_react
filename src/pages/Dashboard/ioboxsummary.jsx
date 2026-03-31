import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import obcimage from '../../assets/img/obcimg1.png'


const IoboxSummaryTab = ({currentTab }) => {
  const [upTimeData, setUpTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");
  const [diskData, setDiskData] = useState("");
  const [currentObcsubTab, setCurrentObcsubTab] = useState('obc')
  const [nodeItemDt, setNodeItemDt] = useState([]);
  const [eventmainData,setEventmainData] = useState([]);

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress) || localStorage.getItem('nodeIpaddress');

    const nodeDataId = useSelector((state) => state.node?.node?.nodeId) || localStorage.getItem('nodeId');

  useEffect(() => {
    if (nodeIpaddress) {
      localStorage.setItem('nodeIpaddress', nodeIpaddress);
    }
  }, [nodeIpaddress]);

  useEffect(() => {
      const fetchData = async () => {
       let url = `api/v2/nodemanageview/encodersum?nodeId=${nodeDataId}`;
        // let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
        await getServerStatusDt(url);
      };
      fetchData();
    }, [nodeDataId]);



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
        //   "Authorization": `Basic ${token}`,
          "Content-Type": "application/json",
        },
      };
      const response = await fetch(url, options);
      const data1 = await response.json();
    //   const data = await JSON.parse(data1)
      
      if (response.ok) {
        setIsLoading(false);
        setNodeItemDt(data1);
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
      let url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/uptime`;
      await getServerStatusUptimeDt(url);
    };
    fetchData();

    const intervalId = setInterval(fetchData, 30000);

  return () => clearInterval(intervalId);
  }, [nodeIpaddress, currentTab]);



  const getServerStatusUptimeDt = async (url) => {
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
      const response = await fetch(url,options);
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
      const response = await fetch(url,options);
      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setDiskData(data);
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
      let url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/disk`;
      await getDiskData(url);
    };
    fetchData();

    const intervalId = setInterval(fetchData, 30000);

  return () => clearInterval(intervalId);
  }, [nodeIpaddress, currentTab]);




//   const handleRowClick = (value) => {
//     setCurrentObcsubTab(value);
//   }

//  const handleGraphopt = (value, numb) => {
//     setGraphOption(value);
//     setGraphOptionValue(numb);
//   }

 

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
                      {/* <label className="summarymode"> {nodeItemDt.nodeDesc}</label> */}
                      <label className="summarymode" style={{ display: 'block' }}> Cab - {nodeItemDt?.carnumber || ""}</label>
                      {/* <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label> */}
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

                      {/* <ul className="summarylist">
                        <li>
                          <h6> SystemName<span> {nodeItemDt.systemName}</span></h6></li>
                        <li>
                          <h6>Station <span>{nodeItemDt.station}</span></h6>
                        </li>
                        <li>
                          <h6>SerialNumber <span>{nodeItemDt.serialNumber}</span></h6>
                        </li>
                        <li>
                          <h6>EthernetMAC<span> {nodeItemDt.ethernetMAC}</span></h6></li>
                        <li>
                          <h6>SoftwareVersion<span> {nodeItemDt.softwareVersion}</span></h6></li>
                       
                      </ul> */}
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
                        <article className="col-md-12">

                            <article>
                                <article className="row" style={{padding:'38px 0 38px 128px'}}>
                                    <article className="col-6">
                                         <span class="scopesel">Cab:</span>
                                         <input type="text" className="form-controldis searchbar" style={{margin:'0 12px'}} name="" id="" />
                                         <button className="createbtn">Verify</button>
                                    </article> 
                                </article>
                            </article>
                          
                          <article>
                     <article className="row">
                    <table className="col-12" style={{ border: '1px solid rgba(33, 35, 39, 0.07)' }}>
                        <thead className="ioboxeventsthtb">
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Tx-byte</th>
                                <th>Rx-byte</th>
                            </tr>
                        </thead>
                        <tbody className="ioboxeventstbdtb">
                            {!isLoading && !isError.status && eventmainData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData.map((event) => (
                                    <tr key={event.id} onClick=''>
                                        <td>{(event.time)}</td>
                                        <td>{event.severity}</td>
                                        <td>{event.logMessage}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="datacl centered-text">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </article>
            
                            </article>
                          <article>
                          </article>
                          </article>
                          </article>
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

export default IoboxSummaryTab;