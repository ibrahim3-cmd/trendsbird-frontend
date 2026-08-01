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
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { getSidebarItems } from "@/utils/getSidebarItems";

function isActive(target: string, pathname: string) {
  if (!target) return false;
  if (target === "/") return pathname === "/";
  return pathname === target || pathname.startsWith(`${target}/`);
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { setOpenMobile, state } = useSidebar();
  const { data: userInfo } = useUserInfoQuery(undefined);
  const { pathname } = useLocation();

  const groups = React.useMemo(
    () => getSidebarItems(userInfo?.data?.permissions ?? [], userInfo?.data?.role),
    [userInfo?.data?.permissions, userInfo?.data?.role]
  );

  const allItems = React.useMemo(() => groups.flatMap((group) => group.items), [groups]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="items-center">
        <div className="flex items-center justify-between w-full">
          {state !== "collapsed" ? (
            <div className="transition-all duration-300 ease-in-out mx-auto text-lg font-semibold">
              <span>trends bird</span>
            </div>
          ) : null}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setOpenMobile(false)} className="h-8 w-8">
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
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} aria-label={item.title}>
                        {item.icon
                          ? React.createElement(item.icon, {
                              className: `${active ? "text-primary" : "text-muted-foreground"} mr-2 shrink-0 ${active ? "w-9 h-9" : "w-8 h-8"}`,
                              strokeWidth: active ? 3 : 1.2,
                            })
                          : null}
                        <span className={`group-data-[collapsible=icon]:hidden text-base ${active ? "text-primary font-extrabold" : ""}`}>
                          {item.title}
                        </span>
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
