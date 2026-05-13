import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import TranscoderEventLog from "./transcoderEventslog";


const SnEventTab=()=>{

 const [eventmainData, setEventmainData] = useState([]);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [typevalueSel, setTypevalueSel] = useState('events');
    const [typelabelSel, setTypelabelSel] = useState('Events');
    const [selectedDuration, setSelectedDuration] = useState("86400000"); 
    const [eventtimeSel, setEventtimeSel] = useState(Date.now() - 86400000);
    const [eventmainSeverityValueSel, setEventmainSeverityValueSel] = useState('');
    const [eventmainSeverityLabelSel, setEventmainSeverityLabelSel] = useState('All');
    const [eventmainLimitValueSel, setEventmainLimitValueSel] = useState('50');
    const [eventmainLimitLabelSel, setEventmainLimitLabelSel] = useState('50');
    const [eventauditLimitValueSel, setEventauditLimitValueSel] = useState('50');
    const [eventauditLimitLabelSel, setEventauditLimitLabelSel] = useState('50');
    const [date,setDate] = useState(null);
    const [pageSize,setPageSize] = useState(1);
    const [fromValue,setFromValue]=useState('0');
    const [selectedDate, setSelectedDate] = useState(new Date());
     const [logsMode,setLogsMode]=useState('LOGS');
     const [searchBtn, setSearchBtn] = useState(false);
      const [eventipText, setEventipText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    //  const [selectedDuration, setSelectedDuration] = useState("now-1h");
     const [isLastPage, setIsLastPage] = useState(false);
    const [showEventPopup,setShowEventPopup] = useState(false);
    const [eventpopupData,setEventpopupData] = useState([]);
    const popupRef = useRef(null);
    const [reportUrl, setReportUrl] = useState('');
    const [showCustomPopup, setShowCustomPopup] = useState(false);
    const [customStartDate, setCustomStartDate] = useState(null);
    const [customEndDate, setCustomEndDate] = useState(null);
    const [showCustomDateAlertPopup,setShowCustomDateAlertPopup] = useState(false);
    const [showCustomDateLimitAlertPopup,setShowCustomDateLimitAlertPopup] = useState(false);
    const [searchUrl,setSearchUrl] = useState('');
    const [isCustomApplied, setIsCustomApplied] = useState(false);
    const reportUrlRef = useRef('');
     const hasFetched = useRef(false);
     const [executedSearch, setExecutedSearch] = useState("");
  const [executedDate, setExecutedDate] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
   const [sysSelectedDate, setSysSelectedDate] = useState(new Date());
 const nodeDataId = useSelector((state) => state.node?.node?.nodeId) || localStorage.getItem('nodeId');

 const nodeIpaddress = useSelector((state) => state.node?.node?.ipAddress)|| localStorage.getItem('nodeIpaddress');

   useEffect(() => {
        setEventipText('');
        setExecutedDate(new Date());
        setExecutedSearch('');
    }, [typevalueSel]);


     const handleSyslogSearch = async (url) => {
        setSearchUrl(url);
        // if (!eventipText) {
        //     alert("Please enter a search term");
        //     return;
        // }

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

               if (typevalueSel === 'syslogd') {
            const textData = await response.text();
            setEventmainData(textData || "");
            return;
        }

        // ✅ JSON for others
        const data = await response.json();

        if (response.ok) {
            setEventmainData(data.event || []);
            setIsError({ status: false, msg: '' });
        } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message || "Something went wrong" });
        }
    };


     useEffect(() => {
    if (!searchTrigger || searchTrigger === 0 ) return; 
      const startTimestamp = customStartDate?.getTime();
        const endTimestamp = customEndDate?.getTime();
         const durationMs = parseInt(selectedDuration);
            const timeParam = Date.now() - durationMs;
    let url = `api/v2/events/syslogs/${nodeDataId}`;
            const params = [];

            if (eventipText) {
                params.push(`search=${encodeURIComponent(eventipText)}`);
            }
            if (selectedDuration === 'Custom' && startTimestamp && endTimestamp) {
                params.push(`from=${startTimestamp}`);
                params.push(`to=${endTimestamp}`);
            }
            if(selectedDuration !== 'Custom'){
                params.push(`time=${timeParam}`)
            }

            params.push(`offset=${fromValue}`);
            params.push(`limit=${eventmainLimitValueSel}`);

             url = `${url}?${params.join("&")}`;

                handleSyslogSearch(url);
        }, [searchTrigger,selectedDuration,nodeDataId,fromValue,eventmainLimitValueSel]);


  const handleClosepopup  = ()=>{
    setShowCustomPopup(false);
    setCustomEndDate(null);
    setCustomStartDate(null);
  }

