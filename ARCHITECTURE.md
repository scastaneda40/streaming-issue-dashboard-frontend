# Streaming Issue Dashboard - Architecture Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           USER / BROWSER                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        NEXT.JS 14 APP ROUTER                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │   / (Home)     │  │  /login        │  │  /issues/new   │                │
│  │  page.tsx      │  │  page.tsx      │  │  page.tsx      │                │
│  │  Dashboard     │  │  Login Form    │  │  Create Issue  │                │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘                │
│           │                   │                    │                         │
│           │          ┌────────┴────────┐          │                         │
│           │          │  /issues/[id]   │          │                         │
│           │          │  page.tsx       │          │                         │
│           │          │  Issue Detail   │          │                         │
│           │          └────────┬────────┘          │                         │
│           └──────────┬────────┴────────┬──────────┘                         │
│                      │                 │                                     │
│              ┌───────▼─────────────────▼───────┐                            │
│              │    middleware.ts                │                            │
│              │    Auth Protection              │                            │
│              └─────────────────────────────────┘                            │
└──────────────────────────────┬──────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROVIDERS LAYER                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         providers.tsx                                  │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                │  │
│  │  │ ApolloProvider│  │ChakraProvider│  │ AuthProvider │                │  │
│  │  │               │  │              │  │              │                │  │
│  │  └──────┬───────┘  └──────────────┘  └──────┬───────┘                │  │
│  └─────────┼──────────────────────────────────────┼──────────────────────┘  │
└────────────┼──────────────────────────────────────┼─────────────────────────┘
             │                                       │
             ▼                                       ▼
┌──────────────────────────┐          ┌─────────────────────────────┐
│   APOLLO CLIENT          │          │   AUTH CONTEXT              │
│   ┌──────────────────┐   │          │   /context/AuthContext.tsx  │
│   │  InMemoryCache   │   │          │   ┌─────────────────────┐   │
│   │  Cache policies  │   │          │   │ isAuthenticated     │   │
│   └──────────────────┘   │          │   │ login()             │   │
│   ┌──────────────────┐   │          │   │ logout()            │   │
│   │  HttpLink        │   │          │   │ Cookie Storage      │   │
│   │  GraphQL Backend │   │          │   └─────────────────────┘   │
│   └──────────────────┘   │          └─────────────────────────────┘
└────────────┬─────────────┘
             │
             ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT LAYER                                      │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                         Layout.tsx                                    │   │
│  │           ┌──────────┬───────────┬──────────┐                        │   │
│  │           │  Header  │ Nav Links │  Footer  │                        │   │
│  └───────────┴──────────┴───────────┴──────────┴────────────────────────┘   │
│                                                                               │
│  ┌───────────────────┐  ┌────────────────────┐  ┌──────────────────────┐   │
│  │  IssueCard.tsx    │  │  IssueForm.tsx     │  │  IssueFilters.tsx    │   │
│  │  ┌─────────────┐  │  │  ┌──────────────┐  │  │  ┌────────────────┐  │   │
│  │  │ Issue Info  │  │  │  │ Form Fields  │  │  │  │ Platform       │  │   │
│  │  │ Platform    │  │  │  │ - Title      │  │  │  │ Status         │  │   │
│  │  │ Status      │  │  │  │ - Desc       │  │  │  │ Severity       │  │   │
│  │  │ Severity    │  │  │  │ - Platform   │  │  │  │ Assignee       │  │   │
│  │  │ Assignee    │  │  │  │ - Status     │  │  │  └────────────────┘  │   │
│  │  └─────────────┘  │  │  │ - Severity   │  │  │  Lazy Loaded        │   │
│  │  Grid Display     │  │  │ - Assignee   │  │  │  in /issues/new     │   │
│  │                   │  │  └──────────────┘  │  │                      │   │
│  └───────────────────┘  └────────────────────┘  └──────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           GRAPHQL LAYER                                      │
│                                                                               │
│  ┌──────────────────────────────┐  ┌──────────────────────────────────┐    │
│  │     /graphql/queries.ts      │  │     /graphql/mutations.ts        │    │
│  │  ┌────────────────────────┐  │  │  ┌────────────────────────────┐  │    │
│  │  │ GET_ISSUES             │  │  │  │ CREATE_ISSUE               │  │    │
│  │  │ - Filter by platform   │  │  │  │ - New issue creation       │  │    │
│  │  │ - Filter by status     │  │  │  │                            │  │    │
│  │  │ - Filter by severity   │  │  │  │ UPDATE_ISSUE               │  │    │
│  │  │ - Filter by assignee   │  │  │  │ - Edit existing issue      │  │    │
│  │  └────────────────────────┘  │  │  │                            │  │    │
│  │                               │  │  │ ADD_COMMENT                │  │    │
│  │  ┌────────────────────────┐  │  │  │ - Add comment to issue     │  │    │
│  │  │ GET_ISSUE_BY_ID        │  │  │  │                            │  │    │
│  │  │ - Fetch single issue   │  │  │  │ DELETE_ISSUE               │  │    │
│  │  │ - Include comments     │  │  │  │ - Remove issue             │  │    │
│  │  └────────────────────────┘  │  │  └────────────────────────────┘  │    │
│  └──────────────────────────────┘  └──────────────────────────────────┘    │
└───────────────────────────────────┬─────────────────────────────────────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   HTTP/HTTPS         │
                         │   GraphQL Endpoint   │
                         └──────────┬───────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BACKEND SERVICE                                      │
