# Streaming Issue Dashboard

## Project Overview

This project is a sophisticated issue tracking dashboard. It demonstrates proficiency in modern web development technologies, focusing on building a robust, scalable, and maintainable application. The dashboard enables an IT team to efficiently manage and triage issues across various streaming platforms.

## Key Features

- **Comprehensive Issue Listing:** Displays a clear and organized list of all reported issues.
- **Advanced Filtering & Sorting:** Users can filter issues by platform (Disney+, ESPN+, Hulu, Star+), status (Open, In Progress, Resolved, Closed), severity (Low, Medium, High, Critical), and assignee, enhancing issue discoverability and management.
- **Detailed Issue View:** Provides a dedicated page for each issue, showing its full description, status, severity, platform, assignee, creation date, last update, and a comment section.
- **Full Issue Lifecycle Management:**
  - **Creation:** Intuitive form for submitting new issues with essential details.
  - **Updates:** Ability to modify existing issue details, including title, description, platform, status, severity, and assignee.
  - **Comments:** Users can add comments to issues, facilitating communication and tracking progress.
  - **Deletion:** Secure option to remove issues from the system.
- **Basic Authentication System:** Includes a mock login/logout mechanism to protect application routes, ensuring only authorized personnel can access the dashboard.
- **Responsive User Interface:** Designed with a mobile-first approach, ensuring optimal viewing and interaction across a wide range of devices and screen sizes.

## Technology Stack

This application leverages a modern and powerful technology stack to deliver a high-performance and maintainable solution.

### Frontend

- **Framework:** Next.js (React Framework for Production)
- **UI Library:** React (for building interactive user interfaces)
- **Language:** TypeScript (for type safety and improved code quality)
- **Component Library:** Chakra UI (for accessible and customizable UI components)
- **Styling:** Tailwind CSS (for utility-first CSS styling)
- **Data Fetching:** Apollo Client (for managing GraphQL data and state)
- **Routing:** Next.js App Router

### Backend

- **Runtime:** Node.js (JavaScript runtime environment)
- **Language:** TypeScript (for type safety and improved code quality)
- **GraphQL Server:** Apollo Server (with Express.js for handling HTTP requests)
- **Data Storage:** In-memory data store (for demonstration purposes)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/streaming-issue-dashboard.git
    cd streaming-issue-dashboard
    ```

2.  **Install frontend dependencies:**

    ```bash
    npm install
    ```

3.  **Install backend dependencies:**

    ```bash
    cd server
    npm install
    cd ..
    ```

### Running the Application Locally

1.  **Start the backend GraphQL server:**
    Open a new terminal and navigate to the `server` directory:

    ```bash
    cd server
    npm run build
    npm start
    ```

    The GraphQL server will be running at `http://localhost:4000/`.

2.  **Start the Next.js frontend development server:**
    Open another terminal and navigate to the project root (`streaming-issue-dashboard`):

    ```bash
    npm run dev
    ```

    The frontend application will typically be accessible at `http://localhost:3000/` (or `http://localhost:3001/` if port 3000 is in use).

### Authentication

- **Username:** `testuser`
- **Password:** `testpass`

The application includes a basic middleware to protect routes. You will be redirected to the login page if not authenticated.

## Deployment to Vercel

This application is designed for deployment on Vercel, leveraging its capabilities for both Next.js frontend and Node.js/Apollo Serverless functions.

### Prerequisites for Vercel Deployment

- A Vercel account.
- Vercel CLI installed globally: `npm i -g vercel`.
- You are logged in to Vercel CLI: `vercel login`.

### Deploying the Frontend (Next.js Application)

1.  Navigate to the root of your project (`streaming-issue-dashboard`) in your terminal.
2.  Run the `vercel` command.
3.  Follow the interactive prompts:
    - Confirm setup and deployment.
    - Select your Vercel scope.
    - Choose to link to an existing project or create a new one.
    - Provide a project name (e.g., `streaming-issue-dashboard-frontend`).
    - Confirm the root directory (`./`).
    - Vercel will detect it as a Next.js project and proceed with the build and deployment.
4.  Upon successful deployment, Vercel will provide you with a production URL for your frontend.

### Deploying the Backend (Node.js/Apollo Server)

