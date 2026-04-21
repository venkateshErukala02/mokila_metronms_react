import  { useState, useEffect, useRef } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import './../Inventory/inventory.css';
import FirmwareContainerSub from "./firmwaresub";
import { faL, fas } from "@fortawesome/free-solid-svg-icons";
import FirmwarePopupTable from "./firmwarepopuptable";

const FirmwareContainer = () => {
    const [profileStatusCont, setProfileStatusCont] = useState(false);
    const [firmwareData, setFirmwareData] = useState([]);
    const [userLimitValueSel, setUserLimitValueSel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [mode, setMode] = useState(null);
    const [editUser, setEditUser] = useState(null);
    const [selected, setSelected] = useState(4);
    const [showList, setShowList] = useState(false);
    const [showPopup,setShowPopup] = useState(false);
    const [firmpopupData,setFirmpopupData] = useState([]);
    const [selectedTasks, setSelectedTasks] = useState([]);
    const previousDataRef = useRef(null);
    const columnWrapperRef =  useRef(null);
    const [firmwareToDelete, setFirmwareToDelete] = useState(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
    const [showBulkDeletePopup, setShowBulkDeletePopup] = useState(false);
    const [showBulkDeleteSuccessPopup, setShowBulkDeleteSuccessPopup] = useState(false);


        useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(columnWrapperRef.current && !columnWrapperRef.current.contains(event.target)){
                setShowList(false);
            }
        }
           
                document.addEventListener("click",handleClickOutside);

            return ()=>{
                document.removeEventListener("click",handleClickOutside);
            }
        
    },[showList]);


    const getFimwareData = async (url) => {
         if(previousDataRef.current === ''){
            setIsLoading(true);
        }
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
                 if (JSON.stringify(data) !== JSON.stringify(previousDataRef.current)) {
                      setFirmwareData(data); 
                    previousDataRef.current = data; 
                }
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
    const url = `api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=${userLimitValueSel}`;

    getFimwareData(url);

    const intervalId = setInterval(() => {
        getFimwareData(url);
    }, 10000); 

    return () => clearInterval(intervalId);

}, [selected,userLimitValueSel]);


    const handleUserLimitValue = (event) => {
        setUserLimitValueSel(event.target.value);

    }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditUser(null);
        setMode('create');
    }

    const handleSubContainer = (shouldRefresh = false) => {
    setProfileStatusCont(false);

    if (shouldRefresh) {
        getFimwareData(`api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`);
    }
};

    const handleEditUserDt = (user) => {
        setProfileStatusCont(true);
        setMode('edit');
        setEditUser(user);
    }



  const statuses = [
    { label: "All", value: 4 },
    { label: "Pending", value: 0 },
    { label: "Running", value: 1 },
    { label: "Successful", value: 2 },
    { label: "Failed", value: 3 },
  ];

const handleChange = (value) => {
    setSelected(value); 
  };

  const handleFirmwarePopup=(data)=>{
    setShowPopup(true);
    setFirmpopupData(data);
  }



    const handleDeleteFirmware = async (item) => {
    // const confirmDel = window.confirm("Are you sure you want to delete this firmware?");
    if (item.status === 'Running') {
        alert("Running task cannot be cancelled.");
        return;
    }
    // if (!confirmDel) return;

    setIsLoading(true);

    try {
        const username = 'admin';
        const password = 'admin';
        const token = btoa(`${username}:${password}`);
        let url='';
        if(item.status === 'Pending'){
            url = `api/v2/task/canceltask/${item.taskId}`
        }else{
            url = `api/v2/task/deletetask/${item.taskId}`
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                // 'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            }
        });

        if (response.ok) {
            setShowDeleteSuccessPopup(true);
            await getFimwareData(
                `api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`
            );
        } else {
            setIsError({
                status: true,
                msg: 'Failed to delete task'
            });
        }
    } catch (error) {
        setIsError({
            status: true,
            msg: error.message
        });
    } finally {
        setIsLoading(false);
    }
};


    const toggleTaskSelection = (taskId) => {
    setSelectedTasks(prev =>
        prev.includes(taskId)
            ? prev.filter(id => id !== taskId)
            : [...prev, taskId]
    );
};

