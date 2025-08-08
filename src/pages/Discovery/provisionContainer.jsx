import React,{useState} from "react";
import '../ornms.css'
import './../Discovery/discovery.css';


const ProvisionContainerDis = ({ proviContdata,getCloseProviCont,setIsProvisioned }) => {

     const [loading, setLoading] = useState(false);
    
        const [error, setError] = useState('');
        const [success, setSuccess] = useState('');
    const handleCancleproviCont=()=>{
        getCloseProviCont()
    }

    const handleProviContdata = async (data) => {
        console.log('kkppk',data);
        const nodeIds = data.map(item => item.nodeId);
        console.log('lpplsszzzzzzzz',nodeIds)
        const url = 'api/v2/profiles/4/applyToNodes'

        setError('');

        setLoading(true);
        try {
            const response = await fetch(url,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(nodeIds),
            });
            const ddtt = response;
            console.log('reesss', ddtt);

            if (response.ok) {
                setSuccess('Discovery started successfully');
                setIsProvisioned(true);
            } else {
                setError('Error starting discovery');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while contacting the server.');
        } finally {
            setLoading(false); // Turn off loading state
        }
    };


    return (

        <>
            <article className="border-allsd">
                <h1 className="provisionheading">
                    Provision
                </h1>
                <article style={{ padding: '0 20px 70px' }}>
                    <label className="col-12 proviContselectlbl">Profile Type
                    </label>
                    <select className="proviContform-controll1 col-12" aria-invalid="false">
                        <option value="0" selected="selected" label="Default Profile">Default Profile</option>
                        <option value="1" label="VLAN Profile">VLAN Profile</option>
                        <option value="2" label="Ethernet Profile">Ethernet Profile</option>
                        <option value="3" label="Radius Profile">Radius Profile</option>
                        <option value="4" label="DHCP Profile">DHCP Profile</option>
                        <option value="5" label="Wireless Profile">Wireless Profile</option>
                        <option value="6" label="DDRS/ATPC Profile">DDRS/ATPC Profile</option>
                        <option value="7" label="Snmp Profile">Snmp Profile</option></select>
                    <label className="col-12 proviContselectlbl">Profile
                    </label>
                    <select className="proviContform-controll1 col-12" aria-invalid="false">
                        <option value="0" selected="selected" label="Default Profile">Default Profile</option>
                        <option value="1" label="VLAN Profile">VLAN Profile</option>
                        <option value="2" label="Ethernet Profile">Ethernet Profile</option>
                      
                        <option value="7" label="Snmp Profile">Snmp Profile</option></select>
                    <label className="col-12 proviContselectlbl">Selected Devices
                    </label>
                    <article className="row" style={{ height: '0vh', margin: '0px 0px 5px 5px' }}>
                        <table className="col-12 border-allsd" style={{ height: '0vh' }}>
                            <thead className="provicontdisctb">
                                <tr>

                                    <th>System Name</th>
                                    <th>Customer</th>
                                    <th>LinkId</th>
                                    <th>IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="provicontdiscbdtwo">


                                {
                                    proviContdata.map((node, index) => (
                                        <tr key={node.id}>


                                            <td>{node.sysName}</td>
                                            <td>{node.sysName}</td>
                                            <td>{node.sysName}</td>
                                            <td>{node.ipAddress}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>

                    </article>
                </article>
                <hr className="hrprovicont col-11"/>
                <article className="proviapplycont">
                    <button className="createbtn" style={{marginRight:'10px'}} onClick={()=>handleProviContdata(proviContdata)}>Provision</button>
                    <button className="canclebtnn" onClick={handleCancleproviCont}>Cancel</button>
                </article>
            </article>
        </>
    )
}

export default ProvisionContainerDis;