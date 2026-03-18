import React, { useState } from "react";
import { Table } from "react-bootstrap";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import EventMainTB from "./evntsmaintb";
import '../ornms.css';
import './../Events/events.css';
import DatePicker from "react-datepicker";


const EventPg = () => {

    const isVisible = useSelector(state => state.visibility.isVisible);
    const [cabNumber,setCabNumber] = useState('');
    const [selectedFromDate,setSelectedFromDate] = useState(null);
    const [selectedToDate,setSelectedToDate] = useState(null);
    const [timestampFrom,setTimestampFrom] = useState(Date.now());
    const [timestampTo,setTimestampTo] = useState(Date.now());

    const handleFromDateChange = (date) => {
            setSelectedFromDate(date);
            const timestamp = date.getTime();  
            setTimestampFrom(timestamp);        
        };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        const timestamp = date.getTime();  
        setTimestampTo(timestamp);        
    };



    const ExportCanData =  () => {
        if(cabNumber.length !== 4){
            alert("Cab number is incorrect.")
            return;
        }
        const tId = cabNumber.substring(0, 3); 
        const cId = cabNumber.substring(3);

        if (!timestampFrom || !timestampTo) {
            alert("Please select start and end dates.");
            return;
        }

        if (new Date(timestampFrom) >= new Date(timestampTo)) {
            alert("Start date should be less than end date.");
            return;
        }
            const url =`api/v2/nodes/cabreport1/${tId}/${cId}/${timestampFrom}/${timestampTo}`;
            window.open(url, '_blank');
                setCabNumber('');
                setSelectedFromDate('');
                setSelectedToDate('');
                setTimestampFrom(Date.now());
                setTimestampTo(Date.now());
    };




    return (
        <>
            <article className="display-f">
            <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
                  <LeftNavList  className='leftsidebar'/>
                  </article>
                  <article className="container-fluid">
                  <article className="row sect-padd">
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10" style={{paddingRight:'10px'}}>
                        <h1 className="evntsheadcl">Events</h1>
                        <EventMainTB/>
                    </article>
                     <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2" style={{padding:'8px 13px 0 13px'}}>
                        <article className="border-allsd exportcabcolheight">
                        <h1 className="evntsheadcl border-allsd">Export Cab Logs</h1>
                        <article style={{padding:"12px"}}>
                            <label className="settinglabelsub">Cab Number</label>
                            <input type="text"
                             value={cabNumber}
                                required
                                onChange={(e) => setCabNumber(e.target.value)}
                                name="" placeholder="Enter Cab Number" id="" className="settinglabelsubinp" />
                                <article className="labelaligncl">
                                <label className="settinglabelsub">From</label>
                            <DatePicker
                            selected={selectedFromDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="yyyy-MM-dd HH:mm"
                            onChange={handleFromDateChange}
                            className="myDatepickercl" />
                            </article>
                            <article className="labelaligncl">
                                <label className="settinglabelsub">To</label>
                           <DatePicker
                            selected={selectedToDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="yyyy-MM-dd HH:mm"
                            onChange={handleToDateChange}
                            className="myDatepickercl" />
                            </article>
                                <article className="f-r labelaligncl">
                                    <button type="button" className="createbtn" onClick={ExportCanData}>Export</button>
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

export default EventPg;