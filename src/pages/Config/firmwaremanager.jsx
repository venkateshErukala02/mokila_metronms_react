import { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import './../Inventory/inventory.css';
import FirmwareMngSubCont from "./firmwaremngsub";
import FirmwareManagerApply from "./firmwaremanagerapply";
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FirmwareMng = () => {
    const [profileStatusCont, setProfileStatusCont] = useState(false);
    const [applyStatusCont,setApplyStatusCont] = useState(false);
    const [versionData, setVersionData] = useState([]);
    const [regionLimitValueSel, setRegionLimitValueSel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [editVersion, setEditVersion] = useState(null);
    const [mode, setMode] = useState(null);
    const [selected, setSelected] = useState('all');
    const [showList, setShowList] = useState(false);
    const previousDataRef = useRef(null);
    const [sortOrder, setSortOrder] = useState('fileName.asc');
    const [showConfirmDeletePopupStatus, setShowConfirmDeletePopupStatus] = useState(false);
    const [firmwareToDelete, setFirmwareToDelete] = useState(null);
    const columnWrapperRef =  useRef(null);
    const [showConfirmDeleteSuccessPopupStatus, setShowConfirmDeleteSuccessPopupStatus] = useState(false);


       useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(columnWrapperRef.current && !columnWrapperRef.current.contains(event.target)){
                setShowList(false);
            }
        }
           
                document.addEventListener("click",handleClickOutside);

            return ()=>{
                document.removeEventListener("click",handleClickOutside);
            }
        
    },[showList]);

    
    const getVersionData = async (url,isInterval = false) => {
         if(previousDataRef.current === ''){
            setIsLoading(true);
        }
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                   // 'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },


            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                 if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
                    setVersionData(data);
                    previousDataRef.current = data; 
                }
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }finally {
        if (!isInterval) {
            setIsLoading(false);
            }
        }
    };

    // useEffect(() => {
    //     const fetchData = async () => {
    //         const url = 'api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc'
    //         await getVersionData(url);

    //     }
    //     fetchData();

    // }, []);


     useEffect(() => {

        const fetchIntervalData = () => {
        const url = `api/v2/firmware/firmwares?&page=1&limit=${regionLimitValueSel}&sort=${sortOrder}`
    
        getVersionData(url,true);
        }

         fetchIntervalData();

    const intervalId = setInterval(fetchIntervalData, 10000);
    
        return () => clearInterval(intervalId);
    
    }, [sortOrder,regionLimitValueSel]);




    const handleRegionLimitValue = (event) => {
        setRegionLimitValueSel(event.target.value);

    }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setMode('create');
        setEditVersion(null);
    }

    const handleSubContainer = () => {
        setProfileStatusCont(false);
        setApplyStatusCont(false);
    }

    const handleEditLineDt = (item) => {
        setEditVersion(item);
        setMode('edit')
        setApplyStatusCont(true);
        setProfileStatusCont(false);
    }

    const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
        };


         const statuses = [
            { label: "All", value: "all" },
            { label: "Encoder", value: "encoder" },
            { label: "Station Node", value: "AP" },
            { label: "Transcoder", value: "transcoder" },
            // { label: "train radio", value: "train radio" },
            { label: "OBC", value: "obc" },
        ];

        const handleChange = (value) => {
            setSelected(value); 
        };

       const filteredData = versionData.filter(
        (item) => selected === "all" || item.deviceType === selected
        ) || [];


           const handleConfirmDeleteFirmware = async () => {
            setShowConfirmDeletePopupStatus(false);
            
            if (!firmwareToDelete) return;
       
        const method = 'POST';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
    
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/firmware/delete?firmware=${firmwareToDelete.actualName}`, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd'
                },
            });

            const text = await response.text();

            if (response.ok) {
                setShowConfirmDeleteSuccessPopupStatus(true);
                setFirmwareToDelete(null);
                getVersionData('api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc')
                // alert("Are you sure you want to delete this firmware?")
                // if(refreshUserData) refreshUserData();
            //    setUserName('');
            //    setFullName('');
            //    setEmail('');
            //    setPassword('');
            //    setConfirmPassword('');
            //    setLineNameSele(-1);
            //    setRole('ROLE_READONLY');
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }
    const [currentField, currentOrder] = sortOrder?.split('.') || [];

    const handleSort = (field) => {
        if (!sortOrder) {
        setSortOrder(`${field}.asc`);
        return;
        }

        if (currentField === field) {
            const nextOrder = currentOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(`${field}.${nextOrder}`);
            } else {
                setSortOrder(`${field}.asc`);
            }
        };

        const handleClosePopup = () => {
            setShowConfirmDeletePopupStatus(false);
            setFirmwareToDelete(null);
        };

        const handleOpenDeletePopup = (item) => {
            setFirmwareToDelete(item);
            setShowConfirmDeletePopupStatus(true);
        };



    return (
        <>
            <article className="row">
                <article className={profileStatusCont || applyStatusCont ? 'col-8' : 'col-12'}>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <article className="col-8">
                                <button type="button" className="arrowlf">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <button type="button" className="numcl"><span>1</span></button>
                                <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                            </article>
                            <article className="col-4">
                                <article style={{ float: 'right' }}>
                                    <ul className="setttinglist">

                                        <li>
                                            <button type="button" className="createbtn" onClick={handleProfileContopen}>Upload</button>

                                        </li>

                                        <li>
                                            <select className="form-controlfirm" value={regionLimitValueSel} onChange={handleRegionLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                <option value="10">10</option>
                                               <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </li>
                                    </ul>
                                </article>
                            </article>
                        </article>

                        <article className="row border-allsd">
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="settingthtb">
                                    <tr>
                                        <th onClick={() => handleSort('fileName')}>File Name <FontAwesomeIcon
                                        icon={
                                            currentField === 'fileName'
                                            ? currentOrder === 'asc'
                                                ? faSortUp
                                                : faSortDown
                                            : faSort
                                        }
                                        style={{
                                            color: currentField === 'fileName' ? 'black' : '#D7D7D7'
                                        }}
                                        /></th>
                                        <th onClick={() => handleSort('version')}>Firmware Version <FontAwesomeIcon
                                        icon={
                                            currentField === 'version'
                                            ? currentOrder === 'asc'
                                                ? faSortUp
                                                : faSortDown
                                            : faSort
                                        }
                                        style={{
                                            color: currentField === 'version' ? 'black' : '#D7D7D7'
                                        }}
                                        /></th>
                                        <th onClick={() => handleSort('createdTime')}>Created Time  
                                            <FontAwesomeIcon
                                        icon={
                                            currentField === 'createdTime'
                                            ? currentOrder === 'asc'
                                                ? faSortUp
                                                : faSortDown
                                            : faSort
                                        }
                                        style={{
                                            color: currentField === 'createdTime' ? 'black' : '#D7D7D7'
                                        }}
                                        /></th>
                                        <th>Device Type <button className="glyphicon glyphicon-tasks" style={{backgroundColor:"#f2f2f2",paddingTop:'4px',position:'relative',border:'none',fontSize:'12px'}}  ref={columnWrapperRef}  onClick={() => {setShowList(!showList);setSelected('all')}}></button>
                                        {showList && (  <ul className={profileStatusCont ? 'statuslistfm_sub_cont' : 'statuslistfm' }>
                                        {statuses.map(({ label, value }) => ( 
                                            <li key={value}>
                                            <label>
                                                <input
                                                type="checkbox"
                                                className="incl"
                                                checked={selected === value}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => handleChange(value)}
                                                />
                                                {label}
                                            </label>
                                            </li>
                                        ))}
                                        </ul>)}
                                        </th>
                                        <th>Apply</th>
                                        <th>Delete </th>
                                    </tr>

                                </thead>
                                <tbody className="settingbdtb">
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>
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

                                    {!isLoading && !isError.status && (!filteredData || filteredData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {filteredData && filteredData?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.fileName}</td>
                                            <td>{item.version}</td>
                                            <td>{formatDate(item.createdTime)}</td>
                                            <td>{item.deviceType}</td>
                                            <td><i className="fas fa-edit" onClick={() => handleEditLineDt(item)}></i></td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" onClick={()=>handleOpenDeletePopup(item)}></i></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                            {showConfirmDeletePopupStatus && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this firmware?</h1>
                                <article className="f-r">
                                <button className="confirmdeletebtn" type="button" onClick={handleClosePopup}>NO</button>
                                <button className="confirmdeletebtn confirmdeletebtnyes" type="button" onClick={handleConfirmDeleteFirmware}>YES</button>
                                </article>
                                </article>
                            </article>
                            </>}
                               {showConfirmDeleteSuccessPopupStatus && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">Firmware deleted successfully!</p>
                                    </article>
                                        <article className="f-r">
                                            <button className="confirmdeletebtn confirmdeletebtnyes" type="button" onClick={() => setShowConfirmDeleteSuccessPopupStatus(false)}>OK</button>
                                        </article>
                                    </article>
                                </article>
                            )}
                        </article>
                    </article>
                </article>
                <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                    <FirmwareMngSubCont
                        handleSubContainer={handleSubContainer}
                        mode={mode}
                        version={editVersion}
                        refreshLineData={() => getVersionData('api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc')
                        }
                    />
                </article>
                <article className={applyStatusCont ? 'col-4' : 'collapsed'} >
                    <FirmwareManagerApply
                        handleSubContainer={handleSubContainer}
                         mode={mode}
                         version={editVersion}
                        refreshLineData={() => getVersionData('api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc')
                        }
                    />
                </article>

            </article>
        </>
    )
}

export default FirmwareMng;