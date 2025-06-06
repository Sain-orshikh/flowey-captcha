'use client';

import { useState } from 'react';
import FloweyDisplay, { FloweyExpression } from '@/components/FloweyDisplay';
import ExpressionAnalyzer from '@/services/expressionAnalyzer';

interface AnalysisResult {
  expression: FloweyExpression;
  confidence: number;
  reasoning: string;
  sentiment: {
    score: number;
    comparative: number;
    positive: string[];
    negative: string[];
  };
}

export default function Home() {
  // State for the input text
  const [inputText, setInputText] = useState('');
  
  // State for Flowey's expression
  const [expression, setExpression] = useState<FloweyExpression>('neutral');
  
  // State for jumpscare
  const [isJumpscare, setIsJumpscare] = useState(false);

  // State for analysis results (for debugging)
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);

  // State to track if user has submitted input (to show analyzed response)
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // State to track if user is currently typing
  const [isTyping, setIsTyping] = useState(false);

  // Function to analyze text using the new AI-powered analyzer
  const analyzeText = async (text: string) => {
    console.log('Analyzing text:', text); // Debug log
    if (!text.trim()) return 'neutral';
    
    try {
      const analysis = await ExpressionAnalyzer.analyzeExpression(text);
      setLastAnalysis(analysis); // Store for debugging
      
      // Log analysis for debugging
      console.log('Expression Analysis:', analysis);
      console.log('Setting expression to:', analysis.expression);
      
      return analysis.expression;
    } catch (error) {
      console.error('Error analyzing text:', error);
      return 'neutral';
    }
  };

  // Get contextual dialogue based on analysis
  const getFloweyDialogue = () => {
    // If user is typing or hasn't submitted anything yet, show default message
    if (isTyping || !hasSubmitted || !lastAnalysis) {
      return "* Prove you're human. Make Flowey smile!";
    }
    
    // Show analyzed response only after submission
    return ExpressionAnalyzer.getContextualDialogue(lastAnalysis);
  };

  // Handle input change (no analysis while typing)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);
    
    // Mark as typing and reset submission state when user starts typing
    if (newText !== inputText) {
      setIsTyping(true);
      setHasSubmitted(false);
      
      // Clear typing state after user stops typing for 500ms
      setTimeout(() => {
        setIsTyping(false);
      }, 500);
    }
  };

  // Separate jumpscare function
  const handleJumpscare = () => {
    setIsJumpscare(true);
    setExpression('jumpscare');
    
    // Reset jumpscare after 3 seconds
    setTimeout(async () => {
      setIsJumpscare(false);
      const newExpression = await analyzeText(inputText);
      setExpression(newExpression as FloweyExpression);
    }, 3000);
  };

  // Handle button click for analysis and potential jumpscare
  const handleButtonClick = async () => {
    if (!inputText.trim() || isJumpscare) return;
    
    try {
      // Mark as submitted and stop typing state
      setHasSubmitted(true);
      setIsTyping(false);
      
      // Analyze the text when user clicks the button
      const newExpression = await analyzeText(inputText);
      setExpression(newExpression as FloweyExpression);
      
      // Auto-trigger jumpscare for certain expressions
      if (newExpression === 'jumpscare') {
        handleJumpscare();
      }
    } catch (error) {
      console.error('Error analyzing text on button click:', error);
      // Fallback to manual jumpscare if analysis fails
      handleJumpscare();
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-black">
      {/* Dark background with subtle texture */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-black to-black z-0"></div>
      
      {/* Main grass area spotlights */}
      {/* Center grass spotlight - outermost layer */}
      <div className="mt-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 opacity-20 z-50">
        <div className="w-96 h-32 bg-gray-500 blur-sm" style={{borderRadius: '50% 50% 50% 50% / 20% 20% 80% 80%'}}></div>
      </div>
      
      {/* Center grass spotlight - middle layer */}
      <div className="mt-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 z-2 opacity-50">
        <div className="w-80 h-24 bg-gray-300 blur-xs" style={{borderRadius: '50% 50% 50% 50% / 25% 25% 75% 75%'}}></div>
      </div>
      
      {/* Center grass spotlight - inner layer */}
      <div className="mt-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 z-3 opacity-80">
        <div className="w-64 h-16 bg-gray-100" style={{borderRadius: '50% 50% 50% 50% / 30% 30% 70% 70%'}}></div>
      </div>
      
      {/* Grass patch with animation */}
      <div className="absolute mt-6 top-1/2 left-1/2 transform -translate-x-1/2 translate-y-12 z-5">
        <div className="w-32 h-8 bg-green-800 rounded-full shadow-lg"></div>
        <div className="w-28 h-6 bg-green-700 rounded-full mx-auto -mt-2"></div>
        {/* Animated grass blades */}
        <div className="absolute -top-2 left-4 w-1 h-3 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '0s'}}></div>
        <div className="absolute -top-1 left-8 w-1 h-2 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute -top-2 left-12 w-1 h-3 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '1s'}}></div>
        <div className="absolute -top-1 left-16 w-1 h-2 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute -top-2 left-20 w-1 h-3 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '2s'}}></div>
        <div className="absolute -top-1 left-24 w-1 h-2 bg-green-600 rounded-t-full grass-sway" style={{animationDelay: '2.5s'}}></div>
      </div>
      
      {/* Flowey positioned in the center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <FloweyDisplay expression={expression} isJumpscare={isJumpscare} />
      </div>
      
      {/* UI overlay positioned at the bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-20">
        <div className="bg-black/80 backdrop-blur-sm border border-gray-600 rounded-lg p-6 space-y-4">
          {/* Flowey's dialogue */}
          <div className="text-white text-center mb-4">
            <p className="text-lg font-mono undertale-text">
              {getFloweyDialogue()}
            </p>
            {/* Debug information */}
            {lastAnalysis && (
              <div className="mt-2 text-xs text-gray-400">
                <p>Expression: {lastAnalysis.expression} ({Math.round(lastAnalysis.confidence * 100)}% confidence)</p>
                <p>Sentiment Score: {lastAnalysis.sentiment.score}</p>
                {lastAnalysis.sentiment.positive.length > 0 && (
                  <p>Positive words: {lastAnalysis.sentiment.positive.join(', ')}</p>
                )}
                {lastAnalysis.sentiment.negative.length > 0 && (
                  <p>Negative words: {lastAnalysis.sentiment.negative.join(', ')}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-md focus:outline-none focus:border-yellow-400 font-mono"
            placeholder="* (You whisper to yourself...)"
            disabled={isJumpscare}
          />
          
          {/* Action Button */}
          <button
            onClick={handleButtonClick}
            disabled={isJumpscare || !inputText.trim()}
            className={`w-full px-4 py-3 bg-yellow-600 text-black font-bold rounded-md hover:bg-yellow-500 transition-colors font-mono
                       ${isJumpscare || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            * {isJumpscare ? 'YOU CANNOT' : 'Respond to Flowey'}
          </button>
        </div>
      </div>
    </main>
  );
}
