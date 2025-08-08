import React,{useState,useEffect} from "react";


const YardTbtwo=({textName})=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [yrdEventData, setYrdEventData] = useState('');


    const getYardEventData = async (url) => {
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

if (response.ok) {
    const text = await response.text();
    const data = text ? JSON.parse(text) : [];

    setYrdEventData(data || []);
    setIsLoading(false);
    setIsError({ status: false, msg: "" });
    console.log('Fetched data:', data);
} 
// else {
//     throw new Error("Data not found");
// }

            // const data = await response.json();
            // //   console.log('llol',response)
            // if (response.ok) {
            //     setIsLoading(false);
            //     setYrdEventData(data || []);
            //      console.log('lpll  ',data)
            //     setIsError({ status: false, msg: "" });
            // }
             else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        const fetchData= async()=>{
           const url ='api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventUei%3D%3Duei.opennms.org%2Fnodes%2FnodeDown;eventCreateTime%3Dgt%3D1748926636365&ar=glob&limit=1000&offset=0&order=desc&orderBy=id';
             
            await getYardEventData(url);
        }
       
        fetchData();
    },[textName])

    return(
        <>
           <article className="row">
                <article className="border-allsd" style={{ minHeight:'205px',maxHeight:'205px',overflowY:'auto'}}>
                    <table className="col-12">

                        <thead className="yardtb">
                            <tr>
                                <th>
                                    Ip Address</th>
                                <th>Time</th>
                                <th>Severity</th>
                                <th>Message</th>
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

                            {!isLoading && !isError.status && yrdEventData.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                                yrdEventData.length > 0 &&
                                yrdEventData.map((node, index) => (
                                    <tr key={index}>
                                        <td>{node.sysName}</td>
                                        <td>{node.ipAddress}</td>
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


export default YardTbtwo;