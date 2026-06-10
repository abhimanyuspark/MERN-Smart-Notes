import React from "react";

const Error = ({ error }) => {
  return <div className="text-red-500">{error || "Error..."}</div>;
};

export default Error;
