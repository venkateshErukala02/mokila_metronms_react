import  { useState, useEffect } from "react";
import '../ornms.css'
import '../Dashboard/dashboard.css';



const WaysideTable = ({ westSideView, circleId, setShowPopup, showPopup,lineId,handleTagsPopup,stationCount,lineCount ,allTagfailCount,tagTypeValue}) => {
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
            if (response.ok) {
                setIsLoading(false);
                setRdData(data.tags || []);

                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };
    const textName = westSideView;

useEffect(() => {
    let url = '';
    if (textName === 'Line1') {
        if (lineId) {
            url = `api/v2/wayside/linebytime?line=${lineId}&time=600`;
        } 
    } 

    if (url) fetchDataRadial(url);
}, [textName, lineId,lineCount, pageSize, limitValueSelLabel]);



useEffect(() => {
    let url = '';
    if (textName === 'Line1') {
        if (circleId) {
            url = `api/v2/wayside/failedbytime?station=${circleId}&time=600`;
        }
    } 

    if (url) fetchDataRadial(url);
}, [textName, circleId,stationCount, pageSize, limitValueSelLabel]);


useEffect(() => {
    let url = '';
    if (textName === 'Line1') {
        url = `api/v2/wayside/fetch?show=${tagTypeValue}&time=3600`
    }
    if (url) fetchDataRadial(url);
}, [tagTypeValue]);

useEffect(() => {
    let url = '';
    if (textName === 'Line1') {
        url = `api/v2/wayside/fetch?show=${tagTypeValue}&time=3600`
    }
    if (url) fetchDataRadial(url);
}, []);

useEffect(() => {
    let url = '';
    if (textName === 'Line1') {
        url = `api/v2/wayside/fetch?show=${tagTypeValue}&time=3600`
    }
    if (url) fetchDataRadial(url);
}, [allTagfailCount]);

    const handlePopup=(value,id)=>{
        handleTagsPopup(value,id)
    }

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
                <article style={{ height: "43vh"}}>
                    <table className="col-12 border-allsd table-fixed" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th className="col-6" style={{width:'50px'}}>Tags</th>
                                <th className="col-6" style={{width:'100px'}}>Time</th>
                                 <th className="col-6" style={{width:'130px'}}>Position</th>
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
                                rdData.map((node, index) => {
                                    const key = node        
                                        return(
                                    <tr key={node}>
                                        <td onClick={() => handlePopup(true,`${key.tag}`)} style={{cursor:'pointer',color:'#006eff'}}>{key.tag}</td>
                                        <td>{key.time}</td>
                                         <td>{key.position}</td>
                                    </tr>
                                )})}
                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default WaysideTable;