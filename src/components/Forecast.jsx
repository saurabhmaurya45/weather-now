import React, { useState, useEffect } from "react";
import { Typography, Grid, Card, CardContent, Paper } from "@mui/material";
import Loader from "./Loader";

const Forecast = ({ currentLocation }) => {
  const { lat, long } = currentLocation;
  const [forecastData, setForecastData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchForecast = async () => {
    try {
      setLoading(true);
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${apiKey}&units=metric`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch forecast data");
      }
      const data = await response.json();
      setForecastData(data.list);
      setSelectedDay(getDayName(new Date(data.list[0].dt_txt)));
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lat && long) {
      fetchForecast();
    }
  }, [currentLocation]);

  const handleDayChange = (day) => {
    setSelectedDay(day);
  };

  const getDayName = (date) => {
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const getUniqueDays = () => {
    const uniqueDays = [];
    forecastData.forEach((item) => {
      const day = getDayName(new Date(item.dt_txt));
      if (!uniqueDays.includes(day)) {
        uniqueDays.push(day);
      }
    });
    return uniqueDays;
  };

  const DayCard = ({ dayName, isActive, onClick }) => {
    return (
      <Paper
        elevation={isActive ? 5 : 1}
        className="hover:!bg-[rgba(213,166,189,0.3)] cursor-pointer p-5"
        style={{
          backgroundColor: isActive ? "rgba(213,166,189,0.9)" : "transparent",
        }}
        onClick={onClick}
      >
        <Typography variant="h6" align="center">
          {dayName}
        </Typography>
      </Paper>
    );
  };

  const filterForecastByDay = (day) => {
    return forecastData.filter(
      (item) => getDayName(new Date(item.dt_txt)) === day
    );
  };
  if (loading) {
    return <Loader />;
  }
  return (
    <div className="px-5 pb-10">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={2}>
          {getUniqueDays().map((day, index) => (
            <DayCard
              key={index}
              dayName={day}
              isActive={selectedDay === day}
              onClick={() => handleDayChange(day)}
            />
          ))}
        </Grid>
        <Grid item xs={12} sm={6} md={8}>
          <Card
            sx={{ backgroundColor: "rgba(111,93,165 ,0.1)", height: "100%" }}
          >
            <CardContent>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <table className="w-full text-center">
                  <thead>
                    <tr className="">
                      <th className="uppercase text-sm">Time</th>
                      <th className="uppercase text-sm">Temperature (°C)</th>
                      <th className="uppercase text-sm">Humidity (%)</th>
                      <th className="uppercase text-sm">Wind Speed (m/s)</th>
                      <th className="uppercase text-sm">Weather</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filterForecastByDay(selectedDay).map((item, index) => (
                      <tr
                        key={index}
                        className="border-t h-10 hover:bg-gray-200"
                      >
                        <td className="text-center">
                          {new Date(item.dt_txt).toLocaleTimeString()}
                        </td>
                        <td className="text-center">{item.main.temp} °C</td>
                        <td className="text-center">{item.main.humidity}%</td>
                        <td className="text-center">{item.wind.speed} m/s</td>
                        <td className="text-center capitalize">
                          {item.weather[0].description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Forecast;
