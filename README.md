# Tenant Template - Frontend

A modern React frontend application built with TypeScript, Vite, Tailwind CSS, and comprehensive UI components.

## 🚀 Features

- **React 19**: Latest React with hooks and functional components
- **TypeScript**: Full TypeScript support with strict type checking
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible, unstyled UI components
- **React Router**: Client-side routing
- **Redux Toolkit**: State management with RTK Query
- **React Hook Form**: Form handling with validation
- **Zod**: Schema validation
- **Framer Motion**: Animation library
- **Recharts**: Data visualization
- **Google Maps**: Maps integration
- **Quill Editor**: Rich text editing
- **Date Picker**: Date selection components
- **File Upload**: Excel file processing
- **Voice Assistant**: Vapi AI integration
- **Theme Support**: Dark/light mode with dynamic theming

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Git**

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone <your-frontend-repo-url>
cd Frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual values:

```env
# Backend API Configuration
VITE_BASE_URL=http://localhost:5000/api/v1

# Vapi AI Voice Assistant Configuration (Optional)
# Get these values from https://dashboard.vapi.ai
VITE_VAPI_CLIENT_ID=your_vapi_client_id_here
VITE_VAPI_ASSISTANT_ID=your_vapi_assistant_id_here

# Google Maps API Key (Optional)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Other API Keys as needed
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

### 4. Backend Connection

Ensure your backend server is running on the URL specified in `VITE_BASE_URL`. The default is `http://localhost:5000/api/v1`.

## 🏃‍♂️ Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Other Scripts

```bash
# Lint the code
npm run lint

# Type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
src/
├── assets/             # Static assets (images, icons)
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components (buttons, inputs, etc.)
│   ├── layout/        # Layout components (header, sidebar, etc.)
│   ├── modals/        # Modal components
│   ├── modules/       # Feature-specific components
│   └── filters/       # Filter components
├── config/            # Application configuration
├── constants/         # Application constants
├── context/           # React contexts
├── hooks/             # Custom React hooks
├── lib/              # Utility libraries and configurations
├── pages/            # Page components
│   ├── administration/
│   ├── dashboard/
│   ├── contacts/
│   ├── emails/
│   ├── settings/
│   └── ...
├── providers/        # Context providers
├── redux/           # Redux store and slices
│   └── features/    # Feature-specific slices
├── routes/          # Routing configuration
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validations/     # Form validation schemas
├── App.tsx          # Main App component
└── main.tsx         # Application entry point
```

## 🎨 UI Components

The application uses a combination of:

- **Radix UI**: Accessible, unstyled components
- **Tailwind CSS**: Utility-first styling
- **Custom Components**: Built on top of Radix UI
- **Framer Motion**: Smooth animations and transitions

### Key Components

- **Sidebar Navigation**: Collapsible sidebar with route-based navigation
- **Data Tables**: Sortable, filterable tables with pagination
- **Forms**: Validated forms with error handling
- **Modals**: Accessible modal dialogs
- **Charts**: Interactive data visualization
- **Date Pickers**: Date range selection
- **File Uploads**: Drag-and-drop file handling
- **Rich Text Editor**: Quill-based editor

## 🔧 State Management

The application uses Redux Toolkit for state management:

- **Store**: Configured in `src/redux/store.ts`
- **API Slices**: RTK Query for API calls
- **Feature Slices**: Local state management
- **Middleware**: Custom middleware for error handling

### Key Features

- **Authentication State**: User session management
- **API Caching**: Automatic caching with RTK Query
- **Error Handling**: Centralized error management
- **Loading States**: Automatic loading indicators

## 🎯 Routing

React Router is configured for client-side routing:

- **Public Routes**: Login, register, forgot password
- **Protected Routes**: Dashboard, administration, etc.
- **Role-based Access**: Permission-based route protection
- **Dynamic Routes**: Parameter-based routing

## 🔒 Authentication

The application includes comprehensive authentication:

- **JWT Token Management**: Access and refresh tokens
- **Google OAuth**: Social login integration
- **Password Reset**: Email-based password recovery
- **Role-based Access**: Permission system
- **Session Management**: Automatic token refresh

## 📱 Responsive Design

- **Mobile-first**: Designed for mobile devices
- **Breakpoint System**: Tailwind CSS breakpoints
- **Adaptive Layouts**: Components adapt to screen size
- **Touch-friendly**: Optimized for touch interactions

## 🔧 Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_BASE_URL` | Backend API base URL | Yes | `http://localhost:5000/api/v1` |
| `VITE_VAPI_CLIENT_ID` | Vapi AI client ID | No | `your_vapi_client_id` |
| `VITE_VAPI_ASSISTANT_ID` | Vapi AI assistant ID | No | `your_vapi_assistant_id` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps API key | No | `your_google_maps_key` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key | No | `pk_test_...` |

## 🔍 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Verify `VITE_BASE_URL` points to running backend
   - Check CORS configuration in backend
   - Ensure backend is accessible

2. **Build Errors**
   - Clear node_modules: `rm -rf node_modules package-lock.json && npm install`
   - Check TypeScript errors: `npx tsc --noEmit`
   - Verify all dependencies are installed

3. **Styling Issues**
   - Clear Tailwind cache: Delete `.turbo` and `dist` folders
   - Check for conflicting CSS
   - Verify Tailwind configuration

4. **Authentication Issues**
   - Check token expiration
   - Verify API endpoints
   - Check network requests in browser devtools

### Development Tips

- Use React DevTools for component debugging
- Use Redux DevTools for state debugging
- Check browser console for errors and warnings
- Use network tab to debug API calls
- Use `npm run lint` to catch code issues

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Build

```bash
# Build for production
npm run build

# Serve static files from dist/ folder
```

### Environment Variables for Production

Make sure to set all required environment variables in your deployment platform:

- `VITE_BASE_URL`: Your production backend URL
- Other API keys as configured in your `.env` file

## 📝 Development Guidelines

### Code Style

- Use TypeScript for all new code
- Follow React best practices
- Use functional components with hooks
- Implement proper error boundaries
- Write descriptive component names

### Component Development

- Keep components small and focused
- Use proper TypeScript typing
- Implement proper loading and error states
- Make components reusable when possible
- Document complex components

### Testing (Future Enhancement)

- Unit tests for utility functions
- Component tests for UI components
- Integration tests for API calls
- E2E tests for critical user flows

## 📄 License

This project is licensed under the ISC License.

## 🤝 Support

For issues and questions, please create an issue in the repository or contact the development team.