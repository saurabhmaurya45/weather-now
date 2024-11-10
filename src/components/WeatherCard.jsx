import React, { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent, Grid, Box, Typography } from "@mui/material";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import WavesIcon from "@mui/icons-material/Waves";
import OpacityIcon from "@mui/icons-material/Opacity";
import GrainIcon from "@mui/icons-material/Grain";
import autumn from "../assets/autumn.png";
import temperature from "../assets/temperature.png";
import pressure from "../assets/pressure.png";
import windSpeed from "../assets/windSpeed.png";
import Loader from "./Loader";

const cardDetails = {
  wind: {
    icon: <WavesIcon />,
    title: "Wind",
    description: "Today's Wind Speed",
    value: "",
    logo: windSpeed,
  },
  humidity: {
    icon: <OpacityIcon />,
    title: "Humidity",
    description: "Today's Humidity",
    value: "",
    logo: autumn,
  },
  pressure: {
    icon: <GrainIcon />,
    title: "Pressure",
    description: "Today's Pressure",
    value: "",
    logo: pressure,
  },
  temperature: {
    icon: <ThermostatIcon />,
    title: "Temperature",
    description: "Today's Temperature",
    value: "",
    logo: temperature,
  },
};

const WeatherCard = ({ currentLocation }) => {
  const { lat, long } = currentLocation;
  const [weatherData, setWeatherData] = useState(null);
  const cardData = useRef(cardDetails);
  const [loading, setLoading] = useState(false);

  const fetchWeatherData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${
          import.meta.env.VITE_WEATHER_API_KEY
        }`
      );
      if (response.ok) {
        const data = await response.json();
        setWeatherData(data);
        const updates = {
          wind: data?.wind?.speed + " km/h",
          humidity: data?.main?.humidity,
          pressure: data?.main?.pressure,
          temperature: kelvinToCelsius(data?.main?.temp).toFixed(2) + " °C",
        };

        Object.keys(updates).forEach((key) => {
          cardData.current[key] = {
            ...cardData.current[key],
            value: updates[key],
          };
        });
      } else {
        console.error("Failed to fetch weather data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (lat && long) {
      fetchWeatherData();
    }
  }, [fetchWeatherData]);

  function formatTime(timestamp) {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    const formattedTime =
      (hours % 12) +
      ":" +
      minutes.substr(-2) +
      " " +
      (hours >= 12 ? "PM" : "AM");
    return formattedTime;
  }
  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  const temperatureInKelvin = weatherData?.main?.temp;
  const temperatureInCelsius = kelvinToCelsius(temperatureInKelvin);
  if (loading) {
    return <Loader />;
  }
  return (
    <Grid container className="px-8 md:px-16 lg:px-36 py-4">
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12}>
          {weatherData && (
            <Card
              variant="outlined"
              sx={{ backgroundColor: "rgba(111,93,165 ,0.1)" }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="h5">
                  {currentLocation?.longName}
                </Typography>
                <Box
                  display={"flex"}
                  justifyContent={"space-around"}
                  gap={10}
                  sx={{ marginBottom: 3, marginTop: 5 }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={"column"}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <WbSunnyIcon /> Sunrise
                    </Typography>
                    <Typography variant="body1">
                      {formatTime(weatherData.sys.sunrise)}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection={"column"}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <NightsStayIcon /> Sunrise
                    </Typography>

                    <Typography variant="body1">
                      {formatTime(weatherData.sys.sunset)}
                    </Typography>
                  </Box>
                </Box>
                <Grid item sx={{ textAlign: "center" }}>
                  <Typography variant="h2" sx={{ marginBottom: 2 }}>
                    {temperatureInCelsius.toFixed(2)}°C
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ marginBottom: 4 }}
                    className="capitalize"
                  >
                    {weatherData.weather[0].description}
                  </Typography>
                </Grid>
                <Grid item display={"flex"} justifyContent="center" gap={10}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ThermostatIcon /> Max Temp
                    </Typography>
                    <Typography variant="body2">
                      {weatherData?.main.temp_max}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <ThermostatIcon /> Min Temp
                    </Typography>
                    <Typography variant="body2">
                      {(weatherData.main.temp_min - 20).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {Object.keys(cardData.current)?.map((key) => {
          const { icon, title, description, value, logo } =
            cardData.current[key];
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Card
                variant="outlined"
                sx={{
                  backgroundColor: "rgb(236,243,248)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <CardContent className="flex flex-col gap-2">
                  <h2 className="info-title flex text-nowrap gap-2 ">
                    {icon} {title}
                  </h2>
                  <p className="info-description">{description}</p>
                  <h3 className="info-value">{value}</h3>
                </CardContent>
                <CardContent>
                  <Box>
                    <img src={logo} alt="" style={{ width: "100px" }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
};

export default WeatherCard;
