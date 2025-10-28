import React, { useState, useEffect } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import './../Inventory/inventory.css';
import FirmwareContainerSub from "./firmwaresub";

const FirmwareContainer = () => {
    const [profileStatusCont, setProfileStatusCont] = useState(true);
    const [firmwareData, setFirmwareData] = useState([]);
    const [userLimitValueSel, setUserLimitValueSel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [mode, setMode] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [selected, setSelected] = useState(4);
    const [showList, setShowList] = useState(false);

    const getFimwareData = async (url) => {
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
                setFirmwareData(data);
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

        const url = `api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`;
        getFimwareData(url);

    }, []);

    useEffect(() => {

        const url = `api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`;
        getFimwareData(url);

    }, [selected]);

    const handleUserLimitValue = (event) => {
        setUserLimitValueSel(event.target.value);

    }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditUser(null);
        setMode('create');
    }

    const handleSubContainer = () => {
        setProfileStatusCont(false)
    }
    const handleEditUserDt = (user) => {
        setProfileStatusCont(true);
        setMode('edit');
        setEditUser(user);
    }



  const statuses = [
    { label: "All", value: 4 },
    { label: "Pending", value: 0 },
    { label: "Running", value: 1 },
    { label: "Successful", value: 2 },
    { label: "Failed", value: 3 },
  ];

const handleChange = (value) => {
    setSelected(value); // only one selected at a time
  };
    return (
        <>
            <article className="row">
                <article className={profileStatusCont ? 'col-8' : 'col-12'}>
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
                                            <button className="clearfix createbtn">Delete</button>
                                        </li>
                                        <li>
                                            <button className="clearfix createbtn" onClick={handleProfileContopen}>New Task</button>

                                        </li>

                                        <li>
                                            <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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
                                <thead className="settingthtb" style={{position:'relative'}}>
                                    <tr>
                                        <th><input className="incl2" type="checkbox"/></th>
                                        <th>Task ID</th>
                                        <th>Task Name</th>
                                        <th>Scheduled Time</th>
                                        <th>Status <button class="glyphicon glyphicon-tasks" style={{backgroundColor:"#f2f2f2",paddingTop:'4px',position:'relative',border:'none',fontSize:'12px'}}  onClick={() => {setShowList(!showList);setSelected(4)}}></button>
                                        {showList && (  <ul className="statuslist">
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
                                        {/* <th>Apply</th> */}
                                        <th>Cancel</th>
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

                                    {!isLoading && !isError.status && (!firmwareData || firmwareData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {firmwareData && firmwareData.map((item) => (
                                        <tr key={item.id}>
                                            <td><input type="checkbox" className="incl"
                                                    checked='' onChange=''
                                                /></td>
                                            <td>{item.taskId}</td>
                                            <td>{item.task}</td>
                                            <td>{item.dateNTime}</td>
                                            <td>{item.status}</td>
                                            {/* <td ><i className="fas fa-edit" onClick={() => handleEditUserDt(item)}></i></td> */}
                                            <td><i className="fa fa-trash"></i></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </article>
                    </article>
                </article>

                <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                    <FirmwareContainerSub />
                </article>
            </article>
        </>
    )
}

export default FirmwareContainer;