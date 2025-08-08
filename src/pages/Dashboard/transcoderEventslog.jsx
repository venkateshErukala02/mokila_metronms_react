import React, { useState, useEffect } from "react";
import '../ornms.css';
import logo from '../../assets/img/keywestlogo.png'
import { useDispatch } from 'react-redux';
import { toggleVisibility } from '../Action/action';
import '../Navbar/navbarpage.css';
import { index } from "d3";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
// import TimePicker from 'react-time-picker';



const TranscoderEventLog = ({currentTab,nodeItemDt}) => {

    function formatDate(dd) {
        try {
            const d = new Date();
            let y = d.getFullYear();
            let month = String(d.getMonth() + 1).padStart(2, '0');
            let day = String(d.getMonth() + 1).padStart(2, '0');
            return `${y}-${month}-${day}`;
        } catch (error) {
            console.error('Error formatting date:', error.message);
            return null; // or a fallback value
        }
        //   const year = d.getFullYear();
        //   const month = String(d.getMonth() + 1).padStart(2, '0'); // months are 0-based
        //   const day = String(d.getDate()).padStart(2, '0');


    }


    const [eventLogDt, setEventLogDt] = useState([]);
    const [date, setDate] = useState(null);
     const [selectedDate, setSelectedDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" })
    const [selectLog,setSelectLog] = useState('obclogs')
    const nodeDataId = useSelector((state) => state.node.node.nodeId) || localStorage.getItem('nodeId');
    const nodeIpaddress = useSelector((state) => state.node.node.ipAddress) || localStorage.getItem('nodeIpaddress');
    

    const getTranscoderLogData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
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

                setEventLogDt(data);
                setIsLoading(false);
                setIsError({ status: false, msg: "" });

            } else {
                throw new Error("data not found");
            }

        } catch (error) {
            setIsLoading(false)
            setIsError({ status: true, msg: error.message })
        }


    }



    // useEffect(() => {
    //     let url = ``;

    //     if(currentTab === 'obc' && selectLog==='Obclogs'){
    //     if (date == null) {
    //         const d = new Date();
    //         try {
    //             let y = d.getFullYear();
    //             let month = d.getMonth();  // zero-indexed
    //             let day = d.getDate();

    //             // setDate(new Date(y, month, day)); // set as Date object

    //             // For URL, convert date to string in yyyy-mm-dd format
    //             let formattedDate = `${y}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    //             url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/logs?since=${formattedDate}`;
    //         } catch (error) {
    //             console.error('Error formatting date:', error.message);
    //             return null;
    //         }
    //     } else {
    //         // When date is set (Date object), build URL here too
    //         let y = date.getFullYear();
    //         let month = String(date.getMonth() + 1).padStart(2, '0');
    //         let day = String(date.getDate()).padStart(2, '0');

    //         url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/logs?since=${y}-${month}-${day}`;
    //     }}
    //     // else{
    //     //     url = `http://${nodeIpaddress}:8980/metronms/api/v2/treeview/logs/${nodeItemDt.carnumber}`
    //     // }
    //     getTranscoderLogData(url);
    // }, [date,selectLog,selectedDate,nodeIpaddress,currentTab]);


    useEffect(() => {
    let url = "";

    if (currentTab === 'obc') {
        const targetDate = date || selectedDate;
        if (!targetDate) return;

        const y = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const formattedDate = `${y}-${month}-${day}`;

        if (selectLog === 'obclogs') {
             url = `api/v2/treeview/logs/${nodeItemDt?.carnumber || 'unknown'}`;     
        } else if (selectLog === 'trainlogs') {   
             url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/logs?since=${formattedDate}`;
        }
    }else{
          const targetDate = date || selectedDate;
        if (!targetDate) return;

        const y = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0');
        const day = String(targetDate.getDate()).padStart(2, '0');
        const formattedDate = `${y}-${month}-${day}`;
        url = `http://${nodeIpaddress}:8084/${currentTab}/api/v1/logs?since=${formattedDate}`;
    }

    if (url) {
        getTranscoderLogData(url);
    }
}, [date, selectLog, nodeIpaddress, currentTab, nodeItemDt]);

    const handleDatePicker = (value) => {
        //    setDate(value)
    }



    return (
        <section className="container-fluid">
            <article className="border-tlr custom-row" style={{paddingLeft:'76%'}}>
                <>
                {currentTab ==='obc' && (<>
                       <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>SelectLogs:</label>


                            <select name="name" id="name" value={selectLog} onChange={(e)=>setSelectLog(e.target.value)} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                <option value="obclogs" label="Obclogs">Obclogs</option>
                                <option value="trainlogs" label="Trainlogs">Trainlogs</option>
                            </select>
                </>)}
                <label for="name" className="radiolabel" style={{ display: 'inline-block' }}>Time:</label>

                <article className="trans-datepickerbg" style={{ display: 'inline-block',marginTop:'5px' }}>
                    <DatePicker
                         selected={selectedDate}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd"
                        className="myDatepickercl"
                     onChange={(date) => setSelectedDate(date)}
                    />

                </article>
                <button class="clearfix createbtn" style={{ marginLeft: '10px' }}
                     onClick={()=>{
                    setDate(selectedDate)
                }
                }
                >Show</button></> 
            </article>
            <article className="row" style={{ height: '86vh', overflowY: 'auto', border: '1px solid #21232712' }}>
                <ul className="log-list">
                    {String(eventLogDt)
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