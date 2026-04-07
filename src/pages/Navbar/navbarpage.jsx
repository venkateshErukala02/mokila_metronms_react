import {useState,useEffect} from "react";
import '../ornms.css';
import logo from '../../assets/img/keywestlogo.png'
import {  useDispatch } from 'react-redux';
import { handleLoginUserData, toggleVisibility } from '../Action/action';
import '../Navbar/navbarpage.css';
import { useNavigate } from "react-router-dom";

const Navbar = () => {
        const [userData, setUserData] = useState({});
        const [isLoading, setIsLoading] = useState(false)
        const [isError, setIsError] = useState({ status: false, msg: "" }) 
        const [userLoginData,setUserLoginData] = useState([])
        const navigate = useNavigate();

        let triggerCount = 12;

        const getData = async () => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" })
            try {
                const username = "admin";
                const password = "admin";
                const token = btoa(`${username}:${password}`);
             const url = 'api/v2/nodelinks/serverstats'

                const options = {
                    method: "GET",
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(url, options)
                const data = await response.json();
                if (response.ok) {
                    setIsLoading(false);

                    setUserData(data);
                    setIsLoading(false);
                    setIsError({ status: false, msg: "" });
    
                } else {
                    throw new Error("data not found");
                }
    
            } catch (error) {
                if(error.name === 'TypeError'){
                    if(triggerCount === 0){
                        window.location.href = 'login.jsp';
                    }else{
                        triggerCount--; 
                    }
                }
                setIsLoading(false)
                setIsError({ status: true, msg: error.message })
            }
        }
    
        useEffect(() => {
            const intervalId = setInterval(() => {
                getData();
            }, 5000); 
    
            return () => clearInterval(intervalId);
        }, [])

         useEffect(() => {
             getData();
        }, []);


        const getLoginUserData = async () => {
            setIsLoading(true);
            setIsError({ status: false, msg: "" })
            try {
             const url = 'api/v2/dashboard/currentuser'

                const options = {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }
                const response = await fetch(url, options)
                const data = await response.json();
                if (response.ok) {
                    dispatch(handleLoginUserData(data)); 
                    setIsLoading(false);
                    setUserLoginData(data);
                    setIsLoading(false);
                    setIsError({ status: false, msg: "" });
    
                } else {
                    throw new Error("data not found");
                }
    
            } catch (error) {
                setIsLoading(false)
                setIsError({ status: true, msg: error.message })
            }
        }
    
        useEffect(() => {        
                getLoginUserData();
            }, [])


        const dispatch = useDispatch();
    
    const handleToggle = () => {
        dispatch(toggleVisibility());
      };

  
  return (
    <>
    <article>
    <section className="container-fluid">
        <article className="row navheader" id='landpage' style={{position:"relative"}}> 
            <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <a  onClick={handleToggle}><i className="fas fa-2x fa-bars accentColor" style={{paddingTop:'10px',paddingLeft:'10px'}}></i></a>
           <img src={logo} alt="logo" />
            </article>
            <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
            <ul className="navlistone" style={{marginTop:'15px'}}>
                    <li>
                        <h6>Memory: <span>{userData.freeMemory} MB ({userData.totalMemory} MB) </span></h6>
                    </li>
                    <li>
                        <h6>System Load: <span>{userData.systemLoad} %</span></h6>
                    </li>
                    <li>
                        <h6>Process Load: <span>{userData.processLoad} %</span></h6>
                    </li>
                    <li>
                        <h6>Up Time: <span>{userData.serverUpTime}</span></h6>
                    </li>
                </ul>
            </article>
            <article className="col-sm-1 col-md-1 col-lg-1 col-xl-1 col-xxl-1">
            <ul className="navlisttwo">
                    <li>
                        <h6>{userLoginData.currentUser}</h6>
                    </li>
                    <li>
                        <a href="j_spring_security_logout">
                    <i className="fa fa-sign-out fa-2x accentColor"></i>
                    </a>
                    </li>
                </ul>
              
            </article>
        </article>
    </section>
    </article>
    </>
   
  );
};

export default Navbar;