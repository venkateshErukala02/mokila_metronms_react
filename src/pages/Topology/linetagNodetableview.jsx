import {useState,useEffect} from "react";
import '../ornms.css';
import '../Topology/topology.css';
import StationNodesvgTable from "./stationnodessvgtable";


const LineNodeTableView=({textName , rdDataRef,yardfacilitieData,stationView, stationTagview,lineTagview,trainView, selectedTreeNodeId,expandedTreeDt})=>{
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });

 const displayData = (rdDataRef?.current ? rdDataRef?.current[0]?.tags : []);

  
    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12" style={{padding:'5px'}}>
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
                    </article>
                </article>  
                <hr className="dashbdhr" />
            </article>
            <article className="row">
                <article style={{overflowY:'auto',height:'47vh'}}>
                    <table className="col-12 border-allsd" style={{ height: '0vh' }}>

                        <thead className="tbtwo">
                            <tr>
                                <th>Tag</th>
                                <th>Location</th>
                                <th>Position</th>
                                <th>Status</th>
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

                            {!isLoading && !isError.status && (displayData?.length > 0 && Object.keys(displayData[0] || {}).length === 0) && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}
                             {(displayData?.length === 0) && (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Data Available
                                    </td>
                                </tr>
                            )}

                            {!isLoading &&
                                !isError.status &&
                               displayData?.length !== 0 && displayData?.map((node, index) => (
                                    <tr key={index}>
                                        <td>{node.tag}</td>
                                        <td>{node.location}</td>
                                        <td>{node.position}</td>
                                        <td>{node.status}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </article>
            </article>
                       <article>
                       </article>
                </article>  
            </article>
          </article>
        </>
    )
}


export default LineNodeTableView;

