import React,{useState,useEffect} from 'react';
// import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import './ornms.css'
import { Table } from 'react-bootstrap';
import TopotbOne from './topotbone';
import './../Topology/topology.css';


const data = {
    "links": [
        {
            "macAddress": "1c:82:59:b0:2f:01",
            "ipAddress": "192.168.1.42",
            "localLinkId": "0",
            "remoteLinkId": "0",
            "localCustName": "CustomerName",
            "remoteCustName": "CustomerName",
            "distance": "0",
            "localSignalA1": "-53",
            "localSignalA2": "-37",
            "remoteSignalA1": "-52",
            "remoteSignalA2": "-39",
            "localSNRA1": "41",
            "localSNRA2": "57",
            "remoteSNRA1": "43",
            "remoteSNRA2": "56",
            "localDropped": "0",
            "remoteDropped": "0",
            "rateRx": "72",
            "rateTx": "72",
            "throughputIn": "0.19",  // We will use this for the Area chart
            "throughputOut": "0.27", // We will use this for the Area chart
            "nodeId": 2,
            "localRTX": null,
            "remoteRTX": null,
            "localRadioMode": "ap",
            "remoteRadioMode": "sta",
            "channel": null,
            "lNoise": "-94",
            "rNoise": "-95",
            "serialNumber": "20AT70400236",
            "locEstRSSI": -1,
            "remEstRSSI": -1,
            "localMCS": 7,
            "linkUptime": "00:23:48:35",
            "latitude": "null",
            "longitude": "null",
            "discovered": false
        },
        {
            "macAddress": "1c:82:59:b0:2f:01",
            "ipAddress": "192.168.1.42",
            "localLinkId": "0",
            "remoteLinkId": "0",
            "localCustName": "CustomerName",
            "remoteCustName": "CustomerName",
            "distance": "0",
            "localSignalA1": "-53",
            "localSignalA2": "-37",
            "remoteSignalA1": "-52",
            "remoteSignalA2": "-39",
            "localSNRA1": "41",
            "localSNRA2": "57",
            "remoteSNRA1": "43",
            "remoteSNRA2": "56",
            "localDropped": "0",
            "remoteDropped": "0",
            "rateRx": "72",
            "rateTx": "72",
            "throughputIn": "0.15",  // We will use this for the Area chart
            "throughputOut": "0.34", // We will use this for the Area chart
            "nodeId": 2,
            "localRTX": null,
            "remoteRTX": null,
            "localRadioMode": "ap",
            "remoteRadioMode": "sta",
            "channel": null,
            "lNoise": "-94",
            "rNoise": "-95",
            "serialNumber": "20AT70400236",
            "locEstRSSI": -1,
            "remEstRSSI": -1,
            "localMCS": 7,
            "linkUptime": "00:23:48:35",
            "latitude": "null",
            "longitude": "null",
            "discovered": false
        },
        {
            "macAddress": "1c:82:59:b0:2f:01",
            "ipAddress": "192.168.1.42",
            "localLinkId": "0",
            "remoteLinkId": "0",
            "localCustName": "CustomerName",
            "remoteCustName": "CustomerName",
            "distance": "0",
            "localSignalA1": "-53",
            "localSignalA2": "-37",
            "remoteSignalA1": "-52",
            "remoteSignalA2": "-39",
            "localSNRA1": "41",
            "localSNRA2": "57",
            "remoteSNRA1": "43",
            "remoteSNRA2": "56",
            "localDropped": "0",
            "remoteDropped": "0",
            "rateRx": "72",
            "rateTx": "72",
            "throughputIn": "0.15",  // We will use this for the Area chart
            "throughputOut": "0.34", // We will use this for the Area chart
            "nodeId": 2,
            "localRTX": null,
            "remoteRTX": null,
            "localRadioMode": "ap",
            "remoteRadioMode": "sta",
            "channel": null,
            "lNoise": "-94",
            "rNoise": "-95",
            "serialNumber": "20AT70400236",
            "locEstRSSI": -1,
            "remEstRSSI": -1,
            "localMCS": 7,
            "linkUptime": "00:23:48:35",
            "latitude": "null",
            "longitude": "null",
            "discovered": false
        }
    ]
};

const TblDt = {
    "mpduErrors": 138,
    "txMultiPkts": 0,
    "rxUnicastPkts": 57383335,
    "rxMultiPkts": 0,
    "txMgmtBeacons": 0,
    "rxMgmtPkts": 7285,
    "txUnicastPkts": 57360477,
    "rxMgmtBeacons": 419672,
    "rxpps": 751,
    "txpps": 740,
    "txThroughput": "0.42",
    "rxTotalPackets": 57383335,
    "txTotalPackets": 57360477,
    "phyErrors": 3613,
    "rxThroughtput": "0.49",
    "txMgmtPkts": 419679
}



