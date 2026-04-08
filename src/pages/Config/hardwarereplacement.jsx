import { useState, useEffect, useRef } from "react";
import '../../pages/ornms.css'

const HardwareReplacementContainer = () => {
    const [searchOldDeviceValue, setSearchOldDeviceValue] = useState('');
    const [searchNewDeviceValue, setSearchNewDeviceValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success,setSuccess] = useState('');
    const [searchOldDeviceData, setSearchOldDeviceData] = useState([]);
    const [searchNewDeviceData, setSearchNewDeviceData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchOldDeviceTrigger, setSearchOldDeviceTrigger] = useState(0);
    const [searchNewDeviceTrigger,setSearchNewDeviceTrigger] = useState(0);
    const [selectedIps, setSelectedIps] = useState([]);
    const dropdownRef = useRef(null);
    const [selectedRows, setSelectedRows] = useState([]);
    const [showUploadStatus,setShowUploadStatus] = useState(false);
    const [statusData,setStatusData] = useState([]);
    const statusTimeoutRef = useRef(null);
    const [timeLeft, setTimeLeft] = useState(30);
    const countdownRef = useRef(null);
    const [showHardwareReplacementPopup, setShowHardwareReplacementPopup] = useState(false);
    const [showHardwareReplacementSuccessPopup, setShowHardwareReplacementSuccessPopup] = useState(false);
  
  
   useEffect(() => {
        return () => {
            if (countdownRef.current) {
            clearInterval(countdownRef.current);
            }
            if (statusTimeoutRef.current) {
            clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);



    useEffect(() => {
        return () => {
            if (statusTimeoutRef.current) {
                clearTimeout(statusTimeoutRef.current);
            }
        };
    }, []);

      useEffect(() => {
            function handleClickOutside(event) {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setSearchBtn(false);
                    setSearchNewDeviceValue('');
                    setSearchNewDeviceData([]);
                }
            }
    
            document.addEventListener('mousedown', handleClickOutside);
    
            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }
    
        }, []);

    useEffect(() => {

        const handleSearcNewDevicehData = async (searchNewDeviceValue) => {

            try {
                const response = await fetch(`api/v2/nodes?_s=assetRecord.serialNumber==${searchNewDeviceValue},label==${searchNewDeviceValue},sysName==${searchNewDeviceValue}&ar=devicetype&limit=25&offset=0&order=asc&orderBy=id`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setLoading(false);
                    setSearchNewDeviceData(data.node || []);
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

        if (searchNewDeviceValue.trim()) {
            handleSearcNewDevicehData(searchNewDeviceValue);
        }
    }, [searchNewDeviceTrigger]);

     useEffect(() => {

        const handleSearcOldDevicehData = async (searchOldDeviceValue) => {

            try {
                const response = await fetch(`api/v2/profiles/listconfigs?address=${searchOldDeviceValue}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setLoading(false);
                    setSearchOldDeviceData(data || []);
                    setError({ status: false, msg: "" });
                    setError({ status: false, msg: "" });
                    setSearchOldDeviceValue('');
                } else {
                    throw new Error("data not found");
                }

            } catch (error) {
                setLoading(false);
                setError({ status: true, msg: error.message });
            }

        }

        if (searchOldDeviceValue.trim()) {
            handleSearcOldDevicehData(searchOldDeviceValue);
        }
    }, [searchOldDeviceTrigger]);

    const handleClearSearch = () => {
        setSearchBtn(false);
        setSearchNewDeviceValue('');
        setSearchNewDeviceData([]);

    }

    const handleAddToTable = (event) => {

        if (!addedItems.includes(event.id)) {
            setAddedItems((prevAddedItems) => [...prevAddedItems, event.id]);
        }

        if (!selectedItems.some(item => item.id === event.id)) {
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, event]);
        }
    };

    const handleOldDeviceSearchClick = (e) => {
        e.preventDefault();
        if (!searchOldDeviceValue.trim()) {
            alert("Please enter a valid search IP");

        } else {
            setSearchOldDeviceTrigger(prev => prev + 1);
        }
    }

     const handleNewDeviceSearchClick = (e) => {
        e.preventDefault();
        if (!searchNewDeviceValue.trim()) {
            alert("Please enter a search term");

        } else {
            setSearchBtn(true);
            setSearchNewDeviceTrigger(prev => prev + 1);
        }
    }

     const handleSelectAll = () => {
    };

     const handleCheckboxChange = (key) => {
        setSelectedRows((prevSelected) =>
        prevSelected.includes(key) ? [] : [key]
        );
        };

         const handleHardwareReplacementStatus = async () => {
            setLoading(true);
            setError('');
            setSuccess('');

        try {
            const response = await fetch(`api/v2/profiles/rephard/status/${selectedItems[0].id}/?filename=${selectedRows[0]}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
                const data = await response.json();
            if (response.ok) {
                setStatusData(data);
                setShowUploadStatus(true);

                const pollCodes = [1, 2, 3, 5,7];

            if (pollCodes.includes(data.code)) {
                if (statusTimeoutRef.current) {
                    clearTimeout(statusTimeoutRef.current);
                }

                startCountdown(); 

                statusTimeoutRef.current = setTimeout(() => {
                    handleHardwareReplacementStatus();
                }, 30000);
                }

            } else {
                const errText = await response.text();
                setError(`Error starting hardware replacement: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };

      const handleHardwareReplacement = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`api/v2/profiles/rephard/${selectedItems[0].id}/?filename=${selectedRows[0]}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (response.ok) {
                // setSuccess('Hardware Replacement upload has started.');
                // alert('Hardware Replacement upload has started.');
                setShowHardwareReplacementSuccessPopup(true);
                handleHardwareReplacementStatus();
                setSelectedItems([]);
                setSearchOldDeviceData([]);
                setAddedItems([]);
                setSelectedRows([]);
            } else {
                const errText = await response.text();
                setError(`Error starting hardware replacement: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };


    const handleClosePopup=()=>{
        setShowUploadStatus(false);
      }

 const startCountdown = () => {
  if (countdownRef.current) {
    clearInterval(countdownRef.current);
  }

  setTimeLeft(30);

  countdownRef.current = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(countdownRef.current);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
};




    return (

        <>
            <article className="row" style={{ marginTop: "16px" }}>
                <article className="col-1"></article>
                <article className='col-10'>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <h1 className="hardwaretitle">Hardware Replace</h1>
                        </article>
                        <article className="row border-allsd b-t">
                            <article className="col-6" style={{ padding: '8px' }}>
                                <h4 className="selectdevititle">Select Old Device</h4>
                                <hr />
                                <article style={{ position: 'relative' }}>
                                    <ul className="regionlist">
                                        <li>
                                            <label for="" className="traplabel">Search Device</label>
                                            <article className="checkbok" style={{ display: 'flex' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search IP Address"
                                                    value={searchOldDeviceValue}
                                                    onChange={(e) => setSearchOldDeviceValue(e.target.value)}
                                                    className="searchIpinput"
                                                />
                                                <button type="button" className="searchfirmbtn" onClick={handleOldDeviceSearchClick}>Search</button>
                                            </article>
                                        </li>
                                    </ul>
                                </article>
                                <article className="row border-allsd" style={{ height: '28vh', overflow: 'hidden', margin: "22px 0" }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <thead className="configthtb">
                                            <tr style={{ textAlign: 'center' }}>
                                                <th style={{ width: '96px' ,textAlign:'center'}}><input type="checkbox" className="incl"
                                            onChange={handleSelectAll}
                                            checked={
                                                Array.isArray(searchOldDeviceData) &&
                                                searchOldDeviceData.length > 0 &&
                                                selectedRows.length === searchOldDeviceData.length
                                            }
                                        /></th>
                                                <th style={{ width: '150px' }}>IP Address</th>
                                                <th style={{ width: '146px' }}>Date</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <div style={{ height: 'calc(28vh - 40px)', overflowY: 'auto' }}>
                                        <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                            <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                                {Array.isArray(searchOldDeviceData) && searchOldDeviceData.length > 0 ? (
                                                    searchOldDeviceData.map((event) => (
                                                        <tr key={event.id}>
                                                            <td style={{ width: '96px' ,textAlign:'center'}}><input type="checkbox" className="incl"
                                                    checked={selectedRows.includes(event.fileName)}
                                                    disabled={selectedRows.length > 0 && !selectedRows.includes(event.fileName)}
                                                    onChange={() => handleCheckboxChange(event.fileName)}
                                                /></td>
                                                            <td style={{ width: '150px' }}>{event.ipAddress}</td>
                                                            <td style={{ width: '146px' }}>{event.date}</td>
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
                            </article>
                            <article className="col-6" style={{ padding: '8px' }}>
                                <h4 className="selectdevititle">Select New Device</h4>
                                <hr />
                                <article style={{ position: 'relative' }}>
                                    <ul className="regionlist">
                                        <li>
                                            <label for="" className="traplabel">Search Device</label>
                                            <article className="checkbok" style={{ display: 'flex' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search IP Address"
                                                    value={searchNewDeviceValue}
                                                    onChange={(e) => setSearchNewDeviceValue(e.target.value)}
                                                    className="searchIpinput"
                                                />
                                                <button type="button" className="searchfirmbtn" onClick={handleNewDeviceSearchClick}>Search</button>
                                                <button className="createbtn" type="button" onClick={handleClearSearch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

                                            </article>
                                        </li>
                                    </ul>
                                    {searchBtn && <article ref={dropdownRef}  className="configsearchdropdown">{searchNewDeviceData.length === 0 ? (
                                        <div style={{ padding: "10px" }}>No Data</div>
                                    ) : (
                                        <ul className="searchlist">
                                            {searchNewDeviceData && searchNewDeviceData.map((event) => {
                                                const isAdded = addedItems.includes(event.id);
                                                const isAnyIpAdded = addedItems.length > 0;
                                                 const isDisabled = isAnyIpAdded && !isAdded;
                                                return (
                                                    <li key={event.id}>
                                                        <article style={{ justifyContent: "space-between", display: 'flex', width: "100%" }}>
                                                            <h5 className="scheduletitle">{event.primaryIP}</h5>
                                                            <button className="addbtn" onClick={() => handleAddToTable(event)}
                                                                disabled={isDisabled ||  isAdded}
                                                                style={{
                                                                    backgroundColor: isAdded ? '#ccc' : isDisabled
                                                                    ? "#e0e0e0"
                                                                    : "#007bff",
                                                                    color: isAdded || isDisabled ? '#666' : 'white',
                                                                    cursor: isAdded ? 'not-allowed' : 'pointer'
                                                                }}
                                                            >{isAdded ? 'Added' : 'Add'}</button>
                                                        </article>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    )}
                                    </article>}
                                </article>
                                <article className="row border-allsd" style={{ height: '28vh', overflow: 'hidden', margin: "22px 0" }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <thead className="configthtb">
                                            <tr style={{ textAlign: 'center' }}>
                                                <th>System Name</th>
                                                <th>IP Address</th>
                                                <th>Station</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <div style={{ height: 'calc(28vh - 40px)', overflowY: 'auto' }}>
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
                                         {showHardwareReplacementPopup && (
                                <article className="confirmdeletepopup">
                                    <article className="confirmdeletepopupboxstyle">
                                    <h1 className="confirmdeletetitle">Are you sure you want to update the configuration to the new device?</h1>
                                    <article className="f-r">
                                        <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowHardwareReplacementPopup(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleHardwareReplacement();
                                            setShowHardwareReplacementPopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}

                                {showHardwareReplacementSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The configuration upgrade has been initialed.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => setShowHardwareReplacementSuccessPopup(false)}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
                                    </div>
                                </article>
                            </article>
                            {showUploadStatus && <article style={{textAlign:'center'}}>
                                 <h4 className="hardwaresttitle"><strong>Status: </strong> {statusData?.reason} <span>(Refreshing status in {timeLeft} secs..)</span></h4>
                                </article>}
                            <article style={{textAlign:'center'}}>                              
                                <button className="searchfirmbtn" type="button"
                                onClick={() => setShowHardwareReplacementPopup(true)}
                                disabled={selectedItems.length === 0 && addedItems.length === 0}
                                // onClick={handleHardwareReplacement}
                                >Hardware Replacement</button>
                            </article>
                            <article style={{margin:'12px 22px'}}>
                                <h6 className="notehardpara">Note: </h6>
                                <ul className="hardwarenotelist">
                                    <li>1. Make sure the old device configuration is downloaded</li>
                                    <li>2. Make sure TFTP/FTP details are configured in "settings" section</li>
                                    <li>3. Select the Old Device and New Device for initiating Hardware Replacement</li>
                                </ul>
                            </article>
                        </article>
                    </article>
                </article>
                <article className="col-1"></article>

            </article>
        </>
    )
}



export default HardwareReplacementContainer