import React from "react";

const Button = ({ text, type }) => {
  return (
    <button type={type} className="btn btn-secondary">
      {text}
    </button>
  );
};

export default Button;
