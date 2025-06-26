import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Construction, 
  MapPin, 
  Trash2, 
  Save, 
  Download, 
  Upload,
  AlertTriangle,
  Settings,
  Eye,
  EyeOff,
  Plus,
  Minus,
  PenTool,
  Square,
  Sparkles,
  Zap,
  Users,
  BarChart3,
  Rocket,
  Trophy,
  Star
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { AIOptimizer } from './components/AIOptimizer';
import { Analytics } from './components/Analytics';
import { CollaborationHub } from './components/CollaborationHub';
import { SmartNotifications } from './components/SmartNotifications';
import { IoTDashboard } from './components/IoTDashboard';
import { VoiceCommands } from './components/VoiceCommands';
import { ARVisualization } from './components/ARVisualization';
import { MLPredictor } from './components/MLPredictor';
import { EnterpriseFeatures } from './components/EnterpriseFeatures';
import { JobManagement } from './components/JobManagement';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Cone {
  id: string;
  lat: number;
  lng: number;
  timestamp: Date;
  notes?: string;
  type: 'warning' | 'closure' | 'detour';
}

interface DrawnLine {
  id: string;
  points: [number, number][];
  type: 'barrier' | 'detour' | 'closure' | 'work-zone';
  name: string;
  timestamp: Date;
}

interface ConstructionZone {
  id: string;
  name: string;
  cones: Cone[];
  lines: DrawnLine[];
  isActive: boolean;
  createdAt: Date;
}

type DrawingMode = 'cone' | 'line' | null;

