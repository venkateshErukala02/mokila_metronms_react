import React,{useState,useEffect} from "react";


const YardTbone=({textName,yardfacilitieData})=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [linkData,setLinkData] = useState({});
    const [sortedData, setSortedData] = useState([]); 
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortField, setSortField] = useState('status');


    useEffect(() => {
    setSortedData(yardfacilitieData);
  }, [yardfacilitieData]);

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

  



    // useEffect(()=>{
    //     if (!textName?.data) return;
  
    //     let url = "";
    //     if(textName.data.display === 'davisville_track' || textName.data.display ==='wilson_track'){
    //         url = `api/v2/dashboard/filternodes?ar=yard_1&facilities=${textName.data.display}&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
    //     }else{
    //         url = `api/v2/dashboard/filternodes?ar=yard_1&facilities=davisville_track&state=up&offset=1&limit=45&status=active&sort=productcode&by=desc`;
    //     }

    //     getYardEventData(url);

    // },[textName]);

    useEffect(() => {
    const fetchData = async () => {
        console.log("yardfacilitieData = ", yardfacilitieData);

        if (!yardfacilitieData || yardfacilitieData.length === 0) {
            console.log("No data — loop skipped");
            return;
        }

        for (const node of yardfacilitieData) {
            console.log("Looping node:", node);
            // const url = `api/v2/nodelinks/linkstatstest?nodeId=0`; // test API
            const url = `api/v2/nodelinks/linkstats?nodeId=${node.nodeId}`; // working API
            await getYardLinkData(url, node.nodeId);
        }
    };

    fetchData();
}, [yardfacilitieData]);

 useEffect(() => {
        window.scrollTo(0, 0);  
    }, [textName?.data?.display,yardfacilitieData]); 

  

    const ipToArray = (ip) => ip.split('.').map(num => parseInt(num, 10));

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; 
    setSortOrder(newSortOrder);
    setSortField(field); 

    const sortedArray = [...yardfacilitieData].sort((a, b) => {
      if (field === 'status') {
        const statusOrder = { 'up': 1, 'down': 0 };
        return (statusOrder[a.status] - statusOrder[b.status]) * (newSortOrder === 'asc' ? 1 : -1);
      }

      if (field === 'ipAddress') {
        const ipA = ipToArray(a.ipAddress);
        const ipB = ipToArray(b.ipAddress);
        for (let i = 0; i < ipA.length; i++) {
          if (ipA[i] !== ipB[i]) {
            return (ipA[i] - ipB[i]) * (newSortOrder === 'asc' ? 1 : -1);
          }
        }
        return 0;
      }

      if (field === 'connectedTo') {
        return a.connectedTo.localeCompare(b.connectedTo) * (newSortOrder === 'asc' ? 1 : -1);
      }

      return 0; 
    });

    setSortedData(sortedArray); 
  };
  

    return(
        <>
           <article className="row">
                <article style={{ minHeight:'375px',maxHeight:'375px',overflowY:'auto'}}  id="yardTableContainer">
                    <table className="col-12 border-allsd table-fixed failtagtbl" style={{ height: '0vh' }}>
                        <thead className="yardtb"> 
                            <tr>
                                <th>Location</th>
                                <th>System Name</th>
                                <th onClick={() => handleSort("ipAddress")}>Primary IP</th>
                                <th onClick={() => handleSort("status")} >Status</th>
                            
                                <th>	Connected cabs </th>
                                <th style={{paddingLeft:'25px'}}>Cab Info</th>
                            </tr>
                        </thead>

                        <tbody className="yardtbbd">
                            {isLoading && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {isError.status && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center", color: "red" }}>
                                        {isError.msg}
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError.status && yardfacilitieData?.length === 0 && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                        {!isLoading &&
                                !isError.status &&
                                yardfacilitieData?.length > 0 && yardfacilitieData
                                .filter(node => node.type.includes('AP') || node.type.includes('SN')) 
                                .map((node, index) => (
                            <tr key={index}>
                                <td>{node.connectedTo}</td>
                                <td>{node.systemName}</td>
                                <td>{node.ipAddress}</td>
                                <td>{node.status}</td>
                                <td>{(linkData[node.nodeId] || []).length}</td>
                                     <td>
                                    {(linkData[node.nodeId] || []).length > 0 ? (
                                        <ul className="linkcablist">
                                        {linkData[node.nodeId].map((item, i) => (
                                            <li key={i}>
                                                <span>{item.traincab}</span>
                                            <h6>{item.cabId} {item.sysName}</h6>
                                            </li>
                                        ))}
                                        </ul>
                                    ) : (
                                        <span></span>
                                    )}
                                    </td>
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