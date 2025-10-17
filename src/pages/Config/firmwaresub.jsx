import React, { useEffect, useRef, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import DatePicker from "react-datepicker";


const FirmwareContainerSub = ({ handleSubContainer, refreshLineData, mode, line }) => {

    const isEditMode = mode === 'edit';

    const [lineName, setLineName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [setInvenData, invenData] = useState('');
    const [role, setRole] = useState("fileupload");
    const [isImmediate, setIsImmediate] = useState(true);
    const [versionData, setVersionData] = useState('')
    const [versionTitle,setVersionTitle] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [searchData, setSearchData] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const dropdownRef = useRef(null);


    const handleProfileContclose = () => {
        handleSubContainer(lineName)
    }

    const handleAddLine = async () => {
        if (!lineName) {
            alert("Please fill the field.");
            return;
        }
        const requestBody = isEditMode ? {
            id: line.id,
            name: lineName,
            type: 0

        } : {
            name: lineName,
            type: 0
        };

        const method = isEditMode ? 'PUT' : "POST";
        const url = isEditMode ? `api/v2/regions/${line.id}` : 'api/v2/regions'
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
                alert('Discovery started successfully');
                handleProfileContclose();
                if (refreshLineData) refreshLineData();
                setLineName('')
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }

    }

    useEffect(() => {
        if (isEditMode && line) {
            setLineName(line.name || '');
        } else {
            setLineName('');
        }
    }, [mode, line]);




    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('upfile', selectedFile);

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/firmware/uploaddiscctx/16_314`, {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                setSuccess('File upload has started.');
                alert('File upload has started.')

                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Name,Email,Age", "John Doe,john@example.com,30"].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };






    const getVersionData = async (url) => {
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
                setVersionData(data);
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
        const fetchData = async () => {
            const url = 'api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc'
            await getVersionData(url);

        }
        fetchData();

    }, []);



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
    


    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Bulk Firmware Apply</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <article style={{ paddingTop: '4px' }}>
                                <label className="vlanlabel">Firmware</label>
                                <article style={{ padding: '12px 0' }}>
                                    <select className="vlaninput" value={versionTitle} onChange={(e)=> setVersionTitle(e.target.value)}>
                                        <option key='0' value='Select'>Select</option>
                                        {versionData && versionData.map((value, index) => (
                                            <option key={index} value={value.fileName}>{value.fileName}</option>
                                        ))}
                                    </select>
                                </article>
                            </article>
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
                                            onChange={(date) => setSelectedDate(date)}
                                            className="myDatepickercl" />
                                    </article>
                                </article>
                            </article>}
                            <article style={{ position: 'relative' }}>
                                <label class="radiolabelcl">
                                    <input type="radio" name="role"
                                        value='fileupload'
                                        checked={role === 'fileupload'}
                                        onChange={() => setRole('fileupload')}

                                    />
                                    <span class="checking"></span>
                                    <span class="labeltext">File Upload</span>
                                </label>
                                <label class="radiolabelcl">
                                    <input type="radio" name="role"
                                        value='devicelist'
                                        checked={role === 'devicelist'}
                                        onChange={() => setRole('devicelist')}
                                    />
                                    <span class="checking"></span>
                                    <span class="labeltext">Device List</span>
                                </label>
                            </article>
                            <hr />
                            {role === 'fileupload' && <article className="uploadcont">
                                <article className="regioncontw" style={{ paddingLeft: "20px", margin: '24px' }}>
                                    <label htmlFor="" className="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                                    <div className="filename-display">
                                        {selectedFile ? selectedFile.name : 'No file selected'}
                                    </div>
                                    <input
                                        className="dislineinputcl"
                                        type="file"
                                        onChange={handleFileChange}
                                        id="hiddenFileInput"
                                        style={{ display: "none" }}
                                    />
                                    <button onClick={() => document.getElementById("hiddenFileInput").click()} class="attachcl">
                                        <i class="fa-solid fa-paperclip"></i></button>
                                    <button onClick={downloadSampleCSV} class="createbtn">Sample.csv<i class="fa fa-file-text" aria-hidden="true"></i></button>
                                </article>
                                <hr class="hrnote"></hr>
                                <center className="d-f">
                                    <button className="cancelbtn" onClick={handleProfileContclose}>Cancle</button>
                                    <button className="creatsetingbtn" onClick={handleUpload}>
                                        {isEditMode ? 'Update' : 'Upload'}
                                    </button>
                                </center>
                            </article>}
                            {role === 'devicelist' && <article>
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
                                <button className="cancelbtn">Cancel</button>
                                <button className="creatsetingbtn">Apply</button>
                            </center>
                                </article>}
                        </form>
                    </article>
                </article>
            </article>

        </>
    )
}

export default FirmwareContainerSub;