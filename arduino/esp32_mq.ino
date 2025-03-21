#define MQ135_PIN 34  // Analog pin on ESP32 connected to MQ135 sensor

void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("MQ135 Air Quality Sensor - ESP32");
}

void loop() {
  int mq135Value = analogRead(MQ135_PIN);  // Read analog value from MQ135

  Serial.print("MQ135 Sensor Value (PPM approx): ");
  Serial.println(mq135Value);

  delay(2000);  // Delay for 2 seconds before next reading
}
