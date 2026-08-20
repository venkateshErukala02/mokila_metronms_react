import {useState,useEffect, useRef} from "react";
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../ornms.css'
import { handleNodeData, handlePreviousNodeselTree } from "../Action/action";


const TopoSectionTable=({textName,textId,stationView, stationTagview,lineTagview,trainView, selectedTreeNodeId,expandedTreeDt})=>{


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
            "productCode",
            "sysUptime",
            // "region",
            "location",
            "radioMode",
            ];

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
    const isTextIdFlow = useRef(false);
    const prevTextIdRef = useRef(null);
    const prevTextNameRef = useRef(null);
    const prevModeRef = useRef(null);
    const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
    const [sortField, setSortField] = useState('sysUptime');
    const [sortOrder, setSortOrder] = useState('desc');
    const [apiUrl, setApiUrl] = useState("");
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
       useEffect(()=>{
        if (!textId) return;
        if(textName?.data?.type !== "location") return;

        const cleanedId = textId.replace(/_txt$/, '');

     const urlTextId = `api/v2//dashboard/filternodes?ar=${textName?.data?.display}&facilities=${cleanedId}&offset=${pageSize}&limit=${sectionLimitValueSel}&status=up&sort=${sortField}&by=${sortOrder}`;
        setApiUrl(urlTextId);

        const firstLoad = prevTextIdRef.current !== textId;

         prevTextIdRef.current = textId;

            setIsInitialLoad(firstLoad);

    },[textId,pageSize,sectionLimitValueSel,textName,sortField,sortOrder]);


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
    if (textId) return;

    if (!textName || !textName.data || !textName.data.mode) {
        return; 
     }
    if(searchBtn) return;

        let url ='';
        switch (textName.data.mode) {
            case 'location':
              url= `api/v2/dashboard/filternodes?ar=line&facilities=${textName.data.display}&offset=${pageSize}&limit=${sectionLimitValueSel}&status=active&sort=${sortField}&by=${sortOrder}`;
                break;
            // case 'facility':
            //      url= `api/v2/dashboard/filternodes?ar=${textName.data.parent}&facilities=${textName.data.display}&offset=${pageSize}&limit=${sectionLimitValueSel}&status=active&sort=${sortField}&by=${sortOrder}`;
               
                // break;        
            default:
                return;
        }

           setApiUrl(url);

           const firstLoad =
            prevTextNameRef.current !== textName.data.display ||
            prevModeRef.current !== textName.data.mode;

            prevTextNameRef.current = textName.data.display;
            prevModeRef.current = textName.data.mode;

            setIsInitialLoad(firstLoad);

         
    },[textName,pageSize,sectionLimitValueSel,searchBtn,,sortField,sortOrder,textId]);


    useEffect(() => {
    if(searchBtn) return;
    if (!apiUrl) return;

    fetchSectionTbData(apiUrl, isInitialLoad);

    const intervalId = setInterval(() => {
        fetchSectionTbData(apiUrl, false);
    }, 30000);

    return () => clearInterval(intervalId);

}, [apiUrl,searchBtn]);

    const handleClearSerch = () => {
        setSearchBtn(false);
        setLineipText('');
        setPageSize(1); 
        setFromValue('0');
        setSectionLimitValueSel('50');
        // setRdData([])
    }

      const handleIncreamentOffset = () => {
        // if(searchBtn) return;
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
            setFromValue('0');
        }
    }

     const handleSectionLimitValue = (event) => {
        setPageSize(1); 
        setFromValue('0');
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
          const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${lineipText},sysName==${lineipText},label==${lineipText}&limit=${sectionLimitValueSel}&offset=${fromValue}&order=asc`;
        handleRadialIP(url);

    },[sectionLimitValueSel,fromValue]);


            const navigate = useNavigate();
            const dispatch = useDispatch();

             const handleRowClick = (node) => {
              const previousState = {
                textName,
                stationView,
                stationTagview,
                lineTagview,
                trainView,
                selectedTreeNodeId,
                expandedTreeDt
              };
            
              dispatch(handlePreviousNodeselTree(previousState));
            
              dispatch(handleNodeData(node));
            
              if (`${node.productCode}` === 'AP') {
                navigate('/SN-view', { state: { previousState } });
              } 
            //   else if(`${node.productCode}` === 'CAM'){
            //         alert('Node-View Not Supported')
            //     } 
                 else {
                navigate(`/${node.productCode}-view`, {
                  state: { node, previousState },
                });
              }
            };

                 const columnPadding = {
                    status: "10px",
                    productCode: "19px",
                    radioMode: "16px"
                    };


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


                 const handleSort = (field) => {
                    const mappedField = field === 'productCode' ? 'productcode' : field;
                    if (sortField === mappedField) {
                        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
                    } else {
                        setSortField(mappedField);
                        setSortOrder('asc');
                    }
                };

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
                                    setPageSize(1);
                                    setFromValue('0');
                                   const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${lineipText},sysName==${lineipText},label==${lineipText}&limit=${sectionLimitValueSel}&offset=${fromValue}&order=asc`;
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
                <article style={{overflowY:'auto',height:'83vh'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>

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
                                {ALL_COLUMNS.filter(col => visibleColumns.includes(col.key)).map(col => (
                                    <td key={col.key} style={
                                                columnPadding[col.key]
                                                ? { paddingLeft: columnPadding[col.key] }
                                                : {}
                                            }>
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
                                    ) : col.key === "status" ? (
                                        <span style={{fontWeight:'bold'}}
                                        >
                                        {node[col.key]}
                                        </span>
                                         ) :(
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


export default TopoSectionTable;

