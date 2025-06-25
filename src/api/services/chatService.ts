import apiClient from '../apiClient';
import { ENDPOINTS } from '../endpoints';
import { ApiResponse } from '../config';

// Chat message interface
export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  sessionId: string;
}

// Chat session interface
export interface ChatSession {
  id: string;
  userId?: string;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'ended';
}

// Send message request interface
interface SendMessageRequest {
  message: string;
  sessionId?: string;
}

// Send message response interface
interface SendMessageResponse {
  message: ChatMessage;
  botResponse: ChatMessage;
  sessionId: string;
}

// Chat history response interface
interface ChatHistoryResponse {
  messages: ChatMessage[];
  sessionId: string;
  totalCount: number;
}

class ChatService {
  /**
   * Send a message to the chat bot
   */
  async sendMessage(message: string, sessionId?: string): Promise<ApiResponse<SendMessageResponse>> {
    try {
      const requestData: SendMessageRequest = {
        message,
        ...(sessionId && { sessionId }),
      };

      const response = await apiClient.post<SendMessageResponse>(
        ENDPOINTS.CHAT.SEND_MESSAGE,
        requestData
      );

      return response;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Start a new chat session
   */
  async startSession(): Promise<ApiResponse<ChatSession>> {
    try {
      const response = await apiClient.post<ChatSession>(ENDPOINTS.CHAT.START_SESSION);
      return response;
    } catch (error) {
      console.error('Error starting chat session:', error);
      throw error;
    }
  }

  /**
   * End a chat session
   */
  async endSession(sessionId: string): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(ENDPOINTS.CHAT.END_SESSION(sessionId));
      return response;
    } catch (error) {
      console.error('Error ending chat session:', error);
      throw error;
    }
  }

  /**
   * Get chat history for a session
   */
  async getChatHistory(sessionId: string, limit = 50, offset = 0): Promise<ApiResponse<ChatHistoryResponse>> {
    try {
      const response = await apiClient.get<ChatHistoryResponse>(
        ENDPOINTS.CHAT.GET_HISTORY,
        {
          sessionId,
          limit,
          offset,
        }
      );

      return response;
    } catch (error) {
      console.error('Error fetching chat history:', error);
      throw error;
    }
  }

  /**
   * Mock function for local testing (remove in production)
   */
  async mockSendMessage(message: string): Promise<SendMessageResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      message,
      sender: 'user',
      timestamp: new Date(),
      sessionId: 'mock_session_123',
    };

    // Simple mock responses based on message content
    let botResponseText = "Thank you for your message! Our team will get back to you soon.";
    
    if (message.toLowerCase().includes('shipping')) {
      botResponseText = "For shipping inquiries, you can use our shipping calculator or contact our support team. We offer consolidated shipping to save you money!";
    } else if (message.toLowerCase().includes('order')) {
      botResponseText = "For order-related questions, please check your dashboard or provide your order ID for specific assistance.";
    } else if (message.toLowerCase().includes('vault')) {
      botResponseText = "Your vault address is your personal Indian address for shopping. You can find it in your dashboard under 'Vault Information'.";
    }

    const botMessage: ChatMessage = {
      id: `msg_${Date.now()}_bot`,
      message: botResponseText,
      sender: 'bot',
      timestamp: new Date(),
      sessionId: 'mock_session_123',
    };

    return {
      message: userMessage,
      botResponse: botMessage,
      sessionId: 'mock_session_123',
    };
  }
}

export const chatService = new ChatService();
export default chatService;