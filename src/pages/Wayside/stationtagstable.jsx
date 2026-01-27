import  { useState, useEffect } from "react";
import '../ornms.css'
import '../Dashboard/dashboard.css';



const StationTagsTable = ({ circleId, lineId,textName,selectedTab,rdDataRef}) =>{
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // const rdData = rdDataRef.current === null ? [] : [rdDataRef.current[0].tags] ;
    const [tagData,setTagData] = useState([]);
    const displayData = tagData.length > 0 ? tagData : (rdDataRef?.current ? rdDataRef?.current[0]?.tags : []);
    const [tagIdText,setTagIdText] = useState('');
    const [searchTrigger, setSearchTrigger] = useState(0);

      useEffect(() => {
           if (!tagIdText.trim()) return;

            const fetchData = async () => {
                setIsLoading(true);
                await handleSearchData(tagIdText);
            };

            fetchData();
        }, [searchTrigger]);

    const handleDeleteTag=async(value)=>{
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const response = await fetch(`api/v2/wayside/deleteTag?tagId=${value.tagId}&stName=${value.location}`, {
                method: "POST",
                headers: {
                    'Authorization': `Basic ${token}`
                },
            });

            if (response.ok) {
                setSuccess('File delete has started.');
            } else {
                const errText = await response.text();
                setError(`Error starting discovery: ${errText}`);
            }
        } catch (error) {
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false);
        }
    };


      const handleSearchData = async (tagIdText) => {

                try {
                    const response = await fetch(`api/v2/wayside/searchTag?tag=${tagIdText}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                      if (response.status === 204) {
                            setIsLoading(false);
                            setTagData([]);
                            return;
                        }
                    const tgData = await response.json();
                    const data = tgData[0];
                    if (response.ok) {
                        setIsLoading(false);
                        setTagData(Array.isArray(data) ? data : [data]);
                        setError({ status: false, msg: "" });
                    } else {
                        throw new Error("data not found");
                    }

                } catch (error) {
                    setError({ status: true, msg: error.message });
                }finally {
                    setLoading(false);
                }

        }


     const handleSearchClick = (e) => {
        e.preventDefault();
        if (!tagIdText.trim()) {
            alert("Please enter a search term");

        } else {
            setSearchBtn(true);
            setSearchTrigger(prev => prev + 1);
        }
    }


    const handleClearSearch = () => {
        setSearchBtn(false);
        setTagIdText('');
        setTagData([]); 
        // setInvenData([]);
        // fetchDataRadial();
      }


    //     const fetchDataRadial = async (url) => {
    //     setIsLoading(true);
    //     setIsError({ status: false, msg: "" });
    //     try {
    //         const username = 'admin';
    //         const password = 'admin';
    //         const token = btoa(`${username}:${password}`)
    //         const options = {
    //             method: "GET",
    //             headers: {
    //                 'Authorization': `Basic ${token}`
    //             }

    //         };
    //         const response = await fetch(url, options);
    //         const data = await response.json();
    //         if (response.ok) {
    //             setIsLoading(false);
    //             if(Object.keys(data).length === 0){
    //                setTagData([]) 
    //             }
    //             setTagData(Array.isArray(data) ? data : [data]);
    //             // setCircleId('');
    //             // setLineId('');
    //             setIsError({ status: false, msg: "" });
    //         } else {
    //             throw new Error("data not found");
    //         }
    //     } catch (error) {
    //         setIsLoading(false);
    //         setIsError({ status: true, msg: error.message });
    //     }
    // };

//         useEffect(() => {
//     let url = '';
//     if (circleId) {
//         url = `api/v2/wayside/tagdetails?station=${circleId}`;
//     } else if (lineId) {
//         url = `api/v2/wayside/tagdetails?station=${lineId}`;
//     }else if(textName?.data?.mode === 'facility'){
//         url = `api/v2/wayside/tagdetails?station=${textName.data.display}`;
//     }

//     if (url) {
//         fetchDataRadial(url);

//         const intervalId = setInterval(()=>{
//             fetchDataRadial(url);
//         },30000)

//         return()=> clearInterval(intervalId);
//     }
// }, [searchClear]);



    return (
        <>
        <h1 className="discoveryheading">Tags</h1>
        <article style={{border:'1px solid #21232712'}}>
            <article className="">
                 <article className="row border-lrr piechtcont">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button type="button" className="arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>1</span></button>
                        <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <ul className="searchdashlist">
                            <li>
                                <input name="" value={tagIdText} onChange={(e) => setTagIdText(e.target.value)} placeholder="TadId Number" id="" className="form-control1 searchbar1" />
                                <button type="button" className="createbtn" 
                                    style={{ marginLeft: '7px' }} onClick={handleSearchClick}>Search</button>
                                <button type="button" className="createbtn" style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }} onClick={handleClearSearch}> Clear Search</button>

                            </li>
                            {/* <li>
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"></span></label>

                                
                            </li> */}
                        </ul>

                    </article>
                </article>  
                <article className="row">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                    </article>
                </article>
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{ height: "33.5vh", overflowY: 'auto', overflowX: 'clip',position:'relative'}}>
                    <table className="col-12 table-fixed" style={{ height: '0vh' }}>

                        <thead className="statustagthtb">
                            <tr>
                                <th>TagId</th>
                                <th>Direction</th>
                                <th>Position</th>
                                <th style={{width:'132px'}}>(Work <i className="fa-solid fa-arrow-up" style={{color:""}}></i> ,Def <i className="fa-solid fa-arrow-down" style={{color:""}}></i>)</th>
                                <th>Delete</th>                               
                            </tr>
                        </thead>

                        <tbody className="statustagtbbd">
                            {isLoading && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {isError.status && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                                        {isError.msg}
                                    </td>
                                </tr>
                            )}
                            {displayData.length === 0 && (
                                 <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                                 (displayData.length > 0 && Object.keys(displayData[0] || {}).length === 0) ? (
                                    <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                                ) :(
                                    displayData.length !== 0 && displayData.map((value, index) => (
                                     <tr key={index}>
                                        <td style={{padding:"4px 6px"}}>{value[0]?.tag || value?.tag}</td>
                                        <td style={{padding:"4px 6px"}}>{value.direction}</td>
                                        <td style={{padding:"4px 6px"}} className="">{value.position}</td>
                                        <td style={{padding:"4px 48px"}}>{value.status === 'down' ? (<i className="fa-solid fa-arrow-down" style={{color:"red"}}></i> ): (<i className="fa-solid fa-arrow-up" style={{color:"green"}}></i>)}</td>
                                        <td><i className="fa fa-trash" style={{cursor:'pointer'}}  onClick={()=>handleDeleteTag(value)}></i></td>
                                    </tr>
                                ))                                     
                                )}
                        </tbody>
                    </table>
                </article>
            </article>
            </article>
        </>
    )
}


export default StationTagsTable;