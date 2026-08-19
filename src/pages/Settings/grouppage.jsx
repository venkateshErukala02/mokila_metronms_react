import React,{useState,useEffect} from "react";
import '../ornms.css'
import LocationSubCont from "./stationsubpage";
import GroupSubCont from "./groupsubpage";
import './../Settings/settings.css';
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const GroupContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [groupData, setGroupData] = useState([]);
        const [groupLimitValueSel, setGroupLimitValueSel] = useState('10');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" }); 
        const [editGroup,setEditGroup] = useState(null); 
        const [mode, setMode] = useState(null); 
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';
        const [itemToDelete, setItemToDelete] = useState(null);
        const [showDeletePopup, setShowDeletePopup] = useState(false);
        const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
        const [pageSize, setPageSize] = useState(1);
        const [fromValue,setFromValue] =useState('0');
        const [sortOrder, setSortOrder] = useState('asc');

        const handleSort = () => {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        };

        
        const getGroupData = async (url) => {
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
    //             const text = await response.text();

    //             const data = JSON.parse(text); 
    
    const xmlText = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "application/xml");

        const groupNodes = xmlDoc.getElementsByTagName("group");

        // Convert XML to JS objects
        const groups = Array.from(groupNodes).map(group => ({
            name: group.getElementsByTagName("name")[0]?.textContent || "",
            comments: group.getElementsByTagName("comments")[0]?.textContent || "",
            user: group.getElementsByTagName("user")[0]?.textContent || ""
        }));

               
                    setIsLoading(false);
                    setGroupData(groups || []);
                    setIsError({ status: false, msg: "" });
                // } else {
                //     throw new Error("data not found");
                // }
            } catch (error) {
                setIsLoading(false);
                setIsError({ status: true, msg: error.message });
            }
        };


     useEffect(() => {

            // const url = `rest/groups?limit=${groupLimitValueSel}&offset=0&sort=asc`
            const url=`rest/groups?limit=${groupLimitValueSel}&offset=${fromValue}&sort=${sortOrder}`
            getGroupData(url);
    
        }, [groupLimitValueSel,fromValue,sortOrder]);

        const handleGroupLimitValue = (event) => {
            setPageSize(1);
            setFromValue('0');
            setGroupLimitValueSel(event.target.value);
    
        }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }


      const handleDeleteGroup = async (item) => {
        const method = 'DELETE';
      
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`rest/groups/${item.name}`, {
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
                const url=`rest/groups?limit=${groupLimitValueSel}&offset=${fromValue}&sort=${sortOrder}`;
                getGroupData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }

     const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditGroup(null);  
        setMode('create');
    }

    const handleEditSectionDt=(item)=>{
        setEditGroup(item);
        setProfileStatusCont(true);
        setMode('edit');
    }

       const handleIncreamentOffset = () => {
         setPageSize(prevPageSize => {
        if (!groupData || groupData.length  === 0) return prevPageSize;

        const newPageSize = prevPageSize + 1;
        setFromValue(parseInt(newPageSize-1) * parseInt(groupLimitValueSel));
        return newPageSize;
        });
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(groupLimitValueSel);
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
                                                <select className="form-controlfirm" value={groupLimitValueSel} onChange={handleGroupLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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
                                            <th onClick={handleSort}>Group Name <FontAwesomeIcon
                                            icon={sortOrder ? (sortOrder === 'asc' ? faSortUp : faSortDown) : faSort}
                                            style={{ color: 'black' }}  /></th>
                                            <th>Comments</th>
                                            <th>Edit </th>
                                            <th>Delete</th>
                                           
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

                                    {!isLoading && !isError.status && (!groupData || groupData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {groupData && groupData.map((item) => (
                                        <tr key={item.id}>
                                       
                                            <td>{item.name}</td>
                                            <td>{item.comments}</td>
                                           
                                            <td ><i className="fas fa-edit" onClick={ currentUser !== 'Read-only' ? ()=> handleEditSectionDt(item) : undefined}></i></td>
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
                                                color: isReadOnly ? "black" : "",
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
                        <GroupSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        group={editGroup} 
                         refreshGroupData={()=>
                            getGroupData('rest/groups?limit=10&offset=0&sort=asc')
                        }
                        />
                    </article> 
                    </article>

                        {showDeletePopup && itemToDelete && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this group?</h1>
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
                                            await handleDeleteGroup(itemToDelete);
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
                                    <p className="confirmtextsucess">The group has been deleted successfully.</p>
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

export default GroupContainer;