import { useEffect, useRef, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import DatePicker from "react-datepicker";


const FirmwareManagerApply = ({ handleSubContainer, refreshLineData, mode, version }) => {

    const isEditMode = mode === 'edit';

    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [setInvenData, invenData] = useState('');
    const [isImmediate,setIsImmediate] = useState(true);
    const [deviceType,setDeviceType] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [searchData, setSearchData] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [timestamp,setTimestamp] = useState('');
    const dropdownRef = useRef(null);
    
    const handleProfileContclose = () => {
        handleSubContainer(fileName);
        setSelectedFile(null);
        setDeviceType('');
        setFileName('');
        setAddedItems([]);
        setSelectedItems([]);
        setSearchData([]);
        setSearchValue('');
        setSearchBtn(false);
        setTimestamp('');
        setSelectedDate(null);
        setIsImmediate(true);
        
    }

    const handleAddLine = async () => {
        if (!fileName) {
            alert("Please fill the field.");
            return;
        }
        const requestBody = isEditMode ? {
            id: fileName.id,
            name: fileName,
            type: 0

        } : {
            name: fileName,
            type: 0
        };

        const method = isEditMode ? 'PUT' : "POST";
        const url = isEditMode ? `api/v2/regions/${fileName.id}` : 'api/v2/regions'
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`);
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                alert('Firmware started successfully');
                handleProfileContclose();
                if (refreshLineData) refreshLineData();
                setSelectedFile(null);
                setFileName('');
                setDeviceType('');
                setAddedItems([]);
                setSelectedItems([]);
                setSearchData([]);
                setSearchValue('');
                setSearchBtn(false);
                setTimestamp('');
                setSelectedDate(null);
                setIsImmediate(true);
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); 
        }

    }

    useEffect(() => {
        if (isEditMode && version) {
            setFileName(version.fileName || '');
            setDeviceType(version.deviceType || '');
        } else {
            setFileName('');
        }
    }, [mode, version]);


       const handleSearchClick = (e) => {
                e.preventDefault();
                if (!searchValue.trim()) {
                    alert("Please enter a search term");
        
                } else {
                    setSearchBtn(true);
                    setSearchTrigger(prev => prev + 1);
                }
            }
        
            useEffect(() => {
        
                const handleSearchData = async (searchValue) => {
        
                        try {
                            const response = await fetch(`api/v2/nodes?_s=assetRecord.serialNumber==${searchValue},label==${searchValue},sysName==${searchValue}&ar=${deviceType}&limit=25&offset=0&order=asc&orderBy=id`, {
                                method: "GET",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                            });
                            const data = await response.json();
        
                            if (response.ok) {
                                setLoading(false);
                                setSearchData(data.node || []);
                                setError({ status: false, msg: "" });
                                setError({ status: false, msg: "" });
                            } else {
                                throw new Error("data not found");
                            }
        
                        } catch (error) {
                            setLoading(false);
                            setError({ status: true, msg: error.message });
                        }
        
                }
        
                if (searchValue.trim()) {
                    handleSearchData(searchValue);
                }
            }, [searchTrigger])
        
        
            const handleAddToTable = (event) => {
        
                if (!addedItems.includes(event.id)) {
                    setAddedItems([...addedItems, event.id])
                }
        
                if (!selectedItems.some(item => item.id === event.id)) {
                    setSelectedItems([...selectedItems, event])
                }
            };
        
            useEffect(() => {
                function handleClickOutside(event) {
                    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                        setSearchData([]);
                    }
                }
        
                document.addEventListener('mousedown', handleClickOutside);
        
                return () => {
                    document.removeEventListener('mousedown', handleClickOutside);
                }
        
            }, []);
        
             const handleClearSerch = () => {
                setSearchBtn(false);
                setSearchValue('');
              }
        
    const handleDateChange=(date)=>{
        setSelectedDate(date);
        const time = date.getTime();
        setTimestamp(time);

    }
    

     const handleApplyFirmware = async () => {
        const numbNodes = addedItems.map(item => Number(item));
        const requestBody = {
            nodes :numbNodes,
            time : timestamp,
            schedule: isImmediate === true ? 'im' :'sch',
            firmware:  version.actualName,
            type: version.deviceType,
    }

    let url= `api/v2/bulk/applyFirmware`;
    try {
        const username = 'admin';
        const password = 'admin';
        const token = btoa(`${username}:${password}`)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Basic ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (response.ok) {
            // setSuccess('Discovery started successfully');
            alert('Discovery started successfully')
            handleProfileContclose();
            setSelectedFile(null);
            setDeviceType('');
            setFileName('');
            setSearchValue('');
            setSearchData([]);
            setSearchBtn(false);
            setDeviceType('');
            setSelectedItems([]);
            setDeviceType('');
            setAddedItems([]);   
            setIsImmediate(true);       
        } else {
            setError('Error starting discovery');
        }
    } catch (error) {
        console.error('Error:', error);
        setError('An error occurred while contacting the server.');
    } finally {
        setLoading(false); 
    }

}



    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Apply Firmware</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <article style={{ paddingTop: '4px', paddingBottom: '10px' }}>
                                <article>
                                <label className="settinglabelsub">Device Type</label>
                            <select className="vlaninput" value={deviceType} onChange={(e)=> setDeviceType(e.target.value)}>
                                <option value="" disabled>Select</option>
                                {/* <option value="sta">Train Radio</option> */}
                                <option value="encoder">Encoder</option>
                                {/* <option value="transcoder">Transcoder</option> */}
                                <option value="AP">Station Nodes</option>
                                <option value="obc">OBC</option>
                                {/* <option value="CAM">Cameras</option> */}
                            </select>
                            </article>
                            <article style={{paddingTop:"10px"}}>
                                <label className="settinglabelsub">Firmware</label>
                            <input type="text"
                                value={fileName}
                                required
                                onChange={(e) => setFileName(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                </article>
                            <hr class=""></hr>
                            <article>
                                <h4 className="scheduletitle">Schedule</h4>
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Immediate: </label>
                                <input className="incl2" type="checkbox" 
                                checked={isImmediate}
                                onChange={(e)=> setIsImmediate(e.target.checked)}
                                />
                            </article>
                           {!isImmediate && <article>
                                <label for="" className="traplabel"> Start Date:</label>
                                <article className="checkbok">
                                    <article className="trans-datepickerbg" style={{ display: 'inline-block' }}>
                                        <DatePicker
                                            selected={selectedDate}
                                            showTimeSelect
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            onChange={handleDateChange}
                                            className="myDatepickercl" />
                                    </article>
                                </article>
                            </article> }
                                <article>
                                 <article style={{ position: 'relative' }}>
                                <ul className="regionlist">
                                    <li>
                                        <label for="" className="traplabel">Search Device</label>
                                        <article className="checkbok" style={{ display: 'flex' }}>
                                            <input
                                                type="text"
                                                placeholder="Search IP Address"
                                                value={searchValue}
                                                onChange={(e) => setSearchValue(e.target.value)}
                                                className="searchIpinput"
                                            />
                                            <button type="button" className="createbtn" onClick={handleSearchClick}>Search</button>
                                            <button className="clearfix createbtn" type="button" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

                                        </article>
                                    </li>
                                </ul>
                                {searchBtn && searchData.length === 0 && <article ref={dropdownRef} style={{ maxHeight: '5vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }} className="scheduletitle">No Data</article>}
                                {searchData.length > 0 && <article ref={dropdownRef} style={{ maxHeight: '20vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }}>
                                    <ul className="searchlist">
                                        {searchData && searchData.map((event) => {
                                            const isAdded = addedItems.includes(event.id);
                                            return (
                                                <li key={event.id}>
                                                    <article style={{ justifyContent: "space-between", display: 'flex', width: "100%" }}>
                                                        <h5 className="scheduletitle">{event.primaryIP}</h5>
                                                        <button className="addbtn" onClick={() => handleAddToTable(event)}
                                                            disabled={isAdded}
                                                            style={{
                                                                backgroundColor: isAdded ? '#ccc' : '#007bff',
                                                                color: isAdded ? '#666' : 'white',
                                                                cursor: isAdded ? 'not-allowed' : 'pointer'
                                                            }}
                                                        >{isAdded ? 'Added' : 'Add'}</button>
                                                    </article>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </article>}
                            </article>
                            <article className="row border-allsd" style={{ height: '16vh', overflow: 'hidden' }}>
                                <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead className="configthtb">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th>System Name</th>
                                            <th>IP Address</th>
                                            <th>Station</th>
                                        </tr>
                                    </thead>
                                </table>

                                <div style={{ height: 'calc(16vh - 40px)', overflowY: 'auto' }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                            {Array.isArray(selectedItems) && selectedItems.length > 0 ? (
                                                selectedItems.map((event) => (
                                                    <tr key={event.id}>
                                                        <td style={{ width: '150px' }}>{event.sysName}</td>
                                                        <td style={{ width: '150px' }}>{event.primaryIP}</td>
                                                        <td style={{ width: '100px' }}>{event.facility}</td>
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

                            <center style={{ marginTop: '16px', marginBottom: '16px' }}>
                                <button type="button" className="cancelbtn" onClick={handleProfileContclose}>Cancel</button>
                                <button type="button" className="creatsetingbtn" onClick={handleApplyFirmware}>Apply</button>
                            </center>
                                </article>
                        </form>
                    </article>
                </article>
            </article>

        </>
    )
}

export default FirmwareManagerApply;