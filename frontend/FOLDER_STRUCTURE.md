# FOLDER_STRUCTURE.md

# ReguTwin Agentic OS Frontend Folder Structure

## Purpose

This document defines the official frontend folder structure for ReguTwin.

It explains:

* Folder responsibilities
* File ownership
* Architectural boundaries
* Scaling strategy

Every developer should follow this structure when creating new features.

The goal is to maintain a clean, scalable, and enterprise-ready codebase.

---

# Architecture Philosophy

The frontend is organized by responsibility.

Each folder owns a specific concern.

```txt
UI

↓

Features

↓

Pages

↓

Hooks

↓

Services

↓

Backend
```

This separation prevents business logic from leaking into UI components.

---

# Root Structure

```txt
frontend/
│
├── public/
├── src/
├── .env
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

# public/

Contains static assets.

Examples:

```txt
favicon.ico

logo.svg

robots.txt

images/
```

Rules:

✔ Static files only

✔ Accessible without authentication

✘ No React code

✘ No TypeScript files

---

# src/

Main application source code.

All frontend development happens inside this folder.

Structure:

```txt
src/
│
├── assets/
├── components/
├── pages/
├── layouts/
├── routes/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
├── constants/
├── lib/
├── contexts/
├── styles/
├── socket/
└── main.tsx
```

---

# assets/

Contains frontend assets.

Examples:

```txt
icons/

images/

illustrations/

logos/
```

Purpose:

Store imported visual resources.

Rules:

✔ Images

✔ SVGs

✔ Icons

✘ Components

✘ Business logic

---

# components/

Contains reusable UI building blocks.

Structure:

```txt
components/
│
├── ui/
└── features/
```

---

# components/ui/

Reusable application-agnostic components.

Examples:

```txt
Button

Input

Card

Modal

Badge

Table

Pagination

Tabs

Avatar

Tooltip
```

These components should work in any project.

Rules:

✔ Reusable

✔ Generic

✔ No business logic

✘ API calls

✘ React Query

✘ Zustand

---

# components/features/

Business-specific components.

Structure:

```txt
features/
│
├── dashboard/
├── regulations/
├── maps/
├── conflicts/
├── validation/
├── audit/
├── notifications/
├── settings/
└── admin/
```

These components belong specifically to ReguTwin.

---

# Dashboard Components

```txt
dashboard/
│
├── ComplianceScoreCard.tsx
├── ActiveRegulationsCard.tsx
├── PendingMapsCard.tsx
├── ConflictAlertCard.tsx
├── ValidationStatusCard.tsx
│
├── ComplianceTrendChart.tsx
├── RiskDistributionChart.tsx
└── DepartmentPerformanceChart.tsx
```

---

# Regulation Components

```txt
regulations/
│
├── RegulationTable.tsx
├── RegulationRow.tsx
├── RegulationSearch.tsx
├── RegulationFilters.tsx
├── RegulationSummary.tsx
├── RegulationObligations.tsx
└── RegulationTimeline.tsx
```

---

# MAP Components

```txt
maps/
│
├── MapTable.tsx
├── MapCard.tsx
├── MapOwner.tsx
├── MapStatusBadge.tsx
├── MapTimeline.tsx
└── EvidenceUploader.tsx
```

---

# Conflict Components

```txt
conflicts/
│
├── ConflictTable.tsx
├── ConflictCard.tsx
├── ConflictComparison.tsx
├── ConflictRecommendation.tsx
└── ConflictSeverityBadge.tsx
```

---

# Validation Components

```txt
validation/
│
├── ValidationTable.tsx
├── ValidationResultCard.tsx
├── ValidationDetails.tsx
├── ValidationRetryButton.tsx
└── ValidationStatusBadge.tsx
```

---

# Audit Components

```txt
audit/
│
├── AuditTable.tsx
├── AuditFilters.tsx
├── AuditTimeline.tsx
└── AuditExportButton.tsx
```

---

# pages/

Pages represent routes.

Each page corresponds to a URL.

Structure:

```txt
pages/
│
├── Login/
├── Dashboard/
├── Regulations/
├── Maps/
├── Conflicts/
├── Validation/
├── Audit/
├── Notifications/
├── Settings/
└── Admin/
```

---

# Example Page

```txt
pages/
└── Regulations/
    ├── RegulationsPage.tsx
    └── RegulationDetailsPage.tsx
