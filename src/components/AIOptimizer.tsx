import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface OptimizationSuggestion {
  id: string;
  type: 'efficiency' | 'safety' | 'traffic' | 'cost';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  estimatedSavings?: string;
  confidence: number;
}

interface AIOptimizerProps {
  cones: any[];
  lines: any[];
  onApplySuggestion: (suggestion: OptimizationSuggestion) => void;
}

export function AIOptimizer({ cones, lines, onApplySuggestion }: AIOptimizerProps) {
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);

  const generateSuggestions = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const newSuggestions: OptimizationSuggestion[] = [];
      
      if (cones.length > 10) {
        newSuggestions.push({
          id: '1',
          type: 'efficiency',
          title: 'Reduce Cone Density',
          description: 'AI detected 23% redundant cone placement. Optimize spacing for better traffic flow.',
          impact: 'high',
          estimatedSavings: '$2,400/week',
          confidence: 87
        });
      }

      if (lines.length > 0) {
        newSuggestions.push({
          id: '2',
          type: 'traffic',
          title: 'Optimize Detour Route',
          description: 'Alternative route reduces travel time by 15% during peak hours.',
          impact: 'medium',
          estimatedSavings: '45min avg delay',
          confidence: 92
        });
      }

      newSuggestions.push({
        id: '3',
        type: 'safety',
        title: 'Add Warning Cones',
        description: 'Predictive model suggests 3 additional warning cones to prevent accidents.',
        impact: 'high',
        confidence: 95
      });

      newSuggestions.push({
        id: '4',
        type: 'cost',
        title: 'Smart Scheduling',
        description: 'Adjust work hours to reduce labor costs by 18% while maintaining safety.',
        impact: 'medium',
        estimatedSavings: '$1,200/day',
        confidence: 78
      });

      setSuggestions(newSuggestions);
      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    if (cones.length > 0 || lines.length > 0) {
      generateSuggestions();
    }
  }, [cones.length, lines.length]);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'efficiency': return <Zap className="w-4 h-4" />;
      case 'safety': return <AlertCircle className="w-4 h-4" />;
      case 'traffic': return <TrendingUp className="w-4 h-4" />;
      case 'cost': return <Clock className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowOptimizer(!showOptimizer)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Optimizer</h3>
              <p className="text-sm text-gray-500">
                {suggestions.length} optimization suggestions
              </p>
            </div>
          </div>
          <motion.div
            animate={{ rotate: showOptimizer ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {showOptimizer && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-4">
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"
                    />
                    <span className="text-gray-600">AI analyzing construction zone...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {suggestions.map((suggestion) => (
                    <motion.div
                      key={suggestion.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors duration-200"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(suggestion.type)}
                          <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact} impact
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">
                            {suggestion.confidence}% confidence
                          </div>
                          {suggestion.estimatedSavings && (
                            <div className="text-xs text-green-600 font-medium">
                              {suggestion.estimatedSavings}
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{suggestion.description}</p>
                      <button
                        onClick={() => onApplySuggestion(suggestion)}
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 text-sm font-medium"
                      >
                        Apply Suggestion
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}