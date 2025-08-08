import React,{useState,useEffect} from "react";
import '../ornms.css'
import LocationSubCont from "./stationsubpage";
import GroupSubCont from "./groupsubpage";
import './../Settings/settings.css';

const GroupContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [groupData, setGroupData] = useState([]);
        const [groupLimitValueSel, setGroupLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" }); 
        
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

    // console.log(text)
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
            const url='rest/groups?limit=10&offset=0&sort=asc'
            getGroupData(url);
    
        }, [groupLimitValueSel]);

        const handleGroupLimitValue = (event) => {
            setGroupLimitValueSel(event.target.value);
    
        }


    const handleProfileContopen = () => {
        setProfileStatusCont(true)
    }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
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
                                                <select className="form-controlfirm" value={groupLimitValueSel} onChange={handleGroupLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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
                                            <th>GroupName</th>
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
                                           
                                            <td ><i className="fas fa-edit"></i></td>
                                            <td><i className="fa fa-trash"></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        <GroupSubCont handleSubContainer={handleSubContainer}/>
                    </article> 
                    </article>
        </>
    )
}

export default GroupContainer;