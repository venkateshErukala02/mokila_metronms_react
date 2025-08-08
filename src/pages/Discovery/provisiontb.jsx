import React, { useState, useEffect } from "react";
import './../Discovery/discovery.css';


const ProvisionTb = ({ getProviContData }) => {
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

  const handleFirmIP = async () => {


    if (!firmipText) {
      alert("Please enter a search term");

    } else {
      setSearchBtn(true)


      try {
        const response = await fetch(`api/v2/nodes/search?_s=sysName==${firmipText}*,label==${firmipText},assetRecord.serialNumber==${firmipText}&limit=100&offset=0&order=asc`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          setIsLoading(false);
          setFirmData(data.nodes || []);
          setFirmipText('')
          setIsError({ status: false, msg: "" });
          console.log("okkoo", data);
          console.log("gdgd", response);
          setIsError({ status: false, msg: "" });
        } else {
          throw new Error("data not found");
        }

      } catch (error) {
        setIsLoading(false);
        setIsError({ status: true, msg: error.message });
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
    // setLabelText(label); // optional if needed for UI
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
  
  
 
  // Handle Apply button click - Send selected data via API
  const handleApply = async () => {
    if (selectedRows.length === 0) {
      alert("Please select at least one row.");
      return;
    }

    const selectedData = firmData.filter((row) => selectedRows.includes(row.ipAddress));

    getProviContData(selectedData)

  };

  const getDataUnprovisiontbData = async (url) => {
    setIsError({ status: false, msg: "" });
    try {

      const options = {
        method: "GET",
      };
      const response = await fetch(url, options);
      const data = await response.json();
      console.log('jhsjkfjkskksssssssss', data.list)
      if (response.ok) {
        setIsLoading(false);
        setFirmData(data);
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
    let show = unassignLabel || 'none';
    let limit = limitValueSelLabel || '100';
  
    const url = `api/v2/discovery/showunprovisioned?show=${show}&ofs=0&limit=${limit}&sort=sysUptime&by=desc`;
  
    const intervalId = setInterval(() => {
      getDataUnprovisiontbData(url);
  }, 2000); 

  return () => clearInterval(intervalId);
  }, [unassignLabel, limitValueSelLabel]);
  

//  let url='api/v2/discovery/showunprovisioned?show=none&ofs=0&limit=25&sort=ipAddress&by=desc'

  return (

    <>
      <article className="row custom-row border-tlr" style={{ margin: '5px 0px 0 5px' }}>
        <article className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1">
          <button className="clearfix arrowlf">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button className="clearfix numcl"><span>1</span></button>
          <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
        </article>
        <article className="col-sm-11 col-md-11 col-lg-11 col-xl-11 col-xxl-11" style={{ float: 'right' }}>
          <article style={{ float: 'right' }}>
            <article style={{ display: provisionSel === '1' ? 'none' : 'block' }} className="navdisable" >
              <input type="text" name="" value={firmipText} onChange={(e) => setFirmipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-controldistwo searchbar" style={{
                maxWidth: '254px',
                display: 'inline-block'
              }} />
              <button className="clearfix createbtn" onClick={handleFirmIP} style={{ marginLeft: '7px' }}>Search</button>
              <button className="clearfix createbtn" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

              <select className="form-controlfirm" value={provisionSel} onChange={handleProvision} style={{ marginRight: '5px' }} aria-invalid="false">
                <option value="1" selected="selected" label="Firmware">Firmware</option>
                <option value="0" label="Provision">Provision</option>


              </select>
              <span className="selectlbl">Radio Mode:

              </span>
              <select className="form-controlfirm" value={radioSel} onChange={handleRadio} style={{ width: "auto" }} aria-invalid="false">
                <option value="0" label="All">All</option>
                <option value="1" selected="selected" label="AP">AP</option>
                <option value="2" label="SU">SU</option>

              </select>
              <span className="selectlbl">Link Type:

              </span>
              <select className="form-controlfirm" value={linktypeSel} onChange={handleLink} style={{ width: "40px" }} aria-invalid="false">
                <option value="0" label="All">All</option>
                <option value="1" selected="selected" label="PTP">PTP</option>
                <option value="2" selected="selected" label="BackHaul">BackHaul</option>
                <option value="3" selected="selected" label="PTMP">PTMP</option>

              </select>

              <button className="clearfix createbtn" onClick={handleApply} disabled={isLoading || selectedRows.length === 0}>Apply</button>
              <span className="addcloum" style={{ marginLeft: '5px' }}>Select Columns<span style={{ marginLeft: "7px", marginTop: "2px" }} class="glyphicon glyphicon-tasks"></span>

              </span>
              {/* <select className="form-controlfirm" value={unassignSel} onChange={handleUnassign} style={{ width: "auto", marginLeft: '0px', display: 'inline-block' }} aria-invalid="false">
                <option value="1" selected="selected" label="Unassigned">Unassigned</option>
                <option value="0" label="All">All</option>


              </select> */}
              <select className="form-controlfirm" value={limitValueSel} onChange={handleLimitValue} style={{ width: "auto" }} aria-invalid="false">
                <option value="0" label="100">100</option>
                <option value="1" selected="selected" label="200">200</option>
                <option value="2" label="300">300</option>
                <option value="3" label="400">400</option>
              </select>
            </article>
            <article style={{ display: provisionSel === '0' ? 'none' : 'block' }} className="navdisable" >
              <input type="text" name="" value={firmipText} onChange={(e) => setFirmipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-controldistwo searchbar" style={{
                maxWidth: '254px',
                display: 'inline-block'
              }} />
              <button className="clearfix createbtn" onClick={handleFirmIP} style={{ marginLeft: '7px' }}>Search</button>
              <button className="clearfix createbtn" onClick={handleClearSerch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

              {/* <select className="form-controlfirm" value={provisionSel} onChange={handleProvision} style={{ marginRight: '5px' }} aria-invalid="false">
                <option value="1" selected="selected" label="Firmware">Firmware</option>
                <option value="0" label="Provision">Provision</option>


              </select> */}
              <button className="clearfix createbtn m-l10">Upgrade</button>
              <span className="addcloum" style={{ marginLeft: '5px' }}>Select Columns<span style={{ marginLeft: "7px", marginTop: "2px" }} class="glyphicon glyphicon-tasks"></span>

              </span>
              {/* <select className="form-controlfirm"  value={unassignSel} onChange={handleUnassign} style={{ width: "auto", marginLeft: '10px', display: 'inline-block' }} aria-invalid="false">
                <option value="1" selected="selected" label="Unassigned">Unassigned</option>
                <option value="0" label="All">All</option>


              </select> */}
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
              <th><input className="incl2"
                type="checkbox"
                onChange={handleSelectAll}
                checked={selectedRows.length === firmData.length && firmData.length > 0}

              /></th>
              <th>System Name</th>
              <th>Primary IP</th>
              <th>MAC Address</th>
              <th>Serial Number</th>
              <th>Model Number</th>
              <th>Firmware</th>
              <th>Status</th>
              <th>Uptime</th>
              <th>Product Code</th>
              <th>Radio Mode</th>
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

            {isError.status && (
              <tr>
                <td colSpan="12" style={{ textAlign: "center", fontWeight: 'bolder' }}>
                  No Data Available
                </td>
              </tr>
            )}

            {/* {!isLoading && !isError.status &&  (!firmData || firmData.length === 0) && (
              <tr>
                <td colSpan="12" style={{ textAlign: "center" }}>
                  No Data Available
                </td>
              </tr>
            )} */}

            {/* {!isLoading &&
                            !isError.status &&
                            firmData.length > 0 && */}

            {/* {!isLoading &&
              !isError.status &&
              firmData.length > 0 &&
              firmData
                .filter((node) => {
                  if (linkLabel === "All" || linkLabel === "") return true;
                  return node.productCode?.toLowerCase() === linkLabel.toLowerCase();
                })
                // .filter((node) => {
                //   if (labelRadio.toUpperCase() === "All" || labelRadio === "") return true;
                //   return node.radioMode === labelRadio.toUpperCase();
                // })
                // .filter((node) => node.radioMode === labelRadio.toUpperCase())
                // .filter((node) => node.radioMode === labelRadio.toUpperCase() || labelRadio.toUpperCase() === "ALL" || labelRadio === "")
                .filter((node) => labelRadio === "none" || labelRadio === "" || labelRadio.toUpperCase() === "ALL" || node.radioMode === labelRadio.toUpperCase())

                .map((node, index) => (
                  <tr key={node.id}>
                    <td><input type="checkbox"

                      checked={selectedRows.includes(node.id)}
                      onChange={() => handleCheckboxChange(node.id)} /></td>

                    <td>{node.sysName}</td>
                    <td>{node.ipAddress}</td>
                    <td>{node.macaddress}</td>
                    <td>{node.serialNum}</td>
                    <td>{node.modelNum}</td>
                    <td>{node.firmware}</td>
                    <td>{node.status}</td>
                    <td>{node.sysUptime}</td>
                    <td>{node.productCode}</td>
                    <td>{node.radioMode}</td>
                  </tr>
                ))} */}

{!isLoading && !isError.status && (
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

      if (filteredData.length === 0) {
        return (
          <tr>
            <td colSpan="11" style={{ textAlign: "center" }}>
              No data available
            </td>
          </tr>
        );
      }

      return filteredData.map((node) => (
        <tr key={node.ipAddress}>
          <td>
            <input
              type="checkbox"
              checked={selectedRows.includes(node.ipAddress)}
      onChange={() => handleCheckboxChange(node.ipAddress)}
            />
          </td>
          <td>{node.sysName}</td>
          <td>{node.ipAddress}</td>
          <td>{node.macaddress}</td>
          <td>{node.serialNum}</td>
          <td>{node.modelNum}</td>
          <td>{node.firmware}</td>
          <td>{node.status}</td>
          <td>{node.sysUptime}</td>
          <td>{node.productCode}</td>
          <td>{node.radioMode}</td>
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