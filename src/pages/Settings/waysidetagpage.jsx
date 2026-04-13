import React,{useState,useEffect, useRef} from "react";
import '../ornms.css'
import UserSubCont from "./usersubpage";
import './../Settings/settings.css';
import WaysideTagSubCont from "./waysidetagsub";
import { useSelector } from "react-redux";

const WaysideTagContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(false);
        const [tagData, setTagData] = useState([]);
        const [userLimitValueSel, setUserLimitValueSel] = useState('1');
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
        const [pageCount,setPageCount] = useState(1);
        const userDataRef = useRef('');
        const [searchBtn, setSearchBtn] = useState(false);
        const [tagIdText,setTagIdText] = useState('');
        const [searchTrigger, setSearchTrigger] = useState(0);
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';

        const value = priorityChecked ? "highpriority" : "none";

         useEffect(() => {
           if (!tagIdText.trim()) return;

            const fetchData = async () => {
                setIsLoading(true);
                await handleSearchData(tagIdText);
            };

            fetchData();
        }, [searchTrigger]);

        const getTagData = async (url) => {
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
                    setTagData(data);
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
         if (searchBtn) return;
            const fetchData =async()=>{
            const url=`api/v2/wayside/waySideTags?page=${pageCount}`;
            await getTagData(url);
            }
            fetchData();

            const intervalId=setInterval(fetchData,30000);

            return ()=> clearInterval(intervalId);
    
        }, [pageCount,searchBtn]);

        //  useEffect(() => {

        //     const url='api/v2/wayside/waySideTags?page=1'
        //     getTagData(url);
    
        // }, []);

        const handleUserLimitValue = (event) => {
            setUserLimitValueSel(event.target.value);
        }

        const handleDecrement=()=>{
            if(pageCount === 1){
            setPageCount(1);
            }else{
                setPageCount(prev => prev -1);
            }
        }
        const handleIncrement =()=>{
            if(tagData.totalPages === pageCount){
            setPageCount(prev => prev);
            }else{
                 setPageCount(prev => (prev+1));
            }
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



//    const handleUpload = async (e) => {
//         e.preventDefault();
//         if (!selectedFile) {
//             alert("Please select a file first.");
//             return;
//         }

//         setIsLoading(true);
//         setIsError('');
//         setSuccess('');

//         const formData = new FormData();
//         formData.append('upfile', selectedFile);

//         try {
//             const username = 'admin';
//             const password = 'admin';
//             const token = btoa(`${username}:${password}`)
//             const response = await fetch(`api/v2/firmware/uploaddiscctx/${deviceType}/${version}`, {
//                 method: "POST",
//                 headers: {
//                     'Authorization': `Basic ${token}`
//                 },
//                 body: formData,
//             });

//             if (response.ok) {
//                 setSuccess('File upload has started.');
//                 alert('File upload has started.')

//                 setSelectedFile(null);
//             } else {
//                 const errText = await response.text();
//                 setIsError(`Error starting discovery: ${errText}`);
//             }
//         } catch (error) {
//             setIsError('An error occurred while contacting the server.');
//         } finally {
//             setIsLoading(false);
//         }
//     };


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
            const response = await fetch('api/v2/wayside/uploadtags', {
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


       const handleSearchData = async (tagIdText) => {

                try {
                    const response = await fetch(`api/v2/wayside/searchTag?tag=${tagIdText}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                      if (response.status === 204) {
                            setIsLoading(false);
                            setTagData([]);
                            return;
                        }
                    const tgData = await response.json();
                     const data = tgData?.tags?.[0];
                    if (!data || (Array.isArray(data) && data.length === 0)) {
                    setIsLoading(false);
                    setTagData([]);
                    return;
                    }

                    if (response.ok) {
                        setIsLoading(false);
                        setTagData({tags : Array.isArray(data) ? data : [data],
                            totalPages : 1
                        });
                        setIsError({ status: false, msg: "" });
                    } else {
                        throw new Error("data not found");
                    }

                } catch (error) {
                    setIsError({ status: true, msg: error.message });
                }finally {
                    setIsLoading(false);
                }

        }

         const handleSearchClick = (e) => {
        e.preventDefault();
        if (!tagIdText.trim()) {
            alert("Please enter a search term");

        } else {
            setSearchBtn(true);
            setSearchTrigger(prev => prev + 1);
        }
    }

    const handleClearSearch = () => {
        setSearchBtn(false);
        setTagIdText('');
        setPageCount(1);
        const url=`api/v2/wayside/waySideTags?page=${pageCount}`;
        getTagData(url);
      }
 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                               <article style={{display:'flex',justifyContent:'left',padding:'4px 0px 4px 12px'}} className="border-allsd col-12">
                                    <div className="filename-display-wayside-setting">
                                        {selectedFile ? selectedFile.name : 'Upload Tagdb File'}
                                    </div>
                                    <input
                                        className="dislineinputcl"
                                        type="file"
                                        onChange={handleFileChange}
                                        id="hiddenFileInput"
                                        style={{ display: "none" }}
                                    />
                                    <button type="button" onClick={currentUser !== "Read-only" ? () => document.getElementById("hiddenFileInput").click() : undefined} className="attachcl-wayside-setting" disabled={isReadOnly}
                                           title={currentUser === "Read-only" ? "Permission required" : ""}
                                        >
                                        <i className="fa-solid fa-paperclip"></i></button>
                                    <button type="button" onClick={currentUser !== "Read-only" ? handleUpload :undefined} className="uploadcl-wayside-setting"
                                       title={currentUser === "Read-only" ? "Permission required" : ""}
                                    disabled={isReadOnly}><i className="fa-solid fa-upload"></i></button>
                                       </article>
                            <article className="row custom-row border-tlr">
                                <article className="col-4">
                                    <button type="button" className="arrowlf" onClick={handleDecrement}>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button type="button" className="numcl"><span>{pageCount}</span></button>
                                    <button type="button" className="arrowlf" onClick={handleIncrement}><i className="fa-solid fa-arrow-right"></i></button>
                                </article>
                                <article className="col-8">
                                    <article style={{ float: 'right'}}>
                                        <ul className="setttinglist">
                                            <li>
                                                 <input type="text" style={{ marginRight: '10px' }} name="" placeholder="Tag Number" id="" value={tagIdText} onChange={(e) => setTagIdText(e.target.value)} className="form-controlinventory" />
                                <button type="button" className="createbtn" onClick={handleSearchClick}>Search</button>
                                 <button type="button" className="createbtn" style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }} onClick={handleClearSearch}> Clear Search</button>

                                            </li>

                                            <li>
                                                {/* <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="1" label="25">25</option>
                                                    <option value="2" label="50">50</option>
                                                    <option value="3" label="75">75</option>
                                                    <option value="4" label="100">100</option>
                                                </select> */}
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
                                            <th>Tag Type</th>
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

                                    {!isLoading && !isError.status && (!tagData?.tags || tagData?.tags?.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {tagData?.tags && tagData?.tags?.map((item) => (
                                        <tr key={item.id}>
                                            <td><input type="checkbox" className="incl"
                                                    checked=''
                                                    onChange=''
                                                /></td>
                                            <td>{item.tag}</td>
                                            <td>{item.location}</td>
                                            <td>{item.line}</td>
                                            <td>
                                                {item.position || item.postion}</td>
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
                                            <td ><i className="fas fa-edit"
                                             style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                color: isReadOnly ? "black" : "",
                                                opacity: isReadOnly ? 0.6 :1 
                                            }}
                                            title={isReadOnly ? "Permission required" :''}
                                            onClick={currentUser !== 'Read-only' ? ()=> handleEditUserDt(item) : undefined}></i></td>
                                            <td><i className="fa fa-trash"
                                             style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                color: isReadOnly ? "black" : "#ef0808",
                                                opacity: isReadOnly ? 0.6 :1 
                                            }}
                                            title={isReadOnly ? "Permission required" :''}
                                            ></i></td>
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
                         refreshTagData={()=> getTagData(`api/v2/wayside/waySideTags?page=${pageCount}`)}
                        />
                    </article> 
                    </article>
        </>
    )
}

export default WaysideTagContainer;