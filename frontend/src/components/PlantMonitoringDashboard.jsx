import { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  BarChart2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Function to generate random sensor reading
const generateRandomReading = () => {
  return {
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    airQuality: Math.floor(Math.random() * 50) + 10,
    light: Math.random() > 0.5 ? 1 : 0, // 1=Dark, 0=Bright
    temperature: parseFloat((Math.random() * 10 + 18).toFixed(1)),
    humidity: parseFloat((Math.random() * 20 + 60).toFixed(1)),
    soilMoisture: Math.floor(Math.random() * 400 + 800)
  };
};

// Generate initial data
const generateInitialData = (count = 10) => {
  const data = [];
  const now = new Date();
  
  for (let i = count; i > 0; i--) {
    const time = new Date(now);
    time.setMinutes(now.getMinutes() - i * 5);
    
    data.push({
      timestamp: time.toISOString().replace('T', ' ').substring(0, 19),
      airQuality: Math.floor(Math.random() * 50) + 10,
      light: Math.random() > 0.5 ? 1 : 0,
      temperature: parseFloat((Math.random() * 10 + 18).toFixed(1)),
      humidity: parseFloat((Math.random() * 20 + 60).toFixed(1)),
      soilMoisture: Math.floor(Math.random() * 400 + 800)
    });
  }
  
  return data;
};

// Thresholds for warnings
const thresholds = {
  airQuality: { min: 0, max: 50, warning: 40, unit: "ppm" },
  temperature: { min: 18, max: 30, warning: 28, unit: "°C" },
  humidity: { min: 40, max: 80, warning: 75, unit: "%" },
  soilMoisture: { min: 800, max: 1200, warning: 900, unit: "" }
};

// Generate feedback based on current readings
const generateFeedback = (latestReading) => {
  if (!latestReading) return [];
  
  const feedback = [];
  
  // Air quality feedback
  if (latestReading.airQuality > thresholds.airQuality.warning) {
    feedback.push("Air quality is poor. Consider ventilation.");
  }
  
  // Light feedback
  if (latestReading.light === 1) {
    feedback.push("Low light conditions detected. Make sure your plant receives adequate light during the day.");
  }
  
  // Temperature feedback
  if (latestReading.temperature > thresholds.temperature.warning) {
    feedback.push("Temperature is high. Consider cooling the environment.");
  } else if (latestReading.temperature < thresholds.temperature.min) {
    feedback.push("Temperature is low. Consider warming the environment.");
  }
  
  // Humidity feedback
  if (latestReading.humidity > thresholds.humidity.warning) {
    feedback.push("Humidity is high. Consider dehumidification.");
  } else if (latestReading.humidity < thresholds.humidity.min) {
    feedback.push("Humidity is low. Consider using a humidifier.");
  }
  
  // Soil moisture feedback
  if (latestReading.soilMoisture < thresholds.soilMoisture.warning) {
    feedback.push("Soil moisture is low. Your plant may need watering.");
  } else if (latestReading.soilMoisture > thresholds.soilMoisture.max) {
    feedback.push("Soil moisture is high. Avoid watering until soil dries a bit.");
  }
  
  return feedback.length > 0 ? feedback : ["All parameters look good!"];
};

// Check if value is within thresholds
const getStatusColor = (value, type) => {
  const { min, max } = thresholds[type];
  if (value < min) return "text-blue-500";
  if (value > max) return "text-red-500";
  return "text-green-500";
};

export default function PlantMonitoringDashboard() {
  const [data, setData] = useState(generateInitialData());
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [feedback, setFeedback] = useState([]);
  
  // Simulate getting new data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newReading = generateRandomReading();
      setData(prevData => {
        const newData = [...prevData, newReading];
        // Keep only the last 20 readings
        if (newData.length > 20) {
          return newData.slice(newData.length - 20);
        }
        return newData;
      });
      setFeedback(generateFeedback(newReading));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const latestReading = data[data.length - 1];
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <header className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Plant Monitoring Dashboard</h1>
        <p className="text-gray-500">Real-time sensor data visualization</p>
      </header>
      
      {/* Current Readings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Wind size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500">Air Quality</p>
              <p className={`text-xl font-bold ${getStatusColor(latestReading?.airQuality, 'airQuality')}`}>
                {latestReading?.airQuality.toFixed(1)} {thresholds.airQuality.unit}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Good range: {thresholds.airQuality.min}-{thresholds.airQuality.warning} {thresholds.airQuality.unit}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-yellow-100 mr-3">
              {latestReading?.light === 1 ? (
                <Moon size={24} className="text-yellow-500" />
              ) : (
                <Sun size={24} className="text-yellow-500" />
              )}
            </div>
            <div>
              <p className="text-gray-500">Light Condition</p>
              <p className="text-xl font-bold text-gray-800">
                {latestReading?.light === 1 ? 'Dark' : 'Bright'}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Current status: {latestReading?.light === 1 ? 'Low light conditions' : 'Well illuminated'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-red-100 mr-3">
              <Thermometer size={24} className="text-red-500" />
            </div>
            <div>
              <p className="text-gray-500">Temperature</p>
              <p className={`text-xl font-bold ${getStatusColor(latestReading?.temperature, 'temperature')}`}>
                {latestReading?.temperature.toFixed(1)} {thresholds.temperature.unit}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Optimal range: {thresholds.temperature.min}-{thresholds.temperature.max} {thresholds.temperature.unit}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-blue-100 mr-3">
              <Droplets size={24} className="text-blue-500" />
            </div>
            <div>
              <p className="text-gray-500">Humidity</p>
              <p className={`text-xl font-bold ${getStatusColor(latestReading?.humidity, 'humidity')}`}>
                {latestReading?.humidity.toFixed(1)} {thresholds.humidity.unit}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Optimal range: {thresholds.humidity.min}-{thresholds.humidity.max} {thresholds.humidity.unit}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-green-100 mr-3">
              <CloudRain size={24} className="text-green-500" />
            </div>
            <div>
              <p className="text-gray-500">Soil Moisture</p>
              <p className={`text-xl font-bold ${getStatusColor(latestReading?.soilMoisture, 'soilMoisture')}`}>
                {latestReading?.soilMoisture}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Good range: {thresholds.soilMoisture.min}-{thresholds.soilMoisture.max}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center mb-2">
            <div className="p-2 rounded-full bg-gray-100 mr-3">
              <BarChart2 size={24} className="text-gray-500" />
            </div>
            <div>
              <p className="text-gray-500">Latest Reading</p>
              <p className="text-xl font-bold text-gray-800">
                {latestReading?.timestamp}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Refreshing data every 3 seconds
          </p>
        </div>
      </div>
      
      {/* Alerts and Feedback */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <AlertTriangle size={18} className="text-orange-500 mr-2" />
          System Feedback
        </h2>
        <div className="space-y-2">
          {feedback.map((item, index) => (
            <div 
              key={index} 
              className={`p-2 rounded ${item.includes('good') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      
      {/* Chart */}
      <div className="flex-1 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Historical Data</h2>
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedMetric('temperature')}
              className={`px-3 py-1 rounded ${selectedMetric === 'temperature' ? 'bg-red-100 text-red-600' : 'bg-gray-100'}`}
            >
              Temperature
            </button>
            <button 
              onClick={() => setSelectedMetric('humidity')}
              className={`px-3 py-1 rounded ${selectedMetric === 'humidity' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}
            >
              Humidity
            </button>
            <button 
              onClick={() => setSelectedMetric('airQuality')}
              className={`px-3 py-1 rounded ${selectedMetric === 'airQuality' ? 'bg-green-100 text-green-600' : 'bg-gray-100'}`}
            >
              Air Quality
            </button>
            <button 
              onClick={() => setSelectedMetric('soilMoisture')}
              className={`px-3 py-1 rounded ${selectedMetric === 'soilMoisture' ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100'}`}
            >
              Soil Moisture
            </button>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tick={{fontSize: 10}}
                tickFormatter={(value) => value.split(' ')[1]}
              />
              <YAxis />
              <Tooltip
                labelFormatter={(value) => `Timestamp: ${value}`}
                formatter={(value, name) => {
                  const unit = {
                    temperature: '°C',
                    humidity: '%',
                    airQuality: 'ppm',
                    soilMoisture: ''
                  }[name];
                  return [`${value} ${unit}`, name];
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={
                  selectedMetric === 'temperature' ? '#ef4444' :
                  selectedMetric === 'humidity' ? '#3b82f6' :
                  selectedMetric === 'airQuality' ? '#10b981' :
                  '#f59e0b'
                }
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}