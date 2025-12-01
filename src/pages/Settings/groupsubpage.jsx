import React,{useState} from "react";
import '../ornms.css'
import './../Settings/settings.css';


const GroupSubCont=({handleSubContainer})=>{
        const allUsers = ["Admin", "RTC"];

  const [selectedUsers, setSelectedUsers] = useState([]);

  const [selectedFromUsers, setSelectedFromUsers] = useState("");
  const [selectedFromSelected, setSelectedFromSelected] = useState("");

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
                                    <button onClick={addUser} className="createbtn">Add </button>
                                    <br />
                                    <button onClick={removeUser} className="createbtn"> Remove</button>
                                </article>

                                <article className="col-4">
                                    <h1 className="settinglabelsub">Selected</h1>
                                    <select
                                    size="6"
                                    className="groupselect"
                                    style={{ width: "100%" }}
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