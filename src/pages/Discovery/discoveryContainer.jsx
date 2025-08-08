import React, { useState } from "react";
import '../ornms.css';
import './../Discovery/discovery.css';

const DiscovContai = () => {
    const [discAddValue, setDiscAddValue] = useState('');
    const [activeCont, setActiveCont] = useState('Address');
    const [ipbeginValue, setIpbeginValue] = useState('');
    const [ipendValue, setIpEndValue] = useState('');
    const [isByMask, setIsByMask] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');


    function disableInput() {
        document.getElementById('myInput').disabled = true;
    }



    const handleAddStart = async () => {
        const url = 'api/v2/api/v2//discovery/specificdisc'

        if (discAddValue.trim() === '') {
            setError('Please enter a valid IP Address');
            return;
        }

        setError('');
        setLoading(true);
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify({ content: discAddValue }),
            });
            const ddtt = response;
            console.log('reesss', ddtt);

            if (response.ok) {
                alert('Discovery started successfully')

                setSuccess('Discovery started successfully');
                setDiscAddValue('');
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }
    };

    const handleIpAddStart = async () => {
        const requestBody = {
            begin: ipbeginValue,
            byNetMask: isByMask,
            end: ipendValue,
            location:'default',
            retries: '1',
            timeout: '2000'
        };

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch("api/v2/discovery/rangedisc", {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                alert('Discovery started successfully')
                setIpEndValue('');
                setIpbeginValue('')
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


    const handleAddReset = () => {
        setDiscAddValue('');
        setError('');
        setSuccess('');
    };

    const handleActiveCont = (value) => {
        setActiveCont(value);
    }

    const handleIpAddReset = () => {
        setIpbeginValue('');
        setIpEndValue('')
        setError('');
        setSuccess('');
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // const handleUpload = async() => {
    //     if (selectedFile) {
    //         // console.log("Uploading:", selectedFile.name);
    //         // alert(`Uploading: ${selectedFile.name}`);
    //         // Handle upload to server here
    //         const requestBody = {
    //             begin: ipbeginValue,
    //             end: ipendValue
    //         };
    
    //         try {
    //             const response = await fetch("api/v2/discovery/rangedisc", {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify(requestBody),
    //             });
    //             if (response.ok) {
    //                 setSuccess('Discovery started successfully');
    //                 setIpEndValue('');
    //                 setIpbeginValue('')
    //             } else {
    //                 setError('Error starting discovery');
    //             }
    //         } catch (error) {
    //             console.error('Error:', error);
    //             setError('An error occurred while contacting the server.');
    //         } finally {
    //             setLoading(false); // Turn off loading state
    //         }
    


    //     } else {
    //         alert("Please select a file first.");
    //     }
    // };

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
        formData.append('upfile', selectedFile); // your API should accept a field named "file"
    
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch("api/v2/discovery/uploaddiscctx", {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
                body: formData, // Don't set Content-Type manually!
            });
    
            if (response.ok) {
                setSuccess('Discovery started successfully');
                alert('Discovery started successfully')

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
    
   
    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + ["Name,Email,Age", "John Doe,john@example.com,30"].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


   


    return (
        <>
            <article className="dicovercont">
                <h1 className="dicoveryheading">Discovery</h1>
                <article className="clearfix ipaddcont">
                    <ul className="clearfix discovlist">
                        <li><button className={activeCont === 'Address' ? 'active' : ''} onClick={() => handleActiveCont('Address')}>IP Address</button></li>
                        <li><button className={activeCont === 'Range' ? 'active' : ''} onClick={() => handleActiveCont('Range')}>IP Range</button></li>
                        <li><button className={activeCont === 'Upload' ? 'active' : ''} onClick={() => handleActiveCont('Upload')}>File Upload</button></li>
                    </ul>
                    {activeCont === 'Address' && (<article className="clearfix specicont">
                        <ul className="clearfix ipaddlistone">
                            <li>
                                <input
                                    type="text"
                                    className="clearfix form-controldis searchbar"
                                    placeholder="Specific IP Address"
                                    value={discAddValue}
                                    onChange={(e) => setDiscAddValue(e.target.value)} // Update the state on change
                                />
                            </li>
                            <li>
                                <button className="clearfix startdbtn" onClick={handleAddStart} disabled={loading}>
                                    {loading ? 'Starting...' : 'Start'}
                                </button>
                            </li>
                            <li>
                                <button className="clearfix resetbtn" onClick={handleAddReset}>
                                    Reset
                                </button>
                            </li>
                        </ul>
                    </article>)}
                    {activeCont === 'Range' && (<article className="clearfix speciconttwo">
                        <ul className="clearfix ipaddlisttwo" >
                            <li>
                                <input
                                    type="text"
                                    className="clearfix form-controldis searchbar"
                                    placeholder="IP Range Begin"
                                    value={ipbeginValue}
                                    onChange={(e) => setIpbeginValue(e.target.value)} // Update the state on change
                                />
                            </li>
                            <li>
                                <input
                                    type="text"
                                    className="clearfix form-controldis searchbar"
                                    placeholder={isByMask ? "Subnet Mask" : "IP Range End"}
                                    value={ipendValue}
                                    onChange={(e) => setIpEndValue(e.target.value)} // Update the state on change
                                />
                            </li>
                            <li>
                                <button className="clearfix startdbtn" onClick={handleIpAddStart} disabled={loading}>
                                    Start
                                </button>
                            </li>
                            <li>
                                <button className="clearfix resetbtn" onClick={handleIpAddReset}>
                                    Reset
                                </button>
                            </li>
                        </ul>
                        <label style={{ marginLeft: '25px' }}> <input type="checkbox" className="incl2" 
                        checked={isByMask}
                        onChange={() => setIsByMask(!isByMask)}
                        /></label>
                        <span className="maskcl"> By Mask</span>
                    </article>

                    )}
                    {activeCont === 'Upload' && (<article className="clearfix specicontupload">

                        <article className="regioncont">
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
                            <button onClick={handleUpload} class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                            <button onClick={downloadSampleCSV} class="createbtn">Sample.csv<i class="fa fa-file-text" aria-hidden="true"></i></button>

                        </article>
                    </article>

                    )}
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                </article>


            </article>
        </>
    );
};

export default DiscovContai;
