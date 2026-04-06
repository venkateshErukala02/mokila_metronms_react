import React, { useState , useEffect} from "react";
import EyeSlash from '../../assets/img/eye-slash.png';
import Eye from '../../assets/img/eye.png';
import { useSelector } from "react-redux";


const ServerConfigContainer = () => {
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);
    const isReadOnly = currentUser === 'Read-only';

    const [userFtp, setUserFtp] = useState();
    const [serverDropdw, setServerDropdw] = useState(true);
    const [emailDropdw, setEmailDropdw] = useState(false);
    const [eyeTrapHostimgStatus, setEyeTrapHostimgStatus] = useState(false);
    const [eyePasswordimgStatus, setEyePasswordimgStatus] = useState(false);
    const [eyeAuthPswdimgStatus, setEyeAuthPswdimgStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [isServerExpanded, setIsServerExpanded] = useState(true);
    const [emailConfigDt, setEmailConfigDt] =  useState('');
    const [hostName, setHostName] = useState('');
    const [fromAddress, setFromAddress] = useState('');
    const [sslEnableSel, setSslEnableSel] = useState('');
    const [tlsEnableSel, setTlsEnableSel] = useState('');
    const [smptPort, setSmptPort] = useState('');
    const [authUser, setAuthUser] =  useState('');
    const [authUserPswd, setAuthUserPswd] = useState('');
    const [serverConfigDt,setServerConfigDt] = useState('');
    const [hostCommunity,setHostCommunity] = useState('');
    const [serverAddress,setServerAddress] = useState();
    const [rootPath,setRootPath] = useState();
    const [port,setPort] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [sslEnableValueSel,setSslEnableValueSel] = useState(true);
    const [sslEnableLabelSel,setSslEnableLabelSel] =  useState('')
    const [tlsEnableValueSel,setTlsEnableValueSel] = useState(false);
    const [tlsEnableLabelSel,setTlsEnableLabelSel] = useState('');
    const [itemToSave, setItemToSave] = useState(null);
    const [itemToSaveEmail,setItemToSaveEmail] = useState(false);
    const [showSavePopup, setShowSavePopup] = useState(false);
    const [showSavePopupEmail, setShowSavePopupEmail] = useState(false);
    const [showSaveSuccessPopup, setShowSaveSuccessPopup] = useState(false);

    const handleCheckboxChange = () => {
        setUserFtp(!userFtp)
    }

 const EMAILCONFIG_URL='api/v2/eventnotice/mail'

    const handleEmailCont = () => {
        setEmailDropdw(!emailDropdw);
        setIsServerExpanded(prev => !prev);
        getEmailConfigData(EMAILCONFIG_URL);
    }


    const handleServerCont = () => {
        setServerDropdw(!serverDropdw);
        setIsServerExpanded(prev => !prev);
        setUserFtp(false);
    };



    const getEmailConfigData = async (url) => {
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
                setEmailConfigDt(data);
                setHostName(data?.mailHost || '');
                setFromAddress(data?.fromAddress || '');
                setSslEnableSel(String(data?.sslEnable));  
                setTlsEnableSel(String(data?.tlsEnable));
                setSmptPort(data?.smtpPort || '');
                setAuthUser(data?.authUser || '');
                setAuthUserPswd(data?.authPassword || '');
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };


    const getServerConfigData = async (url) => {
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
                setServerConfigDt(data);
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    const isFormValid = () => {
    
        return (
            serverAddress &&
            rootPath &&
            port &&
            hostCommunity &&
            (userFtp ? username && password : true) 
        );
    };

    const isEmailFormValid = () =>{
        return (
            hostName &&
            fromAddress &&
            smptPort && 
            authUser &&
            authUserPswd
        )
    }

       const handleAddServerConfig = async (user,e) => {
          e.preventDefault(); 
        if(!serverAddress?.trim()) return;
        if (userFtp) {
            if (!username?.trim() || !password?.trim()) {
                return;
            }
        }
        const method = 'POST';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
        const requestBody ={
            serveraddress:serverAddress,
            tftprootpath:rootPath,
            isftp:userFtp,
            tftpport:port,
            traphostpwd:hostCommunity,
             ...(userFtp && {
                    username: username,
                    password: password
                })
           
        }

        try {
            const response = await fetch(`api/v2/systemprops/update`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const text = await response.text();

            if (response.ok) {
                setShowSaveSuccessPopup(true);
                // alert('Server Configuration Added successfully')
                // if(refreshUserData) refreshUserData();
            //    setUserName('');
            //    setFullName('');
            //    setEmail('');
            //    setPassword('');
            //    setConfirmPassword('');
            //    setLineNameSele(-1);
            //    setRole('ROLE_READONLY');
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }

     const handleAddEmailConfig = async (user,e) => {
          e.preventDefault(); 
        if(!hostName?.trim() || !fromAddress?.trim() || !smptPort?.trim() || !authUser?.trim() || !authUserPswd?.trim()) return;
       
        const method = 'POST';
        const requestBody ={
            authPwd : authUserPswd,
            authenticateUser : authUser,
            fromAddress : fromAddress,
            mailHost : hostName,
            smtpPort : smptPort,
            sslEnable : sslEnableValueSel,
            tlsEnable : tlsEnableValueSel,
        }

        try {
            const response = await fetch(`api/v2/systemprops/update`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const text = await response.text();

            if (response.ok) {
                 setShowSaveSuccessPopup(true);
                // alert('Server Configuration Added successfully')

                // if(refreshUserData) refreshUserData();
            //    setUserName('');
            //    setFullName('');
            //    setEmail('');
            //    setPassword('');
            //    setConfirmPassword('');
            //    setLineNameSele(-1);
            //    setRole('ROLE_READONLY');
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }



 useEffect(() => {
        const url='api/v2/systemprops/list?limit=0'
        getServerConfigData(url);

    }, []);





    const handleSslEnable=(e)=>{
        setSslEnableValueSel(e.target.value);
        setSslEnableLabelSel(e.target.options[e.target.selectedIndex].label)
    }

    const handleTlsEnable=(e)=>{
        setTlsEnableValueSel(e.target.value);
        setTlsEnableLabelSel(e.target.options[e.target.selectedIndex].label);
    }

    useEffect(() => {
    if (serverConfigDt) {
        setHostCommunity(serverConfigDt.serveraddress || "");
        setServerAddress(serverConfigDt.serveraddress || "");
        setRootPath(serverConfigDt.tftprootpath || "");
        setPort(serverConfigDt.tftpport || "");
        setUserFtp();
    }
}, [serverConfigDt]);


    return (

        <>
            <article className="row">
                <article className='col-12'>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <h1 className="setngheading">ORNMS Configuration</h1>
                        </article>
                        <article className="row border-allsd b-t">
                            <article className="col-6">
                                <article className="servcard">

                                    <article
                                        className="card-head border-allsd server-toggle"
                                        style={{ display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
                                        data-expanded={isServerExpanded}
                                        onClick={handleServerCont}
                                    >
                                        <h5 className="serverhead">Server Configuration</h5>
                                    </article>

                                    {serverDropdw && (<article className="border-allsd">
                                        <form action="">
                                            <div className="row">
                                                <div className="col-12">
                                                    <article className="card-sub">
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                Trap Host Community
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type={eyeTrapHostimgStatus ? 'text' : "password"} name="" 
                                                                autocomplete="current-password"  className="trapinpt" value={hostCommunity} onChange={(e)=> setHostCommunity(e.target.value)}/>
                                                                <img src={eyeTrapHostimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => setEyeTrapHostimgStatus(!eyeTrapHostimgStatus)} />
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                TFTP/FTP Server Address
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name=""   value={serverAddress}className="trapinpt" onChange={(e)=> setServerAddress(e.target.value)} />
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                TFTP/FTP Root Path
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name=""  value={rootPath}className="trapinpt"  onChange={(e)=> setRootPath(e.target.value)}/>
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                Port
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name=""  value={port}className="trapinpt" onChange={(e)=> setPort(e.target.value)}/>
                                                            </article>
                                                        </article>
                                                        <article>
                                                            <label htmlFor="" className="usetp">
                                                                <input type="checkbox" id="userFtp" className="usechkcl"
                                                                    checked={userFtp}
                                                                    onChange={handleCheckboxChange}
                                                                />
                                                                Use FTP
                                                            </label>
                                                        </article>

                                                        {userFtp && (<article className="">
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Username
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type="text" name="" id="userFtp" className="trapinpt" value={username}
                                                                    onChange={(e)=> setUsername(e.target.value)}
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Password
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type={eyePasswordimgStatus ? 'text' : 'password'} name=""  className="trapinpt" value={password}
                                                                    autocomplete="new-password"
                                                                    onChange={(e)=> setPassword(e.target.value)} />
                                                                    <img src={eyePasswordimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => setEyePasswordimgStatus(!eyePasswordimgStatus)} />
                                                                </article>
                                                            </article>
                                                        </article>
                                                        )}
                                                        <hr />
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5" style={{ textAlign: 'right' }}>
                                                                <button className={`createbtn ${isReadOnly ? 'disabled' : ''}`}
                                                                    style={{
                                                                        textAlign: 'right',
                                                                        backgroundColor: isReadOnly ? '#ccc' : 'rgb(0 111 255)',  
                                                                        color: isReadOnly ? '#666' : '#fff',  
                                                                        border: 'none',
                                                                        cursor: isReadOnly ? 'not-allowed' : 'pointer',
                                                                        opacity: isReadOnly ? 0.6 : 1  
                                                                    }} 
                                                                    type="button"
                                                                 disabled={currentUser === "Read-only"}
                                                                  onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                        setItemToSave(serverConfigDt);
                                                                        setShowSavePopup(true);
                                                                        }
                                                                    }}
                                                                //  onClick={currentUser !== "Read-only" ? ()=>handleAddServerConfig(serverConfigDt): undefined}
                                                                >Save</button>
                                                            </article>
                                                        </article>

                                                    </article>
                                                </div>
                                            </div>
                                        </form>
                                    </article>)}
                                </article>
                                <article>

                                </article>
                            </article>
                            <article className="col-6">
                                <article className="servcard">
                                <article
                                        className="card-head border-allsd server-toggle"
                                        style={{ display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer' }}
                                        data-expanded={isServerExpanded}
                                        onClick={handleEmailCont}
                                    >
                                        <h5 className="serverhead">Email Configuration</h5>
                                    </article>
                                    {emailDropdw && (
                                        <article className="border-allsd b-t">
                                            <form action="">
                                                <div className="row">
                                                    <div className="col-12">
                                                        <article className="card-sub">
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Host
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type="text" name=""  className="trapinpt"
                                                                    value={hostName}
                                                                    onChange={(e)=> setHostName(e.target.value)}
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    From Address
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type="text" name=""  className="trapinpt"
                                                                    value={fromAddress}
                                                                    onChange={(e)=> setFromAddress(e.target.value)}
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    SSL Enable
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value={sslEnableValueSel} onChange={handleSslEnable}>
                                                                        <option value="true">Enable</option>
                                                                        <option value="false">Disable</option>
                                                                    </select>
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    TLS Enable
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value={tlsEnableValueSel} onChange={handleTlsEnable}>
                                                                        <option value="true">Enable</option>
                                                                        <option value="false">Disable</option>
                                                                    </select>
                                                                </article>
                                                            </article>


                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    SMTP Port
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type="text" name=""  className="trapinpt"
                                                                    value={smptPort}
                                                                    onChange={(e)=> setSmptPort(e.target.value)}
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Authenticate User
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type="text" name=""  className="trapinpt" 
                                                                    value={authUser}
                                                                    onChange={(e)=> setAuthUser(e.target.value)}
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Authenticate User Password
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type={eyeAuthPswdimgStatus ? 'text' :'password'} name=""  className="trapinpt" 
                                                                    value={authUserPswd}
                                                                    onChange={(e)=> setAuthUserPswd(e.target.value)}
                                                                    />
                                                                    <img src={eyeAuthPswdimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => setEyeAuthPswdimgStatus(!eyeAuthPswdimgStatus)} />
                                                                </article>
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5" style={{ textAlign: 'right' }}>
                                                                <button type = "button" className="createbtn" 
                                                                style={{
                                                                        textAlign: 'right',
                                                                        backgroundColor: isReadOnly ? '#ccc' : 'rgb(0 111 255)',  
                                                                        color: isReadOnly ? '#666' : '#fff',  
                                                                        border: 'none',
                                                                        cursor: isReadOnly ? 'not-allowed' : 'pointer',
                                                                        opacity: isReadOnly ? 0.6 : 1  
                                                                    }} 
                                                                disabled ={currentUser === "Read-only"}
                                                                 onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (currentUser !== 'Read-only') {
                                                                        setItemToSaveEmail(serverConfigDt);
                                                                        setShowSavePopupEmail(true);
                                                                        }
                                                                    }}
                                                                // onClick={currentUser !== "Read-only" ?handleAddEmailConfig : undefined}
                                                                >Save</button>
                                                            </article>
                                                        </article>
                                                    </div>
                                                </div>
                                            </form>
                                        </article>
                                    )}
                                </article>
                                <article>

                                </article>
                            </article>
                        </article>


                    </article>
                </article>


            </article>

               {showSavePopupEmail && itemToSaveEmail && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to save the email configuration?</h1>
                                <article className="f-r">
                                     <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowSavePopupEmail(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleAddEmailConfig(itemToSaveEmail);
                                            setShowSavePopupEmail(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}

                                  {showSavePopup && itemToSave && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to save the server configuration?</h1>
                                <article className="f-r">
                                     <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowSavePopup(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleAddServerConfig(itemToSave);
                                            setShowSavePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}

                             {showSaveSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The configuration added successfully</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => setShowSaveSuccessPopup(false)}
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



export default ServerConfigContainer