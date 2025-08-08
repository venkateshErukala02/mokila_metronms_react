import React,{useState,useEffect} from "react";
import '../ornms.css';
import gif from '../../assets/img/progress.gif'
import './../Discovery/discovery.css';





const SummaryTable=()=>{
     const [summaryDatatb, setSummaryDatatb] = useState({});
        const [isLoading, setIsLoading] = useState(false);
        const [isError, setIsError] = useState({ status: false, msg: "" });

    const getDatasummarytb = async () => {
          setIsLoading(true);
          setIsError({ status: false, msg: "" });
          try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const url='api/v2/dtask/list?_s=&limit=25&offset=0&order=desc&orderBy=id';
           
      const options = {
        method: "GET", 
        headers: {
          'Authorization': `Basic ${token}`,
          "Content-Type": "application/json",
      },

      };
            const response = await fetch(url, options);
            if (response.status === 204) {
                setIsLoading(false);
                setSummaryDatatb([]); // Treat as empty data
                return;
            }
            const data = await response.json();
    //       console.log('summtbb',data.list)
            if (response.ok) {
              setIsLoading(false);
              setSummaryDatatb(data);
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
           getDatasummarytb();
          //  const intervalId = setInterval(() => {
          //   getDatasummarytb();
          //   }, 5000); 
    
          //   return () => clearInterval(intervalId);
        }, []);
   

    return(
        <>
         <article className="row border-tlr custom-row" style={{ margin: '5px 0px 0 5px' }}>
              <article className="col-5">
                <button className="clearfix arrowlf">
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button className="clearfix numcl"><span>1</span></button>
                <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
              </article>
              <article className="col-7">
                <article style={{ float: 'right' }}>
                  <select className="form-controlfirm" value="select" style={{ width: "auto" }} aria-invalid="false">
                    <option value="0" label="100">100</option>
                    <option value="1" selected="selected" label="200">200</option>
                    <option value="2" label="300">300</option>
                    <option value="3" label="400">400</option>
                  </select>
                </article>
              </article>
            </article>
            <article className="clearfix border-allsd summarytbscroll" style={{margin: '0px 0px 0px 5px'}}>
              <article className="row">
                <table className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <thead className="distbtwo tableheadpost">
                    <tr>
                      <th>Time</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Status</th>
                      <th>ICMP</th>
                      <th>SNMP</th>
                    </tr>
                  </thead>
                  <tbody className="distbbdtwo">
                  {/* {isLoading && (
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

                        {!isLoading && !isError.status && summaryDatatb.list === null && (
                            <tr>
                                <td colSpan="12" style={{ textAlign: "center" }}>
                                    No Data Available
                                </td>
                            </tr>
                        )}
                    {summaryDatatb.list && summaryDatatb.list.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.start}</td>
                        <td>{item.end}</td>
                        <td>{item.status}</td>
                        <td>{item.icmp}</td>
                        <td>{item.snmp}</td>

                      </tr>
                    ))} */}


  {isLoading ? (
    <tr>
      <td colSpan="6" style={{ textAlign: "center", padding: "50px 0" }}>
        {/* <img src={gif} alt="Loading..." style={{ height: '40px' }} /> */}
      </td>
    </tr>
  ) : isError.status ? (
    <tr>
      <td colSpan="6" style={{ textAlign: "center", color: "red" }}>
        {isError.msg}
      </td>
    </tr>
  ) : summaryDatatb.list && summaryDatatb.list.length > 0 ? (
    summaryDatatb.list.map((item) => (
      <tr key={item.id}>
        <td>{item.date}</td>
        <td>{item.start}</td>
        <td>{item.end}</td>
        <td>{item.status}</td>
        <td>{item.icmp}</td>
        <td>{item.snmp}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="6" style={{ textAlign: "center" }}>
        No Data Available  

      </td>
    </tr>
  )}


                    
                  </tbody>
                </table>
              </article>
            


            </article>
        </>
    )
}

export default SummaryTable;