import React, { useEffect, useState } from "react";
import '../ornms.css'
import './../Settings/settings.css';


const LineSubCont = ({ handleSubContainer,refreshLineData,mode,line }) => {

    const isEditMode = mode === 'edit';

    const [lineName, setLineName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleProfileContclose = () => {
        handleSubContainer(lineName)
    }

    const handleAddLine = async () => {
        if (!lineName) {
            alert("Please fill the field.");
            return;
        }
        const requestBody = isEditMode ? {
            id: line.id,
            name: lineName,
            type:0

        }: {
            name: lineName,
            type: 0
        };

        const method = isEditMode ? 'PUT':"POST";
        const url = isEditMode ? `api/v2/regions/${line.id}` :'api/v2/regions'
        try {
            const username ='admin';
            const password = 'admin';
            const token= btoa(`${username}:${password}`);
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization' : `Basic ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });
            if (response.ok) {
                // setSuccess('Discovery started successfully');
                alert('Discovery started successfully');
                handleProfileContclose();
                if (refreshLineData) refreshLineData();
                setLineName('')
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }

    }

    useEffect(()=>{
        if(isEditMode && line){
            setLineName(line.name || '');
        }else{
            setLineName('');
        }
    },[mode,line])

    return (

        <>
            <article>
                <article className="row border-tlr" style={{ margin: '0 0 0 5px' }}>
                    <article className="col-11">
                        <h1 className="regititle">Line</h1>
                    </article>
                    <article className="col-1">
                        <span><i className="fa fa-close noticlose" onClick={handleProfileContclose} role="button"></i></span>
                    </article>
                </article>
                <article className="clearfix border-allsd" style={{ margin: '0 0 0 5px' }}>
                    <article >
                        <form action="" style={{ margin: '7px 10px 0 10px' }}>
                            <label className="settinglabelsub">Line Name</label>
                            <input type="text"
                                value={lineName}
                                required
                                onChange={(e) => setLineName(e.target.value)}
                                name="" placeholder="" id="" className="settinglabelsubinp" />
                            <article className="uploadcont">
                                <p className="notepara">Note:</p>
                                <ul className="clearfix notelist">
                                    <li>
                                    Special characters single quote(') and space are not allowed
                                    </li>
                                    <li>A maximum of 32 characters can be added</li>
                                </ul>
                                <hr className="hrnote" />
                                <center className="d-f">
                                    <button className="cancelbtn" onClick={handleProfileContclose}>Cancle</button>
                                    <button className="creatsetingbtn" onClick={handleAddLine}>
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

export default LineSubCont;