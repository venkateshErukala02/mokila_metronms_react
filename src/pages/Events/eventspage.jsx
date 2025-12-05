import React, { useState } from "react";
import { Table } from "react-bootstrap";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import EventMainTB from "./evntsmaintb";
import '../ornms.css';
import './../Events/events.css';


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
                    <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                        <h1 className="evntsheadcl">Events</h1>
                        <EventMainTB/>
                    </article>
                    </article>
                </article>
            </article>
        </>

    )
}

export default EventPg;