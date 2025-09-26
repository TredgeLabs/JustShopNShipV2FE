import React, { useState, useEffect } from 'react';
import {
  MessageCircle,
  Send,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Mail
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { adminApiService } from '../services/adminApiService';
import { formatDate } from '../utils/adminHelpers';

interface SupportQuery {
  id: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'replied' | 'resolved';
  submittedAt: string;
}

const ContactSupport: React.FC = () => {
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<SupportQuery | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadSupportQueries();
  }, []);

  const loadSupportQueries = async () => {
    try {
      setIsLoading(true);
      const response = await adminApiService.getSupportQueries();
      if (response.success) {
        setQueries(response.data);
      } else {
        setError('Failed to load support queries');
      }
    } catch (err) {
      setError('Error loading support queries');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelect = (query: SupportQuery) => {
    setSelectedQuery(query);
    setReplyMessage('');
    setError('');
    setSuccess('');
  };

  const handleSendReply = async () => {
    if (!selectedQuery || !replyMessage.trim()) {
      setError('Please enter a reply message');
      return;
    }

    try {
      setIsSending(true);
      setError('');

      const replyData = {
        queryId: selectedQuery.id,
        message: replyMessage.trim(),
        adminName: 'Admin', // In production, get from auth context
        timestamp: new Date().toISOString()
      };

      const response = await adminApiService.replyToSupportQuery(selectedQuery.id, replyData);

      if (response.success) {
        setSuccess('Reply sent successfully!');
        setReplyMessage('');

        // Update query status
        setQueries(prev => prev.map(query =>
          query.id === selectedQuery.id
            ? { ...query, status: 'replied' as const }
            : query
        ));

        setSelectedQuery(prev => prev ? { ...prev, status: 'replied' as const } : null);

        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to send reply');
      }
    } catch (err) {
      setError('Error sending reply');
    } finally {
      setIsSending(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Customer Support</h1>
          </div>
          <p className="text-gray-600">
            Manage and respond to customer support queries and requests.
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Queries List */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Support Queries</h2>
            </div>

            <div className="p-6">
              {isLoading ? (
                <LoadingSpinner text="Loading support queries..." />
              ) : queries.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No support queries found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {queries.map((query) => (
                    <div
                      key={query.id}
                      onClick={() => handleQuerySelect(query)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedQuery?.id === query.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900 text-sm">{query.subject}</h3>
                          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(query.priority)}`}>
                            {getPriorityIcon(query.priority)}
                            <span>{query.priority}</span>
                          </div>
                        </div>
                        <StatusBadge status={query.status} type='query' />
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{query.userName}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(query.submittedAt)}</span>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 line-clamp-2">
                        {query.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Query Details & Reply */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {selectedQuery ? 'Query Details & Reply' : 'Select a Query'}
              </h2>
            </div>

            <div className="p-6">
              {!selectedQuery ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Select a query from the list to view details and reply</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">Customer Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Name:</span>
                        <span className="font-medium">{selectedQuery.userName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{selectedQuery.userEmail}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Submitted:</span>
                        <span className="font-medium">{formatDate(selectedQuery.submittedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">Priority:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedQuery.priority)}`}>
                          {selectedQuery.priority}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Query Content */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Subject</h3>
                    <p className="text-gray-700 mb-4">{selectedQuery.subject}</p>

                    <h3 className="font-medium text-gray-900 mb-2">Message</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedQuery.message}</p>
                    </div>
                  </div>

                  {/* Reply Section */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Reply to Customer</h3>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Type your reply here..."
                    />

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {replyMessage.length}/1000 characters
                      </div>
                      <button
                        onClick={handleSendReply}
                        disabled={isSending || !replyMessage.trim()}
                        className="flex items-center space-x-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                      >
                        {isSending ? (
                          <>
                            <LoadingSpinner size="sm" text="" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Send Reply</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Reply Templates */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Quick Reply Templates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        "Thank you for contacting us. We're looking into your issue and will get back to you shortly.",
                        "We apologize for any inconvenience. Our team is working to resolve this matter.",
                        "Your order has been processed and you should receive tracking information soon.",
                        "Please provide your order ID so we can assist you better.",
                        "We've escalated your issue to our technical team for further investigation.",
                        "Your refund has been processed and should reflect in your account within 3-5 business days."
                      ].map((template, index) => (
                        <button
                          key={index}
                          onClick={() => setReplyMessage(template)}
                          className="text-left p-2 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 transition-colors"
                        >
                          {template}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ContactSupport;