const handleCustomSubmit = (e) => {
    if (e) e.preventDefault(); 
    if (!customStartDate || !customEndDate) {
            setShowCustomDateAlertPopup(true);
            return;
        }

        if (customEndDate <= customStartDate) {
            setShowCustomDateLimitAlertPopup(true)
            return;
        }

        setShowCustomPopup(false);
        setIsCustomApplied(true);
         fetchCustomData();
    }
    const fetchCustomData = () => {
         if (!customStartDate || !customEndDate) return;
         if (searchBtn) return;
           const startTimestamp = customStartDate.getTime(); // ms
        const endTimestamp = customEndDate.getTime();  
        let url = '';
        if( typevalueSel === 'events'){
         let filterParts = [
            "eventDisplay==Y",
            typevalueSel === 'events' ? "eventSource!=syslogd" : 'eventSource==syslogd'
            ];

            if (eventmainSeverityValueSel) {
            filterParts.push(`eventSeverity==${eventmainSeverityValueSel}`);
            }

        const filterString = filterParts.join(";");

         url = `api/v2/events/list?_s=${encodeURIComponent(filterString)};eventCreateTime%3Dgt%3D${startTimestamp};eventCreateTime%3Dlt%3D${endTimestamp}&ar=glob&limit=${eventmainLimitLabelSel}&offset=${fromValue}&order=desc&orderBy=id`
        }else if( typevalueSel === 'syslogd'){
            url = `api/v2/events/syslogs/${nodeDataId}`;
                const params = [];

                if (eventipText) {
                    params.push(`search=${encodeURIComponent(eventipText)}`);
                }
                if (selectedDuration === 'Custom' && startTimestamp && endTimestamp) {
                    params.push(`from=${startTimestamp}`);
                    params.push(`to=${endTimestamp}`);
                }
                // if(selectedDuration !== 'Custom'){
                //     params.push(`time=${eventtimeSel}`)
                // }
                   params.push(`offset=${fromValue}`);
                    params.push(`limit=${eventmainLimitValueSel}`);

                if (params.length > 0) {
                    url += "?" + params.join("&");
                }
        }
        reportUrlRef.current = url;
        setReportUrl(url); 
        getDataEvntMain(url);
  };


