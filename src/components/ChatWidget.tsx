import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import chatService, { ChatMessage } from '../api/services/chatService';

interface ChatWidgetProps {
  className?: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isMinimized]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    if (!sessionId) {
      try {
        // In production, start a real session
        // const response = await chatService.startSession();
        // setSessionId(response.data.id);
        
        // For now, use mock session
        setSessionId('mock_session_123');
        
        // Add welcome message
        const welcomeMessage: ChatMessage = {
          id: 'welcome_msg',
          message: "Hi! I'm here to help you with any questions about JustShopAndShip. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date(),
          sessionId: 'mock_session_123',
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    }
  };

  const handleToggleChat = () => {
    if (!isOpen) {
      setIsOpen(true);
      initializeChat();
    } else {
      setIsOpen(false);
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message to chat
    const newUserMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      message: userMessage,
      sender: 'user',
      timestamp: new Date(),
      sessionId: sessionId || 'mock_session_123',
    };

    setMessages(prev => [...prev, newUserMessage]);

    try {
      // Use mock service for now (replace with real API call in production)
      const response = await chatService.mockSendMessage(userMessage);
      
      // Add bot response to chat
      setMessages(prev => [...prev, response.botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        message: "Sorry, I'm having trouble responding right now. Please try again or contact our support team.",
        sender: 'bot',
        timestamp: new Date(),
        sessionId: sessionId || 'mock_session_123',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={handleToggleChat}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          aria-label="Open chat"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-80 h-96 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <div>
                <h3 className="font-semibold">JustShopAndShip Support</h3>
                <p className="text-xs text-blue-100">We're here to help!</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="Minimize chat"
              >
                <Minimize2 className="h-4 w-4" />
              </button>
              <button
                onClick={handleToggleChat}
                className="text-blue-100 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          {!isMinimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        {message.sender === 'bot' && (
                          <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                        )}
                        {message.sender === 'user' && (
                          <User className="h-4 w-4 mt-0.5 text-blue-100" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.message}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg p-2 transition-colors"
                    aria-label="Send message"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Press Enter to send, Shift+Enter for new line
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;