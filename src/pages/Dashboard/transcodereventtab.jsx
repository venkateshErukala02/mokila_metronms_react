import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import TranscoderEventLog from "./transcoderEventslog";

const TcEventTab=()=>{
    const [eventmainData, setEventmainData] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [typevalueSel, setTypevalueSel] = useState('events');
    const [typelabelSel, setTypelabelSel] = useState('Events');
    const [selectedDuration, setSelectedDuration] = useState(86400000);
    const [eventtimeSel, setEventtimeSel] = useState(Date.now() - 86400000);
    const [eventmainSeverityValueSel, setEventmainSeverityValueSel] = useState('-1');
    const [eventmainSeverityLabelSel, setEventmainSeverityLabelSel] = useState('All');
    const [eventmainLimitValueSel, setEventmainLimitValueSel] = useState('1');
    const [eventmainLimitLabelSel, setEventmainLimitLabelSel] = useState('50');
    const [eventauditLimitValueSel, setEventauditLimitValueSel] = useState('1');
    const [eventauditLimitLabelSel, setEventauditLimitLabelSel] = useState('50');
     
      const [logsMode,setLogsMode]=useState('LOGS');
     const [searchBtn, setSearchBtn] = useState(false);
      const [eventipText, setEventipText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
     const [selectedDate, setSelectedDate] = useState(new Date());
   
    const [date, setDate] = useState(null);

 const nodeDataId = useSelector((state) => state.node?.node?.nodeId) || localStorage.getItem('nodeId');

    const getDataEvntMain = async (url) => {
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

            if (url.includes('/audit/')) {
                normalized = data.audits || [];
            } else if (data.event) {
                normalized = data.event;
            }

            setEventmainData(normalized);
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {

          let effectiveDate;

            if (date === null) {
                const sixHoursInMs = 6 * 60 * 60 * 1000;
                const now = new Date();
                effectiveDate = now.getTime() - sixHoursInMs;
            } else {
                const formatDate = new Date(date);
                effectiveDate = formatDate.getTime();
            }

        let url = '';

        switch (typevalueSel) {
            case 'events':
                url=`api/v2/events/list?_s=node.id%3D%3D${nodeDataId};eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D${effectiveDate}&limit=50&offset=0`;
                getDataEvntMain(url);
                break;

            case 'syslogd':
                url=`api/v2/events/list?_s=node.id%3D%3D${nodeDataId};eventDisplay%3D%3DY;eventSource%3D%3Dsyslogd;eventCreateTime%3Dgt%3D${effectiveDate}&limit=50&offset=0`;
                getDataEvntMain(url);

                break;
            case 'auditlog':
                url = '/api/v2/audit/list?_s=&limit=50&offset=0&order=desc&orderBy=id';
                getDataEvntMain(url);
                break;

            default:
                url=`api/v2/events/list?_s=node.id%3D%3D${nodeDataId};eventDisplay%3D%3DY;eventSource!%3Dsyslogd&limit=50&offset=0`;
                getDataEvntMain(url);
                break;
        }
    }, [typevalueSel,nodeDataId,date]);

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

      const handleChange = (event) => {
        setLogsMode(event.target.value);
        };

    return (
        <>
        <article className="row">
             <article className="border-tlr custom-row" style={{textAlign:'center'}}>

      <label className="radiolabel" style={logsMode === 'LOGS' ? {fontWeight:700,color:'#495057',marginRight:'10px'}:{marginRight:'10px'}}>
        <input
          type="radio"
          value="LOGS"
          checked={logsMode === 'LOGS'}
          onChange={handleChange}
          className="radiobtn"
        />
        Logs
      </label>

      <label className="radiolabel" style={logsMode === 'EVENTS' ? {fontWeight:700,color:'#495057'}:{}}>
        <input
          type="radio"
          value="EVENTS"
          checked={logsMode === 'EVENTS'}
          onChange={handleChange}
          className="radiobtn"
        />
        Events
      </label>
         
            </article>
              {logsMode !== 'LOGS' ? ( 
            <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
               <article className="row border-tlr custom-row">
                <article className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <article style={{ display: typevalueSel === 'auditlog' ? 'none' : 'block' }}>
                        <button className="clearfix arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>1</span></button>
                        <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
            
                    </article>
                    <article style={{ display: typevalueSel === 'auditlog' ? 'block' : 'none' }}>
                        <button className="clearfix arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>1</span></button>
                        <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>

                        <input type="text" style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="IP Address " id="" className="form-controlevents" />
                        <button className="clearfix createbtn">Search</button>
                    </article>

                </article>
                <article className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <article style={{ float: 'right' }}>
                        <article style={{ display: typevalueSel === 'auditlog' ? 'none' : 'block' }}>
                             <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Type:</label>

                            <select name="name" id="name" value={typevalueSel} onChange={handleType} className="form-controll1" style={{ maxWidth: '93px' }}>
                                <option value="events" label="Events">Events</option>
                                <option value="syslogd" label="Syslogs">Syslogs</option>
                               
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Severity :</label>

                            <select name="name" id="name" value={eventmainSeverityValueSel} onChange={handleSeverityMode} className="form-controll1" style={{ maxWidth: '116px', minWidth: '116px' }}>
                                <option value="-1" selected="selected" label="All">All</option>
                                <option value="7" label="Critical">Critical</option>
                                <option value="6" label="Major">Major</option>
                                <option value="5" label="Minor">Minor</option>
                                <option value="4" label="Warning">Warning</option>
                                <option value="3" label="Normal">Normal</option>
                                <option value="2" label="Cleared">Cleared</option>
                                <option value="1" label="Indeterminate">Indeterminate</option>
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Time:</label>

                        <article className="trans-datepickerbg" style={{display:'inline-block'}}>
                        <DatePicker
                        selected={selectedDate}
                        showTimeSelect
                         className="myDatepickercl"
                        dateFormat="yyyy-MM-dd HH:mm"
                        onChange={(date) => setSelectedDate(date)} />

                        </article>
                         <button class="clearfix createbtn" style={{marginLeft:'10px'}} onClick={()=>{
                        setDate(selectedDate)
                    }
                    }>Search</button>
                          
                          

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
                            <select name="name" id="name" className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                <option value="24 hours">24 hours</option>
                                <option value="saab">Disable</option>
                            </select>

                            <select className="form-controll1" value={eventauditLimitValueSel} onChange={handleMainAuditLimitValue}  style={{ width: 'auto' }} aria-invalid="false">
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
                        <thead className="tncodereventsthtb">
                            <tr>
                                <th>Time</th>
                                <th>Severity</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody className="tncodereventstbdtb">
                            {!isLoading && !isError.status && eventmainData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData.map((event) => (
                                    <tr key={event.id}>
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
                        <thead className="tncodereventsthtb">
                            <tr>

                                <th>Date</th>
                                <th>Type</th>
                                <th>User</th>
                                <th>Log</th>
                            </tr>
                        </thead>
                        <tbody className="tncodereventstbdtb">
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData.map((event) => (
                                    <tr key={event.id}>
                                        <td>{event.date}</td>
                                        <td>{event.type}</td>
                                        <td>{event.user}</td>
                                        <td>{event.log}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="datacl centered-text">No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </article>
            </article>)} 
            </article>
              ) :(
            <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" style={{padding:'0'}}>
                <TranscoderEventLog date={date} currentTab='transcoder'/>
          </article>
              )}
            </article>
        
        </>
    )
}


export default TcEventTab;