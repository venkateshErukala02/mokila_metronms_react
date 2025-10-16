import React, { useState } from "react";
import '../../pages/ornms.css'
import { useSelector } from 'react-redux';
import './../Settings/settings.css';
import LeftNavList from "../Navbar/leftnavpage";
import LinesIcon from './../../assets/img/region.png';
import SectionIcon from './../../assets/img/location.png';
import FirmwareMng from "./firmwaremanager";
import ConfigChange from "./configchange";
import FirmwareContainer from "./firmware";


const ConfigPage = () => {

    const isVisible = useSelector(state => state.visibility.isVisible);

    const [containerSetting, setContainerSetting] = useState('');

   const showDropdown = (value, e) => {
    e.preventDefault();

    const dropdownMap = {
        firmware: 'firmware',
        bulk: 'bulk'
    };

    Object.values(dropdownMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
        }
    });

    const selectedId = dropdownMap[value];
    const selectedElement = document.getElementById(selectedId);

    if (selectedElement) {
        selectedElement.style.display = 'block';
    }
};


    const renderSettingSelectedComponent = () => {
        switch (containerSetting) {
            case 'firmwareManager':
                return <FirmwareMng />;
            case 'configchange':
                return <ConfigChange />;
            case 'firmware':
                return <FirmwareContainer />;
            
            default:
                return <FirmwareMng />;
        }
    };



    function disableInput() {
        document.getElementById('myInput').disabled = true;
    }

    const SelectSettingCont = (value) => {
        setContainerSetting(value);
    }


    return (
        <>
            <article className="display-f">
                <article className={isVisible ? 'leftsidebardisblock' : 'leftsidebardisnone'}>
                    <LeftNavList className='leftsidebar' />
                </article>
                <article className="container-fluid">
                    <article className="row">
                        <h1 className="settingtitle">Settings</h1>
                        <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                            <article>
                                <ul className="clearfix list-pn proflist">
                                    <li><a href="" className="clearfix profilel new" onClick={(e) => {showDropdown('firmware', e);SelectSettingCont('firmwareManager')}}><i className="fa fa-lg fa-cog"></i>Firmware</a>
                                        <ul className="clearfix profsublist list-pn" id="firmware" style={{ display: 'none' }}>
                                            <li onClick={() => SelectSettingCont('firmwareManager')}><img src={LinesIcon} alt="line" />Firmware Manager</li>
                                        </ul>
                                    </li>
                                    <li><a href="" className="clearfix profilel new" onClick={(e) => {showDropdown('bulk', e);SelectSettingCont('configchange')}}><i className="fa fa-lg fa-cog"></i>Bulk</a>
                                        <ul className="clearfix profsublist list-pn" id="bulk" style={{ display: 'none' }}>
                                            <li onClick={() => SelectSettingCont('configchange')}><img src={LinesIcon} alt="line" />Config Change</li>
                                            <li onClick={() => SelectSettingCont('firmware')}><img src={SectionIcon} alt="section" /> Firmware</li>
                                        </ul>
                                    </li>

                                </ul>
                            </article>
                        </article>
                        <article className="col-sm-10 col-md-10 col-lg-10 col-xl-10 col-xxl-10">

                            {renderSettingSelectedComponent()}
                        </article>
                    </article>
                </article>
            </article>
        </>

    )
}

export default ConfigPage;