# COMPONENT_GUIDELINES.md

# ReguTwin Agentic OS Component Guidelines

## Purpose

This document defines the component architecture and development standards for the ReguTwin frontend.

Its purpose is to ensure:

* Consistent UI behavior
* Reusable components
* Clean code organization
* Predictable component structure
* Easy maintenance
* Scalable development

Every frontend component should follow these guidelines.

---

# Component Philosophy

Components should be:

* Reusable
* Predictable
* Focused
* Testable
* Easy to understand

Each component should have a single responsibility.

Bad Example:

```txt
DashboardComponent
```

Contains:

* API calls
* Forms
* Charts
* Tables
* Notifications
* Validation logic

Good Example:

```txt
DashboardCard

ComplianceChart

RiskDistributionChart

ValidationStatusCard
```

Each component does one thing.

---

# Component Categories

ReguTwin components are divided into four categories.

```txt
UI Components

Layout Components

Feature Components

Page Components
```

---

# UI Components

UI Components are generic and reusable.

They contain no business logic.

Folder:

```txt
src/components/ui
```

Examples:

```txt
Button

Input

Textarea

Modal

Badge

Card

Avatar

Dropdown

Table

Pagination

Tabs

Loader

Tooltip
```

These components should work in any project.

---

# UI Component Rules

UI Components:

✔ Reusable

✔ Generic

✔ Style-focused

✔ No API calls

✔ No business logic

✔ No React Query

✔ No Zustand

Example:

```tsx
<Button variant="primary">
 Save
</Button>
```

---

# Layout Components

Layout Components define page structure.

Folder:

```txt
src/layouts
```

Examples:

```txt
DashboardLayout

AdminLayout

AuthLayout
```

Responsibilities:

* Navbar
* Sidebar
* Footer
* Page Wrapper

Layouts should not fetch data.

---

# Feature Components

Feature Components contain business-specific UI.

Folder:

```txt
src/components/features
```

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
└── notifications/
```

These components are specific to ReguTwin.

---

# Page Components

Pages represent routes.

Folder:

```txt
src/pages
```

Examples:

```txt
DashboardPage

RegulationsPage

MapsPage

ConflictPage

ValidationPage
```

Pages assemble feature components.

Pages should remain thin.

---

# Recommended Folder Structure

```txt
src/
│
├── components/
│   │
│   ├── ui/
│   │
│   └── features/
│       │
│       ├── dashboard/
│       ├── regulations/
│       ├── maps/
│       ├── conflicts/
│       ├── validation/
│       ├── audit/
│       └── notifications/
│
├── layouts/
│
├── pages/
│
└── hooks/
```

---

# Component Size Rules

A component should generally stay under:

```txt
200-300 lines
```

If a component grows larger:

Extract:

* Child components
* Hooks
* Utilities

Example:

Bad:

```txt
RegulationDetails.tsx

1200 Lines
```

Good:

```txt
RegulationHeader.tsx

RegulationSummary.tsx

RegulationObligations.tsx

RegulationTimeline.tsx
```

---

# Business Logic Rules

Business logic should never live inside UI components.

Bad:

```tsx
Button

↓

API Call

↓

Validation Logic

↓

Data Transformation
```

Good:

```tsx
Hook

↓

Data Processing

↓

Component Rendering
```

Use custom hooks.

Example:

```txt
useRegulations()

useMaps()

useValidation()
```

---

# Data Fetching Rules

Never fetch data directly inside reusable UI components.

Bad:

```tsx
Button.tsx

axios.get(...)
```

Good:

```tsx
Page

↓

Custom Hook

↓

Service

↓

API

↓

Component
```

---

# Custom Hook Pattern

Every major feature should have hooks.

Folder:

```txt
src/hooks
```

Examples:

```txt
useDashboard.ts

useRegulations.ts

useRegulationDetails.ts

useMaps.ts

useValidation.ts

useConflicts.ts
```

Hooks manage:

* API requests
* Mutations
* Transformations
* Loading states

Components only render.

---

# Dashboard Components

Recommended structure:

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
└── DepartmentStatsChart.tsx
```

Each widget should be independent.

---

# Regulation Components

Structure:

```txt
regulations/
│
├── RegulationTable.tsx
├── RegulationRow.tsx
├── RegulationFilters.tsx
├── RegulationSearch.tsx
├── RegulationHeader.tsx
├── RegulationSummary.tsx
├── RegulationObligations.tsx
└── RegulationTimeline.tsx
```

