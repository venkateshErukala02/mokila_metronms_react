import {useState,useEffect} from "react";
import '../ornms.css';
import '../Topology/topology.css';
import SouthBoundTb from "./southboundtb";
import NorthBoundTb from "./northboundtb";
import StationNodesvgTable from "./stationnodessvgtable";
import StationTagsTable from "../Wayside/stationtagstable";


const StationNodeTableView=({textName , rdDataRef,yardfacilitieData,stationView, stationTagview,lineTagview,trainView, selectedTreeNodeId,expandedTreeDt,onSortChange,lineName,isLoading,stationIdFromSvg})=>{
    const [sectionTbData,setSectionTbData] = useState('');
    const [limitValueSel, setLimitValueSel] = useState('');
    const [limitValueSelLabel, setLimitValueSelLabel] = useState('50');
    const [lineipText, setLineipText] = useState('')
    // const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState({ status: false, msg: "" });
    const [searchBtn, setSearchBtn] = useState("");
    const [boundsMode,setBoundsMode]=useState('SouthBound');

       const handleChange = (event) => {
        setBoundsMode(event.target.value);
        };
  
    return(
        <>
        <article className="piechtcont">
                <article className="row border-lrr">
                    <article className="col-sm-7 col-md-7 col-lg-7 col-xl-7 col-xxl-7" style={{padding:'5px'}}>
                       <StationNodesvgTable yardfacilitieData={yardfacilitieData} textName={textName} 
                       stationView={stationView}  stationTagview={stationTagview} lineTagview={lineTagview} trainView={trainView} selectedTreeNodeId={selectedTreeNodeId} 
                       expandedTreeDt={expandedTreeDt} lineName={lineName} isLoading={isLoading}/>
                       <article>
                       </article>
                        <StationTagsTable rdDataRef={rdDataRef} onSortChange={onSortChange}/>
                    </article>
                    <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5" style={{padding:'5px'}}>
                          <article className="border-tlr custom-row" style={{textAlign:'center'}}>

      <label className="radiolabel" style={boundsMode === 'SouthBound' ? {fontWeight:700,color:'#495057',marginRight:'10px'}:{marginRight:'10px'}}>
        <input
          type="radio"
          value="SouthBound"
          checked={boundsMode === 'SouthBound'}
          onChange={handleChange}
          className="radiobtn"
        />
        South Bound
      </label>

      <label className="radiolabel" style={boundsMode === 'NorthBound' ? {fontWeight:700,color:'#495057'}:{}}>
        <input
          type="radio"
          value="NorthBound"
          checked={boundsMode === 'NorthBound'}
          onChange={handleChange}
          className="radiobtn"
        />
        North Bound
      </label>
         
            </article>
                        {boundsMode !== 'NorthBound' ? ( <SouthBoundTb textName={textName} stationIdFromSvg={stationIdFromSvg}/>) : (  <article>
                             <NorthBoundTb textName={textName} stationIdFromSvg={stationIdFromSvg}/>
                        </article>) }
                </article>  
            </article>
          </article>
        </>
    )
}


export default StationNodeTableView;

