#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>
#include <TinyGPS++.h>
#include <HardwareSerial.h>

#define DHTPIN 4
#define DHTTYPE DHT22
DHT dht(DHTPIN, DHTTYPE);

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverURL = "http://your-server-ip/update";

TinyGPSPlus gps;
HardwareSerial neogps(1);

void setup() {
    Serial.begin(115200);
    neogps.begin(9600, SERIAL_8N1, 16, 17);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Connecting...");
    }
    dht.begin();
}

void loop() {
    float humidity = dht.readHumidity();
    float temperature = dht.readTemperature();
    double lat = 0.0, lon = 0.0;
    while (neogps.available() > 0) {
        if (gps.encode(neogps.read())) {
            lat = gps.location.lat();
            lon = gps.location.lng();
        }
    }
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(serverURL);
        http.addHeader("Content-Type", "application/json");
        String payload = "{";
        payload += "\"humidity\": " + String(humidity) + ",";
        payload += "\"temperature\": " + String(temperature) + ",";
        payload += "\"lat\": " + String(lat) + ",";
        payload += "\"lon\": " + String(lon);
        payload += "}";
        int httpResponseCode = http.POST(payload);
        http.end();
    }
    delay(30000);
}