---

# MAP Components

Structure:

```txt
maps/
│
├── MapTable.tsx
├── MapCard.tsx
├── MapStatusBadge.tsx
├── MapOwner.tsx
├── MapEvidenceUploader.tsx
└── MapTimeline.tsx
```

---

# Conflict Components

Structure:

```txt
conflicts/
│
├── ConflictTable.tsx
├── ConflictCard.tsx
├── ConflictComparison.tsx
├── ConflictSeverityBadge.tsx
└── ConflictRecommendation.tsx
```

---

# Validation Components

Structure:

```txt
validation/
│
├── ValidationTable.tsx
├── ValidationResultCard.tsx
├── ValidationStatusBadge.tsx
├── ValidationDetails.tsx
└── ValidationRetryButton.tsx
```

---

# Audit Components

Structure:

```txt
audit/
│
├── AuditTable.tsx
├── AuditFilters.tsx
├── AuditTimeline.tsx
└── AuditExportButton.tsx
```

---

# Table Standards

Most enterprise screens use tables.

Create a reusable table foundation.

Example:

```txt
DataTable

TableHeader

TablePagination

TableFilters

TableSearch
```

All feature tables should build on top of these.

---

# Form Standards

Use:

```txt
React Hook Form

+

Zod
```

Structure:

```txt
forms/
│
├── LoginForm.tsx
├── UserForm.tsx
├── ProfileForm.tsx
└── SettingsForm.tsx
```

Validation should never be manually duplicated.

---

# Modal Standards

Create shared modals.

Examples:

```txt
ConfirmationModal

DeleteModal

SuccessModal

ErrorModal
```

Never create one-off modal implementations.

---

# Status Components

Many ReguTwin modules use status indicators.

Create reusable badges.

Example:

```txt
StatusBadge
```

Supported statuses:

```txt
Pending

In Progress

Completed

Passed

Failed

High Risk

Medium Risk

Low Risk
```

Use the same component everywhere.

---

# Loading Components

Create reusable loading states.

Examples:

```txt
PageLoader

TableLoader

CardLoader

SkeletonLoader
```

Avoid custom loaders per page.

---

# Empty States

Every page should support empty states.

Examples:

```txt
No Regulations Found

No MAPs Assigned

No Validation Results

No Audit Records
```

Create a reusable:

```txt
EmptyState
```

component.

---

# Error States

Create shared error handling UI.

Examples:

```txt
ErrorCard

RetryButton

NetworkError
```

Never leave pages blank on failure.

---

# Chart Standards

All charts should follow the same style.

Examples:

```txt
Compliance Trend

Risk Distribution

Department Performance

Validation Statistics
```

Create wrappers:

```txt
LineChart

BarChart

PieChart
```

Feature charts should use these wrappers.

---

# Component Naming Rules

Use:

```txt
PascalCase
```

Examples:

```txt
ComplianceScoreCard.tsx

MapStatusBadge.tsx

ValidationTable.tsx
```

Avoid:

```txt
complianceCard.tsx

map_status.tsx

validationtable.tsx
```

---

# Props Guidelines

Prefer explicit props.

Good:

```ts
interface Props {
  title: string;
  status: string;
}
```

Bad:

```ts
data: any
```

Always type props properly.

---

# Reusability Checklist

Before creating a component ask:

Can it be reused?

Will another feature need it?

Can it be moved into ui/?

Can it become a shared pattern?

If yes:

Create a reusable component.

---

# Component Testing Strategy

Critical components should support testing.

Priority:

```txt
Forms

Tables

Permission Components

Protected Components

Status Components
```

Test behavior, not implementation.

---

# Component Development Workflow

Before creating a component:

1. Identify responsibility.

2. Decide category.

3. Define props.

4. Define state ownership.

5. Determine reusability.

6. Implement UI.

7. Connect hooks.

8. Add loading and error states.

9. Test behavior.

---

# Final Principle

Components should be simple building blocks.

UI components handle appearance.

Feature components handle business presentation.

Hooks handle data.

Services handle API communication.

Pages assemble everything together.

Following this structure ensures that ReguTwin remains maintainable even as the platform grows into a large-scale enterprise compliance system.
