import React,{useState,useEffect} from "react";
import '../ornms.css'
import StationSubCont from "./stationsubpage";
import './../Settings/settings.css';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from "react-redux";

const StationContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [stationData, setStationData] = useState([]);
        const [locationLimitValueSel, setLocationLimitValueSel] = useState('10');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editStation,setEditStation] = useState(null);
        const [mode,setMode] =  useState(null);
        const [sortField, setSortField] = useState('name');
        const [sortOrder, setSortOrder] = useState('asc');
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';

        const getStationData = async (url) => {
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
                    setStationData(data.facility);
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
            // const url = `api/v2/locations?_s=&limit=${locationLimitValueSel}&offset=0&order=asc&orderBy=name`
            const url=`api/v2/facilities?_s=&limit=${locationLimitValueSel}&offset=0&order=${sortOrder}&orderBy=${sortField}`
            getStationData(url);
    
        }, [locationLimitValueSel,sortOrder]);

        const handleLocationLimitValue = (event) => {
            setLocationLimitValueSel(event.target.value);
    
        }


    const handleProfileContopen = () => {
        setProfileStatusCont(true);
        setMode('create');
        setEditStation(null);
    }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }
    const handleEditStationDt=(item)=>{
        setEditStation(item);
        setMode('edit');
        setProfileStatusCont(true)
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };
 
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
                                                <select className="form-controlfirm" value={locationLimitValueSel} onChange={handleLocationLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="10" label="10" defaultValue={10} >10</option>
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
                                            <th onClick={() => handleSort('name')}>Station <FontAwesomeIcon
                                            icon={sortField === 'name' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                            style={{ color: sortField === 'name' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }}                                   /></th>
                                            <th onClick={() => handleSort('regionName')}>Line <FontAwesomeIcon
                                            icon={sortField === 'regionName' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                            style={{ color: sortField === 'regionName' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }}                                   /></th>
                                            <th onClick={() => handleSort('locationName')}>Section <FontAwesomeIcon
                                            icon={sortField === 'locationName' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                            style={{ color: sortField === 'locationName' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }}                                   /></th>
                                            <th>Edit</th>
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

                                    {!isLoading && !isError.status && (!stationData || stationData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {stationData && stationData.map((item) => (
                                        
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td>{item.regionName}</td>
                                            <td>{item.locationName}</td>
                                            <td ><i className="fas fa-edit" onClick={currentUser !== "Read-only" ? ()=> handleEditStationDt(item) : undefined}></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        <StationSubCont handleSubContainer={handleSubContainer} 
                        mode={mode}
                        station = {editStation}
                        refreshStationData={()=>
                        getStationData('api/v2/facilities?_s=&limit=10&offset=0&order=asc&orderBy=name')
                        }
                        />
                    </article> 
                    </article>
        </>
    )
}

export default StationContainer;