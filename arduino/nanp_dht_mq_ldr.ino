#include <DHT.h>

// Pin definitions
#define MQ135_PIN A0     // MQ135 sensor (analog)
#define DHTPIN 2         // DHT22 data pin
#define DHTTYPE DHT22    // DHT22 type
#define LDR_PIN 3        // Digital output from LDR module

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(LDR_PIN, INPUT); // LDR as digital input
}

void loop() {
  // MQ135 reading
  int mq135Value = analogRead(MQ135_PIN);

  // DHT22 readings
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature(); // Celsius

  // LDR digital reading (inverted)
  int ldrStatus = digitalRead(LDR_PIN); // 0 = Bright, 1 = Dark

  // Check if DHT failed
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
  } else {
    Serial.print("MQ135:");
    Serial.print(mq135Value);
    Serial.print(", Light:");
    Serial.print(ldrStatus == 0 ? "Bright" : "Dark"); // 👈 logic inverted
    Serial.print(", Temp:");
    Serial.print(temperature);
    Serial.print("°C, Hum:");
    Serial.print(humidity);
    Serial.println("%");
  }

  delay(2000);
}
