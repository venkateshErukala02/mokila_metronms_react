import React,{useState,useEffect} from "react";
import '../ornms.css'
import LocationSubCont from "./stationsubpage";
import GroupSubCont from "./groupsubpage";
import './../Settings/settings.css';
import { useSelector } from "react-redux";

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
            const url=`rest/groups?limit=${groupLimitValueSel}&offset=0&sort=asc`
            getGroupData(url);
    
        }, [groupLimitValueSel]);

        const handleGroupLimitValue = (event) => {
            setGroupLimitValueSel(event.target.value);
    
        }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }


      const handleDeleteGroup = async (item) => {
        const method = 'DELETE';
        const confirmDel = window.confirm("Are you sure you want to delete this group?");
    if (!confirmDel) return;
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
                const url=`rest/groups?limit=${groupLimitValueSel}&offset=0&sort=asc`;
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
 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <button type="button" className="arrowlf">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button type="button" className="numcl"><span>1</span></button>
                                    <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
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

                            <article className="row border-allsd">
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                            <th>Group Name</th>
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
                                             onClick={ currentUser !== 'Read-only' ?()=> handleDeleteGroup(item) : undefined}

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
        </>
    )
}

export default GroupContainer;