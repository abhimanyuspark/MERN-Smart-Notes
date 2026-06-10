import React from "react";
import Loader from "./Loader";

const PageLoader = () => {
  return (
    <div className="flex justify-center items-center h-screen w-screen absolute top-0 left-0 bg-white/50">
      <Loader />
    </div>
  );
};

export default PageLoader;
