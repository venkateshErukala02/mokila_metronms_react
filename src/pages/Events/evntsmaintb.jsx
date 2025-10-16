import React, { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Events/events.css';


const EventMainTB = () => {

    const [eventmainData, setEventmainData] = useState([]);
    const [auditmainData,setAuditmainData] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [typevalueSel, setTypevalueSel] = useState('events');
    const [typelabelSel, setTypelabelSel] = useState('Events');
    const [selectedDuration, setSelectedDuration] = useState(86400000); // keep as raw value
    const [eventtimeSel, setEventtimeSel] = useState(Date.now() - 86400000);
    const [eventmainSeverityValueSel, setEventmainSeverityValueSel] = useState('');
    const [eventmainSeverityLabelSel, setEventmainSeverityLabelSel] = useState('All');
    const [eventmainLimitValueSel, setEventmainLimitValueSel] = useState('1');
    const [eventmainLimitLabelSel, setEventmainLimitLabelSel] = useState('50');
    const [eventauditLimitValueSel, setEventauditLimitValueSel] = useState('1');
    const [eventauditLimitLabelSel, setEventauditLimitLabelSel] = useState('50');
    const [searchBtn, setSearchBtn] = useState(false);
    const [eventipText, setEventipText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [nodeIdData,setNodeIdData] = useState('');
    const nodeIdRef = useRef(null);

    const getDataEvntMain = async (url) => {
       if(eventipText === ''){
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },

            };
            const response = await fetch(url, options);



            if (response.status === 204) {
                setIsLoading(false);
                setEventmainData([]);
                setIsError({ status: false, msg: '' });
                return;
            }
            const data = await response.json();
            if (!response.ok) {
                throw new Error("API Error");
            }

            let normalized = [];

            if (url.includes('/audit/') && typevalueSel==='auditlog') {
                normalized = data.audits || [];
                setAuditmainData(normalized || []);
            } else if (data?.event && typevalueSel==='events' || typevalueSel==='syslogd' ) {
                normalized = data.event;
                setEventmainData(normalized || []);

            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    }
    };

    // useEffect(() => {
    //   const url='api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D1747558597559&ar=glob&limit=50&offset=0&order=desc&orderBy=id'
    //     getDataEvntMain(url);
    // }, []);



    useEffect(() => {
        const newTimestamp = Date.now() - selectedDuration;
        setEventtimeSel(newTimestamp);
    }, [selectedDuration]);

    // useEffect(() => {
    //     const baseFilter = `eventDisplay==Y;eventSource!=syslogd`;
    //     const severityFilter = eventmainSeverityValueSel !== "-1" ? `;eventSeverity==${eventmainSeverityValueSel}` : '';
    //     const timestamp = Date.now() - selectedDuration;

    //     const url = `api/v2/events/list?_s=${baseFilter}${severityFilter};eventCreateTime=gt=${timestamp}&ar=glob&limit=${eventmainLimitLabelSel}&offset=0`;

    //     getDataEvntMain(url);
    // }, [selectedDuration, eventmainLimitLabelSel, eventmainSeverityValueSel]);


    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };



    useEffect(() => {
        let url = '';

        let filterParts = [
            "eventDisplay==Y",
            typevalueSel === 'events' ? "eventSource!=syslogd" : 'eventSource==syslogd'
            ];

            if (eventmainSeverityValueSel) {
            filterParts.push(`eventSeverity==${eventmainSeverityValueSel}`);
            }

        const filterString = filterParts.join(";");
        switch (typevalueSel) {
            case 'events':
                console.log('Fetching data...eer');
                url = `api/v2/events/list?_s=${encodeURIComponent(filterString)};eventCreateTime%3Dgt%3D${eventtimeSel}&ar=glob&limit=${eventmainLimitLabelSel}&offset=${pageSize}&order=desc&orderBy=id`
                getDataEvntMain(url);
                break;

            case 'syslogd':
                console.log('Fetching data...ff');
                url = `api/v2/events/list?_s=${encodeURIComponent(filterString)};eventCreateTime%3Dgt%3D${eventtimeSel}&ar=glob&limit=${eventmainLimitLabelSel}&offset=${pageSize}&order=desc&orderBy=id`;
                getDataEvntMain(url);

                break;
            case 'auditlog':
                console.log('Fetching data...lkkl');
                url= `api/v2/audit/list?_s=datentime%3Dgt%3D${eventtimeSel}&limit=${eventmainLimitLabelSel}&offset=${pageSize}&order=desc&orderBy=id`
                getDataEvntMain(url);
                break;

            default:
                console.log('Unknown status');

                break;
        }
    }, [typevalueSel, pageSize, eventmainLimitLabelSel,selectedDuration,eventmainSeverityValueSel]);


    const handleNodeIp = async (eventipText) => {


        // if (!eventipTextipText) {
        //   alert("Please enter a search term");

        // } else {
        //   setSearchBtn(true)


          try {
            const response = await fetch(`api/v2/nodes?_s=label==${eventipText.trim()}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await response.json();

            if (response.ok) {
                 const nodeId = data.node[0]?.id;

            if (!nodeId) throw new Error("Node ID not found");
                nodeIdRef.current = nodeId;
              setIsLoading(false);
              setNodeIdData(data.node[0]);
            //   nodeIdRef.current = Array.isArray(data.node[0]) ? data.node[0] : [data.node[0]];

              setIsError({ status: false, msg: "" });
              return nodeId;
            } else {
              throw new Error("data not found");
            }

          } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
          }
        } 



    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const getCategoryClass = (category) => {
        switch (category) {
            case 'Critical':
                return 'critical';
            case 'MAJOR':
                return 'iconmajor';
            case 'WARNING':
                return 'iconwarn';
            case 'MINOR':
                return 'iconminor';
            case 'NORMAL':
                return 'iconnormal';
            case 'CLEARED':
                return 'iconclear';
            default:
                return '';
        }
    };

    const handleSeverityMode = (event) => {
        const value = event.target.value;
        const selectedIndex = event.target.selectedIndex;
        const label = event.target.options[selectedIndex].label;

        setEventmainSeverityValueSel(value);
        setEventmainSeverityLabelSel(label);
    };


    const handleType = (event) => {
        const value = event.target.value;
        const label = event.target.options[event.target.selectedIndex].label;
        setTypevalueSel(value);
        setTypelabelSel(label);

    }


    const handleMainEventTimestamp = (event) => {
        const value = parseInt(event.target.value);
        setSelectedDuration(value);
    };


    const handleMainEventLimitValue = (event) => {
        let selectedIndex = event.target.selectedIndex;
        setEventmainLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setEventmainLimitLabelSel(label)
    }

    const handleMainAuditLimitValue = (event) => {
        let selectedIndex = event.target.selectedIndex;
        setEventauditLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setEventauditLimitLabelSel(label)
    }


    const handleClearSerch = () => {
        setSearchBtn(false);
        setEventipText('');
    }


    const handleIncreamentOffset = () => {
        // setFromValue(parseInt(pageSize)* parseInt(limitValueSelLabel));
        if (eventmainData?.length === 0 || undefined) {
            setPageSize(prevstate => prevstate);
        } else if (eventmainData?.length > 0) {
            setPageSize(prevstate => prevstate + 1);
        }
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                // setFromValue(parseInt(newPageSize) * parseInt(limitValueSelLabel));
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }

     const handleRadialIP = async () => {
        if (!eventipText) {
            alert("Please enter a search term");
            return;
        }else{
            let url =''
            let start = '';
            let filter = '';
            // let filter = "eventSource!%3Dsyslogd" + ';';
            if (typevalueSel ==='auditlog') {
                // start  = `api/v2/audit/list?_s=`
                url = `api/v2/audit/list?_s=logDesc==*${eventipText}*;datentime%3Dgt%3D1760080111575&limit=100&offset=0&order=desc&orderBy=id`
                 handleRadialIPa(url);
            } else {
                start = `api/v2/events?_s=`
                const regex = /^192\.168\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if (regex.test(eventipText)) {
                    const id = await handleNodeIp(eventipText);
                         if (id) {
                        // filter  =  filter +'node.id%3D%3D' + `${id}` + ';';
                        // console.log("okookoo",id);
                        url = `api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;node.id%3D%3D${id};eventCreateTime%3Dgt%3D${eventtimeSel}&ar=glob&limit=${eventmainLimitLabelSel}&offset=0&order=desc&orderBy=id`
                        handleRadialIPa(url);
                         }
                }  else {
                    filter  =  filter + `eventLogMsg%3D%3D` +`*${eventipText}*`;
                     if (eventmainLimitLabelSel != 'all') {
                    filter  =  filter +'&limit=' + `${eventmainLimitLabelSel}`;
                    }
                    url = start + filter + '&offset=0&order=desc&orderBy=id';
                     handleRadialIPa(url);
                    console.log('apppoooiii',url)
                }
                // if (eventmainSeverityValueSel) {
                //     filter  =  filter +'eventSeverity%3D%3D' + `${eventmainSeverityValueSel}` + ';';
                // }
                //  if (eventtimeSel) {
                //     filter  =  filter +'eventCreateTime%3Dgt%3D' + `${eventtimeSel}`;
                // }
                // if (cat slected) {
                //     filter  =  filter +'logDesc%D%D' + `*${eventipText}*;
                // }
               
            }
        }

    }


      const handleRadialIPa = async (url) => {
        if (!eventipText) {
            alert("Please enter a search term");
            return;
        }

        setSearchBtn(true);
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        
        try {
            const response = await fetch(url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                setIsLoading(false);
                setEventmainData([]);
                return;
            }

            const data = await response.json(); // Only parse once

            if (response.ok) {
                setIsLoading(false);

                let normalized = [];

            if (url.includes('/audit/') && typevalueSel==='auditlog') {
                normalized = data.audits || [];
                setAuditmainData(normalized || []);
            } else if (data?.event && typevalueSel==='events' || typevalueSel==='syslogd' ) {
                normalized = data.event;
                setEventmainData(normalized || []);

            }
            setIsLoading(false);

                setIsError({ status: false, msg: '' });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message || "Something went wrong" });
        }
    };



    return (
        <>
            <article className="row border-tlr custom-row">
                <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                    <article style={{ display: typevalueSel === 'auditlog' ? 'none' : 'block' }}>
                        <button className="clearfix arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>{pageSize}</span></button>
                        <button className="clearfix arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                        <span className="eventscp">Scope : </span>
                        <span className="eventgolcl" onClick={toggleDropdown} >Golbal <span class="fa fa-chevron-down highlightText v-align-tt iconsy"></span></span>

                        <input type="text" value={eventipText} onChange={(e) => setEventipText(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="IP Address " id="" className="form-controlevents" />
                        <button className="clearfix createbtn" onClick={() => { handleRadialIP();}} >Search</button>
                        <button className="clearfix createbtn" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>


                    </article>
                    <article style={{ display: typevalueSel === 'auditlog' ? 'block' : 'none' }}>
                        <button className="clearfix arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>{pageSize}</span></button>
                        <button className="clearfix arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>

                         <input type="text" value={eventipText} onChange={(e) => setEventipText(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="IP Address " id="" className="form-controlevents" />
                        <button className="clearfix createbtn" onClick={() => { handleRadialIP();}} >Search</button>
                        <button className="clearfix createbtn" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>
                    </article>

                </article>
                <article className="col-sm-7 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
                    <article style={{ float: 'right' }}>
                        <article style={{ display: typevalueSel === 'auditlog' ? 'none' : 'block' }}>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Type:</label>

                            <select name="name" id="name" value={typevalueSel} onChange={handleType} className="form-controll1" style={{ maxWidth: '93px' }}>
                                <option value="events" label="Events">Events</option>
                                <option value="syslogd" label="Syslogs">Syslogs</option>
                                <option value="auditlog" label="Audit Log">Audit Log</option>
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Severity :</label>

                            <select name="name" id="name" value={eventmainSeverityValueSel} onChange={handleSeverityMode} className="form-controll1" style={{ maxWidth: '116px', minWidth: '116px' }}>
                                <option value="" selected="selected" label="All">All</option>
                                <option value="7" label="Critical">Critical</option>
                                <option value="6" label="Major">Major</option>
                                <option value="5" label="Minor">Minor</option>
                                <option value="4" label="Warning">Warning</option>
                                <option value="3" label="Normal">Normal</option>
                                <option value="2" label="Cleared">Cleared</option>
                                <option value="1" label="Indeterminate">Indeterminate</option>
                            </select>

                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Category:</label>

                            <select name="name" id="name" className="form-controll1" style={{ maxWidth: '124px', minWidth: '124px' }}>
                                <option value="All">All</option>
                               <option value="uei.opennms.org/nodes/nodeUp" label="Up">Up</option>
                               <option value="uei.opennms.org/nodes/nodeDown" label="Down">Down</option>
                               <option value="uei.opennms.org/traps/KEYWEST-MIB/associatedTrap" label="Associated">Associated</option>
                               <option value="uei.opennms.org/traps/KEYWEST-MIB/disassociatedTrap" label="Dissociated">Dissociated</option>
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Time:</label>
                            <select name="name" id="name" value={selectedDuration} onChange={handleMainEventTimestamp} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                <option value="3600000" label="Last hour">Last hour</option>
                                <option value="28800000" label="8 hours">8 hours</option>
                                <option value="86400000" label="24 hours">24 hours</option>
                                <option value="172800000" label="48 hours">48 hours</option>
                            </select>

                            <select className="form-controll1" value={eventmainLimitValueSel} onChange={handleMainEventLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                <option value="0" label="25">25</option>
                                <option value="1" label="50">50</option>
                                <option value="2" label="100">100</option>
                                <option value="3" label="500">500</option>
                            </select>
                        </article>
                        <article style={{ display: typevalueSel === 'auditlog' ? 'block' : 'none' }}>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Type:</label>

                            <select name="name" id="name" value={typevalueSel} onChange={handleType} className="form-controll1" style={{ maxWidth: '93px' }}>
                                <option value="events" label="Events">Events</option>
                                <option value="syslogd" label="Syslogs">Syslogs</option>
                                <option value="auditlog" label="Audit Log">Audit Log</option>
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Time:</label>
                            <select name="name" id="name" value={selectedDuration} onChange={handleMainEventTimestamp} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                <option value="3600000" label="Last hour">Last hour</option>
                                <option value="28800000" label="8 hours">8 hours</option>
                                <option value="86400000" label="24 hours">24 hours</option>
                                <option value="172800000" label="48 hours">48 hours</option>
                            </select>

                            <select className="form-controll1" value={eventmainLimitValueSel} onChange={handleMainEventLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                <option value="0" label="25">25</option>
                                <option value="1" label="50">50</option>
                                <option value="2" label="100">100</option>
                                <option value="3" label="500">500</option>
                            </select>
                        </article>

                    </article>
                </article>
            </article>
            {typevalueSel !== 'auditlog' ? (
                <article className="eventmaintable">
                    <article className="row">
                        <table className="col-12">
                            <thead className="eventsthtb">
                                <tr>

                                    <th>IP Address</th>
                                    <th>Time</th>
                                    <th>Severity</th>
                                    <th>Message</th>
                                </tr>
                            </thead>

                            <tbody className="eventstbdtb">
                                {!isLoading && !isError.status && (!eventmainData || eventmainData?.length === 0) && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center" }}>
                                            No Data Available
                                        </td>
                                    </tr>
                                )}
                                {Array.isArray(eventmainData) && eventmainData?.length > 0 ? (
                                    eventmainData.map((event) => (
                                        <tr key={event.id}>
                                            <td><i className={getCategoryClass(event.severity)}></i>{event.ipAddress ? event.ipAddress : event.host}</td>
                                            <td>{formatTime(event.time)}</td>
                                            <td>{event.severity}</td>
                                            <td>{event.logMessage}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* <td colSpan="4" className="datacl centered-text">No Data</td> */}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </article>
                </article>) : (
                <article className="eventmaintable">
                    <article className="row">
                        <table className="col-12">
                            <thead className="eventsthtb">
                                <tr>

                                    <th>Date</th>
                                    <th>Type</th>
                                    <th>User</th>
                                    <th>Log</th>
                                </tr>
                            </thead>
                            <tbody className="eventstbdtb">
                                {Array.isArray(auditmainData) && auditmainData?.length > 0 ? (
                                    auditmainData.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.date}</td>
                                            <td>{event.type}</td>
                                            <td>{event.user}</td>
                                            <td>{event.log}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="datacl centered-text">No Data Available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </article>
                </article>)}
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
        </>
    )
}


export default EventMainTB;
