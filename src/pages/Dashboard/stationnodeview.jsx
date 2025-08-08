import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { handleNodeData } from "../Action/action";
import "../ornms.css";
import LeftNavList from "../Navbar/leftnavpage";
import SnSummaryTab from "./stationsummarytab";
import SnEventTab from "./stationeventstab";
import PingAreaChart from "./samplechart";

const StationNodeDetails = () => {
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");

  const count = useSelector((state) => state);
  const isVisible = useSelector((state) => state.visibility.isVisible);
  const [currentTab, setCurrentTab] = useState('summary')
  const [nodeItemDt, setNodeItemDt] = useState([]);

  // const nodeDataId = useSelector((state) => state.node.node.nodeId);
  const nodeDataId = useSelector((state) => state.node?.node?.nodeId) || localStorage.getItem('nodeId');

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress);
  console.log('ghjjjjj', nodeDataId);

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
      const response = await fetch(url, options);
      const data = await response.json();

      if (response.ok) {
        setIsLoading(false);


        setNodeItemDt(data);
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
      let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
      await getServerStatusDt(url);
    };
    fetchData();
  }, [nodeDataId]);

  useEffect(() => {
    if (nodeDataId) {
      localStorage.setItem('nodeId', nodeDataId);

    }
  }, [nodeDataId]);

  useEffect(() => {
    if (nodeIpaddress) {
      localStorage.setItem('nodeIpaddress', nodeIpaddress);
    }
  }, [nodeIpaddress]);





  const navigate = useNavigate();
  const dispatch = useDispatch();


  // const handleRowClick = () => {
  //               navigate('/node-event', { state: { nodeItemDt } });
  //               dispatch(handleNodeData(nodeItemDt))
  //               };


  const handleRowClick = (value) => {
    setCurrentTab(value);
  }


  const renderCurrentTab = (value) => {
    switch (value) {
      case 'summary':
        return <SnSummaryTab nodeItemDt={nodeItemDt} />
        break;
      case 'events':
        return <SnEventTab />
        break;
      case 'PingAreaChart':
        return <PingAreaChart />
        break
      default:
        break;
    }
  }




  return (
    <>
      <section className="display-f">
        <article
          className={isVisible ? "leftsidebardisblock" : "leftsidebardisnone"}
        >
          <LeftNavList className="leftsidebar" />
        </article>
        <article className="container-fluid">
          <article className="row boxsizeng">
            <article className="col-md-12" style={{ paddingRight: 0 }}>

              <ul className="nodelist">
                <li><a>Node View</a></li>
                <li><a href={`http://${nodeItemDt.ipAddress}`} target="_blank">{nodeItemDt.ipAddress}</a></li>
                <li onClick={() => handleRowClick('summary')} className={`${currentTab === 'summary' ? 'active' : ''}`}> <a> <i className="fas fa-lg fa-grip-vertical Summary-icon"></i>Summary</a></li>
                <li onClick={() => handleRowClick('events')} className={`${currentTab === 'events' ? 'active' : ''}`}> <a> <i
                  className="fas fa-chart-area Monitor-icon"
                  style={{ fontSize: "22px" }}
                ></i> Events </a></li>
                {/* <li onClick={() => handleRowClick('PingAreaChart')}><i
                      className="fas fa-chart-area Monitor-icon"
                      style={{ fontSize: "22px" }}
                    ></i> Sumary1</li> */}
              </ul>
            </article>
          </article>

          {renderCurrentTab(currentTab)}

        </article>
      </section>
    </>
  );
};

export default StationNodeDetails;
