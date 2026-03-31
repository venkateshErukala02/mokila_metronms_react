import { useState, useEffect } from "react";
import './../Discovery/discovery.css';
import { useSelector } from "react-redux";


const ProvisionFileUp = () => {

    const [error, setError] = useState({ status: false, msg: "" });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);
    const isReadOnly = currentUser === 'Read-only';
    const [showUploadSuccessPopup,setShowUploadSuccessPopup] = useState(false);

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
            const response = await fetch("api/v2/nodes/nodeupdate", {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                   
                },
                body: formData, 
            });

            if (response.ok) {
                 setShowUploadSuccessPopup(true);
                // setSuccess('File Uploaded successfully');
                // alert('File Uploaded successfully')

                setSelectedFile(null);
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };


    const downloadSampleCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + [" IP Address,macAddress/nodeSysName/productcode/position/serialNumber/facility", "192.168.2.91,AP"].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "Sample.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };


    return (
        <div className="barchtcont">
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
                <button 
                 onClick={
                    currentUser !== "Read-only"
                    ? () => document.getElementById("hiddenFileInput").click()
                    : undefined
                }
                title={currentUser === "Read-only" ? "Permission required" : ""}
                        disabled={isReadOnly}  className="attachcl"
                    >
                    <i className="fa-solid fa-paperclip"></i></button>
                <button
                onClick={currentUser !== 'Read-only' ? handleUpload : undefined}
                             title={currentUser === "Read-only" ? "Permission required" : ""}
                                    disabled={isReadOnly} 
             className="uploadcl"><i className="fa-solid fa-upload"></i></button>
                <button onClick={downloadSampleCSV} className="createbtn">Sample.csv<i className="fa fa-file-text" aria-hidden="true"></i></button>

            </article>
              {showUploadSuccessPopup && (
                                    <article className="confirmsuccesspopup">
                                        <article className="confirmsuccesspopupboxstyle">
                                            <article className="success-cont">
                                        <h1 className="confirmtitlesucess">Success</h1>
                                        <p className="confirmtextsucess">The file has been uploaded successfully.</p>
                                        </article>
                                        <article style={{ textAlign: 'end' }}>
                                            <button
                                            className="confirmdeletebtn confirmdeletebtnyes"
                                            onClick={() => setShowUploadSuccessPopup(false)}
                                            >
                                            OK
                                            </button>
                                        </article>
                                        </article>
                                    </article>
                                    )}
        </div>

        
    );
};

export default ProvisionFileUp;