const toggleSelectAll = () => {
    if (selectedTasks.length === firmwareData.length) {
        setSelectedTasks([]); 
    } else {
        setSelectedTasks(firmwareData.map(item => item.taskId));
    }
};

const handleBulkDelete = async () => {
    if (selectedTasks.length === 0) return;

    // const confirmDel = window.confirm(
    //     `Delete ${selectedTasks.length} selected tasks?`
    // );
    // if (!confirmDel) return;

    setIsLoading(true);

    const username = 'admin';
    const password = 'admin';
    const token = btoa(`${username}:${password}`);

    const requestBody = {
        list: selectedTasks   
    };

    try {
        const response = await fetch(`api/v2/task/deletetasks`, {
            method: "POST",
            headers: {
                //'Authorization': `Basic ${token}`,
                'Content-Type': 'application/json',
                'Accept': '*/*'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("Bulk delete failed");
        }
        setShowBulkDeleteSuccessPopup(true);
        await getFimwareData(
            `api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`
        );

        setSelectedTasks([]);

    } catch (error) {
        setIsError({ status: true, msg: error.message });
    } finally {
        setIsLoading(false);
    }
};

        const formatDateTime = (dateTime) =>
            dateTime ? dateTime.split('.')[0] : '';

    return (
        <>
            <article className="row">
                <article className={profileStatusCont ? 'col-8' : 'col-12'} style={{position:'relative'}}>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <article className="col-8">
                                <button className="arrowlf">
                                    <i className="fa-solid fa-arrow-left"></i>
                                </button>
                                <button className="numcl"><span>1</span></button>
                                <button className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                            </article>
                            <article className="col-4">
                                <article style={{ float: 'right' }}>
                                    <ul className="setttinglist">
                                         <li>
                                            <button className="createbtn" disabled={selectedTasks.length === 0}
                                             onClick={() => {
                                                if (selectedTasks.length === 0) return;
                                                setShowBulkDeletePopup(true);
                                            }}
                                            >Delete Selected {selectedTasks.length === 0 ? '' : `${selectedTasks.length}`}
                                            
                                            </button>
                                        </li>
                                        <li>
                                            <button className="createbtn" onClick={handleProfileContopen}>New Task</button>

                                        </li>

                                        <li>
                                            <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                <option value="10">10</option>
                                               <option value="25">25</option>
                                                <option value="50">50</option>
                                                <option value="100">100</option>
                                            </select>
                                        </li>
                                    </ul>
                                </article>
                            </article>
                        </article>

                        <article className="row border-allsd" style={{ height: '' }}>
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="settingthtb" style={{position:'relative'}}>
                                    <tr>
                                        <th> <input
                                            className="incl2"
                                            type="checkbox"
                                            checked={selectedTasks.length === firmwareData.length && firmwareData.length > 0}
                                            onChange={toggleSelectAll}
                                        /></th>
                                        <th>Task ID</th>
                                        <th>Task Name</th>
                                        <th>Scheduled Time</th>
                                        <th>Status <button className="glyphicon glyphicon-tasks configchangeicon" ref={columnWrapperRef} onClick={() => {setShowList(!showList);setSelected(4)}}></button>
                                        {showList && (  <ul className={profileStatusCont ? 'statuslist_sub_cont' : 'statuslist'}>
                                        {statuses.map(({ label, value }) => (
                                            <li key={value}>
                                            <label>
                                                <input
                                                type="checkbox"
                                                className="incl"
                                                checked={selected === value}
                                                onClick={(e) => e.stopPropagation()}
                                                onChange={() => handleChange(value)}
                                                />
                                                {label}
                                            </label>
                                            </li>
                                        ))}
                                        </ul>)}
                                        </th>
                                        <th>Cancel/Delete</th>
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

                                    {!isLoading && !isError.status && (!firmwareData || firmwareData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {firmwareData && firmwareData.map((item) => (
                                        <tr key={item.taskId} onClick={()=>handleFirmwarePopup(item)}>
                                            <td> <input
                                                type="checkbox"
                                                className="incl"
                                                checked={selectedTasks.includes(item.taskId)}
                                                onChange={() => toggleTaskSelection(item.taskId)}
                                                onClick={(e) => e.stopPropagation()} 
                                            /></td>
                                            <td>{item.taskId}</td>
                                            <td>{item.task}</td>
                                            <td>{formatDateTime(item.dateNTime)}</td>
                                            <td>{item.status}</td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}>
                                                {/* <i className="fa fa-trash" onClick={() => handleDeleteFirmware(item)}></i> */}
                                                 <i
                                                        className="fa fa-trash"
                                                        onClick={() => {
                                                            if (item.status === 'Running') {
                                                            alert("Running task cannot be cancelled.");
                                                            return;
                                                            }
                                                            setFirmwareToDelete(item);
                                                            setShowDeletePopup(true);
                                                        }}
                                                        ></i>
                                                </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>

                            {showDeletePopup && firmwareToDelete && (
                                <article className="confirmdeletepopup">
                                    <article className="confirmdeletepopupboxstyle">
                                    <h1 className="confirmdeletetitle">Are you sure you want to delete this config?</h1>
                                    <article className="f-r">
                                        <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowDeletePopup(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleDeleteFirmware(firmwareToDelete);
                                            setShowDeletePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}

                                {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The config has been deleted successfully.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => setShowDeleteSuccessPopup(false)}
                                        >
                                        OK
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}

                                 {showBulkDeletePopup && (
                                <article className="confirmdeletepopup">
                                    <article className="confirmdeletepopupboxstyle">
                                    <h1 className="confirmdeletetitle">
                                         Are you sure you want to Delete selected task{selectedTasks.length > 1 ? 's' : ''}?
                                    </h1>

                                    <article className="f-r">
                                        <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowBulkDeletePopup(false)}
                                        >
                                        NO
                                        </button>

                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleBulkDelete();
                                            setShowBulkDeletePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                    </article>
                                    </article>
                                </article>
                                )}

                                {showBulkDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                        <h1 className="confirmtitlesucess">Success</h1>
                                        <p className="confirmtextsucess">{selectedTasks.length} task{selectedTasks.length > 1 ? 's have' : ' has'} been deleted successfully.</p>
                                        </article>
                                        <article style={{ textAlign: 'end' }}>
                                            <button
                                                className="confirmdeletebtn confirmdeletebtnyes"
                                                onClick={() => setShowBulkDeleteSuccessPopup(false)}
                                                >
                                                OK
                                            </button>
                                        </article>
                                    </article>
                                </article>
                                )}
                                
                        </article>
                    </article>

                     {showPopup && (
                        <div className="firmwarepopupStyle">
                        <div className="firmwarepopupBoxStyle">
                            <article>
                                <i className="fa fa-close noticlose" role="button" tabindex="0" onClick={() => setShowPopup(false)} style={{ marginBottom: '5px', float: 'right',transform:'translateY(-8px)',fontSize:'15px',paddingRight:'12px' }}></i>
                            </article>
                            <article style={{display:'inline-block'}}>
                            <FirmwarePopupTable firmpopupData={firmpopupData} />
                            </article>
                        </div>
                        </div>
                    )}
                </article>

                <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                    <FirmwareContainerSub  handleSubContainer={handleSubContainer}    refreshLineData={()=>getFimwareData(`api/v2/task/list?show=firmwareClass&status=${selected}&offset=-1&count=25`)
                                    }/>
                </article>
            </article>
        </>
    )
}

export default FirmwareContainer;