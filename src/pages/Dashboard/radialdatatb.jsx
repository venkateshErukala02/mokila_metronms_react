import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../ornms.css'
import '../Dashboard/dashboard.css';
import { handleNodeData } from "../Action/action";



const RadialDataTb = ({ radialData, dname, circleId, lineInfo }) => {
    const [rdData, setRdData] = useState('');
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');

    const fetchDataRadial = async (url) => {
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
                setRdData(data.nodes || []);


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

    const apiStatus = radialData + dname;

    useEffect(() => {
        let url = '';

        switch (apiStatus) {

            case 'apdown':
            case 'transcoderdown':
            case 'camdown':
            case 'obcdown':
            case 'stadown':
            case 'encoderdown':
            case 'iocdown':
                console.log('Fetching data...', radialData, dname);
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=sysUptime&by=desc&ar=glob`
                fetchDataRadial(url);
                break;
            case 'apup':
            case 'transcoderup':
            case 'camup':
            case 'obcup':
            case 'staup':
            case 'encoderup':
            case 'iocup':
                console.log('Fetching data...', radialData, dname);
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=sysUptime&by=desc&ar=glob`
                fetchDataRadial(url);
                break;
            case 'fullradialdown':
            case 'fullradialgood':
                console.log('Fetching data...', radialData, dname);
                url = `api/v2//dashboard/filternodesg?filter=ns&value=${dname}&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
                fetchDataRadial(url);
                break;

            case 'fullradialall':
                console.log('Fetching data...', radialData, dname);
                //   url ='api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=1&limit=25&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob';
                url = `api/v2//dashboard/filternodesg?filter=ns&value=all&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
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
                console.log('Fetching data...', radialData, dname);
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=down&rd=${radialData}&sort=sysUptime&by=desc&ar=glob`
                fetchDataRadial(url);
                break;



            case 'Down':
                console.log('Fetching data...', radialData);
                // url = `api/v2/dashboard/filternodes?filter=radioMode&value=ap&offset=1&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
                url = 'api/v2//dashboard/filternodesg?filter=ns&value=down&offset=1&limit=25&status=all&rd=encoder&sort=sysUptime&by=desc&ar=glob'
                fetchDataRadial(url);
                break;
            case 'line1-sec1':
                console.log('Fetching data...', radialData);
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line1-sec1&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`;
                fetchDataRadial(url);
                break;
            case 'line1-sec2':
                console.log('Fetching data...', radialData);
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line1-sec2&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`
                fetchDataRadial(url);
                break;
            case 'line4-sec1':
                console.log('Fetching data...', radialData);
                url = `api/v2//dashboard/filternodes?ar=line&facilities=line4-sec1&state=up&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`;
                fetchDataRadial(url);
                break;

            case 'nodeId':
                console.log('Fetching full radial data...');
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`
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
                console.log('Fetching full radial data...');
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=${radialData}&offset=${pageSize}&limit=${limitValueSelLabel}&status=${dname}&rd=${radialData}&sort=sysUptime&by=desc&ar=glob`;
                fetchDataRadial(url);
                break;

            default:
                url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
                fetchDataRadial(url);
                break;
        }
    }, [radialData, dname, limitValueSelLabel, pageSize, apiStatus]);



    useEffect(() => {
        let url = '';
        console.log('dfghjk', lineInfo);
        switch (lineInfo) {
            case 'line1-sec1':
                url = `api/v2//dashboard/filternodes?ar=line1-sec1&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`
                fetchDataRadial(url);
                break;
            case 'line1-sec2':
                url = `api/v2//dashboard/filternodes?ar=line1-sec2&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`
                fetchDataRadial(url);
                break;
            case 'line4-sec1':
                url = `api/v2//dashboard/filternodes?ar=line4-sec1&facilities=${circleId}&state=down&offset=${pageSize}&limit=${limitValueSelLabel}&status=up&sort=ipAddress&by=asc`
                fetchDataRadial(url);
                break;
            default:
                break;
        }

    }, [circleId, lineInfo, pageSize, limitValueSelLabel])


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

    const handleClearSerch = () => {
        setSearchBtn(false);
        setRadialipText('');
        setRdData([])
    }


    const handleLimitValue = (event) => {
        setLimitValueSel(event.target.value);
        const label = event.target.options[event.target.selectedIndex].label;
        setLimitValueSelLabel(label)
    }

    // useEffect(()=>{
    //     const fetchData=async()=>{
    //         let url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;

    //        await fetchDataRadial(url);
    //     }

    //     fetchData();
    // },[]);



    // useEffect(() => {

    //     // if(apiStatus === 'apall' || 'transcoderall'||'camall'|| 'obcall' || 'staall' || 'encoderall'||  ){
    //   const fetchData = async () => {
    //     let url = `api/v2//dashboard/filternodesg?filter=productCode&value=ap&offset=${pageSize}&limit=${limitValueSelLabel}&status=all&rd=ap&sort=sysUptime&by=desc&ar=glob`;
    //     await fetchDataRadial(url);
    //   };
    //   fetchData();
    // // }
    // }, [pageSize, limitValueSelLabel]);





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
                                <button className="clearfix createbtn" onClick={handleClearSerch} style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }}> Clear Search</button>

                            </li>
                            <li>
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"></span></label>

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
                                <th>System Name</th>
                                <th>Primary IP</th>
                                <th>Status</th>
                                <th>Up Time</th>
                                <th>Device Type</th>
                                <th>line</th>
                                <th>Station</th>
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

                            {!isLoading && !isError.status && rdData.length === 0 && (
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
                                        <td><a href={`http://${node.ipAddress}`} target="_blank">{node.sysName}</a></td>
                                        <td className="highlightText" onClick={() => handleRowClick(node)} >{node.ipAddress}</td>
                                        <td>{node.status}</td>
                                        <td>{node.sysUptime}</td>
                                        <td>{node.productCode}</td>
                                        <td>{node.region}</td>
                                        <td>{node.location}</td>
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


export default RadialDataTb;