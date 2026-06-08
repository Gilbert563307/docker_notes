import React from "react";
import "../../../assets/css/components/BS5Preloader.css";

export default function BS5Preloader() {

  return (
    <div className="preloader-wrapper">
      <div className="spinner-grow text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

