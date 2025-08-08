import React from "react";
import '../Dashboard/dashboard.css';

const dataString = {
  nodes: [
    {
      modelNum: "API-18-5G-AC2x2-W2",
      channel: 77,
      ssid: "SifySMAC3_PTMP",
      frequency: 5385,
      sysUptime: "11:17:30:02",
      remotePartners: 4,
      backupip: "10.0.0.1",
      netmask: "255.255.255.0",
      radioMode: "AP",
      sysName: "Sify",
      macaddress: "1c:82:59:b0:8e:5d",
      opMode: "11ac",
      firmware: "3.3(100125)",
      elevation: "-",
      serialNum: "20ATC0305022", 
      bandwidth: "20 Mhz",
      ipAddress: "192.168.1.10",
      City: "DefaultCity",
      productCode: "PtMP",
      lsnr: "75/75",
      location: "DefaultLocation",
      nodeId: 119,
      facility: "DefaultFacility",
      gateway: "192.168.1.10",
      status: "Down",
    },
  ],
  totalCount: 1,
};

const Tabletwo = ({tabData}) => {
  console.log('tabletwoDatasss',tabData);
  return (
    <div style={{margin:'3px 14px 0 5px'}}>
      <article className="clearfix border-close">
              <article className="clearfix right-block-1">
                <article className="clearfix">
                  <button className="clearfix arrowlf">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <button className="clearfix numcl"><span>1</span></button>
                  <button className="clearfix arrowlf"><i className="fa-solid fa-arrow-right"></i></button>
                </article>
              </article>
              <article className="clearfix right-block-2" style={{marginLeft:"49%"}}>
                <ul  className="clearfix sellist">
                  <li>
                  <input type="text" name="" placeholder="IP Address / System Name / Serial Number" id="" className="form-control searchbar" />

                  </li>
                  <li>
                  <button className="clearfix createbtn">Search</button>

                  </li>
                  <li>
                  <span className="addcllo">Add Columns 
                  <button className="clearfix taskbtn" onclick=""><span
                        className="glyphicon glyphicon-tasks"></span></button>
                        </span>
                <select className="selecl" value="select" style={{width:"auto",marginLeft:'10px'}} aria-invalid="false">
                  <option value="0" label="10">10</option>
                  <option value="1" selected="selected" label="25">25</option>
                  <option value="2" label="50">50</option>
                  <option value="3" label="100">100</option>
                </select>
                  </li>
                </ul>
               

              </article>
            </article>
      <article className="clearfix tableart">
      <table border="1" className="tabletwocl">
        <thead className="clearfix tbtwo">
          <tr style={{ backgroundColor: '#ffffff00' }}>
            <th>System Name</th>
            <th>Primary IP</th>
            <th>MAC Address</th>
            <th>Serial Number</th>
            <th>Model Number</th>
            <th>Firmware</th>
            <th>Status</th>
            <th>Uptime</th>
          </tr>
        </thead>
        <tbody className="clearfix tbdata">
          {dataString.nodes.map((node, index) => (
            <tr key={index}>
              <td>{node.sysName}</td>
              <td>{node.ipAddress}</td>
              <td>{node.macaddress}</td>
              <td>{node.serialNum}</td>
              <td>{node.modelNum}</td>
              <td>{node.firmware}</td>
              <td style={{ color: node.status === "Down" ? "red" : "green", fontWeight: "bold" }}>
                {node.status}
              </td>
              <td>{node.sysUptime}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </article>
    </div>
  );
};

export default Tabletwo;