useEffect(() => {
    if (!(selectedDuration === 'Custom' && isCustomApplied)) return;
    fetchCustomData();

    const interval = setInterval(() => {
        if (searchBtn) return;
        fetchCustomData();
    }, 30000);

    return () => clearInterval(interval);

}, [
    selectedDuration,
    isCustomApplied,
    eventmainSeverityValueSel,
    eventmainLimitLabelSel,
    fromValue,
    searchBtn
]);

  useEffect(() => {
    if (selectedDuration == null || selectedDuration === '' || isNaN(selectedDuration)) return;
         const newTimestamp = Date.now() - selectedDuration;
         setEventtimeSel(newTimestamp);
     }, [selectedDuration]);

         useEffect(() => {
           if (nodeIpaddress) {
             localStorage.setItem('nodeIpaddress', nodeIpaddress);
           }
         }, [nodeIpaddress]);

    const getDataEvntMain = async (url) => {
        reportUrlRef.current = url;
        setReportUrl(url);
        if(eventipText === ''){
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
           let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        };
            const response = await fetch(url, options);

            if (response.status === 204) {
                setIsLoading(false);
                setCustomStartDate(null);
                setCustomEndDate(null);
                setEventmainData([]);
                setIsError({ status: false, msg: '' });
                return;
            }

             if (typevalueSel === 'syslogd') {
                    const textData = await response.text(); // ✅ only text
                    setEventmainData(textData || "");
                    setIsLoading(false);
                    return;
                }

            const data = await response.json();
            if (!response.ok) {
                throw new Error("API Error");
            }

            let normalized = [];

            if (url.includes('/audit/'&& typevalueSel==='auditlog')) {
                normalized = data.audits || [];
                // setAuditmainData(normalized || []);
            } else if (data.event && typevalueSel==='events') {
                normalized = data.event;
                setEventmainData(normalized || []);
                setCustomStartDate(null);
                setCustomEndDate(null);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }finally {
            // setCustomStartDate(null);
            // setCustomEndDate(null);
            setIsLoading(false);
        }
    };
}

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };
    const isFetching = useRef(false);
    useEffect(() => {
        if(selectedDuration === 'Custom') return;
         const fetchData = async() => {

            if(searchBtn) return;
            if (isFetching.current) return;
            isFetching.current = true;
            const durationMs = parseInt(selectedDuration);
            const timeParam = Date.now() - durationMs;
            
            try {
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
               url=`api/v2/events/list?_s=node.id%3D%3D${nodeDataId};${encodeURIComponent(filterString)};eventCreateTime%3Dgt%3D${timeParam}&limit=${eventmainLimitValueSel}&offset=${fromValue}`;
                break;

            case 'syslogd':
                url = `api/v2/events/syslogs/${nodeDataId}?time=${timeParam}&offset=${fromValue}&limit=${eventmainLimitValueSel}`

                break;
            case 'auditlog':
                 url= `api/v2/audit/list?_s=&limit=${eventmainLimitLabelSel}&offset=${fromValue}&order=desc&orderBy=id`
                break;

            default:
               
                break;
        }
        reportUrlRef.current = url;
        setReportUrl(url)
       await getDataEvntMain(url);
    }finally {
            isFetching.current = false;
        }
    }

     fetchData();

    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);

    }, [typevalueSel,nodeDataId,eventmainLimitLabelSel,fromValue,eventmainSeverityValueSel,eventtimeSel,searchBtn,selectedDuration,eventmainLimitValueSel]);

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
        setSearchBtn(false);
        setEventipText('');
    };


    const handleType = (event) => {
        const value = event.target.value;
        const label = event.target.options[event.target.selectedIndex].label;
        setTypevalueSel(value);
        setTypelabelSel(label);
        setSearchBtn(false);
        setEventipText('');

    }

    const handleMainEventLimitValue = (event) => {
         const value = event.target.value;  
        const label = event.target.options[event.target.selectedIndex].label;

        setEventmainLimitValueSel(value);
        setEventmainLimitLabelSel(label);
        setSearchBtn(false);
        // setEventipText('');
        // setExecutedSearch('');
    }

    const handleMainAuditLimitValue = (event) => {
        let selectedIndex = event.target.selectedIndex;
        setEventauditLimitValueSel(selectedIndex)
        let label = event.target.options[selectedIndex].label;
        setEventauditLimitLabelSel(label)
        setSearchBtn(false);
        setEventipText('');
    }
    

    const handleClearSerch = () => {
        setExecutedSearch('');
        setSearchBtn(false);
        setEventipText('');
      }

      const handleChange = (event) => {
        setLogsMode(event.target.value);
        };

          const handleMainEventTimestamp = (event) => {
            const customvalue = event.target.value;
            if (customvalue === "Custom") {
                setSelectedDuration("Custom");   
                setShowCustomPopup(true);   
                setSearchBtn(false);
                // setEventipText('');     
            } else {
                const value = parseInt(customvalue); 
                setSelectedDuration(value);
                setShowCustomPopup(false);
                setSearchBtn(false);
                // setEventipText('');       
            }
            };

    const handleIncreamentOffset=()=>{
         setPageSize(prev => {
        if (!eventmainData || eventmainData.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(eventmainLimitLabelSel));
        return newPage;
        });
        
    }

    const handleDecrementOffset=()=>{
          if(pageSize > 1){
        setPageSize(prevPageSize => {
        const newPageSize = prevPageSize - 1;
        const fromCal = (parseInt(newPageSize)-1) * parseInt(eventmainLimitLabelSel);
        setFromValue(fromCal);
        return newPageSize;
            });
        }else{
            setPageSize(1);
                        // setFromValue('0');
                }
    }

     const totalPages = Math.ceil(eventmainData.total / pageSize);
            if (pageSize >= totalPages) {
                setIsLastPage(true);
            }




      const getReportData = async (url) => {
         const finalUrl = searchBtn ? searchUrl : url;
    
        try {

            if (!finalUrl) {
            console.error("URL is missing");
            return;
        }   
            let updatedUrl = finalUrl;
                if (finalUrl.includes("events/list?_s") && typevalueSel === "events") {
                updatedUrl = finalUrl.replace("events/list?_s", "events/export?_s");
            }else {
                updatedUrl = finalUrl.includes("?")
                    ? `${finalUrl}&action=download`
                    : `${finalUrl}?action=download`;
            }
            const response = await fetch(updatedUrl, {
                method: "GET",
                headers: {
                    // 'Authorization': `Basic ${token}`
                },
                // body: formData, 
            });
    
             if (!response.ok) {
            const errText = await response.text();
            setIsError(`Error starting download: ${errText}`);
            return;
        }

        const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');

        const filename = response.headers.get('Content-Disposition')?.split('filename=')[1] || 'report.csv';
        a.href = downloadUrl;
        a.download = filename.replace(/"/g, '');
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false);
        }
    };

     useEffect(() => {
    const handleClickOutside = (event) => {
        if (
            showEventPopup &&
            popupRef.current &&
            !popupRef.current.contains(event.target)
        ) {
            setShowEventPopup(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [showEventPopup]);


    const handleEventPopup=(event)=>{
        setShowEventPopup(true);
        setEventpopupData(event)
    }

    const handleEventPopupClose=()=>{
        setShowEventPopup(false);
    }


     const handleRadialIP = async () => {
    if (!eventipText) {
        alert("Please enter a search term");
        return;
    }

        const startTimestamp = customStartDate?.getTime();
        const endTimestamp = customEndDate?.getTime();  

    let start = `api/v2/events/list?_s=node.id%3D%3D${nodeDataId}`;
    let filters = [];

    filters.push("eventDisplay%3D%3DY");

    if (typevalueSel === 'events') {
        filters.push("eventSource!%3Dsyslogd");
    } 

    filters.push(`eventLogMsg%3D%3D*${eventipText}*`);

    if (eventmainSeverityValueSel) {
        filters.push(`eventSeverity==${eventmainSeverityValueSel}`);
    }

    // if (eventtimeSel && selectedDuration !== 'Custom') {
    //     filters.push(`eventCreateTime%3Dgt%3D${eventtimeSel}`);
    // }

    if(selectedDuration === 'Custom' && startTimestamp && endTimestamp){
        filters.push(`eventCreateTime%3Dgt%3D${startTimestamp};eventCreateTime%3Dlt%3D${endTimestamp}`)
    }

    let query = filters.join(";");

    if (eventmainLimitLabelSel !== 'all') {
        query += `&limit=${eventmainLimitLabelSel}`;
    }

    let url = `${start};${query}&offset=0&order=desc&orderBy=id`;

    handleRadialIPa(url);
};


      const handleRadialIPa = async (url) => {
         setSearchUrl(url);
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

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);

                let normalized = [];

            if (url.includes('/audit/') && typevalueSel==='auditlog') {
                normalized = data.audits || [];
                // setAuditmainData(normalized || []);
            } else if (data?.event && typevalueSel==='events') {
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

    const handleCustomPopup=()=>{
        if(selectedDuration !== 'Custom') return;
        setShowCustomPopup(true)
    }

    useEffect(()=>{
        setSearchBtn(false);
        setEventipText('');
        setEventmainLimitValueSel('50');
        setEventmainLimitLabelSel('50');
        setEventtimeSel(Date.now() - 86400000);
        setEventmainSeverityValueSel('');
        setEventmainSeverityLabelSel('All');
        setPageSize(1);
        setFromValue('0');
        setSelectedDuration("86400000");
        setCustomStartDate(null);
        setCustomEndDate(null);
    },[typevalueSel]);


      const handleSearch = (eventipText) => {
        setExecutedSearch(eventipText);
        // setExecutedDate(sysSelectedDate);
        setSearchTrigger(prev => prev + 1); 
    };

    return (
        <>
         <article className="row">
                 <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
            <article className="row border-tlr custom-row">
                <article className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
                    <article style={{ display: typevalueSel === 'events' ? 'block' : 'none'}}>
                        <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>{pageSize}</span></button>
                        <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>   
                         <input type="text" value={eventipText} onChange={(e) => setEventipText(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="Enter Message " id="" className="form-controlevents" />
                         <button type="button" className="createbtn" onClick={() => { handleRadialIP();}} >Search</button>
                        <button type="button" className="createbtn" onClick={handleClearSerch} style={{ marginLeft: '7px', display: executedSearch?.trim() ? 'inline-block' : 'none' }}> Clear Search</button>
                        {/* <button type="button" className="createbtn"  onClick={() => getReportData(reportUrl)} style={{ marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}>  <i class="fa-solid fa-download"></i></button>      */}
                    </article>

                     <article style={{ display: typevalueSel === 'syslogd' ? 'block' : 'none'}}>
                        <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>{pageSize}</span></button>
                        <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>   
                        </article>
                    <article style={{ display: typevalueSel === 'auditlog' ? 'block' : 'none' }}>
                        <button type="button" className="arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>1</span></button>
                        <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>

                        <input type="text" style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="IP Address " id="" className="form-contltranscd-evnt" />
                        <button type="button" className="createbtn">Search</button>
                    </article>

                </article>
                <article className="col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8">
                    <article style={{ float: 'right' }}>
                        <article style={{ display: typevalueSel === 'events' ? 'block' : 'none' }}>
                             <button type="button" className="createbtn"   title="Export"  onClick={() => reportUrlRef.current && getReportData(reportUrlRef.current)}
                        disabled={!reportUrlRef.current}   style={{ marginRight: '7px'}}>  <i class="fa-solid fa-download"></i></button>     
                    
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


                            <select name="name" id="name" value={selectedDuration} onChange={handleMainEventTimestamp} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }} onClick={handleCustomPopup}>
                                 <option value="3600000" label="Last hour">Last hour</option>
                                <option value="28800000" label="8 hours">8 hours</option>
                                <option value="86400000" label="24 hours">24 hours</option>
                                <option value="172800000" label="48 hours">48 hours</option>
                                <option value="Custom" label="Custom">Custom</option>
                            </select>
                            <select className="form-controll1" value={eventmainLimitValueSel} onChange={handleMainEventLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                <option value="25" label="25">25</option>
                                <option value="50" label="50">50</option>
                                <option value="100" label="100">100</option>
                                <option value="500" label="500">500</option>
                            </select>
                        </article>
                          <article style={{ display: typevalueSel === 'syslogd' ? 'block' : 'none',marginTop:"-5px",paddingRight:"18px" }}>              
                        <button type="button" className="createbtn"   title="Export"  onClick={() => reportUrl && getReportData(reportUrl)}
                            disabled={!reportUrl}   style={{ marginRight: '7px'}}>  <i class="fa-solid fa-download"></i></button>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Type:</label>

                            <select name="name" id="name" value={typevalueSel} onChange={handleType} className="form-controll1" style={{ maxWidth: '93px' }}>
                                <option value="events" label="Events">Events</option>
                                <option value="syslogd" label="Syslogs">Syslogs</option>
                                {/* <option value="auditlog" label="Audit Log">Audit Log</option> */}
                            </select>
                            
                                <input type="text" value={eventipText} onChange={(e) => setEventipText(e.target.value)} style={{ marginLeft: '10px', marginRight: '10px' }} name="" placeholder="Enter Message " id="" className="form-controlevents" />
    
                        <article className="trans-datepickerbg" style={{ display: 'inline-block', marginTop: '5px' }}>

                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Time:</label>
                            <select name="name" id="name" value={selectedDuration} onChange={handleMainEventTimestamp} className="form-controll1" style={{ maxWidth: '94px',
                                 minWidth: '94px' }} onClick={handleCustomPopup}>
                                <option value="3600000" label="Last hour">Last hour</option>
                                <option value="28800000" label="8 hours">8 hours</option>
                                <option value="86400000" label="24 hours">24 hours</option>
                                <option value="172800000" label="48 hours">48 hours</option>
                                <option value="Custom" label="Custom">Custom</option>
                            </select>
    
                        </article>
                         <select className="form-controll1" value={eventmainLimitValueSel} onChange={handleMainEventLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                <option value="25" label="25">25</option>
                                <option value="50" label="50">50</option>
                                <option value="100" label="100">100</option>
                                <option value="500" label="500">500</option>
                            </select>
                        <button type="button" className="createbtn" style={{ marginLeft: '10px' }}
                            onClick={() => {
                                handleSearch(eventipText)
                            }
                            }
                        >Search</button>

                         <button type="button" className="createbtn" onClick={handleClearSerch} style={{  marginLeft: '10px', display: executedSearch?.trim() ? 'inline-block' : 'none' }}> Clear Search</button>
                    </article>
                        <article style={{ display: typevalueSel === 'auditlog' ? 'block' : 'none' }}>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Type:</label>

                            <select name="name" id="name" value={typevalueSel} onChange={handleType} className="form-controll1" style={{ maxWidth: '93px' }}>
                                <option value="events" label="Events">Events</option>
                                <option value="syslogd" label="Syslogs">Syslogs</option>
                               
                            </select>
                            <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Time:</label>
                            <article className="trans-datepickerbg" style={{display:'inline-block'}}>
                            <DatePicker
                            selected={date}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            onChange={(date) => setDate(date)} />

                            </article>

                            <select className="form-controll1" value={eventauditLimitValueSel} onChange={handleMainAuditLimitValue}  style={{ width: 'auto' }} aria-invalid="false">
                            <option value="25" label="25">25</option>
                                <option value="50" label="50">50</option>
                                <option value="100" label="100">100</option>
                                <option value="500" label="500">500</option>
                            </select>
                        </article>

                    </article>
                </article>
            </article>
            {typevalueSel === 'events' && (
            <article className="eventmaintable">
                <article className="row">
                    <table className="col-12">
                        <thead className="stationeventsthtb">
                            <tr>
                                <th>Time</th>
                                <th>Severity</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody className="stationeventstbdtb">
                            {!isLoading && !isError.status && eventmainData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData.map((event) => (
                                    <tr key={event.id} onClick={()=>handleEventPopup(event)}>
                                        <td><i className={getCategoryClass(event.severity)}></i>{formatTime(event.time)}</td>
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
            </article>)}
             
                    {typevalueSel === 'syslogd' && (
                                    <article className="eventmaintable">
                                        {typeof eventmainData === "string" &&
                                        eventmainData.trim() !== "" &&
                                        eventmainData.split('\n').filter(line => line.trim() !== '').length > 0 ? (
                                        
                                        <ul className="log-list">
                                            {eventmainData
                                            .split('\n')
                                            .filter(line => line.trim() !== '')
                                            .map((line, index) => (
                                                <li key={index}>{line}</li>
                                            ))}
                                        </ul>

                                        ) : (
                                        <p className="nologpara">No logs available</p>
                                        )}
                                    </article>
                                    )}
              { typevalueSel === 'auditlogs' && (
            <article className="eventmaintable">
                <article className="row">
                    <table className="col-12">
                        <thead className="stationeventsthtb">
                            <tr>
                                <th>Time</th>
                                <th>Severity</th>
                                <th>Message</th>
                            </tr>
                        </thead>
                        <tbody className="stationeventstbdtb">
                            {Array.isArray(eventmainData) && eventmainData.length > 0 ? (
                                eventmainData.map((event) => (
                                    <tr key={event.id} onClick={()=>handleEventPopup(event)}>
                                        <td>{formatTime(event.time)}</td>
                                        <td>{event.severity}</td>
                                         <td>{event.logMessage}</td>
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
            </article>
            </article>
                        
            
             {showEventPopup  && <article className="eventpopupcont">
                    <article className="eventboxstyle" ref={popupRef}>
                        {eventpopupData &&(
                            <article>
                                <article className="evntdetailtitle">
                                    Event details
                                </article>
                                <article style={{fontSize:'15px',padding:'15px 14px 0 14px'}}>
                                    <fieldset className="ip-fieldset">
                                        {/* <legend>{eventpopupData.nodeLabel}</legend> */}
                                    <h4>{eventpopupData.nodeLabel}</h4>
                                    <article className="col-12 row">
                                <div className="col-3">
                                    <label className="eventpopuplabel">Event Id:</label>
                                </div>
                                <div className="col-9 eventpopuplabel">
                                    {eventpopupData.id}
                                </div>
                                </article>

                                <article className="col-12 row">
                                <div className="col-3">
                                    <label className="eventpopuplabel">Event Time:</label>
                                </div>
                                <div className="col-9 eventpopuplabel">
                                    {new Date(eventpopupData.createTime).toLocaleString()}
                                </div>
                                </article>

                                <article className="col-12 row">
                                <div className="col-3">
                                    <label className="eventpopuplabel">Severity:</label>
                                </div>
                                <div className="col-9 eventpopuplabel">
                                    {eventpopupData.severity}
                                </div>
                                </article>
                                <p className="eventpopupdescrpt">{eventpopupData.description}</p>
                                </fieldset>
                                </article>
                                <article style={{textAlign:'center',marginBottom:'12px'}}>
                                    <button className="createbtn" type="button" onClick={handleEventPopupClose}>Close</button>
                                </article>
                            </article>
                        ) }
                    </article>
                </article>}

                                    {showCustomPopup && (
                                        <article className="confirmdeletepopup">
                                            <article className="">
                                <article className="custom-popup popupStyledate">
                                    <article className="row">
                                        <article className="col-11">
                                <h4 className="customheadtitle">Select Custom Range</h4>
                                        </article>
                
                                        <article className="col-1">
                                               <span><i className="fa fa-close noticlose" onClick={handleClosepopup} role="button"></i></span>
                                        </article>
                                        
                                </article>
                              <div className="row">
                                <div className="col-6" style={{ marginBottom: '8px' }}>
                                    <label htmlFor="startDate" className="settinglabelsub">
                                    Start:
                                    </label>
                                    <DatePicker
                                    id="startDate"
                                    selected={customStartDate}
                                    onChange={(date) => setCustomStartDate(date)}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    placeholderText="Select Start Date"
                                    className="myDatepickercl"
                                    />
                                </div>
                
                                <div className="col-6" style={{ marginBottom: '8px' }}>
                                    <label htmlFor="endDate" className="settinglabelsub">
                                    End:
                                    </label>
                                    <DatePicker
                                    id="endDate"
                                    selected={customEndDate}
                                    onChange={(date) => setCustomEndDate(date)}
                                    minDate={customStartDate}
                                    showTimeSelect
                                    timeFormat="HH:mm"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd HH:mm"
                                    placeholderText="Select End Date"
                                    className="myDatepickercl"
                                    />
                                </div>
                                </div>
                                <article className="f-r">
                                <button className="createbtn" onClick={handleCustomSubmit}>Submit</button>
                                </article>
                                </article>
                                </article>
                                </article>
                            )}
                             {showCustomDateAlertPopup && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Please select both start and end dates</h1>
                                <article className="f-r">
                                      <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() =>{ setShowCustomDateAlertPopup(false);setSelectedDuration("86400000");}}
                                        >
                                        OK
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}
                            {showCustomDateLimitAlertPopup && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">End date must be greater than start date</h1>
                                <article className="f-r">
                                      <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowCustomDateLimitAlertPopup(false);setSelectedDuration("86400000");}}
                                        >
                                        OK
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}
        </>
    )
}


export default SnEventTab;