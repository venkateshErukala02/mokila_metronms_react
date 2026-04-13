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
    const [timestampFrom,setTimestampFrom] = useState(Date.now());
    const [timestampTo,setTimestampTo] = useState(Date.now());
    const [timestampStart,setTimestampStart] = useState(Date.now());
    const [timestampEnd,setTimestampEnd] = useState(Date.now());
    const [selectedLogVal,setSelectedLogVal] = useState('train')
    const [selectedPosition,setSelectedPosition] = useState('select');
    const [lineNameSel,setLineNameSel] = useState('-1');
    const [stationNameSel,setStationNameSel] = useState('-1');
    const [stationData,setStationData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });

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


     const handleSelectedLog = (event) => {
        setSelectedLogVal(event.target.value);
    }


      const handleSelectedPostionSta=(event)=>{
        setSelectedPosition(event.target.value);
    }


    const handleSelectLine=(e)=>{
                setLineNameSel(e.target.value);
            }

              const handleSelectStation=(e)=>{
              setStationNameSel(e.target.value);
            }

              const getSelStationData = async (url) => {
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
                            <input type="text"
                             value={cabNumber}
                                required
                                onChange={(e) => setCabNumber(e.target.value)}
                                name="" placeholder="Enter Cab Number" id="" className="settinglabelsubinp" />
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
                                    <button type="button" className="createbtn" onClick={ExportCanData}>Export</button>
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
                                    <button type="button" className="createbtn" onClick="">Export</button>
                                </article>
                                </article>
                                </article>
                        }
                        </article>
                    </article>
                    </article>
                </article>
            </article>
        </>

    )
}

export default EventPg;