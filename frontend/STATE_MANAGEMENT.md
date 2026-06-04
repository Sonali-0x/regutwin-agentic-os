# STATE_MANAGEMENT.md

# ReguTwin Agentic OS State Management Guide

## Purpose

This document defines the state management architecture for the ReguTwin frontend.

The goal is to create a predictable, scalable, and maintainable system that supports:

* Real-time updates
* Compliance dashboards
* Regulatory workflows
* Notifications
* Authentication
* Large datasets

This document should be followed before implementing any store, hook, or API integration.

---

# State Management Philosophy

Not all data should be stored in the same place.

Different types of data require different storage mechanisms.

ReguTwin uses four state categories:

```txt
Global State

Server State

Realtime State

Persistent State
```

Each category has its own responsibility.

---

# Architecture Overview

```txt
Backend APIs
      │
      ▼
React Query
      │
      ▼
Components
      │
      ▼
Zustand Stores
      │
      ▼
Local Storage
```

Realtime events update React Query caches.

React Query updates UI automatically.

---

# Source of Truth

Always follow this rule:

```txt
Backend Database
        ↓
Backend API
        ↓
React Query
        ↓
Frontend UI
```

Never treat Zustand as the source of truth for server data.

The backend is always authoritative.

---

# State Categories

## Global State

Global State contains application-wide information.

Examples:

```txt
Authenticated User

Theme

Sidebar State

Notifications Count

Current Organization

User Permissions
```

Tool:

```txt
Zustand
```

Location:

```txt
src/store
```

---

## Server State

Server State is data fetched from APIs.

Examples:

```txt
Regulations

MAPs

Validation Results

Conflicts

Audit Logs

Reports
```

Tool:

```txt
React Query
```

Location:

```txt
src/hooks
```

Never store these inside Zustand.

---

## Realtime State

Realtime State arrives from Socket.IO.

Examples:

```txt
New Regulation

Validation Started

Validation Failed

Conflict Detected

MAP Created
```

Tool:

```txt
Socket.IO
```

These updates should immediately refresh React Query caches.

---

## Persistent State

Data that survives browser refreshes.

Examples:

```txt
JWT Token

Theme

Sidebar Preferences

Last Selected Filters
```

Storage:

```txt
Local Storage
```

---

# Zustand Architecture

Zustand should be used only for frontend application state.

Folder:

```txt
src/store
```

Structure:

```txt
store/
│
├── authStore.ts
├── uiStore.ts
├── notificationStore.ts
├── userStore.ts
└── permissionStore.ts
```

---

# authStore

Purpose:

Manage authentication state.

Contains:

```ts
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

Responsibilities:

* Store logged-in user
* Store JWT token
* Handle logout
* Restore session

Should NOT contain:

```txt
Regulations

MAPs

Audit Logs
```

---

# uiStore

Purpose:

Manage UI state.

Contains:

```ts
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
}
```

Responsibilities:

```txt
Theme

Sidebar

Modal State

Drawer State
```

---

# notificationStore

Purpose:

Manage notification UI state.

Contains:

```ts
Unread Count

Open Notifications

Notification Filters
```

Notifications themselves should come from backend APIs.

Only UI behavior belongs here.

---

# permissionStore

Purpose:

Store role and permission information.

Example:

```ts
{
  role: "Compliance Officer",
  permissions: []
}
```

Used by:

```txt
Protected Routes

Conditional Rendering

Navigation
```

---

# React Query Architecture

React Query manages all backend data.

Folder:

```txt
src/hooks
```

Example:

```txt
hooks/
│
├── useRegulations.ts
├── useMaps.ts
├── useConflicts.ts
├── useValidation.ts
├── useAudit.ts
└── useNotifications.ts
```

Each hook should:

```txt
Fetch Data

Cache Data

Refetch Data

Handle Loading

Handle Errors
```

---

# Query Key Strategy

Query keys must be predictable.

Examples:

```ts
["regulations"]

["regulation", regulationId]

