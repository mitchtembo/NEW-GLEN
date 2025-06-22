# Glencity Resort - Resort Booking System

## Overview

A full-stack web application for Glencity Resort, providing accommodation booking and activity management capabilities. The system features a React-based frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database management.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: Zustand for booking state, TanStack Query for server state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom resort-themed color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints for accommodations, activities, and bookings
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development**: Hot reloading with Vite integration

## Key Components

### Database Schema
- **Accommodations**: Stores chalet, dorm, and camping options with pricing and amenities
- **Activities**: Manages available resort activities with categories and pricing
- **Bookings**: Handles guest reservations with guest information and check-in/out dates
- **Activity Bookings**: Links bookings to selected activities with scheduling

### Frontend Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Booking Flow**: Multi-step booking process with accommodation and activity selection
- **Guest Dashboard**: Email-based booking lookup and management
- **Real-time Updates**: Optimistic updates with TanStack Query

### Backend Services
- **Storage Layer**: Abstracted storage interface with in-memory implementation
- **Route Handlers**: Organized API endpoints for different resource types
- **Request Logging**: Comprehensive request/response logging for debugging
- **Error Handling**: Centralized error handling with proper HTTP status codes

## Data Flow

1. **User Interaction**: Users browse accommodations and activities on the homepage
2. **Booking Selection**: Accommodation selection triggers booking modal with activity options
3. **Form Submission**: Guest information and booking details submitted to backend API
4. **Database Persistence**: Booking data stored via Drizzle ORM to PostgreSQL
5. **Confirmation**: Success response triggers UI update and booking confirmation
6. **Dashboard Access**: Email-based lookup allows guests to view their bookings

## External Dependencies

### Production Dependencies
- **Database**: Neon serverless PostgreSQL for cloud deployment
- **UI Library**: Radix UI primitives for accessible components
- **Date Handling**: date-fns for date calculations and formatting
- **Validation**: Zod for runtime type validation with Drizzle integration
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Development Tools
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Fast bundling for production server builds
- **Drizzle Kit**: Database migrations and schema management
- **Replit Integration**: Custom plugins for development environment

## Deployment Strategy

### Development
- **Local Development**: Node.js 20 with hot reloading
- **Database**: PostgreSQL 16 module for local development
- **Port Configuration**: Frontend on 5000, API on same port with proxy

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles server
- **Deployment Target**: Replit autoscale for automatic scaling
- **Database**: Neon serverless PostgreSQL for production data
- **Environment**: Production mode with optimized builds

### Configuration
- **Database URL**: Environment variable for database connection
- **CORS**: Configured for cross-origin requests
- **Static Assets**: Vite handles asset optimization and caching

## Changelog

Changelog:
- June 22, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.