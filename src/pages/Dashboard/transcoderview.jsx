import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from 'react-redux';
import { handleNodeData } from "../Action/action";
import "../ornms.css";
import LeftNavList from "../Navbar/leftnavpage";
import TcSummaryTab from "./transcodersummarytab";
import TcEventTab from "./transcodereventtab";

const TranscoderView = () => {
    const [isLoading, setIsLoading] = useState("");
    const [isError, setIsError] = useState("");

    const count = useSelector((state) => state);
    const isVisible = useSelector((state) => state.visibility.isVisible);
    const [currentTab, setCurrentTab] = useState('summary')
    const [transcoderData, setTranscoderData] = useState([]);

    const nodeDataId = useSelector((state) => state.node?.node?.nodeId);
    const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress) || localStorage.getItem('nodeIpaddress');
     const nodeLocation = useSelector((state) => state.node?.node?.location);
    // console.log('ghjjjjj', );


    useEffect(()=>{
        if(nodeDataId){
          localStorage.setItem('nodeId',nodeDataId);
    
        }
      },[nodeDataId]);
    
      useEffect(()=>{
        if(nodeIpaddress){
          localStorage.setItem('nodeIpaddress',nodeIpaddress);
        }
      },[nodeIpaddress]);
    

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


                setTranscoderData(data);
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
            console.log('ppkkpp', localStorage.getItem('nodeId'));
            const nodeId = localStorage.getItem('nodeId');
            let url = `http://${nodeIpaddress}:8084/transcoder/api/v1/config`;
          //let url = 'http://localhost:8980/transcoder/api/v1/config';

            await getServerStatusDt(url);
        };
        fetchData();
    }, []);

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

     useEffect(() => {
        if (nodeLocation) {
            localStorage.setItem('nodeLocation', nodeLocation);

        }
    }, [nodeLocation]);



 const IPadd = localStorage.getItem('nodeIpaddress')


    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleRowClick = (value) => {
        setCurrentTab(value);
    }


    const renderCurrentTab = (value) => {
        switch (value) {
            case 'summary':
                return <TcSummaryTab transcoderData={transcoderData} />
                break;
            case 'events':
                return <TcEventTab />
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
                                <li><a href={`http://${IPadd}`} target="_blank">{IPadd}</a></li>
                                <li onClick={() => handleRowClick('summary')} className={`${currentTab === 'summary' ? 'active' : ''}`}> <a>  <i className="fas fa-lg fa-grip-vertical Summary-icon"></i>Summary</a></li>
                                <li onClick={() => handleRowClick('events')} className={`${currentTab === 'events' ? 'active' : ''}`}> <a> <i
                                    className="fas fa-chart-area Monitor-icon"
                                    style={{ fontSize: "22px" }}
                                ></i> Events</a></li>


                            </ul>
                        </article>
                    </article>

                    {renderCurrentTab(currentTab)}

                </article>
            </section>
        </>
    );
};

export default TranscoderView;
