# UI_DESIGN_SYSTEM.md

# ReguTwin Agentic OS Design System

## Purpose

This document defines the visual identity and UI standards of the ReguTwin platform.

The goal is to create a consistent, professional, and enterprise-grade user experience across all modules.

Every screen, component, page, and interaction should follow these guidelines.

---

# Design Philosophy

ReguTwin is a regulatory intelligence platform.

Users interact with:

* Compliance obligations
* Risk assessments
* Regulatory conflicts
* Audit records
* Validation reports

The interface must prioritize:

```txt
Clarity

Trust

Readability

Consistency

Information Density

Professionalism
```

The design should feel similar to:

```txt
Jira

Datadog

Linear

Stripe Dashboard

GitHub Enterprise

Atlassian Products
```

Avoid flashy startup-style interfaces.

---

# Design Principles

## Principle 1

Information First

Users should understand compliance status within seconds.

Decorations should never compete with information.

---

## Principle 2

Consistency

The same status, color, card, table, and badge should look identical throughout the platform.

---

## Principle 3

Minimal Cognitive Load

Users should not need to learn how each screen works.

Navigation and interactions should feel predictable.

---

## Principle 4

Enterprise Ready

Design for:

```txt
Banks

Financial Institutions

Compliance Teams

Risk Teams

Auditors
```

Not casual consumers.

---

# Brand Identity

## Product Personality

ReguTwin should feel:

```txt
Reliable

Intelligent

Secure

Professional

Modern
```

Not:

```txt
Playful

Trendy

Experimental

Gamified
```

---

# Color System

## Primary Color

Used for:

* Primary actions
* Active navigation
* Charts

```txt
Blue 600
#2563EB
```

---

## Secondary Color

Used for:

* Supporting actions
* Highlights

```txt
Indigo 600
#4F46E5
```

---

# Status Colors

## Success

Used for:

```txt
Passed Validation

Completed MAP

Healthy Compliance
```

```txt
#16A34A
```

---

## Warning

Used for:

```txt
Pending Tasks

Upcoming Deadlines

Medium Risk
```

```txt
#F59E0B
```

---

## Danger

Used for:

```txt
Failed Validation

High Risk

Critical Conflict

Compliance Breach
```

```txt
#DC2626
```

---

## Neutral

Used for:

```txt
Inactive State

Draft State

Archived Items
```

```txt
#6B7280
```

---

# Risk Level System

## High Risk

```txt
Background:
Red

Text:
White
```

Label:

```txt
HIGH RISK
```

---

## Medium Risk

```txt
Background:
Amber

Text:
Black
```

Label:

```txt
MEDIUM RISK
```

---

## Low Risk

```txt
Background:
Green

Text:
White
```

Label:

```txt
LOW RISK
```

---

# Typography

## Font Family

Primary:

```txt
Inter
```

Fallback:

```txt
system-ui
```

Tailwind:

```txt
font-sans
```

---

# Heading Scale

## H1

Page Titles

```txt
36px
Bold
```

Example:

```txt
Compliance Dashboard
```

---

## H2

Section Titles

```txt
30px
Semibold
```

---

## H3

Card Titles

```txt
24px
Semibold
```

---

## Body Text

```txt
14px - 16px
Regular
```

---

## Caption Text

```txt
12px
```

Used for:

* Timestamps
* Metadata
* Helper text

---

# Spacing System

Use an 8px grid.

Examples:

```txt
8px
16px
24px
32px
40px
48px
64px
```

Avoid arbitrary spacing.

Bad:

```txt
13px

19px

27px
```

Good:

```txt
16px

24px

32px
```

---

# Border Radius

Small:

```txt
6px
```

Cards:

```txt
12px
```

Modals:

```txt
16px
```

Avoid excessive rounding.

---

# Layout System

Maximum Content Width:

```txt
1440px
```

Sidebar:

```txt
280px
```

Navbar:

```txt
72px Height
```

Content Padding:

```txt
24px
```

---

# Dashboard Design

Dashboard is the primary workspace.

Structure:

```txt
Header

↓

Summary Cards

↓

Charts

↓

Recent Activity

↓

Notifications
```

---

