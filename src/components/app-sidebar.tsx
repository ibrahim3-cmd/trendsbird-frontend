import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { sidebarItems } from "@/routes/sidebarItems";
import Logo from "@/assets/icons/Logo";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useGetOrgSettingByIdQuery } from "@/redux/features/orgSetting/orgSettingApiSlice";

function isActive(target: string, pathname: string) {
  if (!target) return false;
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(target + "/");
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { setOpenMobile, state } = useSidebar();

  const { data: userInfo } = useUserInfoQuery(undefined);
  const orgId = userInfo?.data?.org?._id;
  const { data: existingSettings, isLoading: isLoadingSettings } = useGetOrgSettingByIdQuery(orgId, {
    skip: !orgId
  });

  // State for collapsed logo with fallback handling
  const [collapsedLogoSrc, setCollapsedLogoSrc] = React.useState<string>("/icon.png");

  React.useEffect(() => {
    setCollapsedLogoSrc(existingSettings?.data?.branding?.logoUrl || "/icon.png");
  }, [existingSettings?.data?.branding?.logoUrl]);

  const groups = React.useMemo(
    () => sidebarItems ?? [],
    []
  );
  const { pathname } = useLocation();

  // Flatten all items from all groups into a single array
  const allItems = React.useMemo(() => {
    return groups.flatMap(group => group.items);
  }, [groups]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-center">
        <div className="flex items-center justify-between w-full">
          {state !== "collapsed" ? (
            <div className="transition-all duration-300 ease-in-out mx-auto">
              <Logo 
                route="/dashboard" 
                src={existingSettings?.data?.branding?.logoUrl || ""}
                isLoading={isLoadingSettings}
              />
            </div>
          ) : (
            <Link to="/dashboard" className="flex items-center justify-center w-full transition-all duration-300 ease-in-out">
              {isLoadingSettings ? (
                <div className="w-8 h-8 bg-muted animate-pulse rounded" />
              ) : (
                <img 
                  src={collapsedLogoSrc} 
                  alt="Logo" 
                  className="w-8 h-8" 
                  onError={() => setCollapsedLogoSrc("/icon.png")}
                />
              )}
            </Link>
          )}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {allItems.map((item) => {
                const active = isActive(item.url, pathname);
                // Generate stable tour ID from the item key (e.g., "analytics" -> "tour-nav-analytics")
                // Handle keys like "manage-jobs" by using just "jobs"
                const keyBase = item.key?.replace(/^manage-/, '') || item.url.replace(/\//g, '') || 'home';
                const tourId = `tour-nav-${keyBase}`;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} id={tourId} aria-label={item.title}>
                        {item.icon ? (
                          // Render icon with active color and increased stroke/size when the item is active
                          React.createElement(item.icon, {
                            className: `${active ? "text-primary" : "text-muted-foreground"} mr-2 shrink-0 ${active ? 'w-9 h-9' : 'w-8 h-8'}`,
                            strokeWidth: active ? 3 : 1.2,
                          })
                        ) : null}
                        <span className={`group-data-[collapsible=icon]:hidden text-base ${active ? 'text-primary font-extrabold' : ''}`}>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
