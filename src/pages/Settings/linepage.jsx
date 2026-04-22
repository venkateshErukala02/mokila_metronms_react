import React,{useState,useEffect,useRef} from "react";
import '../ornms.css'
import LineSubCont from "./linesubpage";
import './../Settings/settings.css'; 
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from "react-redux";

const LineContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(true);
        const [lineData, setLineData] = useState([]);
        const [regionLimitValueSel, setRegionLimitValueSel] = useState('10');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editLine,setEditLine] = useState(null);
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

        const getLineData = async (url) => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
              setLineData([]);

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
                    setLineData([]);
                    setIsError({ status: false, msg: '' });
                    return;
                }
    
                    const data = await response.json();
                if (response.ok && response.status === 200 ) {
                    const regionData = Array.isArray(data?.region) ? data.region : [];
                    setIsLoading(false);
                    setLineData(regionData);
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
            const url= `api/v2/regions?_s=&limit=${regionLimitValueSel}&offset=${fromValue}&order=${sortOrder}&orderBy=${sortField}`
            // const url = `api/v2/regions?_s=&limit=${regionLimitValueSel}&offset=0&order=asc&orderBy=name`
           await getLineData(url);
         
        }
        fetchLinesData();

        const intervalId = setInterval(fetchLinesData,30000);

        return ()=> clearInterval(intervalId);
    
        }, [regionLimitValueSel,sortOrder,fromValue]);


      
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


        const handleDeleteLine = async (item) => {
        const method = 'DELETE';
        // const url= isEditMode  ? `rest/users/${user["user-id"]}` :'rest/users';
    //     const confirmDel = window.confirm("Are you sure you want to delete this line?");
    // if (!confirmDel) return;
        // const requestBody ={
        // //    firmware: "16_314_Sample.bin"
        //    firmware: `${item.version}_${item.fileName}`
        // }

        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/regions/${item.id}`, {
                method,
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br, zstd'
                },
                // body: JSON.stringify(requestBody),
            });

            const text = await response.text();

            if (response.ok) {
                // alert("Are you sure you want to delete this firmware?")
                setShowDeleteSuccessPopup(true);
                 let url =`api/v2/regions?_s=&limit=${regionLimitValueSel}&offset=${fromValue}&order=${sortOrder}&orderBy=${sortField}`
            getLineData(url);
            } else {
                setIsError('Error starting discovery');
            }
        } catch (error) {
            setIsError('An error occurred while contacting the server.');
        } finally {
            setIsLoading(false); // Turn off loading state
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
        if (!lineData || lineData.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(regionLimitValueSel));
        return newPage;
        });
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(regionLimitValueSel);
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
                                    <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
                                </article>
                                <article className="col-4">
                                    <article style={{ float: 'right' }}>
                                        <ul className="setttinglist">
                                            
                                            <li>
                                                <button type="button" className="createbtn" onClick={handleProfileContopen}>Create</button>

                                            </li>

                                            <li>
                                                <select className="form-controlfirm" value={regionLimitValueSel} onChange={handleRegionLimitValue} style={{ width: '50px', marginTop: '4px' }} aria-invalid="false">
                                                    <option value="10" label="10" defaultValue={10}>10</option>
                                                    <option value="25" label="25">25</option>
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
                                            <th onClick={() => handleSort('name')}>Line <FontAwesomeIcon 
                                                icon={sortField === 'name' ? (sortOrder === 'asc' ?  faSortUp :  faSortDown) : faSort} 
                                                style={{ color: sortField === 'name' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
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

                                    {!isLoading && !isError.status && lineData.length === 0  && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {lineData && lineData.map((item) => (
                                        <tr key={item.id}>
                                            <td>{item.name}</td>
                                            <td><i className="fas fa-edit" onClick={currentUser !== 'Read-only' ? () => handleEditLineDt(item) : undefined}></i></td>
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

                     {showDeletePopup && itemToDelete && <>
                            <article className="confirmdeletepopup">
                                <article className="confirmdeletepopupboxstyle">
                                <h1 className="confirmdeletetitle">Are you sure you want to delete this line?</h1>
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
                                            await handleDeleteLine(itemToDelete);
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
                                    <p className="confirmtextsucess">The line has been deleted successfully.</p>
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

export default LineContainer;