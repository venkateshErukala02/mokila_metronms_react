import React, { useState , useEffect} from "react";
import EyeSlash from '../../assets/img/eye-slash.png';
import Eye from '../../assets/img/eye.png';


const ServerConfigContainer = () => {

    const [userFtp, setUserFtp] = useState(false);
    const [serverDropdw, setServerDropdw] = useState(true);
    const [emailDropdw, setEmailDropdw] = useState(true);
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
                setEmailConfigDt(data);
                console.log('eeeeeeeeeeeeeeeeeeeeeeee',data)
                setHostName(data?.mailHost || '');
                setFromAddress(data?.fromAddress || '');
                setSslEnableSel(String(data?.sslEnable));  // Cast to string for select input
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
                setServerConfigDt(data);
                console.log('eeeeeeeeeeeeeeeeeeeeeeee',data)
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };


 useEffect(() => {
        const url='api/v2/systemprops/list?limit=0'
        getServerConfigData(url);

    }, []);





    const handleSslEnable=(e)=>{
        setSslEnableSel(e.target.value);
    }

    const handleTlsEnable=(e)=>{
        setTlsEnableSel(e.target.value);
    }


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
                                                                <input type={eyeTrapHostimgStatus ? 'text' : "password"} name="" id="" className="trapinpt" />
                                                                <img src={eyeTrapHostimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => setEyeTrapHostimgStatus(!eyeTrapHostimgStatus)} />
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                TFTP/FTP Server Address
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name="" id="" className="trapinpt" />
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                TFTP/FTP Root Path
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name="" id="" className="trapinpt" />
                                                            </article>
                                                        </article>
                                                        <article className="form-row">
                                                            <label htmlFor="" className="col-4 traplabel">
                                                                Port
                                                            </label>
                                                            <article className="col-sm-4 col-md-4 col-lg-5">
                                                                <input type="text" name="" id="" className="trapinpt" />
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
                                                                    <input type="text" name="" id="userFtp" className="trapinpt"
                                                                    />
                                                                </article>
                                                            </article>
                                                            <article className="form-row">
                                                                <label htmlFor="" className="col-4 traplabel">
                                                                    Password
                                                                </label>
                                                                <article className="col-sm-4 col-md-4 col-lg-5">
                                                                    <input type={eyePasswordimgStatus ? 'text' : 'password'} name="" id="" className="trapinpt" />
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
                                                                <button className="createbtn" style={{ textAlign: 'right' }}>Save</button>
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
                                                                    <input type="text" name="" id="" className="trapinpt"
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
                                                                    <input type="text" name="" id="" className="trapinpt"
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
                                                                    <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value={sslEnableSel} onChange={handleSslEnable}>
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
                                                                    <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value={tlsEnableSel} onChange={handleTlsEnable}>
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
                                                                    <input type="text" name="" id="" className="trapinpt"
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
                                                                    <input type="text" name="" id="" className="trapinpt" 
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
                                                                    <input type={eyeAuthPswdimgStatus ? 'text' :'password'} name="" id="" className="trapinpt" 
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
                                                                <button className="createbtn" style={{ textAlign: 'right' }}>Save</button>
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
        </>
    )
}



export default ServerConfigContainer