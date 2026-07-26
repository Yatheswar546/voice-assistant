# Voice Assistant — Project Summary

> Living technical overview of the repository as of 26 July 2026. Update this document when routes, data contracts, environment variables, or major workflows change.

## 1. Purpose

This is a full-stack AI voice-assistant application built with Next.js. It provides:

- A dark, responsive assistant workspace with a sidebar, assistant status, chat area, and voice input.
- User registration, login, persisted authentication, profile display, and logout.
- Gemini-backed text responses through a server-side API route.
- Browser speech recognition for spoken prompts and browser speech synthesis for assistant replies.
- Local, persistent voice preferences with a settings panel.

The active visual language is consistent across the assistant shell and authentication UI: near-black surfaces, thin slate borders, electric-blue highlights, serif text, rounded controls, and red for destructive actions.

## 2. Technology Stack

| Area | Technology | Role in this project |
| --- | --- | --- |
| Framework | Next.js `16.2.10` App Router | Routes, React Server Components, API route handlers, production build. |
| UI | React `19.2.4`, TypeScript | Component-based client interface. |
| Styling | Tailwind CSS `4`, `tw-animate-css`, `shadcn/tailwind.css` | Utility-first styling and component animation utilities. |
| UI primitives | Base UI, shadcn configuration, Lucide React | Accessible dialog/menu/button primitives and icons. |
| Forms | React Hook Form, Zod, `@hookform/resolvers` | Client form state and validation. |
| Authentication | bcryptjs, jsonwebtoken, HTTP-only cookie | Password hashing, JWT generation/verification, session transport. |
| Database | MongoDB through Mongoose | Users and schema definitions for future chats/voice settings. |
| AI | `@google/genai` | Server-side Gemini content generation. |
| Networking | Axios, Fetch | Auth client requests and chat requests. |
| Notifications | Sonner | Login, registration, and logout feedback. |

Additional installed packages include `framer-motion`, `zustand`, `clsx`, `class-variance-authority`, and `tailwind-merge`. They are available, though not all are currently used by the live feature set.

## 3. Requirements and Environment

### Runtime

- Node.js 20.9 or newer is required by this Next.js version.
- MongoDB must be reachable through the configured connection string.
- A Gemini API key is required to use chat responses.
- Speech input/output needs a browser that supports the Web Speech APIs. Speech recognition is configured for `en-IN`.

### Environment variables

Create a local `.env.local` file. Never commit real secrets.

| Variable | Used by | Required | Purpose |
| --- | --- | --- | --- |
| `MONGODB_URI` | `lib/mongodb.ts` | Yes for database-backed routes | MongoDB connection string. |
| `JWT_SECRET` | `lib/auth.ts` | Yes for auth routes | Signs and verifies 7-day JWTs. |
| `GEMINI_API_KEY` | `lib/gemini.ts` | Yes for chat | Gemini server SDK key. |
| `NEXT_PUBLIC_API_URL` | Environment file only at present | No | Reserved public API base URL; current client requests use relative `/api/...` paths. |
| `GROQ_API_KEY` | Environment file only at present | No | Reserved; no current code path uses it. |

The database and JWT modules intentionally fail early if their required environment variable is missing.

## 4. Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server. |
| `npm run build` | Produces a production build. |
| `npm run start` | Starts the production server after a build. |
| `npm run lint` | Runs ESLint using Next.js core-web-vitals and TypeScript rules. |
| `npx tsc --noEmit` | Runs TypeScript type checking without writing output. |

Open the development application at `http://localhost:3000`.

## 5. Route Map

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `app/page.tsx` | Main assistant interface. |
| `/assistant` | `app/assistant/page.tsx` | Main assistant interface after login. This route exists because the login dialog redirects here. |
| `POST /api/auth/register` | `app/api/auth/register/route.ts` | Validates and creates a user. |
| `POST /api/auth/login` | `app/api/auth/login/route.ts` | Validates credentials, returns profile data, and sets the JWT cookie. |
| `POST /api/auth/logout` | `app/api/auth/logout/route.ts` | Expires the authentication cookie. |
| `GET /api/auth/me` | `app/api/auth/me/route.ts` | Verifies the cookie and returns the current user. |
| `POST /api/chat` | `app/api/chat/route.ts` | Sends a prompt to Gemini and returns `{ reply }`. |
| `GET /api/models` | `app/api/models/route.ts` | Lists models visible to the configured Gemini API key. |
| `POST /api/test` | `app/api/test/route.ts` | Development-only helper that creates a hard-coded test user; do not expose in production. |

