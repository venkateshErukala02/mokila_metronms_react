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

    return (
        <>
            <article className="display-f">
            <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
                  <LeftNavList  className='leftsidebar'/>
                  </article>
                  <article className="container-fluid">
                  <article className="row">
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
                                // value={version}
                                required
                                // onChange={(e) => setVersion(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                                <article className="labelaligncl">
                                <label className="settinglabelsub">From</label>
                            <DatePicker
                            // selected={selectedDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="yyyy-MM-dd HH:mm"
                                // onChange={handleDateChange}
                            className="myDatepickercl" />
                            </article>
                            <article className="labelaligncl">
                                <label className="settinglabelsub">To</label>
                           <DatePicker
                            // selected={selectedDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="yyyy-MM-dd HH:mm"
                                // onChange={handleDateChange}
                            className="myDatepickercl" />
                            </article>
                                <article className="f-r labelaligncl">
                                    <button type="button" className="createbtn">Export</button>
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