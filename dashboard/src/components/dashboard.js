import React, { useEffect, useState } from "react";
import CONFIG from "../config";

const Dashboard = () => {
  const [fleetData, setFleetData] = useState([]);
  const [route, setRoute] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  // Fetch IoT fleet data from backend
  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/get_fleet_status`);
        const data = await res.json();
        setFleetData(Object.values(data));
      } catch (error) {
        console.error("Error fetching fleet data:", error);
      }
    };

    const fetchRoutes = async () => {
      try {
        const res = await fetch(`${CONFIG.API_BASE_URL}/get_optimized_routes`);
        const data = await res.json();
        setRoute(data.route);
      } catch (error) {
        console.error("Error fetching optimized routes:", error);
      }
    };

    fetchFleetData();
    fetchRoutes();
    const interval = setInterval(() => {
      fetchFleetData();
      fetchRoutes();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Get User's GPS Location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      console.error("Geolocation not supported in this browser.");
    }
  }, []);

  return (
    <div>
      <h1>IoT Water Collection Fleet Dashboard</h1>

      <h2>Your Location</h2>
      <p>
        Latitude: {userLocation.lat || "Fetching..."} | Longitude: {userLocation.lon || "Fetching..."}
      </p>

      <h2>Fleet Data</h2>
      <ul>
        {fleetData.map((device, index) => (
          <li key={index}>
            Location: {device.lat}, {device.lon} | Humidity: {device.humidity}%
          </li>
        ))}
      </ul>

      <h2>Optimized Route</h2>
      <ul>
        {route.map((point, index) => (
          <li key={index}>Node {index + 1}: {point}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
