import React, { useState, useEffect } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import EyeSlash from '../../assets/img/eye-slash.png';
import Eye from '../../assets/img/eye.png';


const UserSubCont = ({ handleSubContainer, refreshUserData,mode,user }) => {

    const isEditMode = mode === 'edit';

    const [lineData, setLineData] = useState([]);
    const [lineNameSele, setLineNameSele] = useState(-1)
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [eyePwdimgStatus, setEyePwdimgStatus] = useState(false);
    const [eyecfPwdimgStatus, setEyecfPwdimgStatus] = useState(false);
    const [userName, setUserName] = useState('');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [lineLabelSel, setLineLabelSel] = useState('');
    const [role, setRole] = useState("ROLE_READONLY");
    const [userData,setUserData] =useState([]);
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
      };
      


    const handleProfileContclose = () => {
        handleSubContainer()
    }

    useEffect(() => {
        const fetchLinesData = async () => {
            const url = 'api/v2/treeview/regions'
            getLineData(url);

        }
        fetchLinesData();

    }, []);

    const getLineData = async (url) => {
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
                setLineData(data);

                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    const handlePasswordEyeimg = () => {
        setEyePwdimgStatus(!eyePwdimgStatus)
    }

    const handlecfPasswordEyeimg = () => {
        setEyecfPwdimgStatus(!eyecfPwdimgStatus)
    }
    const handleSelectLine = (e) => {

        const selectedValue = Number(e.target.value);
        const selectedText = e.target.options[e.target.selectedIndex].text;
        setLineNameSele(selectedValue);
        setLineLabelSel(selectedText);
    }


    const buildpostXMLPayload = () => {
        return `
          <user>
            <user-id>${userName}</user-id>
            <password>${password}</password>
            <full-name>${fullName}</full-name>
            <region-id>${lineNameSele}</region-id>
            <email>${email}</email>
            <role>${role}</role>
          </user>
        `.trim();
      };

      const buildupdateXMLPayload = () => {
        return `
          <user>
            <user-id>${userName}</user-id>
            <password>${password}</password>
            <full-name>${fullName}</full-name>
            <region-id>${lineNameSele}</region-id>
            <email>${email}</email>
            <role>${role}</role>
          </user>
        `.trim();
      };
      
      

    const handleAddUser = async () => {
        // if (!sectionName) {
        //     alert("Please select a file first.");
        //     return;
        // }

        const xmlpostPayload = buildpostXMLPayload();
        const xmlupdatePayload =buildupdateXMLPayload();
        const requestBody = isEditMode  ? xmlupdatePayload  : xmlpostPayload;

        const method = isEditMode  ? 'PUT' :'POST';
        const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/xml',
                },
                body: requestBody,
            });

            const text = await response.text();

            if (response.ok) {
                // setSuccess('Discovery started successfully');
                alert('Discovery started successfully')
                handleProfileContclose();
                if(refreshUserData) refreshUserData();
               setUserName('');
               setFullName('');
               setEmail('');
               setPassword('');
               setConfirmPassword('');
               setLineNameSele(-1);
               setRole('ROLE_READONLY');
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

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
          setPasswordError("Passwords don't match.");
        } else {
          setPasswordError('');
        }
      }, [password, confirmPassword]);
      

   

    

    useEffect(() => {
        if (isEditMode && user) {
            setUserName(user["user-id"] || '');
            setFullName(user["full-name"] || '');
            setEmail(user.email || '');
            setLineNameSele(Number(user?.["region-id"]) || '');
            setRole(user.role || '');
        } else {
            // Clear form for create
            setUserName('');
            setFullName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setLineNameSele('');
            setRole('ROLE_READONLY');
        }
    }, [mode, user]);


    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">User</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="clearfix border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Username</label>
                            <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                readOnly={!!isEditMode}
                                required
                            />
                            <article>
                                <label className="settinglabelsub">Full Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                            </article>
                            <article>
                                <label className="settinglabelsub">Email</label>
                                <input
                                    type="text"
                                    className="settinglabelsubinp"
                                    value={email}
                                    required
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setEmail(val);
                                        if (!validateEmail(val)) {
                                        setEmailError('Invalid email address');
                                        } else {
                                        setEmailError('');
                                        }
                                    }}
                                    />

                            </article>
                            <article>
                                <label className="settinglabelsub">Password</label>
                                <input type={eyePwdimgStatus ? 'text' : 'password'} name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={password}
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <img src={eyePwdimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => handlePasswordEyeimg()} />
                            </article>

                            <article>
                                <label className="settinglabelsub">Confirm Password</label>
                                <input type={eyecfPwdimgStatus ? 'text' : 'password'} name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={confirmPassword}
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <img src={eyecfPwdimgStatus ? Eye : EyeSlash} alt="" className="eyeslashcl" onClick={() => handlecfPasswordEyeimg()} />
                                {passwordError && (
                                    <p style={{ color: 'red', marginTop: '5px' }}>{passwordError}</p>
                                    )}
                            </article>

                            <article>
                                <label className="vlanlabel">Line</label>
                                <article>
                                    <select className="vlaninput" value={lineNameSele} onChange={handleSelectLine}>
                                        <option value="-1" label="Select">Select</option>
                                        {lineData && lineData.map((item, index) => (
                                            <option key={index} value={item.data.id}>{item.text}</option>
                                        ))}
                                    </select>

                                </article>
                            </article>
                            {/* <article style={{position:'relative'}}>
  <label className="radiolabelcl">
    <input type="radio" name="role" />
    <span className="checking"></span> Read Only
   
  </label>
  <label className="radiolabelcl">
    <input type="radio" name="role" /> Admin
    <span className="checking"></span>
   
  </label>
  <label className="radiolabelcl">
    <input type="radio" name="role" />  Bulk
    <span className="checking"></span>
  
  </label>
</article> */}

                            <article style={{ position: 'relative' }}>
                                <label class="radiolabelcl">
                                    <input type="radio" name="role"
                                        value='ROLE_READONLY'
                                        checked={role === 'ROLE_READONLY'}
                                        onChange={() => setRole('ROLE_READONLY')}

                                    />
                                    <span class="checking"></span>
                                    <span class="labeltext">Read Only</span>
                                </label>
                                <label class="radiolabelcl">
                                    <input type="radio" name="role"
                                        value='ROLE_ADMIN'
                                        checked={role === 'ROLE_ADMIN'}
                                        onChange={() => setRole('ROLE_ADMIN')}
                                    />
                                    <span class="checking"></span>
                                    <span class="labeltext">Admin</span>
                                </label>
                                <label class="radiolabelcl">
                                    <input type="radio" name="role"
                                        value='BULK'
                                        checked={role === 'BULK'}
                                        onChange={() => setRole('BULK')}

                                    />
                                    <span class="checking"></span>
                                    <span class="labeltext">Bulk</span>
                                </label>
                            </article>




                            <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="clearfix notelist">
                                    <li>
                                        Special characters single quote(') and space are not allowed for User and Full name
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                    <button className="cancelbtn">Cancle</button>
                                    <button type="button" className="creatsetingbtn"  disabled={!!emailError} onClick={handleAddUser}>
                                       {isEditMode  ? 'Update' :'Create'}
                                        </button>
                                </center>
                            </article>
                        </form>

                    </article>

                </article>
            </article>

        </>
    )
}

export default UserSubCont;