```

Pages should:

✔ Assemble components

✔ Connect hooks

✔ Manage route parameters

Pages should NOT:

✘ Contain large UI blocks

✘ Duplicate business logic

---

# layouts/

Contains application layouts.

Structure:

```txt
layouts/
│
├── AuthLayout.tsx
├── DashboardLayout.tsx
└── AdminLayout.tsx
```

Responsibilities:

```txt
Navbar

Sidebar

Footer

Page Wrapper
```

---

# routes/

Contains route configuration.

Examples:

```txt
routes/
│
├── index.tsx
├── ProtectedRoute.tsx
├── AdminRoute.tsx
└── RoleGuard.tsx
```

Purpose:

Centralize navigation logic.

---

# hooks/

Contains reusable custom hooks.

Structure:

```txt
hooks/
│
├── useAuth.ts
├── useDashboard.ts
├── useRegulations.ts
├── useRegulationDetails.ts
├── useMaps.ts
├── useConflicts.ts
├── useValidation.ts
├── useAudit.ts
└── useNotifications.ts
```

Responsibilities:

```txt
React Query

Data Transformation

Mutations

Pagination Logic
```

Rules:

✔ Business logic

✔ Data fetching

✘ UI rendering

---

# services/

Contains API communication.

Structure:

```txt
services/
│
├── api.ts
│
├── authService.ts
├── dashboardService.ts
├── regulationService.ts
├── mapService.ts
├── conflictService.ts
├── validationService.ts
├── auditService.ts
├── notificationService.ts
└── adminService.ts
```

Responsibilities:

```txt
Axios

API Requests

API Responses
```

Rules:

✔ Backend communication

✘ UI code

---

# store/

Contains Zustand stores.

Structure:

```txt
store/
│
├── authStore.ts
├── uiStore.ts
├── permissionStore.ts
├── notificationStore.ts
└── userStore.ts
```

Used for:

```txt
Authentication

Theme

Sidebar State

Permissions

UI Preferences
```

Never store API lists here.

---

# types/

Contains TypeScript definitions.

Structure:

```txt
types/
│
├── auth.ts
├── user.ts
├── regulation.ts
├── map.ts
├── conflict.ts
├── validation.ts
├── audit.ts
└── api.ts
```

Purpose:

Centralize interfaces and types.

---

# utils/

Contains pure helper functions.

Examples:

```txt
formatDate.ts

formatCurrency.ts

riskCalculator.ts

downloadFile.ts
```

Rules:

✔ Pure functions

✘ React code

✘ API calls

---

# constants/

Application constants.

Examples:

```txt
roles.ts

routes.ts

permissions.ts

queryKeys.ts
```

Purpose:

Avoid hardcoded values.

---

# lib/

Third-party library configuration.

Examples:

```txt
axios.ts

reactQuery.ts

socket.ts

dayjs.ts
```

Purpose:

Initialize external libraries.

---

# contexts/

React Context providers.

Use sparingly.

Examples:

```txt
ThemeContext

SocketContext
```

Prefer Zustand whenever possible.

---

# styles/

Global styling.

Structure:

```txt
styles/
│
├── globals.css
├── variables.css
└── tailwind.css
```

Purpose:

Global design system implementation.

---

# socket/

Socket.IO integration.

Structure:

```txt
socket/
│
├── client.ts
├── events.ts
└── handlers.ts
```

Responsibilities:

```txt
Realtime Events

Event Listeners

Cache Updates
```

---

# App Entry Point

```txt
main.tsx
```

Responsibilities:

```txt
React Root

Router

Query Client

Providers

Theme Setup
```

---

# Scalability Rules

When adding a feature:

1. Create feature folder.
2. Create service.
3. Create hooks.
4. Create page.
5. Create types.
6. Register route.
7. Add permissions.

Every feature should follow the same structure.

---

# What NOT To Do

Avoid:

```txt
Huge Components

API Calls In Components

Business Logic In Pages

Duplicate Types

Random Utility Files

Deeply Nested Folders
```

These patterns create technical debt quickly.

---

# Final Folder Tree

```txt
src/
│
├── assets/
├── components/
│   ├── ui/
│   └── features/
│
├── pages/
├── layouts/
├── routes/
├── hooks/
├── services/
├── store/
├── types/
├── utils/
├── constants/
├── lib/
├── contexts/
├── styles/
├── socket/
│
└── main.tsx
```

This structure ensures that ReguTwin remains maintainable, scalable, and enterprise-ready as the platform expands from an MVP into a full compliance operating system.
