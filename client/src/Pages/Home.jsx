import React from "react";
import "../CSS/landing.scss";
import landingSVG from "../Assets/Images/landingpage.svg";
import human1 from "../Assets/Images/human1.svg";
import human2 from "../Assets/Images/human2.svg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    window.location.href = 'https://unipoolsamlapi.vercel.app/login'; // Redirects to the Okta login route
  };

  return (
    <div className="page landing">
      <h1>Unipool</h1>
      <h2>Carpooling made Easier</h2>
      <img
        src={landingSVG}
        className="landingSVG"
        alt="Taxi fare too high? Split it"
      />
      <div className="lowerLanding">
        <img src={human1} className="humansvg" alt="humans" />
        <button
          onClick={handleLoginRedirect}
        >
          Get Splitting {">"}
        </button>
        <img src={human2} className="humansvg" alt="humans" />
      </div>
    </div>
  );
}

export default Home;
