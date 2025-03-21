#include <DHT.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// OLED display settings
#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

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
  pinMode(LDR_PIN, INPUT);

  // OLED initialization
  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for (;;);
  }

  display.clearDisplay();
  display.setTextColor(WHITE);
  display.setTextSize(1);
  display.setCursor(0, 0);
  display.print("Env Monitoring");
  display.display();
  delay(2000);
}

void loop() {
  int mq135Value = analogRead(MQ135_PIN);
  int soilMoistureValue = analogRead(SOIL_PIN);
  float humidity = dht.readHumidity();
  float temperature = dht.readTemperature();
  int ldrStatus = digitalRead(LDR_PIN); // 0 = Bright, 1 = Dark

  // Print to Serial
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
    Serial.println(soilMoistureValue);
  }

  // Display on OLED
  display.clearDisplay();
  display.setTextSize(1);

  display.setCursor(0, 0);
  display.print("AQI: ");
  display.print(mq135Value);

  display.setCursor(64, 0);
  display.print("Light: ");
  display.print(ldrStatus == 0 ? "Bright" : "Dark");

  display.setCursor(0, 15);
  display.print("Temp: ");
  display.print(temperature);
  display.print(" C");

  display.setCursor(0, 30);
  display.print("Humidity: ");
  display.print(humidity);
  display.print("%");

  display.setCursor(0, 45);
  display.print("Soil: ");
  display.print(soilMoistureValue);

  display.display();
  delay(2000);
}
