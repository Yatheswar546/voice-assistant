# 🤖 Full Stack AI Assistant

A production-ready AI Assistant built with **Next.js**, **React**, **TypeScript**, **MongoDB Atlas**, and **Google Gemini AI**. The application delivers intelligent, context-aware conversations with persistent chat history, secure authentication, responsive design, and a scalable full stack architecture.

---

# 🚀 Demo

> Add your deployed application link here

**Live Demo:** https://voice-assistant-six-omega.vercel.app/

---

# ✨ Features

### 🤖 AI Conversations

* Powered by Google Gemini API
* Context-aware responses
* Natural conversational experience

### 💬 Persistent Chat History

* Multiple chat sessions
* Automatic conversation saving
* Resume previous conversations anytime

### 👤 User Authentication

* Secure sign in and sign up
* User-specific chat history
* Protected routes

### 🗂 Smart Sidebar

* Dynamic conversation list
* Session grouping
* Quick navigation between chats

### 🎙 Voice Support

* Voice input support
* Smooth conversational interaction

### 📱 Responsive Design

* Optimized for desktop
* Tablet support
* Mobile-friendly interface

### ⚡ Performance

* Fast page rendering with Next.js
* Efficient API handling
* Optimized database queries

---

# 🛠 Tech Stack

## Frontend

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS

## Backend

* Next.js Route Handlers
* Node.js

## Database

* MongoDB Atlas
* Mongoose

## AI

* Google Gemini API

## Development Tools

* Git
* GitHub
* VS Code

---

# 🏗 Architecture

```text
                User
                  │
                  ▼
        Next.js Frontend (React)
                  │
                  ▼
      Next.js API Route Handlers
                  │
        ┌─────────┴─────────┐
        ▼                   ▼
 Google Gemini API     MongoDB Atlas
        │                   │
        └─────────┬─────────┘
                  ▼
          AI Response + Chat Storage
```

---

# 📂 Project Structure

```text
app/
 ├── api/
 ├── dashboard/
 ├── login/
 └── ...

components/
 ├── chat/
 ├── sidebar/
 ├── ui/
 └── ...

lib/
 ├── mongodb.ts
 └── ...

models/
 ├── User.ts
 ├── ChatSession.ts
 ├── Message.ts
 └── ...

services/

hooks/

types/
```

---

# ⚙️ Installation

## Clone the repository

```bash
git clone https://github.com/Yatheswar546/voice-assistant.git
```

## Navigate to the project

```bash
cd project-name
```

## Install dependencies

```bash
npm install
```

## Configure environment variables

Create a `.env.local` file.

```env
MONGODB_URI=your_mongodb_connection_string

GEMINI_API_KEY=your_gemini_api_key

NEXTAUTH_SECRET=your_secret
```

## Start the development server

```bash
npm run dev
```

---

# 📖 How It Works

1. User signs in.
2. A chat session is created.
3. User sends a prompt.
4. Backend forwards the request to Google Gemini.
5. Gemini generates a response.
6. Both the prompt and response are stored in MongoDB.
7. Previous conversations can be reopened anytime.

---

# 🎯 Challenges Solved

* Conversation persistence
* Session management
* Database schema design
* Context-aware AI responses
* Responsive UI implementation
* Type-safe development with TypeScript
* Backend API integration
* Error handling and validation
* Reusable component architecture

---

# 📚 What I Learned

Through this project, I strengthened my understanding of:

* Full Stack Application Development
* Generative AI Integration
* REST API Design
* MongoDB Data Modeling
* State Management
* TypeScript
* Responsive UI Development
* Production-ready Architecture
* Component-based Design
* Clean Code Practices

---

# 🚀 Future Enhancements

* AI Agent capabilities
* Tool calling
* File upload and document analysis
* Image understanding
* Voice-to-voice conversations
* Web search integration
* Streaming AI responses
* Multi-model AI support
* Dark and Light themes
* Admin dashboard
* User profile customization

---

# 👨‍💻 Author

**Yatheswar**

Full Stack Developer | AI Enthusiast

LinkedIn: https://www.linkedin.com/in/yatheswar2001/

Portfolio: https://yatheswarportfolio.vercel.app/

GitHub: https://github.com/Yatheswar546/

---

# ⭐ If you found this project interesting, consider giving it a star!
