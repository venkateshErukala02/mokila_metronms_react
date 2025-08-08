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
        
        const getNotificatioData = async (url) => {
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
                    setNotificatioData(data);
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
                                            
            const url='api/v2/eventnotice/pathd?limit=10&offset=0&sort=asc'
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
                 
                 />
            break;
            default:
                return null;
                break;
        }

    }

    



 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                   <article className="p-lr">
                                   <button className="clearfix createbtn">Disable Notification</button>
                                   </article>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            <li>
                                                <button className="clearfix createbtn"  onClick={()=>handleNotfiSubCont('createNotification')}>Create Notification</button>

                                            </li>
                                            <li>
                                                <button className="clearfix createbtn" onClick={()=>handleNotfiSubCont('createNotificationpath')}>Create Destination Path</button>
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
                                            <td>{item.status}</td>
                                            <td><i className="fas fa-edit" onClick={()=> handleEditSnmpDt(item)}></i></td>
                                            <td><i className="fa fa-trash"></i></td>

                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
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