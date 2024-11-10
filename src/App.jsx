import { useEffect, useState } from "react";
import { Dashboard, Header, Loader } from "./components";

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, long: longitude });
        },
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 19.0840832,
    long: 72.8727552,
    longName: "Mumbai, Maharashtra, India ",
  });
  const [loading, setLoading] = useState(false);

  async function getReverseGeoLocation(lat, long) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${long}&apiKey=${
        import.meta.env.VITE_REVERSE_GEO_CODE
      }`
    );
    const { features } = (await res.json()) ?? {};
    if (features) {
      const { city, state, country } = features[0]?.properties;
      return `${city ? city + ", " : ""}${state ? state + ", " : ""}${
        country ? country : ""
      } `;
    }
  }

  useEffect(() => {
    async function fetchLocation() {
      try {
        setLoading(true);
        const { lat, long } = await getCurrentLocation();
        if (lat && long) {
          const address = await getReverseGeoLocation(lat, long);
          setCurrentLocation({ lat, long, longName: address });
        }
      } catch (error) {
        console.error("Failed to get current location:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, []);
  if (loading) {
    return <Loader />;
  }
  return (
    <div>
      <Header
        setCurrentLocation={setCurrentLocation}
        currentLocation={currentLocation}
      />
      <div className="mt-16">
        <Dashboard currentLocation={currentLocation} />
      </div>
    </div>
  );
}

export default App;
