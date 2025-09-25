import  { useState, useEffect } from "react";
import '../ornms.css'
import '../Dashboard/dashboard.css';



const StationTagsTable = ({ circleId}) => {
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
                if(Object.keys(data).length === 0){
                   setRdData([]) 
                }
                setRdData(Array.isArray(data) ? data : [data]);

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

useEffect(() => {
    let url = '';
        if (circleId) {
            url = `api/v2/wayside/stationdetails?station=${circleId}`;
        } 
       if (url) fetchDataRadial(url);
}, [circleId]);


    return (
        <>
            <article className="">
                <article className="row">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                    </article>
                </article>
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{ height: "43vh", overflowY: 'auto', overflowX: 'clip' }}>
                    <table className="col-12 border-allsd table-fixed" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th>Location</th>
                                <th>Position</th>
                                <th>Status</th>
                                <th>Type</th>
                                <th>TagId</th>
                                <th>Next Tag</th>
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
                                rdData.length > 0 &&  Object.keys(rdData[0]).length !== 0 ? (
                                rdData.map((node, index) => (
                                    <tr key={index}>
                                        <td>{node.location}</td>
                                        <td className="highlightText">{node.position}</td>
                                        <td>{node.status}</td>
                                        <td>{node.type}</td>
                                        <td>{node.tagId}</td>
                                        <td>{node.nextTag}</td>
                                    </tr>
                                ))) :( 
                                    <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                                )}
                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default StationTagsTable;