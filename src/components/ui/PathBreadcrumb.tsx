import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

interface PathBreadcrumbItem {
  label: string;
  path: string;
  isClickable: boolean;
}

// Route name mappings for better display names
const routeNameMappings: Record<string, string> = {
  'admin': 'Admin',
  'manage-user': 'Manage User',
  'roles': 'Role Management',
  'analytics': 'Analytics',
  'profile': 'Profile',
  'change-password': 'Change Password',
  'dashboard': 'Dashboard',
  'settings': 'Settings',
  'notifications': 'Notifications',
};

export function PathBreadcrumb({ className }: { className?: string }) {
  const location = useLocation();

  const generateBreadcrumbs = (url: string): PathBreadcrumbItem[] => {
    // Remove the domain and protocol if present
    const path = url.replace(/^https?:\/\/[^/]+/, '');
    
    // Split the path into segments and filter out empty strings
    const segments = path.split('/').filter(segment => segment.length > 0);
    
    const breadcrumbs: PathBreadcrumbItem[] = [];
    
    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const currentPath = '/' + segments.slice(0, index + 1).join('/');
      
      // Get display name from mapping or format the segment
      const displayName = routeNameMappings[segment] || 
                         segment.replace(/-/g, ' ')
                               .replace(/\b\w/g, l => l.toUpperCase());
      
      breadcrumbs.push({
        label: displayName,
        path: currentPath,
        isClickable: !isLast, // Last item is not clickable
      });
    });
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs(location.pathname);

  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList>
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center">
            <BreadcrumbItem>
              {crumb.isClickable ? (
                <BreadcrumbLink asChild>
                  <Link 
                    to={crumb.path}
                    className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors duration-200"
                  >
                    {crumb.label}
                  </Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="font-medium text-gray-900 dark:text-gray-100">
                  {crumb.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </div>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
