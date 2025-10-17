import React,{useState,useEffect} from "react";
import TopoSectionTable from "./toposectiontable";
import '../ornms.css';
import '../Topology/topology.css';
import SouthBoundTb from "./southboundtb";
import NorthBoundTb from "./northboundtb";
import StationTagsTable from "../Wayside/stationtagstable";


const StationNodeTableView=({textName , rdDataRef})=>{
    // const lineName= textName.text
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
                    <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                       <TopoSectionTable textName={textName}/>
                    </article>
                    <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                        {/* <article className={textName.data.mode !== 'facility' ? 'dis-none' : 'dis-blck'}>
                        <SouthBoundTb textName={textName}/>
                        <NorthBoundTb textName={textName}/>
                        </article> */}
                        <StationTagsTable rdDataRef={rdDataRef} />
                </article>  
            </article>
          </article>
        </>
    )
}


export default StationNodeTableView;

