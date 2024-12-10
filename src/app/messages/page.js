'use client';

import { useState, useEffect } from 'react';

export default function MessagesPage({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/messages?senderId=${userId}&recipientId=${recipientId}`);
      if (!res.ok) throw new Error('Failed to fetch messages');
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) {
      alert('Message cannot be empty');
      return;
    }
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: userId, recipientId, content: newMessage }),
      });

      if (!res.ok) throw new Error('Failed to send message');
      setNewMessage('');
      fetchMessages(); 
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (recipientId) fetchMessages();
  }, [recipientId]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>

      {/* Recipient Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Recipient ID"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3"
        />
      </div>

      {/* Loading/Error Handling */}
      {loading && <p className="text-blue-500">Loading messages...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Messages Display */}
      <div className="bg-gray-100 p-4 rounded-lg h-64 overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`p-2 rounded-lg mb-2 ${
                msg.senderId === userId ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'
              }`}
            >
              <p>
                <strong>{msg.senderId === userId ? 'You' : 'Them'}:</strong> {msg.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">
            {recipientId ? 'No messages yet. Start the conversation!' : 'Select a recipient to view messages.'}
          </p>
        )}
      </div>

      {/* Input Field and Send Button */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow border border-gray-300 rounded-lg p-3"
        />
        <button
          onClick={sendMessage}
          disabled={!recipientId || loading}
          className={`py-2 px-6 rounded-lg ${
            recipientId && !loading
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
}
