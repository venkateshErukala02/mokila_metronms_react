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
        const [selectedIds, setSelectedIds] = useState([]);
        const [showConfirmDeletePopupStatus,setShowConfirmDeletePopupStatus] = useState(false);
        const [showDeleteSuccessPopup,setShowDeleteSuccessPopup] = useState(false);
        const value = priorityChecked ? "highpriority" : "none";
        const [showWarningPopup,setShowWarningPopup] = useState(false);
        const [tagTypeValue, setTagTypeValue] = useState('');
        const [stationList, setStationList] = useState([]);
        const [location, setLocation] = useState("");
        const [direction,setDirection] = useState("");
        const [role,setRole] = useState("");
        const [position,setPosition] = useState("");
        const [showConfigPopup,setShowConfigPopup] =  useState(false);
        const [tagTypeTdm, setTagTypeTdm] = useState(false);
        const [tagTypeNtdm, setTagTypeNtdm] = useState(false);  
        const [reportAlarm,setReportAlarm] = useState(false);
        const [sendMail,setSendMail] = useState(false);
        const [configureStatus,setConfigureStatus] = useState({});

        useEffect(() => {
            const getStationList = async () => {
                try {
                const response = await fetch(
                    "api/v2/wayside/station/list"
                );

                const data = await response.json();
                setStationList(data);
                } catch (error) {
                console.error("Error fetching station list:", error);
                }
            };

            getStationList();
        }, []);


         useEffect(() => {
           if (!tagIdText.trim()) return;

            const fetchData = async () => {
                setIsLoading(true);
                await handleSearchData(tagIdText);
            };

            fetchData();
        }, [searchTrigger]);

        const getTagData = async (url,showLoader = false) => {
              if (showLoader) {
                setIsLoading(true);
             }
            setIsError({ status: false, msg: "" });
            try {
                const options = {
                    method: "GET",
                    headers: {
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
            }finally {
                if (showLoader) {
                    setIsLoading(false);
                }
            }
        };

        useEffect(() => {
            if (searchBtn) return;

            const params = new URLSearchParams({
                page: pageCount,
            });

            if (location) params.append("location", location);
            if (direction) params.append("direction", direction);
            if (position) params.append("position", position);
            if (tagTypeValue) params.append("tagtype", tagTypeValue);
            if (role) params.append("role", role);

            const url = `api/v2/wayside/waySideTags?${params.toString()}`;

            getTagData(url, true);

            const intervalId = setInterval(() => {
                getTagData(url, false);
            }, 30000);

            return () => clearInterval(intervalId);
        }, [pageCount, searchBtn, location, direction, position, tagTypeValue, role]);    

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
            // const token = btoa(`${username}:${password}`)
            const response = await fetch('api/v2/wayside/uploadtags', {
                method: "POST",
                headers: {
                    // 'Authorization': `Basic ${token}`
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
            setPageCount(1);
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

      const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = tagData?.tags.map((item) => item.tagId);
            setSelectedIds(allIds);
        } else {
                setSelectedIds([]);
            }
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id) // uncheck
                : [...prev, id] // check
        );
    };


      const handleDeleteSelected = async () => {
                const payload = {
                "tagIds": selectedIds
            };
       
        const method = 'POST';
        try {
            const response = await fetch(`api/v2/wayside/deleteTag`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const text = await response.text();

            if (response.ok) {
            setShowDeleteSuccessPopup(true);
            setSelectedIds([]);
            const url=`api/v2/wayside/waySideTags?page=${pageCount}`;
            getTagData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); // Turn off loading state
        }

    }

       const handleBulkDelete = () => {
        if (selectedIds.length === 0) {
            setShowWarningPopup(true);
            return;
        }
        setShowConfirmDeletePopupStatus(true);
    };

    const handleClosePopup=()=>{
        setShowConfirmDeletePopupStatus(false);
      }

       const handleCurrentConfigureStatus = async () => {

            const url = 'api/v2/wayside/configure/current';

            try {
                // setIsLoading(true);

                const response = await fetch(url, {
                    method: 'GET',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                });

                const data = await response.json();

                if (response.ok) {
                    setConfigureStatus(data);
                    // setShowAddedSuccessPopup(true);
                } else {
                    setIsError('Error starting configuration');
                }
            } catch (error) {
                setIsError('An error occurred while contacting the server.');
            } finally {
                // setIsLoading(false);
            }
        };

        useEffect(() => {
            if (!configureStatus) return;

            setReportAlarm(configureStatus.action?.reportAlarm ?? false);
            setSendMail(configureStatus.action?.sendMail ?? false);

            const tagType = configureStatus.tagtype?.toUpperCase();

            setTagTypeTdm(
                tagType === "ALL" || tagType === "TDM"
            );

            setTagTypeNtdm(
                tagType === "ALL" || tagType === "NTDM"
            );
        }, [configureStatus]);



        const handleOpenConfigpopup  = ()=>{
            setShowConfigPopup(true);
            handleCurrentConfigureStatus();
        }
        const handleCloseConfigpopup=()=>{
            setTagTypeTdm(false);
            setTagTypeNtdm(false);
            setSendMail(false);
            setReportAlarm(false);
            setShowConfigPopup(false);
        
        }

       const handleSendMailChange = (e) => {
            setSendMail(e.target.checked);
        };


           const handleSetConfigure = async (e) => {
            e.preventDefault();

            let typeValue = '';

            if (tagTypeNtdm && tagTypeTdm) {
                typeValue = 'all';
            } else if (tagTypeNtdm) {
                typeValue = 'NTDM';
            } else if (tagTypeTdm) {
                typeValue = 'TDM';
            }

            const url = `api/v2/wayside/configure?sendMail=${sendMail}&reportAlarm=${reportAlarm}&type=${typeValue}`;

            try {
                setIsLoading(true);

                const response = await fetch(url, {
                    method: 'GET',
                    // headers: {
                    //     'Content-Type': 'application/json',
                    // },
                });

                if (response.ok) {
                    console.log('Configuration successful');
                    // setShowAddedSuccessPopup(true);
                } else {
                    setIsError('Error starting configuration');
                }
            } catch (error) {
                console.error('Configure error:', error);
                setIsError('An error occurred while contacting the server.');
            } finally {
                setIsLoading(false);
            }
        };


      const handleResetConfigure = () => {
            setTagTypeTdm(false);
            setTagTypeNtdm(false);
            setSendMail(false);
            setReportAlarm(false);

            handleResetConfiguration(false, false, false, false);
        };

        const handleResetConfiguration = async (
            tdm = tagTypeTdm,
            ntdm = tagTypeNtdm,
            mail = sendMail,
            alarm = reportAlarm
        ) => {

            let typeValue = '';

            if (ntdm && tdm) {
                typeValue = 'all';
            } else if (ntdm) {
                typeValue = 'NTDM';
            } else if (tdm) {
                typeValue = 'TDM';
            }

            const url =
                `api/v2/wayside/configure?sendMail=${mail}` +
                `&reportAlarm=${alarm}&type=${typeValue}`;

            try {
                setIsLoading(true);

                const response = await fetch(url, {
                    method: 'GET',
                });

                if (response.ok) {
                    console.log('Configuration reset successfully');
                } else {
                    setIsError('Error resetting configuration');
                }
            } catch (error) {
                console.error('Configure error:', error);
                setIsError('An error occurred while contacting the server.');
            } finally {
                setIsLoading(false);
            }
        };

 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-9' : 'col-12'}>
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
                                            <button type="button"
                                            className={`createbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`}
                                    title={currentUser === "Read-only" ? "Permission required" : ""}
                                    onClick={currentUser !== 'Read-only' ? handleBulkDelete : undefined}>Delete
                                                <i className="fa fa-trash" style={{paddingLeft:'5px'}} aria-hidden="true"></i>
                                            </button>

                                        </li>
                                         <li>
                                            <button type="button"
                                            className={`createbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`}
                                    title={currentUser === "Read-only" ? "Permission required" : ""}
                                    onClick={currentUser !== 'Read-only' ? handleOpenConfigpopup : undefined}>Configure
                                            </button>

                                        </li>
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

                            <article className="row border-allsd" style={{ height: '77.5vh',overflowY: 'auto', overflowX: 'clip',position:'relative'}}>
                                <table className="col-12 table-fixed" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                            <th style={{paddingLeft:'49px'}}><input type="checkbox" className="incl"
                                            onChange={handleSelectAll}                                     
                                             checked={
                                                tagData?.tags?.length > 0 &&
                                                selectedIds.length === tagData.tags.length
                                            }
                                        /></th>
                                            <th>Tag Id</th>
                                            <th className="wayside-table-header">
                                                <select
                                                    name="location" id="location" value={location}
                                                    onChange={(e) =>{ setLocation(e.target.value);setPageCount(1);}}
                                                    className="form-controll1"
                                                    style={{ maxWidth: "78px", minWidth: "78px" }}
                                                    >
                                                    <option value="">Location</option>

                                                    {stationList.map((station, index) => (
                                                        <option key={index} value={station}>
                                                        {station}
                                                        </option>
                                                    ))}
                                                    </select>

                                            </th>
                                            <th> 
                                                <select name="direction" id="direction" value={direction} onChange={(e) =>{ setDirection(e.target.value);setPageCount(1);}} className="form-controll1" style={{ maxWidth: '79px', minWidth: '79px' }}>
                                                    <option value="">Direction</option>
                                                    <option value="NB">NB</option>
                                                    <option value="SB">SB</option>
                                                    <option value="EB">EB</option>
                                                    <option value="WB">WB</option>
                                                    </select> 
                                            </th>
                                            <th className="wayside-table-header align">
                                                <select name="position" id="position" value={position} onChange={(e) =>{ setPosition(e.target.value);setPageCount(1);}} className="form-controll1" style={{ maxWidth: '74px', minWidth: '74px' }}>
                                                    <option value="">Position</option>
                                                    <option value="SBSE">SBSE</option>
                                                    <option value="NBSE">NBSE</option>
                                                    <option value="SBNE">SBNE</option>
                                                    <option value="NBNE">NBNE</option>
                                                    <option value="EBWE">EBWE</option>
                                                    <option value="WBEE">WBEE</option>
                                                    <option value="EBEE">EBEE</option>
                                                    <option value="WBWE">WBWE</option>
                                                    <option value="NB">NB</option>
                                                    <option value="SB">SB</option>
                                                    <option value="EB">EB</option>
                                                    <option value="WB">WB</option>
                                                    </select>
                                            </th>
                                            <th>
                                                 <select name="tagTypeValue" id="tagTypeValue" value={tagTypeValue} onChange={(e) =>{ setTagTypeValue(e.target.value);setPageCount(1);}} className="form-controll1" style={{ maxWidth: '77px', minWidth: '77px' }}>
                                                    <option value="">Tag Type</option>
                                                    <option value="TDM">Tdm</option>
                                                    <option value="NTDM">Ntdm</option>
                                                    <option value="ATC">ATC</option>
                                                    </select>
                                            </th>
                                            <th className="wayside-table-header">
                                                 <select name="role" id="role" value={role} onChange={(e) =>{ setRole(e.target.value);setPageCount(1);}} className="form-controll1" style={{ maxWidth: '74px', minWidth: '74px' }}>
                                                    <option value="">Role</option>
                                                    <option value="VON">VON</option>
                                                    <option value="VOFF">VOFF</option>
                                                    <option value="GENERIC VON">GENERIC VON</option>
                                                    <option value="GENERIC VOFF">GENERIC VOFF</option>
                                                    <option value="YARD ENTER">YARD ENTER</option>
                                                    <option value="YARD EXIT">YARD EXIT</option>
                                                    <option value="SNL">SNL</option>
                                                    <option value="DIR LEARN">DIR LEARN</option>
                                                    <option value="RAD REBOOT">RAD REBOOT</option>
                                                    <option value="UNKNOWN">UNKNOWN</option>
                                                    </select>
                                            </th>
                                            {/* <th>Priority</th>
                                            <th>Send Mail</th>
                                            <th>Report Alarm</th> */}
                                            <th style={{paddingLeft:"41px"}}>Edit</th>
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
                                            <td style={{paddingLeft:'45px'}}><input type="checkbox" className="incl"
                                                    checked={selectedIds.includes(item.tagId)}
                                                    onChange={() => handleSelect(item.tagId)}
                                                /></td>
                                            <td style={{paddingLeft:'18px'}}>{item.tag}</td>
                                            <td>{item.location}</td>
                                            <td style={{paddingLeft:'33px'}}>{item.line}</td>
                                            <td>
                                                {item.position || item.postion}</td>
                                            <td style={{paddingLeft:'23px'}}>{item.type}</td>
                                            <td style={{paddingLeft:'17px'}}>{item.role}</td>
                                            {/* <td style={{paddingLeft:'28px'}}><input type="checkbox" className="incl"
                                                     checked={item.priority === 1} // checkbox reflects priority
                                                onChange={() => {
                                                handlePriority(item.priority === 1 ? 0 : 1); 
                                                setPriorityChecked(!priorityChecked); // toggle state if needed
                                                }}

                                                /></td>
                                            <td style={{paddingLeft:'37px'}}><input type="checkbox" className="incl"
                                                checked={item.sendMail}
                                                onChange={()=>{ handleMail(item.sendMail === true ? 1 :0);
                                                    setMailChecked(!mailChecked)}
                                                }
                                                
                                            /></td>
                                            <td style={{paddingLeft:'53px'}}><input type="checkbox" className="incl"
                                                 checked={item.reportAlarm}
                                                onChange={()=>{ handleReport(item.reportAlarm === true ? 1 :0);
                                                    setReportChecked(!reportChecked)}
                                                }
                                            /></td> */}
                                            <td style={{paddingLeft:"36px"}}><i className="fas fa-edit"
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
                                            onClick={handleBulkDelete}
                                            disabled={selectedIds.length === 0}
                                            title={isReadOnly ? "Permission required" :''}
                                            ></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-3' : 'collapsed'} >
                        <WaysideTagSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        user={editUser} 
                         refreshTagData={()=> getTagData(`api/v2/wayside/waySideTags?page=${pageCount}`)}
                        />
                    </article> 
                    </article>
                     {showConfirmDeletePopupStatus && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">All the tag data will be lost. Are you sure you want to delete the tag?</h1>
                                <article className="f-r">
                                <button className="confirmdeletebtn" type="button" onClick={handleClosePopup}>NO</button>
                                <button className="confirmdeletebtn confirmdeletebtnyes" type="button" onClick={async () => { 
                                    await handleDeleteSelected();
                                    setShowConfirmDeletePopupStatus(false)}}>YES</button>
                                </article>
                                </article>
                            </article>
                            </>}
                              {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">Tag deleted successfully.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowDeleteSuccessPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}
                                {showWarningPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Warning</h1>
                                    <p className="confirmtextsucess">No devices have been selected for deletion.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => {setShowWarningPopup(false);
                                        }}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}

                                {showConfigPopup && (
                                                        <article className="confirmdeletepopup">
                                                            <article className="">
                                                <article className="custom-popup popupStyledate" style={{maxWidth:'500px',minWidth:'433px'}}>
                                                    <article className="row">
                                                        <article className="col-11">
                                                <h4 className="customheadtitle">Wayside Configuration </h4>
                                                        </article>
                                
                                                        <article className="col-1">
                                                               <span className="noticloseicon"><i className="fa fa-close noticlose" onClick={handleCloseConfigpopup} role="button"></i></span>
                                                        </article>
                                                        
                                                </article>
                                                   <div className="row">
                                                <div className="col-12" style={{ marginBottom: '8px' }}>
                                                    <h1 className="settinglabelsub">Action</h1>
                                                  <label className="radiolabel" style={reportAlarm ? {fontWeight:700,color:'#495057',marginRight:'10px'}:{marginRight:'10px'}}>
                                                        <input
                                                        type="checkbox"
                                                        checked={reportAlarm}
                                                        onChange={(e) => setReportAlarm(e.target.checked)}
                                                        className="radiobtn"
                                                        />
                                                        Report Alarm
                                                    </label>
                                
                                                    <label className="radiolabel" style={sendMail ? {fontWeight:700,color:'#495057'}:{}}>
                                                        <input
                                                        type="checkbox"
                                                        checked={sendMail}
                                                        onChange={(e) => setSendMail(e.target.checked)}
                                                        className="radiobtn"
                                                        />
                                                        Send Mail
                                                    </label>                   
                                                </div>
                                                </div>
                                                 <div className="row">
                                                <div className="col-12" style={{ marginBottom: '8px' }}>
                                                     <h1 className="settinglabelsub">Tag Type</h1>
                                                   <label
                                                    className="radiolabel"
                                                    style={{
                                                        fontWeight: tagTypeTdm ? 700 : 400,
                                                        color: tagTypeTdm ? '#495057' : undefined,
                                                        marginRight: '10px'
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={tagTypeTdm}
                                                        onChange={(e) => setTagTypeTdm(e.target.checked)}
                                                        className="radiobtn"
                                                    />
                                                    TDM
                                                </label>

                                                <label
                                                    className="radiolabel"
                                                    style={{
                                                        fontWeight: tagTypeNtdm ? 700 : 400,
                                                        color: tagTypeNtdm ? '#495057' : undefined
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={tagTypeNtdm}
                                                        onChange={(e) => setTagTypeNtdm(e.target.checked)}
                                                        className="radiobtn"
                                                    />
                                                    NTDM
                                                </label> 

                                                </div>
                                                </div>
                                                 <article className="">
                                                     <center className="d-f">
                                                <button  type="button" onClick={currentUser !== "Read-only" ? handleResetConfigure : undefined} style={{marginRight:"11px"}}
                                                 className={`resetconfigbtn ${
                                                    currentUser === "Read-only" ? "btndisable" : ""
                                                }`}
                                                title={currentUser === "Read-only" ? "Permission required" : ""}
                                                    disabled={currentUser === "Read-only"}
                                                >Reset</button>
                                               
                                                <button  type="button" onClick={currentUser !== "Read-only" ? handleSetConfigure : undefined}
                                                 className={`resetconfigbtn ${
                                                    currentUser === "Read-only" ? "btndisable" : ""
                                                }`}
                                                title={currentUser === "Read-only" ? "Permission required" : ""}
                                                    disabled={currentUser === "Read-only"}
                                                >Save Configure</button>
                                                </center>
                                                </article>
                                                </article>
                                                </article>
                                                </article>
                                            )}
        </>
    )
}

export default WaysideTagContainer;