Both `/` and `/assistant` intentionally render the same `AppLayout`. Authentication currently changes the header experience but does not server-protect the assistant route.

## 6. High-Level Architecture

```mermaid
flowchart LR
  Browser[Browser UI] --> App[Next.js App Router]
  App --> AuthContext[AuthContext]
  App --> VoiceContext[VoiceSettingsContext]
  Browser -->|Login/Register| AuthClient[auth.client.ts]
  AuthClient --> AuthAPI[/api/auth/*]
  AuthAPI --> AuthService[auth.service.ts]
  AuthService --> Mongo[(MongoDB)]
  AuthService --> JWT[JWT + HTTP-only cookie]
  Browser -->|Message| ChatClient[chat.service.ts]
  ChatClient --> ChatAPI[/api/chat]
  ChatAPI --> Gemini[Google Gemini]
  Browser --> Speech[Web Speech APIs]
  VoiceContext --> LocalStorage[(localStorage)]
```

### Rendering composition

```text
RootLayout
├─ AuthProvider
├─ VoiceSettingsProvider
├─ Sonner Toaster
└─ Page (`/` or `/assistant`)
   └─ AppLayout
      ├─ Sidebar (desktop, lg+)
      └─ MainContent
         ├─ AssistantHeader
         ├─ SettingsPanel
         ├─ ChatWindow / MessageList
         └─ ChatInput / VoiceButton
```

## 7. Main User Workflows

### Registration

1. A visitor presses **Login** in the header and switches to **Register**.
2. `RegisterDialog` validates name, email, password, and confirm-password using `registerFormSchema`.
3. It calls `registerUser` in `AuthContext`, which calls `POST /api/auth/register` via Axios.
4. The API validates the request with `RegisterSchema`, checks for a duplicate email, hashes the password with bcrypt (10 salt rounds), and creates the MongoDB user.
5. The client shows a success notification and opens the login dialog. Registration does **not** sign the person in automatically.

### Login and session restoration

1. `LoginDialog` validates email and password with `loginFormSchema`.
2. It calls `POST /api/auth/login` with credentials enabled.
3. The server verifies the password hash, signs a JWT containing `userId` and `email`, and sets it in the `auth-token` cookie.
4. Cookie settings are: `httpOnly`, `sameSite: "lax"`, `path: "/"`, 7-day lifetime, and `secure` in production.
5. The client stores the returned user profile in `AuthContext`, closes the dialog, and navigates to `/assistant`.
6. On every new browser load, `AuthProvider` calls `GET /api/auth/me`; a valid cookie restores the profile menu and logout action.

### Logout

1. The authenticated user opens their profile menu in the header.
2. Selecting **Logout** calls `POST /api/auth/logout`.
3. The route expires `auth-token`; the context clears the current user and a confirmation toast is shown.

### AI chat

1. The user types a message or speaks into the mic button.
2. `MainContent` appends the user message locally, clears the field, and enters loading state.
3. `sendMessage` posts `{ "message": "..." }` to `POST /api/chat`.
4. The route calls Gemini with `AI_CONFIG.MODEL` (`models/gemini-flash-latest`) and returns `{ "reply": "..." }`.
5. The assistant reply is appended locally. If Auto Speak is enabled, it is read using speech synthesis.
6. Errors are shown inside the conversation as assistant-style messages; the client maps common HTTP statuses to friendly text.

### Voice interaction and preferences

