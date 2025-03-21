from fastapi import FastAPI, Request
from datetime import datetime
import csv
import os

app = FastAPI()
CSV_FILE = "senso_data.csv"

# Initialize CSV with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "mq135", "light", "temp", "hum", "soil"])


@app.get("/log-data")
async def log_data(mq135: int, light: int, temp: float, hum: float, soil: int):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{timestamp}] Logging => MQ135={mq135}, Light={light}, Temp={temp}, Hum={hum}, Soil={soil}")

    try:
        with open(CSV_FILE, mode='a', newline='') as f:
            writer = csv.writer(f)
            writer.writerow([timestamp, mq135, light, temp, hum, soil])
            f.flush()  # flush to force write
        print("✅ Data written to CSV")
    except Exception as e:
        print("❌ Error writing to CSV:", e)

    return {"message": "Data logged successfully"}
