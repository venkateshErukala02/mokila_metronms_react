import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import nodeimage from "../../assets/img/suinodeview.png";
import radioimage from "../../assets/img/radiomode.png";
import ptmplinkimage from "../../assets/img/PTMPlink.png";
import bootloader from "../../assets/img/bootloader.png";
import NetworkMonitoringDashboard from "./nodeviewchart";


const TrainSummaryTab = ({ nodeItemDt }) => {

  return (
    <>

      <article className="row">
        <article
          className="col-md-12"
          style={{ padding: "10px", backgroundColor: "#cccccc" }}
        >

          <article className="container-fluid">
            <article className="row" style={{ display: "flex" }}>
              <article className="col-md-2" id="summary-1 div1" style={{minHeight:'850px',maxHeight:'850px',background:'white'}}>
                <article>

                  <article className="card" id="div2">
                    <article style={{ margin: "auto", textAlign: 'center' }}>
                      <img className="nodeimg" src={nodeimage} alt="node" />
                      <label className="summarymode"> {nodeItemDt.nodeDesc}</label>
                      <label className="summarymode" style={{ display: 'block' }}> Cab Number ({nodeItemDt.systemName?.replace("TR_","")})</label>
                      <label className="summarysytem"><i className="fas fa-arrow-up fa-1x ng-scope "></i>{nodeItemDt.uptime}</label>
                    </article>
                    <article style={{ margin: "auto" }}>
                      <article>
                        <article style={{ margin: "auto" }}>
                          <article>
                            <article>

                            </article>
                          </article>
                        </article>
                      </article>

                      <ul className="summarylist">
                        <li>
                          <img
                            src={radioimage}
                            alt=""
                            style={{ marginRight: "6px" }}
                          />
                          <h6>Radio Mode <span>{nodeItemDt.radioMode === 'sta' ? 'SU' : ''}</span></h6>
                        </li>
                        <li>
                          <i
                            className="hardwareversionicon"
                            style={{ marginRight: "6px" }}
                          ></i>
                          <h6>Hardware Version <span>{nodeItemDt.hardwareVersion}</span></h6>
                        </li>
                         <li>  <img
                          src={bootloader}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            marginRight: "6px",
                          }}
                        />
                          <h6> Bandwidth <span>{nodeItemDt.bandwidth} MHz</span></h6></li>
                          <li>  <img
                          src={bootloader}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            marginRight: "6px",
                          }}
                        />
                          <h6> Channel <span>{nodeItemDt.channel} ({nodeItemDt.frequecy} MHz)  </span></h6></li>
                          <li>  <img
                          src={bootloader}
                          alt=""
                          style={{
                            width: "35px",
                            height: "35px",
                            marginRight: "6px",
                          }}
                        />
                          <h6> SSID <span>{nodeItemDt.ssid} </span></h6></li>
                        <li> <i
                          className="serialnumbericon"
                          style={{ marginRight: "6px" }}
                        ></i><h6> Serial Number<span> {nodeItemDt.serialNumber}</span></h6></li>
                        <li><i
                          className="firmwareicon"
                          style={{ marginRight: "6px" }}
                        ></i><h6> Firmware<span> {nodeItemDt.softwareVersion}</span></h6></li>
                        <li><i
                          className="ethernetmacicon"
                          style={{ marginRight: "6px" }}
                        ></i>
                          <h6>Ethernet MAC<span> {nodeItemDt.ethernetMAC}</span></h6></li>
                        <li>
                          <i
                            className="wirelessmacicon"
                            style={{ marginRight: "6px" }}
                          ></i>
                          <h6> Wireless MAC
                            <span>
                              {nodeItemDt.wirelessMAC}
                            </span>
                          </h6>
                        </li>
                      </ul>

                    </article>
                  </article>
                </article>
              </article>

              <article className="col-md-10" style={{ background: 'white',borderLeft:'10px solid #cccccc' }}>
                <article
                  style={{
                    backgroundColor: "white",
                   
                  }}
                >
                  <NetworkMonitoringDashboard />
                </article>
              </article>
            </article>
          </article>

        </article>
      </article>
    </>
  )
}

export default TrainSummaryTab;