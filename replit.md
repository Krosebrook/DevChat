# Overview

FlashFusion is a universal app generator platform that enables users to create applications across multiple platforms (web, mobile, desktop) through an interactive configuration wizard. The system features a React-based frontend dashboard with real-time progress tracking, a Node.js/Express backend API, and PostgreSQL database integration using Drizzle ORM. The platform guides users through a multi-step configuration process to define project scope, select platforms and frameworks, configure features, and generate applications with cost estimation and real-time WebSocket updates.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built with React 18 and TypeScript, utilizing a modern component-based architecture with the following key design decisions:

- **UI Framework**: Implements shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Uses Tailwind CSS with CSS variables for theming support and responsive design
- **State Management**: Employs Zustand for global state management with persistence, managing configuration wizard state and project data
- **Data Fetching**: Integrates TanStack Query for server state management, caching, and API synchronization
- **Routing**: Uses Wouter as a lightweight routing solution for single-page application navigation
- **Form Handling**: Implements React Hook Form with Zod validation for type-safe form management

The frontend follows a modular component structure with separation of concerns between UI components, business logic, and data management. The configuration wizard uses a step-based approach with persistent state to guide users through the app generation process.

## Backend Architecture

The server-side is built with Node.js and Express.js, following a RESTful API design with real-time capabilities:

- **Web Framework**: Express.js with TypeScript for type safety and modern JavaScript features
- **API Design**: RESTful endpoints for CRUD operations on projects, configuration steps, and generation tasks
- **Real-time Communication**: WebSocket integration using the 'ws' library for live progress updates and task notifications
- **Data Validation**: Zod schemas for request/response validation and type inference
- **Development Environment**: Vite integration for hot module replacement and optimized development experience

The backend implements a clean separation between routing, business logic, and data access layers. The WebSocket server runs alongside the HTTP server to provide real-time updates during the app generation process.

## Data Storage

The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Database**: PostgreSQL for relational data storage with ACID compliance
- **ORM**: Drizzle ORM providing type-safe queries and schema management
- **Schema Design**: Normalized relational schema with tables for users, projects, generation tasks, and configuration steps
- **Migrations**: Drizzle Kit for database schema migrations and version control
- **Connection**: Neon serverless PostgreSQL for cloud-native database hosting

The database schema supports multi-user projects with configuration tracking, generation task management, and audit trails. JSON columns store flexible configuration data while maintaining relational integrity for core entities.

## External Dependencies

- **Database Provider**: Neon serverless PostgreSQL for managed database hosting
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS for utility-first styling approach
- **Development Tools**: Vite for build tooling and development server
- **Form Validation**: Zod for runtime type validation and schema definition
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **WebSocket**: Native WebSocket API with 'ws' library for real-time communication