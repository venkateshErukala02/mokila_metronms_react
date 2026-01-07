import React,{useEffect, useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';
 

const NotificationPathSubCont=({handleSubContainer,notificationPathDt,handleAddTarget,handleAddEscalationTarget,selectedAddUsers,escalations,handleEditDestination,editMode,name,initialDelayProp})=>{

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [path,setPath] = useState('');
    const [initialDelay,setInitialDelay] = useState('');
    const [localName,setLocalName] = useState("");

    const handleProfileContclose=()=>{
        handleSubContainer();
        setLocalName("");
        setInitialDelay("");
        setPath("");
    }


    const handleAdd=()=>{
        handleAddTarget()
    }

    const handleAddEscalation=()=>{
        handleAddEscalationTarget()
    }

    const handleEditNotifiConfig=()=>{
        handleEditDestination(path)
    }

    const handleDeletePath = async () => {
            setLoading(true);
            setError({ status: false, msg: "" }); 
            try {
                const options = {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
    
                };
                const response = await fetch(`api/v2/eventnotice/path/delete/${path}`, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    handleProfileContclose();
                    setLoading(false);
                    setError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setLoading(false);
                setError({ status: true, msg: error.message });
            }
        };



    const handleCreateDestinPath = async () => {

        const escalationTargets = escalations.map(esc => {
        const targets = [];

        if (esc.users && esc.users.length) {
            esc.users.forEach(user => {
                targets.push({
                    autoNotify: "on",
                    interval: "0s",
                    name: user,
                    commands: ["javaEmail"]
                });
            });
        }

        if (esc.groups && esc.groups.length) {
            esc.groups.forEach(group => {
                targets.push({
                    autoNotify: "on",
                    interval: "5m", 
                    name: group,
                    commands: ["javaEmail"]
                });
            });
        }

        return {
            delay: esc.delay || "0s",
            targets
        };
    });

    const initialDelay = selectedAddUsers.map(user => ({
        autoNotify: "on",
        interval: "0s",
        name: user,
        commands: ["javaEmail"]
    }));

        const requestBody =  {
           

        // }: {
            escalations: escalationTargets,
            initialDelay:"0s",
            initialTargets: initialDelay,
            name: localName,
            
        };
        const method = editMode ? 'POST' : 'POST';
        const url = editMode ? 'api/v2/eventnotice/path/add' :'api/v2/eventnotice/path/add'
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
                handleProfileContclose();
                // if(refreshStationData) refreshStationData();
                setLocalName("");
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); 
        }

    }



   useEffect(() => {
        setLocalName(name);
        setInitialDelay(initialDelayProp);
    }, [name,initialDelayProp]);

 

    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">Destination Paths</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Modify Path</label>
                                <hr className="hrnote" />
                                <article>
                                    <label className="vlanlabel">Paths</label>
                                    <article>
                                    <select className="vlaninput" value={path} onChange={(e)=>setPath(e.target.value)}>
                                            <option value="?" label=""></option>
                                            {notificationPathDt && notificationPathDt.map((item)=>(
                                                <option value={item.name} label={item.name}>{item.name}</option>
                                            ))}
                                        </select>

                                    </article>
                                </article>
                                  <article style={{padding:'15px 0'}}>
                                  <center>
                                        <button className="cancelbtn" type="button" onClick={handleDeletePath}>Delete</button>
                                        <button className="creatsetingbtn" type="button" onClick={handleEditNotifiConfig}>Edit</button>
                                </center>
                                </article>
                               
                                <hr className="hrnote" />
                                <article>
                                <label className="settinglabelsub">Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                 value={localName}
                                onChange={(e) => setLocalName(e.target.value)}
                                    />
                                </article>
                                <article>
                                    <label className="vlanlabel">Initial Delay</label>
                                    <article>
                                    <select  className="vlaninput" value={initialDelay} onChange={(e)=> setInitialDelay(e.target.value)}>
                                      <option value="0s">0s</option>
                                      <option value="1s">1s</option>
                                      <option value="2s">2s</option>
                                      <option value="5s">5s</option>
                                      <option value="10s">10s</option>
                                      <option value="15s">15s</option>
                                      <option value="30s">30s</option>
                                      <option value="1m">1m</option>
                                      <option value="2m">2m</option>
                                      <option value="5m">5m</option>
                                      <option value="10m">10m</option>
                                      <option value="15m">15m</option>
                                      <option value="30m">30m</option>
                                      <option value="1h">1h</option>
                                      <option value="2h">2h</option>
                                      <option value="3h">3h</option>
                                      <option value="6h">6h</option>
                                      <option value="12h">12h</option>
                                      <option value="1d">1d</option>
                                        </select>

                                    </article>
                                </article>
                                <article>
                                <label className="settinglabelsub">Initail Target:</label>
                                <select className="form-control notificform" style={{ height: '50px' }} size="4">
                                     {Array.isArray(selectedAddUsers) && selectedAddUsers.map((item,index)=>(
                                            <option value={item} key={index} >{item}</option>
                                     ))}
                                                </select>
                                <button type="button" className="escalatebtn" onClick={handleAdd}>Add</button>
                                </article>
                                <article>
                                    {escalations.map((esc, index) => (
                                    <div key={index}>
                                        <label className="settinglabelsub">Escalation {index + 1}:</label>
                                        <select
                                        className="form-control notificform"
                                        style={{ height: '50px' }}
                                        size={esc.users.length + esc.groups.length} 
                                        >
                                        {esc.users.map((user, i) => (
                                            <option value={user} key={`user-${i}`}>
                                            {user}
                                            </option>
                                        ))}
                                        {esc.groups.map((group, i) => (
                                            <option value={group} key={`group-${i}`}>
                                            {group}
                                            </option>
                                        ))}
                                        </select>
                                    </div>
                                    ))}
                                <label className="vlanlabel">Add Escalation</label>
                                    <button type="button" className="escalatebtn" onClick={handleAddEscalation}>
                                        Add Escalation
                                    </button>
                                </article>
                                <article style={{padding:'15px 0'}}>
                                <center className="d-f">
                                        <button className="cancelbtn" type="button" onClick={handleProfileContclose}>Cancle</button>
                                        <button className="creatsetingbtn" type="buttton" onClick={handleCreateDestinPath}>{editMode ? 'Update' : 'Create'}</button>
                                </center>
                                </article>
                               
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default NotificationPathSubCont;