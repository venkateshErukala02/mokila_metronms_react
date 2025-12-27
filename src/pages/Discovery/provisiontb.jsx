import { useState, useEffect, useRef } from "react";
import './../Discovery/discovery.css';
import '../ornms.css'
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


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
          { key: 'productCode', label: 'Product Code' },
          { key: 'radioMode', label: 'Radio Mode' },
        ];
        const DEFAULT_COLUMNS = [
            "sysName",
            "ipAddress",
            "status",  
            "sysUptime",
            "radioMode",
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
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [dropDownShow,setDropDownShow] = useState(false);
  const columnWrapperRef =  useRef(null);
  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_COLUMNS);
  const firstLoadRef = useRef(true);

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
  
    const url = `api/v2/discovery/showunprovisioned?show=${show}&ofs=0&limit=${limit}&sort=sysUptime&by=desc`;
  
    getDataUnprovisiontbData(url);

    const intervalId = setInterval(() => {
      getDataUnprovisiontbData(url);
  }, 2000); 

  return () => clearInterval(intervalId);
  }, [unassignLabel, limitValueSelLabel,searchBtn]);
  

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



  return (

    <>
      <article className="row custom-row border-tlr" style={{ margin: '5px 0px 0 5px' }}>
        <article className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1">
          <button type="button" className="arrowlf">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button type="button" className="numcl"><span>1</span></button>
          <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
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
              <button type="button" className="createbtn m-l10">Upgrade</button>
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
      <article className="row border-allsd" style={{ height: '50vh', margin: '0px 0px 5px 5px' }}>
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
                      <td key={col.key}>
                        {node[col.key]}
                      </td>
                    ))}
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