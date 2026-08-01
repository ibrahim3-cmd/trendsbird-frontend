import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { ModeToggleSubmenu } from "./ModeToggler";
import { authApi, useLogoutMutation, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { bg } from "@/constants";
import { PathBreadcrumb } from "@/components/ui/PathBreadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeySquare, LogOut, UserRoundPen } from "lucide-react";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("permissions");
    localStorage.removeItem("role");
    dispatch(authApi.util.resetApiState());
    await logout(undefined);
    navigate("/login", { replace: true });
  };

  return (
    <SidebarProvider className={`h-screen overflow-hidden ${bg}`}>
      <AppSidebar />
      <SidebarInset className="h-full overflow-hidden">
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4" />
            <PathBreadcrumb />
          </div>

          {data?.data?.email && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 cursor-pointer border border-primary p-0.5">
                  <AvatarImage className="rounded-full object-cover" src={data.data.avatar || "/avatar.png"} />
                  <AvatarFallback>
                    {data.data.name
                      ?.split(" ")
                      .slice(0, 2)
                      .map((word: string) => word[0]?.toUpperCase())
                      .join("") || "NA"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-52" align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuGroup>
                  <Link to="/profile">
                    <DropdownMenuItem className="cursor-pointer">
                      Profile
                      <DropdownMenuShortcut><UserRoundPen /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/change-password">
                    <DropdownMenuItem className="cursor-pointer">
                      Change Password
                      <DropdownMenuShortcut><KeySquare /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </Link>
                  <ModeToggleSubmenu />
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Log out
                  <DropdownMenuShortcut><LogOut className="text-red-500" /></DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </header>
        <div className="flex-1 flex flex-col gap-4 p-4 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
