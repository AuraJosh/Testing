/**
 * Aura Chatbot Widget - Reusable Component
 * Version: 1.0.0
 * License: MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AuraChatbotWidget = factory());
}(this, (function () {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
      accountId: 'AUR000',
      apiUrl: 'https://384f8lmpn2.execute-api.eu-north-1.amazonaws.com/chatbot',
      primaryColor: '#070d1e',
      position: 'bottom-right',
      greetingMessage: "Hello! I'm your AI assistant. How can I help you today?",
      branding: {
          logo: null, // Will use default Aura logo if null
          name: 'Aura AI Assistant'
      },
      suggestions: [
          'What can you do?',
          'What services do you offer?',
          'What are your business hours?',
          'Where are you located?',
          'How can I contact you?'
      ],
      disclaimerUrl: 'https://auraai.uk/frontend/disclaimer.html',
      websiteUrl: 'https://auraai.uk/',
      zIndex: 9999
  };

  // Default Aura logo as base64 data URL
  const DEFAULT_LOGO = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiNmZmZmZmYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDJMMTAuNSA2SDEzLjVMOCAxNEwyLjUgNkg1LjVMOCAyWiIgZmlsbD0iIzA3MGQxZSIvPgo8L3N2Zz4KPC9zdmc+';

  // CSS Styles
  const CSS_STYLES = `
      .aura-chatbot-widget * {
          box-sizing: border-box;
      }
      
      .aura-chatbot-widget {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          font-size: 14px;
          line-height: 1.5;
      }

      @keyframes aura-pulse {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
      }

      .aura-typing-indicator span {
          animation: aura-pulse 1s infinite ease-in-out;
          font-size: 28px;
          line-height: 10px;
          display: inline-block;
          margin: 0 1px;
      }

      .aura-typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
      }

      .aura-typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
      }

      .aura-chat-container {
          position: fixed;
          width: 384px;
          max-width: calc(100vw - 32px);
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          transition: all 0.3s ease;
          transform-origin: var(--transform-origin, bottom right);
          transform: scale(0);
          opacity: 0;
      }

      .aura-chat-container.visible {
          transform: scale(1);
          opacity: 1;
      }

      .aura-chat-toggle {
          position: fixed;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .aura-chat-toggle:hover {
          transform: scale(1.1);
      }

      .aura-chat-header {
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
          border-radius: 12px 12px 0 0;
      }

      .aura-chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          min-height: 0;
      }

      .aura-chat-messages::-webkit-scrollbar {
          width: 6px;
      }

      .aura-chat-messages::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
      }

      .aura-chat-messages::-webkit-scrollbar-thumb {
          background: var(--primary-color, #070d1e);
          border-radius: 10px;
      }

      .aura-message {
          display: flex;
          align-items: flex-start;
          max-width: 90%;
      }

      .aura-message.user {
          flex-direction: row-reverse;
          margin-left: auto;
      }

      .aura-message.ai {
          margin-right: auto;
      }

      .aura-message-content {
          padding: 8px 12px;
          border-radius: 12px;
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
      }

      .aura-message.user .aura-message-content {
          background: var(--primary-color, #070d1e);
          color: white;
          margin-right: 8px;
      }

      .aura-message.ai .aura-message-content {
          background: #f3f4f6;
          color: #1f2937;
          margin-left: 8px;
      }

      .aura-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 4px;
      }

      .aura-message.user .aura-avatar {
          background: #e5e7eb;
          color: var(--primary-color, #070d1e);
      }

      .aura-message.ai .aura-avatar {
          background: var(--primary-color, #070d1e);
      }

      .aura-suggestions {
          padding: 0 16px 8px;
          display: flex;
          overflow-x: auto;
          gap: 8px;
          scrollbar-width: thin;
      }

      .aura-suggestions::-webkit-scrollbar {
          height: 6px;
      }

      .aura-suggestions::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
      }

      .aura-suggestions::-webkit-scrollbar-thumb {
          background: var(--primary-color, #070d1e);
          border-radius: 10px;
      }

      .aura-suggestion-chip {
          background: #f3f4f6;
          border: none;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
      }

      .aura-suggestion-chip:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
      }

      .aura-input-container {
          padding: 16px;
          border-top: 1px solid #e5e7eb;
          position: relative;
      }

      .aura-input {
          width: 100%;
          min-height: 40px;
          max-height: 80px;
          padding: 8px 40px 8px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          resize: none;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          scrollbar-width: none;
      }

      .aura-input::-webkit-scrollbar {
          display: none;
      }

      .aura-input:focus {
          border-color: var(--primary-color, #070d1e);
          box-shadow: 0 0 0 2px rgba(7, 13, 30, 0.1);
      }

      .aura-send-button {
          position: absolute;
          right: 24px;
          bottom: 24px;
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: var(--primary-color, #070d1e);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
      }

      .aura-send-button:hover {
          transform: scale(1.1);
      }

      .aura-header-controls {
          display: flex;
          gap: 8px;
      }

      .aura-control-button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
      }

      .aura-control-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
      }

      .aura-footer {
          background: var(--primary-color, #070d1e);
          color: white;
          padding: 8px 16px;
          font-size: 11px;
          text-align: center;
          border-radius: 0 0 12px 12px;
      }

      .aura-footer a {
          color: white;
          text-decoration: underline;
      }

      .aura-footer a:hover {
          opacity: 0.9;
      }

      .aura-timestamp {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 4px;
      }

      .aura-markdown-code {
          font-family: 'Courier New', monospace;
          background-color: rgba(0, 0, 0, 0.05);
          padding: 0.2em 0.4em;
          border-radius: 3px;
      }

      .aura-markdown-link {
          color: #3b82f6;
          text-decoration: underline;
      }

      /* Position variants */
      .aura-position-bottom-right {
          bottom: 24px;
          right: 24px;
      }

      .aura-position-bottom-left {
          bottom: 24px;
          left: 24px;
      }

      .aura-position-top-right {
          top: 24px;
          right: 24px;
      }

      .aura-position-top-left {
          top: 24px;
          left: 24px;
      }

      .aura-position-top-right .aura-chat-container,
      .aura-position-top-left .aura-chat-container {
          --transform-origin: top right;
      }

      .aura-position-bottom-left .aura-chat-container,
      .aura-position-top-left .aura-chat-container {
          --transform-origin: bottom left;
      }

      /* Hidden class */
      .aura-hidden {
          display: none !important;
      }

      /* Mobile responsiveness */
      @media (max-width: 480px) {
          .aura-chat-container {
              width: calc(100vw - 16px);
              height: calc(100vh - 32px);
              border-radius: 8px;
          }
      }
  `;

  // Widget class
  class AuraChatbotWidget {
      constructor(config = {}) {
          this.config = { ...DEFAULT_CONFIG, ...config };
          this.isOpen = false;
          this.conversationHistory = [];
          this.recognition = null;
          this.isListening = false;
          this.widgetId = `aura-chatbot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          
          this.init();
      }

      init() {
          this.injectStyles();
          this.createWidget();
          this.bindEvents();
          this.initSpeechRecognition();
      }

      injectStyles() {
          if (document.getElementById('aura-chatbot-styles')) return;
          
          const style = document.createElement('style');
          style.id = 'aura-chatbot-styles';
          style.textContent = CSS_STYLES.replace(/var\(--primary-color[^)]*\)/g, this.config.primaryColor);
          document.head.appendChild(style);
      }

      createWidget() {
          const container = document.createElement('div');
          container.className = `aura-chatbot-widget aura-position-${this.config.position}`;
          container.style.zIndex = this.config.zIndex;
          container.id = this.widgetId;

          const logoSrc = this.config.branding.logo || DEFAULT_LOGO;
          
          container.innerHTML = `
              <button class="aura-chat-toggle" style="background: ${this.config.primaryColor}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
              </button>

              <div class="aura-chat-container aura-hidden">
                  <div class="aura-chat-header" style="background: ${this.config.primaryColor}">
                      <div style="display: flex; align-items: center; gap: 8px;">
                          <a href="${this.config.websiteUrl}" target="_blank" style="display: block;">
                              <div class="aura-avatar" style="background: rgba(255,255,255,0.1);">
                                  <img src="${logoSrc}" alt="Logo" style="width: 16px; height: 16px; border-radius: 50%;">
                              </div>
                          </a>
                          <h3 style="margin: 0; font-size: 14px; font-weight: 500;">${this.config.branding.name}</h3>
                      </div>
                      <div class="aura-header-controls">
                          <button class="aura-control-button aura-voice-toggle" style="display: none;">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                                  <line x1="12" y1="19" x2="12" y2="23"/>
                                  <line x1="8" y1="23" x2="16" y2="23"/>
                              </svg>
                          </button>
                          <button class="aura-control-button aura-close-button">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                  <line x1="18" y1="6" x2="6" y2="18"/>
                                  <line x1="6" y1="6" x2="18" y2="18"/>
                              </svg>
                          </button>
                      </div>
                  </div>

                  <div class="aura-chat-messages">
                      ${this.createInitialMessage()}
                  </div>

                  <div class="aura-suggestions">
                      ${this.config.suggestions.map(suggestion => 
                          `<button class="aura-suggestion-chip">${suggestion}</button>`
                      ).join('')}
                  </div>

                  <div class="aura-input-container">
                      <textarea class="aura-input" placeholder="Type your message..." rows="1"></textarea>
                      <button class="aura-send-button" style="background: ${this.config.primaryColor}">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="22" y1="2" x2="11" y2="13"/>
                              <polygon points="22,2 15,22 11,13 2,9 22,2"/>
                          </svg>
                      </button>
                  </div>

                  <div class="aura-footer" style="background: ${this.config.primaryColor}">
                      <p style="margin: 0;">By chatting, you agree to this <a href="${this.config.disclaimerUrl}" target="_blank">disclaimer</a>.</p>
                      <p style="margin: 4px 0 0 0;">Powered by <a href="${this.config.websiteUrl}" target="_blank">Aura</a></p>
                  </div>
              </div>
          `;

          document.body.appendChild(container);
          this.container = container;
      }

      createInitialMessage() {
          const now = new Date();
          const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const logoSrc = this.config.branding.logo || DEFAULT_LOGO;
          
          return `
              <div class="aura-message ai">
                  <div class="aura-avatar" style="background: ${this.config.primaryColor}">
                      <img src="${logoSrc}" alt="AI Avatar" style="width: 16px; height: 16px; border-radius: 50%;">
                  </div>
                  <div class="aura-message-content">
                      <p style="margin: 0;">${this.config.greetingMessage}</p>
                      <div class="aura-timestamp">${timeString}</div>
                  </div>
              </div>
          `;
      }

      bindEvents() {
          const toggle = this.container.querySelector('.aura-chat-toggle');
          const closeButton = this.container.querySelector('.aura-close-button');
          const input = this.container.querySelector('.aura-input');
          const sendButton = this.container.querySelector('.aura-send-button');
          const suggestions = this.container.querySelector('.aura-suggestions');
          const voiceToggle = this.container.querySelector('.aura-voice-toggle');

          toggle.addEventListener('click', () => this.toggleChat());
          closeButton.addEventListener('click', () => this.closeChat());
          sendButton.addEventListener('click', () => this.sendMessage());
          voiceToggle.addEventListener('click', () => this.toggleVoice());

          input.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  this.sendMessage();
              }
          });

          input.addEventListener('input', () => this.autoResize(input));

          suggestions.addEventListener('click', (e) => {
              if (e.target.classList.contains('aura-suggestion-chip')) {
                  this.sendSuggestion(e.target.textContent.trim());
              }
          });
      }

      initSpeechRecognition() {
          if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
              const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
              this.recognition = new SpeechRecognition();
              this.recognition.continuous = false;
              this.recognition.interimResults = false;

              this.recognition.onresult = (event) => {
                  const transcript = event.results[0][0].transcript;
                  const input = this.container.querySelector('.aura-input');
                  input.value = transcript;
                  this.stopListening();
              };

              this.recognition.onerror = () => this.stopListening();
              
              const voiceToggle = this.container.querySelector('.aura-voice-toggle');
              voiceToggle.style.display = 'flex';
          }
      }

      toggleChat() {
          this.isOpen = !this.isOpen;
          const container = this.container.querySelector('.aura-chat-container');
          const toggle = this.container.querySelector('.aura-chat-toggle');

          if (this.isOpen) {
              container.classList.remove('aura-hidden');
              toggle.classList.add('aura-hidden');
              setTimeout(() => {
                  container.classList.add('visible');
                  const input = this.container.querySelector('.aura-input');
                  input.focus();
              }, 10);
          } else {
              this.closeChat();
          }
      }

      closeChat() {
          this.isOpen = false;
          const container = this.container.querySelector('.aura-chat-container');
          const toggle = this.container.querySelector('.aura-chat-toggle');

          container.classList.remove('visible');
          setTimeout(() => {
              container.classList.add('aura-hidden');
              toggle.classList.remove('aura-hidden');
          }, 300);
      }

      autoResize(textarea) {
          textarea.style.height = 'auto';
          const newHeight = Math.min(textarea.scrollHeight, 80);
          textarea.style.height = newHeight + 'px';
      }

      sendMessage() {
          const input = this.container.querySelector('.aura-input');
          const message = input.value.trim();
          
          if (!message) return;

          this.addMessage(message, 'user');
          input.value = '';
          input.style.height = 'auto';

          this.conversationHistory.push({ role: 'user', content: message });
          this.showTypingIndicator();
          this.fetchAIResponse(message);
      }

      sendSuggestion(message) {
          this.addMessage(message, 'user');
          this.conversationHistory.push({ role: 'user', content: message });
          this.showTypingIndicator();
          this.fetchAIResponse(message);
      }

      async fetchAIResponse(message) {
          const payload = {
              userMessage: message,
              messageHistory: this.conversationHistory.map(msg => ({
                  role: msg.role,
                  content: msg.content
              }))
          };

          try {
              const response = await fetch(this.config.apiUrl, {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      'x-account-id': this.config.accountId
                  },
                  mode: 'cors',
                  body: JSON.stringify(payload)
              });

              if (!response.ok) {
                  throw new Error(`API error: ${response.status}`);
              }

              const data = await response.json();
              this.removeTypingIndicator();

              let aiResponse = this.extractResponse(data);
              this.conversationHistory.push({ role: 'assistant', content: aiResponse });
              this.addMessage(aiResponse, 'ai');

          } catch (error) {
              console.error('Error fetching AI response:', error);
              this.removeTypingIndicator();
              this.addMessage("I'm sorry, there was an error connecting to the service. Please try again later.", 'ai');
          }
      }

      extractResponse(data) {
          if (data.body) {
              try {
                  const bodyData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                  return bodyData.message || bodyData.response || bodyData.content || JSON.stringify(bodyData);
              } catch (e) {
                  return typeof data.body === 'string' ? data.body : JSON.stringify(data.body);
              }
          }
          return data.message || data.response || data.content || 
                 (typeof data === 'string' ? data : JSON.stringify(data)) ||
                 "I'm sorry, I couldn't process your request properly. Please try again.";
      }

      addMessage(text, sender) {
          const now = new Date();
          const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const messagesContainer = this.container.querySelector('.aura-chat-messages');
          const logoSrc = this.config.branding.logo || DEFAULT_LOGO;

          const messageDiv = document.createElement('div');
          messageDiv.className = `aura-message ${sender}`;

          const processedText = sender === 'ai' ? this.processMarkdown(text) : text;

          if (sender === 'user') {
              messageDiv.innerHTML = `
                  <div class="aura-avatar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                      </svg>
                  </div>
                  <div class="aura-message-content">
                      <p style="margin: 0;">${processedText}</p>
                      <div class="aura-timestamp">${timeString}</div>
                  </div>
              `;
          } else {
              messageDiv.innerHTML = `
                  <div class="aura-avatar" style="background: ${this.config.primaryColor}">
                      <img src="${logoSrc}" alt="AI Avatar" style="width: 16px; height: 16px; border-radius: 50%;">
                  </div>
                  <div class="aura-message-content">
                      <p style="margin: 0;">${processedText}</p>
                      <div class="aura-timestamp">${timeString}</div>
                  </div>
              `;
          }

          messagesContainer.appendChild(messageDiv);
          this.scrollToBottom();
      }

      showTypingIndicator() {
          const messagesContainer = this.container.querySelector('.aura-chat-messages');
          const logoSrc = this.config.branding.logo || DEFAULT_LOGO;
          
          const typingDiv = document.createElement('div');
          typingDiv.className = 'aura-message ai aura-typing-message';
          typingDiv.innerHTML = `
              <div class="aura-avatar" style="background: ${this.config.primaryColor}">
                  <img src="${logoSrc}" alt="AI Avatar" style="width: 16px; height: 16px; border-radius: 50%;">
              </div>
              <div class="aura-message-content">
                  <div class="aura-typing-indicator">
                      <span>•</span>
                      <span>•</span>
                      <span>•</span>
                  </div>
              </div>
          `;
          
          messagesContainer.appendChild(typingDiv);
          this.scrollToBottom();
      }

      removeTypingIndicator() {
          const typingMessage = this.container.querySelector('.aura-typing-message');
          if (typingMessage) {
              typingMessage.remove();
          }
      }

      processMarkdown(text) {
          return text
              .replace(/`([^`]+)`/g, '<code class="aura-markdown-code">$1</code>')
              .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="aura-markdown-link" target="_blank">$1</a>');
      }

      scrollToBottom() {
          const messagesContainer = this.container.querySelector('.aura-chat-messages');
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }

      toggleVoice() {
          if (!this.recognition) return;

          if (!this.isListening) {
              this.recognition.start();
              this.isListening = true;
              this.updateVoiceButton(true);
          } else {
              this.recognition.stop();
              this.stopListening();
          }
      }

      stopListening() {
          this.isListening = false;
          this.updateVoiceButton(false);
      }

      updateVoiceButton(listening) {
          const voiceToggle = this.container.querySelector('.aura-voice-toggle');
          if (listening) {
              voiceToggle.style.background = '#ef4444';
              voiceToggle.innerHTML = `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="6" y="6" width="12" height="12"/>
                  </svg>
              `;
          } else {
              voiceToggle.style.background = 'rgba(255, 255, 255, 0.1)';
              voiceToggle.innerHTML = `
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="23"/>
                      <line x1="8" y1="23" x2="16" y2="23"/>
                  </svg>
              `;
          }
      }

      // Public method to destroy the widget
      destroy() {
          if (this.container && this.container.parentNode) {
              this.container.parentNode.removeChild(this.container);
          }
      }

      // Public method to update configuration
      updateConfig(newConfig) {
          this.config = { ...this.config, ...newConfig };
          // Re-inject styles with new primary color if changed
          if (newConfig.primaryColor) {
              const styleEl = document.getElementById('aura-chatbot-styles');
              if (styleEl) {
                  styleEl.textContent = CSS_STYLES.replace(/var\(--primary-color[^)]*\)/g, this.config.primaryColor);
              }
          }
      }

      // Public method to open chat programmatically
      open() {
          if (!this.isOpen) {
              this.toggleChat();
          }
      }

      // Public method to close chat programmatically
      close() {
          if (this.isOpen) {
              this.closeChat();
          }
      }

      // Public method to send a message programmatically
      sendProgrammaticMessage(message) {
          if (typeof message === 'string' && message.trim()) {
              this.sendSuggestion(message.trim());
          }
      }

      // Public method to clear conversation history
      clearHistory() {
          this.conversationHistory = [];
          const messagesContainer = this.container.querySelector('.aura-chat-messages');
          messagesContainer.innerHTML = this.createInitialMessage();
      }

      // Public method to get conversation history
      getHistory() {
          return [...this.conversationHistory];
      }
  }

  // Static methods for the widget
  AuraChatbotWidget.instances = new Map();

  // Factory method to create and manage instances
  AuraChatbotWidget.init = function(config = {}) {
      const instanceId = config.instanceId || 'default';
      
      // Destroy existing instance if it exists
      if (AuraChatbotWidget.instances.has(instanceId)) {
          AuraChatbotWidget.instances.get(instanceId).destroy();
      }
      
      // Create new instance
      const instance = new AuraChatbotWidget(config);
      AuraChatbotWidget.instances.set(instanceId, instance);
      
      return instance;
  };

  // Method to get an existing instance
  AuraChatbotWidget.getInstance = function(instanceId = 'default') {
      return AuraChatbotWidget.instances.get(instanceId);
  };

  // Method to destroy all instances
  AuraChatbotWidget.destroyAll = function() {
      AuraChatbotWidget.instances.forEach(instance => instance.destroy());
      AuraChatbotWidget.instances.clear();
      
      // Remove global styles
      const styleEl = document.getElementById('aura-chatbot-styles');
      if (styleEl && styleEl.parentNode) {
          styleEl.parentNode.removeChild(styleEl);
      }
  };

  // Version information
  AuraChatbotWidget.version = '1.0.0';

  // Event system for custom hooks
  AuraChatbotWidget.prototype.on = function(event, callback) {
      if (!this.events) this.events = {};
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
  };

  AuraChatbotWidget.prototype.emit = function(event, data) {
      if (!this.events || !this.events[event]) return;
      this.events[event].forEach(callback => callback(data));
  };

  // Enhance existing methods to emit events
  const originalAddMessage = AuraChatbotWidget.prototype.addMessage;
  AuraChatbotWidget.prototype.addMessage = function(text, sender) {
      originalAddMessage.call(this, text, sender);
      this.emit('message', { text, sender, timestamp: new Date() });
  };

  const originalToggleChat = AuraChatbotWidget.prototype.toggleChat;
  AuraChatbotWidget.prototype.toggleChat = function() {
      const wasOpen = this.isOpen;
      originalToggleChat.call(this);
      this.emit(this.isOpen ? 'opened' : 'closed', { wasOpen, isOpen: this.isOpen });
  };

  // Auto-initialize if configuration is provided in script tag
  if (typeof document !== 'undefined') {
      document.addEventListener('DOMContentLoaded', function() {
          const scripts = document.getElementsByTagName('script');
          for (let script of scripts) {
              if (script.src && script.src.includes('aura-chatbot-widget')) {
                  const config = script.dataset.config ? JSON.parse(script.dataset.config) : {};
                  if (script.dataset.autoInit === 'true' || config.autoInit) {
                      AuraChatbotWidget.init(config);
                      break;
                  }
              }
          }
      });
  }

  return AuraChatbotWidget;

})));