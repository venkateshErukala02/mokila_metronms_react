import React, { useState, useEffect } from "react";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import '../ornms.css';
import './../Inventory/inventory.css';


const InventRpt = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const isVisible = useSelector(state => state.visibility.isVisible);

    const [invenData, setInvenData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [success, setSuccess] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const [pageSize,setPageSize] = useState(1);
   const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');


    const getDataInvety = async () => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const url = `api/v2/nodes?_s=&limit=${limitValueSelLabel}&offset=${pageSize}&order=asc&orderBy=id`;


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
                setInvenData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(() => {
        // getDataInvety();
            // const intervalId = setInterval(()=>{
                getDataInvety()
            // },1000);
        //   return ()=> clearInterval(intervalId);
    }, [pageSize,limitValueSelLabel]);

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


    // const handleDelete = async(idToDelete) => {
    //         const requestBody = {
    //            nodeCheck : idToDelete,
    //            nodeData : idToDelete
    //         };

    //         try {
    //             const response = await fetch("admin/deleteSelNodes", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(requestBody),
    //             });
    //             if (response.ok) {
    //                 setSuccess('Discovery started successfully');

    //             } else {
    //                 setIsError('Error starting discovery');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             setIsError('An error occurred while contacting the server.');
    //         } finally {
    //             setIsLoading(false); // Turn off loading state
    //         }

    //     }

    // const handleDelete = async (idToDelete) => {
    //     const formData = new FormData();
    //     formData.append("nodeCheck", idToDelete);
    //     formData.append("nodeData", idToDelete);

    //     try {
    //         const response = await fetch("admin/deleteSelNodes", {
    //             method: "POST",
    //             body: formData, // Note: Do NOT set Content-Type here
    //         });

    //         if (response.ok) {
    //             setSuccess("Node deleted successfully");

    //             // Update UI: Remove deleted item from table
    //             const updatedNodes = invenData.node.filter(node => node.id !== idToDelete);
    //             setInvenData(prev => ({
    //                 ...prev,
    //                 node: updatedNodes,
    //                 totalCount: updatedNodes.length
    //             }));
    //         } else {
    //             setIsError({ status: true, msg: "Error deleting node" });
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         setIsError({ status: true, msg: "An error occurred while deleting node." });
    //     } finally {
    //         setIsLoading(false);
    //     }
    // };


    const getNodeIdsBySelectedIPs = () => {
        if (!Array.isArray(invenData.node)) return [];
        return invenData.node
            .filter((node) => selectedRows.includes(node.ipConfig.ipAddress))
            .map((node) => node.id);
    };


    const handleBulkDelete = async () => {


        const idsToDelete = getNodeIdsBySelectedIPs();

        if (idsToDelete.length === 0) {
            alert("No rows selected to delete.");
            return;
        }

        const bodyData = new URLSearchParams();
        idsToDelete.forEach((id) => {
            bodyData.append("nodeCheck", id);
            bodyData.append("nodeData", id);
        });
        // const bodyData = new URLSearchParams();
        // bodyData.append("nodeCheck", idToDelete);
        // bodyData.append("nodeData", idToDelete);

        try {
            const response = await fetch("admin/deleteSelNodes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: bodyData.toString()
            });

            if (response.ok) {
                setSuccess("Node deleted successfully");
                alert('Node deleted successfully');
                const updatedNodes = invenData.node.filter(node => node.id !== idsToDelete);
                setInvenData(prev => ({
                    ...prev,
                    node: updatedNodes,
                    totalCount: updatedNodes.length
                }));
                setSelectedRows([])

            } else {
                setIsError({ status: true, msg: "Error deleting node" });
            }
        } catch (error) {
            console.error("Error:", error);
            setIsError({ status: true, msg: "An error occurred while deleting node." });
        } finally {
            setIsLoading(false);
        }
    };





    const handleSelectAll = () => {
        const allKeys = invenData.node.map((node) => node.ipConfig.ipAddress);
        if (selectedRows.length === invenData.node.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(allKeys);
        }
    };

    const handleCheckboxChange = (key) => {
        setSelectedRows((prevSelected) =>
            prevSelected.includes(key)
                ? prevSelected.filter((rowKey) => rowKey !== key)
                : [...prevSelected, key]
        );
    };





    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

     const handleIncreamentOffset=()=>{
            // setFromValue(parseInt(pageSize)* parseInt(limitValueSelLabel));
                if (invenData?.node?.length === 0 || undefined) {            
                setPageSize(prevstate => prevstate);
            } else if (invenData?.node?.length > 0) {
                setPageSize(prevstate => prevstate + 1);
            }
        }
    
      
        const handleDecrementOffset=()=>{
              if(pageSize > 1){
            setPageSize(prevPageSize => {
            const newPageSize = prevPageSize - 1;
            // setFromValue(parseInt(newPageSize) * parseInt(limitValueSelLabel));
            return newPageSize;
                });
            }else{
                setPageSize(1);
                            // setFromValue('0');
                    }
        }


        const handleLimitValue = (event) => {
        setLimitValueSel(event.target.value);
        const label = event.target.options[event.target.selectedIndex].label;
        setLimitValueSelLabel(label)
    }

    return (
        <>
            <article className="display-f">
            <LeftNavList className="leftsidebar"/>
                    <article className="container-fluid">
                    <article className="row">
                    <article className="col-md-12">
                        <h1 className="inventtitle">Inventory Reports</h1>

                        <article className="row custom-row border-allsd">
                            <article className="col-md-7">
                                <button className="clearfix arrowlf" onClick={handleDecrementOffset}>
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <button className="clearfix numcl"><span>{pageSize}</span></button>
                                <button className="clearfix arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                                <span className="eventscp">Scope : </span>
                                <span className="eventgolcl" onClick={toggleDropdown}  >Golbal <span class="fa fa-chevron-down highlightText v-align-tt iconsy"></span></span>

                                <span className="totalcl" style={{ marginLeft: '10px' }}>Total: <span>{invenData.totalCount}</span></span>
                                <span className="totalcl">Good: <span>{activeTrueCount}</span></span>
                                <span className="totalcl">Down: <span>{activeFalseCount}</span></span>
                                <input type="text" style={{ marginRight: '10px' }} name="" placeholder="IP Address / System Name / Serial Number" id="" className="form-controlinventory" />
                                <button className="clearfix createbtn">Search</button>

                            </article>
                            <article className="col-md-5">
                                <article style={{ float: 'right' }}>
                                    <ul className="inventorylist">

                                        <li>
                                            <label htmlFor="" className="selectlbl">Select Columns  <span style={{ marginTop: '2px' }} className="glyphicon glyphicon-tasks"></span></label>
                                        </li>
                                        <li>
                                            <button className="clearfix createbtn" onClick={handleBulkDelete}>Delete
                                                <i className="fa fa-trash" aria-hidden="true"></i>
                                            </button>

                                        </li>
                                        <li>
                                            <button className="clearfix createbtn">Inventory Report
                                                <i className="fa fa-file-text" aria-hidden="true"></i>
                                            </button>

                                        </li>
                                        <li>
                                            <button className="clearfix createbtn">Node Report
                                                <span className="fa fa-file-pdf-o"></span>
                                            </button>

                                        </li>
                                        <li>
                                            <select className="form-controll1" style={{ maxWidth: '58px', minWidth: '58px', marginTop: '2px', fontSize: '12px' }} aria-invalid="false" value={limitValueSel} onChange={handleLimitValue}>
                                                <option value="1" label="25" defaultValue={25}>25</option>
                                                <option value="2" label="50">50</option>
                                                <option value="3" label="100">100</option>
                                            </select>
                                        </li>
                                    </ul>

                                </article>
                            </article>
                        </article>


                        <article className="row border-lr" style={{height:'80vh'}}>
                            <table className="col-md-12" style={{ height: '0vh' }}>
                                <thead className="inventthtb">
                                    <tr style={{ textAlign: 'center' }}>
                                        <th><input type="checkbox" className="incl"
                                            onChange={handleSelectAll}
                                            checked={
                                                Array.isArray(invenData.node) &&
                                                invenData.node.length > 0 &&
                                                selectedRows.length === invenData.node.length
                                            }
                                        /></th>
                                        <th>System Name</th>
                                        <th>Primary IP</th>
                                        <th>Up Time</th>
                                        <th>Device Type</th>
                                        <th>Line</th>
                                        <th>Station</th>
                                        <th>Position</th>
                                        <th>Action</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody className="inventbdtb">
                                    {Array.isArray(invenData.node) && invenData.node.length > 0 ? (
                                        invenData.node.map((event) => (
                                            <tr key={event.id} style={{ textAlign: 'center' }}>
                                                <td><input type="checkbox" className="incl"
                                                    checked={selectedRows.includes(event.ipConfig.ipAddress)}
                                                    onChange={() => handleCheckboxChange(event.ipConfig.ipAddress)}
                                                /></td>
                                                <td style={{ width: "px" }}>{event.sysName}</td>
                                                <td style={{ width: 'px' }}>{event.ipConfig.ipAddress}</td>
                                                <td style={{ width: '' }}>{formatTime(event.sysUptime)}</td>
                                                <td style={{ width: '' }}>{event.deviceType}</td>
                                                <td style={{ width: '' }}>{event.region}</td>
                                                <td style={{ width: '' }}>{event.facility}</td>
                                                <td style={{ width: '' }}>{event.radioMode}</td>
                                                <td><i className="fa fa-sync"></i></td>
                                                <td><i className="fa fa-trash" onClick={handleBulkDelete} ></i></td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="12" className="datacl centered-text">No Data</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </article>



                    </article>
                    </article>
                </article>
            </article>
        </>

    )
}
export default InventRpt;