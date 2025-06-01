# Checklist v1 — Apple Watch AI Agent Chatbox (HTML/CSS/JS Only)

## 1. Project Setup
- [ ] Create project folder and initialize with `index.html`, `style.css`, and `app.js`
- [ ] Organize assets (icons, fonts) if needed

## 2. Apple Watch UI Container
- [ ] Design a circular or rounded-square container to mimic Apple Watch face
- [ ] Set fixed dimensions (e.g., 340x340px) for watch face
- [ ] Center container on page, add subtle shadow

## 3. Chatbox UI
- [ ] Add a scrollable chat area inside the watch face
- [ ] Style chat bubbles for user and AI (different colors, alignment)
- [ ] Add a minimal input area (text field + send button) at the bottom
- [ ] Ensure touch-friendly sizing and spacing

## 4. Chat Logic (JavaScript)
- [ ] Handle sending user messages (add to chat area)
- [ ] Simulate AI agent responses (e.g., with setTimeout and canned replies)
- [ ] Auto-scroll chat area to latest message
- [ ] Clear input after sending

## 5. Visual & Interaction Polish
- [ ] Animate message appearance (fade/slide in)
- [ ] Add loading indicator for AI response (e.g., animated dots)
- [ ] Responsive design: ensure UI works on small screens

## 6. Accessibility & Usability
- [ ] Use semantic HTML for buttons/inputs
- [ ] Ensure keyboard navigation works
- [ ] Add ARIA labels if needed

## 7. Extensibility & Maintainability
- [ ] Modularize JS code (functions or IIFE)
- [ ] Comment code for clarity
- [ ] Plan for easy integration of real AI backend later

## 8. (Optional) Local Storage
- [ ] Save chat history in localStorage (optional for v1)

## 9. Documentation
- [ ] Add code comments and a brief README (project purpose, how to run, extension ideas)
