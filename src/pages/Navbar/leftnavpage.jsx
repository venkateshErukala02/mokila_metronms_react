import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import '../ornms.css';
import '../Navbar/leftnavpage.css';
// import '@fortawesome/fontawesome-free/css/all.min.css';


const LeftNavList = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Get the current path

    const handleClick = (path) => {
        navigate(path);  // Navigate directly
    };

    const getActiveIndex = (path) => {
        // Match the current path with the item path and return its index
        const pathToIndex = {
            "/": 0,
            "/Discovery": 1,
            "/Topology": 2,
            "/Wayside": 3,
            "/Event": 4,
            "/Inventory": 5,
            "/Config": 7,
            // "/TestTopo": 7,
            "/Setting": 6
        };
        return pathToIndex[path] ?? null;
    };

    const activeIndex = getActiveIndex(location.pathname); // Get active index from current location

    return (
            <article style={{display:"inline-block"}}>
                <ul className='leftnavlist'>
                    <li onClick={() => handleClick("/")}>
                        
                       <a><i className={`fas fa-lg fa-tachometer-alt ${activeIndex === 0 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Dashboard</span></a> 
                    </li>
                    <li onClick={() => handleClick("/Discovery")}>
                    <a> <i className={`fas fa-lg fa-crosshairs ${activeIndex === 1 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Discovery</span></a>
                    </li>
                    <li onClick={() => handleClick('/Topology')}>
                    <a>  <i className={`fas fa-lg fa-sitemap ${activeIndex === 2 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Topology</span></a>
                    </li>
                    <li onClick={() => handleClick('/Wayside')}>
                    <a><i class={`fa-solid fa-tower-cell ${activeIndex === 3 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Wayside</span></a>
                    </li>
                    {/* <li onClick={() => handleClick('/TestTopo')}>
                    <a>  <i className={`fas fa-lg fa-sitemap ${activeIndex === 6 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">TestTopo</span></a>
                    </li> */}
                    <li onClick={() => handleClick("/Config")}>
                    <a>  <i className={`fa-solid fa-tag ${activeIndex === 7 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Configuration</span></a>
                    </li>
                    <li onClick={() => handleClick("/Event")}>
                    <a>  <i className={`fas fa-lg fa-star ${activeIndex === 4 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Events</span></a>
                    </li>
                    <li onClick={() => handleClick("/Inventory")}>
                    <a>   <i className={`fas fa-lg fa-file-alt ${activeIndex === 5 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Inventory Reports</span></a>
                    </li>
                    <li onClick={() => handleClick("/Setting")}>
                    <a>   <i className={`fas fa-lg fa-cog ${activeIndex === 6 ? 'activee' : ''}`}></i>
                        <span className="tooltipcll">Settings</span></a>
                    </li>
                </ul>
            </article>
    );
};

export default LeftNavList;



