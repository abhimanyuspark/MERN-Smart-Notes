import React from "react";

const Error = ({ error }) => {
  return (
    <div className="text-red-500 flex items-center justify-center text-center text-2xl font-bold">
      {error || "Error..."}
    </div>
  );
};

export default Error;
