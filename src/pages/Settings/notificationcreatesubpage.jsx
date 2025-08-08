import React,{useEffect, useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';
 

const NotificationCreateSubCont=({handleSubContainer,notification,mode,notificationEventDt,notificationPathDt})=>{
    
    const isEditMode =  mode === 'edit';

    const [eventNotifiSel,setEventNotifiSel] =  useState('');
    const [nameNotifi, setNameNotifi] = useState('');
    const [description, setDescription] =  useState('');
    const [eventPathSel,setEventPathSel] =  useState('');
    const [textMessage, setTextMessage] = useState('');
    const [shortMessage, setShortMessage] =  useState('');
    const [email, setEmail] =  useState('');
    const [emailError, setEmailError] =  useState('');

 const [isLoading, setIsLoading] = useState(false);
 const [isError, setIsError] = useState({ status: false, msg: "" });
                                 
    const handleProfileContclose=()=>{
        handleSubContainer()
    }
const handleEventNotiSel=(e)=>{
    setEventNotifiSel(e.target.value);
}
const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleEventPathSel=(e)=>{
    setEventPathSel(e.target.value);
  }


  const handleAddNotification = async () => {
    
    const requestBody = isEditMode ? {
        description: description,
        name : nameNotifi,
        path : eventPathSel,
        shortMsg : shortMessage,
        subject : email,
        text : textMessage,
        uei : eventNotifiSel
    }:{
        description: description,
        name : nameNotifi,
        path : eventPathSel,
        shortMsg : shortMessage,
        subject : email,
        text : textMessage,
        uei : eventNotifiSel

    };

    const method = isEditMode ? 'PUT' :'POST';
    const url= isEditMode ? 'api/v2/eventnotice/add' :'api/v2/eventnotice/add';

    try {
        const username = 'admin';
        const password = 'admin';
        const token = btoa(`${username}:${password}`)
        const response = await fetch(url, {
            method,
            headers: {
                'Authorization': `Basic ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (response.ok) {
            // setSuccess('Discovery started successfully');
            alert('Discovery started successfully')
            handleProfileContclose();
            // if(refreshSectionData) refreshSectionData();
            // setSectionName('')
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

useEffect(()=>{
    if(isEditMode && notification){
        setNameNotifi(notification.name || '');
        setDescription(notification.description || '');
        setEventNotifiSel(notification.uei || '');
        setEventPathSel(notification.path || '');
        setTextMessage(notification.text || '');
        setShortMessage(notification.shortMsg || '');
        setEmail(notification.subject || '');

    }else{
        setNameNotifi('');
        setDescription('');
        setEventNotifiSel('');
        setEventPathSel('');
        setTextMessage('');
        setShortMessage('');
        setEmail('');

    }
},[mode,notification])

 

    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">{isEditMode ? 'Update Notification' : 'New Notification'}</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={nameNotifi}
                                onChange={(e)=> setNameNotifi(e.target.value)}
                                />
                                <article>
                                <label className="settinglabelsub">Description</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={description}
                                onChange={(e)=> setDescription(e.target.value)}
                                />
                                </article>
                                <article>
                                    <label className="vlanlabel">Events</label>
                                    <article>
                                        <select className="vlaninput" value={eventNotifiSel} onChange={handleEventNotiSel}>
                                            <option value="?" label=""></option>
                                           {notificationEventDt && notificationEventDt.map((item)=>(
                                            <option value={item.key} label={item.value}>{item.value}</option>
                                           ))}
                                        </select>

                                    </article>
                                </article>
                                <article>
                                    <label className="vlanlabel">Choose a path:</label>
                                    <article>
                                        <select className="vlaninput" value={eventPathSel} onChange={handleEventPathSel}>
                                            <option value="?" label=""></option>
                                            {notificationPathDt && notificationPathDt.map((item)=>(
                                                <option value={item.name} label={item.name}>{item.name}</option>
                                            ))}
                                        </select>

                                    </article>
                                </article>
                                <article>
                                <label className="settinglabelsub">Text Message</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={textMessage}
                                onChange={(e)=> setTextMessage(e.target.value)}
                                />
                                </article>

                                <article>
                                <label className="settinglabelsub">Short Message</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={shortMessage}
                                onChange={(e)=> setShortMessage(e.target.value)}
                                />
                                </article>
                                <article>
                                <label className="settinglabelsub">Email Subject</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={email}
                                onChange={(e)=> {
                                   const val= e.target.value;
                                    setEmail(val);
                                    if(!validateEmail(val)){
                                        setEmailError('Invalid email address');
                                    } else {
                                    setEmailError('');
                                    }
                                }}
                                />
                                </article>

                                <article className="uploadcont">
                                
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button className="cancelbtn">Cancle</button>
                                        <button className="creatsetingbtn" onClick={handleAddNotification}>
                                            {isEditMode ? 'Update' : 'Create'}
                                            </button>
                                </center>
                               {!isEditMode && <article>
                                <p className="notepara">Special Values:</p>
                                <hr className="hrnote" />
                                <ul className="clearfix notelist">
                                    <li>
                                    %noticeid% : Notification ID number
                                    </li>
                                    <li>
                                    %time% : Time sent
                                    </li>
                                    <li>
                                    %severity% : Event Severity
                                    </li>
                                    <li>
                                    %nodelabel% : IP Address of the device
                                    </li>
                                </ul>
                                </article>} 
                           
                                </article>
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default NotificationCreateSubCont;