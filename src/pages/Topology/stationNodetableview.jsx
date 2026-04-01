import {useState,useEffect} from "react";
import '../ornms.css';
import '../Topology/topology.css';
import SouthBoundTb from "./southboundtb";
import NorthBoundTb from "./northboundtb";
import StationNodesvgTable from "./stationnodessvgtable";


const StationNodeTableView=({textName , rdDataRef,yardfacilitieData,stationView, stationTagview,lineTagview,trainView, selectedTreeNodeId,expandedTreeDt})=>{
    const [sectionTbData,setSectionTbData] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [lineipText, setLineipText] = useState('')
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [searchBtn, setSearchBtn] = useState("");


  
    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6" style={{padding:'5px'}}>
                       <StationNodesvgTable yardfacilitieData={yardfacilitieData} textName={textName} 
                       stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} 
                       expandedTreeDt={expandedTreeDt}/>
                       <article>
                       </article>
                    </article>
                    <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6" style={{padding:'5px'}}>
                          <SouthBoundTb textName={textName}/>
                        <article>
                             <NorthBoundTb textName={textName}/>
                        </article>
                </article>  
            </article>
          </article>
        </>
    )
}


export default StationNodeTableView;

