import { useState, useEffect, useMemo } from 'react';
import { 
  Sun, 
  Moon, 
  CloudRain, 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle,
  BarChart2,
  RefreshCw,
  Calendar,
  Heart
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
    soilMoisture: Math.floor(Math.random() * 400 + 800),
    plantHealth: Math.floor(Math.random() * 30) + 70 // New plant health index (0-100)
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
      soilMoisture: Math.floor(Math.random() * 400 + 800),
      plantHealth: Math.floor(Math.random() * 30) + 70
    });
  }
  
  return data;
};

// Thresholds for warnings
const thresholds = {
  airQuality: { min: 0, max: 50, warning: 40, unit: "ppm" },
  temperature: { min: 18, max: 30, warning: 28, unit: "°C" },
  humidity: { min: 40, max: 80, warning: 75, unit: "%" },
  soilMoisture: { min: 800, max: 1200, warning: 900, unit: "" },
  plantHealth: { min: 70, max: 100, warning: 75, unit: "%" }
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
  
  // Plant health feedback
  if (latestReading.plantHealth < thresholds.plantHealth.warning) {
    feedback.push("Plant health index is declining. Check all environmental factors.");
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
  const [refreshRate, setRefreshRate] = useState(3000);
  const [isRunning, setIsRunning] = useState(true);
  const [lastWatered, setLastWatered] = useState(new Date().toISOString().split('T')[0]);
  
  // Calculate overall plant health status
  const healthStatus = useMemo(() => {
    if (!data.length) return { status: "Unknown", color: "text-gray-500" };
    
    const latestReading = data[data.length - 1];
    const health = latestReading.plantHealth;
    
    if (health >= 90) return { status: "Excellent", color: "text-green-600" };
    if (health >= 80) return { status: "Good", color: "text-green-500" };
    if (health >= 70) return { status: "Fair", color: "text-yellow-500" };
    return { status: "Poor", color: "text-red-500" };
  }, [data]);
  
  // Water the plant function
  const waterPlant = () => {
    setData(prevData => {
      const newData = [...prevData];
      if (newData.length > 0) {
        const latestReading = {...newData[newData.length - 1]};
        latestReading.soilMoisture = Math.min(1200, latestReading.soilMoisture + 200);
        newData[newData.length - 1] = latestReading;
      }
      return newData;
    });
    setLastWatered(new Date().toISOString().split('T')[0]);
    setFeedback(["Plant has been watered. Soil moisture increased."]);
  };
  
  // Toggle data simulation
  const toggleSimulation = () => {
    setIsRunning(prev => !prev);
  };
  
  // Simulate getting new data at the specified interval
  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
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
      }, refreshRate);
    }
    
    return () => clearInterval(interval);
  }, [refreshRate, isRunning]);
  
  const latestReading = data[data.length - 1] || {};
  
  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <header className="mb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Plant Monitoring Dashboard</h1>
          <p className="text-gray-500">Real-time sensor data visualization</p>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleSimulation}
            className={`flex items-center px-3 py-2 rounded-lg ${isRunning ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}
          >
            <RefreshCw size={16} className="mr-2" />
            {isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          <select 
            value={refreshRate} 
            onChange={(e) => setRefreshRate(Number(e.target.value))}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value={1000}>Refresh: 1s</option>
            <option value={3000}>Refresh: 3s</option>
            <option value={5000}>Refresh: 5s</option>
            <option value={10000}>Refresh: 10s</option>
          </select>
        </div>
      </header>
      
      {/* Overall Health Status */}
      <div className="bg-white p-4 rounded-lg shadow mb-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 mr-4">
            <Heart size={24} className={healthStatus.color} />
          </div>
          <div>
            <p className="text-gray-500">Overall Plant Health</p>
            <p className={`text-2xl font-bold ${healthStatus.color}`}>
              {healthStatus.status} - {latestReading?.plantHealth || 0}%
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <p className="text-gray-500">Last Watered</p>
            <div className="flex items-center">
              <Calendar size={16} className="text-blue-500 mr-2" />
              <p className="font-semibold">{lastWatered}</p>
            </div>
          </div>
          <button 
            onClick={waterPlant}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <CloudRain size={16} className="mr-2" />
            Water Plant
          </button>
        </div>
      </div>
      
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
                {latestReading?.airQuality?.toFixed(1) || "N/A"} {thresholds.airQuality.unit}
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
                {latestReading?.temperature?.toFixed(1) || "N/A"} {thresholds.temperature.unit}
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
                {latestReading?.humidity?.toFixed(1) || "N/A"} {thresholds.humidity.unit}
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
                {latestReading?.soilMoisture || "N/A"}
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
                {latestReading?.timestamp || "N/A"}
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Refreshing data every {refreshRate/1000} seconds
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
              className={`p-2 rounded ${item.includes('good') || item.includes('watered') ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}
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
          <div className="flex flex-wrap gap-2">
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
            <button 
              onClick={() => setSelectedMetric('plantHealth')}
              className={`px-3 py-1 rounded ${selectedMetric === 'plantHealth' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100'}`}
            >
              Plant Health
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
                    soilMoisture: '',
                    plantHealth: '%'
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
                  selectedMetric === 'soilMoisture' ? '#f59e0b' :
                  '#8b5cf6' // Plant Health (purple)
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