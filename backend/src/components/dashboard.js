import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [fleetData, setFleetData] = useState([]);
  const [route, setRoute] = useState([]);

  useEffect(() => {
    const fetchFleetData = async () => {
      const res = await fetch("http://your-server-ip/get_fleet_status");
      const data = await res.json();
      setFleetData(Object.values(data));
    };

    const fetchRoutes = async () => {
      const res = await fetch("http://your-server-ip/get_optimized_routes");
      const data = await res.json();
      setRoute(data.route);
    };

    fetchFleetData();
    fetchRoutes();
    const interval = setInterval(() => {
      fetchFleetData();
      fetchRoutes();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h1>IoT Water Collection Fleet Dashboard</h1>
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
