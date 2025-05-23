(function() {
  // 1. Create container for the widget
  const widget = document.createElement('div');
  widget.id = 'aura-chatbot-container';
  
  // 2. Create Shadow DOM for style isolation
  const shadow = widget.attachShadow({ mode: 'open' });
  
  // 3. Inject your HTML/CSS/JS
  shadow.innerHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
      <style>
        /* ALL YOUR CSS FROM THE ORIGINAL FILE GOES HERE */
        @keyframes pulse { ... }
        .typing-indicator span { ... }
        /* ... (paste all other CSS rules) ... */
      </style>
    </head>
    <body>
      <!-- ALL YOUR HTML FROM THE ORIGINAL FILE GOES HERE -->
      <div id="chatToggleContainer" class="fixed bottom-6 right-6 z-50">...</div>
      <div id="chatContainer" class="chat-container fixed bottom-6 right-6 w-96 max-w-full...">
        <!-- ... (paste all other HTML) ... -->
      </div>
      
      <script>
        // ALL YOUR JAVASCRIPT FROM THE ORIGINAL FILE GOES HERE
        document.addEventListener('DOMContentLoaded', function() {
          const chatToggle = document.getElementById('chatToggle');
          // ... (paste all other JavaScript) ...
        });
      </script>
    </body>
    </html>
  `;
  
  // 4. Add to page
  document.body.appendChild(widget);
})();