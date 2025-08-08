import React,{useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';
 

const NotificationPathSubCont=({handleSubContainer,notificationPathDt})=>{
    

    const handleProfileContclose=()=>{
        handleSubContainer()
    }


 

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
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Modify Path</label>
                                <hr className="hrnote" />
                                <article>
                                    <label className="vlanlabel">Paths</label>
                                    <article>
                                    <select className="vlaninput">
                                            <option value="?" label=""></option>
                                            {notificationPathDt && notificationPathDt.map((item)=>(
                                                <option value={item.name} label={item.name}>{item.name}</option>
                                            ))}
                                        </select>

                                    </article>
                                </article>
                                  <article style={{padding:'15px 0'}}>
                                  <center>
                                        <button className="cancelbtn">Cancle</button>
                                        <button className="creatsetingbtn">Create</button>
                                </center>
                                </article>
                               
                                <hr className="hrnote" />
                                <article>
                                <label className="settinglabelsub">Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                <article>
                                    <label className="vlanlabel">Initial Delay</label>
                                    <article>
                                        <select class=""  className="vlaninput">
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

                                    </article>
                                </article>
                                <article>
                                <label className="settinglabelsub">Initail Target:</label>
                                <select className="form-control notificform" style={{ height: '50px' }} size="4">
                                                </select>
                                <button className="escalatebtn">Add</button>
                                </article>
                                <article>
                                <label className="vlanlabel">Add Escalation</label>
                                    <button className="escalatebtn">
                                        Add Escalation
                                    </button>
                                </article>
                                <article style={{padding:'15px 0'}}>
                                <center className="d-f">
                                        <button className="cancelbtn">Cancle</button>
                                        <button className="creatsetingbtn">Create</button>
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