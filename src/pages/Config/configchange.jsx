import { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import ConfigChangeSub from "./configchangesub";
import FirmwarePopupTable from "./firmwarepopuptable";

const ConfigChange = () => {
    const [profileStatusCont, setProfileStatusCont] = useState(false);
    const [configChangeData, setConfigChangeData] = useState([]);
    const [userLimitValueSel, setUserLimitValueSel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [mode, setMode] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [selected, setSelected] = useState(4);
    const [showList, setShowList] = useState(false);
    const previousDataRef = useRef(null);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const [showPopup,setShowPopup] = useState(false);
    const [configpopupData,setConfigpopupData] = useState([]);

    const statuses = [
        { label: "All", value: 4 },
        { label: "Pending", value: 0 },
        { label: "Running", value: 1 },
        { label: "Successful", value: 2 },
        { label: "Failed", value: 3 },
    ];

    const handleChange = (value) => {
        setSelected(value); 
    };

     const handleConfigChangePopup=(data)=>{
        setShowPopup(true);
        setConfigpopupData(data);
    }
        
    const getConfigChangeData = async (url,isInterval = false) => {
        if(previousDataRef.current === ''){
            console.log('mmmpppp');
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
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },

            };
            const response = await fetch(url, options);

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                 if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
                    setConfigChangeData(data);
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


     useEffect(() => {

        const fetchIntervalData = () => {
        const url = `api/v2/task/list?show=configpush&status=${selected}&offset=0&count=25`;
    
        getConfigChangeData(url,true);
        }

         fetchIntervalData();

  const intervalId = setInterval(fetchIntervalData, 10000);
    
        return () => clearInterval(intervalId);
    
    }, [selected]);

    const handleUserLimitValue = (event) => {
        setUserLimitValueSel(event.target.value);

    }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditUser(null);
        setMode('create');
    }

    const handleSubContainer = (shouldRefresh = false) => {
        setProfileStatusCont(false)
    }
    const handleEditUserDt = (user) => {
        setProfileStatusCont(true);
        setMode('edit');
        setEditUser(user);
    }


     const handleDeleteConfigChange = async (item) => {
    const confirmDel = window.confirm("Are you sure you want to delete this config?");
    if (item.status === 'Running') {
        alert("Running task cannot be cancelled.");
        return;
    }
    if (!confirmDel) return;

    setIsLoading(true);

    try {
        const username = 'admin';
        const password = 'admin';
        const token = btoa(`${username}:${password}`);
        let url='';
        if(item.status === 'Pending'){
            url = `api/v2/task/canceltask/${item.taskId}`
        }else{
            url = `api/v2/task/deletetask/${item.taskId}`
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });

        if (response.ok) {
            await getConfigChangeData(
                `api/v2/task/list?show=configpush&status=${selected}&offset=0&count=25`
            );
        } else {
            setIsError({
                status: true,
                msg: 'Failed to delete task'
            });
        }
    } catch (error) {
        console.error('Error:', error);
        setIsError({
            status: true,
            msg: error.message
        });
    } finally {
        setIsLoading(false);
    }
    };




    const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
        prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
    );
};

const toggleSelectAll = () => {
    if (selectedTasks.length === configChangeData.length) {
        setSelectedTasks([]); 
    } else {
        setSelectedTasks(configChangeData.map(item => item.taskId));
    }
};

const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    const confirmDel = window.confirm(
        `Delete ${selectedTasks.length} selected tasks?`
    );
    if (!confirmDel) return;

    setIsLoading(true);

    const username = 'admin';
    const password = 'admin';
    const token = btoa(`${username}:${password}`);

    const requestBody = {
        list: selectedTasks   
    };

    try {
        const response = await fetch(`api/v2/task/deletetasks`, {
            method: "POST",
            headers: {
                'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Bulk delete failed");
        }

        await getConfigChangeData(
                `api/v2/task/list?show=configpush&status=${selected}&offset=0&count=25`
        );

        setSelectedTasks([]);

    } catch (error) {
        console.error("Bulk delete error:", error);
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
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
                                            <button className="clearfix createbtn" disabled={selectedTasks.length === 0}
                                            onClick={handleBulkDelete}>Delete Selected</button>
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

                        <article className="row border-allsd">
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="settingthtb"> 
                                    <tr>
                                        <th><input className="incl2" type="checkbox"
                                         checked={selectedTasks.length === configChangeData.length && configChangeData.length > 0}
                                            onChange={toggleSelectAll}
                                        /></th>
                                        <th>Task ID</th>
                                        <th>Task Name</th>
                                        <th>Scheduled Time</th>
                                        <th>Status
                                            <button className="glyphicon glyphicon-tasks configchangeicon"  onClick={() => {setShowList(!showList);setSelected(4)}}></button>
                                        {showList && (  <ul className={profileStatusCont ? 'configchngstatuslist_sub_cont' : 'configchngstatuslist'}>
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

                                    {!isLoading && !isError.status && (!configChangeData || configChangeData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {configChangeData && configChangeData.map((item) => (
                                        <tr key={item.id} onClick={()=>handleConfigChangePopup(item)}>
                                           <td> <input
                                                type="checkbox"
                                                className="incl"
                                                checked={selectedTasks.includes(item.taskId)}
                                                onChange={() => toggleTaskSelection(item.taskId)}
                                                onClick={(e) => e.stopPropagation()} 
                                            /></td>
                                            <td>{item.taskId}</td>
                                            <td>{item.task}</td>
                                            <td>{item.dateNTime}</td>
                                            <td>{item.status}</td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" onClick={() => handleDeleteConfigChange(item)}></i></td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </article>
                    </article>
                    {showPopup && (
                        <div className="firmwarepopupStyle">
                        <div className="firmwarepopupBoxStyle">
                            <article>
                                <i className="fa fa-close noticlose" role="button" tabindex="0" onClick={() => setShowPopup(false)} style={{ marginBottom: '5px', float: 'right',transform:'translateY(-8px)',fontSize:'15px',paddingRight:'12px' }}></i>
                            </article>
                            <article style={{display:'inline-block'}}>
                            <FirmwarePopupTable firmpopupData={configpopupData} />
                            </article>
                        </div>
                        </div>
                    )}
                </article>

                <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                    <ConfigChangeSub handleSubContainer={handleSubContainer} />
                </article>
            </article>
        </>
    )
}

export default ConfigChange;