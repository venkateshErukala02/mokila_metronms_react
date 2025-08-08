import React,{useState,useEffect} from "react";
import TopoSectionTable from "./toposectiontable";
import '../ornms.css';
import '../Topology/topology.css';
import SouthBoundTb from "./southboundtb";
import NorthBoundTb from "./northboundtb";


const StationNodeTableView=({textName})=>{
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
                    <article className="col-sm-7 col-md-7 col-lg-7 col-xl-7 col-xxl-7">
                       <TopoSectionTable textName={textName}/>
                    </article>
                    <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
                        <article className={textName.data.mode !== 'facility' ? 'dis-none' : 'dis-blck'}>
                        <SouthBoundTb textName={textName}/>
                        <NorthBoundTb textName={textName}/>
                        </article>
                </article>  
            </article>
          </article>
        </>
    )
}


export default StationNodeTableView;

