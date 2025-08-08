import React,{useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';


const GroupSubCont=({handleSubContainer})=>{
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
                                <h1 className="regititle">Group</h1>
                            </article>
                            <article className="col-1">
                                <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                            </article>
                        </article>
                        <article className="clearfix border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Group Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />
                                <article>
                                <label className="settinglabelsub">Comments</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" />
                                </article>
                                

                                <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="clearfix notelist">
                                    <li>
                                        Only Alphanumeric characters, hyphen and underscore are allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button className="cancelbtn">Cancle</button>
                                        <button className="creatsetingbtn">Create</button>
                                </center>
                               
                                </article>
                                </form>

                            </article>

                        </article>
        </article>
        
        </>
    )
}

export default GroupSubCont;