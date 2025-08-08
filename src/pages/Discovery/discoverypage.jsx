import React, { useState } from "react";
import '../ornms.css';
import SumBarChart from './provisionfileup';
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import SummaryTable from "./summaryTable";
import DiscovContai from "./discoveryContainer";
import ProvisionTb from "./provisiontb";
import ProvisionContainerDis from "./provisionContainer";
import './../Discovery/discovery.css';
import ProvisionFileUp from "./provisionfileup";







const DiscovPag = () => {
  const isVisible = useSelector(state => state.visibility.isVisible);
 const [proviContdata,setProviContdata] = useState([]);
 const [isProvisioned, setIsProvisioned] = useState(false);


const getProviContData=(data)=>{
  setProviContdata(data);
}
const getCloseProviCont=()=>{
  setProviContdata('');
}

  return (
    <>
      <article className="display-f">
      <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
            <LeftNavList  className='leftsidebar'/>
            </article>
            <article className="container-fluid">
         <article className="row">
          <article className='col-sm-8 col-md-8 col-lg-8 col-xl-8 col-xxl-8' >
            <DiscovContai />
            <article>
          <ProvisionTb getProviContData={getProviContData}/>

            </article>


          </article>
          <article className="col-sm-4 col-md-4 col-lg-4 col-xl-4 col-xxl-4">
            <article className="clearfix summarycont" style={{ margin: '5px 0px 0 5px' }}>
              <h1 className="dicoveryheading">Provision</h1>
              <article className="clearfix provscont">
                <ProvisionFileUp />
              </article>
            </article>
          

{
  isProvisioned 
    ? <SummaryTable /> 
    : proviContdata && proviContdata.length > 0 
      ? <ProvisionContainerDis 
          proviContdata={proviContdata} 
          getCloseProviCont={getCloseProviCont} 
          setIsProvisioned={setIsProvisioned}
        /> 
      : <SummaryTable />
}


          </article>
        </article>
      </article>
      </article>
    </>


  )
}

export default DiscovPag;