import { useState, useEffect, useRef } from "react";
import './../Discovery/discovery.css';
import '../ornms.css'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from "react-redux";


const ProvisionTb = ({ getProviContData }) => {

          const ALL_COLUMNS = [
          { key: 'sysName', label: 'System Name' },
          { key: 'ipAddress', label: 'Primary IP' },
          { key: 'macaddress', label: 'MAC Address' },
          { key: 'serialNum', label: 'Serial Number' },
          { key: 'modelNum', label: 'Model Number' },
          { key: 'firmware', label: 'Firmware' },
          { key: 'status', label: 'Status' },
          { key: 'sysUptime', label: 'Uptime' },
          { key: 'radioMode', label: 'Radio Mode' },
          // { key: 'productCode', label: 'Product Code' },
        ];
        const DEFAULT_COLUMNS = [
            "sysName",
            "ipAddress",
            // "productCode",  
            "sysUptime",
            "radioMode",
            ];

            const ALL_LINES = [
          { key: 'line1-sec1', label: 'Line1-Section1' },
          { key: 'line1-sec2', label: 'Line1-Section2' },
          { key: 'line4-sec1', label: 'Line4' },
            ]

             const PRODUCT_CODES = [
            { key: 'SN', label: 'SN' },
            { key: 'TR', label: 'TR' },
            { key: 'obc', label: 'OBC' },
            { key: 'transcoder', label: 'Transcoder' },
            { key: 'encoder', label: 'Encoder' },
            { key: 'CAM', label: 'CAM' }
          ];

  const [provisionSel, setProvisionSel] = useState('1');
  const [radioSel, setRadioSel] = useState('');
  const [linktypeSel, setLinktypeSel] = useState('');
  const [labelRadio, setLabelRadio] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [firmipText, setFirmipText] = useState('');
  const [firmData, setFirmData] = useState([]);
  const [unassignLabel,setUnassignLabel] = useState('none');
  const [searchBtn, setSearchBtn] = useState(false);
  const [unassignSel,setUnassignSel] = useState('')
  const [limitValueSel,setLimitValueSel] = useState('');
  const [limitValueSelLabel,setLimitValueSelLabel]= useState('100');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [unprovision, setUnprovisionData] = useState({})
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [sortField, setSortField] = useState('sysUptime');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dropDownShow,setDropDownShow] = useState(false);
  const columnWrapperRef =  useRef(null);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
  const firstLoadRef = useRef(true);
  const [lineNameSel,setLineNameSel] = useState('-1');
  const [stationData,setStationData] = useState([]);
  const [stationNameSel,setStationNameSel] = useState({});
  const [positionNameSel,setPositionNameSel] = useState('-1');
  const [success, setSuccess] = useState('');
  const currentUser = useSelector((state) => state?.loginuser?.node?.role);
  const isReadOnly = currentUser === 'Read-only';
  const [pageSize, setPageSize] = useState(1);
  const [fromValue,setFromValue] =useState('0');
  const [selectedProductCodes, setSelectedProductCodes] = useState([]);

  useEffect(() => {
  if (firmData?.region) {
    setLineNameSel(firmData.region);
    stationNameSel(firmData.location); 
    selectedProductCodes(firmData.productCode)
  }
}, [firmData]);


  useEffect(() => {
  if (firmData?.length) {
    setStationNameSel(firmData[0].location);
    setPositionNameSel(firmData[0].radioMode);
    setLineNameSel(firmData[0].region);
    setSelectedProductCodes(firmData[0].productCode);
  }
}, [firmData]);


   useEffect(()=>{
    if(lineNameSel === '-1') return;
          if(lineNameSel && lineNameSel !== ''){
              const url=`api/v2/treeview/regions/${lineNameSel}/stations`;
  
              getSelStationData(url);
          }
         
      },[lineNameSel])

   useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(columnWrapperRef.current && !columnWrapperRef.current.contains(event.target)){
                setDropDownShow(false);
            }
        }
           
                document.addEventListener("click",handleClickOutside);

            return ()=>{
                document.removeEventListener("click",handleClickOutside);
            }
        
    },[dropDownShow]);


     const getSelStationData = async (url) => {
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
                setStationData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

  const handleFirmIP = async () => {


    if (!firmipText) {
      alert("Please enter a search term");

    } else {
      setSearchBtn(true)
      setIsLoading(true); 

      try {
        const response = await fetch(`api/v2/nodes/search?_s=sysName==${firmipText}*,label==${firmipText},assetRecord.serialNumber==${firmipText}&limit=100&offset=0&order=asc`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
          if (response.status === 204) {
          setFirmData([]);
          setIsError({ status: false, msg: "" });
          return;
        }
        const data = await response.json();

        if (response.ok) {
          setFirmData(data.nodes || []);
          setIsError({ status: false, msg: "" });
        } else {
          throw new Error("data not found");
        }

      } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
      }finally {
        setIsLoading(false);       
     }
    }

  }

  const handleClearSerch = () => {
    setSearchBtn(false);
    setFirmipText('');
  }

  const handleProvision = (event) => {
    setProvisionSel(event.target.value);
    // setFirmData('');
    setSearchBtn(false);
  }
 
  const handleRadio = (event) => {
    const value = event.target.value;
    const label = event.target.options[event.target.selectedIndex].label.toLowerCase();
    setRadioSel(value);
    if(label === 'all'){
      setLabelRadio('none')
    }else{
      setLabelRadio(label)

    }
    // setLabelText(label); 
  };
  const handleLink = (event) => {
    const value = event.target.value;
    const label = event.target.options[event.target.selectedIndex].label;
    setLinkLabel(label)
    setLinktypeSel(value);
  }

  const handleUnassign=(event)=>{
    const label = event.target.options[event.target.selectedIndex].label;
    if(label ==='All'){
      setUnassignLabel('all');
    }else if(label==='Unassigned'){
      setUnassignLabel('none');
    }
    setUnassignSel(event.target.value);
  }

  const handleLimitValue=(event)=>{
    setLimitValueSel(event.target.value);
    const label = event.target.options[event.target.selectedIndex].label;
    setLimitValueSelLabel(label)
  }

  const handleCheckboxChange = (key) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(key)
        ? prevSelected.filter((rowKey) => rowKey !== key)
        : [...prevSelected, key]
    );
  };

  const handleSelectAll = () => {
    const allKeys = firmData.map((node) => node.ipAddress);
    if (selectedRows.length === firmData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(allKeys);
    }
  };
  

  const handleApply = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const selectedData = firmData.filter((row) => selectedRows.includes(row.ipAddress));

    getProviContData(selectedData)

  };

  const getDataUnprovisiontbData = async (url) => {
    if (firstLoadRef.current) {
    setIsLoading(true);
    }
    setIsError({ status: false, msg: "" });
    try {

      const options = {
        method: "GET",
      };
      const response = await fetch(url, options);
      if (response.status === 204) {
          setIsLoading(false);
          setFirmData([]);
          setIsError({ status: false, msg: '' });
          return;
        }
      const data = await response.json();
      if (response.ok) {
        setFirmData(data);  
        setIsError({ status: false, msg: "" });
      } else {
        throw new Error("data not found");
      }
    } catch (error) {
      setIsError({ status: true, msg: error.message });
    }finally {
      if (firstLoadRef.current) {
      setIsLoading(false);
      firstLoadRef.current = false;
    }
  }
  };

  useEffect(() => {
    if(searchBtn) return;
    let show = unassignLabel || 'none';
    let limit = limitValueSelLabel || '100';
  
    const url = `api/v2/discovery/showunprovisioned?show=${show}&ofs=${fromValue}&limit=${limit}&sort=${sortField}&by=${sortOrder}`;
  
    getDataUnprovisiontbData(url);

    const intervalId = setInterval(() => {
      getDataUnprovisiontbData(url);
  }, 30000); 

  return () => clearInterval(intervalId);
  }, [unassignLabel, limitValueSelLabel,searchBtn,fromValue,sortOrder,sortField]);
  

   const allSelected = ALL_COLUMNS.every(col =>
                visibleColumns.includes(col.key)
                );
                
    const handleAddColumn=()=>{
        setDropDownShow(prev => !prev);
    }

    const handleSort = (field) => {
        if (sortField === field) {
            setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };
  

            const handleColumnToggle = (key) => {
            setVisibleColumns(prev =>
                prev.includes(key)
                ? prev.filter(col => col !== key)
                : [...prev, key]
            );
            };


            const handleSelectLine=(e)=>{
                setLineNameSel(e.target.value);
            }

            const handleSelectStation=(value)=>{
              setStationNameSel(value);
            }

            const handleSelectPosition=(e)=>{
                setPositionNameSel(e.target.value);
            }

            const handleProductCodeChange = ( e) => {
              setSelectedProductCodes(e.target.value);
            };


            const handleDiscoveryConfig=async(node)=>{
               const requestBody = [{
                nodeId : node.nodeId || [],
                stationId : stationNameSel || [],
                position : positionNameSel || [],
                deviceType : selectedProductCodes || []
               }];
              const url = 'api/v2/discovery/configure';

              setIsError('');

              setIsLoading(true);
              try {
                  const response = await fetch(url,{
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',

                      },
                      body: JSON.stringify(requestBody),
                  });
                  const ddtt = response;

                  if (response.ok) {
                      setSuccess('Added Discovery config successfully');
                      // setProvisionSel(true);
                  } else {
                      setIsError('Error starting discovery');
                  }
              } catch (error) {
                  setIsError('An error occurred while contacting the server.');
              } finally {
                  setIsLoading(false); 
              }
          };

           const handleIncreamentOffset = () => {
              setPageSize(prev => {
              if (!firmData || firmData.length === 0) return prev;

              const newPage = prev + 1;
              setFromValue(parseInt(newPage-1) * parseInt(limitValueSelLabel));
              return newPage;
              });
          }



    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(limitValueSelLabel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }

     const columnPadding = {
          status: "18px",
          radioMode: "24px"
          };



  return (

    <>
      <article className="row custom-row border-tlr" style={{ margin: '5px 0px 0 5px' }}>
        <article className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1">
          <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" className="numcl"><span>{pageSize}</span></button>
          <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
        </article>
        <article className="col-sm-11 col-md-11 col-lg-11 col-xl-11 col-xxl-11" style={{ float: 'right' }}>
          <article style={{ float: 'right' }}>
            <article style={{ display: provisionSel === '0' ? 'none' : 'block' }} className="navdisable" >
              <input type="text" name="" value={firmipText} onChange={(e) => setFirmipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-controldistwo searchbar" style={{
                maxWidth: '254px',
                display: 'inline-block'
              }} />
              <button type="button" className="createbtn" onClick={handleFirmIP} style={{ marginLeft: '7px' }}>Search</button>
              <button type="button" className="createbtn" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>
              <article  style={{display:'inline-block',position:'relative'}} ref={columnWrapperRef} >
              <span className="addcloum" style={{ marginLeft: '5px' }}>Select Columns   </span><span className="glyphicon glyphicon-tasks" onClick={(e) => { e.stopPropagation(); handleAddColumn()}}></span>
            

               {dropDownShow && (
                                    <article className="Addcoldropdownart" onClick={(e) => e.stopPropagation()} >
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
              </article>
              <select className="form-controlfirm" value={limitValueSel} onChange={handleLimitValue} style={{ width: "auto" }} aria-invalid="false">
                <option value="0" label="100">100</option>
                <option value="1" selected="selected" label="200">200</option>
                <option value="2" label="300">300</option>
                <option value="3" label="400">400</option>
              </select>
            </article>
          </article>
        </article>
      </article>
      <article className="row border-allsd" style={{ height: '58vh', margin: '0px 0px 5px 5px' }}>
      <article className="table-scroll-x">
        <table className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 responsive-table" style={{ height: '0vh' }}>
          <thead className="disctb">
            <tr>
            <th style={{ paddingLeft: '18px' }}>
              <input
                className="incl2"
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === firmData.length && firmData.length > 0}
              />
            </th>

            {ALL_COLUMNS
            .filter(col => visibleColumns.includes(col.key))
            .map((col) => (
              <th key={col.key} onClick={() => handleSort(col.key)}>
                {col.label}
                <FontAwesomeIcon
                  icon={
                    sortField === col.key
                      ? sortOrder === 'asc'
                        ? faSortDown
                        : faSortUp
                      : faSort
                  }
                  style={{
                    color:
                      sortField === col.key
                        ? 'black'
                        : '#D7D7D7',
                    paddingLeft: col.key === 'firmware' || col.key === 'status' || col.key === 'uptime' ? '0px' : undefined
                  }}
                />
              </th>
            ))}
            <th style={{ paddingLeft: '18px' }}>
             Product Code
            </th>
            <th style={{ paddingLeft: '18px' }}>
             Line
            </th>
            <th style={{ paddingLeft: '18px' }}>
             Station
            </th>
            <th style={{ paddingLeft: '18px' }}>
             Position
            </th>
            <th>
             
            </th>
          </tr>
          </thead>
          <tbody className="discbdtwo">
            {isLoading && (
              <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>
                  Loading...
                </td>
              </tr>
            )}

            {!isLoading && !firstLoadRef.current  && firmData.length === 0 && (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", fontWeight: 'bolder' }}>
                  No Data Available
                </td>
              </tr>
            )}
            {!isLoading && (
              <>
                {(() => {
                  const filteredData = firmData
                    .filter((node) => {
                      if (linkLabel === "All" || linkLabel === "") return true;
                      return node.productCode?.toLowerCase() === linkLabel.toLowerCase();
                    })
                    .filter((node) => 
                      labelRadio === "none" || 
                      labelRadio === "" || 
                      labelRadio.toUpperCase() === "ALL" || 
                      node.radioMode === labelRadio.toUpperCase()
                    );

                  return filteredData.map((node) => (
                  <tr key={node.ipAddress}>
                    <td style={{ paddingLeft: '18px' }}>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(node.ipAddress)}
                        onChange={() => handleCheckboxChange(node.ipAddress)}
                      />
                    </td>

                    {ALL_COLUMNS
                    .filter(col => visibleColumns.includes(col.key))
                    .map((col) => (
                      <td key={col.key} style={
                                columnPadding[col.key]
                                ? { paddingLeft: columnPadding[col.key] }
                                : {}
                                            }>
                        {node[col.key]}
                      </td>
                    ))}
                    <td style={{ paddingLeft: "18px" }}>

                      <select
  className="provisionselinput"
  value={selectedProductCodes}
  onChange={handleProductCodeChange}
>

  <option value="">N/A</option>

  {node.productCode && !PRODUCT_CODES?.some(
    (item) => item.key === node.productCode
  ) && (
    <option value={node.productCode}>
      {node.productCode}
    </option>
  )}

  {PRODUCT_CODES.map((item) => (
    <option value={item.key} key={item.key}>
      {item.label}
    </option>
  ))}
</select>
                    </td>
                     <td style={{ paddingLeft: '18px' }}>
                      
                  <select
  className="provisionselinput"
  value={lineNameSel}
  onChange={handleSelectLine}
>

  <option value="">N/A</option>

  {node.region && !ALL_LINES?.some(
    (item) => item.key === node.region
  ) && (
    <option value={node.region}>
      {node.region}
    </option>
  )}

  {ALL_LINES.map((item) => (
    <option value={item.key} key={item.key}>
      {item.label}
    </option>
  ))}
</select>
                    </td>
                     <td style={{ paddingLeft: '18px' }}>
                      
                    <select
  className="provisionselinput"
  value={stationNameSel}
  onChange={(e) => handleSelectStation(e.target.value)}
>
  {/* fallback option */}
  <option value="">N/A</option>

  {/* current node location (only if not already in list) */}
  {node.location && !stationData?.some(
    (item) => item.display === node.location
  ) && (
    <option value={node.location}>
      {node.location}
    </option>
  )}

  {/* API data */}
  {stationData?.map((item, index) => (
    <option value={item.id} key={item.id ?? index}>
      {item.display}
    </option>
  ))}
</select>
                    </td>
                     <td style={{ paddingLeft: '18px' }}>
                       <select className="provisionselinput" defaultValue={-1} value={positionNameSel} onChange={handleSelectPosition}>
                      {/* <option value="-1" disabled>Select</option> */}
                      {!node.radioMode && (
                        <option value="NA">N/A</option>
                      )}

                      {node.radioMode && (
                        <option value={node.radioMode}>
                          {node.radioMode}
                        </option>
                      )}
                      <option value="SBSE" label="SN-SBSE">SN-SBSE</option>
                      <option value="SBNE" label="SN-SBNE">SN-SBNE</option>
                      <option value="NBSE" label="SN-NBSE">SN-NBSE</option>
                      <option value="NBNE" label="SN-NBNE">SN-NBNE</option>
                      <option value="SBC1" label="CAM1-SB">CAM1-SB</option>
                      <option value="SBC2" label="CAM2-SB">CAM2-SB</option>
                      <option value="SBC3" label="CAM3-SB">CAM3-SB</option>
                      <option value="SBC4" label="CAM4-SB">CAM4-SB</option>
                      <option value="NBC1" label="CAM1-NB">CAM1-NB</option>
                      <option value="NBC2" label="CAM2-NB">CAM2-NB</option>
                      <option value="NBC3" label="CAM3-NB">CAM3-NB</option>
                      <option value="NBC4" label="CAM4-NB">CAM4-NB</option>
                      <option value="SBTC" label="Transcoder-SB">Transcoder-SB</option><option value="NBTC" label="Transcoder-NB">Transcoder-NB</option><option value="SBE" label="Encoder-SB">Encoder-SB</option><option value="NBE" label="Encoder-NB">Encoder-NB</option></select>
                    </td>
                     <td style={{ paddingLeft: '18px' }}>
                      <button type="button"
                      disabled={currentUser === "Read-only"}
                      title={currentUser === "Read-only" ? "Permission required" : ""} 
                      className={`createbtn ${
                                        currentUser === "Read-only" ? "btndisable" : ""
                                    }`} 
                      onClick={currentUser !== "Read-only" ? () => handleDiscoveryConfig(node): undefined}>Save</button>
                    </td>
                  </tr>
                  ));
                })()}
              </>
            )}

          </tbody>
        </table>
        </article>
        </article>
    </>
  )
}

export default ProvisionTb;