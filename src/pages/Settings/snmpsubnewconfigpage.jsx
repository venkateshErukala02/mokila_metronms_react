import React,{useEffect, useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';
import { useSelector } from "react-redux";


const SnmpSubNewconfigCont=({handleSubNewconfigContainer,Snmp,refreshSnmpData,mode})=>{

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [securityName,setSecurityName] = useState('roV3user');
    const [authPassphrase,setAuthPassphrase] = useState('');
    const [privacyPassphrase,setPrivacyPassphrase] = useState('');
    const [securityLevelValue,setSecurityLevelValue] = useState('2');
    const [securityLevelLabel,setSecurityLevelLabel] = useState('AuthPriv');
    const [authProtocolValue,setAuthProtocolValue] = useState('3');
    const [authProtocolLabel,setAuthProtocolLabel] = useState('AES-128');
    const [privacyProtocolValue,setPrivacyProtocolValue] = useState('3');
    const [privacyProtocolLabel,setPrivacyProtocolLabel] = useState('SHA');


    const isEditMode =  mode === 'edit';
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);

            const [beginIp,setBeginIp] =  useState('');
            const [endIp,setEndIp] = useState('');
            const [readCommunity,setReadCommunity] = useState('');
            const [writeCommunity,setWriteCommunity] =  useState('');
            const [snmpVersValueSel,setSnmpVersValueSel] = useState('v2c');
            const [snmpVersLabelSel, setSnmpVersLabelSel] =  useState('SNMPv1-v2c');
    

    const handleProfileNewconfigContclose=()=>{
        handleSubNewconfigContainer()
    }

  useEffect(()=>{
    if(isEditMode && Snmp){
            setSnmpVersValueSel('v2c');
            setSnmpVersLabelSel('SNMPv1-v2c');
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

  const handleSecurityLevel =(e)=>{
    setSecurityLevelValue(e.target.value);
    setSecurityLevelLabel(e.target.options[e.target.selectedIndex].text);
  }

  const handleAuthProtocol=(e)=>{
    setAuthProtocolValue(e.target.value);
    setAuthProtocolLabel(e.target.options[e.target.selectedIndex].text);
  }

  const handlePrivacyProtocol=(e)=>{
    setPrivacyProtocolValue(e.target.value);
    setPrivacyProtocolLabel(e.target.options[e.target.selectedIndex].text);
  }

  const handleAddSnmpConfig = async () => {
        const requestBody = isEditMode ? {
        //    comments: comment,
        //     name : groupName,
        //     user: selectedUsers
        }: snmpVersValueSel === 'v2c' ? {
           
            version: snmpVersValueSel,
            securityName: "roV3user",
            securityLevel: "3",
            authProtocol: "SHA",
            privProtocol: "AES",
            begin: beginIp,
            end: endIp,
            readCommunity: readCommunity,
            writeCommunity: writeCommunity
            }: {
                version: snmpVersValueSel,
                securityName: "roV3user",
                securityLevel: "3",
                authProtocol: "SHA",
                privProtocol: "AES",
                begin: beginIp,
                end: endIp,
                authPassPhrase: authPassphrase,
                privPassPhrase: privacyPassphrase
            }

        const method = isEditMode ? '' :'POST';
        const url= isEditMode ? 'api/v2/nodelinks/udefinition' :'api/v2/nodelinks/udefinition';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                handleSubNewconfigContainer();
                if(refreshSnmpData) refreshSnmpData();
                setBeginIp('');
                setEndIp('');
                setReadCommunity('');
                setWriteCommunity('');
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

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
                        <article className="border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 15px 0 10px'}}>
                                <article>
                                    <label className="vlanlabel">SNMP Version
                                    </label>
                                    <article>
                                        <select className="vlaninput" value={snmpVersValueSel} onChange={handleSnmpVersion}>
                                        <option value="v3" label="SNMPv3">SNMPv3</option>
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
                                
                               {snmpVersValueSel === "v2c" ? (<article> <article>
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
                                </article> </article> ) : (
                                    <article>
                                    <article>
                                <label className="settinglabelsub">Security Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={securityName}
                                />
                                </article>
                                <article>
                                <label className="settinglabelsub">Security Level</label>
                                <select className="vlaninput" value={securityLevelValue} onChange={handleSecurityLevel}>
                                        <option value="3" label="AuthNoPriv">AuthNoPriv</option>
                                            <option value="2" selected label="AuthPriv">AuthPriv</option>
                                        </select>
                                </article>
                                 <article>
                                <label className="settinglabelsub">Auth Protocol</label>                    
                                <select className="vlaninput" value={authProtocolValue} onChange={handleAuthProtocol}>
                                        <option value="2" label="DES">DES</option>
                                            <option value="3" selected label="AES-128">AES-128</option>
                                        </select>
                                </article>
                                 <article>
                                <label className="settinglabelsub">Auth Passphrase</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={authPassphrase}
                                onChange={(e)=> setAuthPassphrase(e.target.value)}
                                />
                                </article>                                
                                 <article>
                                <label className="settinglabelsub">Privacy Protocol</label>                        
                                <select className="vlaninput" value={privacyProtocolValue} onChange={handlePrivacyProtocol}>
                                        <option value="2" label="MD5">MD5</option>
                                            <option value="3" selected label="SHA">SHA</option>
                                        </select>
                                </article>
                                 <article>
                                <label className="settinglabelsub">Privacy Passphrase</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" 
                                value={privacyPassphrase}
                                onChange={(e)=> setPrivacyPassphrase(e.target.value)}
                                />
                                </article>
                                    </article>
                                ) } 
                              

                                <hr className="hrnote" />
                                <center className="d-f">
                                    <button className="cancelbtn" type="button" onClick={handleProfileNewconfigContclose}>Cancel</button>
                                    <button type="button" onClick={handleAddSnmpConfig}
                                    disabled={currentUser === "Read-only"}
                                    className={`creatsetingbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`} title={currentUser === "Read-only" ? "Permission required" : ""}
                                    >
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