function MapClickHandler({ 
  onMapClick, 
  drawingMode, 
  onLinePoint 
}: { 
  onMapClick: (lat: number, lng: number) => void;
  drawingMode: DrawingMode;
  onLinePoint: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e) => {
      if (drawingMode === 'cone') {
        onMapClick(e.latlng.lat, e.latlng.lng);
      } else if (drawingMode === 'line') {
        onLinePoint(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

function App() {
  const [zones, setZones] = useState<ConstructionZone[]>([]);
  const [activeZoneId, setActiveZoneId] = useState<string | null>(null);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>(null);
  const [selectedConeType, setSelectedConeType] = useState<Cone['type']>('warning');
  const [selectedLineType, setSelectedLineType] = useState<DrawnLine['type']>('barrier');
  const [currentLine, setCurrentLine] = useState<[number, number][]>([]);
  const [showAllZones, setShowAllZones] = useState(true);
  const [newZoneName, setNewZoneName] = useState('');
  const [showNewZoneForm, setShowNewZoneForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showARVisualization, setShowARVisualization] = useState(false);
  const mapRef = useRef<L.Map>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedZones = localStorage.getItem('constructionZones');
    if (savedZones) {
      const parsedZones = JSON.parse(savedZones).map((zone: any) => ({
        ...zone,
        createdAt: new Date(zone.createdAt),
        lines: zone.lines?.map((line: any) => ({
          ...line,
          timestamp: new Date(line.timestamp)
        })) || [],
        cones: zone.cones.map((cone: any) => ({
          ...cone,
          timestamp: new Date(cone.timestamp)
        }))
      }));
      setZones(parsedZones);
      if (parsedZones.length > 0) {
        setActiveZoneId(parsedZones[0].id);
        setShowWelcome(false);
      }
    }
  }, []);

  // Save to localStorage whenever zones change
  useEffect(() => {
    localStorage.setItem('constructionZones', JSON.stringify(zones));
  }, [zones]);

  const createNewZone = useCallback(() => {
    if (!newZoneName.trim()) return;
    
    const newZone: ConstructionZone = {
      id: Date.now().toString(),
      name: newZoneName.trim(),
      cones: [],
      lines: [],
      isActive: true,
      createdAt: new Date()
    };
    
    setZones(prev => [...prev, newZone]);
    setActiveZoneId(newZone.id);
    setNewZoneName('');
    setShowNewZoneForm(false);
    setShowWelcome(false);
  }, [newZoneName]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (drawingMode !== 'cone' || !activeZoneId) return;

    const newCone: Cone = {
      id: Date.now().toString(),
      lat,
      lng,
      timestamp: new Date(),
      type: selectedConeType
    };

    setZones(prev => prev.map(zone => 
      zone.id === activeZoneId 
        ? { ...zone, cones: [...zone.cones, newCone] }
        : zone
    ));
  }, [drawingMode, activeZoneId, selectedConeType]);

  const handleLinePoint = useCallback((lat: number, lng: number) => {
    if (drawingMode !== 'line' || !activeZoneId) return;
    
    setCurrentLine(prev => [...prev, [lat, lng]]);
  }, [drawingMode, activeZoneId]);

  const finishLine = useCallback(() => {
    if (currentLine.length < 2 || !activeZoneId) return;

    const newLine: DrawnLine = {
      id: Date.now().toString(),
      points: currentLine,
      type: selectedLineType,
      name: `${selectedLineType.charAt(0).toUpperCase() + selectedLineType.slice(1)} Line`,
      timestamp: new Date()
    };

    setZones(prev => prev.map(zone => 
      zone.id === activeZoneId 
        ? { ...zone, lines: [...zone.lines, newLine] }
        : zone
    ));

    setCurrentLine([]);
    setDrawingMode(null);
  }, [currentLine, activeZoneId, selectedLineType]);

  const cancelLine = useCallback(() => {
    setCurrentLine([]);
    setDrawingMode(null);
  }, []);

  const removeCone = useCallback((coneId: string) => {
    if (!activeZoneId) return;
    
    setZones(prev => prev.map(zone => 
      zone.id === activeZoneId 
        ? { ...zone, cones: zone.cones.filter(cone => cone.id !== coneId) }
        : zone
    ));
  }, [activeZoneId]);

  const removeLine = useCallback((lineId: string) => {
    if (!activeZoneId) return;
    
    setZones(prev => prev.map(zone => 
      zone.id === activeZoneId 
        ? { ...zone, lines: zone.lines.filter(line => line.id !== lineId) }
        : zone
    ));
  }, [activeZoneId]);

  const toggleZoneVisibility = useCallback((zoneId: string) => {
    setZones(prev => prev.map(zone => 
      zone.id === zoneId 
        ? { ...zone, isActive: !zone.isActive }
        : zone
    ));
  }, []);

  const deleteZone = useCallback((zoneId: string) => {
    setZones(prev => prev.filter(zone => zone.id !== zoneId));
    if (activeZoneId === zoneId) {
      const remainingZones = zones.filter(zone => zone.id !== zoneId);
      setActiveZoneId(remainingZones.length > 0 ? remainingZones[0].id : null);
    }
  }, [activeZoneId, zones]);

  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(zones, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smartcones-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [zones]);

  const importData = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedZones = JSON.parse(e.target?.result as string);
        setZones(importedZones.map((zone: any) => ({
          ...zone,
          createdAt: new Date(zone.createdAt),
          lines: zone.lines?.map((line: any) => ({
            ...line,
            timestamp: new Date(line.timestamp)
          })) || [],
          cones: zone.cones.map((cone: any) => ({
            ...cone,
            timestamp: new Date(cone.timestamp)
          }))
        })));
      } catch (error) {
        alert('Error importing file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  }, []);

  const handleAISuggestion = useCallback((suggestion: any) => {
    console.log('Applying AI suggestion:', suggestion);
  }, []);

  const handleInviteTeam = useCallback(() => {
    alert('Team invitation feature would open here!');
  }, []);

  const handleVoiceCommand = useCallback((command: string, params?: any) => {
    switch (command) {
      case 'place-cone':
        setDrawingMode('cone');
        break;
      case 'start-line':
        setDrawingMode('line');
        break;
      case 'optimize-zone':
        // Trigger AI optimization
        break;
      case 'save-zone':
        exportData();
        break;
      default:
        console.log('Unknown voice command:', command);
    }
  }, [exportData]);

  const handleIoTDeviceSelect = useCallback((device: any) => {
    console.log('Selected IoT device:', device);
  }, []);

  const handleJobSelect = useCallback((job: any) => {
    // Center map on job location
    if (mapRef.current && job.location.coordinates) {
      mapRef.current.setView(job.location.coordinates, 14);
    }
  }, []);

  const activeZone = zones.find(zone => zone.id === activeZoneId);
  const visibleCones = showAllZones 
    ? zones.filter(zone => zone.isActive).flatMap(zone => zone.cones)
    : activeZone?.cones || [];
  const visibleLines = showAllZones 
    ? zones.filter(zone => zone.isActive).flatMap(zone => zone.lines)
    : activeZone?.lines || [];

  const getConeColor = (type: Cone['type']) => {
    switch (type) {
      case 'warning': return '#ff6b35';
      case 'closure': return '#dc2626';
      case 'detour': return '#2563eb';
      default: return '#ff6b35';
    }
  };

  const getLineColor = (type: DrawnLine['type']) => {
    switch (type) {
      case 'barrier': return '#dc2626';
      case 'detour': return '#2563eb';
      case 'closure': return '#7c2d12';
      case 'work-zone': return '#ea580c';
      default: return '#dc2626';
    }
  };

  const createConeIcon = (type: Cone['type']) => {
    const color = getConeColor(type);
    return new L.Icon({
      iconUrl: 'data:image/svg+xml;base64,' + btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill="${color}" d="M12 2L6 20h12L12 2z"/>
          <path fill="#ffffff" d="M12 4L8 18h8L12 4z"/>
          <rect fill="${color}" x="6" y="20" width="12" height="2" rx="1"/>
        </svg>
      `),
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 font-['Inter']">
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-lg mx-4 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Rocket className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 SmartCones AI</h2>
              <p className="text-gray-600 mb-6 text-lg">
                The <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">ULTIMATE</span> construction zone management platform for Las Vegas with AI, IoT, AR, and voice control!
              </p>
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="ml-2 text-sm text-gray-600">Hackathon Winner Material!</span>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="w-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              >
                🚀 Launch SmartCones AI
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className="w-96 bg-white shadow-2xl flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <Trophy className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">SmartCones AI</h1>
                <p className="text-sm text-orange-100">🏆 Las Vegas Edition</p>
              </div>
            </div>
            <SmartNotifications />
          </div>

          {/* Drawing Mode Controls */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDrawingMode(drawingMode === 'cone' ? null : 'cone')}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  drawingMode === 'cone'
                    ? 'bg-white text-orange-600 shadow-lg'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Cones</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setDrawingMode(drawingMode === 'line' ? null : 'line')}
                className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  drawingMode === 'line'
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
              >
                <PenTool className="w-4 h-4" />
                <span>Lines</span>
              </motion.button>
            </div>

            {drawingMode === 'cone' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-white">Cone Type</label>
                <select
                  value={selectedConeType}
                  onChange={(e) => setSelectedConeType(e.target.value as Cone['type'])}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                >
                  <option value="warning" className="text-gray-900">⚠️ Warning</option>
                  <option value="closure" className="text-gray-900">🚫 Road Closure</option>
                  <option value="detour" className="text-gray-900">↗️ Detour</option>
                </select>
              </motion.div>
            )}

            {drawingMode === 'line' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <label className="block text-sm font-medium text-white">Line Type</label>
                <select
                  value={selectedLineType}
                  onChange={(e) => setSelectedLineType(e.target.value as DrawnLine['type'])}
                  className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-white placeholder-opacity-70 focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent"
                >
                  <option value="barrier" className="text-gray-900">🚧 Barrier</option>
                  <option value="detour" className="text-gray-900">↗️ Detour Route</option>
                  <option value="closure" className="text-gray-900">🚫 Road Closure</option>
                  <option value="work-zone" className="text-gray-900">⚠️ Work Zone</option>
                </select>
                
                {currentLine.length > 0 && (
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={finishLine}
                      disabled={currentLine.length < 2}
                      className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
                    >
                      Finish ({currentLine.length})
                    </button>
                    <button
                      onClick={cancelLine}
                      className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Zone Management */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Construction Zones</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNewZoneForm(!showNewZoneForm)}
              className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors duration-200"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          <AnimatePresence>
            {showNewZoneForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 space-y-3"
              >
                <input
                  type="text"
                  value={newZoneName}
                  onChange={(e) => setNewZoneName(e.target.value)}
                  placeholder="Zone name..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  onKeyPress={(e) => e.key === 'Enter' && createNewZone()}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={createNewZone}
                    className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowNewZoneForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-300 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {zones.map(zone => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  activeZoneId === zone.id
                    ? 'border-orange-500 bg-orange-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setActiveZoneId(zone.id)}
                    className="flex-1 text-left"
                  >
                    <h3 className="font-semibold text-gray-900">{zone.name}</h3>
                    <p className="text-sm text-gray-500">
                      {zone.cones.length} cones, {zone.lines?.length || 0} lines
                    </p>
                  </button>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => toggleZoneVisibility(zone.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    >
                      {zone.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteZone(zone.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="showAll"
              checked={showAllZones}
              onChange={(e) => setShowAllZones(e.target.checked)}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <label htmlFor="showAll" className="text-sm text-gray-700 font-medium">
              Show all zones on map
            </label>
          </div>
        </div>

        {/* Smart Features */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <JobManagement onJobSelect={handleJobSelect} />
          <AIOptimizer 
            cones={visibleCones} 
            lines={visibleLines} 
            onApplySuggestion={handleAISuggestion} 
          />
          <MLPredictor 
            cones={visibleCones} 
            lines={visibleLines} 
          />
          <IoTDashboard onDeviceSelect={handleIoTDeviceSelect} />
          <Analytics zones={zones} />
          <CollaborationHub onInviteTeam={handleInviteTeam} />
          <EnterpriseFeatures />
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-200 space-y-3 bg-gray-50">
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={exportData}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            <motion.label
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-200 cursor-pointer font-medium"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </motion.label>
          </div>
          <div className="text-xs text-gray-500 text-center">
            {zones.reduce((total, zone) => total + zone.cones.length, 0)} cones, {zones.reduce((total, zone) => total + (zone.lines?.length || 0), 0)} lines across {zones.length} zones
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {drawingMode && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute top-6 left-6 z-[1000] text-white px-6 py-3 rounded-xl shadow-lg backdrop-blur-sm ${
              drawingMode === 'cone' 
                ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                : 'bg-gradient-to-r from-blue-500 to-cyan-500'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                {drawingMode === 'cone' ? <MapPin className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
              </div>
              <span className="font-medium">
                {drawingMode === 'cone' 
                  ? `Click to place ${selectedConeType} cones`
                  : `Click to draw ${selectedLineType} lines`
                }
              </span>
            </div>
          </motion.div>
        )}

        <MapContainer
          center={[36.1699, -115.1398]} // Las Vegas, Nevada
          zoom={11}
          className="h-full w-full"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler 
            onMapClick={handleMapClick} 
            drawingMode={drawingMode}
            onLinePoint={handleLinePoint}
          />
          
          {/* Render cones */}
          {visibleCones.map(cone => (
            <Marker
              key={cone.id}
              position={[cone.lat, cone.lng]}
              icon={createConeIcon(cone.type)}
            >
              <Popup>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getConeColor(cone.type) }}
                    />
                    <span className="font-semibold text-gray-900">
                      {cone.type.charAt(0).toUpperCase() + cone.type.slice(1)} Cone
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <div>📍 {cone.lat.toFixed(6)}, {cone.lng.toFixed(6)}</div>
                    <div>🕒 {cone.timestamp.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => removeCone(cone.id)}
                    className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-700 text-sm bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Cone</span>
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render completed lines */}
          {visibleLines.map(line => (
            <Polyline
              key={line.id}
              positions={line.points}
              color={getLineColor(line.type)}
              weight={5}
              opacity={0.8}
            >
              <Popup>
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: getLineColor(line.type) }}
                    />
                    <span className="font-semibold text-gray-900">{line.name}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <div>📏 {line.points.length} points</div>
                    <div>🕒 {line.timestamp.toLocaleString()}</div>
                  </div>
                  <button
                    onClick={() => removeLine(line.id)}
                    className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-700 text-sm bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Remove Line</span>
                  </button>
                </div>
              </Popup>
            </Polyline>
          ))}

          {/* Render current line being drawn */}
          {currentLine.length > 1 && (
            <Polyline
              positions={currentLine}
              color={getLineColor(selectedLineType)}
              weight={5}
              opacity={0.6}
              dashArray="10, 10"
            />
          )}
        </MapContainer>
      </div>

      {/* Voice Commands */}
      <VoiceCommands onCommand={handleVoiceCommand} />

      {/* AR Visualization */}
      <ARVisualization 
        cones={visibleCones}
        lines={visibleLines}
        isVisible={showARVisualization}
        onToggle={() => setShowARVisualization(!showARVisualization)}
      />
    </div>
  );
}

export default App;