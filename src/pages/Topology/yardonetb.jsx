import React,{useState,useEffect} from "react";


const YardTbone=({textName,yardfaclData})=>{
     const [isLoading, setIsLoading] = useState(false);
     const [isError, setIsError] = useState({ status: false, msg: "" });
    // const [yardfaclData, setYardfaclData] = useState([]);
    const [linkData,setLinkData] = useState({});


    const getYardLinkData = async (url, nodeId) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Basic ${btoa('admin:admin')}`
                }
            });
            const data = await response.json();
    
            if (response.ok) {
                setLinkData(prev => ({
                    ...prev,
                    [nodeId]: data.links || []
                }));
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsError({ status: true, msg: error.message });
        } finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            if (!yardfaclData || yardfaclData.length === 0) return;
        
            for (const node of yardfaclData) {
                const modifiedNodeId = Math.floor(Math.random() * 10); 

                // const nodeId = node.nodeId ;
                const url = `api/v2/nodelinks/linkstatstest?nodeId=${modifiedNodeId}`;
                await getYardLinkData(url, node.nodeId);
            }
        };
    
        fetchData();
    }, [yardfaclData]);
    
    

    return(
        <>
           <article className="row">
                <article style={{ minHeight:'205px',maxHeight:'205px',overflowY:'auto'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>
                        <thead className="yardtb">
                            <tr className="col-3">
                                <th className="col-1">Location</th>
                                <th>System Name</th>
                                <th>Primary IP</th>
                                <th>Status</th>
                            
                                <th>	Connected cabs </th>
                                <th style={{paddingLeft:'25px'}}>Cab Info</th>
                            </tr>
                        </thead>

                        <tbody className="yardtbbd">
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

                            {!isLoading && !isError.status && yardfaclData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                        {yardfaclData.map((node, index) => (
                            <tr key={index}>
                                <td>{node.radioMode}</td>
                                <td>{node.sysName}</td>
                                <td>{node.ipAddress}</td>
                                <td>{node.status}</td>
                                <td>{(linkData[node.nodeId] || []).length}</td>

                                {(linkData[node.nodeId] || []).map((item, i) => (
                                    <React.Fragment key={i}>
                                        {/* <td>{linkData[node.nodeId].length}</td> */}
                                        <td>
                                        <ul className="linkcablist">
                                            <li>{item.cabId} {item.sysName}</li>
                                        </ul>
                                        </td>
                                    </React.Fragment>
                                ))}
                            </tr>
                        ))}

                        </tbody>
                    </table>
                </article>
            </article>
        </>
    )
}


export default YardTbone;