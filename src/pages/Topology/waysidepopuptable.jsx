import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../ornms.css'
import '../Dashboard/dashboard.css';
import { handleNodeData } from "../Action/action";



const WaysidePopupTable = ({ currentTagid }) => {
    const [rdData, setRdData] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');


    const handleCurrentTagData = async (url) => {
        if (!currentTagid) {
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
                // setRdData(data || []);
                setRdData(Array.isArray(data) ? data : [data])
                console.log('popoopopo', data);
                console.log('fghjk', rdData);
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
        if (!currentTagid) return;
        const url = `api/v2/wayside/fetchtime/${currentTagid}`;
        handleCurrentTagData(url);
    }, [currentTagid]);

    // useEffect(() => {
    //     if (!radialipText.trim()) return;
    //     const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`;
    //     handleRadialIP(url);


    // }, [limitValueSelLabel]);

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
    // useEffect(() => {
    //     setPageSize(1);
    //     setLimitValueSelLabel('50')
    //     setLimitValueSel('1')
    // }, [textName])


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
            <article className="row">
                <article style={{ height: "306px" }}>
                    {/* <h1>hello</h1> */}
                    <h1 className="topoheading"> {rdData[0]?.tag }</h1>
                    <table className="col-12 border-allsd table-fixed" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                             {rdData && rdData.length > 0 ? (
                                rdData.map((node, index) => (
                                    <tr>
                                <th className="col-6" style={{ width: '100px' }}>Cab Number</th>
                                <th className="col-6" style={{ width: '100px' }}>Time</th>
                            </tr>
                                ))): ''}
                            
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

                           {rdData && rdData.length > 0 ? (
                                rdData.map((rowNode, rowIndex) => (
                                    rowNode.times && rowNode.times.length > 0 ? (
                                    rowNode.times.map((timeNode, timeIndex) => (
                                        <tr key={`${rowIndex}-${timeIndex}`}>
                                        <td><a href={`http://localhost:8980/metronms/api/v2/wayside/tagfile/${timeNode.cab}?file=${timeNode.file}`} target="_blank">{timeNode.cab}</a></td>
                                        <td>{timeNode.time}</td>
                                        </tr>
                                    ))
                                    ) : (
                                    <tr key={`empty-${rowIndex}`}>
                                        <td colSpan="2">No Data available</td>
                                    </tr>
                                    )
                                ))
                                ) : (
                                <tr>
                                    <td colSpan="2">No data found</td>
                                </tr>
                                )}

                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default WaysidePopupTable;