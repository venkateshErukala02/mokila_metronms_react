import React,{useState,useEffect} from "react";
import '../ornms.css'
import SnmpSubDefaultCont from "./snmpsubdefaultpage";
import './../Settings/settings.css';
import SnmpSubNewconfigCont from "./snmpsubnewconfigpage";

const SnmpContainer=()=>{
        const [profileStatusNewconfigCont, setProfileStatusNewconfigCont] = useState(false);
        const [profileStatusDefCont,setProfileStatusDefCont] = useState(true);
        const [snmpData, setSnmpData] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editSnmp,setEditSnmp] = useState(null);
        const [mode,setMode] = useState(null);
        const [profileStatusTableCont, setProfileStatusTableCont] =useState(true);

        const SNMP_URL = 'api/v2/nodelinks/snmpconfig?begin=&end=';

        
        const getSnmpData = async (url) => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
            try {
                const username = 'admin';
                const password = 'admin';
                const token = btoa(`${username}:${password}`)
                const options = {
                    method: "GET",
                    headers: {
                        'Authorization': `Basic ${token}`,
                        "Content-Type": "application/json",
                    },
    
                };
                const response = await fetch(url, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsLoading(false);
                    setSnmpData(data.definition);
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
            // const url = 'api/v2/nodelinks/snmpconfig?begin=&end='
            // const url='api/v2/nodelinks/snmpconfig?begin=&end='
            getSnmpData(SNMP_URL);
    
        }, []);

       


    const handleProfileContopen = () => {
        setProfileStatusNewconfigCont(true);
        setProfileStatusDefCont(false);
        setProfileStatusTableCont(true);
        setEditSnmp(null);
        setMode('create');

    }

    const handleSubDefaultContainer=()=>{
        setProfileStatusNewconfigCont(false);
        setProfileStatusTableCont(false);
    }

    const handleSubNewconfigContainer=()=>{
       setProfileStatusNewconfigCont(false);
    setProfileStatusDefCont(true);
    setEditSnmp(null);
    setMode('create');
    }

    const handleEditSnmpDt=(item)=>{
        setEditSnmp(item);
        setMode('edit');
        setProfileStatusNewconfigCont(true);
        setProfileStatusDefCont(false);

    }



 
    return(
        <>
          <article className="row">
          <article className={profileStatusTableCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8 ">
                                   <article className="p-lr">
                                   <button className="clearfix createbtn" onClick={()=>getSnmpData(SNMP_URL)}>Reload</button>
                                   </article>
                                </article>
                                <article className="col-4">
                                    <article className="p-lr" style={{ float: 'right' }}>
                                    <button className="clearfix createbtn" onClick={handleProfileContopen}>Create</button>
                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '50vh' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb">
                                        <tr>
                                        <th>SNMP Version </th>
                                            <th>Begin Address </th>
                                            <th>End Address </th>
                                            <th>Read Community	</th>
                                            <th>Write Community	</th>
                                          
                                            <th>Edit</th>
                                        </tr>

                                    </thead>
                                    <tbody className="settingbdtb">
                                    {isLoading && (
                                        <tr>
                                            <td colSpan="8" style={{ textAlign: "center" }}>
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

                                    {!isLoading && !isError.status && (!snmpData || snmpData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {snmpData && snmpData.map((item) => (
                                        <tr key={item.id}>
                                             <td>{item.version}</td>
                                            <td>{item.begin}</td>
                                            <td>{item.end}</td>
                                            <td>{item.readCommunity}</td>
                                            <td>{item.writeCommunity}</td>
                                            <td><i className="fas fa-edit" onClick={()=>handleEditSnmpDt(item)}></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusDefCont ? 'col-4' : 'collapsed'} >
                        <SnmpSubDefaultCont handleSubDefaultContainer={handleSubDefaultContainer}/>
                    </article> 
                    <article className={profileStatusNewconfigCont ? 'col-4' :  'collapsed' } >
                        <SnmpSubNewconfigCont handleSubNewconfigContainer={handleSubNewconfigContainer} 
                        Snmp={editSnmp}
                        mode={mode}
                        refreshSnmpData={()=> getSnmpData(SNMP_URL)}
                        />
                    </article> 
                    </article>
        </>
    )
}

export default SnmpContainer;