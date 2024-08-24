import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl text-center my-4">Choose a Restaurant</h1>
      <div className="flex justify-center space-x-4">
        <Link to="/restaurant/1" className="p-4 bg-blue-500 text-white rounded">
          Bawarchi Craters
        </Link>
        <Link
          to="/restaurant/2"
          className="p-4 bg-green-500 text-white rounded"
        >
          Sharan Di Hatti
        </Link>
      </div>
    </div>
  );
};

export default Home;
