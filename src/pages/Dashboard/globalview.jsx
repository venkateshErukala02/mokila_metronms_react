import React from "react";

import GdChart from "./scopepiechart";

import BsChart from "./scoperaidalchart";
import '../Dashboard/dashboard.css';


const GlobalView =({getAllRadialData})=>{

    const getDataStatus=(value,item)=>{
        getAllRadialData(value,item)
    }
    return(
        <>
        <article className="col-sm-3 col-md-3 col-lg-3 col-xl-3 col-xxl-3">
                            <GdChart getDataStatus={getDataStatus}/>
                        </article>
                        <article className="col-sm-9 col-md-9 col-lg-9 col-xl-9 col-xxl-9">
                            <BsChart getDataStatus={getDataStatus}/>
                        </article>
        </>
    )
}

export default GlobalView;