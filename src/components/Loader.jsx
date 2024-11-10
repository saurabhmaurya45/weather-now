import React from "react";

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white bg-opacity-80">
      <div className="w-24 h-24 border-8 border-gray-200 border-t-8 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );
};

export default Loader;
