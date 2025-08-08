import React,{useState,useEffect} from "react";
import '../ornms.css'
import FacilitySubCont from "./facilitysubpage";
import './../Settings/settings.css';



const FacilityContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(false);
        const [facilityData, setFacilityData] = useState([]);
        const [facilityLimitValueSel, setFacilityLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        
        const getFacilityData = async (url) => {
            setIsLoading(true); 
            setIsError({ status: false, msg: "" });
            try {
                const options = {
                    method: "GET",
    
                };
                const response = await fetch(url, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsLoading(false);
                    setFacilityData(data.facility);
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
            const url = `api/v2/facilities?_s=&limit=${facilityLimitValueSel}&offset=0&order=asc&orderBy=name`
            getFacilityData(url);
    
        }, [facilityLimitValueSel]);

        const handleFacilityLimitValue = (event) => {
            setFacilityLimitValueSel(event.target.value);
    
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
                                    <input type="text" style={{ marginRight: '10px' }} name="" placeholder="Search Region" id="" className="form-controlstting" />
                                    <button className="clearfix createbtn">Search</button>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            <li>
                                                <button className="clearfix createbtn">Export</button>

                                            </li>
                                            <li>
                                                <button className="clearfix createbtn" onClick={handleProfileContopen}>Create</button>

                                            </li>

                                            <li>
                                                <select className="form-controlfirm" value={facilityLimitValueSel} onChange={handleFacilityLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
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
                                        <th>Facility </th>
                                            <th>Location </th>
                                            <th>City </th>
                                            <th>Region</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
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

                                    {!isLoading && !isError.status && (!facilityData || facilityData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {facilityData && facilityData.map((item) => (
                                        <tr key={item.id}>
                                             <td>{item.name}</td>
                                            <td>{item.locationName}</td>
                                            <td>{item.cityName}</td>
                                            <td>{item.regionName}</td>
                                            <td>{item.latitude}</td>
                                            <td>{item.longitude}</td>
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
                        <FacilitySubCont handleSubContainer={handleSubContainer}/>
                    </article> 
                    </article>
        </>
    )
}

export default FacilityContainer;