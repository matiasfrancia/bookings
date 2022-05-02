import React from "react";
import { render } from  "react-dom";
import Navbar from "./Navbar";
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import "../../static/css/App.css";
import Home from './pages/Home';
import AboutUs from "./pages/AboutUs";
import Bookings from "./pages/Bookings";
import Contact from "./pages/Contact";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";

import { PrivateRoute } from "./../utils/PrivateRoute";
import { AuthProvider } from "./../context/AuthContext";

function App() {
  return (
    <>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route exact path='/' element={<Home/>}/>
            <Route exact path='/about-us' element={<AboutUs/>}/>
            <Route exact path='/bookings' element={<Bookings/>}/>
            <Route exact path='/contact' element={<Contact/>}/>
            <Route exact path='/login' element={<LoginPage/>}/>
            <Route exact path='/admin-profile' element={<PrivateRoute><AdminPage/></PrivateRoute>}/>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

const appDiv = document.getElementById("app");
render(<App />, appDiv);
