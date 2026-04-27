import React, { useEffect, useState } from "react";
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
    const [selectedStartDate,setSelectedStartDate] = useState(null);
    const [selectedEndDate,setSelectedEndDate] = useState(null);
    const [timestampFrom,setTimestampFrom] = useState(null);
    const [timestampTo,setTimestampTo] = useState(null);
    const [timestampStart,setTimestampStart] = useState(null);
    const [timestampEnd,setTimestampEnd] = useState(null);
    const [selectedLogVal,setSelectedLogVal] = useState('train')
    const [selectedPosition,setSelectedPosition] = useState('select');
    const [lineNameSel,setLineNameSel] = useState('-1');
    const [stationNameSel,setStationNameSel] = useState('-1');
    const [stationData,setStationData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [cabNumberIpsData,setCabNumberIpsData] = useState([]);
    const [stationIpsData,setStationIpsData] = useState([]);
    const [showWarningPopup,setShowWarningPopup] = useState(false);
    const [showCustomDateAlertPopup,setShowCustomDateAlertPopup] = useState(false);
    const [showCustomDateLimitAlertPopup,setShowCustomDateLimitAlertPopup] = useState(false);
      const ALL_LINES = [
          { key: 'line1-sec1', label: 'Line1-Section1' },
          { key: 'line1-sec2', label: 'Line1-Section2' },
          { key: 'line4-sec1', label: 'Line4' },
            ]

     useEffect(()=>{
    if(lineNameSel === '-1') return;
          if(lineNameSel && lineNameSel !== ''){
              const url=`api/v2/treeview/regions/${lineNameSel}/stations`;
  
              getSelStationData(url);
          }
         
      },[lineNameSel])

       useEffect(()=>{
            if(selectedPosition ==='select') return;
                if(selectedPosition && selectedPosition !== ''){
                const url=`api/v2/treeview/stationfilter/${stationNameSel}?position=${selectedPosition}`;
                handleStationIpsData(url);
                }
      },[selectedPosition]);


           const handleStationIpsData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
          

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setStationIpsData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

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


    const handleStartDateChange = (date) => {
            setSelectedStartDate(date);
            const timestamp = date.getTime();  
            setTimestampStart(timestamp);        
        };

    const handleEndDateChange = (date) => {
        setSelectedEndDate(date);
        const timestamp = date.getTime();  
        setTimestampEnd(timestamp);        
    };



    const ExportCabData =  async(e) => {
        if (e) e.preventDefault(); 
        if(cabNumber.length !== 4){
            setShowWarningPopup(true)
            return;
        }
        const tId = cabNumber.substring(0, 3); 
        const cId = cabNumber.substring(3);

        if (!timestampFrom || !timestampTo) {
           setShowCustomDateAlertPopup(true);
            return;
        }

        if (new Date(timestampFrom) >= new Date(timestampTo)) {
           setShowCustomDateLimitAlertPopup(true)
            return;
        }
            const url =`api/v2/nodes/cabreport/${tId}/${cId}/${timestampFrom}/${timestampTo}`;

             try {
        const response = await fetch(url, {
            method: 'GET', 
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/zip'
            // },
        });

        if (response.ok) {
             const fileBlob = await response.blob();  // Get the file as a Blob (binary data)

    // Create a URL for the Blob
    const fileURL = URL.createObjectURL(fileBlob);

    // Create an invisible <a> element to trigger the download
    const a = document.createElement("a");
    a.href = fileURL;
    // a.download = "5101.zip";  // Set the filename for the downloaded file
    document.body.appendChild(a);
    a.click();  // Trigger the download
    document.body.removeChild(a);  // Clean up the element

    // Optionally reset your state here
    setCabNumber('');
    setSelectedFromDate(null);
    setSelectedToDate(null);
    setTimestampFrom(null);
    setTimestampTo(null);
        } else {
            console.error('Error fetching data:', response.statusText);
        }
    } catch (error) {
        console.error('Error making the request:', error);
    }
    };

    const nodeIds = stationIpsData.map(item => item.nodeId);
    const ExportStationData =  async(e) => {
        if (e) e.preventDefault(); 
        setIsLoading(true);
        // if(cabNumber.length !== 4){
        //     setShowWarningPopup(true)
        //     return;
        // }
       
        if (!timestampStart || !timestampEnd) {
           setShowCustomDateAlertPopup(true);
           setIsLoading(false); 
            return;
        }

        if (new Date(timestampStart) >= new Date(timestampEnd)) {
           setShowCustomDateLimitAlertPopup(true);
           setIsLoading(false); 
            return;
        }
            const url =`api/v2/events/zip/stationdevicelog?from=${timestampStart}&to=${timestampEnd}`;
              try {
           
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/zip'
                },
                body: JSON.stringify(nodeIds),
            });

            if (!response.ok) {
                        throw new Error('Error starting discovery');
                    }

                    const blob = await response.blob();

        const downloadUrl = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = downloadUrl;

        a.download = `station_device_logs_${Date.now()}.zip`;

        document.body.appendChild(a);
        a.click();

        a.remove();
        window.URL.revokeObjectURL(downloadUrl);
        setLineNameSel('-1');
        setStationNameSel('-1');
        setSelectedPosition("select");
        setStationIpsData([]);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setTimestampStart(null);
        setTimestampEnd(null);

        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }
    };



    useEffect(()=>{
        setCabNumber('');
        setSelectedToDate(null);
        setTimestampFrom(null);
        setTimestampTo(null);
        setSelectedPosition('select');
        setLineNameSel('-1');
        setStationNameSel('-1');
        setStationData([]);
        setCabNumberIpsData([]);
        setStationIpsData([]);
        setTimestampEnd(null);
        setSelectedEndDate(null);
        setSelectedFromDate(null);
        setSelectedStartDate(null);
        
    },[selectedLogVal])


     const handleSelectedLog = (event) => {
        setSelectedLogVal(event.target.value);
    }


      const handleSelectedPostionSta=(event)=>{
        setSelectedPosition(event.target.value);
        setStationIpsData([]);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setTimestampStart(null);
        setTimestampEnd(null);
    }


    const handleSelectLine=(e)=>{
        setLineNameSel(e.target.value);
        setStationNameSel('-1');
        setSelectedPosition("select");
        setStationIpsData([]);
        setSelectedStartDate(null);
        setSelectedEndDate(null);
        setTimestampStart(null);
        setTimestampEnd(null);
    }

              const handleSelectStation=(e)=>{
                setStationNameSel(e.target.value);
                setSelectedPosition("select");
                setStationIpsData([]);
                setSelectedStartDate(null);
                setSelectedEndDate(null);
                setTimestampStart(null);
                setTimestampEnd(null);
            }

              const getSelStationData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
          

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setStationData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

     const handleCabNumberIp = async () => {
        if (!cabNumber) {
            setShowWarningPopup(true);
            return;
        }
        setIsLoading(true);
        setIsError({ status: false, msg: "" });

        try {
            const response = await fetch(`api/v2/treeview/train?trainId=${cabNumber}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                setIsLoading(false);
                setCabNumberIpsData([]);
                return;
            }

            const data = await response.json(); // Only parse once

            if (response.ok) {
                setIsLoading(false);
                setCabNumberIpsData(data || []);

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
                        <h1 className="evntsheadcl border-allsd">Export Logs</h1>

                            <article style={{padding:'7px'}}>
                                    <label htmlFor="name"  className="selectlbl" style={{ display: 'inline-block' }}>Select:</label>
                            <select name="name" id="name" value={selectedLogVal} onChange={handleSelectedLog} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    <option value="train">Train</option>
                                    <option value="station">Station</option>
                            </select>
                            </article>
                      {selectedLogVal === 'train' && <article style={{padding:"12px"}}>
                            <label className="settinglabelsub">Cab Number</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px',marginBottom:'12px' }}>
                                <div className="input-wrapper">
                            <input type="text"
                             value={cabNumber}
                                required
                                onChange={(e) => setCabNumber(e.target.value)}
                                name="" placeholder="Enter Cab Number" id="" className="settinglabelsubinp" />
                                {cabNumber && (
                                    <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={() =>{ setCabNumber("");
                                        setSelectedFromDate(null);
                                        setSelectedToDate(null);
                                        setTimestampFrom(null);
                                        setTimestampTo(null);
                                        if (Object.keys(cabNumberIpsData).length > 0) {
                                            setCabNumberIpsData({});
                                        }
                                    }}
                                    >
                                    ✖
                                    </button>
                                )}
                                </div>
                                <button type="button" className="createbtn" onClick={() => {
                                    handleCabNumberIp();}}>Fetch</button>
                                </div>
                                         <article className="row border-allsd" style={{ height: '16vh', overflow: 'hidden',position:'relative' }}>
                                <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead className="configthtb">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th>System Name</th>
                                            <th>IP Address</th>
                                            {/* <th>Station</th> */}
                                        </tr>
                                    </thead>
                                </table>

                                <div style={{ height: 'calc(16vh - 40px)', overflowY: 'auto',width: '100%' }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                             {cabNumberIpsData && Object.keys(cabNumberIpsData).length > 0 ? (
                                                Object.entries(cabNumberIpsData).map(([key, value], index) => (
                                                <tr key={index}>
                                                    <td style={{ width: '114px',paddingLeft:'19px' }}>{key}</td>
                                                    <td style={{ width: '91px' }}>{value}</td>
                                                </tr>
                                                ))  
                                            ) : (
                                                // <tr>
                                                //     <td colSpan="4">No items found</td>
                                                // </tr>
                                                ''
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </article>


                                <article className="labelaligncl">
                            <DatePicker
                            selected={selectedFromDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="Start Date"
                            onChange={handleFromDateChange}
                            className="myDatepickercl" />
                            </article>
                            <article className="labelaligncl">
                           <DatePicker
                            selected={selectedToDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="End Date"
                            onChange={handleToDateChange}
                            className="myDatepickercl" />
                            </article>
                                <article className="f-r labelaligncl">
                                    <button type="button" className="createbtn" onClick={ExportCabData}>Export</button>
                                </article>
                        </article>}
                       {selectedLogVal === 'station' && 
                        <article style={{clear:"both"}}>
                             <article style={{padding:"0px 12px 12px"}}>
                            <article>
                                <label htmlFor="name" className="vlanlabel">Select Line</label>
                                    <article>
                                        <select  name="name" id="name" className="selectedlogdropdown" defaultValue={-1} value={lineNameSel} onChange={handleSelectLine}> 
                                            <option value="-1">Select</option>
                                            {ALL_LINES && ALL_LINES.map((item,index)=>(
                                                <option value={item.key} key={index}>{item.label}</option>
                                            ))}
                                        </select>
                                        </article>
                            </article>
                                <article>
                                <label htmlFor="name" className="vlanlabel">Select Station</label>
                                    <article>
                                        <select  name="name" id="name" className="selectedlogdropdown" defaultValue={-1} value={stationNameSel} onChange={handleSelectStation}> 
                                           <option value="-1">Select</option>
                                            {stationData && stationData.map((item,index)=>(
                                                <option value={item.value} key={index}>{item.display}</option>
                                            ))}
                                        </select>
                                        </article>
                            </article>
                                <article>
                                <label htmlFor="name" className="vlanlabel">Select Position</label>
                                    <article>
                                        <select  name="name" id="name" className="selectedlogdropdown" defaultValue={-1} value={selectedPosition} onChange={handleSelectedPostionSta} > 
                                            <option value="select">Select</option>
                                            <option value="SBSE">SBSE</option>
                                            <option value="SBNE">SBNE</option>
                                            <option value="NBSE">NBSE</option>
                                            <option value="NBNE">NBNE</option>
                                        </select>
                                        </article>
                            </article>

                             <article className="row border-allsd" style={{ height: '16vh', overflow: 'hidden',position:'relative',marginTop:'8px'}}>
                                <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead className="configthtb">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th>Type</th>
                                            <th>IP Address</th>
                                            {/* <th>Station</th> */}
                                        </tr>
                                    </thead>
                                </table>

                                <div style={{ height: 'calc(16vh - 40px)', overflowY: 'auto',width: '100%' }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                            {Array.isArray(stationIpsData) && stationIpsData.length > 0 ? (
                                                stationIpsData.map((event) => (
                                                    <tr key={event.id}>
                                                        <td style={{ width: '114px',paddingLeft:'12px' }}>{event.type}</td>
                                                        <td style={{ width: '91px' }}>{event.ipAddress}</td>
                                                    </tr>
                                                )) 
                                            ) : (
                                                // <tr>
                                                //     <td colSpan="4">No items found</td>
                                                // </tr>
                                                ''
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </article>
                            
                       
                        <article className="labelaligncl">
                            <DatePicker
                            selected={selectedStartDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="Start Date"
                            onChange={handleStartDateChange}
                            className="myDatepickercl" 
                            />
                            </article>
                            <article className="labelaligncl">
                           <DatePicker
                            selected={selectedEndDate}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                            placeholderText="End Date"
                            onChange={handleEndDateChange}
                            className="myDatepickercl" 
                            />
                        </article>
                        <article className="f-r labelaligncl">
                                    <button type="button" disabled={isLoading} className="createbtn" onClick={ExportStationData}>
                                         {isLoading ? (
     
                                        "Exporting..."
                                    ) : (
                                    "Export"
                                    )}
                                        </button>
                                </article>
                                </article>
                                </article>
                        }
                        </article>
                    </article>
                    </article>
                </article>
            </article>
             {showWarningPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Warning</h1>
                                    <p className="confirmtextsucess"> Cab number is incorrect. Please enter a valid cab number.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowWarningPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
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
                                        onClick={() =>{ setShowCustomDateAlertPopup(false)}}
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
                                        onClick={() => {setShowCustomDateLimitAlertPopup(false)}}
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

export default EventPg;