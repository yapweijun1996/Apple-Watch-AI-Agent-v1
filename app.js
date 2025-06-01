// app.js - Apple Watch AI Agent Chatbox logic will go here 

const chatArea = document.getElementById('chat-area');
const inputArea = document.getElementById('input-area');
const chatInput = document.getElementById('chat-input');
const settingsBtn = document.getElementById('settings-btn');

let chatHistory = [];
let generationConfig = {};
let currentSession = null;
let modelSelectModalBg = null;
let modelSelect = null;

// Hide select inline by default
// Removed: modelSelect.style.display = 'none';

// Utility: Scroll chat to bottom
function scrollToBottom() {
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Add a message bubble to chat area
function addMessage(text, sender = 'user', isLoading = false) {
  const bubble = document.createElement('div');
  bubble.className = `bubble ${sender}`;
  if (isLoading) {
    bubble.innerHTML = '<span class="loading-dots"><span>.</span><span>.</span><span>.</span></span>';
  } else {
    bubble.textContent = text;
  }
  chatArea.appendChild(bubble);
  scrollToBottom();
  return bubble;
}

// Remove a bubble from chat area
function removeBubble(bubble) {
  if (bubble && bubble.parentNode) {
    bubble.parentNode.removeChild(bubble);
  }
}

// Start chat session for the selected model
async function startChatSession(selectedModel) {
  return {
    sendMessage: async function(messageData) {
      let userMessage = typeof messageData === "string"
        ? { role: "user", parts: [{ text: messageData }] }
        : messageData;
      const requestBody = {
        contents: [...chatHistory, userMessage],
        generationConfig
      };
      const url = "https://generativelanguage.googleapis.com/v1beta/models/" + selectedModel +
        ":generateContent?key=" + apiKey;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
      });
      if (!response.ok)
        throw new Error("API error " + response.status);
      const result = await response.json();
      if (result.candidates && result.candidates.length > 0) {
        const modelResponse = {
          role: "model",
          parts: result.candidates[0].content.parts
        };
        chatHistory.push(userMessage, modelResponse);
      } else {
        throw new Error("No response from API");
      }
      return result;
    }
  };
}

function createModelSelect() {
  const select = document.createElement('select');
  select.id = 'modelSelect';
  select.className = 'model-select';
  select.innerHTML = `
    <option value="gemini-2.0-flash">gemini-2.0-flash</option>
    <option value="gemma-3-27b-it">gemma-3-27b-it</option>
    <option value="gemini-2.5-pro-preview-03-25">gemini-2.5-pro-preview-03-25</option>
  `;
  return select;
}

function showModelSelectModal() {
  if (modelSelectModalBg) return;
  modelSelectModalBg = document.createElement('div');
  modelSelectModalBg.className = 'model-select-modal-bg';

  const modalContent = document.createElement('div');
  modalContent.className = 'model-select-modal-content';

  const title = document.createElement('div');
  title.className = 'model-select-modal-title';
  title.textContent = 'Select AI Model';

  modelSelect = createModelSelect();
  // Set current value if previously selected
  if (window.selectedModelValue) modelSelect.value = window.selectedModelValue;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'model-select-modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.setAttribute('aria-label', 'Close');

  modalContent.appendChild(closeBtn);
  modalContent.appendChild(title);
  modalContent.appendChild(modelSelect);
  modelSelectModalBg.appendChild(modalContent);
  document.body.appendChild(modelSelectModalBg);
  modelSelect.focus();

  // Close logic
  function closeModal() {
    window.selectedModelValue = modelSelect.value;
    modelSelectModalBg.remove();
    modelSelectModalBg = null;
    modelSelect = null;
  }
  closeBtn.onclick = closeModal;
  modelSelectModalBg.onclick = (e) => { if (e.target === modelSelectModalBg) closeModal(); };
  document.addEventListener('keydown', escListener);
  function escListener(e) { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', escListener); } }
}

settingsBtn.addEventListener('click', function(e) {
  e.stopPropagation();
  showModelSelectModal();
});

// Use selected model in chat logic
function getSelectedModel() {
  return window.selectedModelValue || 'gemini-2.0-flash';
}

// Handle form submit
inputArea.addEventListener('submit', async function(e) {
  e.preventDefault();
  const userText = chatInput.value.trim();
  if (!userText) return;

  // Prepare messageData
  let messageData = { role: "user", parts: [] };
  if (userText) messageData.parts.push({ text: userText });

  addMessage(userText, 'user');
  chatInput.value = '';

  // Show loading indicator
  const loadingBubble = addMessage('', 'ai', true);

  // Get selected model
  const selectedModel = getSelectedModel();
  if (!currentSession || currentSession.model !== selectedModel) {
    currentSession = await startChatSession(selectedModel);
    currentSession.model = selectedModel;
  }

  try {
    const result = await currentSession.sendMessage(messageData);
    removeBubble(loadingBubble);
    if (result.candidates && result.candidates.length > 0) {
      const parts = result.candidates[0].content.parts;
      let aiText = parts.map(p => p.text || '[Non-text response]').join('\n');
      addMessage(aiText, 'ai');
    } else {
      addMessage('[No response from AI]', 'ai');
    }
  } catch (err) {
    removeBubble(loadingBubble);
    addMessage('[Error: ' + err.message + ']', 'ai');
  }
});

// Hide model select when clicking outside
window.addEventListener('click', function(e) {
  if (modelSelect && modelSelect.style.display === 'block') {
    if (!modelSelect.contains(e.target) && e.target !== settingsBtn) {
      modelSelect.style.display = 'none';
    }
  }
});

// Hide model select on blur (optional, for keyboard users)
// Removed: modelSelect.addEventListener('blur', function() {
//   setTimeout(() => { modelSelect.style.display = 'none'; }, 150);
// }); 