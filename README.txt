# Aura Chatbot Widget

A lightweight, customizable AI chatbot widget that can be easily embedded into any website.

## Quick Start

Add the widget to your website with just two lines of code:

```html
<script src="https://your-cdn.com/aura-chatbot-widget.min.js"></script>
<script>
  AuraChatbotWidget.init({
    accountId: 'YOUR_ACCOUNT_ID'
  });
</script>
```

## Installation Options

### CDN (Recommended)
```html
<!-- Production (minified) -->
<script src="https://your-cdn.com/aura-chatbot-widget.min.js"></script>

<!-- Development (unminified, with console logs) -->
<script src="https://your-cdn.com/aura-chatbot-widget.js"></script>
```

### Self-Hosted
1. Download `aura-chatbot-widget.min.js`
2. Host it on your server
3. Include it in your HTML

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `accountId` | string | `'AUR000'` | **Required.** Your unique account identifier |
| `apiUrl` | string | AWS Lambda URL | Custom API endpoint for chat responses |
| `primaryColor` | string | `'#070d1e'` | Primary color for the widget theme |
| `position` | string | `'bottom-right'` | Widget position: `'bottom-right'`, `'bottom-left'`, `'top-right'`, `'top-left'` |
| `greetingMessage` | string | Default greeting | Initial message shown to users |
| `branding` | object | See below | Customize logo and name |
| `suggestions` | array | Default suggestions | Quick reply buttons shown to users |
| `disclaimerUrl` | string | Aura disclaimer | URL to your disclaimer page |
| `websiteUrl` | string | Aura website | URL to your website |
| `zIndex` | number | `9999` | CSS z-index for the widget |
| `instanceId` | string | `'default'` | Unique ID for multiple widget instances |

### Branding Object
```javascript
branding: {
  logo: 'https://your-site.com/logo.png', // URL to your logo (24x24px recommended)
  name: 'Your Company Name'               // Company/bot name shown in header
}
```

## Examples

### Basic Setup
```javascript
AuraChatbotWidget.init({
  accountId: 'CLIENT123'
});
```

### Custom Styling
```javascript
AuraChatbotWidget.init({
  accountId: 'CLIENT123',
  primaryColor: '#059669',
  position: 'bottom-left',
  branding: {
    logo: 'https://example.com/logo.png',
    name: 'Support Bot'
  },
  greetingMessage: 'Hello! How can I help you today?',
  suggestions: [
    'What are your hours?',
    'How do I contact sales?',
    'Where are you located?'
  ]
});
```

### Multiple Instances
```javascript
// Sales support widget
AuraChatbotWidget.init({
  instanceId: 'sales',
  accountId: 'SALES001',
  primaryColor: '#3b82f6',
  position: 'bottom-right',
  branding: { name: 'Sales Support' }
});

// Technical support widget  
AuraChatbotWidget.init({
  instanceId: 'support',
  accountId: 'TECH001', 
  primaryColor: '#059669',
  position: 'bottom-left',
  branding: { name: 'Tech Support' }
});
```

## API Methods

### Static Methods
```javascript
// Initialize widget
const widget = AuraChatbotWidget.init(config);

// Get existing instance
const widget = AuraChatbotWidget.getInstance('instanceId');

// Destroy all widgets
AuraChatbotWidget.destroyAll();
```

### Instance Methods
```javascript
// Control widget visibility
widget.open();
widget.close();

// Send messages programmatically
widget.sendProgrammaticMessage('Hello from code!');

// Manage conversation
widget.clearHistory();
const history = widget.getHistory();

// Update configuration
widget.updateConfig({ primaryColor: '#ff0000' });

// Clean up
widget.destroy();
```

## Event System

Listen for widget events:

```javascript
const widget = AuraChatbotWidget.init(config);

// Widget opened/closed
widget.on('opened', () => console.log('Chat opened'));
widget.on('closed', () => console.log('Chat closed'));

// Messages sent/received
widget.on('message', (data) => {
  console.log('Message:', data.text);
  console.log('Sender:', data.sender);
  console.log('Time:', data.timestamp);
});
```

## Features

- 🎨 **Fully Customizable** - Colors, branding, positioning
- 📱 **Mobile Responsive** - Works on all device sizes
- 🎤 **Voice Input** - Speech recognition support (Chrome, Safari, Edge)
- ⌨️ **Markdown Support** - Rich text formatting in responses
- 💬 **Typing Indicators** - Visual feedback during responses
- 🔄 **Multiple Instances** - Run several widgets on one page
- 🌐 **Cross-Origin** - Works across different domains
- ♿ **Accessible** - Screen reader friendly
- 🚀 **Lightweight** - ~15KB minified + gzipped

## Browser Support

| Browser | Version | Notes |
|---------|---------|--------|
| Chrome | 60+ | ✅ Full support including speech recognition |
| Firefox | 55+ | ✅ Full support |
| Safari | 11+ | ✅ Full support including speech recognition |
| Edge | 79+ | ✅ Full support including speech recognition |
| IE | - | ❌ Not supported |

## Customization

### CSS Variables
The widget uses CSS custom properties that can be overridden:

```css
.aura-chatbot-widget {
  --primary-color: #your-color;
}
```

### Custom Styling
Target specific elements with CSS:

```css
/* Customize the toggle button */
.aura-chat-toggle {
  width: 64px !important;
  height: 64px !important;
}

/* Customize message bubbles */
.aura-message.ai .aura-message-content {
  background: #f0f0f0 !important;
}
```

## Security

- All API calls use CORS headers
- User input is sanitized before processing
- No sensitive data is stored in localStorage
- External links open in new tabs
- CSP-friendly implementation

## Troubleshooting

### Widget not appearing
1. Check browser console for errors
2. Verify the script URL is accessible
3. Ensure `accountId` is provided
4. Check for CSS conflicts (z-index issues)

### API not responding
1. Verify `apiUrl` is correct and accessible
2. Check network requests in browser dev tools
3. Ensure CORS headers are properly configured
4. Verify `accountId` matches your backend configuration

### Speech recognition not working
- Only available in Chrome, Safari, and Edge
- Requires HTTPS (except localhost)
- User must grant microphone permission
- Check `navigator.webkitSpeechRecognition` availability

### Multiple widgets conflicting
- Use unique `instanceId` for each widget
- Different positions recommended
- Consider different `primaryColor` for visual distinction

## Performance

- Initial load: ~15KB minified + gzipped
- Lazy-loaded dependencies
- Minimal DOM manipulation
- Efficient event handling
- Memory leak prevention

## License

MIT License - see LICENSE file for details.

## Support

- 📧 Email: support@auraai.uk
- 🌐 Website: https://auraai.uk
- 📚 Documentation: https://docs.auraai.uk
- 🐛 Issues: GitHub Issues page
