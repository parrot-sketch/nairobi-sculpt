# Role-Based Layout System Documentation

## Overview

The Nairobi Sculpt frontend implements a **role-based layout system** that provides tailored UI experiences for different user roles (Admin, Doctor, Frontdesk, Patient). This eliminates duplicate headers and ensures proper navigation based on user permissions.

## Architecture

### Core Components

#### 1. **RootComponent** (`/src/components/RootComponent.tsx`)
- **Purpose**: Simple root wrapper that only renders `<Outlet />`
- **Key Change**: No longer renders Navigation (moved to individual layouts)
- **Benefit**: Cleaner separation of concerns

#### 2. **Layout Components**

Each role has a dedicated layout component that handles:
- Header with role-specific title
- Sidebar navigation (for admin/doctor/frontdesk)
- Role verification (redirect to login if role mismatch)
- Footer
- Main content area with proper spacing

**Files:**
- `AdminLayout` (`/src/components/Layouts/AdminLayout.tsx`)
- `DoctorLayout` (`/src/components/Layouts/DoctorLayout.tsx`)
- `FrontdeskLayout` (`/src/components/Layouts/FrontdeskLayout.tsx`)
- `PatientLayout` (`/src/components/Layouts/PatientLayout.tsx`)

#### 3. **Sidebar Navigation Components**

Each role has a sidebar with role-specific menu items:
- `AdminSidebar` (`/src/components/Admin/AdminSidebar.tsx`)
  - Dashboard, Users, Analytics, Reports, Audit Logs, Settings, Backup
  
- `DoctorSidebar` (`/src/components/Doctor/DoctorSidebar.tsx`)
  - Dashboard, Schedule, Patients, Procedures
  
- `FrontdeskSidebar` (`/src/components/Frontdesk/FrontdeskSidebar.tsx`)
  - Dashboard, Appointments, Check-in, Patients

#### 4. **Smart Dashboard Router** (`/src/router.tsx`)
- Generic `/dashboard` route automatically routes to role-specific dashboard
- Uses `DashboardWrapper` to read user role and redirect appropriately
- Prevents users from manually navigating to wrong role dashboards

## Usage Example

### Before (Problematic)
```tsx
// AdminDashboard.tsx - Had duplicate header
export const AdminDashboard = () => {
  return (
    <div>
      <Header title="Admin Dashboard" />  {/* ← Duplicate header */}
      <main>
        {/* Content */}
      </main>
      <Footer />
    </div>
  );
};
```

**Problem**: `RootComponent` renders `Navigation`, then `AdminDashboard` renders `Header` → **double headers**

### After (Solution)
```tsx
// AdminDashboard.tsx - Uses layout
export const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      {/* Content only - no header/footer/sidebar management */}
    </AdminLayout>
  );
};
```

**Layout handles**: Header + Sidebar + Footer + Role verification + Content wrapping

## Key Features

### 1. Role Verification
Each layout verifies the user has the correct role:
```tsx
if (user?.role !== 'ADMIN') {
  return <Access Denied page />
}
```

### 2. Active Route Highlighting
Sidebars highlight the currently active route using `useLocation()`:
```tsx
const isActive = location.pathname === item.path;
// Apply 'active' styling if true
```

### 3. Consistent Layout Structure
All layouts follow the same pattern:
```
┌─────────────────────────────┐
│         Header              │
├──────────────┬──────────────┤
│              │              │
│   Sidebar    │  Main        │
│              │  Content     │
│              │              │
├──────────────┴──────────────┤
│         Footer              │
└─────────────────────────────┘
```

### 4. Responsive Design
- Layouts use Tailwind CSS for responsive behavior
- `flex flex-1 overflow-hidden` ensures proper scrolling
- `max-w-7xl` containers for readability on large screens

## Router Configuration

### Smart Routing Flow
```
User logs in
    ↓
Redirects to /dashboard
    ↓
DashboardWrapper checks user.role
    ↓
Routes to specific dashboard:
  - ADMIN → /admin/dashboard
  - DOCTOR → /doctor/dashboard
  - FRONTDESK → /frontdesk/dashboard
  - PATIENT → /patient/dashboard
    ↓
Role-specific layout renders
```

### Route Definition
```tsx
const dashboardRoute = createRoute({
  path: '/dashboard',
  component: DashboardWrapper,
});

function DashboardWrapper() {
  const { user } = useAuth();
  
  switch (user?.role) {
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" />;
    // ... other roles
  }
}
```

