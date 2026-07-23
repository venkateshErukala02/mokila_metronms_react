import { useState } from "react"
import TranscoderDashboard from "./transcoderdashboard"
import '../../pages/ornms.css'
import CamstatsSubview from "./transcoderviewsubtabs/camstatistics";

const TcMonitoringTab = () => {

    const [currentObcsubTab, setCurrentObcsubTab] = useState('linkstatistics');

     const renderCurrentObcsubTab = (value) => {
    switch (value) {
      case 'linkstatistics':
        return <TranscoderDashboard />
        break;
      case 'camstatistics':
         return <CamstatsSubview />
        break;
      default:
        break;
    }
  }


  const handleRowClick = (value) => {
    setCurrentObcsubTab(value);
  }

    return (
        <>
         <article className="row">
        <article
          className="col-md-12"
          style={{ padding: "10px", backgroundColor: "#cccccc" }}
        >

          <article className="container-fluid">
            <article className="row" style={{ display: "flex" }}></article>
            <article className="container-fluid">
                <article className="col-md-12" style={{ background: 'white', minHeight: '934px' }}>
                <article
                  style={{
                    backgroundColor: "white",

                  }}
                >
                  <article style={{padding:'15px'}}>
                   <article className="row">
                  <article className="col-md-12" style={{display:'flex',justifyContent:'center'}}>
                    <ul className="obcsublist">
                      <li  onClick={() => handleRowClick('linkstatistics')} className={`${currentObcsubTab === 'linkstatistics' ? 'active' : ''}`}><a>Link Statistics</a></li>
                      <li  onClick={() => handleRowClick('camstatistics')} className={`${currentObcsubTab === 'camstatistics' ? 'active' : ''}`}><a>Cam Statistics</a></li>
                    </ul>
                  </article>
                 
                  <hr />
                  </article>
                  {renderCurrentObcsubTab(currentObcsubTab)}
        </article>

                </article>
              </article>
            </article>
                  </article>
                  </article>
                  </article>
        </>
    )
}

export default TcMonitoringTab