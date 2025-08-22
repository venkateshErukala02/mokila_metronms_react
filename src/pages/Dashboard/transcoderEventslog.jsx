import React, { useState, useEffect } from "react";
import '../ornms.css';
import logo from '../../assets/img/keywestlogo.png'
import { useDispatch } from 'react-redux';
import { toggleVisibility } from '../Action/action';
import '../Navbar/navbarpage.css';
import { index } from "d3";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";



const TranscoderEventLog = ({ currentTab, nodeItemDt }) => {

    function formatDate(dd) {
        try {
            const d = new Date();
            let y = d.getFullYear();
            let month = String(d.getMonth() + 1).padStart(2, '0');
            let day = String(d.getMonth() + 1).padStart(2, '0');
            return `${y}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date:', error.message);
            return null;
        }
    }


    const [eventLogDt, setEventLogDt] = useState([]);
    const [date, setDate] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" })
    const [selectLog, setSelectLog] = useState('obclogs');
    const [searchText, setSearchText] = useState('');
    const [search, setSearch] = useState('');
    const [executedSearch, setExecutedSearch] = useState("");
    const [executedDate, setExecutedDate] = useState("");
    const [searchTrigger, setSearchTrigger] = useState(0);
    const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');


    const getTranscoderLogData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        setEventLogDt([]);
        try {
            const username = "admin";
            const password = "admin";
            const token = btoa(`${username}:${password}`);


            const options = {
                method: "GET",
                // headers: {
                //     'Authorization': `Basic ${token}`,
                //     'Accept': 'application/json',
                //     'Content-Type': 'application/json'
                // }
            }
            const response = await fetch(url, options)
            const data = await response.text();
            if (response.ok) {
                setIsLoading(false);

                setEventLogDt(data || []);
                setIsLoading(false);
                setIsError({ status: false, msg: "" });

            }else if(response.status === '404'){
                setEventLogDt([]);

            } 
            else {
                throw new Error("data not found");
            }

        } catch (error) {
            setIsLoading(false)
            setIsError({ status: true, msg: error.message })
        }


    }


    const handleClearSearch = () => {
        setSearchText('');
        setSearch('');
    }

    const handleSearch = (searchText, selectedDate) => {
  setExecutedSearch(searchText);
  setExecutedDate(selectedDate);
  setSearchTrigger(prev => prev + 1); 
};

    useEffect(() => {
        setSearchText('');
        setSearch('');
        setExecutedDate(new Date());
        setExecutedSearch('');
    }, [selectLog])


useEffect(() => {

  let url = "";

  if (currentTab === "obc") {
    const targetDate = executedDate || selectedDate;
    if (!targetDate) return;

    const y = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const formattedDate = `${y}-${month}-${day}`;

    if (selectLog === "obclogs") {
      const hours = String(targetDate.getHours()).padStart(2, "0");
      const minutes = String(targetDate.getMinutes()).padStart(2, "0");
      const seconds = String(targetDate.getSeconds()).padStart(2, "0");
      const obcFormatDate = `${y}${month}${day}/${hours}${minutes}${seconds}`;
      url = `api/v2/treeview/datelogs/${nodeItemDt?.carnumber || ""}/${obcFormatDate}?q=${executedSearch}`;
    } else if (selectLog === "trainlogs") {
      url = `api/v2/treeview/trainlogs/${nodeItemDt?.carnumber || ""}/${formattedDate}?q=${executedSearch}`;
    }
  } else {
    const targetDate = executedDate || selectedDate;
    if (!targetDate) return;

    const y = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const formattedDate = `${y}-${month}-${day}`;
    url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/logs?since=${formattedDate}&search=%27${executedSearch}%27`;
    
  }

  if (url) {
    getTranscoderLogData(url);
  }
}, [executedSearch, executedDate, searchTrigger, nodeIpaddress, currentTab, nodeItemDt]);




    return (
        <section className="container-fluid">
            <article className="border-tlr custom-row" style={{ paddingLeft: '60%' }}>
                <>
                    {currentTab === 'obc' && (<>
                        <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>SelectLogs:</label>


                        <select name="name" id="name" value={selectLog} onChange={(e) => setSelectLog(e.target.value)} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                            <option value="obclogs" label="Obclogs">Obclogs</option>
                            <option value="trainlogs" label="Trainlogs">Trainlogs</option>
                        </select>
                    </>)}
                    <input
                        type="text"
                        placeholder="Search text"
                        value={searchText}
                        className="form-controldistwo searchbar"
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <label for="name" className="radiolabel" style={{ display: 'inline-block' }}>Time:</label>

                    <article className="trans-datepickerbg" style={{ display: 'inline-block', marginTop: '5px' }}>
                        <DatePicker
                            selected={selectedDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd"
                            className="myDatepickercl"
                            onChange={(date) => setSelectedDate(date)}
                        />

                    </article>
                    <button class="clearfix createbtn" style={{ marginLeft: '10px' }}
                        onClick={() => {
                            handleSearch(searchText, selectedDate)
                        }
                        }
                    >Search</button>
                    {(searchText !== '' || search !== '') && (<button class="clearfix createbtn" style={{ marginLeft: '10px' }}
                        onClick={handleClearSearch}
                    >Clear Search</button>)}
                </>
            </article>
            <article className="row" style={{ height: '86vh', overflowY: 'auto', border: '1px solid #21232712' }}>
                <ul className="log-list">
                    {eventLogDt && String(eventLogDt)
                        .split('\n')
                        .filter(line => line.trim() !== '')
                        .map((line, index) => (
                            <li key={index}>{line}</li>
                        ))}
                </ul>

            </article>
        </section>


    );
};

export default TranscoderEventLog;