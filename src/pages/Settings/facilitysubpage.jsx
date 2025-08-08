import React,{useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';


const FacilitySubCont=({handleSubContainer})=>{
            const [selectedFile, setSelectedFile] = useState(null);
    

    const handleProfileContclose=()=>{
        handleSubContainer()
    }

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = () => {
        if (selectedFile) {
            console.log("Uploading:", selectedFile.name);
            alert(`Uploading: ${selectedFile.name}`);
            // Handle upload to server here
        } else {
            alert("Please select a file first.");
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


    return(

        <>
        <article>
        <article className="row border-tlr" style={{margin:'0 0 0 5px'}}>
                            <article className="col-11"> 
                                <h1 className="regititle">Facility</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Facility Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />
                                <article>
                                    <label className="vlanlabel">Region</label>
                                    <article>
                                        <select class=""  className="vlaninput">
                                            <option value="-1" selected="selected" label="All">All</option>
                                            <option value="1" label="AP">PTP</option>
                                            <option value="2" label="SU">BackHaul</option>
                                            <option value="2" label="SU">PTMP</option>
                                        </select>

                                    </article>
                                </article>
                                <article>
                                    <label className="vlanlabel">Select City</label>
                                    <article>
                                        <select class=""  className="vlaninput">
                                            <option value="-1" selected="selected" label="All">All</option>
                                            <option value="1" label="AP">PTP</option>
                                            <option value="2" label="SU">BackHaul</option>
                                            <option value="2" label="SU">PTMP</option>
                                        </select>

                                    </article>
                                </article>

                                <article>
                                    <label className="vlanlabel">Select Location</label>
                                    <article>
                                        <select class=""  className="vlaninput">
                                            <option value="-1" selected="selected" label="All">All</option>
                                            
                                        </select>

                                    </article>
                                </article>
                                <label className="settinglabelsub">Latitude</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />

                                <label className="settinglabelsub">Longitude</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />



                                <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="clearfix notelist">
                                    <li>
                                        Only Alphanumeric characters, hyphen and underscore are allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center>
                                        <button className="cancelbtn">Cancle</button>
                                        <button className="creatsetingbtn">Create</button>
                                </center>
                                <hr className="hrnote" />
                                <p className="uploadhead" style={{marginBottom:'20px'}}>Upload Facilities</p>
                                <article className="regioncont">                                        
                                    <label htmlFor="" className="disfilelabel" style={{marginBottom:'15px'}}>Select your file</label>
                                    <div className="filename-display">
                                          {selectedFile ? selectedFile.name : 'No file selected'}
                                        </div>
                                    {/* <input type="text" className="lineinputcl" id='myInput' disabled /> */}
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
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default FacilitySubCont;