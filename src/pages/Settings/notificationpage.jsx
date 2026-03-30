import React,{useState,useEffect, useRef} from "react";
import '../ornms.css'
import './../Settings/settings.css';
import NotificationSubCont from "./notificationcreatesubpage";
import NotificationCreateSubCont from "./notificationcreatesubpage";
import NotificationPathSubCont from "./notificationpathsubpage";
import { useSelector } from "react-redux";

const NotificationContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [notifiContStatus,setNotifiContStatus] = useState('CreateNotification')
        const [notificationData, setNotificatioData] = useState([]);
        const [notificationStatus, setNotificationStatus] = useState(null);
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editNotification,setEditNotification] = useState(null);
        const [mode, setMode] =  useState(null);
        const [notificationEventDt,setNotificationEventDt] = useState('');
        const [notificationPathDt,setNotificationPathDt]= useState(null);
        const [disableNotifiBtnStatus,setDisableNotifiBtnStatus] = useState(true);
        const [addPopup,setAddPopup] = useState(false);
        const [addEscaltPopup,setAddEscaltPopup] = useState(false);
        const [selectedUser, setSelectedUser] = useState("");
        const [selectedAddUsers, setSelectedAddUsers] = useState([]);
        const [escalations, setEscalations] = useState([]);
        const [selectedEscUsers, setSelectedEscUsers] = useState([]);
        const [selectedEscGroups, setSelectedEscGroups] = useState([]);
        const [editMode,setEditMode] = useState(false);
        const [name,setName] = useState("");
        const [initialDelayProp,setInitialDelayProp] = useState("");
        const [notifiGroupUserData,setNotifiGroupUserData] = useState("");
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';
        const [itemToDelete, setItemToDelete] = useState(null);
        const [showDeletePopup, setShowDeletePopup] = useState(false);
        const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);

         useEffect(() => {                  
            const url='api/v2/eventnotice/ugrlist?_s=&limit=10&offset=0&order=asc&orderBy=name';

            getNotificationGroupUserDt(url);
            getNotifiStatus();
    
        }, []);

          const getNotificationGroupUserDt = async (url) => {
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
                    setNotifiGroupUserData(data);
                    // setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setIsLoading(false);
                // setIsError({ status: true, msg: error.message });
            }
        };

        const getNotificatioData = async (url) => {
            setIsLoading(true);
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
                    setNotificatioData(data);
                    // setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                // setIsError({ status: true, msg: error.message });
            }finally {
                    setIsLoading(false);
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
        setSelectedUser("");
        setSelectedAddUsers([]);
        setEscalations([]);
        setSelectedEscUsers([]);
        setSelectedEscGroups([]);
        setName("");
        setInitialDelayProp("");

    }

    const handleAddTarget=()=>{
        setAddPopup(true);
    }

    const handleAddTargetClose=()=>{
        setAddPopup(false);
    }

    const handleAddTargetUsers=()=>{
        if (!selectedUser) return;

        setSelectedAddUsers(prev => [...prev, selectedUser]);
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

 const handleEditDestination = (path) => {

    const data = notificationPathDt.find(p => p.name === path);
    if (!data) return;

    setName(data.name);

    if (Array.isArray(data.initialTargets)) {
        const users = data.initialTargets.map(target => target.name);
        setSelectedAddUsers(users);
    } else {
        setSelectedAddUsers([]);
    }

    if (Array.isArray(data.escalations)) {
        const esc = data.escalations.map(e => {
            const users = [];
            const groups = [];

            e.targets.forEach(t => {
                if ((t.name)) {
                    groups.push(t.name);
                } else {
                    users.push(t.name);
                }
            });

            return {
                delay: e.delay,
                users,
                groups
            };
        });

        setEscalations(esc);
    } else {
        setEscalations([]);
    }

    setInitialDelayProp(data.initialDelay ?? "0s");

    setEditMode(true);
    setNotifiContStatus('createNotificationpath');
};



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
                 selectedAddUsers={selectedAddUsers}
                 escalations={escalations}
                 handleAddTarget={handleAddTarget}
                 handleAddEscalationTarget={handleAddEscalationTarget}
                 handleEditDestination={handleEditDestination}
                 editMode={editMode}
                 name={name}
                 initialDelayProp={initialDelayProp}
                 />
            break;
            default:
                return null;
                break;
        }

    }

       const handleDeleteNotifiConfig = async (item) => {
        const method = 'POST';
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
                  setShowDeleteSuccessPopup(true);
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

     const getNotifiStatus = async () => {
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
                const response = await fetch('api/v2/eventnotice/status?_s=&limit=10&offset=0&order=asc&orderBy=name', options);
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsLoading(false);
                    setNotificationStatus(data);
                    // setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setIsLoading(false);
                // setIsError({ status: true, msg: error.message });
            }
        };

        const handleDisableNotificationStatus = () => {
            setDisableNotifiBtnStatus(prev => {
                const nextStatus = !prev;
                const url = nextStatus
                ? "api/v2/eventnotice/notice/On"
                : "api/v2/eventnotice/notice/Off";

                handleDisableNotification(url);
                getNotifiStatus()
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


        const handleAddEscalation = () => {
            if (selectedEscUsers.length === 0 && selectedEscGroups.length === 0) return;

            setEscalations(prev => [
                ...prev,
                {
                users: selectedEscUsers,
                groups: selectedEscGroups
                }
            ]);

            setSelectedEscUsers([]);
            setSelectedEscGroups([]);
            setAddEscaltPopup(false);
            };

    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-4">
                                   <article className="p-lr">
                                   <button className="createbtn" type="button" onClick={handleDisableNotificationStatus}>{disableNotifiBtnStatus === true ? ("Disable Notification") : ("Enable Notification")}</button>
                                   </article>
                                </article>
                                <article className="col-8">
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

                            <article className="row border-allsd">
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

                                    {!isLoading && Array.isArray(notificationData) && notificationData.length === 0 && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                            No Data Available
                                            </td>
                                        </tr>
                                        )}
                                    {Array.isArray(notificationData) && notificationData.map((item) => (
                                        <tr key={item.id}>
                                             <td>{item.name}</td>
                                            <td>{item.uei}</td>
                                            <td><><label className="radiolabelnotifipg">
                                        <input type="radio" 
                                        checked={item.status === 'off'}
                                        onChange={currentUser !== 'Read-only' ?() => handleToggleStatus(item) : undefined}
                                    />
                                    <span className="notifichecking"></span>
                                    <span className="labeltext">off</span>
                                </label></> <>
                                <label className="radiolabelnotifipg">
                                    <input type="radio" 
                                        onChange={currentUser !== 'Read-only' ? () => handleToggleStatus(item) : undefined}
                                        checked={item.status === 'on'}
                                        />
                                    <span className="notifichecking"></span>
                                    <span className="labeltext">on</span>
                                </label></> </td>
                                            <td><i className="fas fa-edit" onClick={currentUser !== 'Read-only' ? ()=> handleEditSnmpDt(item) : undefined}></i></td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" 
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentUser !== 'Read-only') {
                                                setItemToDelete(item);
                                                setShowDeletePopup(true);
                                                }
                                            }}
                                          
                                            style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                color: isReadOnly ? "black" : "#ef0808",
                                                opacity: isReadOnly ? 0.6 :1 
                                            }}
                                            title={isReadOnly ? "Permission required" :''}

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
                                     className="selectsecinput" value={selectedUser}onChange={(e) => setSelectedUser(e.target.value)}>
                                      {notifiGroupUserData && notifiGroupUserData?.users?.map((item)=>
                                                <option value={item} label={item}>{item}</option> )}
                                      </select>
                                        </article>
                                        <hr />
                                        <article className="f-r" style={{padding:'0px 14px'}}>
                                            <button className="createbtn" type="button" style={{marginRight:'12px'}} onClick={handleAddTargetUsers}>Add</button>
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

                                            <select size="5"  value={selectedEscUsers}
                                             multiple
                                            onChange={(e) =>
                                                setSelectedEscUsers(
                                                Array.from(e.target.selectedOptions, o => o.value)
                                                )
                                            }
                                     className="selectsecinput selectsecaddescltinput">
                                      {notifiGroupUserData && notifiGroupUserData?.users?.map((item)=>
                                                <option value={item} label={item}>{item}</option> )}
                                      </select>
                                      </article>
                                      <article className="col-6 userart">
                                        <h3 className="usertitle">Groups</h3>
                                            <hr />
                                            <select size="5" value={selectedEscGroups}
                                             multiple
                                            onChange={(e) =>
                                                setSelectedEscGroups(
                                                Array.from(e.target.selectedOptions, o => o.value)
                                                )
                                            }
                                     className="selectsecinput selectsecaddescltinput">
                                        {notifiGroupUserData && notifiGroupUserData?.groups?.map((item)=>
                                                <option value={item} label={item}>{item}</option> )}
                                      </select>
                                      </article>
                                      </article>
                                        </article>
                                        <hr />
                                        <article className="f-r" style={{padding:'0px 14px'}}>
                                            <button className="createbtn" type="button" style={{marginRight:'12px'}} onClick={handleAddEscalation}>Add</button>
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
                      {showDeletePopup && itemToDelete && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this notificaton?</h1>
                                <article className="f-r">
                                     <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowDeletePopup(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleDeleteNotifiConfig(itemToDelete);
                                            setShowDeletePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}

                             {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The notificaton has been deleted successfully.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => setShowDeleteSuccessPopup(false)}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
        </>
    )
}

export default NotificationContainer;