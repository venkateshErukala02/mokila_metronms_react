import {useState,useEffect} from "react";
import '../ornms.css';
import gif from '../../assets/img/progress.gif'
import './../Discovery/discovery.css';


const SummaryTable=()=>{
    const [summaryDatatb, setSummaryDatatb] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue,setFromValue] =useState('0');
    const [summaryLimitValueSel, setSummaryLimitValueSel] = useState('25');

    const getDatasummarytb = async () => {
          setIsLoading(true);
          setIsError({ status: false, msg: "" });
          try {
            const username = 'admin';
            const password = 'admin';
            const token = btoa(`${username}:${password}`)
            const url=`api/v2/dtask/list?_s=&limit=${summaryLimitValueSel}&offset=${fromValue}&order=desc&orderBy=id`;
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
                setSummaryDatatb([]);
                return;
            }
            const data = await response.json();
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
           const intervalId = setInterval(() => {
            getDatasummarytb();
            }, 30000); 
    
            return () => clearInterval(intervalId);
        }, [summaryLimitValueSel,fromValue]);

    const handleIncreamentOffset = () => {
         setPageSize(prev => {
        if (!summaryDatatb || summaryDatatb.length === 0) return prev;

        const newPage = prev + 1;
        setFromValue(parseInt(newPage-1) * parseInt(summaryLimitValueSel));
        return newPage;
        });
    }

    const handleDecrementOffset = () => {
        if (pageSize > 1) {
            setPageSize(prevPageSize => {
                const newPageSize = prevPageSize - 1;
                const fromCal = (parseInt(newPageSize)-1) * parseInt(summaryLimitValueSel);
                 setFromValue(fromCal);
                return newPageSize;
            });
        } else {
            setPageSize(1);
            //   setFromValue('0');
        }
    }

    const handleSumaryLimitValue = (event) => {
          setPageSize(1);
          setFromValue('0');
            setSummaryLimitValueSel(event.target.value);
        }

    return(
        <>
         <article className="row border-tlr custom-row" style={{ margin: '5px 0px 0 5px' }}>
              <article className="col-5">
                <button type="button" className="arrowlf" onClick={handleDecrementOffset}>
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button type="button" className="numcl"><span>{pageSize}</span></button>
                <button type="button" className="arrowlf" onClick={handleIncreamentOffset}><i className="fa-solid fa-arrow-right"></i></button>
              </article>
              <article className="col-7">
                <article style={{ float: 'right' }}>
                  <select className="form-controlfirm" style={{ width: "auto" }} aria-invalid="false"  value={summaryLimitValueSel} onChange={handleSumaryLimitValue}>
                  <option value="25" label="25">25</option>
                  <option value="50" label="50">50</option>
                  <option value="100" label="100">100</option>
                  <option value="500" label="500">500</option>
                  </select>
                </article>
              </article>
            </article>
            <article className="border-allsd summarytbscroll" style={{margin: '0px 0px 0px 5px'}}>
              <article className="row">
                <table className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                  <thead className="distbtwo tableheadpostion"> 
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
                        <td style={{paddingLeft:"22px"}}>{item.icmp}</td>
                        <td style={{paddingLeft:"22px"}}>{item.snmp}</td>
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