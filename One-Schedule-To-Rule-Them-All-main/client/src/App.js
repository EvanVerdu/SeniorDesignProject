    import React from 'react';
    import './App.css';
    import "bootstrap/dist/css/bootstrap.min.css";

    //Importing react router dom for routing
    import {
        BrowserRouter, Routes, Route
    } from "react-router-dom";
  
    //Here we import our components from the component folder
    import HomePage from "./components/homePage.component";
    import LoginPage from './components/LoginPage.component';
    import AccountOptionsPage from './components/accountOptionsPage.component';
    import SchedulePage from './components/schedulePage.component';
    import DebugMenu from './components/debugMenu.component';   
    import MasterSchedule from './components/masterSchedulePage.component';
    import SearchSchedulePage from './components/searchSchedule.component';
    import Navbar from './components/navbar.component';
import RequestsPage from './components/requestsPage.component';

function App() {

    let token = localStorage.getItem("user");

    //If a user is not logged in, they will be forced to see the login screen no matter what routing they choose
    if(!token) {
        return <LoginPage/>
    };


    //Otherwise, give access to all components.
    return (
        <div className="wrapper">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path = "/" element={<HomePage />}></Route>
                    <Route path = "/accountOptions" element={<AccountOptionsPage />}></Route>
                    <Route path = "/schedulePage" element={<SchedulePage />}></Route>
                    <Route path = "/debugMenu" element={<DebugMenu />}></Route>
                    <Route path = "/masterSchedule" element={<MasterSchedule />}></Route>
                    <Route path = "/searchSchedule" element={<SearchSchedulePage />}></Route>
                    <Route path = "/requests" element={<RequestsPage />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;