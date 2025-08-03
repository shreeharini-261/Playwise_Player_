# PlayWise - Smart Playlist Management

## Overview

PlayWise is a smart playlist management application built with React and Express, featuring advanced data structures for efficient playlist operations. The application uses a doubly linked list for playlist management, provides comprehensive analytics, and includes features like song rating, artist blocking, and play history tracking. It's designed with a modern dark music theme using Tailwind CSS and shadcn/ui components.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom music-themed dark color palette
- **State Management**: React hooks with API client for backend communication
- **Data Fetching**: Custom API client with error handling and loading states
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Flask (Python 3.11) with RESTful API design
- **Development**: Python with comprehensive data structure implementations
- **Data Structures**: Custom implementations of core CS algorithms
- **API Design**: RESTful endpoints with /api prefix convention
- **Real-time**: WebSocket support via Flask-SocketIO for live updates
- **CORS**: Flask-CORS for cross-origin resource sharing

### Data Structure Design (Python Implementation)
- **Playlist Engine**: Doubly Linked List for O(1) insertions/deletions at head/tail
- **Song Rating Tree**: Binary Search Tree for O(log n) rating-based search and organization
- **Playback History**: Stack (LIFO) for O(1) undo operations and history tracking
- **Song Lookup**: HashMap for O(1) instant song lookup by ID/title
- **Artist Blocklist**: HashSet for O(1) membership checking and filtering
- **Sorting Algorithms**: Merge Sort (stable), Quick Sort (in-place), Insertion Sort (small datasets)

### Database Architecture
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for schema migrations in `/migrations` directory
- **Development Storage**: In-memory storage implementation for rapid development

### Component Architecture
- **Layout**: Tab-based interface with distinct panels for different features
- **State Synchronization**: Snapshot pattern for consistent UI updates across components
- **Component Structure**:
  - PlaylistPanel: CRUD operations and playlist manipulation
  - AnalyticsDashboard: Data visualization with Recharts
  - RatingPanel: Song rating and search functionality
  - HistoryPanel: Play history with undo capabilities
  - BlocklistPanel: Artist filtering management

### Development Tooling
- **Type Safety**: Strict TypeScript configuration with path mapping
- **Code Quality**: ESLint and automated formatting
- **Development Server**: Vite with HMR and custom middleware integration
- **Replit Integration**: Custom plugins for development environment optimization

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit (drizzle-orm, drizzle-kit)
- **Session Storage**: PostgreSQL session store (connect-pg-simple)

### UI and Styling
- **Radix UI**: Headless component primitives (@radix-ui/react-*)
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Component variant management

### Data Visualization
- **Recharts**: React charting library for analytics dashboard
- **Embla Carousel**: Touch-friendly carousel component

### Form and State Management
- **React Hook Form**: Performance-optimized form library
- **Hookform Resolvers**: Validation schema integration
- **Zod**: TypeScript-first schema validation
- **TanStack Query**: Server state management and caching

### Development and Build Tools
- **Vite**: Fast build tool and development server
- **TSX**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **PostCSS**: CSS processing with Tailwind and Autoprefixer

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation
- **cmdk**: Command menu component