const TransmitTab = () => {

    // const [toponeDatatb, setToponeDatatb] = useState({});
    // const [isLoading, setIsLoading] = useState(false);
    // const [isError, setIsError] = useState({ status: false, msg: "" });

// const getDatasummarytb = async () => {
//       setIsLoading(true);
//       setIsError({ status: false, msg: "" });
//       try {
//         const url='/skypoint/api/v2/nodelinks/wirelessstats?nodeId=1';
//         const username = "admin";
//   const password = "admin";
//   const headers = new Headers();
//   headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
//   const options = {
//     method: "GET", headers: headers, credentials: 'include',
//   };
//         const response = await fetch(url, options);
//         const data = await response.json();
//         console.log('summtbb',data)
//         if (response.ok) {
//           setIsLoading(false);
//           setToponeDatatb(data);
//           setIsError({ status: false, msg: "" });
//         } else {
//           throw new Error("data not found");
//         }
//       } catch (error) {
//         setIsLoading(false);
//         setIsError({ status: true, msg: error.message });
//       }
//     };
  
//     useEffect(() => {
//       getDatasummarytb();
//     }, []);


   

    return (

        <>
            <article className='border-allsd' style={{ margin: '10px 5px' }}>
                <article className='row'>
                    <article className='col-4'>
                        {/* <article style={{ width: "450px", height: "240px" }}>
                            <ResponsiveContainer width="100%" height={240}>
                                <AreaChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" reversed fontFamily='Lato-Regular' letterSpacing='0.2px'
                                    />
                                    <YAxis ticks={[0, 0.1, 0.2, 0.3, 0.4, 0.5]} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="throughputIn" stroke="#3fc5e1c4" fill="#569de3" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                    <Area type="monotone" dataKey="throughputOut" stroke="#82ca9d" fill="#58cce5" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                    <Area type="monotone" dataKey="throughputtotal" stroke="#82ca9d" fill="#b299cc" fontFamily='Lato-Regular' letterSpacing='0.2px' />

                                    <Line type="monotone" dataKey="throughputOut" stroke="#82ca9d" fontFamily='Lato-Regular' letterSpacing='0.2px' />
                                </AreaChart>
                            </ResponsiveContainer>
                        </article> */}
                        {/* <TopotbOne/> */}
                    </article>
                    <article className='col-3' style={{ marginRight: '5px' }}>
                       <article className="row">
                            {/* <table className="col-12 border-tlr" style={{marginTop:'10px'}}>
                                <thead className="txdtbtwo">
                                    <tr>
                                        <th>Data</th>
                                        <th>Tx</th>
                                        <th>Rx</th>
                                    </tr>
                                </thead>
                                <tbody className="txdtbbdtwo">
                                    <tr>
                                        <td>Total Packets</td>
                                        <td>{toponeDatatb.txTotalPackets}</td>
                                        <td>{toponeDatatb.rxTotalPackets}</td>
                                    </tr>
                                    <tr>
                                        <td>Unicast Packets</td>
                                        <td>{toponeDatatb.txUnicastPkts}</td>
                                        <td>{toponeDatatb.rxUnicastPkts}</td>
                                    </tr>
                                    <tr>
                                        <td>Multicast Packets</td>
                                        <td>{toponeDatatb.txMultiPkts}</td>
                                        <td>{toponeDatatb.rxMultiPkts}</td>
                                    </tr>


                                    <tr>
                                        <td>PPS</td>
                                        <td>{toponeDatatb.txpps}</td>
                                        <td>{toponeDatatb.rxpps}</td>
                                    </tr>
                                </tbody>
                            </table> */}
                        </article>                        

                    </article>
                    <article className='col-2' style={{ marginTop: "10px", marginRight: '5px' }}>
                        <h1 className='mangclheading'>Management</h1>

                        {/* <article className="row border-tlr">
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="managtbtwo">

                                </thead>
                                <tbody className="managbdtwo">
                                    <tr>
                                        <td>Tx Packets</td>
                                        <td>{TblDt.txMgmtPkts}</td>
                                    </tr>
                                    <tr>
                                        <td>Rx Packets</td>
                                        <td>{TblDt.rxMgmtPkts}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </article> */}


                        
                    </article>
                    <article className='col-2' style={{ marginTop: '10px' }}>
                        <h1 className='errorheadingcl'>Errors</h1>

                        {/* <article className="row border-tlr">
                            <table className="col-12" style={{ height: '0vh' }}>
                                <thead className="errortbtwo">

                                </thead>
                                <tbody className="errorbdtwo">
                                    <tr>
                                        <td>CRC Errors</td>
                                        <td>{TblDt.mpduErrors}</td>
                                    </tr>
                                    <tr>
                                        <td>Frame Errors</td>
                                        <td>{TblDt.phyErrors}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </article> */}

                       
                    </article>

                </article>
            </article>
        </>
        // <section className="clearfix wrapper">
        //     <article className="clearfix inner-wrapper">
        //         <article className="clearfix">
        //             <article className="clearfix right-block4" style={{ width: '100%',marginTop:'10px' }}>
        //                 <article className='clearfix left-block4-1'>
        //                     <article style={{ width: "450px", height: "240px" }}>
        //                         <ResponsiveContainer width="100%" height={240}>
        //                             <AreaChart data={chartData}>
        //                                 <CartesianGrid strokeDasharray="3 3" />
        //                                 <XAxis  dataKey="name"  reversed
        //                                          />
        //                                 <YAxis   ticks={[0, 0.1,0.2, 0.3, 0.4, 0.5]} />
        //                                 <Tooltip />
        //                                 {/* <Legend /> */}
        //                                 <Area type="monotone" dataKey="throughputIn" stroke="#3fc5e1c4" fill="#569de3" />
        //                                 <Area type="monotone" dataKey="throughputOut" stroke="#82ca9d" fill="#58cce5" />
        //                                 <Area type="monotone" dataKey="throughputtotal" stroke="#82ca9d" fill="#b299cc" />

        //                                 <Line type="monotone" dataKey="throughputOut" stroke="#82ca9d" />
        //                             </AreaChart>
        //                         </ResponsiveContainer>
        //                     </article>
        //                 </article>
        //                 <article className='clearfix middle-block4-2'>
        //                     <table className="data-table">
        //                         <thead>
        //                             <tr>
        //                                 <th>Data</th>
        //                                 <th>Tx</th>
        //                                 <th>Rx</th>
        //                             </tr>
        //                         </thead>
        //                         <tbody>
        //                             <tr>
        //                                 <td>Total Packets</td>
        //                                 <td>{TblDt.txTotalPackets}</td>
        //                                 <td>{TblDt.rxTotalPackets}</td>
        //                             </tr>
        //                             <tr>
        //                                 <td>Unicast Packets</td>
        //                                 <td>{TblDt.txUnicastPkts}</td>
        //                                 <td>{TblDt.rxUnicastPkts}</td>
        //                             </tr>
        //                             <tr>
        //                                 <td>Multicast Packets</td>
        //                                 <td>{TblDt.txMultiPkts}</td>
        //                                 <td>{TblDt.rxMultiPkts}</td>
        //                             </tr>


        //                             <tr>
        //                                 <td>PPS</td>
        //                                 <td>{TblDt.txpps}</td>
        //                                 <td>{TblDt.rxpps}</td>
        //                             </tr>
        //                         </tbody>
        //                     </table>
        //                 </article>
        //                 <article className='clearfix middle-block4-3'>
        //                     <h1 className='mangcl'>Management</h1>

        //                     <table className="data-table">
        //                         <thead >
        //                         </thead>
        //                         <tbody>
        //                             <tr>
        //                                 <td>Tx Packets</td>
        //                                 <td>{TblDt.txMgmtPkts}</td>
        //                             </tr>
        //                             <tr>
        //                                 <td>Rx Packets</td>
        //                                 <td>{TblDt.rxMgmtPkts}</td>
        //                             </tr>
        //                         </tbody>
        //                     </table>
        //                 </article>
        //                 <article className='clearfix right-block4-4'>
        //                     <h1 className='errorcl'>Errors</h1>

        //                     <table className="data-table">
        //                         <thead>
        //                         </thead>
        //                         <tbody>
        //                             <tr>
        //                                 <td>CRC Errors</td>
        //                                 <td>{TblDt.mpduErrors}</td>
        //                             </tr>
        //                             <tr>
        //                                 <td>Frame Errors</td>
        //                                 <td>{TblDt.phyErrors}</td>
        //                             </tr>
        //                         </tbody>
        //                     </table>
        //                 </article>
        //             </article>
        //         </article>
        //     </article>
        // </section>
    );
};

export default TransmitTab;

