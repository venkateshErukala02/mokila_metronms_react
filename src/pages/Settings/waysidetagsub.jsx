import React, { useEffect, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import { useSelector } from "react-redux";


const WaysideTagSubCont = ({ handleSubContainer, refreshTagData, mode, user }) => {
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);

    const isEditMode = mode === 'edit';

    const [version, setVersion] = useState('');
    const [lineName, setLineName] = useState('');
    const [loading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [deviceType, setDeviceType] = useState('');
    const [westSideViewLabel, setWestSideViewLabel] = useState('Line21')
    const [westSideView, setWestSideView] = useState('Line1');
    const [stationNamesData, setStationNamesData] = useState('');
    const [location, setLocation] = useState('');
    const [direction, setDirection] = useState('');
    const [position, setPosition] = useState('');
    const [tagtype, setTagtype] = useState('');
    const [mailChecked, setMailChecked] = useState(false);
    const [priorityChecked, setPriorityChecked] = useState(false);
    const [reportChecked, setReportChecked] = useState(false);
    const [roleNameSele,setRoleNameSele] = useState('');


    const handleProfileContclose = (e) => {
          e.preventDefault(); 
        handleSubContainer(lineName)
    }



    useEffect(() => {
        if (isEditMode && user) {
            setLocation(user.location || '');
            setTagtype(user.type || '');
            setDirection(user.line || '');
            setPosition(user.postion || user.position || '');
            setPriorityChecked(user.priority || '');
            setMailChecked(user.sendMail || '');
            setReportChecked(user.reportAlarm || '');
            setRoleNameSele(user.role || '');
        } else {
            setLineName('');
        }
    }, [mode, user]);


    const handleWestside = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setWestSideView(selectElement.value);
        setWestSideViewLabel(label);

    }

    const fetchStationData = async (url) => {
        setIsLoading(true);
        setError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`
                }

            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                setIsLoading(false);
                if (Object.keys(data).length === 0) {
                    setStationNamesData([])
                }
                setStationNamesData(Array.isArray(data) ? data.codes : [data.codes]);
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setError({ status: true, msg: error.message });
        }
    };


    // useEffect(() => {
    //     let url = '';
    //     url = 'api/v2/wayside/codes';
    //     if (url) fetchStationData(url);
    // }, []);

     const handleAddUser = async (e) => {
          if (e) e.preventDefault();
        const method = 'POST';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
        const requestBody ={
            tag:user.tag,
            location:location,
            line:direction,
            postion:position,
            type:tagtype,
            role: roleNameSele,
            priority:priorityChecked ? 1 : 0,
            sendMail: !!mailChecked,
            reportAlarm:!!reportChecked
        }

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/wayside/editTags?tdmTag=${user.tag}`, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const text = await response.text();

            if (response.ok) {
                // setSuccess('Discovery started successfully');
                // alert('Discovery started successfully')
                handleProfileContclose();
                if(refreshTagData) refreshTagData();
            //    setUserName('');
            //    setFullName('');
            //    setEmail('');
            //    setPassword('');
            //    setConfirmPassword('');
            //    setLineNameSele(-1);
            //    setRole('ROLE_READONLY');
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); // Turn off loading state
        }

    }

    const handleSelectRole=(e)=>{
     setRoleNameSele(e.target.value);  
}

const tagRoles = [
  { text: "VON" },
  { text: "VOFF" },
  { text: "GENERIC VON" },
  { text: "GENERIC VOFF" },
  { text: "YARD ENTER" },
  { text: "YARD EXIT" },
  { text: "SNL" },
  { text: "DIR LEARN" },
  { text: "RADIO REBOOT" }
];


    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Update Tag</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Location</label>
                            <input type="text"
                                value={location}
                                disabled
                                onChange={(e) => setLocation(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            {/* <p className="firmwarenote">e.g. xx_xxx</p> */}
                            <label className="settinglabelsub">Direction</label>
                            <input type="text"
                                value={direction}
                                disabled
                                onChange={(e) => setDirection(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <label className="settinglabelsub">Position</label>
                            <input type="text"
                                value={position}
                                disabled
                                onChange={(e) => setPosition(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <label className="settinglabelsub">Tagtype</label>
                            <input type="text"
                                value={tagtype}
                                disabled
                                onChange={(e) => setTagtype(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                             <article>
                                    <label className="vlanlabel">Role</label>
                                    <article>
                                    <select  className="vlaninput" value={roleNameSele} onChange={handleSelectRole}>
                                   <option value="-1">Select</option>
                                            {tagRoles.map((item,index) => (
                                                <option key={index} value={item.text}>
                                                {item.text}
                                                </option>
                                            ))}
                                          </select>  
                                    </article>
                                </article>
                            <label className="settinglabelsub">Priority</label>
                            <input type="checkbox" className="incl"
                                checked={priorityChecked === 1}
                                onChange={(e) =>
                                    setPriorityChecked(e.target.checked ? 1 : 0)
                                }
                            />
                            <label className="settinglabelsub">Send Mail</label>
                            <input type="checkbox" className="incl"
                                checked={mailChecked} onChange={(e) => setMailChecked(e.target.checked)}
                            />
                            <label className="settinglabelsub">Report Alarm</label>
                            <input type="checkbox" className="incl"
                                checked={reportChecked} onChange={(e) => setReportChecked(e.target.checked)}
                            />
                            {/* <select name="name" id="name" value={westSideView} onChange={handleWestside} className="vlaninput">
                                    {stationNamesData.length !== 0 && stationNamesData[0].map((station,index) => {
                                        const dataNw = Object.keys(station);
                                        const staionNametitle = dataNw[0];
                                        return(
                                    <option key={index} value={staionNametitle} label={staionNametitle}>{staionNametitle}</option>
                                        )
                                    })}  
                                </select> */}

                            <article className="uploadcont">

                                <center className="d-f">
                                    <button type="button" className="cancelbtn btn-align" onClick={handleProfileContclose}>Cancel</button>
                                    <button type="button" onClick={handleAddUser}
                                    className={`creatsetingbtn btn-align ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`} title={currentUser === "Read-only" ? "Permission required" : ""}
                                    disabled={currentUser === "Read-only"}
                                    >
                                        {isEditMode ? 'Update' : 'Upload'}
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

export default WaysideTagSubCont;