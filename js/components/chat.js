// ─── DEXVIRA CHAT WIDGET ───
const Chat = (() => {
    let history = [];
    let userName = '';
    let userEmail = '';
  
    // DOM Elements
    const toggle   = document.getElementById('chat-toggle');
    const box      = document.getElementById('chat-box');
    const closeBtn = document.getElementById('chat-close');
    const input    = document.getElementById('chat-input');
    const sendBtn  = document.getElementById('chat-send');
    const messages = document.getElementById('chat-messages');
  
    // Add message to UI
    const addMessage = (text, type) => {
      const div = document.createElement('div');
      div.classList.add(type === 'user' ? 'user-msg' : 'bot-msg');
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    };
  
    // Typing indicator
    const showTyping = () => {
      const div = document.createElement('div');
      div.classList.add('typing-msg');
      div.id = 'typing-indicator';
      div.textContent = 'Dexvira Assistant is typing...';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    };
  
    const hideTyping = () => {
      const el = document.getElementById('typing-indicator');
      if (el) el.remove();
    };
  
    // Send message to API
    const sendMessage = async () => {
      const text = input.value.trim();
      if (!text) return;
  
      input.value = '';
      addMessage(text, 'user');
  
      // Save to history
      history.push({ role: 'user', parts: [{ text }] });
  
      showTyping();
      sendBtn.disabled = true;
  
      try {
        const res = await fetch('http://localhost:3000/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history,
            userName,
            userEmail
          })
        });
  
        const data = await res.json();
        hideTyping();
  
        if (data.success) {
          addMessage(data.reply, 'bot');
          history.push({ role: 'model', parts: [{ text: data.reply }] });
  
          // If handoff detected — ask for email
          if (data.handoff && !userEmail) {
            setTimeout(() => {
              addMessage('Please share your email so our agent can reach you.', 'bot');
            }, 800);
          }
        } else {
          addMessage('Sorry, something went wrong. Please try again.', 'bot');
        }
  
      } catch (err) {
        hideTyping();
        addMessage('Unable to connect. Please try again later.', 'bot');
      }
  
      sendBtn.disabled = false;
      input.focus();
    };
  
    // Capture email from chat
    const captureEmail = (text) => {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
      const match = text.match(emailRegex);
      if (match && !userEmail) {
        userEmail = match[0];
        addMessage(`Got it — our agent will contact you at ${userEmail} shortly.`, 'bot');
        return true;
      }
      return false;
    };
  
    // Events
    const init = () => {
      toggle.addEventListener('click', () => {
        box.classList.toggle('hidden');
        if (!box.classList.contains('hidden')) input.focus();
      });
  
      closeBtn.addEventListener('click', () => {
        box.classList.add('hidden');
      });
  
      sendBtn.addEventListener('click', () => {
        if (captureEmail(input.value.trim())) {
          input.value = '';
          return;
        }
        sendMessage();
      });
  
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          if (captureEmail(input.value.trim())) {
            input.value = '';
            return;
          }
          sendMessage();
        }
      });
    };
  
    return { init };
  })();
  
  // Initialize
  document.addEventListener('DOMContentLoaded', () => Chat.init());
  