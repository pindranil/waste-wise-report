# Kachra - Waste Reporting System

A complete, production-style React web application for waste/garbage reporting. Built with React 18, MUI v5, React Router v6, React-Leaflet for mapping, and MSW (Mock Service Worker) for the mock backend.

![Kachra Logo](https://img.shields.io/badge/Kachra-Waste%20Reporter-2E7D32?style=for-the-badge)

## 🚀 Features

- **User Dashboard**: Report waste with map pinning, view submitted alerts
- **Admin Dashboard**: Manage all alerts, filter by status/type, send dynamic forms
- **Interactive Maps**: Pin locations using React-Leaflet, or use geolocation
- **Real-time Chat**: Bi-directional messaging between users and admins
- **Dynamic Forms**: Admin can request additional info via customizable forms
- **Notifications**: In-app notification system
- **Authentication**: Role-based access (user/admin) with mock JWT

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Library**: Material UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Maps**: React-Leaflet
- **HTTP Client**: Axios
- **Mock API**: MSW (Mock Service Worker)
- **Date Handling**: dayjs

## 📦 Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd kachra-waste-reporter

# Install dependencies
npm install

# Start development server (MSW starts automatically)
npm run dev
```

The app will be available at `http://localhost:8080`

## 🔐 Demo Credentials

| Role  | Email           | Password |
|-------|-----------------|----------|
| User  | user@demo.com   | demo123  |
| Admin | admin@demo.com  | demo123  |

## 📱 Demo Flow

### As a User:
1. Login with `user@demo.com` / `demo123`
2. On the dashboard, click on the map to pin a location (or use "Use My Location")
3. Fill in the waste details (type, quantity, description)
4. Submit the report
5. View your alerts in the "My Alerts" tab
6. If admin sends a form request, fill it out
7. Use the chat feature to communicate with admin

### As an Admin:
1. Login with `admin@demo.com` / `demo123`
2. View all alerts in the table with stats
3. Filter alerts by status or garbage type
4. Click "View" to see alert details with map
5. Send dynamic form requests to users
6. Update alert status (pending → processing → completed)
7. Chat with users about their reports

## 📂 Project Structure

```
src/
├── api/              # Axios client and API functions
│   └── client.ts
├── components/       # Reusable UI components
│   ├── AlertCard.tsx
│   ├── ChatBox.tsx
│   ├── DynamicForm.tsx
│   ├── Layout.tsx
│   ├── MapPicker.tsx
│   ├── NotificationList.tsx
│   └── ProtectedRoute.tsx
├── hooks/            # Custom React hooks
├── mocks/            # MSW handlers and dummy data
│   ├── browser.ts
│   ├── dummyData.ts
│   └── handlers.ts
├── pages/            # Page components
│   ├── AdminDashboard.tsx
│   ├── Chat.tsx
│   ├── Login.tsx
│   ├── Notifications.tsx
│   ├── NotFound.tsx
│   └── UserDashboard.tsx
├── stores/           # Zustand stores
│   ├── authStore.ts
│   └── notificationStore.ts
├── theme/            # MUI theme configuration
│   └── muiTheme.ts
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🔌 API Endpoints (Mock)

### Authentication
- `POST /api/auth/login` - Login with email/password

### Alerts
- `GET /api/alerts` - List alerts (supports `user_id`, `status`, `garbage_type` filters)
- `GET /api/alerts/:id` - Get single alert
- `POST /api/alerts` - Create new alert
- `PUT /api/alerts/:id` - Update alert (status, form data, etc.)

### Forms
- `GET /api/form-types` - List available dynamic form types
- `POST /api/forms/:formTypeId/send` - Send form request to user
- `POST /api/form-responses` - Submit form response

### Messages
- `GET /api/messages?alertId=...` - Get messages for an alert
- `POST /api/messages` - Send a message

### Notifications
- `GET /api/notifications?user_id=...` - Get user notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 📝 Modifying Dummy Data

Edit `src/mocks/dummyData.ts` to change:

- **Users**: Add/modify demo accounts
- **Form Types**: Create new dynamic form templates
- **Initial Alerts**: Pre-populate with sample alerts
- **Messages**: Add initial chat messages
- **Notifications**: Pre-populate notifications

## 🎨 Customization

### Theme
Edit `src/theme/muiTheme.ts` to customize:
- Primary/secondary colors
- Typography
- Component styling
- Border radius, shadows, etc.

### Garbage Types
Edit `src/mocks/dummyData.ts` - `garbageTypes` array

### Status Options
Edit `src/mocks/dummyData.ts` - `statusOptions` array

## 🗺️ Map Configuration

The app uses OpenStreetMap tiles via React-Leaflet. Default center is San Francisco (37.7749, -122.4194).

To change the default location, edit the `defaultCenter` in `src/components/MapPicker.tsx`.

## 🔧 Available Scripts

```bash
npm run dev      # Start development server with MSW
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 📋 Form Types (Pre-configured)

1. **Overflow Details**: For reporting garbage overflow levels
2. **Hazardous Waste Form**: For reporting hazardous materials
3. **Large Item Disposal**: For reporting large items needing special disposal

## 🛡️ Security Notes

- This is a demo application with mock authentication
- JWT tokens are base64 encoded (not secure for production)
- In production, implement proper authentication with secure token handling
- MSW should only be used in development

## 📱 Responsive Design

The app is fully responsive:
- Mobile: Collapsible drawer navigation
- Tablet: Adjusted grid layouts
- Desktop: Full sidebar navigation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project as a template!
