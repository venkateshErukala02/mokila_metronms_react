import React from "react";
import SuChart from "../Analytics/suservicechart";
// import LeftNavList from "./leftnavlist";
import { Table } from "react-bootstrap";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';


const SuChDes= ()=>{
    const isVisible = useSelector(state => state.isVisible);

    return(

        <>
        <article className="display-f">
                  <LeftNavList/>
                  <article className="container-fluid">
                  <article className="row">
                <article className="col-sm-12 col-md-12 col-lg-12 col-xl-12 col-xxl-12">
                    <article className="border-allsd">
                    <SuChart/>
                    </article>
                    <article className="border-tlr" style={{height:'50vh'}}>
                        <article className="row custom-row">
                                    <article className="col-6">
                                        <button className="clearfix arrowlf">
                                            <i className="fa-solid fa-arrow-left"></i>
                                        </button>
                                        <button className="clearfix numcl"><span>1</span></button>
                                        <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>


                                    </article>
                                    <article className="col-6">
                                        <article style={{float:'right'}}>
                                        <ul className="searchdashlist">
                                            <li>
                                                <input name="" placeholder="IP Address / System Name / Serial Number" id="" className="form-controlanalytic" />
                                                <button className="clearfix createbtn" style={{ marginLeft: '10px' }}>Search</button>
                                            </li>
                                            <li>
                                                <label htmlFor="" className="addcloum">Add Columns  <span style={{marginTop:'2px'}} className="glyphicon glyphicon-tasks"></span></label>

                                                <select className="form-controll1" value="select" style={{ width: 'auto' }} aria-invalid="false">
                                                    <option value="0" label="50">50</option>
                                                    <option value="1" label="25" defaultValue={25}>25</option>
                                                    <option value="2" label="50">50</option>
                                                    <option value="3" label="100">100</option>
                                                </select>
                                            </li>
                                        </ul>
                                        </article>
                                    </article>
                        </article>

                        <article className="row border-allsd" style={{ height: '50vh' }}>
              <table className="col-12" style={{ height: '0vh' }}>
                <thead className="analyticthtb">
                <tr>
                            <th>System Name</th>
                            <th>Primary IP</th>
                            <th>MAC Address</th>
                            <th>Serial Number</th>
                            <th>Model Number</th>
                            <th>Firmware</th>
                            <th>Device Status</th>
                            <th>UpTime</th>
                            </tr>
                </thead>
                <tbody className="analyticbdtb">
                  
                    {/* {invData.node.length > 0 ? (
                            invData.node.map((event) => (
                                <tr key={event.id}>
                                    <td><input type="checkbox" className="incl"/></td>
                                    <td style={{width:"px"}}>{event.sysName}</td>
                                    <td style={{width:'px'}}>{event.ipConfig.ipAddress}</td>
                                    <td style={{width:''}}>{event.macAddress}</td>
                                    <td style={{width:''}}>{event.assetRecord.serialNumber}</td>
                                    <td style={{width:''}}>{event.assetRecord.modelNumber}</td>
                                    <td style={{width:''}}>{event.assetRecord.firmware}</td>
                                    <td style={{width:''}}>{formatTime(event.sysUptime)}</td>
                                    <td><i className="fa fa-sync"></i></td>
                                    <td><i className="fa fa-trash"></i></td>

                                </tr>
                            ))
                        ) : ( */}
                            <tr>
                    <td colSpan="11" style={{ textAlign: 'center' }}>
                    No Data
                    </td>

                  </tr>
                        {/* )} */}
                </tbody>
              </table>
            </article>
                       
    

                    </article>
                </article>
                </article>
            </article>
        </article>
        </>
       
    )
}

export default SuChDes;