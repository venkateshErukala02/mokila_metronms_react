import React, { useState, useEffect } from "react";
import '../ornms.css';
import '../Dashboard/dashboard.css';



const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
};

const Tableone = () => {
    const [eventData, setEventData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDuration, setSelectedDuration] = useState(86400000); // keep as raw value
    const [eventtimeSel, setEventtimeSel] = useState(Date.now() - 86400000);
    const [eventLimitValueSel, setEventLimitValueSel] = useState('1');
    const [eventLimitLabelSel, setEventLimitLabelSel] = useState('50');
    const [eventSeverityValueSel, setEventSeverityValueSel] = useState('-1');
    const [eventSeverityLabelSel, setEventSeverityLabelSel] = useState('All');

    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue,setFromValue] =useState('0');

    const getDataEvents = async (url) => {
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
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(url, options);

            if (response.status === 204) {
                setIsLoading(false);
                setEventData([]); // Treat as empty data
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setEventData(data);
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
        const newTimestamp = Date.now() - selectedDuration;
        setEventtimeSel(newTimestamp);
    }, [selectedDuration]);


    // useEffect(() => {
    //     const url = `api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D${eventtimeSel}&ar=glob&limit=${eventLimitLabelSel}&offset=0`;
    //     // http://localhost:8980/ornms/api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D1744351398086&ar=glob&limit=50&offset=0
    //     // http://localhost:8980/ornms/api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventSeverity%3D%3D7;eventCreateTime%3Dgt%3D1744351433038&ar=glob&limit=50&offset=0

    //     getDataEvents(url);
    // }, [eventtimeSel,eventLimitLabelSel]);

    // useEffect(()=>{
    //     const url= `api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventSeverity%3D%3D${eventSeverityValueSel};eventCreateTime%3Dgt%3D1744351922846&ar=glob&limit=50&offset=0`;
    //     getDataEvents(url);
    //     // http://localhost:8980/ornms/api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D1744351812366&ar=glob&limit=50&offset=0


    // },[eventSeverityValueSel])



    useEffect(() => {
        const baseFilter = `eventDisplay==Y;eventSource!=syslogd`;
        const severityFilter = eventSeverityValueSel !== "-1" ? `;eventSeverity==${eventSeverityValueSel}` : '';
        const timestamp = Date.now() - selectedDuration;
        const url = `api/v2/events/list?_s=${baseFilter}${severityFilter};eventCreateTime=gt=${timestamp}&ar=glob&limit=${eventLimitLabelSel}&offset=${fromValue}`
        // const url = `api/v2/events/list?_s=${baseFilter}${severityFilter};eventCreateTime=gt=${timestamp}&ar=glob&limit=${eventLimitLabelSel}&offset=0`;

        getDataEvents(url);
    }, [eventSeverityValueSel, selectedDuration, eventLimitLabelSel,fromValue]);



    const handleTimestamp = (event) => {
        const value = parseInt(event.target.value);
        setSelectedDuration(value);
    };

    const handleEventLimitValue = (event) => {
        let selectedIndex = event.target.selectedIndex;
        setEventLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setEventLimitLabelSel(label)
    }

    const handleSeverityMode = (event) => {
        const value = event.target.value;
        const selectedIndex = event.target.selectedIndex;
        const label = event.target.options[selectedIndex].label;

        setEventSeverityValueSel(value);
        setEventSeverityLabelSel(label);
    };

    const handleIncreamentOffset = () => {
        setFromValue(parseInt(pageSize)* parseInt(eventLimitLabelSel));
        if(eventData?.event?.length === 0 || undefined){
            setPageSize(prevstate=> prevstate);
        }else if(eventData?.event?.length >0){
        setPageSize(prevstate => prevstate + 1);
        }
    }


    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
               const fromCal = (parseInt(newPageSize)-1) * parseInt(eventLimitLabelSel);
                setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            // setFromValue('0');
        }
    }




    return (
        <article className="border-allsdnew" style={{ margin: '5px 0px 5px 5px' }}>
            <h1 className="eventheading">Events</h1>
            <article className="row">
                <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                    <button className="clearfix arrowlf" onClick={handleDecrementOffset}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button className="clearfix numcl"><span>{pageSize}</span></button>
                    <button className="clearfix arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                </article>
                <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9" style={{ float: 'right' }}>
                    <article style={{ float: 'right' }}>

                        <ul className="selectlist">
                            <li>
                                <span className="selectlbl">Severity:

                                </span>
                                <select className="form-controll1" value={eventSeverityValueSel} onChange={handleSeverityMode}>
                                    <option value="-1" selected="selected" label="All">All</option>
                                    <option value="7" label="Critical">Critical</option>
                                    <option value="6" label="Major">Major</option>
                                    <option value="5" label="Minor">Minor</option>
                                    <option value="4" label="Warning">Warning</option>
                                    <option value="3" label="Normal">Normal</option>
                                    <option value="2" label="Cleared">Cleared</option>
                                    <option value="1" label="Indeterminate">Indeterminate</option>

                                </select>
                            </li>
                            <li>
                                <span className="selectlbl">Time:

                                </span>
                                <select className="form-controll1" value={selectedDuration} onChange={handleTimestamp}>
                                    <option value="3600000" label="Last hour">Last hour</option>
                                    <option value="28800000" label="8 hours">8 hours</option>
                                    <option value="86400000" label="24 hours">24 hours</option>
                                    <option value="172800000" label="48 hours">48 hours</option>
                                </select>
                            </li>
                            <li>
                                <select className="form-controll1" value={eventLimitValueSel} onChange={handleEventLimitValue} style={{ width: "auto", display: 'inline-block' }} aria-invalid="false">
                                    <option value="0" label="25">25</option>
                                    <option value="1" label="50">50</option>
                                    <option value="2" label="75">75</option>
                                    <option value="3" label="100">100</option>
                                </select>
                            </li>

                        </ul>



                    </article>
                </article>
            </article>
            <article className="eventstbart">
                <table className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 bordeer-allsd" style={{ height: '90vh' }}>
                    <thead>
                        <tr>

                        </tr>
                    </thead>
                    <tbody className="clearfix tbone">
                        {isError.status && (
                            <tr>
                                <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                    {isError.msg}
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError.status && (!eventData || eventData.length === 0) && (
                            <tr className="col-12 dashbdnodata">
                                {/* <td colSpan="12" style={{ textAlign: "center",width:'100%' }}> */}
                                No Data Available
                                {/* </td> */}
                            </tr>
                        )}
                        {eventData.event && eventData.event.map((event, index) => (
                            <tr key={index} className="col-12">
                                <td className="col-2">{event.host}</td>
                                <td className="col-4" >{formatDate(event.createTime)}</td>
                                <td className="col-5">{event.logMessage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>

        </article>
    );
};

export default Tableone;
