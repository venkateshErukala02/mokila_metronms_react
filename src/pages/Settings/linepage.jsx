import React,{useState,useEffect,useRef} from "react";
import '../ornms.css'
import LineSubCont from "./linesubpage";
import './../Settings/settings.css'; 

const LineContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [lineData, setLineData] = useState([]);
        const [regionLimitValueSel, setRegionLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editLine,setEditLine] = useState(null);
        const [mode, setMode] = useState(null); 
        
        const getLineData = async (url) => {
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
                    setLineData(data.region);
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
        const fetchLinesData = async()=>{
            const url= 'api/v2/regions?_s=&limit=10&offset=0&order=asc&orderBy=name'
            // const url = `api/v2/regions?_s=&limit=${regionLimitValueSel}&offset=0&order=asc&orderBy=name`
           await getLineData(url);
         
        }
        fetchLinesData();
    
        }, [regionLimitValueSel]);


      
        const handleRegionLimitValue = (event) => {
            setRegionLimitValueSel(event.target.value);
    
        }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setMode('create');
        setEditLine(null);
    }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }

    const handleEditLineDt=(item)=>{
        setEditLine(item);
        setMode('edit')
        setProfileStatusCont(true)
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
                                                <select className="form-controlfirm" value={regionLimitValueSel} onChange={handleRegionLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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

                                    {!isLoading && !isError.status && (!lineData || lineData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {lineData && lineData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td><i className="fas fa-edit" onClick={()=> handleEditLineDt(item)}></i></td>
                                            <td><i className="fa fa-trash"></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ?  'col-4' :  'collapsed' } >
                        <LineSubCont 
                        handleSubContainer={handleSubContainer}
                        mode={mode}  
                        line={editLine} 
                        refreshLineData={()=>getLineData('api/v2/regions?_s=&limit=10&offset=0&order=asc&orderBy=name')
                                    }
                        />
                    </article> 
                    </article>
        </>
    )
}

export default LineContainer;