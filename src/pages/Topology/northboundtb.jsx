import React,{useState,useEffect} from "react";
import '../ornms.css';
import '../Topology/topology.css';

const NorthBoundTb=({textName})=>{
    const [northData,setNorthData] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });

    const getNorthBoundTbData = async (url) => {
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
            const data = await response.json();
            //   console.log('llol',response)
            if (response.ok) {
                setIsLoading(false);
                setNorthData(data || []);


                // console.log('lpll',data)
                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsLoading(false);
            setIsError({ status: true, msg: error.message });
        }
    };

    useEffect(()=>{
        const fetchData= async()=>{
           const url =`api/v2/events/nb/station?_s=eventDisplay%3D%3DY;eventSource!%3Dsyslogd;eventCreateTime%3Dgt%3D1748520284118&fac=${textName.data.id}&limit=5&offset=0&order=desc&orderBy=id`;
             
            await getNorthBoundTbData(url);
        }
       
        fetchData();
    },[textName])


    return(
        <>
        <article style={{paddingLeft:"10px",marginTop:'10px'}}>
                        <article className="bound-card" style={{height:'25vh',overflowY:'auto'}}>
                      
                        <article className="trainevenhead">
                            North Bound
                            <article className="alarmiconsty">
                            <button className="sbarrow">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button className="sbarrow"><span>1</span></button>
                        <button className="sbarrow"><i className="fa-solid fa-arrow-right"></i></button>
                            </article>
                        </article>
                        </article>
                    </article>
        </>

    )
}

export default NorthBoundTb;