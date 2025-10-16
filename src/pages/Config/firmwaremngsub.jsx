import React, { useEffect, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';


const FirmwareMngSubCont = ({ handleSubContainer, refreshLineData, mode, line }) => {

    const isEditMode = mode === 'edit';

    const [version, setVersion] = useState('');
    const [lineName, setLineName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const [deviceType,setDeviceType] = useState('');



    const handleProfileContclose = () => {
        handleSubContainer(lineName)
    }

    const handleAddLine = async () => {
        if (!lineName) {
            alert("Please fill the field.");
            return;
        }
        const requestBody = isEditMode ? {
            id: line.id,
            name: lineName,
            type: 0

        } : {
            name: lineName,
            type: 0
        };

        const method = isEditMode ? 'PUT' : "POST";
        const url = isEditMode ? `api/v2/regions/${line.id}` : 'api/v2/regions'
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
                setLineName('')
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
        if (isEditMode && line) {
            setLineName(line.name || '');
        } else {
            setLineName('');
        }
    }, [mode, line]);


    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('upfile', selectedFile);

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/firmware/uploaddiscctx/${deviceType}/${version}`, {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                setSuccess('File upload has started.');
                alert('File upload has started.')

                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Firmware Upload</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="clearfix border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Device Type</label>
                            <select className="vlaninput" value={deviceType} onChange={(e)=> setDeviceType(e.target.value)}>
                                <option value="" disabled>Select</option>
                                <option value="Ap">Ap</option>
                                <option value="Encoder">Encoder</option>
                            </select>
                            <label className="settinglabelsub">Version</label>
                            <input type="text"
                                value={version}
                                required
                                onChange={(e) => setVersion(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <p className="firmwarenote">e.g. xx_xxx</p>
                            <article className="uploadcont">
                                <article className="regioncontw" style={{ paddingLeft: "20px", margin: '40px' }}>
                                    <label htmlFor="" className="disfilelabel" style={{ marginBottom: '1px' }}>Select your file</label>
                                    <div className="filename-display">
                                        {selectedFile ? selectedFile.name : 'No file selected'}
                                    </div>
                                    <input
                                        className="dislineinputcl"
                                        type="file"
                                        onChange={handleFileChange}
                                        id="hiddenFileInput"
                                        style={{ display: "none" }}
                                    />
                                    <button onClick={() => document.getElementById("hiddenFileInput").click()} class="attachcl">
                                        <i class="fa-solid fa-paperclip"></i></button>
                                    {/* <button onClick={handleUpload} class="uploadcl"><i class="fa-solid fa-upload"></i></button> */}
                                </article>
                                <hr class="hrnote"></hr>
                                <center className="d-f">
                                    <button className="cancelbtn" onClick={handleProfileContclose}>Cancle</button>
                                    <button className="creatsetingbtn" onClick={handleUpload}>
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

export default FirmwareMngSubCont;