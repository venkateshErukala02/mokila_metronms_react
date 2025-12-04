import React, { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import './../Inventory/inventory.css';
import FirmwareMngSubCont from "./firmwaremngsub";
import FirmwareManagerApply from "./firmwaremanagerapply";

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

    const getVersionData = async (url) => {
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
                setVersionData(data);
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
        const fetchData = async () => {
            const url = 'api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc'
            await getVersionData(url);

        }
        fetchData();

    }, []);



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
            // { label: "transcoder", value: "transcoder" },
            // { label: "train radio", value: "train radio" },
            { label: "OBC", value: "obc" },
        ];

        const handleChange = (value) => {
            setSelected(value); // only one selected at a time
        };

       const filteredData = versionData.filter(
        (item) => selected === "all" || item.deviceType === selected
        ) || [];


           const handleDeleteFirmMng = async (item) => {
       
        const method = 'POST';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
        const confirmDel = window.confirm("Are you sure you want to delete this firmware?");
    if (!confirmDel) return;
        // const requestBody ={
        // //    firmware: "16_314_Sample.bin"
        //    firmware: `${item.version}_${item.fileName}`
        // }

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/firmware/delete?firmware=${item.version}_${item.fileName}`, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd'
                },
                // body: JSON.stringify(requestBody),
            });

            const text = await response.text();

            if (response.ok) {
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
            console.error('Error:', error);
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); // Turn off loading state
        }

    }

    return (
        <>
            <article className="row">
                <article className={profileStatusCont || applyStatusCont ? 'col-8' : 'col-12'}>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <article className="col-8">
                                <button className="clearfix arrowlf">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <button className="clearfix numcl"><span>1</span></button>
                                <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                            </article>
                            <article className="col-4">
                                <article style={{ float: 'right' }}>
                                    <ul className="setttinglist">

                                        <li>
                                            <button className="clearfix createbtn" onClick={handleProfileContopen}>Upload</button>

                                        </li>

                                        <li>
                                            <select className="form-controlfirm" value={regionLimitValueSel} onChange={handleRegionLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                <option value="0" label="50">50</option>
                                                <option value="1" label="25" defaultValue={25}>25</option>
                                                <option value="2" label="50">50</option>
                                                <option value="3" label="100">100</option>
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
                                        <th>File Name</th>
                                        <th>Firmware Version</th>
                                        <th>Created Time  </th>
                                        <th>Device Type <button class="glyphicon glyphicon-tasks" style={{backgroundColor:"#f2f2f2",paddingTop:'4px',position:'relative',border:'none',fontSize:'12px'}}  onClick={() => {setShowList(!showList);setSelected('all')}}></button>
                                        {showList && (  <ul className={profileStatusCont ? 'statuslistfm_sub_cont' : 'statuslistfm' }>
                                        {statuses.map(({ label, value }) => (
                                            <li key={value}>
                                            <label>
                                                <input
                                                type="checkbox"
                                                className="incl"
                                                checked={selected === value}
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
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" onClick={()=>handleDeleteFirmMng(item)}></i></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
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