import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import obcimage from '../../assets/img/obcimg1.png'
import EncoderTxChart from "./encodertxrxgraph";


const EncoderSummaryTab = ({currentTab }) => {
  const [upTimeData, setUpTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");
  const [diskData, setDiskData] = useState("");
  const [currentObcsubTab, setCurrentObcsubTab] = useState('obc')
  const [nodeItemDt, setNodeItemDt] = useState([]);
  const [graphOption, setGraphOption] = useState('live');
  const [graphOptionValue, setGraphOptionValue] = useState('1l');

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




  const handleRowClick = (value) => {
    setCurrentObcsubTab(value);
  }

 const handleGraphopt = (value, numb) => {
    setGraphOption(value);
    setGraphOptionValue(numb);
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
                      {/* <label className="summarymode"> {nodeItemDt.nodeDesc}</label> */}
                      <label className="summarymode" style={{ display: 'block' }}> Cab - {nodeItemDt?.carnumber || "loading.."}</label>
                      <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{upTimeData}</label>
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
                        <article className="col-md-12">
                          <article className="col-12" style={{justifyContent:'center',display:'flex'}}>
                            <table className="col-6 w-full table-fixed border-allsd">
                            <thead className="encodertbtwo">
                                <tr>
                                <th>Camera</th>
                                <th>Description</th>
                                <th>Status</th>
                                </tr>
                            </thead>

                            <tbody className="encodertbbdtwo">
                                <tr>
                                <td>Camera 1</td>
                                <td>{nodeItemDt.camDesc1}</td>
                                <td>{nodeItemDt.camStatus1}</td>
                                </tr>
                                <tr>
                                <td>Camera 2</td>
                                <td>{nodeItemDt.camDesc2}</td>
                                <td>{nodeItemDt.camStatus2}</td>
                                </tr>
                                <tr>
                                <td>Camera 3</td>
                                <td>{nodeItemDt.camDesc3}</td>
                                <td>{nodeItemDt.camStatus3}</td>
                                </tr>
                                <tr>
                                <td>Camera 4</td>
                                <td>{nodeItemDt.camDesc4}</td>
                                <td>{nodeItemDt.camStatus4}</td>
                                </tr>
                            </tbody>
                            </table>    
                            </article>
                          <article>
                            <article style={{marginTop:'36px',textAlign:'center'}}><div className="btn-group" data-toggle="buttons" style={{ marginLeft: '100px', marginBottom: '10px' }}>
                <label className={`btngrphopt ${graphOption === 'live' ? 'active' : ''}`} onClick={() => handleGraphopt('live','1l')} role="button" tabindex="0">

                  Live
                </label>
                <label className={`btngrphopt ${graphOption === 'onehour' ? 'active' : ''}`} onClick={() => handleGraphopt('onehour', '1h')} role="button" tabindex="0">
                  1 Hour </label>
                <label className={`btngrphopt ${graphOption === 'oneday' ? 'active' : ''}`} onClick={() => handleGraphopt('oneday', '1d')} role="button" tabindex="0">
                  1 Day </label>
                <label className={`btngrphopt ${graphOption === 'oneweek' ? 'active' : ''}`} onClick={() => handleGraphopt('oneweek', '1w')} role="button" tabindex="0">
                  1 Week </label>
                <label className={`btngrphopt ${graphOption === 'onemonth' ? 'active' : ''}`} onClick={() => handleGraphopt('onemonth', '1m')} role="button" tabindex="0">
                  1 Month </label>
              </div></article>
                            <article>
                              <EncoderTxChart graphOption={graphOption} graphOptionValue={graphOptionValue}/>
                            </article>

                          </article>
                        </article>
                    </article>
                  </article>

                  {/* <article style={{padding:'15px'}}>
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

export default EncoderSummaryTab;