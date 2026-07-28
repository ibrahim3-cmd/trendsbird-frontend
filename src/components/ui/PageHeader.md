# PageHeader Component

A reusable top panel component that provides a consistent header with optional tab navigation for all pages.

## Features

- ✅ Icon and title display
- ✅ Optional tab system with routing
- ✅ Active tab highlighting
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Clean border separation

## Props

```typescript
interface TabItem {
  name: string;      // Tab display name
  route: string;     // Tab route path
  icon?: LucideIcon; // Optional tab icon
}

interface PageHeaderProps {
  title: string;           // Page title
  icon: LucideIcon;        // Page icon
  tabs?: TabItem[];        // Optional tabs array
  className?: string;      // Optional additional CSS classes
}
```

## Usage Examples

### 1. Simple Header (No Tabs)

```tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { Users } from "lucide-react";

function ManageUserPage() {
  return (
    <div>
      <PageHeader
        title="Manage User"
        icon={Users}
      />
      
      {/* Your page content */}
    </div>
  );
}
```

### 2. Header with Tabs

```tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { Settings, User, Bell } from "lucide-react";

function SettingsPage() {
  const settingsTabs = [
    {
      name: "Account Info",
      route: "/profile",
      icon: User,
    },
    {
      name: "Notification",
      route: "/notifications",
      icon: Bell,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Settings"
        icon={Settings}
        tabs={settingsTabs}
      />
      
      {/* Your page content */}
    </div>
  );
}
```

### 3. Tabs without Icons

```tsx
const dashboardTabs = [
  {
    name: "Analytics",
    route: "/analytics",
    // No icon property - will work fine
  },
  {
    name: "Reports",
    route: "/reports",
  },
];

<PageHeader
  title="Dashboard"
  icon={BarChart3}
  tabs={dashboardTabs}
/>
```

## Styling

The component includes:

- **Header Area**: Icon in a colored background circle + title
- **Border**: Clean separation line
- **Tabs**: Horizontal tab navigation with active state
- **Responsive**: Works on all screen sizes
- **Theme Support**: Light and dark mode compatible

## Tab Behavior

- Tabs will only show if the `tabs` array is provided and has items
- Active tab is determined by current route path
- Hovering provides visual feedback
- Clicking navigates to the specified route

## Recommended Icons

Use Lucide React icons for consistency:

```tsx
import { 
  Settings, Users, BarChart3, FileText, 
  Shield, Bell, User, Home, Search 
} from "lucide-react";
```
