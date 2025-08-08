import React, { useState, useEffect } from "react";
import './../Discovery/discovery.css';


const ProvisionFileUp = () => {

    const [error, setError] = useState({ status: false, msg: "" });
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [success, setSuccess] = useState('');


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
            const response = await fetch("api/v2/nodes/nodeupdate", {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                   
                },
                body: formData, // Don't set Content-Type manually!
            });

            if (response.ok) {
                setSuccess('File Uploaded successfully');
                alert('File Uploaded successfully')

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
                <button onClick={() => document.getElementById("hiddenFileInput").click()} class="attachcl">
                    <i class="fa-solid fa-paperclip"></i></button>
                <button onClick={handleUpload} class="uploadcl"><i class="fa-solid fa-upload"></i></button>
                <button onClick={downloadSampleCSV} class="createbtn">Sample.csv<i class="fa fa-file-text" aria-hidden="true"></i></button>

            </article>
        </div>
    );
};

export default ProvisionFileUp;
