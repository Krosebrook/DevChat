# Overview

FlashFusion is a comprehensive universal app generator platform that enables users to create applications across multiple platforms (web, mobile, desktop) through an interactive 5-step configuration wizard. The system features a React-based frontend dashboard with real-time progress tracking, WebSocket communication, AI agent coordination, and dynamic cost estimation. Built with TypeScript, the platform uses in-memory storage for rapid prototyping and includes a complete UI component system with real-time generation monitoring.

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

The application now uses a PostgreSQL database with Neon serverless hosting for persistent data storage:

- **Database**: PostgreSQL with Neon serverless hosting for managed database infrastructure
- **Storage**: `DatabaseStorage` class implementing full CRUD operations with Drizzle ORM
- **Schema**: Type-safe schema definitions using Drizzle ORM with explicit relations between tables
- **Data Models**: Users, projects, generation tasks, and configuration steps with proper foreign key relationships
- **Persistence**: All application data persisted in PostgreSQL with configuration wizard state in browser localStorage via Zustand
- **Real-time Updates**: WebSocket synchronization for live data updates
- **Migration Support**: Database schema pushed to production using `npm run db:push`

The storage system supports project lifecycle management, configuration tracking, generation task monitoring, and maintains data integrity through PostgreSQL constraints and TypeScript interfaces. **Date Changed**: January 13, 2025

## External Dependencies

- **Database Provider**: Neon serverless PostgreSQL for managed database hosting
- **UI Components**: Radix UI primitives for accessible component foundations
- **Styling**: Tailwind CSS for utility-first styling approach
- **Development Tools**: Vite for build tooling and development server
- **Form Validation**: Zod for runtime type validation and schema definition
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation and formatting
- **WebSocket**: Native WebSocket API with 'ws' library for real-time communication