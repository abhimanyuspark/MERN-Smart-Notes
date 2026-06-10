import { useState } from "react";

export default function Toggle({ checked = false, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
        checked ? "bg-blue-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
          checked ? "translate-x-7" : ""
        }`}
      />
    </button>
  );
}
