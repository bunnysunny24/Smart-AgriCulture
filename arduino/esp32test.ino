void setup() {
  pinMode(2, OUTPUT); // Onboard LED is usually on GPIO 2
}

void loop() {
  digitalWrite(2, HIGH); // Turn LED on
  delay(500);            // Wait 0.5 sec
  digitalWrite(2, LOW);  // Turn LED off
  delay(500);            // Wait 0.5 sec
}
