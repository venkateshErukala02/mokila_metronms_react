import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import obcimage from '../../assets/img/obcimg1.png'
import EncoderTxChart from "./encodertxrxgraph";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LatencyChart from "./latencychart";
import transcoderImage from "../../assets/img/transcoderimg.jpeg";




const EncoderSummaryTab = ({currentTab }) => {
  const [upTimeData, setUpTimeData] = useState([]);
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");
  const [diskData, setDiskData] = useState("");
  const [currentObcsubTab, setCurrentObcsubTab] = useState('obc')
  const [nodeItemDt, setNodeItemDt] = useState([]);
  const [graphOption, setGraphOption] = useState('live');
  const [graphOptionValue, setGraphOptionValue] = useState('1l');
 const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cameraData,setCameraData] = useState(null);
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


//  useEffect(() => {
//           const url = `api/v2/nodelinks/encoder/videostats?nodeId=${nodeDataId}`;
//           getCameraData(url);
//         }, []);


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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     let url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/disk`;
  //     await getDiskData(url);
  //   };
  //   fetchData();

  //   const intervalId = setInterval(fetchData, 30000);

  // return () => clearInterval(intervalId);
  // }, [nodeIpaddress, currentTab]);




  const handleRowClick = (value) => {
    setCurrentObcsubTab(value);
  }

 const handleGraphopt = (value, numb) => {
    setGraphOption(value);
    setGraphOptionValue(numb);
  }


  const handleDate=()=>{
if(startDate && endDate !== null){
  const stDate = Date.parse(startDate);
  const edDate = Date.parse(endDate);
  setGraphOption('custom');
  setGraphOptionValue(`1c&start=${stDate}&end=${edDate}`);
  setStartDate('');
  setEndDate('');
}  
}


const getCameraData = async (url) => {
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
                console.log('lplpplpl',data)
    
                if (response.ok) {
                    setIsLoading(false);
                    setCameraData(data);
                    setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setIsLoading(false);
                setIsError({ status: true, msg: error.message });
            }
        };

     useEffect(() => {
       if (!nodeDataId) return;
          const url = `api/v2/nodelinks/encoder/videostats?nodeId=${nodeDataId}`;
          getCameraData(url);
        }, []);

        const formatUptime = (upTime) => {
        if (!upTime || typeof upTime !== "string") {
          // console.error("Invalid uptime format:", upTime);
           return "No Data";  
        }

        const parts = upTime.split(":");
        if (parts.length !== 4) {
          // console.error("Invalid uptime format:", upTime);
           return "No Data";  
        }

        const [days, hours, minutes, seconds] = parts.map(Number);

        let result = "";

        if (days) result += `${days}d `;
        if (hours) result += `${hours}h `;
        if (minutes) result += `${minutes}m `;
        if (seconds) result += `${seconds}s`;

        return result.trim();
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
              <article className="col-md-2" id="summary-1 div1" style={{ minHeight: '850px', maxHeight: '934px', background: 'white' }}>
                <article>

                  <article className="card" id="div2">
                    <article style={{ margin: "auto", textAlign: 'center' }}>
                      <img className="nodeimg" src={transcoderImage} alt="transcoderImage" width="210px" height="190px" />
                      {/* <label className="summarymode"> {nodeItemDt.upTime}</label> */}
                      {/* <label className="summarymode" style={{ display: 'block' }}> Cab - {nodeItemDt?.carnumber || "loading.."}</label> */}
                      <article>
                      <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{formatUptime(nodeItemDt?.upTime)}</label> 
                      </article>
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
                          <article className="col-12">
                            <h3 class="configlinktitle">Camera Connectivity Status</h3>
                            <article style={{paddingLeft:'72px'}}>
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
                                <td>{cameraData?.camDesc1}</td>
                                <td>{cameraData?.camStatus1}</td>
                                </tr>
                                <tr>
                                <td>Camera 2</td>
                                <td>{cameraData?.camDesc2}</td>
                                <td>{cameraData?.camStatus2}</td>
                                </tr>
                                <tr>
                                <td>Camera 3</td>
                                <td>{cameraData?.camDesc3}</td>
                                <td>{cameraData?.camStatus3}</td>
                                </tr>
                                <tr>
                                <td>Camera 4</td>
                                <td>{cameraData?.camDesc4}</td>
                                <td>{cameraData?.camStatus4}</td>
                                </tr>
                            </tbody>
                            </table> 
                            </article>   
                            </article>
                            <article style={{margin :'48px 0 20px 0'}}>
                          <article>

                             <article className="container-fluid">
                            <article className="row">
                              <article className="col-md-3">
                                <div className="btn-group" data-toggle="buttons" style={{ marginLeft: '100px', marginBottom: '10px' }}>
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
                                </div>
                              </article>
                              <article className="col-md-3">
                                <article className="flex-row">
                                  <article className="container-fluid">
                                    <article className="row">
                                      <label htmlFor="" className="col-md-4">Start Date:</label>
                                      <article className="col-md-7" style={{ position: 'relative' }}>
                                        <DatePicker
                                          selected={startDate}
                                          showTimeSelect
                                          dateFormat="yyyy-MM-dd HH:mm"
                                          onChange={(date) => setStartDate(date)} />
                                      </article>
                                    </article>
                                  </article>
                                </article>
                              </article>
                              <article className="col-md-3">
                                <article className="flex-row">
                                  <article className="container-fluid">
                                    <article className="row">
                                      <label htmlFor="" className="col-md-4">End Date:</label>
                                      <article className="col-md-7">
                                        <DatePicker
                                          selected={endDate}
                                          showTimeSelect
                                          dateFormat="yyyy-MM-dd HH:mm"
                                          onChange={(date) => setEndDate(date)} />
                                      </article>
                                    </article>
                                  </article>
                                </article>
                              </article>
                              <article className="col-md-3">
                                <button className="createbtn" type="submit" onClick={handleDate}>Custom</button>
                              </article>
                            </article>
                          </article>
                        </article>
                        <article>
                        </article>
                        <article>
                          <article className="container-fluid">
                            <article className="row">
                              <article className="col-md-12 graphbord2">
                                <article className="latencyfullwidthcl">
                                            <EncoderTxChart graphOption={graphOption} graphOptionValue={graphOptionValue}/>

                                </article>
                              
                              </article>
                              <article className="col-md-12 graphbord2" style={{marginTop:'25px'}}>
                                <article className="latencyfullwidthcl">
                                  <LatencyChart graphOption={graphOption} graphOptionValue={graphOptionValue} />
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
              </article>
            </article>
          </article>

        </article>
      </article>
    </>
  )
}

export default EncoderSummaryTab;