# IoT-Driven Atmospheric Water Harvesting System 🌍💧

### Overview
An AI-powered IoT system that autonomously collects water from atmospheric humidity using mobile water collection units. The system leverages GPS, AI-based fleet optimization, and renewable energy.

### Features
✅ ESP32 IoT sensors for real-time data collection  
✅ AI-optimized fleet routing using Google OR-Tools  
✅ Web dashboard for real-time monitoring  
✅ GPS-based humidity tracking for efficient water collection  

### Tech Stack
- **IoT:** ESP32, DHT22, TinyGPS++
- **Backend:** Flask, AI Optimization, OR-Tools
- **Frontend:** React, WebSockets, GPS API
- **Power:** Solar & Wind Energy

ESP32 devices collect humidity, temperature, and GPS data, sending it to the backend server.
The Flask server stores live IoT data and optimizes fleet routes using AI.
React dashboard fetches real-time data, showing water collection status and optimal movement paths.
The IoT fleet autonomously moves to high-humidity areas, maximizing water collection while running on solar power.
Scalability & Future Enhancements
Edge AI on ESP32 → Apply on-device ML models to make real-time decisions.
Decentralized MQTT Communication → Replace HTTP with MQTT protocol for low-latency data transmission.
Full Automation.

### Installation
1. **Backend**
```bash
cd backend
pip install -r requirements.txt
python app.py
