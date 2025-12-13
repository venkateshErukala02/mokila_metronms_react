import { useState, useEffect, useRef } from "react";
import '../../pages/ornms.css'

const HardwareReplacementContainer = () => {
    const [searchValue, setSearchValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [searchData, setSearchData] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [addedItems, setAddedItems] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [searchTrigger, setSearchTrigger] = useState(0);
    const [selectedIps, setSelectedIps] = useState([]);
    const dropdownRef = useRef(null);

    useEffect(() => {

        const handleSearchData = async (searchValue) => {

            try {
                const response = await fetch(`api/v2/nodes?_s=assetRecord.serialNumber==${searchValue},label==${searchValue},sysName==${searchValue}&ar=devicetype&limit=25&offset=0&order=asc&orderBy=id`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();

                if (response.ok) {
                    setLoading(false);
                    setSearchData(data.node || []);
                    setError({ status: false, msg: "" });
                    setError({ status: false, msg: "" });
                } else {
                    throw new Error("data not found");
                }

            } catch (error) {
                setLoading(false);
                setError({ status: true, msg: error.message });
            }

        }

        if (searchValue.trim()) {
            handleSearchData(searchValue);
        }
    }, [searchTrigger]);


    const handleClearSearch = () => {
        setSearchBtn(false);
        setSearchValue('');
    }

    const handleAddToTable = (event) => {

        if (!addedItems.includes(event.id)) {
            setAddedItems((prevAddedItems) => [...prevAddedItems, event.id]);
        }

        if (!selectedItems.some(item => item.id === event.id)) {
            setSelectedItems((prevSelectedItems) => [...prevSelectedItems, event]);
        }
    };

    const handleSearchClick = (e) => {
        e.preventDefault();
        if (!searchValue.trim()) {
            alert("Please enter a search term");

        } else {
            setSearchBtn(true);
            setSearchTrigger(prev => prev + 1);
        }
    }

    return (

        <>
            <article className="row" style={{ marginTop: "16px" }}>
                <article className="col-1"></article>
                <article className='col-10'>
                    <article className="" style={{ height: '90vh' }}>
                        <article className="row custom-row border-tlr">
                            <h1 className="hardwaretitle">Hardware Replace</h1>
                        </article>
                        <article className="row border-allsd b-t">
                            <article className="col-6" style={{ padding: '8px' }}>
                                <h4 className="selectdevititle">Select Old Device</h4>
                                <hr />
                                <article style={{ position: 'relative' }}>
                                    <ul className="regionlist">
                                        <li>
                                            <label for="" className="traplabel">Search Device</label>
                                            <article className="checkbok" style={{ display: 'flex' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search IP Address"
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    className="searchIpinput"
                                                />
                                                <button type="button" className="searchfirmbtn" onClick={handleSearchClick}>Search</button>
                                                <button className="clearfix createbtn" type="button" onClick={handleClearSearch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

                                            </article>
                                        </li>
                                    </ul>
                                    {searchBtn && searchData.length === 0 && <article ref={dropdownRef} style={{ maxHeight: '5vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }} className="scheduletitle">No Data</article>}
                                    {searchData.length > 0 && <article ref={dropdownRef} style={{ maxHeight: '42vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }}>
                                        <div style={{ padding: "5px", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center", gap: "8px", justifyContent: "end" }}>
                                            {/* <input
                                        type="checkbox"
                                        checked={selectedIps.length === searchData.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label className="scheduletitle">Add Selected</label> */}
                                        </div>
                                        <ul className="searchlist">
                                            {searchData && searchData.map((event) => {
                                                const isAdded = addedItems.includes(event.id);
                                                const isChecked = selectedIps.includes(event.id);
                                                return (
                                                    <li key={event.id}>
                                                        <article style={{ justifyContent: "space-between", display: 'flex', width: "100%" }}>
                                                            {/* <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSelectItem(event.id)}
                                                    /> */}
                                                            <h5 className="scheduletitle">{event.primaryIP}</h5>
                                                            <button className="addbtn" onClick={() => handleAddToTable(event)}
                                                                disabled={isAdded}
                                                                style={{
                                                                    backgroundColor: isAdded ? '#ccc' : '#007bff',
                                                                    color: isAdded ? '#666' : 'white',
                                                                    cursor: isAdded ? 'not-allowed' : 'pointer'
                                                                }}
                                                            >{isAdded ? 'Added' : 'Add'}</button>
                                                        </article>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </article>}
                                </article>
                                <article className="row border-allsd" style={{ height: '28vh', overflow: 'hidden', margin: "22px 0" }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <thead className="configthtb">
                                            <tr style={{ textAlign: 'center' }}>
                                                <th>System Name</th>
                                                <th>IP Address</th>
                                                <th>Station</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <div style={{ height: 'calc(28vh - 40px)', overflowY: 'auto' }}>
                                        <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                            <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                                {Array.isArray(selectedItems) && selectedItems.length > 0 ? (
                                                    selectedItems.map((event) => (
                                                        <tr key={event.id}>
                                                            <td style={{ width: '150px' }}>{event.sysName}</td>
                                                            <td style={{ width: '150px' }}>{event.primaryIP}</td>
                                                            <td style={{ width: '100px' }}>{event.facility}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    // <tr>
                                                    //     <td colSpan="4">No items found</td>
                                                    // </tr>
                                                    ''
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </article>
                            </article>
                            <article className="col-6" style={{ padding: '8px' }}>
                                <h4 className="selectdevititle">Select New Device</h4>
                                <hr />
                                <article style={{ position: 'relative' }}>
                                    <ul className="regionlist">
                                        <li>
                                            <label for="" className="traplabel">Search Device</label>
                                            <article className="checkbok" style={{ display: 'flex' }}>
                                                <input
                                                    type="text"
                                                    placeholder="Search IP Address"
                                                    value={searchValue}
                                                    onChange={(e) => setSearchValue(e.target.value)}
                                                    className="searchIpinput"
                                                />
                                                <button type="button" className="searchfirmbtn" onClick={handleSearchClick}>Search</button>
                                                <button className="clearfix createbtn" type="button" onClick={handleClearSearch} style={{ display: 'inline-block', marginLeft: '7px', display: searchBtn === true ? 'inline-block' : 'none' }}> Clear Search</button>

                                            </article>
                                        </li>
                                    </ul>
                                    {searchBtn && searchData.length === 0 && <article ref={dropdownRef} style={{ maxHeight: '5vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }} className="scheduletitle">No Data</article>}
                                    {searchData.length > 0 && <article ref={dropdownRef} style={{ maxHeight: '42vh', overflow: 'auto', position: 'absolute', backgroundColor: 'white', zIndex: '99999', width: '236px', left: "0" }}>
                                        <div style={{ padding: "5px", borderBottom: "1px solid #ccc", display: "flex", alignItems: "center", gap: "8px", justifyContent: "end" }}>
                                            {/* <input
                                        type="checkbox"
                                        checked={selectedIps.length === searchData.length}
                                        onChange={handleSelectAll}
                                    />
                                    <label className="scheduletitle">Add Selected</label> */}
                                        </div>
                                        <ul className="searchlist">
                                            {searchData && searchData.map((event) => {
                                                const isAdded = addedItems.includes(event.id);
                                                const isChecked = selectedIps.includes(event.id);
                                                return (
                                                    <li key={event.id}>
                                                        <article style={{ justifyContent: "space-between", display: 'flex', width: "100%" }}>
                                                            {/* <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleSelectItem(event.id)}
                                                    /> */}
                                                            <h5 className="scheduletitle">{event.primaryIP}</h5>
                                                            <button className="addbtn" onClick={() => handleAddToTable(event)}
                                                                disabled={isAdded}
                                                                style={{
                                                                    backgroundColor: isAdded ? '#ccc' : '#007bff',
                                                                    color: isAdded ? '#666' : 'white',
                                                                    cursor: isAdded ? 'not-allowed' : 'pointer'
                                                                }}
                                                            >{isAdded ? 'Added' : 'Add'}</button>
                                                        </article>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </article>}
                                </article>
                                <article className="row border-allsd" style={{ height: '28vh', overflow: 'hidden', margin: "22px 0" }}>
                                    <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                        <thead className="configthtb">
                                            <tr style={{ textAlign: 'center' }}>
                                                <th>System Name</th>
                                                <th>IP Address</th>
                                                <th>Station</th>
                                            </tr>
                                        </thead>
                                    </table>

                                    <div style={{ height: 'calc(28vh - 40px)', overflowY: 'auto' }}>
                                        <table className="col-md-12 col-sm-12 col-lg-12 col-xl-12" style={{ tableLayout: 'fixed', width: '100%' }}>
                                            <tbody className="configbdtb" style={{ textAlign: 'center' }}>
                                                {Array.isArray(selectedItems) && selectedItems.length > 0 ? (
                                                    selectedItems.map((event) => (
                                                        <tr key={event.id}>
                                                            <td style={{ width: '150px' }}>{event.sysName}</td>
                                                            <td style={{ width: '150px' }}>{event.primaryIP}</td>
                                                            <td style={{ width: '100px' }}>{event.facility}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    // <tr>
                                                    //     <td colSpan="4">No items found</td>
                                                    // </tr>
                                                    ''
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </article>
                            </article>
                            <article style={{textAlign:'center'}}>
                                <button className="searchfirmbtn">Hardware Replacement</button>
                            </article>
                            <article style={{margin:'12px 22px'}}>
                                <h6 className="notehardpara">Note: </h6>
                                <ul className="hardwarenotelist">
                                    <li>1. Make sure the old device configuration is downloaded</li>
                                    <li>2. Make sure TFTP/FTP details are configured in "settings" section</li>
                                    <li>3. Select the Old Device and New Device for initiating Hardware Replacement</li>
                                </ul>
                            </article>
                        </article>
                    </article>
                </article>
                <article className="col-1"></article>

            </article>
        </>
    )
}



export default HardwareReplacementContainer