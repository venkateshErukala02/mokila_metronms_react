import { useEffect, useRef, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import DatePicker from "react-datepicker";


const ConfigChangeSub = ({ handleSubContainer, refreshLineData, mode, line }) => {

    const isEditMode = mode === 'edit';

    const [lineName, setLineName] = useState('');
    const [configParamInput,setConfigParamInput] = useState('');
    const [selectedLabelItems,setSelectedLabelItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [isImmediate, setIsImmediate] = useState(true)
    const [searchValue, setSearchValue] = useState('');
    const [searchData, setSearchData] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const dropdownRef = useRef(null);
    const [deviceTypeRequired,setDeviceTypeRequired] = useState(true);
    const [deviceType,setDeviceType] = useState('');
    const [uciData,setUciData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchConfigParameter, setSearchConfigParameter] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [timestamp, setTimestamp] = useState(Date.now());

    const handleProfileContclose = () => {
        handleSubContainer(true)
    }


    useEffect(() => {
        if (isEditMode && line) {
            setLineName(line.name || '');
        } else {
            setLineName('');
        }
    }, [mode, line]);

    const handleSearch = (searchText) => {
        setSearchValue(searchText);
    }


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
                    const response = await fetch(`api/v2/nodes?_s=assetRecord.serialNumber==${searchValue},label==${searchValue},sysName==${searchValue}&limit=25&offset=0&order=asc&orderBy=id`, {
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

           const getUcilistData = async (url) => {
            setLoading(true);
            setError({ status: false, msg: "" });
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
                    setLoading(false);
                    setUciData(data);
                    setError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setLoading(false);
                setError({ status: true, msg: error.message });
            }
        };

         useEffect(() => {
                const fetchUcilist = async()=>{
                    const url= 'api/v2/profiles/ucilist'
                   await getUcilistData(url);
                 
                }
                fetchUcilist();
            
                }, []);

                   
            const filteredItems = uciData?.filter(item => {
                if (deviceType && item.type !== deviceType) {
                    return false;
                }

                if (searchConfigParameter === "") return true;

                return item.dName.toLowerCase().includes(searchConfigParameter.toLowerCase());
            }) || [];


            const handleSelect = (value) => {
                setSelectedValue(value.dName);
                setIsOpen(false);
            };

            const handleAdd = () => {
                if (!configParamInput) return; 

                const newItem = {
                // id: Date.now(), 
                key: selectedValue,
                value: configParamInput || '',
                };

                setSelectedLabelItems([...selectedLabelItems, newItem]);

                setSelectedValue('')
                setConfigParamInput('');
            };
            

              const handleApplyConfigChange = async () => {
                const numbNodes = addedItems.map(item => Number(item));
                const requestBody = {
                    deviceType : deviceType,
                    nodes :numbNodes,
                    params : selectedLabelItems
            }
            const schedule = isImmediate === true ? 'im' :'sch';
            let url= `api/v2/bulk/pushconfig/${schedule}/${timestamp}`;
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
                    alert('Firmware upload started successfully')
                    handleProfileContclose();
                    setDeviceType('');
                    setSearchValue('');
                    setSearchBtn(false);
                    setSearchData([]);
                    setSelectedItems('');
                
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

         const handleDateChange = (date) => {
            setSelectedDate(date);
            const timestamp = date.getTime();  
            setTimestamp(timestamp);        
        };

    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Bulk Config Change</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <article style={{  paddingTop: '4px', paddingBottom: '5px' }}>
                                <article>
                                    <label className="settinglabelsub">Device Type</label>
                            <select className="vlaninput" value={deviceType} onChange={(e)=> setDeviceType(e.target.value)}>
                                <option value="" disabled>Select</option>
                                <option value="sta">Train Radio</option>
                                <option value="encoder">Encoder</option>
                                <option value="transcoder">Transcoder</option>
                                <option value="AP">Station Nodes</option>
                                <option value="obc">OBC</option>
                                <option value="CAM">Cameras</option>
                            </select>
                           {deviceTypeRequired && <p className="requiretitle">* Required Device Type</p> }
                           </article>
                           <article style={{display:'flex' ,position:'relative'}}>
                                <label className="settinglabelsub">Select Config Parameter</label>
                                <div>

                                <button
                                    className="form-controlfirm"
                                    style={{ width: '50px', marginTop: '4px' }}
                                    onClick={() => setIsOpen(!isOpen)}
                                    disabled={!deviceType}
                                >
                                    Select
                                </button>

                                {isOpen && (
                                    <article className="configselecttart">
                                    <ul className="ucilist">
                                    <li>
                                        <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchConfigParameter}
                                        onChange={(e) => setSearchConfigParameter(e.target.value)}
                                        />
                                    </li>

                                    {filteredItems.map((item, index) => (
                                        <li
                                        key={index}
                                        onClick={() => handleSelect(item)}
                                        style={{ cursor: "pointer" }}
                                        >
                                        {item.dName}
                                        </li>
                            ))}

                                    {filteredItems.length === 0 && <li>No results</li>}
                                    </ul>
                                    </article>
                                )}
                                </div>
                                </article>
                            </article>
                            <label className="settinglabelsub">{selectedValue || ''}</label>

                            <input
                                type="text"
                                value={configParamInput}
                                onChange={(e) => setConfigParamInput(e.target.value)}
                                className="configchangelabelsubinp"
                            /> 
                            <button type="button" className="createbtn" style={{marginLeft:'28px'}}  onClick={handleAdd}>Add</button>
                             <article className="row border-allsd" style={{ height: '12vh', overflow: 'hidden',margin:"18px 0" }}>
                                <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead className="configthtb">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th>Name</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                </table>

                                <div style={{ height: 'calc(12vh - 40px)', overflowY: 'auto' }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                            {Array.isArray(selectedLabelItems) && selectedLabelItems.length > 0 ? (
                                                selectedLabelItems.map((event) => (
                                                    <tr key={event.id}>
                                                        <td style={{ width: '150px' }}>{event.key}</td>
                                                        <td style={{ width: '150px' }}>{event.value}</td>
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
                            <article style={{position:'relative',zIndex:'0'}}>
                            <hr class=""></hr>
                            <p className="firmwarenote">Note:</p>
                            <article>
                                <h4 className="scheduletitle">Schedule</h4>
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Immediate: </label>
                                <input className="incl2" type="checkbox"
                                    checked={isImmediate}
                                    onChange={(e) => setIsImmediate(e.target.checked)}
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
                            </article>}
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
                            </article>
                            <article className="row border-allsd" style={{ height: '16vh', overflow: 'hidden',position:'relative',zIndex:'-1' }}>
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
                                <button type="button" className="cancelbtn">Cancel</button>
                                <button type="button" className="creatsetingbtn" onClick={handleApplyConfigChange} disabled={selectedItems.length === 0}>Apply</button>
                            </center>
                        </form>
                    </article>
                </article>
            </article>

        </>
    )
}

export default ConfigChangeSub;