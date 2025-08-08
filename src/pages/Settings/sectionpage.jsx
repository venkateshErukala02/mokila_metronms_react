import React,{useState,useEffect} from "react";
import '../ornms.css'
import SectionSubCont from "./sectionsubpage"; 
import './../Settings/settings.css';

const SectionContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [sectionData, setSectionData] = useState([]);
        const [cityLimitValueSel, setCityLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editSection,setEditSection] = useState(null); 
        const [mode, setMode] = useState(null); 
        
        const getSectionData = async (url) => {
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
                    setSectionData(data.region);
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
        const url='api/v2/locations?_s=&limit=10&offset=0&order=asc&orderBy=name'
            // const url = `api/v2/cities?_s=&limit=${cityLimitValueSel}&offset=0&order=asc&orderBy=name`
            getSectionData(url);
    
        }, [cityLimitValueSel]);

        const handleCityLimitValue = (event) => {
            setCityLimitValueSel(event.target.value);
    
        }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setEditSection(null);  
        setMode('create');
    }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }

    const handleEditSectionDt=(item)=>{
        setEditSection(item);
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
                                                <select className="form-controlfirm" value={cityLimitValueSel} onChange={handleCityLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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
                                            <th>Section</th>
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

                                    {!isLoading && !isError.status && (!sectionData || sectionData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {sectionData && sectionData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.parent}</td>
                                            <td ><i className="fas fa-edit" onClick={()=> handleEditSectionDt(item)}></i></td>
                                            <td><i className="fa fa-trash"></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        <SectionSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        section={editSection} 
                        refreshSectionData={()=>
                            getSectionData('api/v2/locations?_s=&limit=10&offset=0&order=asc&orderBy=name')
                        }
                        />
                    </article> 
                    </article>
        </>
    )
}

export default SectionContainer;