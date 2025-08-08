import React, { useState, useEffect } from "react";
import '../ornms.css';
import './../Topology/topology.css';


const dataString = JSON.stringify({
    "region": [
        {
            "total": 2,
            "name": "DefaultLocation",
            "facility": [
                {
                    "total": 2,
                    "name": "DefaultFacility",
                    "id": 5,
                    "down": 0,
                    "lat": "0",
                    "long": "0"
                }
            ],
            "down": 0,
            "lat": "0",
            "long": "0"
        }
    ]
});

const dataObject = JSON.parse(dataString);

const region = dataObject.region[0];  // Access the first region

// Total, lat, and long for the region
const regionTotal = region.total;
const regionLat = region.lat;
const regionLong = region.long;

const facility = region.facility[0];  // Access the first facility

const facilityTotal = facility.total;
const facilityLat = facility.lat;
const facilityLong = facility.long;

const Dcity = [
    {
        "text": "192.168.1.42",
        "children": [
            {
                "text": "192.168.1.41",
                "children": [],
                "data": {
                    "mode": "ap",
                    "linkid": "0",
                    "systemname": "Sify",
                    "active": true,
                    "id": 1,
                    "type": "node",
                    "custName": "CustomerName",
                    "addtotree": false,
                    "ssid": "SifySMAC3_S",
                    "lat": 0.0,
                    "long": 0.0
                }
            }
        ],
        "data": {
            "mode": "sta",
            "linkid": "143",
            "systemname": "Sify",
            "active": true,
            "id": 2,
            "type": "node",
            "custName": "CustomerName",
            "addtotree": false,
            "ssid": "SifySMAC3_S",
            "lat": 0.0,
            "long": 0.0
        }
    },
    {
        "text": "192.168.1.41",
        "children": [
            {
                "text": "192.168.1.42",
                "children": [],
                "data": {
                    "mode": "sta",
                    "linkid": "143",
                    "systemname": "Sify",
                    "active": true,
                    "id": 2,
                    "type": "node",
                    "custName": "CustomerName",
                    "addtotree": false,
                    "ssid": "SifySMAC3_S",
                    "lat": 0.0,
                    "long": 0.0
                }
            }
        ],
        "data": {
            "mode": "ap",
            "linkid": "0",
            "systemname": "Sify",
            "active": true,
            "id": 1,
            "type": "node",
            "custName": "CustomerName",
            "addtotree": false,
            "ssid": "SifySMAC3_S",
            "lat": 0.0,
            "long": 0.0
        }
    }
];

const maptbdat = {
    "links": [
        {
            "macAddress": "1c:82:59:b0:8e:5f",
            "ipAddress": "192.168.1.10",
            "localLinkId": "0",
            "remoteLinkId": "0",
            "localCustName": "CustomerName",
            "remoteCustName": "CustomerName",
            "distance": "0",
            "localSignalA1": "-24",
            "localSignalA2": "-23",
            "remoteSignalA1": "-23",
            "remoteSignalA2": "-21",
            "localSNRA1": "71",
            "localSNRA2": "72",
            "remoteSNRA1": "70",
            "remoteSNRA2": "72",
            "localDropped": "0",
            "remoteDropped": "0",
            "rateRx": "192",
            "rateTx": "192",
            "throughputIn": "1.06",
            "throughputOut": "1.08",
            "nodeId": 1,
            "localRTX": null,
            "remoteRTX": null,
            "localRadioMode": "sta",
            "remoteRadioMode": "ap",
            "channel": null,
            "lNoise": "-95",
            "rNoise": "-93",
            "serialNumber": "20ATC0305022",
            "locEstRSSI": -1,
            "remEstRSSI": -1,
            "localMCS": 19,
            "linkUptime": "04:13:47:10",
            "latitude": "null",
            "longitude": "null",
            "discovered": true
        }
    ]
}

const link = maptbdat.links[0];

