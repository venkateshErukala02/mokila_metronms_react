import { useState, useEffect, useRef } from "react";
import LeftNavList from "../Navbar/leftnavpage";
import { useDispatch, useSelector } from 'react-redux';
import '../ornms.css';
import './../Inventory/inventory.css';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from "react-router-dom";
import { handleNodeData } from "../Action/action";

const InventRpt = () => {

     const ALL_COLUMNS = [
          { key: 'sysName', label: 'System Name' },
          { key: 'label', label: 'Primary IP' },
          { key: 'macAddress', label: 'MAC Address' },
          { key: 'serialNum', label: 'Serial Number' },
          { key: 'sysUptime', label: 'Uptime' },
          { key: 'deviceType', label: 'Device Type' },
          { key: 'region', label: 'Line' },      
          { key: 'facility', label: 'Station' },
          { key: 'radioMode', label: 'Position' },
        ];
        const DEFAULT_COLUMNS = [
            "sysName",
            "label",
            "sysUptime",  
            "deviceType",
            "region",
            "facility",
            "radioMode",
            ];
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [invenData, setInvenData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [success, setSuccess] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [pageSize,setPageSize] = useState(1);
    const [fromValue,setFromValue] =useState('0');
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [sortField, setSortField] = useState('id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchText,setSearchText] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [searchData, setSearchData] = useState('');
    const [searchBtn, setSearchBtn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [dropDownShow,setDropDownShow] = useState(false);
    const columnWrapperRef =  useRef(null);
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
    const firstLoadRef = useRef(true);
    const [showConfirmDeletePopupStatus,setShowConfirmDeletePopupStatus] = useState(false);
    const [showRescanSuccessPopup,setShowRescanSuccessPopup] = useState(false);
    const [showDeleteSuccessPopup,setShowDeleteSuccessPopup] = useState(false);
    const [showWarningPopup,setShowWarningPopup] = useState(false);
    

     const currentUser = useSelector((state) => state?.loginuser?.node?.role);
            const isReadOnly = currentUser === 'Read-only';

    useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(columnWrapperRef.current && !columnWrapperRef.current.contains(event.target)){
                setDropDownShow(false);
            }
        }
           
                document.addEventListener("click",handleClickOutside);

            return ()=>{
                document.removeEventListener("click",handleClickOutside);
            }
        
    },[dropDownShow]);

        useEffect(() => {
            if (!searchText.trim()) return;
            handleSearchData(searchText);
        }, [searchTrigger]);

        const allSelected = ALL_COLUMNS.every(col =>
                visibleColumns.includes(col.key)
                );

        const handleAddColumn=()=>{
            setDropDownShow(prev => !prev);
        }

         const handleColumnToggle = (key) => {
            setVisibleColumns(prev =>
                prev.includes(key)
                ? prev.filter(col => col !== key)
                : [...prev, key]
            );
        };

        const handleSearchData = async (searchText) => {

                try {
                    const response = await fetch(`api/v2/nodes?_s=assetRecord.serialNumber==${searchText},label==${searchText},sysName==${searchText}&limit=${limitValueSelLabel}&offset=${fromValue}&order=asc&orderBy=id`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                      if (response.status === 204) {
                            setIsLoading(false);
                            setInvenData([]);
                            return;
                        }
                    const data = await response.json();

                    if (response.ok) {
                        setInvenData(data || []);
                        setError({ status: false, msg: "" });
                    } else {
                        throw new Error("data not found");
                    }

                } catch (error) {
                    setError({ status: true, msg: error.message });
                }finally {
                    setLoading(false);
                }

        }


    const getDataInvety = async (productCode) => {
        const fieldMappings = {
            // primaryIP: ipConfig.primaryIP,
             deviceType: 'productCode',
            // region: config.region,
            // facility: config.facility,
            // radioMode: config.radioMode,
         };

         const fieldToUse =   fieldMappings[sortField] !== undefined
                            ? fieldMappings[sortField]
                            : sortField;
        if (firstLoadRef.current) {
            setIsLoading(true);
            }
        setIsError({ status: false, msg: "" });
        try {
            const url = `api/v2/nodes?_s=&limit=${limitValueSelLabel}&offset=${fromValue}&order=${sortOrder}&orderBy=${fieldToUse}`;
            const options = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(url, options);
             if (response.status === 204) {
                    setIsLoading(false);
                    setInvenData([]);
                    setIsError({ status: false, msg: '' });
                    return;
                }
            const data = await response.json();
            if (response.ok) {
                setInvenData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }finally {
            if (firstLoadRef.current) {
            setIsLoading(false);
            firstLoadRef.current = false;
        }
        }
    };

    useEffect(() => {
        if (searchBtn) return;
        getDataInvety();
            const intervalId = setInterval(()=>{
                getDataInvety()
            },30000);
          return ()=> clearInterval(intervalId);
    }, [fromValue,limitValueSelLabel,sortOrder,searchBtn]);

    let activeTrueCount = 0;
    let activeFalseCount = 0;

    if (Array.isArray(invenData.node)) {
        invenData.node.forEach(device => {
            if (device.active === true) {
                activeTrueCount++;
            } else if (device.active === false) {
                activeFalseCount++;
            }
        });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const milliseconds = date.getMilliseconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    };

    const getNodeIdsBySelectedIPs = () => {
        // if (!Array.isArray(invenData.node)) return [];
        // return invenData.node
        //     .filter((node) => selectedRows.includes(node.ipConfig.ipAddress))
        //     .map((node) => node.id);
         return selectedRows;
    };


    const handleBulkDelete = () => {
        if (selectedRows.length === 0) {
            setShowWarningPopup(true);
            return;
        }
        setShowConfirmDeletePopupStatus(true);
    };

    const handleConfirmDelete = async () => {

        const idsToDelete = selectedRows;

        const bodyData = new URLSearchParams();
        idsToDelete.forEach((id) => {
            bodyData.append("nodeCheck", id);
            bodyData.append("nodeData", id);
        });

        try {
            const response = await fetch("admin/deleteSelNodes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyData.toString()
            });

            if (response.ok) {
                // setSuccess("Node deleted successfully");
                // alert('Node deleted successfully');
                setShowDeleteSuccessPopup(true);
                // setShowConfirmDeletePopupStatus(false);
                const updatedNodes = invenData.node.filter(node =>  !idsToDelete.includes(node.id));
                setInvenData(prev => ({
                    ...prev,
                    node: updatedNodes,
                    totalCount: updatedNodes.length
                }));
                setSelectedRows([]);
                getDataInvety();
            } else {
                setIsError({ status: true, msg: "Error deleting node" });
            }
        } catch (error) {
            setIsError({ status: true, msg: "An error occurred while deleting node." });
        } finally {
            setIsLoading(false);
        }
    };


        const handleActionRescan = async (node) => {

        try {
            const response = await fetch("api/v2/nodes/rescanNode", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: node.id
            });

            if (response.ok) {
                setShowRescanSuccessPopup(true);
                
            } else {
                setIsError({ status: true, msg: "Error deleting node" });
            }
        } catch (error) {
            setIsError({ status: true, msg: "An error occurred while deleting node." });
        } finally {
            setIsLoading(false);
        }
    };





    const handleSelectAll = () => {
         if (!Array.isArray(invenData.node)) return;
        const allIds = invenData.node.map(node => node.id);
       if (selectedRows.length === allIds.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(allIds);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
    };

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

     const handleIncreamentOffset=()=>{

          setPageSize(prev => {
        if (!invenData || invenData?.length === 0 || invenData?.node?.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(limitValueSelLabel));
        return newPage;
        });
        }
    
      
        const handleDecrementOffset=()=>{

             if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(limitValueSelLabel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
        }

        const handleLimitValue = (event) => {
        setLimitValueSel(event.target.value);
        const label = event.target.options[event.target.selectedIndex].label;
        setLimitValueSelLabel(label)
    }


    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (!searchText.trim()) {
            alert("Please enter a search term");

        } else {
            setSearchBtn(true);
            setSearchTrigger(prev => prev + 1);
        }
    }


    const handleClearSearch = () => {
        setSearchBtn(false);
        setSearchText('');
        setInvenData([]);
        getDataInvety();
      }

      const nodes = Array.isArray(invenData.node) ? invenData.node : [];

      const handleClosePopup=()=>{
        setShowConfirmDeletePopupStatus(false);
      }
    const navigate = useNavigate();
    const dispatch = useDispatch();

      const handleRowClick = (node) => {
        if (!node?.deviceType) {
                return;
            }
              if (`${node.deviceType}` === 'AP') {
                  navigate('/SN-view')
                  dispatch(handleNodeData(node))
              } 
            //   else if(`${node.deviceType}` === 'CAM'){
            //         alert('Node-View Not Supported')
            //     } 
                else {
                        navigate(`/${node.deviceType}-view`, { state: { node }});
                        dispatch(handleNodeData(node))
              }
      
          };



          const getRfTagData = async () => {
    
        try {
            const response = await fetch("api/v2/nodes/tagreport", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // 'Authorization': `Basic ${token}`
                },
                // body: formData, 
            });
    
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                // alert('Discovery started successfully')

                // setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };

        const getInventoryReportData = async () => {
    
            const payload = {
        cols: [
            "sysName",
            "macAddress",
            "assetRecord.serialNumber",
            "sysUptime",
            "productCode",
            "radioMode",
            "station",
            "section",
            "line"
                ]
                };
        try {
            const response = await fetch("api/v2/nodes/export_to_csv", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                    // 'Authorization': `Basic ${token}`
                },
                body: JSON.stringify(payload)
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
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };


    const formatUptime = (ticks) => {
    const totalSeconds = Math.floor(ticks / 100);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, "0");

    return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};


const columnPadding = {
  radioMode: "16px",
  deviceType: "35px",
};

    return (
        <>
            <article className="display-f">
                <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
            <LeftNavList className="leftsidebar"/>
            </article>
                    <article className="container-fluid">
                    <article className="row sect-padd">
                    <article className="col-md-12">
                        <h1 className="inventtitle">Inventory Reports</h1>

                        <article className="row custom-row border-allsd">
                            <article className="col-md-7">
                                <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <button type="button" className="numcl"><span>{pageSize}</span></button>
                                <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                                {/* <span className="eventscp">Scope : </span>
                                <span className="eventgolcl" onClick={toggleDropdown}  >Golbal <span className="fa fa-chevron-down highlightText v-align-tt iconsy"></span></span> */}

                                <span className="totalcl" style={{ marginLeft: '10px' }}>Total: <span>{invenData.totalCount}</span></span>
                                <span className="totalcl">Good: <span>{activeTrueCount}</span></span>
                                <span className="totalcl">Down: <span>{activeFalseCount}</span></span>
                                <input type="text" style={{ marginRight: '10px' }} name="" placeholder="Enter systemname / ipaddress / serialnumber" id="" value={searchText} onChange={(e)=> setSearchText(e.target.value)} className="form-controlinventory" />
                                <button type="button" className="createbtn" onClick={handleSearchClick}>Search</button>
                                <button className="createbtn" type="button" onClick={handleClearSearch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

                            </article>
                            <article className="col-md-5">
                                <article style={{ float: 'right' }}>
                                    <ul className="inventorylist">

                                        <li>
                                            <label style={{position:'relative'}} ref={columnWrapperRef} htmlFor="" className="selectlbl">Select Columns  <span style={{ marginTop: '2px' }} className="glyphicon glyphicon-tasks" onClick={(e) => { e.stopPropagation(); handleAddColumn()}}></span></label>
                                             {dropDownShow && (
                                    <article className="Addcoldropdownartinvent" onClick={(e) => e.stopPropagation()} >
                                        <ul className="addcollist">
                                            <li>
                                        <label>
                                            <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={(e) =>
                                                setVisibleColumns(
                                                e.target.checked ? ALL_COLUMNS.map(c => c.key) : DEFAULT_COLUMNS
                                                )
                                            }
                                            />
                                            Select All
                                        </label>
                                        </li>
                                        {ALL_COLUMNS.map(col => (
                                            <li key={col.key}>
                                            <label>
                                                <input
                                                type="checkbox"
                                                checked={visibleColumns.includes(col.key)}
                                                onChange={() => handleColumnToggle(col.key)}
                                                />
                                                {col.label}
                                            </label>
                                            </li>
                                        ))}
                                        </ul>
                                    </article>
                                    )}
                                        </li>
                                        <li>
                                            <button type="button"
                                            className={`createbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`}
                                    title={currentUser === "Read-only" ? "Permission required" : ""}
                                    onClick={currentUser !== 'Read-only' ? handleBulkDelete : undefined}>Delete
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                            </button>

                                        </li>
                                        <li>
                                            <button type="button" className="createbtn" onClick={getRfTagData}>RF TAG Report
                                                <i className="fa fa-file-text" aria-hidden="true"></i>
                                            </button>

                                        </li>
                                        <li>
                                            <button type="button" className="createbtn" onClick={getInventoryReportData}>Inventory Report
                                                <i className="fa fa-file-text" aria-hidden="true"></i>
                                            </button>

                                        </li>
                                        <li>
                                            <select className="form-controll1" style={{ maxWidth: '58px', minWidth: '58px', marginTop: '2px', fontSize: '12px' }} aria-invalid="false" value={limitValueSel} onChange={handleLimitValue}>
                                                    <option value="25" label="25">25</option>
                                                    <option value="50" label="50">50</option>
                                                    <option value="100" label="100">100</option>
                                                    {/* <option value="500" label="500">500</option> */}
                                            </select>
                                        </li>
                                    </ul>

                                </article>
                            </article>
                        </article>


                        <article className="row border-lr" style={{height:'85vh',overflow:'clip auto'}}>
                            <table className="col-md-12" style={{ height: '0vh' }}>
                                <thead className="inventthtb tableheadpostion">
                                     <tr>
                                        <th style={{ paddingLeft: '75px' }}>
                                        <input
                                            className="incl2"
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={selectedRows.length === invenData?.node?.length && invenData?.node?.length > 0}
                                        />
                                        </th>

                                        {ALL_COLUMNS
                                        .filter(col => visibleColumns.includes(col.key))
                                        .map((col) => (
                                        <th key={col.key} onClick={() => handleSort(col.key)}>
                                            {col.label}
                                          {col.key !== 'region' && (   <FontAwesomeIcon
                                            icon={
                                                sortField === col.key
                                                ? sortOrder === 'asc'
                                                    ? faSortDown
                                                    : faSortUp
                                                : faSort
                                            }
                                            style={{
                                                color:
                                                sortField === col.key
                                                    ? 'black'
                                                    : '#D7D7D7',
                                                paddingLeft: col.key === 'firmware' || col.key === 'status' || col.key === 'uptime' ? '0px' : undefined
                                            }}
                                            />
                                             )}
                                        </th>
                                        ))}
                                        <th>Action</th>
                                        <th>Delete</th>
                                    </tr>

                                </thead>
                                <tbody className="inventbdtb">

                                         {isLoading && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {isError.status && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                        {isError.msg}
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !firstLoadRef.current  && nodes.length === 0 &&  (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                                    {!isLoading &&
                                    !isError.status && nodes.length > 0 ? (
                                        nodes.map((node) => (
                                           <tr key={node.ipAddress}>
                                            <td style={{ paddingLeft: '75px' }}>
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.includes(node.id)}
                                                onChange={() => handleCheckboxChange(node.id)}
                                            />
                                            </td>

                                            {ALL_COLUMNS
                                            .filter(col => visibleColumns.includes(col.key))
                                            .map((col) => (
                                            <td key={col.key} style={
                                                columnPadding[col.key]
                                                ? { paddingLeft: columnPadding[col.key] }
                                                : {}
                                            }>
                                                {col.key === "label" ? (
                                        <span
                                        className="highlightText"
                                        onClick={() => handleRowClick(node)}
                                        >
                                        {node[col.key]}
                                        </span>): col.key === "sysUptime" ? (
                                                formatUptime(node[col.key])
                                            ) : col.key === "sysName" ? (
                                        <a href={`http://${node.primaryIP}`} target="_blank" rel="noreferrer">
                                        {node[col.key]}
                                        </a>
                                    ):(
                                                node[col.key]
                                        )}
                                            </td>
                                            ))}
                                            <td style={{paddingLeft:'22px'}}><i className="fa fa-sync"  onClick={currentUser !== 'Read-only' ? () => handleActionRescan(node) : undefined}
                                                 style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                opacity: isReadOnly ? 0.6 :1 
                                            }}
                                               title={isReadOnly ? "Permission required" :''}

                                                ></i></td>
                                            <td style={{paddingLeft:'22px'}}><i className="fa fa-trash" onClick={currentUser !== 'Read-only' ? handleBulkDelete : undefined} 
                                            style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                color: isReadOnly ? "black" : "#ef0808",
                                                opacity: isReadOnly ? 0.6 :1 
                                            }}
                                            title={isReadOnly ? "Permission required" :''}

                                            ></i></td>
                                        </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            {/* <td colSpan="12" className="datacl centered-text">No Data</td> */}
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {showConfirmDeletePopupStatus && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">All the device data will be lost. Are you sure you want to delete the device?</h1>
                                <article className="f-r">
                                <button className="confirmdeletebtn" type="button" onClick={handleClosePopup}>NO</button>
                                <button className="confirmdeletebtn confirmdeletebtnyes" type="button" onClick={async () => { 
                                    await handleConfirmDelete();
                                    setShowConfirmDeletePopupStatus(false)}}>YES</button>
                                </article>
                                </article>
                            </article>
                            </>}
                              {showRescanSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">Rescanning of the node initiated</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowRescanSuccessPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
                                {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">Node deleted successfully.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowDeleteSuccessPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
                                {showWarningPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Warning</h1>
                                    <p className="confirmtextsucess">No devices have been selected for deletion.</p>
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
                             {/* {showSuccessPopupStatus && <>
                             <article className="confirmmsgsuccess">
                                <article className="confirmmsgsuccessboxstyle">
                                <h1 className="confirmdeletetitle">Success</h1>
                                <p>Node Deleted successfully.</p>
                                <article className="f-r">
                                <button className="confirmdeletebtn confirmdeletebtnyes" type="button" onClick={handleClosePopup}>ok</button>                                
                                </article>
                                </article>
                            </article>
                            </>} */}
                        </article>
                    </article>
                    </article>
                </article>
            </article>
        </>

    )
}
export default InventRpt;