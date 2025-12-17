# Eny Consulting Admin Dashboard - Documentation

## 📚 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features & Pages](#features--pages)
4. [Navigation Guide](#navigation-guide)
5. [Quick Links](#quick-links)

## Overview

Eny Consulting Admin Dashboard is a comprehensive administrative platform built with React, TypeScript, and Vite. It provides powerful tools for managing events, assessments, job platform operations, API keys, and administrative users.

## Architecture

### Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Radix UI + shadcn/ui components
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **Data Fetching**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **Form Management**: React Hook Form + Zod validation
- **Charts**: Recharts

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── api-keys/       # API key management components
│   ├── assessment/     # Assessment-specific components
│   ├── job-users/      # Job platform user components
│   ├── subscriptions/  # Subscription management components
│   └── ui/             # Base UI components (shadcn/ui)
├── pages/              # Route pages (34 pages)
├── lib/                # Utilities and API services
├── store/              # Redux store configuration
├── types/              # TypeScript type definitions
├── hooks/              # Custom React hooks
└── providers/          # Context providers
```

## Features & Pages

### 🌐 Core Features

#### 1. **Dashboard** ([Details](./DASHBOARD.md))

- Central hub with overview metrics
- Event statistics and quick access
- Performance charts and trends

#### 2. **Assessment Management** ([Details](./ASSESSMENTS.md))

- Create and manage assessments
- Question bank management
- Candidate tracking
- Attempt monitoring and analytics

#### 3. **Job Search Platform** ([Details](./JOB_PLATFORM.md))

- Job seeker and employer management
- Job posting administration
- Application tracking
- Subscription plans

#### 4. **API Keys Management** ([Details](./API_KEYS.md))

- Create and manage API keys
- Permission-based access control
- Usage tracking and analytics
- Rate limiting configuration

#### 5. **Admin Users** ([Details](./ADMINS.md))

- User management
- Role and permission assignment
- Account activation/deactivation

#### 6. **Events** ([Details](./EVENTS.md)) _[Currently Commented Out]_

- Event creation and management
- Location tracking
- Attendee management

## Navigation Guide

### Main Navigation Sections

1. **Dashboard** - `/dashboard`
2. **Assessments** - `/assessments`
3. **Admins** - `/admins`
4. **Settings** - `/settings`

### Hidden/Commented Routes

- Events Management (code exists but navigation commented out)
- Job Search Platform (code exists but navigation commented out)
- API Keys (code exists but navigation commented out)

## Quick Links

- [Dashboard Documentation](./DASHBOARD.md)
- [Assessments System](./ASSESSMENTS.md)
- [Job Platform Guide](./JOB_PLATFORM.md)
- [API Keys Management](./API_KEYS.md)
- [Admin Users Guide](./ADMINS.md)
- [Events Management](./EVENTS.md)
- [Components Reference](./COMPONENTS.md)
- [API Endpoints](./API_ENDPOINTS.md)

## Getting Started

1. **Installation**

   ```bash
   npm install
   ```

2. **Development**

   ```bash
   npm run dev
   ```

3. **Build**

   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

## Environment Variables

Create a `.env.production` file with:

```env
VITE_API_URL=your_api_url_here
```

## Authentication

The dashboard uses a protected route system. All routes except `/` (login) and `/set-password` require authentication.

## Support

For technical support or questions, please refer to the individual feature documentation files.
