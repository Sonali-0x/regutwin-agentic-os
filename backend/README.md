# ReguTwin Agentic OS Backend

## Overview

The ReguTwin Backend is the central orchestration layer responsible for managing regulatory workflows, compliance operations, AI-agent communication, audit trails, validation execution, and real-time dashboard updates.

The backend exposes REST APIs that are consumed by the frontend and AI services. It stores regulations, MAPs, tasks, validations, conflicts, users, and audit records.

## Core Responsibilities

* User Authentication & Authorization
* Regulation Management
* MAP Generation Management
* Task Assignment
* Validation Management
* Audit Trail Tracking
* Real-Time Dashboard APIs
* AI Service Communication
* Notification Management
* Compliance Reporting

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* JWT Authentication
* Socket.IO
* ChromaDB Integration
* OpenAI / Gemini Integration

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

```env
PORT=
MONGO_URI=
JWT_SECRET=
OPENAI_API_KEY=
GEMINI_API_KEY=
CHROMA_HOST=
FRONTEND_URL=
```

## Main Modules

* Authentication
* Regulations
* MAP Engine
* Tasks
* Validation Engine
* Audit Trail
* Dashboard
* Notifications

## Development Workflow

1. Setup Backend Infrastructure
2. Implement Authentication
3. Build Regulation APIs
4. Create MAP Engine APIs
5. Implement Task Management
6. Build Validation Engine
7. Create Audit Logging
8. Add Dashboard APIs
9. Integrate AI Services
10. Deploy Production Version
