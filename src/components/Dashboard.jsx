import React from "react";
import WeatherCard from "./WeatherCard";
import Forecast from "./Forecast";

const Dashboard = ({ currentLocation }) => {
  return (
    <>
      <WeatherCard currentLocation={currentLocation} />
      <Forecast currentLocation={currentLocation} />
    </>
  );
};

export default Dashboard;
