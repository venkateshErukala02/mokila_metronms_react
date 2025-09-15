import { useSelector } from "react-redux";
import LeftNavList from "../Navbar/leftnavpage";
import { useState } from "react";
import TopoSvgViewer from "./toposvg";
import TopoSectionTable from "./toposectiontable";
import WestSvgViewer from "./waysvg";
import WaySvgViewer from "./waysvg";


const Wayside = () => {
    const isVisible = useSelector(state => state.visibility.isVisible);
    const [westSideViewLabel, setWestSideViewLabel] = useState('Line21')
    const [westSideView, setWestSideView] = useState('Line1');

    const handleWestside = (e) => {
        const selectElement = e.target;
        const label = selectElement.options[selectElement.selectedIndex].label;
        setWestSideView(selectElement.value);
        setWestSideViewLabel(label);

    }


    const renderSectComponent = (textName) => {
        switch (textName) {
            case 'Line21':
                return <>   <WaySvgViewer textName={textName} />
                </>
                break;
            case 'line1-sec1':
                return <>   <WaySvgViewer textName={textName} />
                </>
                break;
            case 'line1-sec2':
                return <>   <WaySvgViewer textName={textName} />
                </>
                break;
            case 'line4-sec1':
                return <>   <WaySvgViewer textName={textName} />
                </>
                break;
            default:
                return <>   <WaySvgViewer textName='Line21' /> </>
                break;
        }
    }

    return (
        <>
            <article className="display-f">
                <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
                    <LeftNavList className='leftsidebar' />
                </article>
                <article className="container-fluid">
                    <article className="row">
                        <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                            <article className="border-allsd" style={{ height: '90vh', margin: '5px 5px 0 5px' }}>
                                <article className="row">
                                    <article className="col-12">
                                        <h1 className="topoheading">Wayside Tag Configuration</h1>
                                    </article>
                                    {/* <article className="col-4" style={{ float: 'right' }}>
                                        <article style={{ float: 'right' }}>
                                            <button className="createbtn">Refresh</button>
                                        </article>
                                    </article> */}
                                    {/* <article className="row">
                                        <article className="col-12">
                                            <span className="radioSelct">Radio Mode:</span>
                                            <select className="form-controlfirm" value="select" style={{ width: "auto" }} aria-invalid="false">
                                                <option value="0" label="All">All</option>
                                                <option value="1" selected="selected" label="AP">AP</option>
                                                <option value="2" label="SU">SU</option>
                                            </select>
                                        </article>
                                    </article> */}
                                </article>
                                {/* <article className="systemcont">
                                    <article className="row">
                                        <article className="col-6">
                                            <input type="text" className="clearfix form-controltopo" placeholder="IP Address" />
                                        </article>
                                        <article className="col-6">
                                            <article style={{ float: 'right' }}>
                                                <button className="createbtn">Search</button>
                                            </article>
                                        </article>
                                    </article>
                                </article> */}
                                <hr className="hrll" style={{ marginBottom: '0px' }} />
                                <label for="name" className="selectlbl" style={{ display: 'inline-block' }}>Select :</label>
                                <select name="name" id="name" value={westSideView} onChange={handleWestside} className="form-controll1" style={{ maxWidth: '94px', minWidth: '94px' }}>
                                    {/* <option value="" label="Select">Select</option> */}
                                    <option value="Line21" label="Line1">Line1</option>
                                    <option value="line1-sec1" label="Line1-sec1">Line1-sec1</option>
                                    <option value="line1-sec2" label="Line1-sec2">Line1-sec2</option>
                                    <option value="line4-sec1" label="Line4-sec1">Line4-sec1</option>
                                </select>

                            </article>
                        </article>
                        <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">
                            <article className="border-allsd" style={{ margin: '5px 0px 0 0px' }}>
                                {renderSectComponent(westSideView)}
                            </article>
                        </article>
                    </article>

                </article>
            </article>
        </>
    )
}

export default Wayside;