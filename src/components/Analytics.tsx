import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart3, TrendingUp, Clock, DollarSign, Users, AlertTriangle } from 'lucide-react';

interface AnalyticsProps {
  zones: any[];
}

export function Analytics({ zones }: AnalyticsProps) {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Generate mock analytics data
  const trafficData = [
    { hour: '6AM', before: 120, after: 85 },
    { hour: '8AM', before: 280, after: 195 },
    { hour: '10AM', before: 150, after: 125 },
    { hour: '12PM', before: 200, after: 160 },
    { hour: '2PM', before: 180, after: 145 },
    { hour: '4PM', before: 320, after: 220 },
    { hour: '6PM', before: 290, after: 200 },
    { hour: '8PM', before: 140, after: 110 },
  ];

  const costData = [
    { category: 'Labor', amount: 12500 },
    { category: 'Equipment', amount: 8200 },
    { category: 'Materials', amount: 4800 },
    { category: 'Permits', amount: 1200 },
  ];

  const safetyData = [
    { metric: 'Incidents', value: 2, change: -60 },
    { metric: 'Near Misses', value: 5, change: -40 },
    { metric: 'Compliance Score', value: 94, change: +12 },
  ];

  const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  const totalCones = zones.reduce((sum, zone) => sum + zone.cones.length, 0);
  const totalLines = zones.reduce((sum, zone) => sum + (zone.lines?.length || 0), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowAnalytics(!showAnalytics)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Analytics</h3>
              <p className="text-sm text-gray-500">Real-time insights & predictions</p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showAnalytics ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'traffic', label: 'Traffic', icon: TrendingUp },
                  { id: 'costs', label: 'Costs', icon: DollarSign },
                  { id: 'safety', label: 'Safety', icon: AlertTriangle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Users className="w-5 h-5 text-purple-600" />
                            <span className="text-sm font-medium text-gray-700">Active Zones</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">{zones.length}</div>
                          <div className="text-sm text-green-600">+2 this week</div>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Efficiency</span>
                          </div>
                          <div className="text-2xl font-bold text-gray-900">87%</div>
                          <div className="text-sm text-green-600">+12% improvement</div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">Zone Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Cones:</span>
                            <span className="font-medium">{totalCones}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Lines:</span>
                            <span className="font-medium">{totalLines}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Avg. Setup Time:</span>
                            <span className="font-medium">23 min</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'traffic' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Traffic Flow Impact</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={trafficData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="before" stroke="#ef4444" strokeWidth={2} name="Before" />
                            <Line type="monotone" dataKey="after" stroke="#10b981" strokeWidth={2} name="After" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-sm text-gray-600">
                        Average delay reduction: <span className="font-medium text-green-600">32%</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'costs' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Cost Breakdown</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={costData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="amount"
                              label={({ category, amount }) => `${category}: $${amount}`}
                            >
                              {costData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => `$${value}`} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-sm text-gray-600">
                        Total project cost: <span className="font-medium">$26,700</span>
                      </div>
                    </div>
                  )}

                  {activeTab === 'safety' && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Safety Metrics</h4>
                      <div className="space-y-3">
                        {safetyData.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">{metric.metric}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-bold text-gray-900">{metric.value}</span>
                              <span className={`text-sm font-medium ${
                                metric.change > 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {metric.change > 0 ? '+' : ''}{metric.change}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}