from fastapi import FastAPI, Request
from datetime import datetime
import csv
import os

app = FastAPI()
CSV_FILE = "sensor_data.csv"

# Initialize CSV with headers if it doesn't exist
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["timestamp", "mq135", "light", "temp", "hum", "soil"])


@app.get("/log-data")
async def log_data(mq135: int, light: int, temp: float, hum: float, soil: int):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Write data to CSV
    with open(CSV_FILE, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([timestamp, mq135, light, temp, hum, soil])

    return {"message": "Data logged successfully"}
