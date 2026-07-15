import { useState } from "react"
import TranscoderDashboard from "./transcoderdashboard"
import CamstatsSubview from "./transcoderviewsubtabs/camstasticks";
import '../../pages/ornms.css'

const TcMonitoringTab = () => {

    const [currentObcsubTab, setCurrentObcsubTab] = useState('linkstasticks');

     const renderCurrentObcsubTab = (value) => {
    switch (value) {
      case 'linkstasticks':
        return <TranscoderDashboard />
        break;
      case 'camstasticks':
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
                      <li  onClick={() => handleRowClick('linkstasticks')} className={`${currentObcsubTab === 'linkstasticks' ? 'active' : ''}`}><a>Linkstasticks</a></li>
                      <li  onClick={() => handleRowClick('camstasticks')} className={`${currentObcsubTab === 'camstasticks' ? 'active' : ''}`}><a>Camstasticks</a></li>
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