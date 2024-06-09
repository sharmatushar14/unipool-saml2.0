import React from "react";
import "../CSS/D.scss";
import DesktopMain from "../Assets/Images/D1.png";
import DesktopSide from "../Assets/Images/D2.png";

export default function DesktopLanding() {
  return (
    <div className="desktopWrapper">
      <div className="desktopContainer">
        <div className="desktopHeroWrapper">
          <div className="text">
            <h1 className="orangeText">Oops!, you are currently visiting our website on Desktop</h1>
            <p>We are working on Desktop Mode. Till then, kindly spin up our website over your phone!</p>
          </div>
          <div className="image">
            <img src={DesktopMain} alt="Main Visual" className="mainImg" />
            <img src={DesktopSide} alt="Side Visual" className="sideImg" />
          </div>
        </div>
      </div>
    </div>
  );
}