## File Structure

```
src/
├── components/
│   ├── Layouts/
│   │   ├── AdminLayout.tsx
│   │   ├── DoctorLayout.tsx
│   │   ├── FrontdeskLayout.tsx
│   │   └── PatientLayout.tsx
│   ├── Admin/
│   │   └── AdminSidebar.tsx
│   ├── Doctor/
│   │   └── DoctorSidebar.tsx
│   ├── Frontdesk/
│   │   └── FrontdeskSidebar.tsx
│   ├── Branding/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── RootComponent.tsx
├── pages/
│   ├── AdminDashboard.tsx
│   ├── LoginPage.tsx
│   └── UnauthorizedPage.tsx
└── router.tsx
```

## Adding New Role-Specific Pages

### Step 1: Create the page
```tsx
// pages/AdminUsers.tsx
import { AdminLayout } from '@/components/Layouts/AdminLayout';

export const AdminUsers = () => {
  return (
    <AdminLayout title="User Management">
      {/* Page content */}
    </AdminLayout>
  );
};
```

### Step 2: Add route
```tsx
// router.tsx
const adminUsersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/users',
  component: AdminUsers,
});
```

### Step 3: Add to route tree
```tsx
const routeTree = rootRoute.addChildren([
  // ... existing routes
  adminUsersRoute,
]);
```

### Step 4: Add to sidebar
```tsx
// AdminSidebar.tsx
const adminMenuItems = [
  // ... existing items
  { label: 'Users', path: '/admin/users', icon: '👥' },
];
```

## Styling Conventions

### Layout Spacing
- Container max-width: `max-w-7xl`
- Horizontal padding: `px-6`
- Vertical padding: `py-8`
- Section spacing: `mb-12`

### Color Scheme
- Primary header: `bg-white border-b border-neutral-200`
- Sidebar: `bg-white border-r border-neutral-200`
- Active menu item: `bg-primary-100 text-primary-700`
- Hover state: `hover:bg-neutral-100`

### Typography
- Page titles: `variant="h2"` (used in content, not header)
- Section headers: `text-lg font-semibold`
- Body text: `variant="body1"` or `variant="body2"`
- Captions: `variant="caption"` for secondary text

## Security Considerations

### 1. Frontend Role Verification
- Each layout checks user role before rendering
- Prevents access to role-specific UIs
- **Note**: Always validate permissions on the backend too

### 2. Token-Based Access
- Layouts use auth context to get user info
- User can only see their role's dashboard
- Login redirects to role-specific dashboard automatically

### 3. Route Protection
- Protected routes use AuthContext
- Unauthorized users redirected to `/login`
- Failed role checks show "Access Denied" message

## Migration Guide (if updating existing pages)

### Before
```tsx
export const SomePage = () => (
  <div>
    <Header title="..." />
    <div className="px-6 py-8">
      {/* content */}
    </div>
    <Footer />
  </div>
);
```

### After
```tsx
import { AdminLayout } from '@/components/Layouts/AdminLayout';

export const SomePage = () => (
  <AdminLayout title="...">
    {/* content - no padding needed */}
  </AdminLayout>
);
```

**Changes:**
- Remove Header, Footer imports
- Wrap in `AdminLayout` (or appropriate role layout)
- Remove manual padding (layout handles it)
- Remove `min-h-screen bg-neutral-50` (layout includes it)

## Common Issues & Solutions

### Issue: Header appearing twice
**Solution**: Ensure page uses layout component instead of importing Header directly

### Issue: Sidebar not showing
**Solution**: Verify you're using the role-specific layout (AdminLayout, DoctorLayout, etc.)

### Issue: Wrong role accessing page
**Solution**: Layout includes role verification - check browser console for redirect or access denied message

### Issue: Sidebar links not highlighting
**Solution**: Ensure route paths in sidebar match router path definitions exactly

## Future Enhancements

- [ ] Mobile sidebar drawer (hamburger menu)
- [ ] User preference for sidebar collapse/expand
- [ ] Breadcrumb navigation in header
- [ ] Search functionality in header
- [ ] Notifications badge in header
- [ ] Role-based sidebar visibility (show different menu items per role)
- [ ] Analytics for page navigation patterns