["maps"]

["map", mapId]

["conflicts"]

["validation"]

["auditLogs"]
```

Bad Example:

```ts
["data"]
```

Always use descriptive keys.

---

# Regulation State Flow

Example:

```txt
User Opens Regulations Page
          │
          ▼
useRegulations()
          │
          ▼
React Query
          │
          ▼
GET /api/regulations
          │
          ▼
Backend
          │
          ▼
Cache Result
          │
          ▼
Render UI
```

---

# MAP State Flow

Example:

```txt
User Opens MAP Page
         │
         ▼
useMaps()
         │
         ▼
GET /api/maps
         │
         ▼
React Query Cache
         │
         ▼
UI
```

---

# Mutation Architecture

Mutations change backend data.

Examples:

```txt
Create MAP

Update MAP

Resolve Conflict

Retry Validation

Update Profile
```

Use:

```ts
useMutation()
```

Flow:

```txt
User Action
      │
      ▼
Mutation
      │
      ▼
Backend Update
      │
      ▼
Invalidate Query
      │
      ▼
Refetch
      │
      ▼
UI Update
```

---

# Socket.IO Integration

Realtime updates should never directly modify components.

Correct Flow:

```txt
Socket Event
      │
      ▼
React Query Cache Update
      │
      ▼
Automatic UI Refresh
```

Example:

```txt
new-regulation
```

Action:

```ts
queryClient.invalidateQueries({
  queryKey: ["regulations"]
});
```

---

# Notification Flow

When a new notification arrives:

```txt
Socket Event

↓

Notification Store Update

↓

React Query Refresh

↓

UI Notification Badge Updates
```

---

# Authentication Persistence

When user logs in:

```txt
Receive JWT

↓

Store Token

↓

Store User

↓

Restore Session On Refresh
```

Storage:

```txt
Local Storage
```

or

```txt
Secure HTTP-only Cookies
```

Preferred:

```txt
HTTP-only Cookies
```

---

# Loading State Strategy

Every page must support:

```txt
Loading

Success

Empty

Error
```

Example:

```txt
Loading Regulations...

No Regulations Found

Failed To Load Regulations
```

Never show blank pages.

---

# Cache Strategy

Recommended defaults:

```ts
staleTime: 300000
cacheTime: 600000
retry: 2
```

Meaning:

```txt
5 Minutes Fresh

10 Minutes Cached

2 Retries
```

This reduces unnecessary API traffic.

---

# State Ownership Rules

Before creating state ask:

Question 1:

Does it come from backend?

YES

→ React Query

NO

→ Continue

Question 2:

Is it application-wide?

YES

→ Zustand

NO

→ Component State

Question 3:

Should it survive refresh?

YES

→ Local Storage

NO

→ Keep in Memory

---

# Common Mistakes

Avoid:

```txt
Putting API Data In Zustand

Duplicating State

Calling Axios In Components

Storing Large Lists In Local Storage

Direct Socket Updates To UI
```

These patterns create bugs and synchronization issues.

---

# Recommended Store Structure

```txt
src/
│
├── store/
│   ├── authStore.ts
│   ├── uiStore.ts
│   ├── notificationStore.ts
│   ├── permissionStore.ts
│   └── userStore.ts
│
├── hooks/
│   ├── useRegulations.ts
│   ├── useMaps.ts
│   ├── useConflicts.ts
│   ├── useValidation.ts
│   ├── useAudit.ts
│   └── useNotifications.ts
│
├── services/
│   ├── regulationService.ts
│   ├── mapService.ts
│   ├── conflictService.ts
│   ├── validationService.ts
│   └── auditService.ts
```

---

# Final Principle

The frontend should remain lightweight.

Zustand manages application state.

React Query manages server state.

Socket.IO delivers realtime updates.

Backend APIs remain the source of truth.

Following this architecture ensures that ReguTwin remains scalable, maintainable, and capable of supporting enterprise-level compliance operations without state synchronization issues.
