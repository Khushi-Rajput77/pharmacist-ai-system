import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { chatAPI } from '../../services/api';
import './ChatStyles.css';

function ChatInterface({ customerId }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatAPI.process(inputValue, customerId);
      const botMsg = {
        id: Date.now() + 1,
        text: response.data.response,
        sender: 'bot',
        data: response.data
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: Date.now() + 1,
        text: '❌ Error: ' + (error.response?.data?.error || error.message),
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported in your browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setInputValue(transcript);
    };
    recognition.start();
  };

  return (
    <div className="chat-container">
      {/* Back Button */}
      <div className="chat-header-with-back">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="chat-header">
        <h1>🏥 AI Pharmacist</h1>
        <p>Chat with me about your medicines</p>
      </div>

      <div className="messages-list">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>👋 Hello! I'm your AI pharmacist.</p>
            <p>Try saying: "I need aspirin 500mg, 10 tablets"</p>
          </div>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <p>⏳ Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask for medicine..."
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleVoiceInput}
          className={`voice-btn ${isListening ? 'listening' : ''}`}
          disabled={loading}
          title="Click to speak"
        >
          🎤
        </button>
        <button type="submit" disabled={loading || !inputValue.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatInterface;