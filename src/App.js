import "./CSS/App.scss";
import {useEffect,React} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Desk from "./Pages/DesktopLanding"
import Login from "./Pages/Login";
import firebaseConfig from "./firebase";
import { initializeApp } from "firebase/app";
import Signup from "./Pages/Signup";
import ProtectedRoute from "./ProtectedRoute";
import NotProtectedRoute from "./NotProtectedRoute";

// one user

function App() {
	const app = initializeApp(firebaseConfig);
	let mediaqueryList = window.matchMedia('(max-width: 750px)')
	let desktopView = mediaqueryList.matches; 
	useEffect(() => {
	 desktopView = mediaqueryList.matches;
		console.log("HIII",{mediaqueryList,desktopView})
	}, [mediaqueryList,desktopView])
   
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<NotProtectedRoute component={desktopView ? Login : Desk} />} />
        <Route path="/signup" element={desktopView ? <Signup /> : <Desk />} />
        <Route path="/" element={desktopView ? <Home /> : <Desk />} />
        {/* <Route path="/from" element={<ProtectedRoute component={desktopView ? From : Desk} />} />
        <Route path="/to" element={<ProtectedRoute component={desktopView ? To : Desk} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
