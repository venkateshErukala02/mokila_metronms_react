import React, { useState, useEffect } from "react";

import LatencyChart from "./latencychart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocalSnr from "./localsnr";
import TxChart from "./localtxr";
import { useSelector } from "react-redux";
import TxRxDiffchart from "./txandrxchart";
import TxErrorChart from "./txerrorchart";
import CpuChart from "./cpuchart";


const ObcGraphs = () => {
  const [gpItemDt, setGpItemDt] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [graphOption, setGraphOption] = useState('live');
  const [graphOptionValue, setGraphOptionValue] = useState('1l');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cpuChartStatus,setCpuChartStatus] = useState(true);
  const [opacity, setOpacity] = React.useState({
    uv: 1,
    pv: 1,
  }); 

    const nodeDataId = useSelector((state) => state.node.node.nodeId);
     const nodeIp = useSelector((state) => state.node.node.ipAddress);


  const handleGraphopt = (value, numb) => {
    setGraphOption(value);
    setGraphOptionValue(numb);
  }
const handleDate=()=>{
if(startDate && endDate !== null){
  const stDate = Date.parse(startDate);
  const edDate = Date.parse(endDate);
  setGraphOption('custom');
  setGraphOptionValue(`1c&start=${stDate}&end=${edDate}`);
  setStartDate('');
  setEndDate('');
}  
}

const handleCpuchart=()=>{
  setCpuChartStatus(prevStatus => !prevStatus)
}

// const components = [<LatencyChart/>'']


  return (
    <>
      <article style={{ marginTop: '15px' }}>
        <article className="container-fluid">
          <article className="row">
            <article className="col-md-3">
              <div className="btn-group" data-toggle="buttons" style={{ marginLeft: '100px', marginBottom: '10px' }}>
                <label className={`btngrphopt ${graphOption === 'live' ? 'active' : ''}`} onClick={() => handleGraphopt('live','1l')} role="button" tabindex="0">

                  Live
                </label>
                <label className={`btngrphopt ${graphOption === 'onehour' ? 'active' : ''}`} onClick={() => handleGraphopt('onehour', '1h')} role="button" tabindex="0">
                  1 Hour </label>
                <label className={`btngrphopt ${graphOption === 'oneday' ? 'active' : ''}`} onClick={() => handleGraphopt('oneday', '1d')} role="button" tabindex="0">
                  1 Day </label>
                <label className={`btngrphopt ${graphOption === 'oneweek' ? 'active' : ''}`} onClick={() => handleGraphopt('oneweek', '1w')} role="button" tabindex="0">
                  1 Week </label>
                <label className={`btngrphopt ${graphOption === 'onemonth' ? 'active' : ''}`} onClick={() => handleGraphopt('onemonth', '1m')} role="button" tabindex="0">
                  1 Month </label>
              </div>
            </article>
            <article className="col-md-3">
              <article className="flex-row">
                <article className="container-fluid">
                  <article className="row">
                    <label htmlFor="" className="col-md-4">Start Date:</label>
                    <article className="col-md-7" style={{ position: 'relative' }}>
                      <DatePicker
                        selected={startDate}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm"
                        onChange={(date) => setStartDate(date)} />
                    </article>
                  </article>
                </article>
              </article>
            </article>
            <article className="col-md-3">
              <article className="flex-row">
                <article className="container-fluid">
                  <article className="row">
                    <label htmlFor="" className="col-md-4">End Date:</label>
                    <article className="col-md-7">
                      <DatePicker
                        selected={endDate}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd HH:mm"
                        onChange={(date) => setEndDate(date)} />
                    </article>
                  </article>
                </article>
              </article>
            </article>
            <article className="col-md-3">
              <button className="createbtn" type="submit" onClick={handleDate}>Custom</button>
            </article>
          </article>
        </article>
      </article>
      <article>
      </article>
      <article>
        <article className="container-fluid">
          <article className="row">
            <article className="col-md-12 graphbord1">
              <article className="latencyfullwidthcl">
                <TxRxDiffchart currentTab='obc' graphOption={graphOption} graphOptionValue={graphOptionValue}/>
              </article>
            </article>
              <article className="col-md-12" style={{marginTop:'20px'}}>
                 <article className="latencyfullwidthcl graphbord2">
                 <TxErrorChart currentTab='obc' graphOption={graphOption} graphOptionValue={graphOptionValue}/>     
                 </article>
                </article>
             </article>
            </article>
                 <article className="col-md-12" style={{marginTop:'20px'}}>
              <article className="latencyfullwidthcl">
                <article className="latency-togglebtn cpuart-highlight" style={{textAlign:'center'}}>
                   <span className={`${cpuChartStatus === true ? 'cpu-higlight': ''}`}>CPU </span><i class={`fa-solid fa-toggle-on ${cpuChartStatus === true ? 'fa-rotate-180' : ''} `} onClick={handleCpuchart}></i> <span className={`${cpuChartStatus === true ? '': 'cpu-higlight'}`}>Latency</span>
                  </article> 
              <article className="latencyfullwidthcl graphbord2">
                 {cpuChartStatus ? (<CpuChart currentTab='obc' graphOption={graphOption} graphOptionValue={graphOptionValue}/>) : (<LatencyChart graphOption={graphOption} graphOptionValue={graphOptionValue}/>)}      
                       </article>
                       </article>
                </article>
                </article>
    </>
  );
};

export default ObcGraphs;
