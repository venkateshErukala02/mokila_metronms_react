import React from "react";
import './ornms.css';



const Login = ()=>{
    return (
        <section className="clearfix wrapper">
            <article className="clearfix inner-wrapper">
                <article className="clearfix block-row white-bg" style={{padding: '93px 30% 2px 24%'}}>
                    <article  style={{backgroundColor:'rebeccapurple',paddingBottom:'35px'}}>
            <div className="clearfix log-lf logimg">
                <article className="clearfix" style={{maxWidth:"400px",margin:'auto'}}>
                <h1 className="clnu"><span>OR</span>NMS</h1>
                <hr />
                <p className="clearfix managp">Manages and Monitors your Critical Infrastructure</p>
                </article>
                <img src="/images/lpgimg.png" alt="" />
            </div>
            </article>
            <article className="clearfix log-rh">
               <ul className="clearfix formli">
                <li>
                    
                    <div class="box-8">
                     <input type="text" className="form-control searchbar" placeholder="Username"/>
                    </div>
                </li>
                <li>
                    <div class="box-8">
                     <input type="text" className="form-control searchbar" placeholder="Password" />
                    </div>
                </li>
                <li>
                    <button className="clearfix logbnt">Login</button>
                </li>
               </ul>
            </article>
            </article>
            <p className="clearfix copara">© 2021, Copyright KEYWEST NETWORKS. ALL RIGHTS RESERVED.</p>
            </article>
        </section>
    )
}

export default Login;