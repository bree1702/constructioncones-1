import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  FileText, 
  Users, 
  Calendar, 
  DollarSign, 
  BarChart3,
  Settings,
  Lock,
  Globe,
  Smartphone,
  Database,
  Cloud
} from 'lucide-react';

interface EnterpriseFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'pending' | 'disabled';
  category: 'compliance' | 'management' | 'integration' | 'analytics';
}

export function EnterpriseFeatures() {
  const [showFeatures, setShowFeatures] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('compliance');

  const features: EnterpriseFeature[] = [
    {
      id: 'compliance-1',
      title: 'OSHA Compliance Tracking',
      description: 'Automated compliance monitoring and reporting for OSHA safety standards',
      icon: <Shield className="w-5 h-5" />,
      status: 'active',
      category: 'compliance'
    },
    {
      id: 'compliance-2',
      title: 'DOT Permit Management',
      description: 'Digital permit tracking and renewal notifications',
      icon: <FileText className="w-5 h-5" />,
      status: 'active',
      category: 'compliance'
    },
    {
      id: 'management-1',
      title: 'Workforce Management',
      description: 'Team scheduling, time tracking, and resource allocation',
      icon: <Users className="w-5 h-5" />,
      status: 'active',
      category: 'management'
    },
    {
      id: 'management-2',
      title: 'Project Timeline',
      description: 'Gantt charts and milestone tracking for construction projects',
      icon: <Calendar className="w-5 h-5" />,
      status: 'pending',
      category: 'management'
    },
    {
      id: 'analytics-1',
      title: 'Cost Analytics',
      description: 'Real-time cost tracking and budget optimization',
      icon: <DollarSign className="w-5 h-5" />,
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'analytics-2',
      title: 'Performance Dashboard',
      description: 'Executive-level KPI dashboard with custom metrics',
      icon: <BarChart3 className="w-5 h-5" />,
      status: 'active',
      category: 'analytics'
    },
    {
      id: 'integration-1',
      title: 'ERP Integration',
      description: 'Seamless integration with SAP, Oracle, and other ERP systems',
      icon: <Database className="w-5 h-5" />,
      status: 'pending',
      category: 'integration'
    },
    {
      id: 'integration-2',
      title: 'Cloud Sync',
      description: 'Multi-cloud deployment with AWS, Azure, and GCP support',
      icon: <Cloud className="w-5 h-5" />,
      status: 'active',
      category: 'integration'
    }
  ];

  const categories = [
    { id: 'compliance', label: 'Compliance', icon: <Shield className="w-4 h-4" /> },
    { id: 'management', label: 'Management', icon: <Users className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'integration', label: 'Integration', icon: <Globe className="w-4 h-4" /> }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'disabled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredFeatures = features.filter(f => f.category === activeCategory);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowFeatures(!showFeatures)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Enterprise Features</h3>
              <p className="text-sm text-gray-500">
                {features.filter(f => f.status === 'active').length} active modules
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-gray-400" />
            <motion.div
              animate={{ rotate: showFeatures ? 180 : 0 }}
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
        {showFeatures && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {/* Category Tabs */}
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.icon}
                    <span>{category.label}</span>
                  </button>
                ))}
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {filteredFeatures.map((feature) => (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          {feature.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                        {feature.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Enterprise Stats */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">99.9%</div>
                    <div className="text-xs text-gray-600">Uptime SLA</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
                    <div className="text-xs text-gray-600">Support</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">SOC2</div>
                    <div className="text-xs text-gray-600">Compliant</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
                  <Smartphone className="w-4 h-4" />
                  <span className="text-sm font-medium">Mobile App</span>
                </button>
                <button className="flex items-center justify-center space-x-2 p-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors duration-200">
                  <Settings className="w-4 h-4" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}