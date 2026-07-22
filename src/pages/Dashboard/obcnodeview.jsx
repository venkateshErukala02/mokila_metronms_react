import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { handleNodeData } from "../Action/action";
import "../ornms.css";
import LeftNavList from "../Navbar/leftnavpage";
import SnSummaryTab from "./stationsummarytab";
import SnEventTab from "./stationeventstab";
import TrainSummaryTab from "./trainsummarytab";
import TrainEventTab from "./traineventtab"; 
import ObcSummaryTab from "./Obcsummarytab";
import ObcEventTab from "./obceventtab";
import ObcMonitoringTab from "./obcconfiguration";

const ObcNodeView = () => {
  const [isLoading, setIsLoading] = useState("");
  const [isError, setIsError] = useState("");

  const count = useSelector((state) => state);
  const isVisible = useSelector((state) => state.visibility.isVisible);
  const [currentTab, setCurrentTab] = useState('summary')
  const [nodeItemDt, setNodeItemDt] = useState([]);
    const [diskData, setDiskData] = useState("");

  // const nodeDataId = useSelector((state) => state.node.node.nodeId);
  const nodeDataId = useSelector((state) => state.node?.node?.nodeId || state.node?.node?.id)

  const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress || state.node?.node?.primaryIP);
const ipValue = localStorage.getItem('nodeIpaddress')
    const nodeIdValue = localStorage.getItem('nodeId')



   const getDiskData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: `http://${ipValue}:8084/obc/api/v1/disk`,
            };
            const response = await fetch(url,options);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setDiskData(data.data);
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
      if(currentTab === 'monitoring' || currentTab === 'events') return;
        const fetchData = async () => {
            let url = 'api/v2/troubleshoot/obc/disk';
            await getDiskData(url);
        };
        fetchData();

        const intervalId = setInterval(fetchData, 30000);

        return () => clearInterval(intervalId);
    }, [nodeIpaddress, currentTab]);

  const getServerStatusDt = async (url) => {
    setIsLoading(true);
    setIsError({ status: false, msg: "" });
    try {
      const options = {
        method: "POST",
        //  headers: {
        //   "Authorization": `Basic ${token}`,
        //   "Content-Type": "application/json",
        // },
        body: `http://${ipValue}:8084/obc/api/v1/config`,
      };
      const response = await fetch(url, options);
      const data1 = await response.json();
      const data = await JSON.parse(data1)
      
      if (response.ok) {
        setIsLoading(false);
        setNodeItemDt(data.data);
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
     let url = 'api/v2/troubleshoot/obc/config';
      // let url = `api/v2/nodemanageview/summarydb?nodeId=${nodeDataId}`;
      await getServerStatusDt(url);
    };
    fetchData();
  }, [nodeIpaddress]);

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


  const handleRowClick = (value) => {
    setCurrentTab(value);
  }


  const renderCurrentTab = (value) => {
    switch (value) {
      case 'summary':
        return <ObcMonitoringTab nodeItemDt={nodeItemDt} currentTab='obc'/>
        break;
      case 'events':
        return <ObcEventTab nodeItemDt={nodeItemDt}/>
        break;
      case 'monitoring':
        return <ObcSummaryTab nodeItemDt={nodeItemDt} currentTab='obc'/>
        break;
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
                <li><a href={`http://${ipValue}`} target="_blank">{ipValue}</a></li>
                <li onClick={() => handleRowClick('summary')} className={`${currentTab === 'summary' ? 'active' : ''}`}> <a> <i className="fas fa-lg fa-grip-vertical Summary-icon"></i>Summary</a></li>
                <li onClick={() => handleRowClick('monitoring')} className={`${currentTab === 'monitoring' ? 'active' : ''}`}> <a> <i className="fas fa-lg fa-grip-vertical Summary-icon"></i>Monitoring</a></li>
                <li onClick={() => handleRowClick('events')} className={`${currentTab === 'events' ? 'active' : ''}`}> <a> <i
                  className="fas fa-chart-area Monitor-icon"
                  style={{ fontSize: "22px" }}
                ></i> Events </a></li>
              </ul>
            </article>
          </article>

          {renderCurrentTab(currentTab)}

        </article>
      </section>
    </>
  );
};

export default ObcNodeView;
