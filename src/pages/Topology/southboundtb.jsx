import {useState,useEffect} from "react";
import '../ornms.css';
import '../Topology/topology.css';


const SouthBoundTb=({textName})=>{

    const [southData,setSouthData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });

    const getSouthBoundTbData = async (url) => {
        setIsLoading(true);
        setIsError({ status: false, msg: "" });
        try {
            const username = 'admin';
            const password = 'admin';
            // const token = btoa(`${username}:${password}`)
            const options = {
                method: "GET",
                headers: {
                    // 'Authorization': `Basic ${token}`
                }

            };
            const response = await fetch(url, options);

            if (response.status === 204) {
            setSouthData([]); // important
            setIsLoading(false);
            return;
            }
            
            const data = await response.json();
            if (response.ok) {
                setIsLoading(false);
                setSouthData(data.event || []);
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
        const fetchData= async()=>{
            const facId = textName?.data?.id ?? 1;
            const now = Date.now();

            const oneHourAgo = now - (60 * 60 * 1000);

           const url =`api/v2/events/sb/station?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D${oneHourAgo}&fac=${facId}&limit=100&offset=0&order=desc&orderBy=id`;
            await getSouthBoundTbData(url);
        }
       
        fetchData();
        const intervalId = setInterval(fetchData,30000);

        return()=> clearInterval(intervalId);
    },[textName])

     const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };


    return(
        <>
          <article>
                        <article className="bound-card">
                        <article className="sbcard-header">
                            Alarms
                        </article>
                        <article className="trainevenhead">
                            South Bound
                            <article className="alarmiconsty">
                            {/* <button className="sbarrow">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="sbarrow"><span>1</span></button>
                        <button className="sbarrow"><i className="fa-solid fa-arrow-right"></i></button> */}
                            </article>
                        </article>
                           <article className="bouneventtable">
                    <article className="row">
                        <table className="col-12">
                            <thead className="boundeventsthtb">
                                <tr>
                                    <th>IP Address</th>
                                    <th>Time</th>
                                    <th>Severity</th>
                                    <th>Message</th>
                                </tr>
                            </thead>

                            <tbody className="boundeventstbdtb">
                                {!isLoading && !isError.status && (!southData || southData?.length === 0) && (
                                    <tr>
                                        <td colSpan="8" style={{ textAlign: "center" }}>
                                            No Data Available
                                        </td>
                                    </tr>
                                )}
                                {Array.isArray(southData) && southData?.length > 0 ? (
                                    southData.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.nodeLabel ? event.nodeLabel : event.host}</td>
                                            <td>{formatTime(event.createTime)}</td>
                                            <td>{event.severity}</td>
                                            <td>{event.logMessage}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        {/* <td colSpan="4" className="datacl centered-text">No Data</td> */}
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </article>
                </article>
                        </article>
                    </article>
        </>
    )
}

export default SouthBoundTb;