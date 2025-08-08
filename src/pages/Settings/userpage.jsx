import React,{useState,useEffect} from "react";
import '../ornms.css'
import UserSubCont from "./usersubpage";
import './../Settings/settings.css';

const UserContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [userData, setUserData] = useState([]);
        const [userLimitValueSel, setUserLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [mode, setMode] = useState(null); 
        const [editUser, setEditUser] = useState(null);

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
                    setUserData(data.users);
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

            // const url = `rest/users/list?limit=${userLimitValueSel}&offset=0&sort=asc`
            const url='rest/users/list?limit=10&offset=0&sort=asc'
            getUserData(url);
    
        }, [userLimitValueSel]);

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




 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <button className="clearfix arrowlf">
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button className="clearfix numcl"><span>1</span></button>
                                    <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            <li>
                                                <button className="clearfix createbtn" onClick={handleProfileContopen}>Create</button>

                                            </li>

                                            <li>
                                                <select className="form-controlfirm" value={userLimitValueSel} onChange={handleUserLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="0" label="50">50</option>
                                                    <option value="1" label="25" defaultValue={25}>25</option>
                                                    <option value="2" label="50">50</option>
                                                    <option value="3" label="100">100</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '50vh' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                        <th>Username  </th>
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
                                             <td>{item["user-id"]}</td>
                                            <td>{item["full-name"]}</td>
                                            <td>{item.email}</td>
                                            <td>{item.role}</td>
                                            <td>{item["region-name"]}</td>
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
                        <UserSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        user={editUser} 
                        refreshUserData={()=> getUserData('rest/users/list?limit=10&offset=0&sort=asc')}
                        />
                    </article> 
                    </article>
        </>
    )
}

export default UserContainer;