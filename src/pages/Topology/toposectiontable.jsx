import React,{useState,useEffect} from "react";


const TopoSectionTable=({textName})=>{
    // const lineName= textName.text;
    const [sectionTbData,setSectionTbData] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [lineipText, setLineipText] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [searchBtn, setSearchBtn] = useState("");


    const fetchSectionTbData = async (url) => {
        setIsLoading(true);
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
            //   console.log('llol',response)
            if (response.ok) {
                setIsLoading(false);
                setSectionTbData(data.nodes || []);


                // console.log('lpll',data)
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        let url ='';
        switch (textName.data.mode) {
            case 'location':
              url= `api/v2/dashboard/filternodes?ar=line&facilities=${textName.text}&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
                break;
            case 'facility':
                 url= `api/v2/dashboard/filternodes?ar=${textName.data.parent}&facilities=${textName.data.display}&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
               
                break;        
            default:
                return;
        }
        fetchSectionTbData(url);
         
    },[textName]);

    const handleRadialIP=()=>{}


    const handleClearSerch = () => {
        setSearchBtn(false);
        setLineipText('');
        // setRdData([])
    }


    // const handleLimitValue = (event) => {
    //     setLimitValueSel(event.target.value);
    //     const label = event.target.options[event.target.selectedIndex].label;
    //     setLimitValueSelLabel(label)
    // }

    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button className="clearfix arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="clearfix numcl"><span>1</span></button>
                        <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <ul className="searchdashlist">
                            <li>
                                <input name="" value={lineipText} onChange={(e) => setLineipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-control1 searchbar1" />
                                <button className="clearfix createbtn" onClick={() => {
                                    // const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`;
                                    // handleRadialIP(url);
                                }}

                                    style={{ marginLeft: '7px' }}>Search</button>
                                <button className="clearfix createbtn" onClick={handleClearSerch} style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }}> Clear Search</button>

                            </li>
                            <li>
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"></span></label>

                                {/* <select className="form-controll1" value={limitValueSel} onChange={handleLimitValue} style={{ width: 'auto' }} aria-invalid="false">
                                    <option value="0" label="25" defaultValue={25}>25</option>
                                    <option value="1" label="50">50</option>
                                    <option value="2" label="100">100</option>
                                    <option value="3" label="500">500</option>
                                </select> */}
                            </li>
                        </ul>

                    </article>
                </article>  
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{overflowY:'auto',height:'30vh'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th>System Name</th>
                                <th>Primary IP</th>
                                {/* <th>Firmware</th>
                                <th>Status</th> */}
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
                                        <td>{node.status}</td>
                                        {/* <td>{node.sysUptime}</td>
                                        <td>{node.productCode}</td> */}
                                        <td>{node.radioMode}</td>
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

