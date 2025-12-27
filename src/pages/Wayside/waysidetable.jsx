import  { useState, useEffect } from "react";
import '../ornms.css'
import '../Dashboard/dashboard.css';



const WaysideTable = ({ westSideView, circleId, setShowPopup, showPopup,lineId,handleTagsPopup,stationCount,lineCount ,allTagfailCount,textName}) => {
    const [rdData, setRdData] = useState('');
    const [searchBtn, setSearchBtn] = useState(false);
    const [radialipText, setRadialipText] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('1');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [pageSize, setPageSize] = useState(1);
    const [fromValue, setFromValue] = useState('0');
    const [tagTypeValue, setTagTypeValue] = useState('all');
    const [tagTypeLabel,setTagTypeLabel] = useState('All');
    const [stationCodeData,setStationCodeData] = useState('');
   

    const fetchDataRadial = async (url,isInterval = false) => {
          if (!isInterval) {
        setIsLoading(true);
         }
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
            if (response.ok) {
                setRdData(data.tags || []);

                setIsError({ status: false, msg: "" });
            } else {
                throw new Error("data not found");
            }
        } catch (error) {
            setIsError({ status: true, msg: error.message });
        } finally {
        if (!isInterval) {
            setIsLoading(false);
        }
    }
    };
    const westLine = westSideView;


       const fetchStationCode = async (url) => {
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
            if (response.ok) {
                setIsLoading(false);
                setStationCodeData(data.codes) 
                setRdData(Array.isArray(data) ? data : [data]);
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
    let url = 'api/v2/wayside/codes';

    if (url) fetchStationCode(url);
}, []);

useEffect(() => {
    let url = '';
    if (westLine === 'Line1') {
        if (lineId) {
            url = `api/v2/wayside/linebytime?line=${lineId}&time=600`;
        } 
    } 

    if (url) fetchDataRadial(url);
}, [westLine, lineId,lineCount, pageSize, limitValueSelLabel]);



useEffect(() => {
    let url = '';
    if (westLine === 'Line1') {
        if (circleId) {
            url = `api/v2/wayside/failedbytime?station=${circleId}&time=600`;
        }
    } 

    if (url) fetchDataRadial(url);
}, [westLine, circleId,stationCount, pageSize, limitValueSelLabel]);




// useEffect(() => {
    
//         let url = '';
//         if (westLine === 'Line1') {
//             url = `api/v2/wayside/fetch?show=${tagTypeValue}&station=${stationNameVal}&time=1800&region=${textName.}`;
//         }
//         if (url) fetchDataRadial(url);

// }, []); 
useEffect(() => {
  if (!tagTypeValue || !textName) return; 

  const fetchIntervalData = () => {
     if (!tagTypeValue || !textName) return; 
    let url = `api/v2/wayside/fetch?show=${tagTypeValue}`;

    if (textName?.data?.mode === 'facility') {
      url += `&station=${textName.data.display}`;
    } else {
      url += '&station=all';
    }

    if (textName?.data?.mode === 'facility' || textName?.text ==='Global' ) {
        url += '&time=1800&region=all';     
    } else {
     url += `&time=1800&region=${textName.text}`;
    }

    fetchDataRadial(url, true);
  };

  fetchIntervalData();

  const intervalId = setInterval(fetchIntervalData, 30000);

  return () => clearInterval(intervalId);
}, [tagTypeValue, textName,allTagfailCount]); 

// useEffect(() => {

//     let url = 'api/v2/wayside/fetch?show=all&station=all&time=1800&region=all';
//     if(url){
//         fetchDataRadial(url, true);

//     }
// }, []); 


// useEffect(() => {
//      if (!tagTypeValue) return;

//     // const intervalId = setInterval(() => {
//         if (tagTypeValue !==  "") {
//             const url = `api/v2/wayside/fetch?show=${tagTypeValue}&station=${stationNameVal}&time=1800`;
//             fetchDataRadial(url);
//         }
//     // }, 30000); 

//     fetchDataRadial(`api/v2/wayside/fetch?show=${tagTypeValue}&station=${stationNameVal}&time=1800`);

//     // return () => clearInterval(intervalId);
// }, [ tagTypeValue]); 


    const handlePopup=(value,id)=>{
        handleTagsPopup(value,id)
    }


      const handleTagType = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setTagTypeValue(selectElement.value);
        setTagTypeLabel(label);
    }

   

    return (
        <>
          <h1 className="discoveryheading">Failed Tags</h1>
            <article className="">
                <article className="row border-lrr piechtcont">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button type="button" className="arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>1</span></button>
                        <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <article style={{float:'right',padding:'0 48px'}}>
                        <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Tag type :</label>
                                <select name="name" id="name" value={tagTypeValue} onChange={handleTagType} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    <option value="all" label="All">All</option>
                                   <option value="TDM" label="Tdm">Tdm</option>
                                   <option value="NTDM" label="Ntdm">Ntdm</option>
                                   <option value="ATC" label="Atc">Atc</option>
                                </select>
                                </article>
                    </article>
                </article>
            </article>
            <article className="row">
            <article
                style={{
                height: textName?.data?.mode === 'facility' ? '40.5vh' : '80vh',
                overflowY: "auto",
                border: "1px solid rgb(33 35 39 / 7%)",
                position: "relative"
                }}
            >
                <table className="col-12 table-fixed failtagtbl" style={{borderTop:'0'}}>
                <thead className="failtagthtb">
                    <tr>
                    <th>Tags</th>
                    <th>Time</th>
                    <th>Station Name</th>
                    <th>Position</th>
                    </tr>
                </thead>

                <tbody className="failtagtbbd">
                    {isLoading && (
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                        Loading...
                        </td>
                    </tr>
                    )}

                    {isError.status && (
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center", color: "red" }}>
                        {isError.msg}
                        </td>
                    </tr>
                    )}

                    {!isLoading && !isError.status && rdData.length === 0 && (
                    <tr>
                        <td colSpan="4" style={{ textAlign: "center" }}>
                        No Data Available
                        </td>
                    </tr>
                    )}

                    {!isLoading &&
                    !isError.status &&
                    rdData.length > 0 &&
                    rdData.map((node, index) => (
                        <tr key={index}>
                        <td
                            onClick={() => handlePopup(true, `${node.tag}`)}
                            style={{ cursor: "pointer", color: "#006eff" }}
                        >
                            {node.tag}
                        </td>
                        <td>{node.time}</td>
                        <td>{node.stationName}</td>
                        <td>{node.position}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </article>
            </article>

        </>
    )
}


export default WaysideTable;