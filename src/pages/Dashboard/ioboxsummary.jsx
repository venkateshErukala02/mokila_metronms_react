import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import obcimage from '../../assets/img/ioboxim.jpg'


const IoboxSummaryTab = ({currentTab }) => {
  const [cartData, setCartData] = useState("");
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");
  // const [diskData, setDiskData] = useState("");
  const [currentObcsubTab, setCurrentObcsubTab] = useState('obc')
  const [nodeItemDt, setNodeItemDt] = useState([]);
  const [eventmainData,setEventMainData] = useState([]);

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress) || localStorage.getItem('nodeIpaddress');

    const nodeDataId = useSelector((state) => state.node?.node?.nodeId) || localStorage.getItem('nodeId');

  useEffect(() => {
    if (nodeIpaddress) {
      localStorage.setItem('nodeIpaddress', nodeIpaddress);
    }
  }, [nodeIpaddress]);

  useEffect(() => {
      const fetchData = async () => {
       let url = `api/v2/iobox/ethernetstat`;
        await getEtherStatusDt(url,nodeIpaddress);
      };
      fetchData();     
      const intervalId = setInterval(fetchData, 30000);

      return () => clearInterval(intervalId);
    }, [nodeIpaddress]);



  const getEtherStatusDt = async (url,nodeIpaddress) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
     
      const options = {
        method: "POST",
         headers: {
          "Content-Type": "application/json",
        },
         body: JSON.stringify({
          ip: nodeIpaddress,
        }),
      };
      const response = await fetch(url, options);
      const data1 = await response.json();
    //   const data = await JSON.parse(data1)
      
      if (response.ok) {
        setIsLoading(false);
        // setNodeItemDt(data1);
        setEventMainData(data1.interfaces);
        setIsError({ status: false, msg: "" });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setIsLoading(false);
      // setIsError({ status: true, msg: error.message });
    }
  };




  useEffect(() => {
    const fetchData = async () => {
      let url = `api/v2/iobox/getcart`;
      await getCartDt(url,nodeIpaddress);
    };
    fetchData();

  }, [nodeIpaddress]);



  const getCartDt = async (url,nodeIpaddress) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
         body: JSON.stringify({
          ip: nodeIpaddress,
        }),
      };
      const response = await fetch(url,options);
      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);


        setCartData(data);
        setIsError({ status: false, msg: "" });
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setIsLoading(false);
      // setIsError({ status: true, msg: error.message });
    }
  };


  const getUpdateCart = async () => {
     const url = `api/v2/iobox/setcart`;
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
          body: JSON.stringify({
          ip: nodeIpaddress,
          cart: cartData,
        }),
      };
      const response = await fetch(url,options);
      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);
        // setDiskData(data);
        setIsError({ status: false, msg: "" });
        await getCartDt("api/v2/iobox/getcart", nodeIpaddress);
      } else {
        throw new Error("Data not found");
      }
    } catch (error) {
      setIsLoading(false);
      // setIsError({ status: true, msg: error.message });
    }
  };


 useEffect(() => {
        const fetchData = async () => {
            let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
            await getConfigSummaryDt(url);
        };
        fetchData();
    }, [nodeDataId]);

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
              <article className="col-md-2" id="summary-1 div1" style={{ minHeight: '840px', maxHeight: '890px', background: 'white' }}>
                <article>

                  <article className="card" id="div2">
                    <article style={{ margin: "auto", textAlign: 'center' ,marginTop:'22px'}}>
                      <img className="nodeimg" style={{ width: '170px', height: '158px' }} src={obcimage} alt="node" />
                      <label className="summarymode"> {nodeItemDt.nodeDesc}</label>
                      <label className="summarymode" style={{ display: 'block' }}> Cab - {cartData || ""}</label>
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

              <article className="col-md-10" style={{ background: 'white', borderLeft: '10px solid #cccccc', minHeight: '840px' }}>
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
                                  <form
                                    onSubmit={(e) => {
                                      e.preventDefault();
                                      getUpdateCart();
                                    }}
                                  >
                                    <article className="col-6">
                                         <span className="scopesel">Cab:</span>
                                         <input type="text" className="form-controldis searchbar" style={{margin:'0 12px'}} name="" id="" 
                                          value={cartData}
                                          onChange={(e) => setCartData(Number(e.target.value))}
                                         />
                                         <button type="submit" className="createbtn">Update</button>
                                    </article> 
                                    </form>
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
                            {!isLoading && !isError.status && eventmainData.length === 0  && !eventmainData.length && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData
                                 .filter(item => item.type === "ether")
                                .map((item,index) => (
                                     <tr key={index}>
                                      <td>{item.name}</td>
                                      <td>{item.type}</td>
                                      <td style={{ color: item.running === "true" ? "green" : "red" }}>
                                        {item.running === "true" ? "Running" : "Down"}
                                      </td>
                                      <td>{item["tx-byte"] || 0}</td>
                                      <td>{item["rx-byte"] || 0}</td>
                                    </tr>
                                ))
                            ) : (
                                // <tr>
                                //     <td colSpan="5" className="datacl centered-text">No Data</td>
                                // </tr>
                                ''
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