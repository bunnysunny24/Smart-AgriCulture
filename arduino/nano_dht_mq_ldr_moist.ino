#include <DHT.h>

// Pin definitions
#define MQ135_PIN A0     // MQ135 Air Quality sensor (analog)
#define DHTPIN 2         // DHT22 data pin
#define DHTTYPE DHT22    // DHT22 type
#define LDR_PIN 3        // LDR digital pin
#define SOIL_PIN A1      // Soil moisture analog pin

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(LDR_PIN, INPUT); // LDR as digital input
}

void loop() {
  // Read MQ135 value
  int mq135Value = analogRead(MQ135_PIN);

  // Read soil moisture
  int soilMoistureValue = analogRead(SOIL_PIN);

  // Interpret soil moisture status
  String soilStatus;
  if (soilMoistureValue < 300) {
    soilStatus = "Wet";
  } else if (soilMoistureValue < 700) {
    soilStatus = "Moist";
  } else {
    soilStatus = "Dry";
  }

  // Read temperature & humidity
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  // Read LDR value
  int ldrStatus = digitalRead(LDR_PIN); // 0 = Bright, 1 = Dark

  // Print DHT values
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.print("MQ135: ");
    Serial.print(mq135Value);
    Serial.print(", Light: ");
    Serial.print(ldrStatus == 0 ? "Bright" : "Dark");
    Serial.print(", Temp: ");
    Serial.print(temperature);
    Serial.print("°C, Hum: ");
    Serial.print(humidity);
    Serial.print("%, Soil: ");
    Serial.print(soilMoistureValue);
    Serial.print(" (");
    Serial.print(soilStatus);
    Serial.println(")");
  }

  delay(2000);
}
