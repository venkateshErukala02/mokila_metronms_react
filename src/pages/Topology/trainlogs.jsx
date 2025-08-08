import React, { useState, useEffect } from "react";


const TrainLogs = ({ trainId }) => {
    const [isLoading, setIsLoading] = useState(false);

    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [trainEventData, setTrainEventData] = useState('');
    const [trainlogsDt, setTrainLogsDt] = useState('');

    const getTrainEvents = async (url) => {
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
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(url, options);

            if (response.status === 204) {
                setIsLoading(false);
                setTrainEventData([]); // Treat as empty data
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setTrainEventData(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };


    const getTrainLogs = async (url) => {
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
                    'Accept': 'application/json'
                }
            };
            const response = await fetch(url, options);

            if (response.status === 204) {
                setIsLoading(false);
                setTrainLogsDt([]); // Treat as empty data
                return;
            }

            const data = await response.json();

            if (response.ok) {
                setIsLoading(false);
                setTrainLogsDt(data);
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("Data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(() => {
        let url = 'api/v2/events/list?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventUei%3D%3Duei.opennms.org%2Fnodes%2FnodeDown;eventCreateTime%3Dgt%3D1749104197612&ar=glob&limit=1000&offset=0&order=desc&orderBy=id'
        getTrainEvents(url);
    }, [trainId]);



    useEffect(() => {
        let url = `api/v2/treeview/logs/${trainId}`

        getTrainLogs(url);
    }, [trainId]);





    return (
        <>
            <article className="container-fluid">
                <article className="row">
                    <article className="col-6" style={{ paddingRight: '10px' }}>
                        <article className="sbcard-header">
                            Logs - Live Update
                            <button className="pausebtn">Pause</button>
                        </article>
                    </article>
                    <article className="col-6">
                        <article className="bound-card">
                            <article className="sbcard-header">
                                Alarms
                            </article>
                            {/* <h1>helo</h1> */}
                            <table className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12 bordeer-allsd" style={{ height: '90vh' }}>
                                <thead>
                                    <tr>

                                    </tr>
                                </thead>
                                <tbody className="clearfix tbone">


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

                                    {!isLoading && !isError.status && (!trainEventData || trainEventData.length === 0) && (
                                        <tr className="col-12 dashbdnodata">
                                            {/* <td colSpan="12" style={{ textAlign: "center",width:'100%' }}> */}
                                            No Data Available
                                            {/* </td> */}
                                        </tr>
                                    )}
                                    {trainEventData.event && trainEventData.event.map((event, index) => (
                                        <tr key={index} className="col-12">
                                            <td className="col-2">{event.host}</td>
                                            <td className="col-4" >{ }</td>
                                            <td className="col-5">{event.logMessage}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>


                            <article>

                            </article>
                        </article>
                    </article>
                </article>
            </article>

        </>
    )
}


export default TrainLogs;