1. `useSpeechRecognition` uses `SpeechRecognition` or `webkitSpeechRecognition`; its transcript becomes the chat input value.
2. `useSpeechSynthesis` loads installed browser voices and speaks replies using the selected voice, rate, pitch, volume, and Auto Speak flag.
3. The settings drawer changes values through `VoiceSettingsContext`.
4. Preferences are saved under the `voice-settings` localStorage key and synchronized between browser tabs using `storage` and a custom event.

## 8. API Contracts and Validation

### Authentication requests

| Endpoint | Request body | Success | Error cases |
| --- | --- | --- | --- |
| `POST /api/auth/register` | `{ name, email, password }` | `201`, `{ success, message, data: user }` | `400` validation; `409` duplicate email; `500` unexpected. |
| `POST /api/auth/login` | `{ email, password }` | `200`, `{ success, message, data: { id, name, email } }` plus cookie | `400` validation; `401` invalid credentials; `500` unexpected. |
| `POST /api/auth/logout` | None | `200`, cookie expired | `500` unexpected. |
| `GET /api/auth/me` | Auth cookie | `200`, `{ success, data: user }` | `401` unauthenticated/invalid token/user. |

Server registration rules (`schemas/auth.schema.ts`):

- `name`: trimmed, 2–50 characters.
- `email`: valid email, trimmed, lowercase.
- `password`: 8–100 characters.

Client registration rules (`schemas/authForm.schema.ts`) add a confirm-password requirement and use a 3–50 character name and 8–32 character password. If changing requirements, keep the client and server schemas aligned.

### Chat request

```json
POST /api/chat
{ "message": "What is the weather today?" }
```

```json
200 OK
{ "reply": "...Gemini response..." }
```

An empty message returns `400`. Provider failures return `500` with an error message.

## 9. Data Model

### Active database model

`User` is the model actively used by registration, login, and `/api/auth/me`.

| Field | Type / constraints |
| --- | --- |
| `name` | Required, trimmed string. |
| `email` | Required, unique, lowercased, trimmed string. |
| `password` | Required bcrypt hash; excluded from the `/me` query. |
| `createdAt`, `updatedAt` | Provided by Mongoose timestamps. |

### Defined for future persistence

The following Mongoose models exist but are not yet used by live API routes or the UI state:

| Model | Fields | Intended role |
| --- | --- | --- |
| `ChatSession` | `userId`, `title`, timestamps | Persisted named conversation sessions. |
| `Message` | `sessionId`, `role`, `content`, timestamps | Persisted user and assistant messages. |
| `VoiceSetting` | `userId`, `voiceURI`, `rate`, `pitch`, `volume`, `autoSpeak`, timestamps | Per-user server-side voice preferences. |

Currently, chat messages exist only in `MainContent` React state and voice preferences are only stored in browser localStorage.

## 10. UI Sections and Components

### Layout and navigation

| Component / files | Responsibility |
| --- | --- |
| `app/layout.tsx` | Root HTML document, Geist font variables, providers, dark Sonner toaster, and metadata. |
| `app/globals.css` | Shared Tailwind imports, design tokens, dark theme values, global serif body font, selection color, slider accent. |
| `components/layout/AppLayout.tsx` | Full-height assistant shell containing sidebar and main area. |
| `components/layout/MainContent.tsx` | Coordinates input, messages, request state, speech hooks, header, and settings drawer. |
| `components/sidebar/Sidebar.tsx` | Desktop-only (`lg+`) sidebar with logo, new-session button, and static demo session lists. |
| `components/sidebar/*` | Static session grouping, active-session visual state, and new-session control. The controls do not yet create or select persisted sessions. |

### Header and authentication UI

| Component / files | Responsibility |
| --- | --- |
| `components/assistant/AssistantHeader.tsx` | Assistant title, dynamic status chip, interrupt action, auth/profile control, and settings action. |
| `components/assistant/AssistantStatus.tsx` | Shows Ready, Listening, Thinking, or Speaking based on mic/request/synthesis state. |
| `components/auth/AuthButton.tsx` | Guest login button; authenticated profile dropdown; logout behavior; hosts both dialogs. |
| `components/auth/AuthDialog.tsx` | Shared modal shell used by login and registration. |
| `components/auth/LoginDialog.tsx` | Login form, password visibility control, notification feedback, and redirect to `/assistant`. |
| `components/auth/RegisterDialog.tsx` | Registration form, password confirmation/visibility controls, and transition back to login. |

