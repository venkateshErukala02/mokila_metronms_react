import React, { useState } from "react";

// import LeftNavList from "./leftnavlist";
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
                        {/* <article className="row border-allsd" style={{margin:"10px 0"}}>
                        <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <SeverChart />

                        </article>
                        <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                            <SeverChartone />
                        </article>
                    </article> */}
                    </article>
                    </article>
                   

                    {/* <article id="dropdown" className={`dropcont ${isDropdownOpen ? 'open' : 'closed'}`}>
                <article className='headernav'>
                    <h4 className='filthead'>Filter</h4>
                    <button type="button" className="closebtn" onClick={toggleDropdown}>X</button>
                </article>
                <article>
                    <ul className="clearfix globli">
                        <li>
                            <label className="labglo">Global
                                <input type="radio" value="Global" className="radinp" aria-checked="true" />
                                <span className="checking"></span>
                            </label>
                        </li>
                        <li>
                            <label className="labglo">Region
                                <input type="radio" value="Region" className="radinp" aria-checked="false" />
                                <span className="checking"></span>
                            </label>
                        </li>
                        <li>
                            <label className="labglo">City
                                <input type="radio" value="City" className="radinp" aria-checked="false" />
                                <span className="checking"></span>
                            </label>
                        </li>
                        <li>
                            <label className="labglo">Location
                                <input type="radio" value="Location" className="radinp" aria-checked="false" />
                                <span className="checking"></span>
                            </label>
                        </li>
                        <li>
                            <label className="labglo">Facility
                                <input type="radio" value="Facility" className="radinp" aria-checked="false" />
                                <span className="checking"></span>
                            </label>
                        </li>
                        <li>
                            <label className="labglo">Base Station
                                <input type="radio" value="Basestation" className="radinp" aria-checked="false" />
                                <span className="checking"></span>
                            </label>
                        </li>
                    </ul>
                    <hr className='glohr' />
                    <article className='slecglo'>
                        <label className="labglo">Selected:</label>
                        <span className='spglo'>Global</span>
                    </article>
                </article>
                <div className="golfooter">
                    <button type="button" className="Appllbtn">Apply</button>
                    <button type="button" className="cllbtn" onClick={toggleDropdown}>Close</button>
                </div>
                    </article> */}
                </article>
            </article>
        </>

    )
}

export default EventPg;