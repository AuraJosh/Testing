(function() {
  // 1. Create container for the widget
  const widget = document.createElement('div');
  widget.id = 'aura-chatbot-container';
  
  // 2. Create Shadow DOM for style isolation
  const shadow = widget.attachShadow({ mode: 'open' });
  
  // 3. Inject your HTML/CSS/JS
  shadow.innerHTML = `
    <div id="chatbot-widget">
      <!-- Load Tailwind CSS -->
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
        tailwind.config = { theme: { extend: {} } };
      </script>
      
      <!-- Font Awesome -->
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
      
      <!-- Custom CSS -->
      <style>
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(-3px); }
        }
        .typing-indicator span {
            animation: pulse 1s infinite ease-in-out;
            font-size: 28px;
            line-height: 10px;
            display: inline-block;
            margin: 0 1px;
        }
        .typing-indicator span:nth-child(2) {
            animation-delay: 0.2s;
        }
        .typing-indicator span:nth-child(3) {
            animation-delay: 0.4s;
        }
        .chat-container {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            transition: all 0.3s ease;
            transform-origin: bottom right;
            height: 500px;
            display: flex;
            flex-direction: column;
            transform: scale(0);
            opacity: 0;
        }
        .chat-container.visible {
            transform: scale(1);
            opacity: 1;
            animation: growIn 0.3s ease-out;
        }
        .chat-container.hidden {
            animation: shrinkOut 0.3s ease-in;
        }
        @keyframes growIn {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        @keyframes shrinkOut {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0);
                opacity: 0;
            }
        }
        .message {
            max-width: 90%;
        }
        .user-message {
            margin-left: auto;
        }
        .ai-message {
            margin-right: auto;
        }
        .chat-toggle {
            transition: all 0.3s ease;
        }
        .chat-toggle:hover {
            transform: scale(1.1);
        }
        .suggestion-chip {
            transition: all 0.2s ease;
        }
        .suggestion-chip:hover {
            transform: translateY(-2px);
        }
        .markdown-code {
            font-family: 'Courier New', monospace;
            background-color: rgba(0, 0, 0, 0.05);
            padding: 0.2em 0.4em;
            border-radius: 3px;
        }
        .markdown-link {
            color: #3b82f6;
            text-decoration: underline;
        }
        #chatMessages {
            flex-grow: 1;
            overflow-y: auto;
        }
        #chatMessages::-webkit-scrollbar {
            width: 6px;
        }
        #chatMessages::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        #chatMessages::-webkit-scrollbar-thumb {
            background: #070d1e;
            border-radius: 10px;
        }
        #chatMessages::-webkit-scrollbar-thumb:hover {
            background: #0a142e;
        }
        #messageInput {
            min-height: 40px;
            max-height: 80px;
            overflow-y: auto !important;
            resize: none;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        #messageInput::-webkit-scrollbar {
            display: none;
        }
        .suggestions-scroll {
            display: flex;
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: #070d1e #f1f1f1;
            padding-bottom: 4px;
        }
        .suggestions-scroll::-webkit-scrollbar {
            height: 6px;
        }
        .suggestions-scroll::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        .suggestions-scroll::-webkit-scrollbar-thumb {
            background: #070d1e;
            border-radius: 10px;
        }
        .suggestions-scroll::-webkit-scrollbar-thumb:hover {
            background: #0a142e;
        }
        .chat-footer {
            font-size: 0.7rem;
            line-height: 1.2;
            padding: 8px 16px;
            text-align: center;
        }
        .chat-footer a {
            color: white;
            text-decoration: underline;
        }
        .chat-footer a:hover {
            opacity: 0.9;
        }
        .input-container {
            border-top: 1px solid #e5e7eb;
            background: white;
        }
        .messages-container {
            flex: 1;
            overflow-y: auto;
            min-height: 0;
        }
        .message-content {
            padding: 8px 12px;
        }
        .message-content p {
            overflow-wrap: break-word;
            word-wrap: break-word;
            hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
            word-break: break-word;
        }
        .message-content code {
            white-space: pre-wrap;
            word-break: break-all;
        }
        .message-content a {
            word-break: break-all;
        }
      </style>

      <!-- Widget HTML -->
      <div id="chatToggleContainer" class="fixed bottom-6 right-6 z-50">
        <button id="chatToggle" class="chat-toggle bg-[#070d1e] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#0a142e]">
          <i class="fas fa-comment-dots text-xl"></i>
        </button>
      </div>

      <div id="chatContainer" class="chat-container fixed bottom-6 right-6 w-96 max-w-full bg-white rounded-xl overflow-hidden z-40 border border-gray-200">
        <!-- Chat Header -->
        <div class="bg-[#070d1e] text-white px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <a href="https://auraai.uk/" target="_blank" class="block">
              <div class="w-9 h-9 rounded-full bg-[#0a142e] flex items-center justify-center transition-transform hover:scale-110">
                <img src="https://auraai.uk/Images/logo-no-bg.png" alt="Aura AI Logo" class="w-7 h-7"/>
              </div>
            </a>
            <h3 class="font-medium">Aura AI Assistant</h3>
          </div>
          <div class="flex items-center space-x-2">
            <button id="voiceToggle" class="w-8 h-8 rounded-full bg-[#0a142e] hover:bg-[#0e1b3d] flex items-center justify-center transition-all hover:scale-110">
              <i class="fas fa-microphone"></i>
            </button>
            <button id="closeChat" class="w-8 h-8 rounded-full bg-[#0a142e] hover:bg-[#0e1b3d] flex items-center justify-center transition-all hover:scale-110">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages Area -->
        <div id="chatMessages" class="messages-container p-4 space-y-4">
          <div class="message ai-message">
            <div class="flex items-start">
              <div class="w-6 h-6 rounded-full bg-[#070d1e] flex items-center justify-center mt-1 flex-shrink-0">
                <img src="https://auraai.uk/Images/logo-no-bg.png" alt="Aura AI Logo" class="w-4 h-4"/>
              </div>
              <div class="bg-gray-100 rounded-xl ml-2 max-w-[85%]">
                <div class="message-content">
                  <p>Hello! I'm your AI assistant. How can I help you today?</p>
                  <p class="text-xs text-gray-500 mt-1">Just now</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Suggestions -->
        <div class="px-4 pb-2">
          <div class="suggestions-scroll">
            <button class="suggestion-chip bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap mr-2">What can you do?</button>
            <button class="suggestion-chip bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap mr-2">What services do you offer?</button>
            <button class="suggestion-chip bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap mr-2">What are your business hours?</button>
            <button class="suggestion-chip bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap mr-2">Where are you located?</button>
            <button class="suggestion-chip bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full transition-colors whitespace-nowrap">How can I contact you?</button>
          </div>
        </div>

        <!-- Message Input Area -->
        <div class="input-container p-4">
          <div class="relative">
            <textarea id="messageInput" rows="1" class="w-full border border-gray-300 rounded-xl px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#070d1e] focus:border-transparent" placeholder="Type your message..."></textarea>
            <button id="sendMessage" class="absolute right-2 bottom-2 w-8 h-8 rounded-full bg-[#070d1e] text-white flex items-center justify-center hover:bg-[#0a142e] transition-all hover:scale-110">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-[#070d1e] text-white chat-footer">
          <p>By chatting, you agree to this <a href="https://auraai.uk/frontend/disclaimer.html" id="disclaimerLink" target="_blank">disclaimer</a>.</p>
          <p>Powered by <a href="https://auraai.uk/" target="_blank">Aura</a></p>
        </div>
      </div>

      <!-- JavaScript -->
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          // DOM Elements
          const chatToggle = document.getElementById('chatToggle');
          const chatToggleContainer = document.getElementById('chatToggleContainer');
          const chatContainer = document.getElementById('chatContainer');
          const closeChat = document.getElementById('closeChat');
          const messageInput = document.getElementById('messageInput');
          const sendMessage = document.getElementById('sendMessage');
          const chatMessages = document.getElementById('chatMessages');
          const quickSuggestions = document.querySelector('.suggestions-scroll');
          const voiceToggle = document.getElementById('voiceToggle');
          const disclaimerLink = document.getElementById('disclaimerLink');
          
          // State
          let isChatOpen = false;
          let isListening = false;
          let recognition = null;
          let conversationHistory = [];
          
          // API configuration
          const API_URL = 'https://384f8lmpn2.execute-api.eu-north-1.amazonaws.com/chatbot';
          const ACCOUNT_ID = 'AUR000';
          
          // Initialize Web Speech API if available
          if ('webkitSpeechRecognition' in window) {
              recognition = new webkitSpeechRecognition();
              recognition.continuous = false;
              recognition.interimResults = false;
              
              recognition.onresult = function(event) {
                  const transcript = event.results[0][0].transcript;
                  messageInput.value = transcript;
                  isListening = false;
                  voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
                  voiceToggle.classList.remove('bg-red-500');
                  voiceToggle.classList.add('bg-[#0a142e]');
              };
              
              recognition.onerror = function(event) {
                  console.error('Speech recognition error', event.error);
                  isListening = false;
                  voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
                  voiceToggle.classList.remove('bg-red-500');
                  voiceToggle.classList.add('bg-[#0a142e]');
              };
          } else {
              voiceToggle.style.display = 'none';
          }
          
          // Toggle chat visibility
          chatToggle.addEventListener('click', function() {
              isChatOpen = !isChatOpen;
              if (isChatOpen) {
                  chatContainer.classList.add('visible');
                  chatToggleContainer.style.display = 'none';
                  messageInput.focus();
              } else {
                  chatContainer.classList.remove('visible');
                  setTimeout(() => {
                      chatToggleContainer.style.display = 'block';
                  }, 300);
              }
          });
          
          // Close chat
          closeChat.addEventListener('click', function() {
              isChatOpen = false;
              chatContainer.classList.remove('visible');
              setTimeout(() => {
                  chatToggleContainer.style.display = 'block';
              }, 300);
          });
          
          // Auto-resize textarea
          messageInput.addEventListener('input', function() {
              this.style.height = 'auto';
              const newHeight = Math.min(this.scrollHeight, 80);
              this.style.height = newHeight + 'px';
          });
          
          // Send message on Enter key (but allow Shift+Enter for new lines)
          messageInput.addEventListener('keydown', function(e) {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendUserMessage();
              }
          });
          
          // Send message on button click
          sendMessage.addEventListener('click', sendUserMessage);
          
          // Quick suggestion buttons
          quickSuggestions.addEventListener('click', function(e) {
              if (e.target.classList.contains('suggestion-chip')) {
                  const message = e.target.textContent.trim();
                  addMessage(message, 'user');
                  conversationHistory.push({role: 'user', content: message});
                  showTypingIndicator();
                  fetchAIResponse(message);
              }
          });
          
          // Voice toggle
          voiceToggle.addEventListener('click', function() {
              if (!recognition) return;
              
              if (!isListening) {
                  recognition.start();
                  isListening = true;
                  voiceToggle.innerHTML = '<i class="fas fa-stop"></i>';
                  voiceToggle.classList.remove('bg-[#0a142e]');
                  voiceToggle.classList.add('bg-red-500');
              } else {
                  recognition.stop();
                  isListening = false;
                  voiceToggle.innerHTML = '<i class="fas fa-microphone"></i>';
                  voiceToggle.classList.remove('bg-red-500');
                  voiceToggle.classList.add('bg-[#0a142e]');
              }
          });
          
          // Disclaimer link
          disclaimerLink.addEventListener('click', function(e) {
              // Allow default link behavior
          });
          
          // Function to send user message
          function sendUserMessage() {
              const message = messageInput.value.trim();
              if (!message) return;
              
              addMessage(message, 'user');
              messageInput.value = '';
              messageInput.style.height = 'auto';
              
              conversationHistory.push({role: 'user', content: message});
              showTypingIndicator();
              fetchAIResponse(message);
          }
          
          // Function to fetch AI response from API
          async function fetchAIResponse(message) {
              const payload = {
                  userMessage: message,
                  messageHistory: conversationHistory
              };
              
              try {
                  const response = await fetch(API_URL, {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json',
                          'Accept': 'application/json',
                          'x-account-id': ACCOUNT_ID
                      },
                      mode: 'cors',
                      body: JSON.stringify(payload)
                  });
                  
                  if (!response.ok) {
                      throw new Error(\`API error: \${response.status}\`);
                  }
                  
                  const data = await response.json();
                  removeTypingIndicator();
                  
                  let aiResponse = '';
                  if (data.body) {
                      try {
                          const bodyData = typeof data.body === 'string' ? JSON.parse(data.body) : data.body;
                          aiResponse = bodyData.message || bodyData.response || bodyData.content || JSON.stringify(bodyData);
                      } catch {
                          aiResponse = typeof data.body === 'string' ? data.body : JSON.stringify(data.body);
                      }
                  } else {
                      aiResponse = data.message || data.response || data.content || JSON.stringify(data);
                  }
                  
                  conversationHistory.push({role: 'assistant', content: aiResponse});
                  addMessage(aiResponse, 'ai');
                  scrollToBottom();
              } catch (error) {
                  console.error('Error fetching AI response:', error);
                  removeTypingIndicator();
                  addMessage("I'm sorry, there was an error connecting to the service. Please try again later.", 'ai');
                  scrollToBottom();
              }
          }
          
          // Function to add message to chat
          function addMessage(text, sender) {
              const now = new Date();
              const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const messageDiv = document.createElement('div');
              messageDiv.className = \`message \${sender}-message\`;
          
              const messageBg = sender === 'user' ? 'bg-[#070d1e] text-white' : 'bg-gray-100';
              const content = sender === 'ai' ? processMarkdown(text) : text;
          
              if (sender === 'user') {
                  messageDiv.innerHTML = \`
                      <div class="flex items-start justify-end">
                          <div class="\${messageBg} rounded-xl mr-2 max-w-[85%]">
                              <div class="message-content">
                                  <p>\${content}</p>
                                  <p class="text-xs text-gray-300 mt-1">\${timeString}</p>
                              </div>
                          </div>
                          <div class="w-6 h-6 rounded-full bg-[#e6e9f0] flex items-center justify-center mt-1 flex-shrink-0">
                              <i class="fas fa-user text-[#070d1e] text-xs"></i>
                          </div>
                      </div>
                  \`;
              } else {
                  messageDiv.innerHTML = \`
                      <div class="flex items-start">
                          <div class="w-6 h-6 rounded-full bg-[#070d1e] flex items-center justify-center mt-1 flex-shrink-0">
                              <img src="https://auraai.uk/Images/logo-no-bg.png" alt="Aura AI Logo" class="w-4 h-4">
                          </div>
                          <div class="\${messageBg} rounded-xl ml-2 max-w-[85%]">
                              <div class="message-content">
                                  <p>\${content}</p>
                                  <p class="text-xs text-gray-500 mt-1">\${timeString}</p>
                              </div>
                          </div>
                      </div>
                  \`;
              }
              chatMessages.appendChild(messageDiv);
              scrollToBottom();
          }
          
          // Function to show typing indicator
          function showTypingIndicator() {
              const typingDiv = document.createElement('div');
              typingDiv.className = 'message ai-message';
              typingDiv.innerHTML = \`
                  <div class="flex items-start space-x-2">
                      <div class="w-6 h-6 rounded-full bg-[#070d1e] flex items-center justify-center mt-1 flex-shrink-0">
                          <img src="https://auraai.uk/Images/logo-no-bg.png" alt="Aura AI Logo" class="w-4 h-4">
                      </div>
                      <div class="bg-gray-100 rounded-xl">
                          <div class="message-content">
                              <div class="typing-indicator">
                                  <span>•</span>
                                  <span>•</span>
                                  <span>•</span>
                              </div>
                          </div>
                      </div>
                  </div>
              \`;
              chatMessages.appendChild(typingDiv);
              scrollToBottom();
          }
          
          // Function to remove typing indicator
          function removeTypingIndicator() {
              const typingIndicators = document.querySelectorAll('.typing-indicator');
              typingIndicators.forEach(indicator => {
                  indicator.closest('.message').remove();
              });
          }
          
          // Function to process markdown in responses
          function processMarkdown(text) {
              text = text.replace(/\\\`([^\\\`]+)\\\`/g, '<code class="markdown-code">$1</code>');
              text = text.replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, '<a href="$2" class="markdown-link" target="_blank">$1</a>');
              return text;
          }
          
          // Function to scroll chat to bottom
          function scrollToBottom() {
              chatMessages.scrollTop = chatMessages.scrollHeight;
          }
        });
      </script>
    </div>
  `;
  
  // 4. Add to page
  document.body.appendChild(widget);
})();
