import React,{useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';


const SnmpSubDefaultCont=({handleSubDefaultContainer})=>{
    

    const handleProfileContclose=()=>{
        handleSubDefaultContainer()
    }



    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">Default Config</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 15px 0 10px'}}>
                                <article>
                                    <label className="vlanlabel">SNMP Version
                                    </label>
                                    <article>
                                        <select className="vlaninput" disabled>
                                            <option value="v1" label="SNMPv1">SNMPv1</option>
                                            <option value="v2c" selected label="SNMPv1-v2c">SNMPv1-v2c</option>
                                        </select>

                                    </article>
                                </article>


                                
                                <article>
                                <label className="settinglabelsub">Read Community
                                </label>
                                <input type="text" name="" value='public' readOnly placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                <article>
                                <label className="settinglabelsub">Write Community</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default SnmpSubDefaultCont;