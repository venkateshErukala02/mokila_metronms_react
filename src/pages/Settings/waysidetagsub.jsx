import React, { useEffect, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';


const WaysideTagSubCont = ({ handleSubContainer, refreshTagData, mode, user }) => {

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
    const [mailChecked, setMailChecked] = useState();
    const [priorityChecked, setPriorityChecked] = useState();
    const [reportChecked, setReportChecked] = useState();


    const handleProfileContclose = () => {
        handleSubContainer(lineName)
    }



    useEffect(() => {
        if (isEditMode && user) {
            setLocation(user.location || '');
            setTagtype(user.type || '');
            setDirection(user.direction || '');
            setPosition(user.position || '');
            setPriorityChecked(user.priority || '');
            setMailChecked(user.sendMail || '');
            setReportChecked(user.reportAlarm || '');
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
                console.log('plpplplp', stationNamesData)
                setError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setError({ status: true, msg: error.message });
        }
    };


    useEffect(() => {
        let url = '';
        url = 'api/v2/wayside/codes';
        if (url) fetchStationData(url);
    }, []);

     const handleAddUser = async () => {
       
        const method = 'POST';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
        const requestBody ={
            tag:user.tag,
            location:location,
            line:direction,
            postion:position,
            type:tagtype,
            priority:priorityChecked === false ? 0 : 1,
            sendMail:mailChecked,
            reportAlarm:reportChecked
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
                alert('Discovery started successfully')
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
                <article className="clearfix border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Location</label>
                            <input type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            {/* <p className="firmwarenote">e.g. xx_xxx</p> */}
                            <label className="settinglabelsub">Direction</label>
                            <input type="text"
                                value={direction}
                                onChange={(e) => setDirection(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <label className="settinglabelsub">Position</label>
                            <input type="text"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <label className="settinglabelsub">Tagtype</label>
                            <input type="text"
                                value={tagtype}
                                onChange={(e) => setTagtype(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <label className="settinglabelsub">Priority</label>
                            <input type="checkbox" className="incl"
                                checked={priorityChecked} onChange={() => setPriorityChecked(!priorityChecked)}
                            />
                            <label className="settinglabelsub">Send Mail</label>
                            <input type="checkbox" className="incl"
                                checked={mailChecked} onChange={() => setMailChecked(!mailChecked)}
                            />
                            <label className="settinglabelsub">Report Alarm</label>
                            <input type="checkbox" className="incl"
                                checked={reportChecked} onChange={() => setReportChecked(!reportChecked)}
                            />
                            {/* <select name="name" id="name" value={westSideView} onChange={handleWestside} className="clearfix vlaninput">
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
                                    <button className="cancelbtn" onClick={handleProfileContclose}>Cancle</button>
                                    <button className="creatsetingbtn" onClick={handleAddUser}>
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