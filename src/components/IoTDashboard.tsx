import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wifi, 
  Battery, 
  Thermometer, 
  Wind, 
  Eye, 
  Car, 
  AlertTriangle,
  CheckCircle,
  Radio,
  Zap,
  Activity
} from 'lucide-react';

interface IoTDevice {
  id: string;
  type: 'smart-cone' | 'traffic-sensor' | 'weather-station' | 'camera';
  name: string;
  status: 'online' | 'offline' | 'warning';
  battery: number;
  signal: number;
  location: [number, number];
  data: any;
  lastUpdate: Date;
}

interface IoTDashboardProps {
  onDeviceSelect: (device: IoTDevice) => void;
}

export function IoTDashboard({ onDeviceSelect }: IoTDashboardProps) {
  const [devices, setDevices] = useState<IoTDevice[]>([
    {
      id: 'cone-001',
      type: 'smart-cone',
      name: 'Smart Cone Alpha',
      status: 'online',
      battery: 87,
      signal: 95,
      location: [40.7128, -74.0060],
      data: { vibrations: 12, temperature: 72, proximity: 'clear' },
      lastUpdate: new Date()
    },
    {
      id: 'sensor-001',
      type: 'traffic-sensor',
      name: 'Traffic Monitor 1',
      status: 'online',
      battery: 92,
      signal: 88,
      location: [40.7130, -74.0058],
      data: { vehicleCount: 247, avgSpeed: 28, congestion: 'moderate' },
      lastUpdate: new Date(Date.now() - 30000)
    },
    {
      id: 'weather-001',
      type: 'weather-station',
      name: 'Weather Station',
      status: 'warning',
      battery: 45,
      signal: 76,
      location: [40.7125, -74.0062],
      data: { temperature: 68, humidity: 72, windSpeed: 15, precipitation: 0 },
      lastUpdate: new Date(Date.now() - 120000)
    },
    {
      id: 'camera-001',
      type: 'camera',
      name: 'Security Camera 1',
      status: 'online',
      battery: 78,
      signal: 91,
      location: [40.7132, -74.0055],
      data: { recording: true, motion: false, quality: 'HD' },
      lastUpdate: new Date(Date.now() - 15000)
    }
  ]);

  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setDevices(prev => prev.map(device => ({
        ...device,
        data: {
          ...device.data,
          ...(device.type === 'traffic-sensor' && {
            vehicleCount: device.data.vehicleCount + Math.floor(Math.random() * 5),
            avgSpeed: Math.max(15, Math.min(45, device.data.avgSpeed + (Math.random() - 0.5) * 4))
          }),
          ...(device.type === 'smart-cone' && {
            vibrations: Math.max(0, device.data.vibrations + (Math.random() - 0.5) * 3)
          })
        },
        lastUpdate: new Date()
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'smart-cone': return <Radio className="w-5 h-5" />;
      case 'traffic-sensor': return <Car className="w-5 h-5" />;
      case 'weather-station': return <Wind className="w-5 h-5" />;
      case 'camera': return <Eye className="w-5 h-5" />;
      default: return <Wifi className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const warningDevices = devices.filter(d => d.status === 'warning').length;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowDashboard(!showDashboard)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Wifi className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">IoT Network</h3>
              <p className="text-sm text-gray-500">
                {onlineDevices} online • {warningDevices} warnings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            <motion.div
              animate={{ rotate: showDashboard ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showDashboard && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Network Overview */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{onlineDevices}</div>
                  <div className="text-xs text-green-700">Online</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-yellow-600">{warningDevices}</div>
                  <div className="text-xs text-yellow-700">Warnings</div>
                </div>
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
                  <div className="text-xs text-blue-700">Total</div>
                </div>
              </div>

              {/* Device List */}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {devices.map((device) => (
                  <motion.div
                    key={device.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 border border-gray-200 rounded-lg hover:border-cyan-300 cursor-pointer transition-all duration-200"
                    onClick={() => {
                      setSelectedDevice(device);
                      onDeviceSelect(device);
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getDeviceIcon(device.type)}
                        <span className="font-medium text-gray-900">{device.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.floor((Date.now() - device.lastUpdate.getTime()) / 1000)}s ago
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Battery className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{device.battery}%</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full ${
                              device.battery > 50 ? 'bg-green-500' : 
                              device.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${device.battery}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wifi className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{device.signal}%</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`w-1 h-3 rounded-full ${
                                device.signal > bar * 25 ? 'bg-blue-500' : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Device-specific data */}
                    <div className="mt-2 text-xs text-gray-600">
                      {device.type === 'traffic-sensor' && (
                        <div className="flex justify-between">
                          <span>Vehicles: {device.data.vehicleCount}</span>
                          <span>Speed: {device.data.avgSpeed.toFixed(1)} mph</span>
                        </div>
                      )}
                      {device.type === 'smart-cone' && (
                        <div className="flex justify-between">
                          <span>Vibrations: {device.data.vibrations.toFixed(1)}</span>
                          <span>Status: {device.data.proximity}</span>
                        </div>
                      )}
                      {device.type === 'weather-station' && (
                        <div className="flex justify-between">
                          <span>Temp: {device.data.temperature}°F</span>
                          <span>Wind: {device.data.windSpeed} mph</span>
                        </div>
                      )}
                      {device.type === 'camera' && (
                        <div className="flex justify-between">
                          <span>Recording: {device.data.recording ? 'Yes' : 'No'}</span>
                          <span>Quality: {device.data.quality}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 p-3 bg-cyan-50 text-cyan-600 rounded-lg hover:bg-cyan-100 transition-colors duration-200">
                  <Activity className="w-4 h-4" />
                  <span className="text-sm font-medium">Monitor All</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <Zap className="w-4 h-4" />
                  <span className="text-sm font-medium">Auto-Optimize</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}