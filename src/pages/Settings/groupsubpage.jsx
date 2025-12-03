import {useState,useEffect} from "react";
import '../ornms.css'
import './../Settings/settings.css';


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


    const handleProfileContclose=()=>{
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
            setSelectedUsers(
                selectedUsers.filter((u) => u !== selectedFromSelected)
            );
            }
        };


         const handleAddGroup = async () => {
        // if (!group) {
        //     alert("Please select a file first.");
        //     return;
        // }
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
                handleProfileContclose();
                if(refreshGroupData) refreshGroupData();
                setGroupName('');
                setComment('');
                setSelectedUsers([]);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
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
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp" value={groupName}  onChange={(e)=> setGroupName(e.target.value)}/>
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
                                    {allUsers.map((u) => (
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
                                    value={selectedFromSelected}
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
                                <ul className="clearfix notelist">
                                    <li>
                                        Only Alphanumeric characters, hyphen and underscore are allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                        <button className="cancelbtn" onClick={handleProfileContclose}>Cancle</button>
                                        <button type="button" className="creatsetingbtn" onClick={handleAddGroup}>{isEditMode ? 'Update':'Create'}</button>
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