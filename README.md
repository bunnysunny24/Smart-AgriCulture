# 🌱 Smart Agriculture System – IoT-Based Environmental Monitoring

A compact, cost-effective IoT solution for real-time environmental monitoring in agriculture using Arduino Nano, ESP32, and multiple sensors. Designed for local alerts, cloud data visualization, and scalable remote monitoring.

---

## 📺 YouTube Demonstration

📽️ **Watch our project in action here:**  
[![Smart Agriculture Demo](https://img.youtube.com/vi/qQsXntXo7Y0/0.jpg)](https://www.youtube.com/watch?v=qQsXntXo7Y0)  
🔗 [https://www.youtube.com/watch?v=qQsXntXo7Y0](https://www.youtube.com/watch?v=qQsXntXo7Y0)

---

## 📦 Features

- Real-time sensing of:
  - Air Quality (MQ135)
  - Temperature & Humidity (DHT22)
  - Light Intensity (LDR)
  - Soil Moisture (Analog Sensor)
- Local display via 128x64 OLED (SSD1306)
- Audible alerts using a buzzer on unsafe thresholds
- Serial communication between Arduino Nano and ESP32
- Cloud dashboard via [ThingSpeak](https://thingspeak.com/)
- Optional local API data logging via [FastAPI](https://fastapi.tiangolo.com/)
- Extensible frontend dashboard with React

---

## ⚙️ Hardware Components

| Component             | Description                          |
|----------------------|--------------------------------------|
| Arduino Nano          | Sensor data acquisition + local display |
| ESP32                | WiFi-enabled gateway for cloud/API   |
| MQ135 Gas Sensor     | Measures air pollutants              |
| DHT22 Sensor         | Measures temperature & humidity      |
| LDR                  | Detects light intensity (day/night)  |
| Soil Moisture Sensor | Analog moisture level in soil        |
| OLED SSD1306         | I2C 128x64 OLED display              |
| Buzzer               | Alerts for critical conditions        |
| Breadboard + Wires   | Circuit prototyping & wiring         |

---

## 🧰 Software Requirements

- Arduino IDE (with required libraries)
- FastAPI (Python 3.10+ for backend)
- React (for optional frontend dashboard)
- ThingSpeak account for cloud analytics

**Arduino Libraries Used:**
- `DHT.h`
- `Wire.h`
- `Adafruit_GFX.h`
- `Adafruit_SSD1306.h`

---

## 🔌 Circuit Connections

| Sensor/Module       | Arduino Nano Pin   |
|---------------------|--------------------|
| MQ135               | A0                 |
| Soil Moisture       | A1                 |
| DHT22               | D2                 |
| LDR (Digital)       | D3                 |
| Buzzer              | D11                |
| OLED SSD1306 (I2C)  | A4 (SDA), A5 (SCL) |

ESP32 is connected via UART (Nano TX → ESP32 RX)

---

## 🚨 Buzzer Trigger Conditions

- **Air Quality** > 400 (analog reading)
- **Temperature** > 30°C

---

## 📟 OLED Display Info

The screen updates every 2 seconds with:
- Air Quality (Analog)
- Light Level (Bright/Dark)
- Temperature (°C)
- Humidity (%)
- Soil Moisture (Analog)

---

## ☁️ Data Transmission Architecture

```plaintext
Sensors --> Arduino Nano --> OLED + Buzzer
                      |
                      +--> Serial (TX) --> ESP32 --> ThingSpeak + FastAPI
