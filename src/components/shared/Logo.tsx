import React from "react";
import { Link } from "react-router";

interface LogoProps {
  className?: string;
  src?: string;
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({
  className,
  src = "/humanistic_language_center.png",
  alt = "Humanistic Language Center Logo",
}) => {
  return (
    <div className={`flex items-center justify-center ${className ?? ""}`}>
      <Link to="/" className="block w-full">
        <img
          src={src}
          alt={alt}
          className="w-full max-h-10 object-contain"
          loading="lazy"
          decoding="async"
        />
      </Link>
    </div>
  );
};

export default Logo;
