import { faL } from "@fortawesome/free-solid-svg-icons";
import React,{useState,useEffect, useMemo} from "react";
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const YardTbone=({textName,yardfacilitieData,yardData})=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [linkData,setLinkData] = useState({});
    const [sortedData, setSortedData] = useState([]); 
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [sortField, setSortField] = useState('');

   const dataToUse = (yardfacilitieData && yardfacilitieData.length > 0) 
    ? yardfacilitieData 
    : (yardData && yardData.length > 0 ? yardData : []);

      const getYardLinkData = async (url, nodeId,signal) => {
        try {
            // setIsLoading(true); 
            const response = await fetch(url, {
                method: "GET",
                signal, 
                headers: {
                    // 'Authorization': `Basic ${btoa('admin:admin')}`
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
              if (error.name === "AbortError") {
                console.log("Request aborted for", nodeId);
                return;
            }
            setIsError({ status: true, msg: error.message });
        } 
    };


     useEffect(() => {
         const controller = new AbortController();
        const signal = controller.signal;

    const fetchData = async () => {

        if (!dataToUse || dataToUse.length === 0)  return;
        setSortedData([...dataToUse]);
        for (const node of dataToUse) {
             if (signal.aborted) return;
            // const url = `api/v2/nodelinks/linkstatstest?nodeId=0`; // test API
            const url = `api/v2/nodelinks/linkstats?nodeId=${node.nodeId}`; // working API
            await getYardLinkData(url, node.nodeId,signal);
        }
    };
    fetchData();

     return () => {
        controller.abort(); 
    };

}, [dataToUse]);

    useEffect(() => {
        setSortField('');
        setSortedData([]);
    }, [textName?.data?.display]);

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
        window.scrollTo(0, 0);  
    }, [textName?.data?.display,dataToUse]); 

  

    const ipToArray = (ip) => ip.split('.').map(num => parseInt(num, 10));

  const handleSort = (field) => {
    const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; 
    setSortOrder(newSortOrder);
    setSortField(field); 

    const sortedArray = [...dataToUse].sort((a, b) => {
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
        const aConnectedCount = (linkData[a.nodeId] || []).length;
        const bConnectedCount = (linkData[b.nodeId] || []).length;
        
        return (aConnectedCount - bConnectedCount) * (newSortOrder === 'asc' ? 1 : -1);
      }
      if (field === 'systemName') {
      return a.systemName.localeCompare(b.systemName) * (newSortOrder === 'asc' ? 1 : -1);
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
                                <th onClick={() => handleSort("systemName")}>System Name <FontAwesomeIcon 
                                        icon={sortField === 'systemName' ? (sortOrder === 'asc' ?  faSortDown : faSortUp) : faSort} 
                                       style={{ color: sortField === 'systemName' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                    /></th>
                                <th onClick={() => handleSort("ipAddress")}>Primary IP<FontAwesomeIcon 
                                        icon={sortField === 'ipAddress' ? (sortOrder === 'asc' ?  faSortDown : faSortUp) : faSort} 
                                       style={{ color: sortField === 'ipAddress' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                    /></th>
                                <th onClick={() => handleSort("status")} >Status <FontAwesomeIcon 
                                        icon={sortField === 'status' ? (sortOrder === 'asc' ?  faSortDown : faSortUp) : faSort} 
                                       style={{ color: sortField === 'status' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                    /></th>
                            
                                <th onClick={() => handleSort("connectedTo")}>	Connected cabs <FontAwesomeIcon 
                                        icon={sortField === 'connectedTo' ? (sortOrder === 'asc' ?  faSortDown : faSortUp) : faSort} 
                                       style={{ color: sortField === 'connectedTo' && (sortOrder === 'asc' || sortOrder === 'desc') ? 'black' : '#D7D7D7' }} 
                                    /></th>
                                <th style={{paddingLeft:'25px'}}>Cab Info</th>
                            </tr>
                        </thead>

                        <tbody className="yardtbbd">
                            {isLoading &&(
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

                            {!isLoading && !isError.status && sortedData?.length === 0 && (
                                <tr>
                                    <td colSpan="12" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                        {!isLoading &&
                                !isError.status &&
                                sortedData?.length > 0 && sortedData
                                .filter(node => node.type.includes('AP') || node.type.includes('SN')) 
                                .map((node, index) => (
                            <tr key={index}>
                                <td style={{paddingLeft:"12px"}}>{node.connectedTo}</td>
                                <td>{node.systemName}</td>
                                <td>{node.ipAddress}</td>
                                <td style={{paddingLeft:"16px"}}>{node.status}</td>
                                <td style={{paddingLeft:"52px"}}>{(linkData[node.nodeId] || []).length}</td>
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