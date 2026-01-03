import React,{useState,useEffect} from "react";
import '../ornms.css'
import './../Settings/settings.css';
import NotificationSubCont from "./notificationcreatesubpage";
import NotificationCreateSubCont from "./notificationcreatesubpage";
import NotificationPathSubCont from "./notificationpathsubpage";

const NotificationContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [notifiContStatus,setNotifiContStatus] = useState('CreateNotification')
        const [notificationData, setNotificatioData] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editNotification,setEditNotification] = useState(null);
        const [mode, setMode] =  useState(null);
        const [notificationEventDt,setNotificationEventDt] = useState('');
        const [notificationPathDt,setNotificationPathDt]= useState(null);
        const [disableNotifiBtnStatus,setDisableNotifiBtnStatus] = useState(true);
        const [addPopup,setAddPopup] = useState(false);
        const [addEscaltPopup,setAddEscaltPopup] = useState(false);

        const getNotificatioData = async (url) => {
            setIsLoading(true);
            // setIsError({ status: false, msg: "" });
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
                    setNotificatioData(data);
                    // setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setIsLoading(false);
                // setIsError({ status: true, msg: error.message });
            }
        };


     useEffect(() => { 
            // const url = 'api/v2/eventnotice/list?_s=&limit=10&offset=0&order=asc&orderBy=name'
                                            
            const url='api/v2/eventnotice/list?limit=10&offset=0&sort=asc'
            getNotificatioData(url);
    
        }, []);

        const getNotificationEventDt = async (url) => {
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
                    setNotificationEventDt(data);
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
            // const url = 'api/v2/eventnotice/list?_s=&limit=10&offset=0&order=asc&orderBy=name'
                                            
            const url='api/v2/eventnotice/ueis?vend=keywest&limit=10&offset=0&sort=asc'
            getNotificationEventDt(url);
    
        }, []);


        const getNotificationPathDt = async (url) => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
            try {
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
    
                };
                const response = await fetch(url, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsLoading(false);
                    setNotificationPathDt(data);
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
            // const url = 'api/v2/eventnotice/list?_s=&limit=10&offset=0&order=asc&orderBy=name'
                                            
            const url='api/v2/eventnotice/pathd?_s=&limit=10&offset=0&order=asc&orderBy=name'
            getNotificationPathDt(url);
    
        }, []);
       


    const handleNotfiSubCont = (value) => {
        setNotifiContStatus(value);
        setEditNotification(null);
        setMode('create');
        setProfileStatusCont(true);
    }

    const handleSubContainer=()=>{
        setNotifiContStatus(null);
    }

    const handleAddTarget=()=>{
        setAddPopup(true);
    }

    const handleAddTargetClose=()=>{
        setAddPopup(false);
    }

    const handleAddEscalationTarget=()=>{
        setAddEscaltPopup(true);
    }
    const handleAddEscaltTargetClose=()=>{
        setAddEscaltPopup(false);
    }

    const handleEditSnmpDt=(item)=>{
        setEditNotification(item);
        setMode('edit');
        setNotifiContStatus('createNotification');

    }


    const renderNotificationSubCont=()=>{
        switch (notifiContStatus) {
            case 'createNotification':
                    return <NotificationCreateSubCont
                     handleSubContainer={handleSubContainer}
                    notification={editNotification}
                    notificationEventDt={notificationEventDt}
                    notificationPathDt={notificationPathDt}
                    mode={mode}
                    />
                break;
            case 'createNotificationpath':
                return <NotificationPathSubCont
                 handleSubContainer={handleSubContainer}
                 notificationPathDt={notificationPathDt}
                 handleAddTarget={handleAddTarget}
                 handleAddEscalationTarget={handleAddEscalationTarget}
                 
                 />
            break;
            default:
                return null;
                break;
        }

    }

       const handleDeleteNotifiConfig = async (item) => {
        const method = 'POST';
        const confirmDel = window.confirm("Are you sure you want to delete this notification config?");
    if (!confirmDel) return;
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/eventnotice/delete/${item.name}`, {
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
               const url='api/v2/eventnotice/list?limit=10&offset=0&sort=asc'
            getNotificatioData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false);
        }

    }

        const handleDisableNotificationStatus = () => {
            setDisableNotifiBtnStatus(prev => {
                const nextStatus = !prev;

                const url = nextStatus
                ? "api/v2/eventnotice/notice/On"
                : "api/v2/eventnotice/notice/Off";

                handleDisableNotification(url);

                return nextStatus;
            });
        };



     const handleDisableNotification = async (url) => {
            // setIsLoading(true);
            // setIsError({ status: false, msg: "" });
            try {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
    
                };
                const response = await fetch(url, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    // setIsLoading(false);
                    // setNotificationPathDt(data);
                    // setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                // setIsLoading(false);
                // setIsError({ status: true, msg: error.message });
            }
        };

         const handleToggleStatus = async (item) => {
            const newStatus = item.status === "on" ? "off" : "on";
            try {
            const response = await fetch(`api/v2/eventnotice/notice/${item.name}/${newStatus}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to update notification");

            getNotificatioData("api/v2/eventnotice/list?limit=10&offset=0&sort=asc");
            } catch (error) {
            console.error(error);
            }
        };

    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                   <article className="p-lr">
                                   <button className="createbtn" type="button" onClick={handleDisableNotificationStatus}>{disableNotifiBtnStatus === true ? ("Disable Notification") : ("Enable Notification")}</button>
                                   </article>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            <li>
                                                <button type="button" className="createbtn"  onClick={()=>handleNotfiSubCont('createNotification')}>Create Notification</button>

                                            </li>
                                            <li>
                                                <button type="button" className="createbtn" onClick={()=>handleNotfiSubCont('createNotificationpath')}>Create Destination Path</button>
                                            </li>

                                           
                                        </ul>
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '50vh' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                        <th>Notification </th>
                                            <th>Event</th>
                                            <th>Status</th>
                                            <th>Edit</th>
                                            <th>Delete</th>
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

                                    {!isLoading && !isError.status && (!notificationData || notificationData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {notificationData && notificationData.map((item) => (
                                        <tr key={item.id}>
                                             <td>{item.name}</td>
                                            <td>{item.uei}</td>
                                            <td><><label className="radiolabelnotifipg">
                                        <input type="radio" 
                                        checked={item.status === 'off'}
                                        onChange={() => handleToggleStatus(item)}
                                    />
                                    <span className="notifichecking"></span>
                                    <span className="labeltext">off</span>
                                </label></> <>
                                <label className="radiolabelnotifipg">
                                    <input type="radio" 
                                        onChange={() => handleToggleStatus(item)}
                                        checked={item.status === 'on'}
                                        />
                                    <span className="notifichecking"></span>
                                    <span className="labeltext">on</span>
                                </label></> </td>
                                            <td><i className="fas fa-edit" onClick={()=> handleEditSnmpDt(item)}></i></td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" 
                                            onClick={()=> handleDeleteNotifiConfig(item)}
                                            ></i></td>

                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                               {addPopup &&  <article className="addtargetpopup">
                                    <article className="addtargetpopupboxstyle">
                                        <article className="targetcont">
                                            <h2 className="targettitle">Target</h2>
                                        </article>
                                        <article className="targetart">
                                            <h3 className="initialtitle">Initial Delay</h3>
                                            <hr />
                                    <select  className="selectsecinput">
                                      <option value="0" selected label="0s">0s</option>
                                      <option value="1" label="1s">1s</option>
                                      <option value="2" label="2s">2s</option>
                                      <option value="3" label="5s">5s</option>
                                      <option value="4" label="10s">10s</option>
                                      <option value="5" label="15s">15s</option>
                                      <option value="6" label="30s">30s</option>
                                      <option value="7" label="1m">1m</option>
                                      <option value="8" label="2m">2m</option>
                                      <option value="9" label="5m">5m</option>
                                      <option value="10" label="10m">10m</option>
                                      <option value="11" label="15m">15m</option>
                                      <option value="12" label="30m">30m</option>
                                      <option value="13" label="1h">1h</option>
                                      <option value="14" label="2h">2h</option>
                                      <option value="15" label="3h">3h</option>
                                      <option value="16" label="6h">6h</option>
                                      <option value="17" label="12h">12h</option>
                                      <option value="18" label="1d">1d</option>
                                        </select>
                                             <h3 className="usertitle">Users</h3>
                                            <hr />

                                            <select size="5"
                                     className="selectsecinput">
                                      <option value="admin" label="admin">admin</option>
                                      <option value="rtc" label="rtc">rtc</option>
                                      </select>
                                        </article>
                                        <hr />
                                        <article className="f-r" style={{padding:'0px 14px'}}>
                                            <button className="createbtn" type="button" style={{marginRight:'12px'}}>Add</button>
                                            <button className="createbtn" type="button" onClick={handleAddTargetClose}>Close</button>
                                        </article>
                                    </article>
                                </article> }

                                {addEscaltPopup &&  <article className="addescalttargetpopup">
                                    <article className="addescalttargetpopupboxstyle">
                                        <article className="targetcont">
                                            <h2 className="targettitle">Target</h2>
                                        </article>
                                        <article className="targetart">
                                            <h3 className="initialtitle">Initial Delay</h3>
                                            <hr />
                                    <select  className="selectsecinput">
                                      <option value="0" selected label="0s">0s</option>
                                      <option value="1" label="1s">1s</option>
                                      <option value="2" label="2s">2s</option>
                                      <option value="3" label="5s">5s</option>
                                      <option value="4" label="10s">10s</option>
                                      <option value="5" label="15s">15s</option>
                                      <option value="6" label="30s">30s</option>
                                      <option value="7" label="1m">1m</option>
                                      <option value="8" label="2m">2m</option>
                                      <option value="9" label="5m">5m</option>
                                      <option value="10" label="10m">10m</option>
                                      <option value="11" label="15m">15m</option>
                                      <option value="12" label="30m">30m</option>
                                      <option value="13" label="1h">1h</option>
                                      <option value="14" label="2h">2h</option>
                                      <option value="15" label="3h">3h</option>
                                      <option value="16" label="6h">6h</option>
                                      <option value="17" label="12h">12h</option>
                                      <option value="18" label="1d">1d</option>
                                        </select>
                                        <article className="row">
                                            <article className="col-6 userart">
                                             <h3 className="usertitle">Users</h3>
                                            <hr />

                                            <select size="5"
                                     className="selectsecinput selectsecaddescltinput">
                                      <option value="admin" label="admin">admin</option>
                                      <option value="rtc" label="rtc">rtc</option>
                                      </select>
                                      </article>
                                      <article className="col-6 userart">
                                        <h3 className="usertitle">Groups</h3>
                                            <hr />
                                            <select size="5"
                                     className="selectsecinput selectsecaddescltinput">
                                      <option value="admin" label="admin">admin</option>
                                      <option value="rtc" label="rtc">rtc</option>
                                      </select>
                                      </article>
                                      </article>
                                        </article>
                                        <hr />
                                        <article className="f-r" style={{padding:'0px 14px'}}>
                                            <button className="createbtn" type="button" style={{marginRight:'12px'}}>Add</button>
                                            <button className="createbtn" type="button" onClick={handleAddEscaltTargetClose}>Close</button>
                                        </article>
                                    </article>
                                </article> }
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        {renderNotificationSubCont()}
                    </article> 
                    </article>
        </>
    )
}

export default NotificationContainer;