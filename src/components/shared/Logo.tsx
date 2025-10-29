import React from "react";
import { Link } from "react-router";

const Logo: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
   <Link to='/'>
          <img
            src="/humanistic_language_center.png"
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

export default Logo;
