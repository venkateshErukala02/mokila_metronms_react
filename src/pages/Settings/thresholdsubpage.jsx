import React, { useState, useEffect } from "react";
import '../ornms.css'
import './../Settings/settings.css';
import { type } from "@testing-library/user-event/dist/type";


const ThresholdSubCont = ({ handleSubContainer, refreshThresholdData,threshold,mode }) => {

    const isEditMode = mode === 'edit';

    const [threshdDescription,setThreshdDescription] = useState('');
    const [threshdType,setThreshdType] =  useState('');
    const [threshdValue,setThreshdValue] = useState('');
    const [threshdRearm,setThreshdRearm] = useState('');
    const [threshdTrigger,setThreshdTrigger] =  useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
   

//    const url='api/v2/threshold/update/threshold/0';

   const handleAddThreshold = async () => {
    // if (!sectionName) {
    //     alert("Please select a file first.");
    //     return;
    // }
    const requestBody = {
            description : threshdDescription,
            'ds-label': threshold.item['ds-label'],
            'ds-name' : threshold.item['ds-name'],
            'ds-type': threshold.item['ds-type'],
            filterOperator: threshold.item.filterOperator,
            rearm:  threshdRearm,
            rearmedUEI: threshold.item.rearmedUEI,
            relaxed:threshold.item.relaxed,
            'resource-filter': threshold.item['resource-fliter'],
            trigger: threshdTrigger,
            triggeredUEI:threshold.item.triggeredUEI,
            type: threshdType,
            value:   threshdValue
    }

    let url= `api/v2/threshold/update/threshold/${threshold.index}`;
    try {
        const username = 'admin';
        const password = 'admin';
        const token = btoa(`${username}:${password}`)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        if (response.ok) {
            // setSuccess('Discovery started successfully');
            alert('Discovery started successfully')
            handleProfileContclose();
            if(refreshThresholdData) refreshThresholdData();
            // setSectionName('');
        } else {
            setIsError('Error starting discovery');
        }
    } catch (error) {
        console.error('Error:', error);
        setIsError('An error occurred while contacting the server.');
    } finally {
        setIsLoading(false); // Turn off loading state
    }

}


    const handleProfileContclose = () => {
        handleSubContainer()
    }
  

  useEffect(()=>{
    if( isEditMode && threshold.item){
        setThreshdDescription(threshold.item.description || '');
        setThreshdType(threshold.item.type || '');
        setThreshdValue(threshold.item.value || '');
        setThreshdRearm(threshold.item.rearm || '');
        setThreshdTrigger(threshold.item.trigger || '');
    }
  },[threshold,mode])


    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Threshold Configuration</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="clearfix border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Threshold Description</label>
                            <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                value={threshdDescription}
                                onChange={(e) => setThreshdDescription(e.target.value)}
                                required
                            />
                            <article>
                                <label className="settinglabelsub">Threshold Type</label>
                                <input type="text" name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={threshdType}
                                    onChange={(e) => setThreshdType(e.target.value)}
                                    required
                                />
                            </article>
                            <article>
                                <label className="settinglabelsub">Threshold Value</label>
                                <input
                                    type="text"
                                    className="settinglabelsubinp"
                                    value={threshdValue}
                                    required
                                    onChange={(e) => setThreshdValue(e.target.value)}
                                    />

                            </article>
                            <article>
                                <label className="settinglabelsub">Rearm</label>
                                <input type='text' name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={threshdRearm}
                                    required
                                    onChange={(e) => setThreshdRearm(e.target.value)}
                                />
                            </article>

                            <article>
                                <label className="settinglabelsub">Trigger Count</label>
                                <input type='text' name="" placeholder="" id="" className="settinglabelsubinp"
                                    value={threshdTrigger}
                                    required
                                    onChange={(e) => setThreshdTrigger(e.target.value)}
                                />
                            </article>

                 
                            <article className="uploadcont">
                                
                                <hr className="hrnote" />
                                <center className="d-f">
                                    <button className="cancelbtn">Cancle</button>
                                    <button type="button" className="creatsetingbtn" onClick={handleAddThreshold}>
                                       {isEditMode ? 'Update' :'Create'}
                                        </button>
                                </center>
                            </article>
                        </form>

                    </article>

                </article>
            </article>

        </>
    )
}

export default ThresholdSubCont;