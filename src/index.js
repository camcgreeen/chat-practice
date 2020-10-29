import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Route, BrowserRouter as Router } from "react-router-dom";
import LoginComponent from "./login/Login";
import SignupComponent from "./signup/Signup";
import DashboardComponent from "./dashboard/Dashboard";

const firebase = require("firebase");
require("firebase/firestore");

// NORMALLY WOULDN'T EXPOSE ALL THIS INFOMATION IN THE CODE BUT THIS IS A DEMO FOR NOW
firebase.initializeApp({
  apiKey: "AIzaSyDlafddWokEnpEawu0BcWCNnqoEELySEY0",
  authDomain: "chat-tutorial-9ea4e.firebaseapp.com",
  databaseURL: "https://chat-tutorial-9ea4e.firebaseio.com",
  projectId: "chat-tutorial-9ea4e",
  storageBucket: "chat-tutorial-9ea4e.appspot.com",
  messagingSenderId: "270410679168",
  appId: "1:270410679168:web:7e83c04173148a65b2b765",
  measurementId: "G-1YGT74TEX4",
});

const routing = (
  <Router>
    <div id="routing-container">
      <Route path="/login" component={LoginComponent}></Route>
      <Route path="/signup" component={SignupComponent}></Route>
      <Route path="/dashboard" component={DashboardComponent}></Route>
    </div>
  </Router>
);

ReactDOM.render(
  <React.StrictMode>{routing}</React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
