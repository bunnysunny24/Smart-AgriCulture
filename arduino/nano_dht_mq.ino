#include <DHT.h>

#define MQ135_PIN A0
#define DHTPIN 2
#define DHTTYPE DHT22

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);  // Serial to ESP32
  dht.begin();
  delay(1000);
}

void loop() {
  int mq135Value = analogRead(MQ135_PIN);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();

  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT22");
  } else {
    // Send all data over Serial
    Serial.print("MQ135:");
    Serial.print(mq135Value);
    Serial.print(",Temp:");
    Serial.print(temperature);
    Serial.print(",Humidity:");
    Serial.println(humidity);
  }

  delay(2000);  // Delay between readings
}
