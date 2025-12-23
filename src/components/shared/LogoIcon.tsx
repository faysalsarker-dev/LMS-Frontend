import React from "react";
import { Link } from "react-router";

const LogoIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
   <Link to='/'>
          <img
            src="/humanistic.png"
            alt="Humanistic Language Center Logo"
            width={150}     
            height={60}    
            className="object-contain"
            loading="lazy"
            decoding="async"
          />
   </Link>
    </div>
  );
};

export default LogoIcon;
