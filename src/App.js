import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Desk from "./Pages/DesktopLanding";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import From from "./Pages/From";
import To from "./Pages/To";
import ProtectedRoute from "./ProtectedRoute";
import NotProtectedRoute from "./NotProtectedRoute";



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
        <Route exact
          path="/"
          element={desktopView ? <Home /> : <Desk />}
        />
        <Route path="/from" element={<ProtectedRoute component={desktopView ? From : Desk} />} />
        <Route path="/to" element={<ProtectedRoute component={desktopView ? To : Desk} />} />
        <Route path="/chat" component={Chat} />
        <Route path="/chatroom/:name/:my_uid/:his_uid" component={Chatroom} />
      </Routes>
    </Router>
  );
}

export default App;
