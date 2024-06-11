import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Desk from "./Pages/DesktopLanding";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import From from "./Pages/From";
import ProtectedRoute from "./ProtectedRoute";
import firebaseConfig from '../src/firebase'
import NotProtectedRoute from "./NotProtectedRoute";
import { initializeApp } from "firebase/app";


function App() {

  const [desktopView, setDesktopView] = useState(window.matchMedia('(max-width: 750px)').matches);

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(max-width: 750px)');
    const handleMediaChange = (event) => setDesktopView(event.matches);

    mediaQueryList.addEventListener('change', handleMediaChange);
    return () => mediaQueryList.removeEventListener('change', handleMediaChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<NotProtectedRoute component={desktopView ? Login : Desk} />}
        />
        <Route
          path="/signup"
          element={desktopView ? <Signup /> : <Desk />}
        />
        <Route
          path="/"
          element={desktopView ? <Home /> : <Desk />}
        />
        <Route path="/from" element={<ProtectedRoute component={desktopView ? From : Desk} />} />
        {/* <Route path="/to" element={<ProtectedRoute component={desktopView ? To : Desk} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