### Conversation and input UI

| Component / files | Responsibility |
| --- | --- |
| `components/chat/ChatWindow.tsx` | Scrollable message region; automatically scrolls to the latest content. |
| `components/chat/MessageList.tsx` | Maps local messages to user/assistant components and shows loading state. |
| `components/chat/UserMessage.tsx` | Right-aligned user bubble. |
| `components/chat/AssistantMessage.tsx` | Assistant bubble with optional category badge. |
| `components/chat/LoadingMessage.tsx`, `TypingDots.tsx` | Assistant loading indicator. |
| `components/input/ChatInput.tsx` | Enter-to-send text input. Disabled while a request is running. |
| `components/input/VoiceButton.tsx` | Starts/stops browser recognition; disabled during AI request. |

### Voice settings

| Component / files | Responsibility |
| --- | --- |
| `components/voice/SettingsPanel.tsx` | Right-hand slide-in panel. |
| `VoiceSelector.tsx` | Browser voice selector. |
| `RateSlider.tsx`, `PitchSlider.tsx`, `VolumeSlider.tsx` | Range controls for speech synthesis. |
| `AutoSpeakToggle.tsx` | Prevents automatic speech when disabled. |
| `PreviewButton.tsx` | Plays a sample using current settings. |
| `ResetVoiceButton.tsx` | Confirmation UI then resets local settings to defaults. |

### Shared primitives and helpers

| Location | Contents |
| --- | --- |
| `components/ui/` | Project-owned Base UI wrappers: Button, Dialog, Dropdown Menu, Input, and Label. |
| `components/common/` | Logo plus visual helpers such as GlowOrb and GlassCard/Button. Some are available for future use and are not part of the current main screen. |
| `lib/utils.ts` | Tailwind class-name merger (`cn`). |

## 11. Folder Structure

