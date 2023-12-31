import React from "react";
import { logoNoBg, logoNew } from "../../assets";
import { Link } from "react-router-dom";
import "./style.css";

const Logo = ({ customCss, hideName = false }) => {
  return (
    <Link
      to={"/"}
      className={`max-w-max ${customCss}`}
    >
      <div className="flex gap-1.5 items-center">
        <div className="w-12 phlogo">
          <img 
            src={logoNew}
            alt="Project Hub logo"
            className="w-full h-full"
          />
        </div>
        {!hideName && <h1 className="font-bold text-xl">Project Hub</h1>}
      </div>
    </Link>
  );
};

export default Logo;
