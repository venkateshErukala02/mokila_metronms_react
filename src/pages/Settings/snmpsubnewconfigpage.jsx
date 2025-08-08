import React,{useEffect, useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';


const SnmpSubNewconfigCont=({handleSubNewconfigContainer,Snmp,refreshSnmpData,mode})=>{

    const isEditMode =  mode === 'edit';

            const [beginIp,setBeginIp] =  useState('');
            const [endIp,setEndIp] = useState('');
            const [readCommunity,setReadCommunity] = useState('');
            const [writeCommunity,setWriteCommunity] =  useState('');
            const [snmpVersValueSel,setSnmpVersValueSel] = useState();
            const [snmpVersLabelSel, setSnmpVersLabelSel] =  useState('');
    

    const handleProfileNewconfigContclose=()=>{
        handleSubNewconfigContainer()
    }

  useEffect(()=>{
    if(isEditMode && Snmp){
            setBeginIp(Snmp.begin || '');
            setEndIp(Snmp.end || '');
            setWriteCommunity(Snmp.writeCommunity || '');
            setReadCommunity(Snmp.readCommunity || '');
    }else{
        setBeginIp('');
        setEndIp('');
        setWriteCommunity('');
        setReadCommunity('');
    }
  },[Snmp,mode])

  const handleSnmpVersion=(e)=>{
    setSnmpVersValueSel(e.target.value);
    setSnmpVersLabelSel(e.target.options[e.target.selectedIndex].text);
  }


    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">{isEditMode ? 'Snmp Configuration' : 'New Config'}</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileNewconfigContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 15px 0 10px'}}>
                                <article>
                                    <label className="vlanlabel">SNMP Version
                                    </label>
                                    <article>
                                        <select className="vlaninput" value={snmpVersValueSel} onChange={handleSnmpVersion}>
                                        <option value="v1" label="SNMPv1">SNMPv1</option>
                                            <option value="v2c" selected label="SNMPv1-v2c">SNMPv1-v2c</option>
                                        </select>

                                    </article>
                                </article>

                                <article>
                                <label className="settinglabelsub">{isEditMode ? 'Begin Address' :'Begin IP Address'}
                                </label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                    value={beginIp}
                                onChange={(e)=> setBeginIp(e.target.value)}
                                />
                                </article>
                                <article>
                                <label className="settinglabelsub">{isEditMode ? 'End Address' : 'End IP Address'}</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={endIp}
                                onChange={(e)=> setEndIp(e.target.value)}
                                />
                                </article>
                                
                                <article>
                                <label className="settinglabelsub">{isEditMode ? 'Read Password' : 'Read Community'}
                                </label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={readCommunity}
                                onChange={(e)=> setReadCommunity(e.target.value)}
                                />
                                </article>
                                <article>
                                <label className="settinglabelsub">{isEditMode ? 'Write Password' :'Write Community'}</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={writeCommunity}
                                onChange={(e)=> setWriteCommunity(e.target.value)}
                                />
                                </article>

                                <hr className="hrnote" />
                                <center className="d-f">
                                    <button className="cancelbtn" onClick={handleProfileNewconfigContclose}>Cancle</button>
                                    <button className="creatsetingbtn" onClick=''>
                                      {isEditMode ? 'Update' : 'Create'}
                                        </button>
                                </center>
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default SnmpSubNewconfigCont;