│                                                                               │
│        https://streaming-issue-dashboard-backend.onrender.com/               │
│                                                                               │
│                        GraphQL API Server                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Project Directory Structure

```
streaming-issue-dashboard-frontend/
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # 🏠 Dashboard (issue list + filters)
│   │   ├── layout.tsx                # 🎨 Root layout wrapper
│   │   ├── globals.css               # 🎨 Global styles + Tailwind
│   │   ├── providers.tsx             # ⚙️  Apollo + Chakra + Auth providers
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx              # 🔐 Login page
│   │   │
│   │   └── issues/
│   │       ├── [id]/
│   │       │   └── page.tsx          # 📄 Issue detail + edit + comments
│   │       └── new/
│   │           └── page.tsx          # ✏️  Create new issue (lazy loaded)
│   │
│   ├── components/                   # React Components
│   │   ├── Layout.tsx                # Main layout (header/nav/footer)
│   │   ├── IssueCard.tsx             # Issue card display (grid item)
│   │   ├── IssueForm.tsx             # Create/edit issue form
│   │   └── IssueFilters.tsx          # Filter controls
│   │
│   ├── context/
│   │   └── AuthContext.tsx           # 🔐 Authentication context
│   │
│   ├── graphql/                      # GraphQL Operations
│   │   ├── queries.ts                # GET_ISSUES, GET_ISSUE_BY_ID
│   │   └── mutations.ts              # CREATE, UPDATE, DELETE, ADD_COMMENT
│   │
│   └── middleware.ts                 # 🛡️  Route protection
│
├── public/                           # Static assets
│
├── package.json                      # Dependencies + scripts
├── tsconfig.json                     # TypeScript config
├── next.config.js                    # Next.js config
├── postcss.config.mjs                # PostCSS + Tailwind
├── eslint.config.mjs                 # ESLint config
└── netlify.toml                      # Netlify deployment config
```

## Data Flow Diagram

```
┌─────────────┐
│    USER     │
└──────┬──────┘
       │
       │ Navigates to page
       ▼
┌─────────────────────────────────────────────────────────────┐
│                     PAGE COMPONENT                          │
│  (page.tsx - Dashboard, Issue Detail, Create, etc.)        │
└──────┬──────────────────────────────────────┬──────────────┘
       │                                       │
       │ Uses Apollo hooks                     │ Uses Auth Context
       │ (useQuery, useMutation)               │ (useAuth hook)
       ▼                                       ▼
┌─────────────────────┐              ┌─────────────────────┐
│  APOLLO CLIENT      │              │  AUTH CONTEXT       │
│  ─────────────      │              │  ─────────────      │
│  • InMemoryCache    │              │  • isAuthenticated  │
│  • Query state      │              │  • login()          │
│  • Mutation state   │              │  • logout()         │
│  • Auto refetch     │              │  • Cookie storage   │
└──────┬──────────────┘              └─────────────────────┘
       │                                       │
       │ GraphQL request                       │ Auth check
       ▼                                       ▼
┌─────────────────────────────────────────────────────────────┐
│              GRAPHQL QUERIES/MUTATIONS                      │
│  ┌──────────────────┐    ┌───────────────────────────┐    │
│  │ Queries          │    │ Mutations                 │    │
│  │ • GET_ISSUES     │    │ • CREATE_ISSUE            │    │
│  │ • GET_ISSUE_BY_ID│    │ • UPDATE_ISSUE            │    │
│  │                  │    │ • ADD_COMMENT             │    │
│  │                  │    │ • DELETE_ISSUE            │    │
│  └──────────────────┘    └───────────────────────────┘    │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ HTTPS GraphQL Request
       ▼
┌─────────────────────────────────────────────────────────────┐
│       BACKEND GRAPHQL SERVER (Render.com)                   │
│       https://streaming-issue-dashboard-backend             │
│                      .onrender.com/                         │
└──────┬──────────────────────────────────────────────────────┘
       │
       │ Response
       ▼
┌─────────────────────┐
│  APOLLO CACHE       │
│  Updated with       │
│  latest data        │
└──────┬──────────────┘
       │
       │ Re-render
       ▼
┌─────────────────────────────────────────────────────────────┐
│                  COMPONENT TREE                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Layout      │  │  IssueCard   │  │  IssueForm   │     │
│  │  (Wrapper)   │  │  (Display)   │  │  (Input)     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                             │
│  Styled with: Chakra UI + Tailwind CSS + Emotion          │
└─────────────────────────────────────────────────────────────┘
```

## Component Relationship Map

