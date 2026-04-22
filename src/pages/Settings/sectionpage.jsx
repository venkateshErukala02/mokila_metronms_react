import React,{useState,useEffect} from "react";
import '../ornms.css'
import SectionSubCont from "./sectionsubpage"; 
import './../Settings/settings.css';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from "react-redux";

const SectionContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [sectionData, setSectionData] = useState([]);
        const [cityLimitValueSel, setCityLimitValueSel] = useState('10');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editSection,setEditSection] = useState(null); 
        const [mode, setMode] = useState(null); 
        const [sortField, setSortField] = useState('name');
        const [sortOrder, setSortOrder] = useState('asc');
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';

         const [itemToDelete, setItemToDelete] = useState(null);
        const [showDeletePopup, setShowDeletePopup] = useState(false);
        const [showDeleteSuccessPopup, setShowDeleteSuccessPopup] = useState(false);
        const [pageSize, setPageSize] = useState(1);
        const [fromValue,setFromValue] =useState('0');

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

                 if (response.status === 204) {
                    setIsLoading(false);
                    setSectionData([]);
                    setIsError({ status: false, msg: '' });
                    return;
                }
    
                const data = await response.json();
    
                if (response.ok && response.status === 200) {
                    setIsLoading(false);
                    setSectionData(data?.region || []);
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
        const fetchSectionData=async()=>{
        const url=`api/v2/locations?_s=&limit=${cityLimitValueSel}&offset=${fromValue}&order=${sortOrder}&orderBy=${sortField}`
            // const url = `api/v2/cities?_s=&limit=${cityLimitValueSel}&offset=0&order=asc&orderBy=name`
            await getSectionData(url);
        }

        fetchSectionData();

        const intervalId = setInterval(fetchSectionData,30000);

        return ()=> clearInterval(intervalId);
    
        }, [cityLimitValueSel,sortOrder,fromValue]);

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

     const handleDeleteSection = async (item) => {
        const method = 'DELETE';
    //     const confirmDel = window.confirm("Are you sure you want to delete this section?");
    // if (!confirmDel) return;
        
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/locations/${item.id}`, {
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
                setShowDeleteSuccessPopup(true);
                const url=`api/v2/locations?_s=&limit=${cityLimitValueSel}&offset=${fromValue}&order=${sortOrder}&orderBy=${sortField}`
                getSectionData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); 
        }

    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

     const handleIncreamentOffset = () => {
         setPageSize(prev => {
        if (!sectionData || sectionData.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(cityLimitValueSel));
        return newPage;
        });
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(cityLimitValueSel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }


    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                                        <i className="fa-solid fa-arrow-left"></i>
                                    </button>
                                    <button type="button" className="numcl"><span>{pageSize}</span></button>
                                    <button type="button" className="arrowlf"  onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                                    
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
    
                                            <li>
                                                <button type="button" className="createbtn" onClick={handleProfileContopen}>Create</button>

                                            </li>

                                            <li>
                                                <select className="form-controlfirm" value={cityLimitValueSel} onChange={handleCityLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="10" label="10" defaultValue={10}>10</option>
                                                    <option value="25" label="25" >25</option>
                                                    <option value="50" label="50">50</option>
                                                    <option value="100" label="100">100</option>
                                                </select>
                                            </li>
                                        </ul>
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '80vh',overflowY:'auto',overflowX: 'clip' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb tableheadpostion">
                                        <tr>
                                            <th onClick={() => handleSort('name')}>Section <FontAwesomeIcon
                                            icon={sortField === 'name' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                            style={{ color: sortField === 'name' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                             /></th>
                                            <th onClick={() => handleSort('parent')}>Line <FontAwesomeIcon
                                            icon={sortField === 'parent' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                            style={{ color: sortField === 'parent' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                             /></th>
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
                                            <td ><i className="fas fa-edit" onClick={currentUser !== 'Read-only' ? ()=> handleEditSectionDt(item) :undefined}></i></td>
                                            <td onClick={(e)=>{  e.stopPropagation();}}><i className="fa fa-trash" 
                                             onClick={(e) => {
                                                e.stopPropagation();
                                                if (currentUser !== 'Read-only') {
                                                setItemToDelete(item);
                                                setShowDeletePopup(true);
                                                }
                                            }}

                                             style={{
                                                cursor: isReadOnly ? "not-allowed" : "pointer" ,
                                                color: isReadOnly ? "black" : "#ef0808",
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
                        <SectionSubCont handleSubContainer={handleSubContainer}
                        mode={mode}  
                        section={editSection} 
                        refreshSectionData={()=>
                            getSectionData('api/v2/locations?_s=&limit=10&offset=0&order=asc&orderBy=name')
                        }
                        />
                    </article> 
                    </article>

                     {showDeletePopup && itemToDelete && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this section?</h1>
                                <article className="f-r">
                                     <button
                                        className="confirmdeletebtn"
                                        onClick={() => setShowDeletePopup(false)}
                                        >
                                        NO
                                        </button>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={async () => {
                                            await handleDeleteSection(itemToDelete);
                                            setShowDeletePopup(false);
                                        }}
                                        >
                                        YES
                                        </button>
                                </article>
                                </article>
                            </article>
                            </>}

                             {showDeleteSuccessPopup && (
                                <article className="confirmsuccesspopup">
                                    <article className="confirmsuccesspopupboxstyle">
                                        <article className="success-cont">
                                    <h1 className="confirmtitlesucess">Success</h1>
                                    <p className="confirmtextsucess">The section has been deleted successfully.</p>
                                    </article>
                                    <article style={{ textAlign: 'end' }}>
                                        <button
                                        className="confirmdeletebtn confirmdeletebtnyes"
                                        onClick={() => setShowDeleteSuccessPopup(false)}
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

export default SectionContainer;