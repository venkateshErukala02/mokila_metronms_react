import React from "react";
import './ornms.css';



const Login = ()=>{
    return (
        <section className="wrapper">
            <article className="inner-wrapper">
                <article className="block-row white-bg" style={{padding: '93px 30% 2px 24%'}}>
                    <article  style={{backgroundColor:'rebeccapurple',paddingBottom:'35px'}}>
            <div className="log-lf logimg">
                <article style={{maxWidth:"400px",margin:'auto'}}>
                <h1 className="clnu"><span>OR</span>NMS</h1>
                <hr />
                <p className="managp">Manages and Monitors your Critical Infrastructure</p>
                </article>
                <img src="/images/lpgimg.png" alt="" />
            </div>
            </article>
            <article className="log-rh">
               <ul className="formli">
                <li>
                    
                    <div className="box-8">
                     <input type="text" className="form-control searchbar" placeholder="Username"/>
                    </div>
                </li>
                <li>
                    <div className="box-8">
                     <input type="text" className="form-control searchbar" placeholder="Password" />
                    </div>
                </li>
                <li>
                    <button type="button" className="logbnt">Login</button>
                </li>
               </ul>
            </article>
            </article>
            <p className="copara">© 2021, Copyright KEYWEST NETWORKS. ALL RIGHTS RESERVED.</p>
            </article>
        </section>
    )
}

export default Login;