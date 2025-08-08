import React, { useState, useEffect } from "react";
import '../ornms.css'

import GdChart from "./scopepiechart";
import BsChart from "./scoperaidalchart";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import Tableone from "./eventstb";
// import { toggleVisibility } from '../Action/action';
// import { getAuthToken } from '../config';
import RadialDataTb from "./radialdatatb";
import GlobalView from "./globalview";
import LineoneView from "./lineoneview";
import SvgViewer from "./lineoneview";
import '../Dashboard/dashboard.css';
import '../Navbar/leftnavpage.css';
import TreeList from "../Topology/treelist";
import Tree from "../Topology/tree";






const DashBoardPage = () => {
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [radialData, setRadilData] = useState('');
    const [scopeValueSel, setScopeValueSel] = useState('global');
    const [scopeLabelSel, setScopeLabelSel] = useState('Global');
    const [dname, setDname] = useState('');
    const [circleId, setCircleId] = useState('');
    const [lineInfo, setLineInfo] = useState('');
    const [serverStatus, setServerStatus] = useState('');
    const [isLoading, setIsLoading] = useState('');
    const [isError, setIsError] = useState('');

    const getServerStatusDt = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {

            const options = {
                method: "GET",
                headers: {
                    // 'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                const nodeDataone = data["Node1"];
                const nodeDatatwo = data["Node2"];

                const filteredData = {
                    nodeNameone: "Node1",
                    serverNameone: nodeDataone?.Server,
                    stateone: nodeDataone?.State,
                    nodeNametwo: "Node2",
                    serverNametwo: nodeDatatwo?.Server,
                    statetwo: nodeDatatwo?.State
                };
                setServerStatus(filteredData);
                console.log('Fetched server status:', data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
            console.error('Fetch error:', error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            let url = 'http://localhost:8084/redundancy/api/v1/metronms';
            //let url='htpp://localhost:8980/redundancy/api/v1/ornms'
            await getServerStatusDt(url);
        };
        fetchData();
    }, []);


    const toggleDropdown = () => {
        const dropdown = document.getElementById('dropdown');
        if (dropdown) {
            if (dropdown.style.display === 'block' || dropdown.classList.contains('show')) {
                // Hide the dropdown with transition
                dropdown.classList.remove('show');
                setTimeout(() => {
                    dropdown.style.display = 'none'; // Hide after transition
                }, 500); // Match the transition time
            } else {
                // Show the dropdown with transition
                dropdown.style.display = 'block';
                setTimeout(() => {
                    dropdown.classList.add('show'); // Add class after it's visible to start transition
                }, 10); // Tiny delay to allow for display: block to be applied first
            }
        }
    };

    const getAllRadialData = (value, devicename) => {
        setDname(devicename)
        setRadilData(value)
        console.log('rrrrrararrara', value);
        console.log('stststs', devicename)

    }
    const handleScopeSel = (e) => {
        const value = e.target.value;
        const selectedIndex = e.target.selectedIndex;
        const label = e.target.options[selectedIndex].label
        setScopeValueSel(value);
        setScopeLabelSel(label);
    }

    useEffect(() => {
        if (scopeValueSel) {
            getAllRadialData(scopeValueSel);
        }
    }, [scopeValueSel]);

    const getCircleId = (value, id) => {
        console.log('adaddw', value)
        setCircleId(id);
        setLineInfo(value)
    }



    const renderDashboardCont = () => {
        let url;
        switch (scopeValueSel) {
            case 'global':
                return <GlobalView getAllRadialData={getAllRadialData} />;
            case 'line1-sec1':
                return <SvgViewer scopeValueSel={scopeValueSel} getCircleId={getCircleId} />
            case 'line1-sec2':
                return <SvgViewer scopeValueSel={scopeValueSel} getCircleId={getCircleId} />
            case 'line4-sec1':
                return <SvgViewer scopeValueSel={scopeValueSel} getCircleId={getCircleId} />
            case 'line':
                return <Tree circleId={circleId} />
            default:
                return <GlobalView getAllRadialData={getAllRadialData} />
        }
    }




    return (
        <section className="display-f">
            <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
                <LeftNavList className='leftsidebar' />
            </article>
            <article className="container-fluid">
                <article className="row">

                    <article className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8">

                        <article className="row border-allsdnew" style={{ margin: '5px 0px 5px 5px' }}>
                            <article className="scpcont">
                                <ul className="scopelist">
                                    <li>
                                        <span className="scopesel">Scope:

                                        </span>
                                        <select className="form-controlscope" value={scopeValueSel} onChange={handleScopeSel}>
                                            <option value="global" label="Global">Global</option>
                                            <option value="line1-sec1" selected="selected" label="Line1-Section1">Line1-Section1</option>
                                            <option value="line1-sec2" label="Line1-Section2">Line1-Section2</option>
                                            <option value="line4-sec1" label="Line4">Line4</option>
                                        </select>
                                    </li>


                                    <div className="node-card" style={{ display: 'flex', marginLeft: '170px', float: 'right' }}>
                                        <div className="node-section">
                                            <button className="nodebuu">
                                                {serverStatus.nodeNameone}:
                                                <label className="statuslabel">{serverStatus.stateone}</label>
                                            </button>
                                            <h6 style={{ marginTop: '0px', color: 'black', fontSize: '12px', marginLeft: '6px' }}>
                                                Adds:<span style={{ fontWeight: '500', color: '#6c757d' }}> {serverStatus.serverNameone}</span>
                                            </h6>
                                        </div>
                                        <div className="node-section">
                                            <button className="nodebuu">
                                                {serverStatus.nodeNametwo}:
                                                <label className="statuslabelone">{serverStatus.statetwo}</label>
                                            </button>
                                            <h6 style={{ marginTop: '0px', color: 'black', fontSize: '12px', marginLeft: '6px' }}>
                                                Address: <span style={{ fontWeight: '500', color: '#6c757d' }}>{serverStatus.serverNametwo}</span>
                                            </h6>
                                        </div>
                                    </div>
                                </ul>
                            </article>
                            {renderDashboardCont()}

                        </article>
                        {/* </article> */}
                        {/* <article className="container-fluid"> */}
                        <article className="row" style={{ margin: '5px 0px 5px 5px' }}>
                            <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 border-allsdnew" style={{ height: '0vh' }} >
                                <RadialDataTb radialData={radialData} dname={dname} circleId={circleId} lineInfo={lineInfo} />

                            </article>
                        </article>
                        {/* </article> */}
                    </article>
                    <article className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">

                        <Tableone />
                    </article>

                </article>
                <article id="dropdown" className='dropcont' style={{ position: "absolute", left: "350px", width: '660px', zIndex: '1', top: '14px', backgroundColor: 'white', display: "none" }}>
                    <article className='headernav'>
                        <h4 className='filthead'>Filter</h4>
                        <button type="button" className="closebtn" onClick={toggleDropdown}>X</button>
                    </article>
                    <article className=''>
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
                        <hr />
                    </article>
                    <div className="golfooter">
                        <button type="button" className="Appllbtn">Apply</button>
                        <button type="button" className="cllbtn" onClick={toggleDropdown}>Close</button>
                    </div>
                </article>
            </article>
        </section>
    )
}

export default DashBoardPage;