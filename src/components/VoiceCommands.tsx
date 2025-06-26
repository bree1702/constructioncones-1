import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Zap } from 'lucide-react';
import { useSpeechSynthesis, useSpeechRecognition } from 'react-speech-kit';

interface VoiceCommandsProps {
  onCommand: (command: string, params?: any) => void;
}

export function VoiceCommands({ onCommand }: VoiceCommandsProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const { speak, cancel, speaking } = useSpeechSynthesis();
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result: string) => {
      handleVoiceCommand(result);
    },
  });

  useEffect(() => {
    setIsSpeaking(speaking);
  }, [speaking]);

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
    speak({ text, voice: window.speechSynthesis.getVoices()[0] });
  };

  const toggleListening = () => {
    if (listening) {
      stop();
      setIsListening(false);
    } else {
      listen({ continuous: true, interimResults: false });
      setIsListening(true);
    }
  };

  const toggleSpeaking = () => {
    if (speaking) {
      cancel();
    }
  };

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
              </div>
              
              {isListening && (
                <div className="flex items-center space-x-2 mb-3 p-2 bg-blue-50 rounded-lg">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-2 h-2 bg-blue-500 rounded-full"
                  />
                  <span className="text-sm text-blue-700">Listening...</span>
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
            className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all duration-200 ${
              isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600'
            }`}
          >
            {isListening ? (
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <MicOff className="w-8 h-8" />
              </motion.div>
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </motion.button>
        </div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="text-sm font-medium text-gray-700">
            {isListening ? 'Listening for commands...' : 'Tap to activate voice control'}
          </div>
          {lastCommand && (
            <div className="text-xs text-gray-500 mt-1">
              Last: "{lastCommand}"
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}