const  MapLat = ({ mapValue }) => {
    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        // Dynamically set the src for the iframe after the component mounts
        setIframeSrc(`https://maps.google.com/maps?q=${24.555059},${-81.779984}&h1=es;&output=embed`);

        switch (mapValue) {
            case 'DefaultRegion':
                // Assuming you want to display the facility location
                setIframeSrc(`https://maps.google.com/maps?q=${facilityLat},${facilityLong}&h1=es;&output=embed`);
                break;

            case 'DefaultCity':
                const ip42 = Dcity.find(city => city.text === '192.168.1.42');
                const ip41 = Dcity.find(city => city.text === '192.168.1.41');

                if (ip42 && ip41) {
                    // Use the actual lat and long from the ip42 and ip41 objects
                    const lat1 = ip42.data.lat;  // 101
                    const lng1 = ip42.data.long; // 201
                    const lat2 = ip41.data.lat;  // 0
                    const lng2 = ip41.data.long; // 0

                    // Correcting the map URL for multiple markers
                    const iframeUrl = `https://maps.google.com/maps?q=${lat1},${lng1}&markers=${lat1},${lng1}|${lat2},${lng2}&h1=es;&output=embed`;
                    setIframeSrc(iframeUrl);
                }
                break;

            case 'DefaultLocation':
                const ip421 = Dcity.find(city => city.text === '192.168.1.42');
                const ip411 = Dcity.find(city => city.text === '192.168.1.41');

                if (ip421 && ip411) {
                    // Use the actual lat and long from the ip42 and ip41 objects
                    const lat1 = ip421.data.lat;  // 101
                    const lng1 = ip421.data.long; // 201
                    const lat2 = ip411.data.lat;  // 0
                    const lng2 = ip411.data.long; // 0

                    // Correcting the map URL for multiple markers
                    const iframeUrl = `https://maps.google.com/maps?q=${lat1},${lng1}&markers=${lat1},${lng1}|${lat2},${lng2}&h1=es;&output=embed`;
                    setIframeSrc(iframeUrl);
                }
                break;
            case 'DefaultFacility':
                const ip4211 = Dcity.find(city => city.text === '192.168.1.42');
                const ip4111 = Dcity.find(city => city.text === '192.168.1.41');

                if (ip4211 && ip4111) {
                    // Use the actual lat and long from the ip42 and ip41 objects
                    const lat1 = ip4211.data.lat;  // 101
                    const lng1 = ip4211.data.long; // 201
                    const lat2 = ip4111.data.lat;  // 0
                    const lng2 = ip4111.data.long; // 0

                    // Correcting the map URL for multiple markers
                    const iframeUrl = `https://maps.google.com/maps?q=${lat1},${lng1}&markers=${lat1},${lng1}|${lat2},${lng2}&h1=es;&output=embed`;
                    setIframeSrc(iframeUrl);
                }
                break;
            case '192.168.1.41':
                const ip2 = Dcity.find(city => city.text === '192.168.1.42');
                const ip1 = Dcity.find(city => city.text === '192.168.1.41');

                if (ip2 && ip1) {
                    // Use the actual lat and long from the ip42 and ip41 objects
                    const lat1 = ip2.data.lat;  // 101
                    const lng1 = ip2.data.long; // 201
                    const lat2 = ip1.data.lat;  // 0
                    const lng2 = ip1.data.long; // 0

                    // Correcting the map URL for multiple markers
                    const iframeUrl = `https://maps.google.com/maps?q=${lat1},${lng1}&markers=${lat1},${lng1}|${lat2},${lng2}&h1=es;&output=embed`;
                    setIframeSrc(iframeUrl);
                }
                break;
            case '192.168.1.42':
                const ip21 = Dcity.find(city => city.text === '192.168.1.42');
                const ip11 = Dcity.find(city => city.text === '192.168.1.41');

                if (ip21 && ip11) {
                    // Use the actual lat and long from the ip42 and ip41 objects
                    const lat1 = ip21.data.lat;  // 101
                    const lng1 = ip21.data.long; // 201
                    const lat2 = ip11.data.lat;  // 0
                    const lng2 = ip11.data.long; // 0

                    // Correcting the map URL for multiple markers
                    const iframeUrl = `https://maps.google.com/maps?q=${lat1},${lng1}&markers=${lat1},${lng1}|${lat2},${lng2}&h1=es;&output=embed`;
                    setIframeSrc(iframeUrl);
                }
                break;

            default:
                break;
        }
    }, [mapValue]);

    return (
        <article style={{position:'relative'}}>
            {/* <div className="gm-style-moc" style="z-index: 4; position: absolute; height: 100%; width: 100%; padding: 0px; 
            border-width: 0px; margin: 0px; left: 0px; top: 0px; transition-property: opacity, 
            display; opacity: 0; transition-duration: 0.8s; display: none;">
                <p className="gm-style-mot">Use ctrl + scroll to zoom the map</p></div> */}
            <iframe
                id="iframeId"
                width="100%"
                height="730"
                style={{ border: 'none' ,opacity:'1'}}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={iframeSrc}  // Set the iframe src dynamically
            ></iframe>
           {mapValue == '192.168.1.41'? <article className="clearfix maptt" style={{position:'absolute',top:'60px',right:'0'}}>
                <table>
                    <tbody>
                        <tr>
                            <td colspan="3" style={{ textAlign: "left" }}>Sify</td>
                        </tr>
                        <tr>
                            <td colspan="3" style={{ textAlign: "left", color: "blue" }}>192.168.1.41<span style={{ marginLeft: '10px', textAlign: 'left', color: 'grey' }}>Sify</span></td>
                        </tr><tr><td colspan="3" style={{ textAlign: 'left' }}>SSID:<span style={{ color: "grey" }}>SifySMAC3_PTMP</span></td></tr><tr><td colspan="3"><hr style={{ borderTop: '1px solid black' }} /></td></tr>
                        <tr><td style={{ textAlign: 'left' }}><a href="http://192.168.1.10" target="_blank" style={{ color: 'blue', fontWeight: '500' }}>{link.ipAddress}</a>&nbsp;&nbsp;{link.localCustName}</td><td><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left' }}></span></td><td></td></tr><tr><td style={{ textAlign: 'left' }}><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left' }}><b>SNR: L </b>{link.localSNRA1}<b>-</b>{link.localSNRA2}<b> : R </b>{link.remoteSNRA1}<b>-</b>{link.remoteSNRA2}</span></td>
                            <td style={{ textAlign: 'left' }}><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left', paddingLeft: '10px' }}><b> Link Id : </b>{link.localLinkId}</span></td><td><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left', paddingLeft: "10px" }}>{link.distance}</span></td></tr></tbody></table>
            </article> :''} 
            {mapValue == '192.168.1.42'? <article className="clearfix maptt" style={{position:'absolute',top:'60px',right:'0'}}>
                <table>
                    <tbody>
                        <tr>
                            <td colspan="3" style={{ textAlign: "left" }}>Sify</td>
                        </tr>
                        <tr>
                            <td colspan="3" style={{ textAlign: "left", color: "blue" }}>192.168.1.42<span style={{ marginLeft: '10px', textAlign: 'left', color: 'grey' }}>Sify</span></td>
                        </tr><tr><td colspan="3" style={{ textAlign: 'left' }}>SSID:<span style={{ color: "grey" }}>SifySMAC3_PTMP</span></td></tr><tr><td colspan="3"><hr style={{ borderTop: '1px solid black' }} /></td></tr>
                        <tr><td style={{ textAlign: 'left' }}><a href="http://192.168.1.10" target="_blank" style={{ color: 'blue', fontWeight: '500' }}>{link.ipAddress}</a>&nbsp;&nbsp;{link.localCustName}</td><td><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left' }}></span></td><td></td></tr><tr><td style={{ textAlign: 'left' }}><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left' }}><b>SNR: L </b>{link.localSNRA1}<b>-</b>{link.localSNRA2}<b> : R </b>{link.remoteSNRA1}<b>-</b>{link.remoteSNRA2}</span></td>
                            <td style={{ textAlign: 'left' }}><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left', paddingLeft: '10px' }}><b> Link Id : </b>{link.localLinkId}</span></td><td><span style={{ fontWeight: '400', fontStyle: 'normal', textAlign: 'left', paddingLeft: "10px" }}>{link.distance}</span></td></tr></tbody></table>
            </article> :''} 
          
        </article>
    );
};

export default MapLat;
