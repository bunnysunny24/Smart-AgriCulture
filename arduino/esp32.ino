#define RXD2 5  // GPIO5 = D5 on ESP32

void setup() {
  Serial.begin(115200);  // USB Monitor
  Serial2.begin(9600, SERIAL_8N1, RXD2, -1);  // Only RX from Nano
  Serial.println("Listening to Arduino Nano...");
}

void loop() {
  while (Serial2.available()) {
    String data = Serial2.readStringUntil('\n');
    Serial.print("From Nano: ");
    Serial.println(data);
  }
}
