import React, { useState, useEffect } from "react";

import LatencyChart from "./latencychart";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LocalSnr from "./localsnr";
import TxChart from "./localtxr";
import { useSelector } from "react-redux";
import AreaChart from "./samplechart";
import '../ornms.css';


const NetworkMonitoringDashboard = () => {
  const [gpItemDt, setGpItemDt] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState({ status: false, msg: "" });
  const [graphOption, setGraphOption] = useState('live');
  const [graphOptionValue, setGraphOptionValue] = useState('1l');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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

// const components = [<LatencyChart/>'']


const data = [
  { date: new Date('2024-01-01'), value: 100 },
  { date: new Date('2024-01-02'), value: 200 },
  { date: new Date('2024-01-03'), value: 150 },
  { date: new Date('2024-01-04'), value: 80 }
]



  return (
    <>
      <article style={{ marginTop: '20px' }}>
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
                          <LocalSnr graphOption={graphOption} graphOptionValue={graphOptionValue} />

              </article>
             
            </article>
            <article className="col-md-12 graphbord2" style={{marginTop:'25px'}}>
              <article className="latencyfullwidthcl">
                <TxChart graphOption={graphOption} graphOptionValue={graphOptionValue} />
              </article>
            </article>
          </article>
        </article>
        <article className="container-fluid" style={{ marginTop: '10px' }}>
          <article className="row">
            <article className="col-md-12 graphbord1" style={{marginTop:'25px'}}>
              <article className="latencyfullwidthcl">
              
               <LatencyChart graphOption={graphOption} graphOptionValue={graphOptionValue} />
              </article>
            </article>
            <article className="col-md-12">
              {/* <AreaChart data={data} graphOption={graphOption} graphOptionValue={graphOptionValue}/> */}
            </article>
          </article>
        </article>
      </article>
    </>
  );
};

export default NetworkMonitoringDashboard;