```text
voice-assistant/
├─ app/
│  ├─ api/
│  │  ├─ auth/                 # Register, login, logout, current-user handlers
│  │  ├─ chat/                 # Gemini chat handler
│  │  ├─ models/               # Gemini model listing helper
│  │  └─ test/                 # Development test-user creator
│  ├─ assistant/page.tsx       # Post-login assistant route
│  ├─ globals.css              # Design tokens and global styles
│  ├─ layout.tsx               # Root layout/providers
│  └─ page.tsx                 # Root assistant route
├─ components/
│  ├─ assistant/               # Header, status, avatar, assistant bubble
│  ├─ auth/                    # Auth button and dialog forms
│  ├─ chat/                    # Message list and bubbles
│  ├─ common/                  # Reusable visual helpers/logo
│  ├─ input/                   # Text and microphone input
│  ├─ layout/                  # App shell and main coordinator
│  ├─ sidebar/                 # Session navigation presentation
│  ├─ ui/                      # Base UI wrappers
│  └─ voice/                   # Voice settings controls
├─ constants/voice.ts          # Voice defaults and storage key
├─ context/                    # Auth and voice-settings providers
├─ hooks/                      # Auth, voice settings, recognition, synthesis
├─ lib/                        # Mongo, JWT, Gemini, generic utilities
├─ models/                     # Mongoose schemas
├─ schemas/                    # Zod API and client-form validation
├─ services/                   # Client HTTP calls and server auth service
├─ settings/ai.config.ts       # Gemini model and future AI settings
├─ types/                      # Chat, API, voice, message, speech declarations
├─ utils/localStorage.ts       # Defensive localStorage helpers
├─ public/                     # Static files supplied by Next.js / project assets
├─ assests/                    # Project asset folder (name is currently misspelled)
├─ postman/                    # Postman artifacts for API development/testing
├─ AGENTS.md                   # Repository instruction for agents
├─ package.json                # Dependencies and scripts
├─ next.config.ts              # Next.js configuration (currently default)
├─ tsconfig.json               # Strict TypeScript configuration and `@/*` alias
└─ PROJECT_SUMMARY.md          # This document
```

## 12. Key Source Files by Concern

| Concern | Primary files |
| --- | --- |
| App entry and routing | `app/layout.tsx`, `app/page.tsx`, `app/assistant/page.tsx` |
| Styles and visual system | `app/globals.css`, `components/ui/*` |
| Authentication UI | `components/auth/*`, `context/AuthContext.tsx` |
| Authentication server logic | `app/api/auth/*`, `services/auth.service.ts`, `lib/auth.ts`, `models/User.ts` |
| Database connection | `lib/mongodb.ts` |
| Gemini integration | `app/api/chat/route.ts`, `lib/gemini.ts`, `settings/ai.config.ts`, `services/chat.service.ts` |
| Chat UI state | `components/layout/MainContent.tsx`, `components/chat/*`, `types/chat.ts` |
| Speech/voice settings | `hooks/useSpeechRecognition.ts`, `hooks/useSpeechSynthesis.ts`, `context/VoiceSettingsContext.tsx`, `components/voice/*` |
| Browser persistence | `constants/voice.ts`, `utils/localStorage.ts` |

## 13. Current Functional Boundaries and Next Work

These are intentional current-state limitations to keep in mind when extending the app:

- **Assistant access is not guarded server-side.** `/assistant` renders the same interface whether or not a cookie is present. Add middleware or a server-side guard if the route must be private.
- **Chat history is not persisted.** Messages and request state reset on refresh. `ChatSession` and `Message` models are ready to support persistence.
- **Sidebar sessions are mock data.** New Session and session items are presentation controls only.
- **Voice settings are local only.** `VoiceSetting` is defined but unused; use it to sync preferences across devices.
- **AI configuration is partially unused.** `AI_CONFIG.TEMPERATURE` and `MAX_OUTPUT_TOKENS` are declared but not currently passed to Gemini generation.
- **The model-list and test-user endpoints should be restricted or removed before public deployment.** In particular, `/api/test` creates a fixed user.
- **Development logs need review before release.** Database URI, user/session debug output, and login token logging should not be emitted in production logs.
- **The project’s original README is still the default Next.js README.** This document is the accurate project-specific reference.

## 14. Development Conventions

- Use the `@/*` alias for internal imports; it maps to the repository root.
- Keep API validation on the server with Zod even when the client validates the same form.
- Do not expose secret values to client components or commit `.env.local`.
- Follow the design tokens in `app/globals.css` rather than introducing a separate theme for a new screen.
- Keep auth API calls credentialed (`withCredentials: true`) when they depend on the JWT cookie.
- Mark browser-dependent components/hooks as client components (`"use client"`).
- The repository’s `AGENTS.md` requires reading relevant Next.js documentation in `node_modules/next/dist/docs/` before changing Next.js code because this project uses a newer, breaking-change-prone Next.js version.

## 15. Quick Troubleshooting

| Symptom | Likely cause | Check |
| --- | --- | --- |
| Login succeeds but a 404 appears | Missing `/assistant` page | `app/assistant/page.tsx` must exist; it now renders `AppLayout`. |
| Login or registration returns 500 | MongoDB/JWT configuration or database connectivity | Verify `MONGODB_URI`, `JWT_SECRET`, and MongoDB availability. |
| Chat returns server error | Gemini configuration/provider failure | Verify `GEMINI_API_KEY` and the configured model name. |
| Header shows Login after refresh | Auth cookie unavailable/invalid | Inspect `/api/auth/me` response and browser cookie settings. |
| Mic button does nothing | Browser lacks/blocks Web Speech recognition | Use a supported browser and grant microphone permission. |
| Assistant does not speak | Auto Speak off or browser synthesis unsupported | Enable Auto Speak in Settings and check browser voices. |
| Voice preferences reset | localStorage unavailable/cleared | Verify the `voice-settings` localStorage entry. |

---

For a new feature, begin by identifying its route, client state, server contract, model/persistence needs, and whether it must conform to the shared dark visual system. This keeps new work aligned with the current architecture.
