import {useState,useEffect} from "react";
import '../ornms.css'
import './../Settings/settings.css';
import { useSelector } from "react-redux";


const GroupSubCont=({handleSubContainer,refreshGroupData,mode,group})=>{
    const isEditMode = mode === 'edit';
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedFromUsers, setSelectedFromUsers] = useState("");
    const [selectedFromSelected, setSelectedFromSelected] = useState("");
    const [groupName,setGroupName] = useState('');
    const [comment,setComment] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const allUsers = ["admin", "rtc"];
    const currentUser = useSelector((state) => state?.loginuser?.node?.role);
    const [showAddedSuccessPopup, setShowAddedSuccessPopup] = useState(false);
    const [showSuccessMessage,setShowScuccessMessage] = useState('');
    const [groupSubData,setGroupSubData] = useState([]);


    const handleProfileContclose=(e)=>{
          e.preventDefault(); 
        handleSubContainer()
    }

        const addUser = () => {
            if (
            selectedFromUsers &&
            !selectedUsers.includes(selectedFromUsers)
            ) {
            setSelectedUsers([...selectedUsers, selectedFromUsers]);
            }
        };

        const removeUser = () => {
           if (selectedFromSelected) {
                 const updatedUsers = selectedUsers.filter(
                (u) => u !== selectedFromSelected
            );

            setSelectedUsers(updatedUsers);
            setSelectedFromSelected(""); 
            }
        };


         const handleAddGroup = async (e) => {
              e.preventDefault(); 
            if(!groupName?.trim()  || !selectedUsers) return;

        const requestBody = isEditMode ? {
           comments: comment,
            name : groupName,
            user: selectedUsers
        }:{
            comments: comment,
            name : groupName,
            user: selectedUsers
        };

        const method = isEditMode ? 'POST' :'POST';
        const url= isEditMode ? `rest/groups` :'rest/groups';

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                // alert('Discovery started successfully')
                // handleProfileContclose();
                  setShowScuccessMessage(
                    isEditMode ? 'The group has been updated successfully.':
                    'The group has been created successfully.'
                )
                  setShowAddedSuccessPopup(true);
                if(refreshGroupData) refreshGroupData();
                setGroupName('');
                setComment('');
                setSelectedUsers([]);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }


     
    useEffect(()=>{
        if(isEditMode && group){
            const grpUsers = typeof group.user === "string" ? [group.user] : group.user;
            setGroupName(group.name || '');
            setComment(group.comments || '');
            setSelectedUsers(grpUsers || []); 

        }else{
            setGroupName('');
            setComment('');
            setSelectedUsers([])
        }
    },[group,mode])


      const getGroupSubData = async (url) => {
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
                        setGroupSubData(data.users);
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
            const fetchGroupSubData=async()=>{
            const url=`api/v2/eventnotice/ugrlist?_s=&limit=10&offset=0&order=asc&orderBy=name`
                await getGroupSubData(url);
            }
    
            fetchGroupSubData();
    
            const intervalId = setInterval(fetchGroupSubData,30000);
    
            return ()=> clearInterval(intervalId);
        
            }, []);

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
                        <article className="border-allsd" style={{margin:'0 0 0 5px'}}>
                            <article >
                                <form action="" style={{margin: '7px 10px 0 10px'}}>
                                <label className="settinglabelsub">Group Name</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" value={groupName}  onChange={(e)=> setGroupName(e.target.value)} disabled={isEditMode}/>
                                <article>
                                <label className="settinglabelsub">Comments</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" value={comment} onChange={(e)=> setComment(e.target.value)}/>
                                </article>

                               <article className="row" style={{ marginTop: "14px" }}>
      
                                <article className="col-4">
                                    <h1 className="settinglabelsub">Users</h1>
                                    <select
                                    size="6"
                                    className="groupselect"
                                    style={{ width: "100%" }}
                                    onChange={(e) => setSelectedFromUsers(e.target.value)}
                                    >
                                    {groupSubData.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                    </select>
                                </article>

                                <article className="col-4 groupaddart">
                                    <button type="button" onClick={addUser} className="createbtn">Add </button>
                                    <br />
                                    <button type="button" onClick={removeUser} className="createbtn"> Remove</button>
                                </article>

                                <article className="col-4">
                                    <h1 className="settinglabelsub">Selected</h1>
                                    <select
                                    size="6"
                                    className="groupselect"
                                    style={{ width: "100%" }}
                                    // value={selectedFromSelected}/
                                    onChange={(e) => setSelectedFromSelected(e.target.value)}
                                    >
                                    {selectedUsers.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                    </select>
                                </article>
                                </article>
                                <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="notelist">
                                    <li>
                                        Only Alphanumeric characters, hyphen and underscore are allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button className="cancelbtn" onClick={handleProfileContclose}>Cancel</button>
                                        <button type="button" onClick={handleAddGroup}
                                        disabled={currentUser === "Read-only"}
                                        className={`creatsetingbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`} title={currentUser === "Read-only" ? "Permission required" : ""}
                                        >{isEditMode ? 'Update':'Create'}</button>
                                </center>
                               
                                </article>
                                </form>

                            </article>

                        </article>
        </article>
               {showAddedSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">{showSuccessMessage}</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() =>{ setShowAddedSuccessPopup(false);
                                            handleProfileContclose();
                                        }}
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

export default GroupSubCont;