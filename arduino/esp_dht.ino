#include "DHT.h"

// DHT Sensor Setup
#define DHTPIN 15        // GPIO15 on ESP32
#define DHTTYPE DHT22    // DHT22 sensor type

DHT dht(DHTPIN, DHTTYPE);

float temperature;
float humidity;

void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(2000); // Optional delay for sensor startup
}

void loop() {
  // Reading temperature and humidity
  humidity = dht.readHumidity();
  temperature = dht.readTemperature(); // Celsius

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.print("Temperature: ");
    Serial.print(temperature);
    Serial.print(" °C\t");

    Serial.print("Humidity: ");
    Serial.print(humidity);
    Serial.println(" %");
  }

  delay(2000); // Wait between reads
}
