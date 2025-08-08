import React from 'react';
import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
import "./index.css";
import RoutesPage from './Routes/routepage';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.min.js';
import { Provider } from 'react-redux';
// import '../src/css/bootstrap.min.css'
import store from './pages/Store/store';
// import "bootstrap-icons/font/bootstrap-icons.css";
import 'font-awesome/css/font-awesome.min.css';
// src/index.js or App.js

// import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Optional for JS features

import '@fortawesome/fontawesome-free/css/all.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
 root.render(
   <Provider store={store}>
    {/* <React.StrictMode> */}
    {/* <BrowserRouter> */}
       <RoutesPage />
    {/* </BrowserRouter> */}
 {/* </React.StrictMode> */}
 </Provider>

    );

 
//  root.render(<UserContextProvider>
//     <SubChildContext/>
//  </UserContextProvider>);


// setInterval(()=>{
//   root.render(<Appo />);

// },1000)
