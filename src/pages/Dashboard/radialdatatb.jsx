import { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../ornms.css'
import '../Dashboard/dashboard.css';
import { handleNodeData } from "../Action/action";
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const RadialDataTb = ({ radialData, dname, circleId, lineInfo }) => {

      const ALL_COLUMNS = [
        { key: "sysName", label: "System Name", sortable: true },
        { key: "ipAddress", label: "Primary IP", sortable: true },
        { key: "macaddress", label: "MAC Address", sortable: true },
        { key: "serialNum", label: "Serial Number", sortable: true },
        { key: "status", label: "Status", sortable: true },
        { key: "sysUptime", label: "Up Time", sortable: true },
        { key: "productCode", label: "Device Type", sortable: true },
        { key: "region", label: "Line", sortable: true },
        { key: "location", label: "Station", sortable: true },
        { key: "radioMode", label: "Position", sortable: true }
        ];
        const DEFAULT_COLUMNS = [
            "sysName",
            "ipAddress",
            "status",  
            "sysUptime",
            "region",
            "location",
            "radioMode",
            ];

    const [rdData, setRdData] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');
    const [sortField, setSortField] = useState('sysUptime');
    const [sortOrder, setSortOrder] = useState('desc');
    const [dropDownShow,setDropDownShow] = useState(false);
    const dropdownRef =  useRef(null);
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
    const firstLoadRef = useRef(true);

    useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
                setDropDownShow(false);
            }
        }

                document.addEventListener("click",handleClickOutside);

            return ()=>{
                document.removeEventListener("click",handleClickOutside);
            }
        
    },[dropDownShow]);

    const fetchDataRadial = async (url) => {
        if (firstLoadRef.current) {
            setIsLoading(true);
            }
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${token}`
                }

            };
            const response = await fetch(url, options);
            const data = await response.json();
            if (response.ok) {
                setRdData(data.nodes || []);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }finally {
            if (firstLoadRef.current) {
            setIsLoading(false);
            firstLoadRef.current = false;
        }
  }
    };

    let apiStatus = '';

    if(dname === undefined){
       apiStatus =  radialData
    }else{
        apiStatus = radialData + dname;
    }

    useEffect(() => {
        if (searchBtn) return; 
        const fetchData = () => {
        let url = '';

        switch (apiStatus) {

            case 'apdown':
            case 'transcoderdown':
            case 'camdown':
            case 'obcdown':
            case 'stadown':
            case 'encoderdown':
            case 'iocdown':
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=${sortField}&by=${sortOrder}&ar=glob`
                fetchDataRadial(url);
                break;
            case 'apup':
            case 'transcoderup':
            case 'camup':
            case 'obcup':
            case 'staup':
            case 'encoderup':
            case 'iocup':
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=${sortField}&by=${sortOrder}&ar=glob`
                fetchDataRadial(url);
                break;
            case 'fullradialdown':
            case 'fullradialgood':
                url = `api/v2//dashboard/filternodesg?filter=ns&value=${dname}&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=${sortField}&by=${sortOrder}&ar=glob`;
                fetchDataRadial(url);
                break;

            case 'fullradialall':
                //   url ='api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=1&limit=25&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob';
                url = `api/v2//dashboard/filternodesg?filter=ns&value=all&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=${sortField}&by=${sortOrder}&ar=glob`;
                fetchDataRadial(url);
                break;



            case 'sta':
            case 'ap':
            case 'encoder':
            case 'transcoder':
            case 'cam':
            case 'obc':
            case 'ioc':
            case 'backhaul':
            case 'ptmp':
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=down&rd=${radialData}&sort=sysUptime&by=desc&ar=glob`
                fetchDataRadial(url);
                break;



            case 'Down':
                // url = `api/v2/dashboard/filternodes?filter=radioMode&value=ap&offset=1&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
                url = 'api/v2//dashboard/filternodesg?filter=ns&value=down&offset=1&limit=25&status=all&rd=encoder&sort=sysUptime&by=desc&ar=glob'
                fetchDataRadial(url);
                break;
            case 'line1-sec1':
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line1-sec1&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortField}&by=${sortOrder}`;
                fetchDataRadial(url);
                break;
            case 'line1-sec2':
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line1-sec2&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortField}&by=${sortOrder}`
                fetchDataRadial(url);
                break;
            case 'line4-sec1':
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line4-sec1&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortField}&by=${sortOrder}`;
                fetchDataRadial(url);
                break;

            case 'nodeId':
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=${sortField}&by=${sortOrder}&ar=glob`
                // url = `api/v2/dashboard/filternodes?filter=ns&value=all&offset=1&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
                fetchDataRadial(url);
                break;
            case 'apall':
            case 'transcoderall':
            case 'camall':
            case 'obcall':
            case 'staall':
            case 'encoderall':
            case 'iocall':
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=${sortField}&by=${sortOrder}&ar=glob`;
                fetchDataRadial(url);
                break;

            default:
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=${sortField}&by=${sortOrder}&ar=glob`;
                fetchDataRadial(url);
                break;
        } 
    }
        fetchData();

        const intervalId = setInterval(fetchData,30000);

        return ()=> clearInterval(intervalId);

    }, [radialData, dname, limitValueSelLabel, pageSize, apiStatus,sortOrder,searchBtn]);



    useEffect(() => {
        if (searchBtn) return; 
        let url = '';
        switch (lineInfo) {
            case 'line1-sec1':
                url = `api/v2//dashboard/filternodes?ar=line1-sec1&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortOrder}&by=${sortOrder}`
                fetchDataRadial(url);
                break;
            case 'line1-sec2':
                url = `api/v2//dashboard/filternodes?ar=line1-sec2&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortOrder}&by=${sortOrder}`
                fetchDataRadial(url);
                break;
            case 'line4-sec1':
                url = `api/v2//dashboard/filternodes?ar=line4-sec1&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=${sortOrder}&by=${sortOrder}`
                fetchDataRadial(url);
                break;
            default:
                break;
        }

    }, [circleId, lineInfo, pageSize, limitValueSelLabel,searchBtn])


    const handleRadialIP = async (url) => {
        if (!radialipText) {
            alert("Please enter a search term");
            return;
        }

        setSearchBtn(true);
        setIsLoading(true);
        setIsError({ status: false, msg: "" });

        try {
            const response = await fetch(url,
                // `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 204) {
                setIsLoading(false);
                setRdData([]);
                return;
            }

            const data = await response.json(); // Only parse once

            if (response.ok) {
                setIsLoading(false);
                setRdData(data.nodes || []);

                setIsError({ status: false, msg: '' });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message || "Something went wrong" });
        }
    };

    useEffect(() => {
        if (!radialipText.trim()) return;
        const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`;
        handleRadialIP(url);


    }, [limitValueSelLabel]);

    const handleClearSearch = () => {
        setSearchBtn(false);
        setRadialipText('');
        setPageSize(1); 
    }


    const handleLimitValue = (event) => {
        setLimitValueSel(event.target.value);
        const label = event.target.options[event.target.selectedIndex].label;
        setLimitValueSelLabel(label)
    }



    const navigate = useNavigate();
    const dispatch = useDispatch();
    // const count = useSelector(state => state.count);

    const handleRowClick = (node) => {
        if (`${node.productCode}` === 'AP') {
            navigate('/SN-view')
            dispatch(handleNodeData(node))
        } else {
            navigate(`${node.productCode}-view`, { state: { node } });
            dispatch(handleNodeData(node))
        }

    };


    const handleIncreamentOffset = () => {
        // setFromValue(parseInt(pageSize)* parseInt(limitValueSelLabel));
        if (rdData?.length === 0 || undefined) {            
            setPageSize(prevstate => prevstate);
        } else if (rdData?.length > 0) {
            setPageSize(prevstate => prevstate + 1);
        }
    }
    useEffect(() => {
        setPageSize(1);
        setLimitValueSelLabel('50')
        setLimitValueSel('1')
    }, [lineInfo, apiStatus])


    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                // setFromValue(parseInt(newPageSize) * parseInt(limitValueSelLabel));
                return newPageSize;
            });
        } else {
            setPageSize(1);
            // setFromValue('0');
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

    const handleAddColumn=()=>{
        setDropDownShow(prev => !prev);
    }


  

            const handleColumnToggle = (key) => {
            setVisibleColumns(prev =>
                prev.includes(key)
                ? prev.filter(col => col !== key)
                : [...prev, key]
            );
            };

            const allSelected = ALL_COLUMNS.every(col =>
                visibleColumns.includes(col.key)
                );

    return (
        <>
            <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button className="clearfix arrowlf" onClick={handleDecrementOffset}>
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>{pageSize}</span></button>
                        <button className="clearfix arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <ul className="searchdashlist">
                            <li>
                                <input name="" value={radialipText} onChange={(e) => setRadialipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-control1 searchbar1" />
                                <button className="clearfix createbtn" onClick={() => {
                                    const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`;
                                    handleRadialIP(url);
                                }}

                                    style={{ marginLeft: '7px' }}>Search</button>
                                <button className="clearfix createbtn" onClick={handleClearSearch} style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }}> Clear Search</button>

                            </li>
                            <li style={{position:'relative'}} ref={dropdownRef} >
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"  onClick={(e) =>{ e.stopPropagation(); handleAddColumn()}}></span></label>

                              {dropDownShow && (
                                    <article className="Addcoldropdownart" onClick={(e) => e.stopPropagation()}>
                                        <ul className="addcollist">
                                            <li>
                                        <label>
                                            <input
                                            type="checkbox"
                                            checked={allSelected}
                                            onChange={(e) =>
                                                setVisibleColumns(
                                                e.target.checked ? ALL_COLUMNS.map(c => c.key) : DEFAULT_COLUMNS
                                                )
                                            }
                                            />
                                            Select All
                                        </label>
                                        </li>
                                        {ALL_COLUMNS.map(col => (
                                            <li key={col.key}>
                                            <label>
                                                <input
                                                type="checkbox"
                                                checked={visibleColumns.includes(col.key)}
                                                onChange={() => handleColumnToggle(col.key)}
                                                />
                                                {col.label}
                                            </label>
                                            </li>
                                        ))}
                                        </ul>
                                    </article>
                                    )}


                                <select className="form-controll1" value={limitValueSel} onChange={handleLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                    <option value="0" label="25" defaultValue={25}>25</option>
                                    <option value="1" label="50">50</option>
                                    <option value="2" label="100">100</option>
                                    <option value="3" label="500">500</option>
                                </select>
                            </li>
                        </ul>

                    </article>
                </article>
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{ height: "43vh", overflowY: 'auto', overflowX: 'clip' }}>
                    <table className="col-12 border-allsd table-fixed" style={{ height: '0vh' }}>

                      <thead className="tbtwo">
                            <tr>
                                {ALL_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => (
                                <th key={col.key} onClick={() => handleSort(col.key)}>
                                    {col.label}
                                    <FontAwesomeIcon
                                    icon={
                                        sortField === col.key
                                        ? sortOrder === "asc"
                                            ? faSortDown
                                            : faSortUp
                                        : faSort
                                    }
                                    style={{
                                        color:
                                        sortField === col.key ? "black" : "#D7D7D7"
                                    }}
                                    />
                                </th>
                                ))}
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

                            {!isLoading && !firstLoadRef.current  && rdData.length === 0 &&  (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                                rdData.length > 0 &&
                                rdData.map((node, index) => (
                                <tr key={index}>
                                {ALL_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => (
                                    <td key={col.key}>
                                    {col.key === "sysName" ? (
                                        <a href={`http://${node.ipAddress}`} target="_blank" rel="noreferrer">
                                        {node[col.key]}
                                        </a>
                                    ) : col.key === "ipAddress" ? (
                                        <span
                                        className="highlightText"
                                        onClick={() => handleRowClick(node)}
                                        >
                                        {node[col.key]}
                                        </span>
                                    ) : (
                                        node[col.key]
                                    )}
                                    </td>
                                ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default RadialDataTb;