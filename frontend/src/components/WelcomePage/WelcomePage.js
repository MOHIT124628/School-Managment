import React from "react";
import LiquidEther from "../LiquidEther/LiquidEther";
import "./WelcomePage.css";

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      {/* Liquid background */}
      <LiquidEther />

      {/* Centered text */}
      <div className="welcome-text-wrapper">
        <h1 className="welcome-text">Welcome to School System</h1>
        <h2 className="welcome-subtext">Where dreams come true</h2>
      </div>
    </div>
  );
}
