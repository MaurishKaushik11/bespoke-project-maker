# Event Management System - MERN Stack

A full-stack Event Management System built with React, Express.js, MongoDB, and TypeScript. Features multi-timezone support, profile management, and event creation with update tracking.

## Features

✅ **MERN Stack Implementation**
- React frontend with TypeScript
- Express.js backend with ES6 modules
- MongoDB database with Mongoose ODM
- Zustand for state management

✅ **Multi-Timezone Support**
- Day.js for timezone handling
- Events display in user's selected timezone
- Automatic timezone conversion

✅ **Core Functionality**
- Create and manage user profiles
- Create events for multiple profiles
- View events with timezone conversion
- Update events with change tracking

✅ **Bonus Features**
- Event update logs with timestamps
- Profile-based event filtering
- Responsive UI with Tailwind CSS

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Zustand for state management
- Tailwind CSS + shadcn/ui for styling
- React Hook Form for form handling
- Day.js for timezone management

**Backend:**
- Express.js with ES6 modules
- MongoDB with Mongoose
- CORS for cross-origin requests
- Input validation and error handling

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd event-management-system
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/event-management
   PORT=5000
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - For local MongoDB: `mongod`
   - Or use MongoDB Atlas (cloud)

### Development

**Run both frontend and backend:**
```bash
npm run dev:full
```

**Run only frontend:**
```bash
npm run dev
```

**Run only backend:**
```bash
npm run backend:dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Deployment (Vercel)

1. **Set up MongoDB Atlas** (recommended for production)

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard:**
   - `MONGODB_URI`: Your MongoDB connection string

## API Endpoints

### Profiles
- `GET /api/profiles` - Get all profiles
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/:id` - Update profile
- `DELETE /api/profiles/:id` - Delete profile

### Events
- `GET /api/events` - Get all events
- `GET /api/events/profile/:profileId` - Get events for specific profile
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/:id/logs` - Get event update logs

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── Profile.js
│   │   └── Event.js
│   ├── routes/
│   │   ├── profiles.js
│   │   └── events.js
│   ├── server.js
│   └── package.json
├── src/
│   ├── components/
│   │   ├── CreateEventForm.tsx
│   │   ├── EventsList.tsx
│   │   ├── ProfilesTab.tsx
│   │   └── ProfileSelector.tsx
│   ├── store/
│   │   └── useEventStore.ts
│   ├── lib/
│   │   └── api.js
│   └── pages/
│       └── Index.tsx
├── vercel.json
└── package.json
```

## Assignment Requirements ✅

This project meets all the MERN Stack Developer assignment requirements:

1. ✅ **Frontend**: React with TypeScript
2. ✅ **Backend**: Express.js with API routes
3. ✅ **Database**: MongoDB with Mongoose
4. ✅ **State Management**: Zustand (external library)
5. ✅ **Timezone Management**: Day.js
6. ✅ **Profile Management**: Admin can create multiple profiles
7. ✅ **Event Creation**: Events for multiple profiles with timezone selection
8. ✅ **Multi-timezone Display**: Events display according to user timezone
9. ✅ **Bonus**: Event update logs with timestamps

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a coding assignment and is available for educational purposes.
