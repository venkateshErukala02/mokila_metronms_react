import React,{useState,useEffect} from "react";
import '../ornms.css'
import LocationSubCont from "./stationsubpage";
import './../Settings/settings.css';
import ThresholdSubCont from "./thresholdsubpage";
import { useSelector } from "react-redux";

const ThresholdContainer=()=>{
        const [profileStatusCont, setProfileStatusCont] = useState(false);
        const [thresholdData, setThresholdData] = useState([]);
        const [thresholdLimitValueSel, setThresholdLimitValueSel] = useState('50');
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });
        const [editThreshold,setEditThreshold] = useState({item: null,index: null});
        const [mode,setMode]  = useState(null);
        const [reloadTable,setReloadTable] = useState(0);
        // const [reloadConfigDt,setReloadConfigDt] = useState([]);
        const[reloadConfig,setReloadConfig] =  useState();
        const currentUser = useSelector((state) => state?.loginuser?.node?.role);
        const isReadOnly = currentUser === 'Read-only';

        const getThresholdData = async (url) => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" });
            try {
                const options = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
    
                };
                const response = await fetch(url, options);
    
                const data = await response.json();
    
                if (response.ok) {
                    setIsLoading(false);
                    setThresholdData(data.thresholds);
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
            // const url = 'api/v2/threshold/list'
            const url='api/v2/threshold/list'
            getThresholdData(url);
    
        }, [reloadTable]);

        const handleThresholdLimitValue = (event) => {
            setThresholdLimitValueSel(event.target.value);
    
        }

    const handleSubContainer=()=>{
        setProfileStatusCont(false)
    }

    const handleEditThresholdDt=(item,index)=>{
        setEditThreshold({item:item,index:index});
        setMode('edit');
        setProfileStatusCont(true);
    }

    const handleReloadTable=()=>{
        setReloadTable(prev => prev + 1);
    }
        
        const handleReloadConfig=()=>{
            const url='api/v2/threshold/reload'
            getReloadConfigData(url);
        }

        const getReloadConfigData = async (url) => {
                // setIsLoading(true);
                // setIsError({ status: false, msg: "" });
                try {
                    const options = {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
        
                    };
                    const response = await fetch(url, options);
        
                    const data = await response.json();
        
                    if (response.ok) {
                        setIsLoading(false);
                        // setReload();
                        // setIsError({ status: false, msg: "" });
                    } else {
                        throw new Error("data not found");
                    }
                } catch (error) {
                    // setIsLoading(false);
                    // setIsError({ status: true, msg: error.message });
                }
            };

 
    return(
        <>
          <article className="row">
          <article className={profileStatusCont ? 'col-8' : 'col-12'}>
                        <article className="" style={{ height: '90vh' }}>
                            <article className="row custom-row border-tlr">
                                <article className="col-8">
                                    <article className="p-lr">
                                    <button className="createbtn" type="button" onClick={handleReloadTable}>Refresh Table</button></article>
                                </article>
                                <article className="col-4">
                                    <article className="p-lr" style={{ float: 'right' }}>
                                      
                                   <button className="createbtn" type="button" onClick={handleReloadConfig} >Reload Configuration</button>

                                    </article>
                                </article>
                            </article>

                            <article className="row border-allsd" style={{ height: '80vh',overflowY:'auto',overflowX: 'clip' }}>
                                <table className="col-12" style={{ height: '0vh' }}>
                                    <thead className="settingthtb tableheadpostion">
                                        <tr>
                                        <th>Name </th>
                                            <th>Type </th>
                                            <th>Value </th>
                                            <th>Rearm	</th>
                                            <th>Trigger Count</th>
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

                                    {!isLoading && !isError.status && (!thresholdData || thresholdData.length === 0) && (
                                        <tr>
                                            <td colSpan="12" style={{ textAlign: "center" }}>
                                                No Data Available
                                            </td>
                                        </tr>
                                    )}
                                    {thresholdData && thresholdData.map((item,index) => (
                                        <tr key={item.index}>
                                             <td>{item.description}</td>
                                            <td>{item.type}</td>
                                            <td>{item.value}</td>
                                            <td>{item.rearm}</td>
                                            <td>{item.trigger}</td>
                                            <td ><i className="fas fa-edit" onClick={currentUser !== 'Read-only' ?()=>handleEditThresholdDt(item,index): undefined}></i></td>
                                        </tr>
                                    ))}
                                       
                                    </tbody>
                                </table>
                            </article>
                        </article>
                    </article>

                    <article className={profileStatusCont ? 'col-4' : 'collapsed'} >
                        <ThresholdSubCont handleSubContainer={handleSubContainer} 
                        threshold={editThreshold}
                        mode={mode}
                        refreshThresholdData={()=> 
                        getThresholdData('api/v2/threshold/list')
                        }
                        />
                    </article> 
                    </article>
        </>
    )
}

export default ThresholdContainer;