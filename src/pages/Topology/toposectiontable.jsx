import {useState,useEffect} from "react";


const TopoSectionTable=({textName})=>{
    const [sectionTbData,setSectionTbData] = useState([]);
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [lineipText, setLineipText] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [searchBtn, setSearchBtn] = useState(false);
    const [pageSize, setPageSize] = useState(1);
    const [fromValue,setFromValue] =useState('0');
    const [sectionLimitValueSel,setSectionLimitValueSel] = useState('50');


    const fetchSectionTbData = async (url, isInitial = false) => {
          if (isInitial) {
            setIsLoading(true);
            }
        setIsError({ status: false, msg: "" });
        try {
            const options = {
                method: "GET",
                headers: {
                }

            };
            const response = await fetch(url, options);
             if (response.status === 204) {
                setIsLoading(false);
                setSectionTbData([]);
                setIsError({ status: false, msg: '' });
                return;
            }
            const data = await response.json();
            if (response.ok) {
                setIsLoading(false);
                setSectionTbData(data.nodes || []);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsError({ status: true, msg: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
          if (!textName || !textName.data || !textName.data.mode) {
        return; 
    }
    if(searchBtn) return;

        let url ='';
        switch (textName.data.mode) {
            case 'location':
              url= `api/v2/dashboard/filternodes?ar=line&facilities=${textName.data.display}&state=up&offset=${fromValue}&limit=${sectionLimitValueSel}&status=active&sort=productcode&by=desc`;
                break;
            case 'facility':
                 url= `api/v2/dashboard/filternodes?ar=${textName.data.parent}&facilities=${textName.data.display}&state=up&offset=${fromValue}&limit=${sectionLimitValueSel}&status=active&sort=productcode&by=desc`;
               
                break;        
            default:
                return;
        }
        if(url){
            fetchSectionTbData(url , true);
            const intervalId = setInterval(()=>{
                fetchSectionTbData(url,false);
            },30000);

            return()=> clearInterval(intervalId);
        }

         
    },[textName,fromValue,sectionLimitValueSel,searchBtn]);

    const handleClearSerch = () => {
        setSearchBtn(false);
        setLineipText('');
        // setRdData([])
    }

      const handleIncreamentOffset = () => {
        if(searchBtn) return;
         setPageSize(prev => {
        if (!sectionTbData || sectionTbData.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(sectionLimitValueSel));
        return newPage;
        });
    }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(sectionLimitValueSel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }

     const handleSectionLimitValue = (event) => {
         const value = event.target.value;  
        setSectionLimitValueSel(value);
    }

      const handleRadialIP = async (url) => {
        if (!lineipText.trim()) {
            alert("Please enter a search term");
            return;
        }

        setSearchBtn(true);
        // setIsLoading(true);
        setIsError({ status: false, msg: "" });

        try {
            const response = await fetch(url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                // setIsLoading(false);
                setSectionTbData([]);
                return;
            }

            const data = await response.json(); // Only parse once

            if (response.ok) {
                // setIsLoading(false);
                setSectionTbData(data.nodes || []);

                setIsError({ status: false, msg: '' });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            // setIsLoading(false);
            setIsError({ status: true, msg: error.message || "Something went wrong" });
        }
    };

    useEffect(()=>{
          if (!lineipText.trim()) return;
          const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${lineipText},sysName==${lineipText},label==${lineipText}&limit=${sectionLimitValueSel}&offset=0&order=asc`;
        handleRadialIP(url);

    },[sectionLimitValueSel])



    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>{pageSize}</span></button>
                        <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <ul className="searchdashlist">
                            <li style={{marginRight:"0px"}}>
                                <input name="" value={lineipText} onChange={(e) => setLineipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-control1 searchbar1" />
                                <button type="button" className="createbtn" onClick={() => {
                                   const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${lineipText},sysName==${lineipText},label==${lineipText}&limit=${sectionLimitValueSel}&offset=0&order=asc`;
                                    handleRadialIP(url);
                                }}

                                    style={{ marginLeft: '7px' }}>Search</button>
                                <button type="button" className="createbtn" onClick={handleClearSerch} style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }}> Clear Search</button>

                            </li>
                            <li>
                                <select className="form-controll1" value={sectionLimitValueSel} onChange={handleSectionLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                                <option value="500">500</option>
                            </select>
                            </li>
                            {/* <li>
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"></span></label>
                            </li> */}
                        </ul>

                    </article>
                </article>  
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{overflowY:'auto',height:'40vh'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th>System Name</th>
                                <th>Primary IP</th>
                                <th>Up Time</th>
                                <th>Device Type</th>
                                <th>Position</th>
                            </tr>
                        </thead>

                        <tbody className="tbbdtwo">
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

                            {!isLoading && !isError.status && sectionTbData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                                sectionTbData.length > 0 &&
                                sectionTbData.map((node, index) => (
                                    <tr key={index}>
                                        <td>{node.sysName}</td>
                                        <td>{node.ipAddress}</td>
                                        <td>{node.firmware}</td>
                                        <td style={{paddingLeft:"28px"}}>{node.status}</td>
                                        <td style={{paddingLeft:"12px"}}>{node.radioMode}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default TopoSectionTable;

