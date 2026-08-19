import React,{useState,useEffect} from "react";
import '../ornms.css'
import UserSubCont from "./usersubpage";
import './../Settings/settings.css';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from "react-redux";

const UserContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [userData, setUserData] = useState([]);
        const [userLimitValueSel, setUserLimitValueSel] = useState('10');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [mode, setMode] = useState(null); 
        const [editUser, setEditUser] = useState(null);
        const [sortOrder, setSortOrder] = useState('asc');
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';
        const [itemToDelete, setItemToDelete] = useState(null);
        const [showDeletePopup, setShowDeletePopup] = useState(false);
        const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
        const [pageSize, setPageSize] = useState(1);
        const [fromValue,setFromValue] =useState('0');

        const getUserData = async (url,showLoader = false) => {
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
                   if (response.status === 204) {
                    if (showLoader) {
                        setIsLoading(false);
                    }
                    setUserData([]);
                    setIsError({ status: false, msg: '' });
                    return;
                }
    
                const data = await response.json();
                if (response.ok &&  response.status === 200) {
                    setIsLoading(false);
                    if(data?.users?.length === 0){
                        setUserData([]); 
                    }else{
                    setUserData(data.users || []);
                    setIsError({ status: false, msg: "" });
                    }
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
            const url=`rest/users/list?limit=${userLimitValueSel}&offset=${fromValue}&sort=${sortOrder}`
            getUserData(url,true);

        const intervalId = setInterval(() => {
            getUserData(url, false);
            }, 30000);


        return ()=> clearInterval(intervalId);
    
        }, [userLimitValueSel,sortOrder,fromValue]);

        const handleUserLimitValue = (event) => {
            setPageSize(1);
            setFromValue('0');
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



      const handleDeleteUser = async (item) => {
        const method = 'DELETE';
       
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`rest/users/${item["user-id"]}`, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd'
                },
            });

            const text = await response.text();

            if (response.ok) {
                setShowDeleteSuccessPopup(true);
                const url=`rest/users/list?limit=${userLimitValueSel}&offset=${fromValue}&sort=${sortOrder}`
                getUserData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }

     const handleSort = () => {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    };

       const handleIncreamentOffset = () => {
         setPageSize(prevPageSize => {
        if (!userData || userData.length  === 0) return prevPageSize;

        const newPageSize = prevPageSize + 1;
        setFromValue(parseInt(newPageSize-1) * parseInt(userLimitValueSel));
        return newPageSize;
        });
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(userLimitValueSel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }


 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button type="button" className="numcl"><span>{pageSize}</span></button>
                                    <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            <li>
                                                <button type="button" className="createbtn" onClick={handleProfileContopen}>Create</button>

                                            </li>

                                            <li>
                                                <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="10" label="10" defaultValue={10}>10</option>
                                                    <option value="25" label="25">25</option>
                                                    <option value="50" label="50">50</option>
                                                    <option value="100" label="100">100</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '80vh',overflowY:'auto',overflowX: 'clip' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb tableheadpostion">
                                        <tr>
                                         <th onClick={handleSort}>Username  <FontAwesomeIcon
                                            icon={sortOrder ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort}
                                            style={{ color: 'black' }}     
                                            /></th>
                                            <th>Full Name	 </th>
                                            <th>Email </th>
                                            <th>Roles</th>
                                            <th>Line</th>
                                            <th>Edit</th>
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

                                    {!isLoading && !isError.status && (!userData || userData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {userData && userData.map((item) => (
                                        <tr key={item.id}>
                                             <td>{item["user-id"]}</td>
                                            <td>{item["full-name"]}</td>
                                            <td>{item.email}</td>
                                            <td>{item.role}</td>
                                            <td>{item["region-name"]}</td>
                                            <td ><i className="fas fa-edit" onClick={currentUser !== 'Read-only' ? ()=> handleEditUserDt(item) : undefined}></i></td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" 
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentUser !== 'Read-only') {
                                                setItemToDelete(item);
                                                setShowDeletePopup(true);
                                                }
                                            }}
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
                        <UserSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        user={editUser} 
                        refreshUserData={()=> getUserData('rest/users/list?limit=10&offset=0&sort=asc')}
                        />
                    </article> 
                    </article>

                     {showDeletePopup && itemToDelete && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this user?</h1>
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
                                            await handleDeleteUser(itemToDelete);
                                            setShowDeletePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}

                             {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The user has been deleted successfully.</p>
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
        </>
    )
}

export default UserContainer;