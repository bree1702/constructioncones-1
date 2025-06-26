import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, Target, Zap, BarChart } from 'lucide-react';

interface Prediction {
  id: string;
  type: 'traffic' | 'safety' | 'weather' | 'efficiency';
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

interface MLPredictorProps {
  cones: any[];
  lines: any[];
  historicalData?: any[];
}

export function MLPredictor({ cones, lines, historicalData = [] }: MLPredictorProps) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showPredictor, setShowPredictor] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<Prediction | null>(null);

  // Simulate ML predictions
  useEffect(() => {
    if (cones.length > 0 || lines.length > 0) {
      generatePredictions();
    }
  }, [cones.length, lines.length]);

  const generatePredictions = async () => {
    setIsAnalyzing(true);
    
    // Simulate ML processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newPredictions: Prediction[] = [
      {
        id: '1',
        type: 'traffic',
        title: 'Peak Hour Congestion',
        prediction: 'Traffic will increase by 340% during 4-6 PM',
        confidence: 94,
        timeframe: 'Next 4 hours',
        impact: 'high',
        recommendation: 'Deploy 3 additional traffic coordinators and extend work zone by 50 meters'
      },
      {
        id: '2',
        type: 'safety',
        title: 'Accident Risk Assessment',
        prediction: 'High probability of near-miss incidents in Zone A',
        confidence: 87,
        timeframe: 'Next 2 hours',
        impact: 'high',
        recommendation: 'Add 2 warning cones at 30-meter intervals and increase lighting'
      },
      {
        id: '3',
        type: 'weather',
        title: 'Weather Impact Forecast',
        prediction: 'Rain will reduce visibility by 60% at 3 PM',
        confidence: 91,
        timeframe: 'Next 3 hours',
        impact: 'medium',
        recommendation: 'Activate LED cone lights and deploy reflective barriers'
      },
      {
        id: '4',
        type: 'efficiency',
        title: 'Resource Optimization',
        prediction: 'Current setup can be optimized to save 23% time',
        confidence: 78,
        timeframe: 'Immediate',
        impact: 'medium',
        recommendation: 'Relocate 4 cones to create more efficient traffic flow pattern'
      }
    ];
    
    setPredictions(newPredictions);
    setIsAnalyzing(false);
  };

  const getPredictionIcon = (type: string) => {
    switch (type) {
      case 'traffic': return <TrendingUp className="w-5 h-5" />;
      case 'safety': return <AlertTriangle className="w-5 h-5" />;
      case 'weather': return <BarChart className="w-5 h-5" />;
      case 'efficiency': return <Target className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'traffic': return 'from-blue-500 to-cyan-500';
      case 'safety': return 'from-red-500 to-pink-500';
      case 'weather': return 'from-purple-500 to-indigo-500';
      case 'efficiency': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200">
      <div 
        className="p-4 border-b border-gray-200 cursor-pointer"
        onClick={() => setShowPredictor(!showPredictor)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">ML Predictor</h3>
              <p className="text-sm text-gray-500">
                {predictions.length} active predictions
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAnalyzing && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"
              />
            )}
            <motion.div
              animate={{ rotate: showPredictor ? 180 : 0 }}
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
        {showPredictor && (
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
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <Brain className="w-8 h-8 text-white" />
                    </motion.div>
                    <div className="text-gray-600">AI analyzing patterns...</div>
                    <div className="text-sm text-gray-500 mt-1">Processing {cones.length} cones and {lines.length} lines</div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {predictions.map((prediction) => (
                    <motion.div
                      key={prediction.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 cursor-pointer transition-all duration-200"
                      onClick={() => setSelectedPrediction(prediction)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getTypeColor(prediction.type)} rounded-lg flex items-center justify-center`}>
                            {getPredictionIcon(prediction.type)}
                            <span className="text-white text-xs ml-1">{prediction.type}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{prediction.title}</h4>
                            <p className="text-sm text-gray-600">{prediction.timeframe}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{prediction.confidence}%</div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(prediction.impact)}`}>
                            {prediction.impact} impact
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="text-sm text-gray-700 mb-2">{prediction.prediction}</div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${getTypeColor(prediction.type)}`}
                            style={{ width: `${prediction.confidence}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-500 mb-1">AI RECOMMENDATION</div>
                        <div className="text-sm text-gray-700">{prediction.recommendation}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ML Model Info */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">Model Performance</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600">94.2%</div>
                    <div className="text-xs text-indigo-700">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">1.2s</div>
                    <div className="text-xs text-purple-700">Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-pink-600">15.7k</div>
                    <div className="text-xs text-pink-700">Data Points</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prediction Detail Modal */}
      <AnimatePresence>
        {selectedPrediction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedPrediction(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${getTypeColor(selectedPrediction.type)} rounded-lg flex items-center justify-center`}>
                  {getPredictionIcon(selectedPrediction.type)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPrediction.title}</h3>
                  <p className="text-sm text-gray-500">{selectedPrediction.timeframe}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Prediction</div>
                  <div className="text-gray-900">{selectedPrediction.prediction}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-1">Recommendation</div>
                  <div className="text-gray-900">{selectedPrediction.recommendation}</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Confidence</div>
                    <div className="text-2xl font-bold text-gray-900">{selectedPrediction.confidence}%</div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getImpactColor(selectedPrediction.impact)}`}>
                    {selectedPrediction.impact} impact
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedPrediction(null)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all">
                  Apply Recommendation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}