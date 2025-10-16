import React, { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Settings/settings.css';
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

                        <article className="row border-allsd" style={{ height: '50vh' }}>
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="settingthtb">
                                    <tr>
                                        <th>File Name</th>
                                        <th>Firmware Version</th>
                                        <th>Created Time  </th>
                                        <th>Device Type</th>
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

                                    {!isLoading && !isError.status && (!versionData || versionData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {versionData && versionData?.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.fileName}</td>
                                            <td>{item.version}</td>
                                            <td>{formatDate(item.createdTime)}</td>
                                            <td>{}</td>
                                            <td><i className="fas fa-edit" onClick={() => handleEditLineDt(item)}></i></td>
                                            <td><i className="fa fa-trash"></i></td>
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
                        // refreshLineData={() => getVersionData('api/v2/firmware/firmwares?&page=1&limit=50&sort=fileName.asc')
                        // }
                    />
                </article>

            </article>
        </>
    )
}

export default FirmwareMng;