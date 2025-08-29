# 35mm Admin Dashboard

A modern admin dashboard for managing the 35mm film photography application. Built with Next.js, TypeScript, and shadcn/ui.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with protected routes
- 👥 **User Management** - View and manage all registered users
- 🎞️ **Film Management** - Browse and manage film inventory
- 📸 **Roll Management** - Track film roll progress and completion
- 📊 **Dashboard Overview** - Statistics and recent activity
- 🔍 **Search & Filter** - Find data quickly with search functionality
- 📱 **Responsive Design** - Works on desktop and mobile devices
- 🎨 **Modern UI** - Beautiful interface built with shadcn/ui

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Context
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## Prerequisites

- Node.js 18+
- npm or yarn
- 35mm API running on `http://localhost:3001`

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 35mm-admin
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Edit `.env.local` and update the following:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ADMIN_EMAIL=admin@35mm.com
   ADMIN_PASSWORD=admin123
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3001](http://localhost:3001)

## API Integration

This admin dashboard connects to the 35mm API and provides management interfaces for:

### Users

- View all registered users
- Search by email, username, or name
- See user registration dates and activity

### Films

- Browse film inventory
- View film specifications (brand, ISO, format)
- See film ownership and creation dates

### Rolls

- Track film roll progress
- Monitor completion status
- View roll details and associated films

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── dashboard/         # Protected dashboard pages
│   ├── login/            # Authentication page
│   └── layout.tsx        # Root layout with providers
├── components/           # Reusable components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard-layout.tsx
│   └── protected-route.tsx
├── contexts/            # React contexts
│   └── auth-context.tsx
└── lib/                 # Utilities and configurations
    ├── api.ts          # API client and types
    └── utils.ts        # Helper functions
```

## Authentication

The admin dashboard uses JWT authentication:

1. **Login Flow**: Users authenticate with email/password
2. **Token Storage**: JWT tokens are stored in localStorage
3. **Protected Routes**: All dashboard pages require authentication
4. **Auto-redirect**: Unauthenticated users are redirected to login

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Components

The project uses shadcn/ui for components. To add new components:

```bash
npx shadcn@latest add <component-name>
```

### API Integration

All API calls are centralized in `src/lib/api.ts`. The API client includes:

- Automatic token injection
- Error handling
- TypeScript types for all responses

## Security Considerations

- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- API endpoints should be protected with proper authentication
- Environment variables should be properly secured in production
- CORS should be configured on the API server

## Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

3. **Set environment variables** in your deployment platform

4. **Configure CORS** on your API server to allow requests from your admin domain

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
