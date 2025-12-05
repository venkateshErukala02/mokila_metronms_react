import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../ornms.css'
import '../Dashboard/dashboard.css';
import { handleNodeData } from "../Action/action";



const FirmwarePopupTable = ({ currentTagid,firmpopupData }) => {
    const [rdData, setRdData] = useState([]);
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');

     const firmData = firmpopupData || {}; 
    const taskDetails = firmData.taskDetails || [];

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
            <article style={{ height: "108px" ,overflow:'auto'}}>
                <table className="col-12 border-allsd table-fixed" style={{ height: '0vh' }}>
                    <thead className="firmpopuptbtwo">
                        <tr>
                            <th style={{width:'156px'}}>Device IP</th>
                            <th style={{width:'156px'}}>Status</th>
                            <th>Reason</th>
                        </tr>
                    </thead>

                    <tbody className="firmpopuptbbdtwo">
                        {isLoading && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>Loading...</td>
                            </tr>
                        )}

                        {isError.status && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center", color: "red" }}>
                                    {isError.msg}
                                </td>
                            </tr>
                        )}
                         {!isLoading && !isError.status && taskDetails.length === 0 && (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>
                                    No Data Available
                                </td>
                            </tr>
                        )}

                        {taskDetails.length > 0 && taskDetails.map((item, index) => (
                            <tr key={index}>
                                <td>{item.deviceIP}</td>
                                <td>{item.status}</td>
                                <td>{item.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </article>
        </article>
        </>
    )
}


export default FirmwarePopupTable;