1.  Navigate to the `server` directory within your project: `cd server`.
2.  Run the `vercel` command.
3.  Follow the interactive prompts:
    - Confirm setup and deployment.
    - Select the same Vercel scope as your frontend.
    - Choose to link to an existing project or create a new one.
    - Provide a project name (e.g., `streaming-issue-dashboard-backend`).
    - Confirm the root directory (`./`).
    - Vercel will detect it as a Node.js project and deploy it as a serverless function.
4.  Upon successful deployment, Vercel will provide you with an API endpoint URL for your backend (e.g., `https://your-backend-project-name.vercel.app/api`).

### Connecting Frontend to Backend on Vercel

After deploying both components, you need to configure your frontend to communicate with the deployed backend.

1.  In your Next.js frontend, locate the file where you initialize your Apollo Client (typically `src/app/providers.tsx`).
2.  Update the `uri` or `link` configuration to point to the Vercel URL of your deployed backend. It is highly recommended to use environment variables for this:

    ```typescript
    // Example in src/app/providers.tsx
    import {
      ApolloClient,
      InMemoryCache,
      ApolloProvider,
      HttpLink,
    } from "@apollo/client";
    import { setContext } from "@apollo/client/link/context";
    import Cookies from "js-cookie";

    const httpLink = new HttpLink({
      uri:
        process.env.NEXT_PUBLIC_GRAPHQL_API_URL ||
        "http://localhost:4000/graphql",
    });

    // ... rest of your Apollo Client setup
    ```

3.  Set the `NEXT_PUBLIC_GRAPHQL_API_URL` environment variable in your Vercel project settings for the frontend to the URL of your deployed backend (e.g., `https://your-backend-project-name.vercel.app/api/graphql`).

## Project Structure

```
streaming-issue-dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── issues/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx         # Issue detail page
│   │   │   └── new/
│   │   │       └── page.tsx         # Create new issue page
│   │   ├── layout.tsx               # Root layout with ChakraProvider and AuthProvider
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── page.tsx                 # Dashboard (Issue list)
│   │   └── providers.tsx            # Centralized providers (Chakra, Apollo, Auth)
│   ├── components/
│   │   ├── IssueCard.tsx            # Displays issue summary
│   │   ├── IssueFilters.tsx         # Filtering options for issues
│   │   ├── IssueForm.tsx            # Reusable form for creating/editing issues
│   │   └── Layout.tsx               # Main application layout with navigation
│   ├── context/
│   │   └── AuthContext.tsx          # Authentication context
│   └── graphql/
│       ├── mutations.ts             # GraphQL mutations
│       └── queries.ts               # GraphQL queries
├── server/
│   ├── dist/                        # Compiled TypeScript output
│   ├── node_modules/
│   ├── src/
│   │   ├── index.ts                 # Apollo GraphQL server entry point
│   │   └── interfaces.ts            # TypeScript interfaces for GraphQL types
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── .env.local.example
├── .eslintrc.json
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md                      # This file
├── tailwind.config.ts
└── tsconfig.json
```

## Future Enhancements

- **Persistent Data Storage:** Transition from in-memory data storage to a robust database solution (e.g., PostgreSQL, MongoDB, or a managed GraphQL backend like Hasura or AWS AppSync) for production-grade data persistence.
- **Real-time Updates with Subscriptions:** Implement GraphQL subscriptions to provide real-time updates to the dashboard, ensuring all users see the latest issue status and comments without manual refreshes.
- **Advanced User Management:** Introduce comprehensive user authentication and authorization, including user roles (e.g., admin, developer, viewer) and fine-grained permission controls.
- **Enhanced Filtering & Sorting:** Develop more sophisticated filtering capabilities (e.g., date ranges, multiple assignees) and dynamic sorting options.
- **Notifications System:** Integrate a notification system to alert users about critical issue updates, new comments, or assignment changes.
- **Comprehensive Testing Suite:** Implement unit, integration, and end-to-end tests to ensure application reliability, stability, and maintainability.
- **CI/CD Pipeline:** Establish a Continuous Integration/Continuous Deployment pipeline for automated testing, building, and deployment to streamline development workflows.
- **Error Logging & Monitoring:** Integrate with logging and monitoring tools (e.g., Sentry, Datadog) to proactively identify and address issues in production.
