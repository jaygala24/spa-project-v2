import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import './fonts/Nunito-Light.ttf';
import './fonts/Nunito-Regular.ttf';
import './fonts/Nunito-SemiBold.ttf';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
