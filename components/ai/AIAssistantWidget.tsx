/**
 * AI Assistant Widget Component
 * Conversational AI assistant for contextual help and data queries
 * Named "Ask UNO AI" - provides proactive insights and answers user questions
 */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  Send, 
  X, 
  Minimize2, 
  Maximize2, 
  Brain, 
  Mic, 
  MicOff,
  Volume2,
  VolumeX,
  Copy,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Calendar,
  MapPin,
  Users,
  Target,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Play,
  Pause,
  Loader
} from 'lucide-react';

import { 
  ChatMessage, 
  ChatAttachment, 
  ChatAction,
  AIAssistant,
  ConversationContext,
  MessageFeedback 
} from '../../types';

interface AIAssistantWidgetProps {
  isOpen: boolean;
  isMinimized: boolean;
  onToggle: () => void;
  onMinimize: () => void;
  assistant: AIAssistant;
  context: ConversationContext;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onExecuteAction: (action: ChatAction) => void;
  onProvideFeedback: (messageId: string, feedback: MessageFeedback) => void;
  isDark?: boolean;
  unreadCount?: number;
}

export function AIAssistantWidget({
  isOpen,
  isMinimized,
  onToggle,
  onMinimize,
  assistant,
  context,
  messages,
  onSendMessage,
  onExecuteAction,
  onProvideFeedback,
  isDark = false,
  unreadCount = 0
}: AIAssistantWidgetProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
      setIsTyping(true);
      
      // Simulate AI typing delay
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    if (!isListening) {
      setIsListening(true);
      // Implement speech recognition here
      setTimeout(() => {
        setIsListening(false);
        setInputMessage("What's driving rate changes this week?");
      }, 2000);
    } else {
      setIsListening(false);
    }
  };

  const handleTextToSpeech = (text: string) => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      // Implement text-to-speech here
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    } else {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const getMessageIcon = (type: ChatMessage['type']) => {
    switch (type) {
      case 'assistant':
        return <Brain className="w-4 h-4 text-blue-400" />;
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return null;
    }
  };

  const getAttachmentIcon = (type: ChatAttachment['type']) => {
    switch (type) {
      case 'chart':
        return <BarChart3 className="w-4 h-4" />;
      case 'table':
        return <Target className="w-4 h-4" />;
      case 'grid_reference':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const renderAttachment = (attachment: ChatAttachment) => {
    return (
      <div
        key={attachment.id}
        className={`p-3 rounded-lg border mt-2 ${
          isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          {getAttachmentIcon(attachment.type)}
          <span className="font-medium text-sm">{attachment.title}</span>
        </div>
        
        {attachment.type === 'chart' && (
          <div className="bg-blue-500/10 p-4 rounded text-center text-sm text-blue-400">
            📊 Interactive Chart: {attachment.title}
          </div>
        )}
        
        {attachment.type === 'table' && (
          <div className="bg-green-500/10 p-4 rounded text-center text-sm text-green-400">
            📋 Data Table: {attachment.title}
          </div>
        )}
        
        {attachment.type === 'grid_reference' && (
          <div className="bg-purple-500/10 p-4 rounded text-center text-sm text-purple-400">
            🎯 Grid Reference: {attachment.title}
          </div>
        )}
      </div>
    );
  };

  const renderActions = (actions: ChatAction[]) => {
    return (
      <div className="flex flex-wrap gap-2 mt-3">
        {actions.map((action) => (
          <button
            key={action.id}
            onClick={() => onExecuteAction(action)}
            className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
          >
            {action.type === 'apply_suggestion' && <Target className="w-3 h-3" />}
            {action.type === 'show_data' && <BarChart3 className="w-3 h-3" />}
            {action.type === 'navigate_to' && <MapPin className="w-3 h-3" />}
            {action.type === 'export_data' && <Copy className="w-3 h-3" />}
            {action.label}
          </button>
        ))}
      </div>
    );
  };

  // Sample contextual suggestions based on current view
  const getContextualSuggestions = () => {
    const suggestions = [
      "What's driving rate changes this week?",
      "Show me competitor rate drops",
      "Which dates have AI restrictions applied?",
      "Explain the RevPAR impact forecast",
      "What events are affecting demand?",
      "Compare performance vs last month",
      "Show me overbooking risks",
      "Optimize rates for high-demand dates"
    ];
    
    return suggestions.slice(0, 4);
  };

  // Floating widget when minimized
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={onToggle}
          className={`
            relative p-4 rounded-full shadow-2xl border backdrop-blur-sm
            transition-all duration-300 hover:scale-110 hover:shadow-xl
            ${isDark 
              ? 'bg-gray-900/95 border-gray-700 text-white hover:bg-gray-800' 
              : 'bg-white/95 border-gray-200 text-gray-900 hover:bg-gray-50'
            }
          `}
        >
          <Brain className="w-6 h-6 text-blue-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400/20" />
        </button>
      </div>
    );
  }

  // Full widget when open
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className={`
        w-96 h-[600px] rounded-xl shadow-2xl border backdrop-blur-xl
        transition-all duration-300 flex flex-col
        ${isMinimized ? 'h-14' : 'h-[600px]'}
        ${isDark 
          ? 'bg-gray-900/95 border-gray-700 text-white' 
          : 'bg-white/95 border-gray-200 text-gray-900'
        }
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-opacity-20 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Brain className="w-6 h-6 text-blue-400" />
              <div className="absolute inset-0 animate-pulse bg-blue-400/20 rounded-full" />
            </div>
            <div>
              <h3 className="font-semibold">Ask UNO AI</h3>
              <div className="flex items-center gap-2 text-xs opacity-75">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>Online</span>
                <span>•</span>
                <span className="capitalize">{assistant.personality.tone}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={onMinimize}
              className="p-1.5 rounded-lg hover:bg-gray-500/20 transition-colors"
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-gray-500/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 mx-auto mb-4 text-blue-400 opacity-50" />
                  <h4 className="font-medium mb-2">Hi! I'm UNO AI</h4>
                  <p className="text-sm opacity-75 mb-4">
                    I can help you understand rates, analyze trends, and optimize your revenue strategy.
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-xs font-medium opacity-60">Try asking:</p>
                    {getContextualSuggestions().map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => setInputMessage(suggestion)}
                        className="block w-full text-left px-3 py-2 text-xs rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors"
                      >
                        "{suggestion}"
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {message.type !== 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          {getMessageIcon(message.type)}
                        </div>
                      )}
                      
                      <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                        <div className={`
                          inline-block p-3 rounded-2xl text-sm leading-relaxed
                          ${message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : isDark 
                              ? 'bg-gray-800/50 border border-gray-700' 
                              : 'bg-gray-100 border border-gray-200'
                          }
                        `}>
                          {message.content}
                          
                          {message.attachments?.map(renderAttachment)}
                          {message.actions && renderActions(message.actions)}
                        </div>
                        
                        <div className={`flex items-center gap-2 mt-2 text-xs opacity-50 ${
                          message.type === 'user' ? 'justify-end' : ''
                        }`}>
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          
                          {message.type === 'assistant' && (
                            <>
                              <button
                                onClick={() => handleTextToSpeech(message.content)}
                                className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                              >
                                {isSpeaking ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                              </button>
                              
                              <button
                                onClick={() => navigator.clipboard.writeText(message.content)}
                                className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                              
                              <button
                                onClick={() => onProvideFeedback(message.id, { helpful: true, timestamp: new Date() })}
                                className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                              </button>
                              
                              <button
                                onClick={() => onProvideFeedback(message.id, { helpful: false, timestamp: new Date() })}
                                className="p-1 rounded hover:bg-gray-500/20 transition-colors"
                              >
                                <ThumbsDown className="w-3 h-3" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-500/20 flex items-center justify-center">
                          <Users className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-blue-400 animate-pulse" />
                      </div>
                      <div className={`
                        inline-block p-3 rounded-2xl text-sm
                        ${isDark 
                          ? 'bg-gray-800/50 border border-gray-700' 
                          : 'bg-gray-100 border border-gray-200'
                        }
                      `}>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-opacity-20">
              <div className="flex items-end gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me about rates, events, competitors..."
                    className={`
                      w-full px-4 py-3 pr-12 rounded-xl border resize-none
                      ${isDark 
                        ? 'bg-gray-800/50 border-gray-700 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500
                    `}
                  />
                  
                  <button
                    onClick={handleVoiceInput}
                    className={`
                      absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg transition-colors
                      ${isListening 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'hover:bg-gray-500/20'
                      }
                    `}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500/50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              <div className="flex items-center justify-between mt-2 text-xs opacity-50">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <div className="flex items-center gap-2">
                  <span>Powered by UNO AI</span>
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AIAssistantWidget; 