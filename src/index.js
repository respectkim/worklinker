// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter } from 'react-router-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import Main from './Main';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//     <BrowserRouter>
//     <Main></Main>
//    </BrowserRouter>
// );  

// reportWebVitals();

  //  </React.StrictMode>
     /* <App /> */
  
  //  </React.StrictMode>


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals


import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import Router from './router';   // ⭐ router.js 사용
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>
);

reportWebVitals();