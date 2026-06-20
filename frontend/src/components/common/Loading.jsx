import React from "react";

const Loading = () => {
  return (
    <>
      <div className="flex items-center justify-center">
        <div
          className="loader text-2xl font-bold text-primary"
          style={{
            background:
              "linear-gradient(currentColor 0 0) 0 100% / 0% 3px no-repeat",
          }}
        >
          Loading...
        </div>
      </div>

      <style>{`
        @keyframes loading-line {
          to {
            background-size: 100% 3px;
          }
        }

        .loader {
          width: fit-content;
          padding-bottom: 8px;
          animation: loading-line 2s linear infinite;
        }
      `}</style>
    </>
  );
};

export default Loading;
