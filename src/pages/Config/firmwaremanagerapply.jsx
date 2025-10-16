import React, { useEffect, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import DatePicker from "react-datepicker";


const FirmwareManagerApply = ({ handleSubContainer, refreshLineData, mode, version }) => {

    const isEditMode = mode === 'edit';

    const [fileName, setFileName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [setInvenData, invenData] = useState('');
    const [isImmediate,setIsImmediate] = useState(true)
    const [deviceType,setDeviceType] = useState('');

    const handleProfileContclose = () => {
        handleSubContainer(fileName)
    }

    const handleAddLine = async () => {
        if (!fileName) {
            alert("Please fill the field.");
            return;
        }
        const requestBody = isEditMode ? {
            id: fileName.id,
            name: fileName,
            type: 0

        } : {
            name: fileName,
            type: 0
        };

        const method = isEditMode ? 'PUT' : "POST";
        const url = isEditMode ? `api/v2/regions/${fileName.id}` : 'api/v2/regions'
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`);
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                alert('Discovery started successfully');
                handleProfileContclose();
                if (refreshLineData) refreshLineData();
                setFileName('')
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }

    }

    useEffect(() => {
        if (isEditMode && version) {
            setFileName(version.fileName || '');
        } else {
            setFileName('');
        }
    }, [mode, version]);



    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Apply Firmware</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <article style={{ paddingTop: '4px', paddingBottom: '10px' }}>
                                <article>
                                <label className="settinglabelsub">Device Type</label>
                            <select className="vlaninput" value={deviceType} onChange={(e)=> setDeviceType(e.target.value)}>
                                <option value="" disabled>Select</option>
                                <option value="Ap">Ap</option>
                                <option value="Encoder">Encoder</option>
                            </select>
                            </article>
                            <article style={{paddingTop:"10px"}}>
                                <label className="settinglabelsub">Firmware</label>
                            <input type="text"
                                value={fileName}
                                required
                                onChange={(e) => setFileName(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                </article>
                            <hr class=""></hr>
                            <article>
                                <h4 className="scheduletitle">Schedule</h4>
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Immediate: </label>
                                <input className="incl2" type="checkbox" 
                                 checked={isImmediate}
                                onChange={(e)=> setIsImmediate(e.target.checked)}
                                />
                            </article>
                           {!isImmediate && <article>
                                <label for="" className="traplabel"> Start Date:</label>
                                <article className="checkbok">
                                    <article className="trans-datepickerbg" style={{ display: 'inline-block' }}>
                                        <DatePicker
                                            selected={selectedDate}
                                            showTimeSelect
                                            dateFormat="yyyy-MM-dd HH:mm"
                                            onChange={(date) => setSelectedDate(date)}
                                            className="myDatepickercl" />
                                    </article>
                                </article>
                            </article> }
                            <article>
                                <ul className="regionlist">
                                    <li>
                                        <label for="" className="traplabel"> Region</label>
                                        <article className="checkbok">
                                            <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value='' onChange=''>
                                                <option value="true">Enable</option>
                                                <option value="false">Disable</option>
                                            </select>
                                        </article>
                                    </li>
                                    <li>
                                        <label for="" className="traplabel"> City</label>
                                        <article className="checkbok">
                                            <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value='' onChange=''>
                                                <option value="true">Enable</option>
                                                <option value="false">Disable</option>
                                            </select>
                                        </article>
                                    </li>
                                    <li>
                                        <label for="" className="traplabel"> Location</label>
                                        <article className="checkbok">
                                            <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value='' onChange=''>
                                                <option value="true">Enable</option>
                                                <option value="false">Disable</option>
                                            </select>
                                        </article>
                                    </li>
                                    <li>
                                        <label for="" className="traplabel"> Facility</label>
                                        <article className="checkbok">
                                            <select className="trapsel" style={{ width: "50%" }} aria-invalid="false" value='' onChange=''>
                                                <option value="true">Enable</option>
                                                <option value="false">Disable</option>
                                            </select>
                                        </article>
                                    </li>
                                </ul>
                            </article>
                            <article style={{ textAlign: "center",paddingBottom:'16px' }}>
                                <button className="createbtn">Search</button>
                            </article>
                             <article className="row border-allsd" style={{height:'16vh'}}>
                                <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12">
                                    <thead className="inventthtb">
                                        <tr style={{ textAlign: 'center' }}>
                                            <th><input type="checkbox" className="incl"
                                                onChange=''
                                                checked=''
                                            /></th>
                                            <th>Devices</th>
                                            <th>System Name</th>
                                            <th>LinkId</th>
                                        </tr>
                                    </thead>
                                    <tbody className="">
                                        {/* {Array.isArray(invenData.node) && invenData.node.length > 0 ? (
                                            invenData.node.map((event) => (
                                                <tr key={event.id} style={{ textAlign: 'center' }}>
                                                    <td><input type="checkbox" className="incl"
                                                        checked=''
                                                        onChange=''
                                                    /></td>
                                                    <td style={{ width: "px" }}></td>
                                                    <td style={{ width: 'px' }}></td>
                                                    <td style={{ width: '' }}></td>
                                                </tr>
                                            ))
                                        ) : (
                                            ''
                                        )} */}
                                    </tbody>
                                </table>
                                {/* <hr /> */}
                            </article>
                            <center style={{marginTop:'16px',marginBottom:'16px'}}>
                                    <button className="cancelbtn">Cancle</button>
                                    <button className="creatsetingbtn">Apply</button>
                                </center>
                        </form>
                    </article>
                </article>
            </article>

        </>
    )
}

export default FirmwareManagerApply;