```
┌───────────────────────────────────────────────────────────────────┐
│                         app/layout.tsx                            │
│                    (Root Layout + Providers)                      │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                      providers.tsx                          │ │
│  │  ApolloProvider → ChakraProvider → AuthProvider            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└────────────────────────────────┬──────────────────────────────────┘
                                 │
                   ┌─────────────┴─────────────┐
                   │                           │
                   ▼                           ▼
         ┌──────────────────┐       ┌──────────────────┐
         │  app/page.tsx    │       │  app/login/      │
         │  (Dashboard)     │       │  page.tsx        │
         │                  │       │  (Login)         │
         │ ┌──────────────┐ │       └──────────────────┘
         │ │IssueFilters  │ │
         │ └──────────────┘ │                ▼
         │ ┌──────────────┐ │       ┌──────────────────┐
         │ │IssueCard     │ │       │  app/issues/new/ │
         │ │IssueCard     │ │       │  page.tsx        │
         │ │IssueCard     │ │       │  (Create)        │
         │ │  ...         │ │       │ ┌──────────────┐ │
         │ └──────────────┘ │       │ │React.lazy(   │ │
         └──────────────────┘       │ │ IssueForm)   │ │
                   │                │ └──────────────┘ │
                   │                └──────────────────┘
                   ▼                         │
         ┌──────────────────┐               │
         │  app/issues/[id]/│◄──────────────┘
         │  page.tsx        │
         │  (Detail)        │
         │ ┌──────────────┐ │
         │ │IssueForm     │ │
         │ │(edit mode)   │ │
         │ └──────────────┘ │
         │ ┌──────────────┐ │
         │ │Comment List  │ │
         │ └──────────────┘ │
         └──────────────────┘
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND STACK                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Framework:      Next.js 14.2.5 (App Router)               │
│  UI Library:     React 18.3.1                              │
│  Language:       TypeScript                                │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 STYLING LAYER                         │ │
│  │  • Chakra UI         (Component library)              │ │
│  │  • Tailwind CSS      (Utility classes)                │ │
│  │  • Emotion           (CSS-in-JS)                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                 DATA LAYER                            │ │
│  │  • Apollo Client     (GraphQL client)                 │ │
│  │  • InMemoryCache     (Client-side caching)            │ │
│  │  • GraphQL           (API query language)             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                STATE MANAGEMENT                       │ │
│  │  • React Context     (Auth state)                     │ │
│  │  • Apollo Cache      (GraphQL data)                   │ │
│  │  • React Hooks       (Component state)                │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │                PERFORMANCE                            │ │
│  │  • React.lazy()      (Code splitting)                 │ │
│  │  • Suspense          (Async boundaries)               │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  Deployment:     Netlify                                   │
│  Backend:        GraphQL API (Render.com)                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │
     │ 1. Navigate to protected route
     ▼
┌─────────────────────┐
│  middleware.ts      │
│  Route Guard        │
└────┬────────────────┘
     │
     │ 2. Check auth cookie
     ▼
┌─────────────────────┐        ┌─────────────────────┐
│ Cookie exists?      │───NO──→│ Redirect to /login  │
└────┬────────────────┘        └─────────────────────┘
     │ YES                                │
     │                                    │
     ▼                                    ▼
┌─────────────────────┐        ┌─────────────────────┐
│ Allow access        │        │  Login Page         │
│ to protected route  │        │  Username/Password  │
└─────────────────────┘        └────┬────────────────┘
                                    │
                                    │ 3. Submit credentials
                                    ▼
                           ┌─────────────────────┐
                           │  AuthContext        │
                           │  login() function   │
                           └────┬────────────────┘
                                │
                                │ 4. Set cookie (7-day expiry)
                                ▼
                           ┌─────────────────────┐
                           │  Cookie: authToken  │
                           │  Value: true        │
                           └────┬────────────────┘
                                │
                                │ 5. Redirect to dashboard
                                ▼
                           ┌─────────────────────┐
                           │  Protected Route    │
                           │  Accessible         │
                           └─────────────────────┘
```

## Key Features & Routes

| Route | Component | Features | GraphQL Operations |
|-------|-----------|----------|-------------------|
| `/` | `app/page.tsx` | Issue list, Filters, Grid layout | `GET_ISSUES` |
| `/login` | `app/login/page.tsx` | Login form, Cookie auth | - |
| `/issues/new` | `app/issues/new/page.tsx` | Create issue, Lazy loaded form | `CREATE_ISSUE` |
| `/issues/[id]` | `app/issues/[id]/page.tsx` | View/Edit issue, Comments, Delete | `GET_ISSUE_BY_ID`, `UPDATE_ISSUE`, `ADD_COMMENT`, `DELETE_ISSUE` |

## Issue Data Model

```
Issue
├── id: string
├── title: string
├── description: string
├── platform: "Netflix" | "Disney+" | "Hulu" | "Amazon Prime" | "Other"
├── status: "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED"
├── severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
├── assignee: string
├── createdAt: Date
└── comments: Comment[]
    └── Comment
        ├── id: string
        ├── content: string
        ├── author: string
        └── createdAt: Date
```

---

**Last Updated**: Based on current codebase analysis
**Next.js Version**: 14.2.5
**React Version**: 18.3.1
