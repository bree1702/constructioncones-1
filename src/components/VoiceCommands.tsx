import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Zap, AlertCircle, CheckCircle } from 'lucide-react';

interface VoiceCommandsProps {
  onCommand: (command: string, params?: any) => void;
}

type MicrophoneStatus = 'idle' | 'listening' | 'processing' | 'error' | 'permission-denied';

export function VoiceCommands({ onCommand }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [microphoneStatus, setMicrophoneStatus] = useState<MicrophoneStatus>('idle');
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const shouldRestartRef = useRef(false);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setMicrophoneStatus('listening');
        setErrorMessage('');
      };
      
      recognition.onresult = (event) => {
        setMicrophoneStatus('processing');
        const result = event.results[event.results.length - 1][0].transcript;
        handleVoiceCommand(result);
        
        // Return to listening state after processing
        setTimeout(() => {
          if (isListening) {
            setMicrophoneStatus('listening');
          }
        }, 1000);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setMicrophoneStatus('error');
        
        switch (event.error) {
          case 'not-allowed':
          case 'service-not-allowed':
            setPermissionStatus('denied');
            setErrorMessage('Microphone access denied. Please enable microphone permissions.');
            setIsListening(false);
            shouldRestartRef.current = false;
            break;
          case 'network':
            setErrorMessage('Network error. Please check your internet connection.');
            break;
          case 'no-speech':
            setErrorMessage('No speech detected. Try speaking closer to the microphone.');
            // Don't stop listening for no-speech errors, just show feedback
            break;
          default:
            setErrorMessage(`Speech recognition error: ${event.error}`);
        }
      };
      
      recognition.onend = () => {
        // If we should restart (continuous listening is enabled and user hasn't manually stopped)
        if (shouldRestartRef.current && isListening) {
          // Add a small delay before restarting to prevent rapid restart loops
          restartTimeoutRef.current = setTimeout(() => {
            try {
              if (shouldRestartRef.current && isListening) {
                recognition.start();
              }
            } catch (error) {
              console.error('Error restarting speech recognition:', error);
              setMicrophoneStatus('error');
              setIsListening(false);
              shouldRestartRef.current = false;
            }
          }, 100);
        } else {
          setIsListening(false);
          setMicrophoneStatus('idle');
          shouldRestartRef.current = false;
        }
      };
      
      recognitionRef.current = recognition;
      
      // Check microphone permissions
      checkMicrophonePermissions();
    }
    
    return () => {
      if (recognitionRef.current) {
        shouldRestartRef.current = false;
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, []);

  // Update shouldRestart when isListening changes
  useEffect(() => {
    shouldRestartRef.current = isListening;
  }, [isListening]);

  const checkMicrophonePermissions = async () => {
    try {
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(permission.state);
        
        permission.onchange = () => {
          setPermissionStatus(permission.state);
        };
      }
    } catch (error) {
      console.log('Permission API not supported or error:', error);
    }
  };

  const handleVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    setLastCommand(command);
    setCommandHistory(prev => [command, ...prev.slice(0, 4)]);

    // Process voice commands
    if (lowerCommand.includes('place cone') || lowerCommand.includes('add cone')) {
      onCommand('place-cone', { type: 'warning' });
      speakResponse('Placing warning cone at current location');
    } else if (lowerCommand.includes('draw line') || lowerCommand.includes('create barrier')) {
      onCommand('start-line', { type: 'barrier' });
      speakResponse('Starting line drawing mode');
    } else if (lowerCommand.includes('optimize') || lowerCommand.includes('improve')) {
      onCommand('optimize-zone');
      speakResponse('Running AI optimization on current zone');
    } else if (lowerCommand.includes('weather') || lowerCommand.includes('forecast')) {
      onCommand('check-weather');
      speakResponse('Checking weather conditions for construction zone');
    } else if (lowerCommand.includes('traffic') || lowerCommand.includes('congestion')) {
      onCommand('analyze-traffic');
      speakResponse('Analyzing current traffic patterns');
    } else if (lowerCommand.includes('save') || lowerCommand.includes('export')) {
      onCommand('save-zone');
      speakResponse('Saving current zone configuration');
    } else if (lowerCommand.includes('help') || lowerCommand.includes('commands')) {
      speakResponse('Available commands: place cone, draw line, optimize zone, check weather, analyze traffic, save zone');
    } else {
      speakResponse('Command not recognized. Say help for available commands.');
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = async () => {
    if (!isSupported || !recognitionRef.current) return;
    
    if (isListening) {
      // Stop listening
      shouldRestartRef.current = false;
      setIsListening(false);
      setMicrophoneStatus('idle');
      recognitionRef.current.stop();
      
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    } else {
      // Start listening
      try {
        // Check permissions before starting
        if (permissionStatus === 'denied') {
          setErrorMessage('Microphone access denied. Please enable microphone permissions in your browser settings.');
          return;
        }
        
        setIsListening(true);
        shouldRestartRef.current = true;
        setMicrophoneStatus('listening');
        setErrorMessage('');
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setMicrophoneStatus('error');
        setIsListening(false);
        shouldRestartRef.current = false;
        setErrorMessage('Failed to start voice recognition. Please try again.');
      }
    }
  };

  const toggleSpeaking = () => {
    if (synthRef.current && isSpeaking) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  const getMicrophoneStatusIcon = () => {
    switch (microphoneStatus) {
      case 'listening':
        return (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <Mic className="w-8 h-8" />
          </motion.div>
        );
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap className="w-8 h-8" />
          </motion.div>
        );
      case 'error':
        return <AlertCircle className="w-8 h-8" />;
      case 'permission-denied':
        return <MicOff className="w-8 h-8" />;
      default:
        return <Mic className="w-8 h-8" />;
    }
  };

  const getMicrophoneStatusColor = () => {
    switch (microphoneStatus) {
      case 'listening':
        return 'from-green-500 to-emerald-500';
      case 'processing':
        return 'from-blue-500 to-cyan-500';
      case 'error':
      case 'permission-denied':
        return 'from-red-500 to-pink-500';
      default:
        return isListening ? 'from-red-500 to-pink-500' : 'from-blue-500 to-purple-500';
    }
  };

  const getStatusText = () => {
    switch (microphoneStatus) {
      case 'listening':
        return 'Listening for commands...';
      case 'processing':
        return 'Processing command...';
      case 'error':
        return errorMessage || 'Voice recognition error';
      case 'permission-denied':
        return 'Microphone access denied';
      default:
        return isListening ? 'Voice control active' : 'Tap to activate voice control';
    }
  };

  if (!isSupported) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs">
          <div className="flex items-center space-x-2 text-gray-500">
            <MicOff className="w-5 h-5" />
            <span className="text-sm">Voice commands not supported in this browser</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-3">
        {/* Command History */}
        <AnimatePresence>
          {(isListening || commandHistory.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="bg-white rounded-xl shadow-xl border border-gray-200 p-4 max-w-xs"
            >
              <div className="flex items-center space-x-2 mb-3">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-900">Voice Commands</span>
                {isListening && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 font-medium">LIVE</span>
                  </div>
                )}
              </div>
              
              {/* Status Indicator */}
              <div className={`flex items-center space-x-2 mb-3 p-2 rounded-lg ${
                microphoneStatus === 'listening' ? 'bg-green-50' :
                microphoneStatus === 'processing' ? 'bg-blue-50' :
                microphoneStatus === 'error' ? 'bg-red-50' :
                'bg-gray-50'
              }`}>
                {microphoneStatus === 'listening' && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-green-500 rounded-full"
                  />
                )}
                {microphoneStatus === 'processing' && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-2 h-2 border border-blue-500 border-t-transparent rounded-full"
                  />
                )}
                {microphoneStatus === 'error' && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${
                  microphoneStatus === 'listening' ? 'text-green-700' :
                  microphoneStatus === 'processing' ? 'text-blue-700' :
                  microphoneStatus === 'error' ? 'text-red-700' :
                  'text-gray-700'
                }`}>
                  {microphoneStatus === 'listening' ? 'Listening...' :
                   microphoneStatus === 'processing' ? 'Processing...' :
                   microphoneStatus === 'error' ? 'Error' :
                   'Ready'}
                </span>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-xs text-red-700">{errorMessage}</div>
                </div>
              )}

              {commandHistory.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Recent Commands</div>
                  {commandHistory.map((cmd, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-gray-700 p-2 bg-gray-50 rounded-lg"
                    >
                      "{cmd}"
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-3 text-xs text-gray-500">
                Try: "Place cone", "Draw line", "Optimize zone", "Check weather"
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Voice Control Buttons */}
        <div className="flex space-x-3">
          {/* Speaking Indicator/Control */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleSpeaking}
            className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
              isSpeaking
                ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:text-green-600'
            }`}
          >
            {isSpeaking ? (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <Volume2 className="w-6 h-6" />
              </motion.div>
            ) : (
              <VolumeX className="w-6 h-6" />
            )}
          </motion.button>

          {/* Main Voice Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleListening}
            disabled={permissionStatus === 'denied'}
            className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r ${getMicrophoneStatusColor()} text-white hover:shadow-2xl`}
          >
            {getMicrophoneStatusIcon()}
          </motion.button>
        </div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center max-w-xs"
        >
          <div className={`text-sm font-medium ${
            microphoneStatus === 'error' ? 'text-red-600' :
            microphoneStatus === 'listening' ? 'text-green-600' :
            microphoneStatus === 'processing' ? 'text-blue-600' :
            'text-gray-700'
          }`}>
            {getStatusText()}
          </div>
          {lastCommand && !errorMessage && (
            <div className="text-xs text-gray-500 mt-1">
              Last: "{lastCommand}"
            </div>
          )}
          {isListening && (
            <div className="text-xs text-gray-500 mt-1">
              Continuous listening enabled
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}