# Dashboard Cards

Standard Card Layout:

```txt
Title

Value

Trend

Optional Icon
```

Example:

```txt
Compliance Score

92%

+4%
```

---

# Card Standards

Cards should contain:

```txt
Single Responsibility

Single Metric

Single Action
```

Avoid overloaded cards.

---

# Table Design

Tables are the most important UI element.

Used for:

```txt
Regulations

MAPs

Conflicts

Audit Logs

Validation Results
```

---

# Table Rules

Every table should support:

```txt
Search

Sorting

Pagination

Filtering

Responsive Layout
```

---

# Table Columns

Recommended:

```txt
Title

Status

Risk

Owner

Created Date

Actions
```

Avoid more than:

```txt
8 Columns
```

per screen.

---

# Badge System

Create reusable badges.

Examples:

```txt
High Risk

Medium Risk

Low Risk

Pending

Completed

Failed

Passed

In Progress
```

All badges should use consistent colors.

---

# Status Indicators

Every status should have:

```txt
Color

Icon

Text
```

Example:

```txt
✓ Passed

⚠ Pending

✕ Failed
```

Never use color alone.

---

# Form Design

Use:

```txt
React Hook Form

Zod
```

Standards:

```txt
Label

Input

Helper Text

Error Message
```

Always visible.

---

# Modal Design

Modals should be used only for:

```txt
Confirmation

Delete Actions

Quick Edits

Small Forms
```

Avoid large workflows inside modals.

---

# Notification Design

Notifications should appear:

```txt
Top Right
```

Types:

```txt
Success

Warning

Error

Info
```

Duration:

```txt
5 Seconds
```

---

# Empty States

Every page requires an empty state.

Example:

```txt
No Regulations Found

No MAPs Available

No Validation Results
```

Include:

* Illustration
* Message
* Primary Action

---

# Loading States

Use skeleton loaders.

Avoid:

```txt
Spinners Everywhere
```

Preferred:

```txt
Card Skeleton

Table Skeleton

Chart Skeleton
```

---

# Chart Design

Charts should emphasize trends.

Recommended:

```txt
Line Chart

Bar Chart

Pie Chart

Area Chart
```

Avoid:

```txt
3D Charts

Animated Charts

Decorative Charts
```

---

# Sidebar Design

Sections:

```txt
Dashboard

Regulations

MAPs

Conflicts

Validation

Audit

Notifications

Settings
```

Administrator:

```txt
Admin
```

Active route should always be visually obvious.

---

# Dark Mode

Must be supported from the beginning.

Requirements:

```txt
Accessible Contrast

Readable Tables

Readable Charts

Readable Forms
```

Avoid pure black.

Recommended:

```txt
#0F172A
```

---

# Accessibility

Minimum standards:

```txt
Keyboard Navigation

Screen Reader Support

Visible Focus States

Color Contrast Compliance
```

Every interactive element should be accessible.

---

# Responsive Design

Breakpoints:

```txt
Mobile

Tablet

Laptop

Desktop

Ultra-wide
```

Priority:

```txt
Desktop First
```

Most users work on enterprise desktops.

---

# Icon System

Use:

```txt
Lucide React
```

Benefits:

```txt
Consistent

Lightweight

Professional
```

Do not mix icon libraries.

---

# Animation Rules

Use animation sparingly.

Allowed:

```txt
Hover States

Dropdowns

Modal Open

Sidebar Collapse
```

Avoid:

```txt
Complex Motion

Parallax Effects

Heavy Page Transitions
```

Information should remain the focus.

---

# Design Tokens

Centralize:

```txt
Colors

Typography

Spacing

Radius

Shadows
```

Never hardcode values across components.

---

# Success Criteria

A user should be able to:

* Find critical compliance risks immediately.
* Understand validation failures quickly.
* Track regulatory obligations easily.
* Navigate between modules effortlessly.

The interface should reduce compliance complexity rather than add to it.

---

# Final Principle

The ReguTwin UI should feel like a mission-critical operations platform.

Every visual decision should improve:

* Trust
* Clarity
* Compliance visibility
* Decision-making

If a design element does not improve those outcomes, it should not exist.
