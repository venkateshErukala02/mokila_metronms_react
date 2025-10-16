import React,{useState,useEffect} from "react";
import '../ornms.css';
import logo from '../../assets/img/keywestlogo.png'
import {  useDispatch } from 'react-redux';
import { toggleVisibility } from '../Action/action';
import '../Navbar/navbarpage.css';

// const dataString = {
//     "totalMemory": 31916,
//     "systemLoad": "1.37",
//     "serverUpTime": "1:01:22:10",
//     "processLoad": "0.5",
//     "freeMemory": 9913
// }

const Navbar = () => {

     const [userData, setUserData] = useState({});
        const [isLoading, setIsLoading] = useState(false)
        const [isError, setIsError] = useState({ status: false, msg: "" }) 
    
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
                setIsLoading(false)
                setIsError({ status: true, msg: error.message })
            }
    
            // try {
            //     //   const username = "admin";
            //     //    const password = "admin";
            //     //   const token = "YWRtaW46YWRtaW4=";
            //       // const encodedToken = btoa(token);  // This base64-encodes the string "admin:admin"
            
            //      const url = 'http://localhost:8980/skypoint/api/v2/nodelinks/serverstats';
            //       // const url = '/ornms/api/v2/dashboard/networkstatus?filter=productCode&ar=';
            
            //       const headers = new Headers();
            //       //  headers.set('Authorization', 'Basic ' + btoa(username + ":" + password));
                  
            //       //   headers.set('Authorization', `Bearer ${token}`);
            //       //   headers.set('Accept-Encoding', 'gzip, deflate, br');
            //       //   headers.set('Connection', 'keep-alive');
            //       //   headers.set('Cookie', 'JSESSIONID=node01bp4i25ustv59jxlislq3auqv11.node0; JSESSIONID=node013n35ht4gctf8s0skqh00gl9t1.node0');
            //       //  headers.set('Accept', 'application/json, text/plain, */*');
            //       //  headers.set('Accept-Language', 'en-US,en;q=0.9');
            //       //  headers.set('Referer', 'http://192.168.31.249:8980/ornms/index.html');
            //       //  headers.set('Content-Type', 'application/json');
            //       //  headers.set('Authorization', `Bearer ${token}`);
            //       //  headers.set('Cache-Control', 'no-cache');
            
            //       //         headers.set('X-Requested-With', 'XMLHttpRequest');
            //       //  headers.set('X-Requested-With', 'XMLHttpRequest');
            //       headers.append('Origin','http://localhost:3002');
            
            //       headers.append('Content-Type', 'application/json');
            //       headers.append('Accept', 'application/json');
            //     //   headers.append('Authorization', 'Basic ' + btoa(username + ":" +  password));
            //       headers.append('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
            //       headers.set('Cookie', 'JSESSIONID=node0fr7r1h450lhr9agsyockb9kq6.node0; JSESSIONID=node0m5hnt836ho641dfqbsjkxg9d94.node0');
            //       const options = {
            //         method: "GET",
            //         headers: headers,
            //         // mode: "no-cors",
            //        credentials: 'include', 
            //       };
            
            //       const response = await fetch(url, options);
            //       // const newOne = await response;
            //       // console.log("text", newOne);
            //       console.log("Response Status:", response.status); // Logs the status code
            //       console.log("Response Headers:", response.headers);
            //       console.log("hellolo",response);
            //       if (response.ok) {
            //         const data = await response.json();
            //         console.log("hhhl",data);
            //         setIsLoading(false);
            //         setUserData(data); 
            //         setIsError({ status: false, msg: "" }); 
            //       } else {
            //         throw new Error("Data not found or unauthorized access");
            //       }
            //     } catch (error) {
            //       setIsLoading(false);
            //       setIsError({ status: true, msg: error.message });
            //     }
        }
    
        useEffect(() => {
            //  getData();

            const intervalId = setInterval(() => {
                getData();
            }, 5000); 
    
            return () => clearInterval(intervalId);
        }, [])

         useEffect(() => {
             getData();
        }, []);


        const dispatch = useDispatch();
    
    const handleToggle = () => {
        dispatch(toggleVisibility()); // Dispatch the toggle action
      };

      const tokenAdd = localStorage.getItem('password');
    //   console.log('ooooo',tokenAdd);
      

      const handleLogout=()=>{
            
      }
  
  return (
    <section className="container-fluid">
        <article className="row navheader" id='landpage' style={{position:"relative"}}> 
            <article className="col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
            <a  onClick={handleToggle}><i class="fas fa-2x fa-bars accentColor" style={{paddingTop:'10px',paddingLeft:'10px'}}></i></a>
           <img src={logo} alt="logo" />
            </article>
            <article className="col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">
            <ul className="clearfix navlistone" style={{marginTop:'15px'}}>
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
            <ul className="clearfix navlisttwo">
                    <li>
                        <h6>admin</h6>
                    </li>
                    <li onClick={handleLogout}>
                        <a href="login.jsp">
                    <i className="fa fa-sign-out fa-2x accentColor"></i>
                    </a>
                    </li>
                </ul>
              
            </article>
        </article>
        {/* <article>
            <h1>Events</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio tempore accusamus aliquam quo. Placeat quibusdam odio ea molestiae doloribus quos cumque? Accusamus quam assumenda alias libero nostrum reprehenderit repellendus officia.</p>
            <div>

            </div>
        </article> */}
    </section>
    
   
  );
};

export default Navbar;