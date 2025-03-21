#include <WiFi.h>
#include <ThingSpeak.h>

// WiFi credentials
const char* ssid = "BluhWiFi";
const char* password = "Bunny1234";

// ThingSpeak channel details
unsigned long channelID = 2887726;
const char* writeAPIKey = "U2KAU2S15T7GF541";

// Serial RX from Nano
#define RXD2 5  // GPIO5 = D5 on ESP32

WiFiClient client;

void setup() {
  Serial.begin(115200);  // USB Monitor
  Serial2.begin(9600, SERIAL_8N1, RXD2, -1);  // Only RX from Nano
  Serial.println("Listening to Arduino Nano...");

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected.");
  ThingSpeak.begin(client);
}

void loop() {
  while (Serial2.available()) {
    String data = Serial2.readStringUntil('\n');
    Serial.print("From Nano: ");
    Serial.println(data);

    // Example: MQ135: 19, Light: Dark, Temp: 22.20°C, Hum: 75.00%, Soil: 1020
    int mq135 = extractInt(data, "MQ135: ");
    int light = extractLight(data); // Dark = 1, Bright = 0
    float temp = extractFloat(data, "Temp: ", "°C");
    float hum = extractFloat(data, "Hum: ", "%");
    int soil = extractInt(data, "Soil: ");

    // Debug
    Serial.printf("Parsed => MQ135: %d, Light: %d, Temp: %.2f, Hum: %.2f, Soil: %d\n",
                  mq135, light, temp, hum, soil);

    // Send to ThingSpeak
    ThingSpeak.setField(1, mq135);
    ThingSpeak.setField(2, light);
    ThingSpeak.setField(3, temp);
    ThingSpeak.setField(4, hum);
    ThingSpeak.setField(5, soil);

    int response = ThingSpeak.writeFields(channelID, writeAPIKey);

    if (response == 200) {
      Serial.println("Data sent to ThingSpeak.");
    } else {
      Serial.print("Error sending to ThingSpeak. Code: ");
      Serial.println(response);
    }

    delay(20000);  // Wait to meet ThingSpeak rate limit
  }
}

// Helper to extract integer from a label
int extractInt(String text, String label) {
  int idx = text.indexOf(label);
  if (idx == -1) return 0;
  int endIdx = text.indexOf(',', idx);
  if (endIdx == -1) endIdx = text.length();
  String val = text.substring(idx + label.length(), endIdx);
  return val.toInt();
}

// Helper to extract float from a label and ending symbol
float extractFloat(String text, String label, String endSymbol) {
  int idx = text.indexOf(label);
  if (idx == -1) return 0;
  int endIdx = text.indexOf(endSymbol, idx);
  if (endIdx == -1) return 0;
  String val = text.substring(idx + label.length(), endIdx);
  return val.toFloat();
}

// Helper for Light status
int extractLight(String text) {
  int idx = text.indexOf("Light: ");
  if (idx == -1) return 0;
  int endIdx = text.indexOf(',', idx);
  if (endIdx == -1) endIdx = text.length();
  String val = text.substring(idx + 7, endIdx);
  val.trim();
  return val == "Dark" ? 1 : 0;
}
