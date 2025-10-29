import React,{useState,useEffect} from "react";
import '../ornms.css'
import UserSubCont from "./usersubpage";
import './../Settings/settings.css';
import WaysideTagSubCont from "./waysidetagsub";

const WaysideTagContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(false);
        const [userData, setUserData] = useState([]);
        const [userLimitValueSel, setUserLimitValueSel] = useState('25');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [mode, setMode] = useState(null); 
        const [editUser, setEditUser] = useState(null);
        const [selectedFile,setSelectedFile] = useState('');
        const [deviceType,setDeviceType] = useState('');
        const [version, setVersion] = useState('');
        const [success, setSuccess] = useState('');
        const [mailChecked,setMailChecked] = useState();
        const [priorityChecked, setPriorityChecked] = useState();
        const [reportChecked,setReportChecked] = useState();

        const value = priorityChecked ? "highpriority" : "none";
        const getUserData = async (url) => {
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
                    setUserData(data.tags);
                    setIsError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }
            } catch (error) {
                setIsLoading(false);
                setIsError({ status: true, msg: error.message });
            }
        };


     useEffect(() => {

            const url=`api/v2/wayside/waySideTags?page=${userLimitValueSel.trim()}`;
            getUserData(url);
    
        }, [userLimitValueSel]);

         useEffect(() => {

            const url='api/v2/wayside/waySideTags?page=1'
            getUserData(url);
    
        }, []);

        const handleUserLimitValue = (event) => {
            setUserLimitValueSel(event.target.value);
    
        }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditUser(null);  
        setMode('create');
    }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }
    const handleEditUserDt=(user)=>{
        setProfileStatusCont(true);
        setMode('edit');
        setEditUser(user);  
    }



   const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Please select a file first.");
            return;
        }

        setIsLoading(true);
        setIsError('');
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
                setIsError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handlePriority=(value)=>{
        setPriorityChecked(value !== 0);
    }

    const handleMail=(value)=>{
        if(value === true){
            setMailChecked(true)
        }else{
            setMailChecked(false);
        }
    }

    const handleReport=(value)=>{
        if(value === true){
            setReportChecked(true)
        }else{
            setReportChecked(false);
        }
    }
 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                               <article style={{display:'flex',justifyContent:'left',padding:'4px 0px 4px 12px'}} className="border-allsd col-12">
                                    <div className="filename-display-wayside-setting">
                                        {selectedFile ? selectedFile.name : 'Upload tagdb file'}
                                    </div>
                                    <input
                                        className="dislineinputcl"
                                        type="file"
                                        onChange={handleFileChange}
                                        id="hiddenFileInput"
                                        style={{ display: "none" }}
                                    />
                                    <button onClick={() => document.getElementById("hiddenFileInput").click()} class="attachcl-wayside-setting">
                                        <i class="fa-solid fa-paperclip"></i></button>
                                    <button onClick={handleUpload} class="uploadcl-wayside-setting"><i class="fa-solid fa-upload"></i></button>
                                       </article>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <button className="clearfix arrowlf">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button className="clearfix numcl"><span>1</span></button>
                                    <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right'}}>
                                        <ul className="setttinglist">
                                            {/* <li>
                                                <button className="clearfix createbtn" onClick={handleProfileContopen}>Upload</button>

                                            </li> */}

                                            <li>
                                                <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="1" label="25">25</option>
                                                    <option value="2" label="50">50</option>
                                                    <option value="3" label="75">75</option>
                                                    <option value="4" label="100">100</option>
                                                </select>
                                            </li>
                                        </ul>
                                      
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '77.5vh',overflow:'auto' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                            <th><input type="checkbox" className="incl"
                                            onChange=''                                           checked=''
                                        /></th>
                                            <th>Tag Id  </th>
                                            <th>Location	 </th>
                                            <th>Direction </th>
                                            <th>Position</th>
                                            <th>Tagtype</th>
                                            <th>Priority</th>
                                            <th>Send Mail</th>
                                            <th>Report Alarm </th>
                                            <th>Edit </th>
                                            <th>Delete </th>
                                        </tr>

                                    </thead>
                                    <tbody className="settingbdtb">
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>
                                                Loading...
                                            </td>
                                        </tr>
                                    )}

                                    {isError.status && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                                {isError.msg}
                                            </td>
                                        </tr>
                                    )}

                                    {!isLoading && !isError.status && (!userData || userData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {userData && userData.map((item) => (
                                        <tr key={item.id}>
                                            <td><input type="checkbox" className="incl"
                                                    checked=''
                                                    onChange=''
                                                /></td>
                                            <td>{item.tag}</td>
                                            <td>{item.location}</td>
                                            <td>{item.direction}</td>
                                            <td>
                                                {item.position}</td>
                                            <td>{item.type}</td>
                                            <td><input type="checkbox" className="incl"
                                                     checked={item.priority === 1} // checkbox reflects priority
                                                onChange={() => {
                                                handlePriority(item.priority === 1 ? 0 : 1); 
                                                setPriorityChecked(!priorityChecked); // toggle state if needed
                                                }}

                                                /></td>
                                            <td><input type="checkbox" className="incl"
                                                checked={item.sendMail}
                                                onChange={()=>{ handleMail(item.sendMail === true ? 1 :0);
                                                    setMailChecked(!mailChecked)}
                                                }
                                                
                                            /></td>
                                            <td><input type="checkbox" className="incl"
                                                 checked={item.reportAlarm}
                                                onChange={()=>{ handleReport(item.reportAlarm === true ? 1 :0);
                                                    setReportChecked(!reportChecked)}
                                                }
                                            /></td>
                                            <td ><i className="fas fa-edit" onClick={()=> handleEditUserDt(item)}></i></td>
                                            <td><i className="fa fa-trash"></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        <WaysideTagSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        user={editUser} 
                        // refreshUserData={()=> getUserData('rest/users/list?limit=10&offset=0&sort=asc')}
                        />
                    </article> 
                    </article>
        </>
    )
}

export default WaysideTagContainer;