import React,{useState} from "react";
// import './ornms.css';
// import LeftNavList from '../charts/leftnavlist'
import { Table } from "react-bootstrap";
import LeftNavList from "../Navbar/leftnavpage";
import { useSelector } from 'react-redux';
import RegionContainer from "./linepage";
import CityContainer from "./sectionpage";
import FacilityContainer from "./facilitypage";
import UserContainer from "./userpage";
import GroupContainer from "./grouppage";
import ThresholdContainer from "./thresholdpage";
import SnmpContainer from "./snmppage";
import NotificationContainer from "./notificationpage";
import './../Settings/settings.css';
import LinesIcon from './../../assets/img/region.png';
import SectionIcon from './../../assets/img/location.png';
import StationIcon from './../../assets/img/settingfacility .png';
import UsersIcon from './../../assets/img/user.png';
import GroupsIcon from './../../assets/img/group.png';
import ThresholdIcon from './../../assets/img/threshold.png';
import SnmpIcon from './../../assets/img/snmp.png';
import AlarmIcon from './../../assets/img/alarm.png';
import ConfigIcon from './../../assets/img/server_configuration.png';
import ServerConfigContainer from "./serverconfig";
import LineContainer from "./linepage";
import SectionContainer from "./sectionpage";
import StationContainer from "./stationpage";
import WaysideTagContainer from "./waysidetagpage";

const SettPage = () => {

    const isVisible = useSelector(state => state.visibility.isVisible);

    const [containerSetting, setContainerSetting] = useState('');
    const [activeSetting, setActiveSetting] = useState('lines');

    const showDropdown = (value,e) => {
        e.preventDefault()
        switch (value) {
            case 'profile':
                var vlelement = document.getElementById("vlan");

                if (vlelement.style.display === "none" || vlelement.style.display === "") {
                    vlelement.style.display = 'block';
                } else {
                    vlelement.style.display = 'none';
                }
                break;

            default:
                break;
        }
    }

    const renderSettingSelectedComponent = () => {
        switch (containerSetting) {
            case 'lines':
                return <LineContainer/>;
            case 'sections':
                return <SectionContainer />;
            case 'stations':
                return <StationContainer />;
            case 'waysidetags':
                return <WaysideTagContainer />;
            case 'users':
                return <UserContainer />;
            case 'groups':
                return <GroupContainer />;
            case 'threshold':
                return <ThresholdContainer />;

            case 'snmpconfig':
                return <SnmpContainer />;
            case 'notification':
                return <NotificationContainer />;
            case 'severconfig':
                return <ServerConfigContainer />;
               
            default:
                return <RegionContainer/>;
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
            <article className={isVisible ? 'leftsidebardisblock' :'leftsidebardisnone'}>
                  <LeftNavList  className='leftsidebar'/>
                  </article>
                    <article className="container-fluid">
                    <article className="row sect-padd">
                    <h1 className="settingtitle">Settings</h1>
                    <article className="col-sm-2 col-md-2 col-lg-2 col-xl-2 col-xxl-2">
                        <article>
                            <ul className="list-pn proflist">
                                <li><a href="" className="profilel new" onClick={(e) => showDropdown('profile',e)}><i className="fa fa-lg fa-cog"></i>Settings</a>
                                    <ul className="profsublist list-pn" id="vlan" style={{ display: 'block' }}>
                                        <li className={activeSetting === 'lines' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('lines');setActiveSetting('lines');}}><img src={LinesIcon} alt="line"/> Lines</li>
                                        <li className={activeSetting === 'sections' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('sections');setActiveSetting('sections')}}><img src={SectionIcon} alt="section"/> Sections</li>
                                        <li className={activeSetting === 'stations' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('stations');setActiveSetting('stations')}}><img src={StationIcon} alt="station"/> Stations</li>
                                        <li className={activeSetting === 'waysidetags' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('waysidetags');setActiveSetting('waysidetags')}}><i className="fa-solid fa-tag "></i> Wayside Tags</li>
                                        <li className={activeSetting === 'users' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('users');setActiveSetting('users')}}><img src={UsersIcon} alt="user"/> Users</li>
                                        <li className={activeSetting === 'groups' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('groups');setActiveSetting('groups')}}><img src={GroupsIcon} alt="group"/> Groups</li>
                                        <li className={activeSetting === 'threshold' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('threshold');setActiveSetting('threshold')}}><img src={ThresholdIcon} alt="threshold"/> Threshold</li>
                                        <li className={activeSetting === 'snmpconfig' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('snmpconfig');setActiveSetting('snmpconfig')}}><img src={SnmpIcon} alt="snmp config"/> SNMP Config</li>
                                        <li className={activeSetting === 'notification' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('notification');setActiveSetting('notification')}}><img src={AlarmIcon} alt="notification config"/> Notifications Config</li>
                                        <li className={activeSetting === 'severconfig' ? 'active-menu' : ''} onClick={() =>{ SelectSettingCont('severconfig');setActiveSetting('severconfig')}}><img src={ConfigIcon} alt="sever configuration"/> Server Configurations</li>
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

export default SettPage;