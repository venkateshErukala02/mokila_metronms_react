import {useState,useEffect} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { handleNodeData, handlePreviousNodeselTree } from "../Action/action";


const StationNodesvgTable=({textName,yardfacilitieData,stationView, stationTagview,lineTagview,trainView, selectedTreeNodeId,expandedTreeDt})=>{
    const [sectionTbData,setSectionTbData] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [lineipText, setLineipText] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [searchBtn, setSearchBtn] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    //   const handleRowClick = (node) => {
    //     dispatch(handleNodeData(node))
    //           if (`${node.type}` === 'AP') {
    //               navigate('/SN-view')
                  
    //           } else {
    //               navigate(`/${node.type}-view`, { state: { node } });
    //           }
      
    //       };

    const handleRowClick = (node) => {
  const previousState = {
    textName,
    stationView,
    stationTagview,
    lineTagview,
    trainView,
    selectedTreeNodeId,
    expandedTreeDt
  };

  dispatch(handlePreviousNodeselTree(previousState));

  dispatch(handleNodeData(node));

  if (`${node.type}` === 'AP') {
    navigate('/SN-view', { state: { previousState } });
  } else {
    navigate(`/${node.type}-view`, {
      state: { node, previousState },
    });
  }
};

    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <button type="button" className="arrowlf">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <button type="button" className="numcl"><span>1</span></button>
                        <button type="button" className="arrowlf"><i className="fa-solid fa-arrow-right"></i></button>


                    </article>
                    <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                        <ul className="searchdashlist">
                            {/* <li>
                                <input name="" value={lineipText} onChange={(e) => setLineipText(e.target.value)} placeholder="IP Address / System Name / Serial Number" id="" className="form-control1 searchbar1" />
                                <button type="button" className="createbtn" onClick={() => {
                                    // const url = `api/v2/nodes/search?_s=assetRecord.serialNumber==${radialipText},sysName==${radialipText},label==${radialipText}&limit=${limitValueSelLabel}&offset=0&order=asc`;
                                    // handleRadialIP(url);
                                }}

                                    style={{ marginLeft: '7px' }}>Search</button>
                                <button type="button" className="createbtn" onClick='' style={{ marginLeft: '7px', display: searchBtn ? 'inline-block' : 'none' }}> Clear Search</button>

                            </li> */}
                            {/* <li>
                                <label htmlFor="" className="addcloum">Add Columns  <span className="glyphicon glyphicon-tasks"></span></label>
                            </li> */}
                        </ul>

                    </article>
                </article>  
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{overflowY:'auto',height:'23vh'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th>System Name</th>
                                <th>Primary IP</th>
                                <th>Device Type</th>
                                <th>Status</th>
                                <th>Position</th>
                            </tr>
                        </thead>

                        <tbody className="tbbdtwo">
                            {isLoading && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        Loading...
                                    </td>
                                </tr>
                            )}

                            {isError.status && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center", color: "red" }}>
                                        {isError.msg}
                                    </td>
                                </tr>
                            )}

                            {!isLoading && !isError.status && yardfacilitieData?.length === 0 && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                                yardfacilitieData?.length > 0 &&
                                yardfacilitieData
                                .filter(node => !['obc', 'sta', 'ioc'].includes(node.type?.toLowerCase()))
                                .map((node, index) => (
                                    <tr key={index}>
                                        <td> <a href={`http://${node.ipAddress}`} target="_blank" rel="noreferrer">{node.systemName}</a></td>
                                        <td  className="highlightText"  onClick={() => handleRowClick(node)}>{node.ipAddress}</td>
                                        <td>{node.type}</td>
                                        <td>{node.status}</td>
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


export default StationNodesvgTable;

