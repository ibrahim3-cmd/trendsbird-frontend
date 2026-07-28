import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Link, Outlet } from "react-router-dom";
import { ModeToggleSubmenu } from "./ModeToggler";
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery,
  useLoginByEmailAndRoleMutation,
} from "@/redux/features/auth/auth.api";
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  KeySquare,
  LogOut,
  Settings,
  Ticket,
  UserRoundPen,
  HelpCircle,
  Users,
  ListTodo,
  Search,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
  Calendar,
  ArrowRight,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// import { ITask } from "@/types/task.type";
// import { ILead } from "@/types/lead.type";
import { format, isToday, isFuture, isPast } from "date-fns";
import { cn } from "@/lib/utils";
// import {
//   useDebounced,
//   TaskItem,
//   LeadItem,
//   SectionHeader,
//   EmptyState
// } from "@/pages/Admin/my-day";
import { toast } from "sonner";
import { OrganizationSetupGuard } from "@/components/modals/OrganizationSetupGuard";
import { useOnboardingTour, resetOnboardingTour } from "@/hooks/useOnboardingTour";
import { useGetOrgSettingByIdQuery } from "@/redux/features/orgSetting/orgSettingApiSlice";

// ============================================
// DAILY TASK TYPES AND COMPONENTS
// ============================================

interface IDailyTask {
  _id: string;
  title: string;
  details: string;
  status: "To Do" | "In Progress" | "In Review" | "Completed" | "Cancelled";
  priority: "low" | "medium" | "high";
  dueDate: string;
  assignedDate: string;
  startDate?: string;
  completion: number;
  isCompleted: boolean;
  isRecurring: boolean;
  parentTaskId?: string | null;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  org: {
    _id: string;
    orgName: string;
  };
}

const getDailyTaskPriorityStyles = (priority?: string) => {
  switch (priority?.toLowerCase()) {
    case "high":
      return { bg: "bg-red-100", text: "text-red-700", border: "border-l-red-500" };
    case "medium":
      return { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-l-yellow-500" };
    case "low":
      return { bg: "bg-green-100", text: "text-green-700", border: "border-l-green-500" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700", border: "border-l-gray-400" };
  }
};

const getDailyTaskStatusStyles = (status?: string) => {
  switch (status) {
    case "Completed":
      return { bg: "bg-green-100", text: "text-green-700" };
    case "In Progress":
      return { bg: "bg-blue-100", text: "text-blue-700" };
    case "In Review":
      return { bg: "bg-purple-100", text: "text-purple-700" };
    case "To Do":
      return { bg: "bg-gray-100", text: "text-gray-700" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-700" };
  }
};

const DailyTaskItemCompact = ({
  task,
  onClick,
}: {
  task: IDailyTask;
  onClick: () => void;
}) => {
  const priorityStyles = getDailyTaskPriorityStyles(task.priority);
  const statusStyles = getDailyTaskStatusStyles(task.status);
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "Completed";
  const isDueToday = dueDate && isToday(dueDate);

  return (
    <li
      onClick={onClick}
      className={cn(
        "flex items-start gap-2 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm cursor-pointer transition-all hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50 p-2.5",
        "border-l-4",
        priorityStyles.border
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                {task.title}
              </p>
              {task.parentTaskId && (
                <span className="flex-shrink-0 text-[9px] px-1 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  Recurring
                </span>
              )}
            </div>
            {task.details && (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {task.details}
              </p>
            )}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {dueDate && (
                <span
                  className={cn(
                    "text-[10px] flex items-center gap-0.5",
                    isOverdue ? "text-red-500" : isDueToday ? "text-orange-500" : "text-gray-500 dark:text-gray-400"
                  )}
                >
                  <Calendar className="h-2.5 w-2.5" />
                  {isOverdue ? "Overdue" : isDueToday ? "Today" : format(dueDate, "MMM d")}
                </span>
              )}
              {task.completion > 0 && task.completion < 100 && (
                <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${task.completion}%` }}
                    />
                  </div>
                  <span>{task.completion}%</span>
                </span>
              )}
              <span
                className={cn(
                  "text-[9px] px-1.5 py-0.5 rounded font-medium",
                  statusStyles.bg,
                  statusStyles.text
                )}
              >
                {task.status}
              </span>
            </div>
          </div>
          <span
            className={cn(
              "flex-shrink-0 text-[9px] px-1.5 py-0.5 rounded-full font-semibold capitalize",
              priorityStyles.bg,
              priorityStyles.text
            )}
          >
            {task.priority || "medium"}
          </span>
        </div>
      </div>
    </li>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function DashboardLayout() {
  const navigate = useNavigate();
  const { data } = useUserInfoQuery(undefined);
  const [logout] = useLogoutMutation();
  const [loginByEmailAndRole, { isLoading: isSwitchingAccount }] = useLoginByEmailAndRoleMutation();
  const dispatch = useAppDispatch();
  const [savedUsers, setSavedUsers] = useState<Array<{ name: string; email: string; role: string }>>([]);

  // My Day dropdown state
  const [myDayOpen, setMyDayOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"tasks" | "dailyTasks" | "leads">("tasks");
  // const debouncedSearch = useDebounced(searchTerm);

  const userRole = data?.data?.role as string | undefined;
  const isClient = userRole === "CLIENT";

  // Fetch My Day data
  // const { data: myDayData, isLoading: myDayLoading, error: myDayError } = useGetMyDayQuery(
  //   { searchTerm: debouncedSearch || undefined, type: "all" },
  //   { skip: isClient }
  // );

  // const tasks = myDayData?.tasks || [];
  // const leads = myDayData?.leads || [];
  // const allDailyTasks = myDayData?.dailyTasks || [];

  // Filter daily tasks to show only "To Do" and "In Progress"
  // const dailyTasks = useMemo(() => {
  //   return allDailyTasks.filter(
  //     (task) => task.status === "To Do" || task.status === "In Progress"
  //   );
  // }, [allDailyTasks]);
  
  // Check organization setup status for ADMIN role
  const orgId = data?.data?.org?._id;
  const { data: existingSettings } = useGetOrgSettingByIdQuery(orgId, {
    skip: !orgId
  });

  // Check if setup is complete (all 3 fields present)
  const hasAddress = Boolean(data?.data?.org?.orgAddress?.address?.trim());
  const hasLogo = existingSettings?.data?.branding?.logoUrl?.trim() ? true : false;
  const hasTimezone = existingSettings?.data?.timezone?.trim() ? true : false;
  const isSetupComplete = hasAddress && hasLogo && hasTimezone;

  // Start onboarding tour only if setup is complete (or not ADMIN role)
  useOnboardingTour({ enabled: isSetupComplete });

  // Categorize tasks
  // const categorizedTasks = useMemo(() => {
  //   const urgentTasks = tasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH");
  //   const todayTasks = tasks.filter((t) => t.deadline && isToday(new Date(t.deadline)));
  //   const upcomingTasks = tasks.filter((t) => {
  //     if (!t.deadline) return true;
  //     const d = new Date(t.deadline);
  //     return isFuture(d) && !isToday(d);
  //   });
  //   const overdueTasks = tasks.filter((t) => {
  //     if (!t.deadline) return false;
  //     const d = new Date(t.deadline);
  //     return isPast(d) && !isToday(d) && t.status !== "Completed";
  //   });
  //   return { urgentTasks, todayTasks, upcomingTasks, overdueTasks };
  // }, [tasks]);

  // Categorize daily tasks
  // const categorizedDailyTasks = useMemo(() => {
  //   const inProgressTasks = dailyTasks.filter((t) => t.status === "In Progress");
  //   const toDoTasks = dailyTasks.filter((t) => t.status === "To Do");
  //   const highPriorityTasks = dailyTasks.filter((t) => t.priority === "high");
  //   const overdueTasks = dailyTasks.filter((t) => {
  //     if (!t.dueDate) return false;
  //     const d = new Date(t.dueDate);
  //     return isPast(d) && !isToday(d);
  //   });
  //   const todayTasks = dailyTasks.filter((t) => {
  //     if (!t.dueDate) return false;
  //     return isToday(new Date(t.dueDate));
  //   });

  //   return { inProgressTasks, toDoTasks, highPriorityTasks, overdueTasks, todayTasks };
  // }, [dailyTasks]);

  const handleTaskClick = () => {
    setMyDayOpen(false);
    navigate("/jobs?tab=my-tasks");
  };

  const handleLeadClick = () => {
    setMyDayOpen(false);
    navigate("/opportunity?tab=my-leads");
  };

  const handleDailyTaskClick = () => {
    setMyDayOpen(false);
    navigate("/daily-tasks");
  };

  // const renderTaskSection = (title: string, taskList: ITask[], emptyMessage?: string, compact?: boolean) => (
  //   <div className={compact ? "mb-4" : "mb-6"}>
  //     <SectionHeader title={title} count={taskList.length} compact={compact} />
  //     {taskList.length === 0 && emptyMessage ? (
  //       <div className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">
  //         <CheckCircle2 className="w-6 h-6 mx-auto mb-1 opacity-50" />
  //         <p className="text-xs">{emptyMessage}</p>
  //       </div>
  //     ) : (
  //       <ul className={compact ? "px-2 space-y-2" : "px-2 space-y-3"}>
  //         {taskList.map((task) => <TaskItem key={task._id} task={task} onClick={handleTaskClick} compact={compact} />)}
  //       </ul>
  //     )}
  //   </div>
  // );

  // const renderLeadSection = (title: string, leadList: ILead[], emptyMessage?: string, compact?: boolean) => (
  //   <div className={compact ? "mb-4" : "mb-6"}>
  //     <SectionHeader title={title} count={leadList.length} compact={compact} />
  //     {leadList.length === 0 && emptyMessage ? (
  //       <div className="px-2 py-4 text-center text-gray-500 dark:text-gray-400">
  //         <Users className="w-6 h-6 mx-auto mb-1 opacity-50" />
  //         <p className="text-xs">{emptyMessage}</p>
  //       </div>
  //     ) : (
  //       <div className={compact ? "px-2 space-y-2" : "px-2 space-y-3"}>
  //         {leadList.map((lead) => <LeadItem key={lead._id} lead={lead} onClick={handleLeadClick} compact={compact} />)}
  //       </div>
  //     )}
  //   </div>
  // );

  const renderDailyTaskSection = (title: string, taskList: IDailyTask[], emptyMessage?: string) => {
    if (taskList.length === 0 && !emptyMessage) return null;

    return (
      <div className="mb-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">{title}</h3>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{taskList.length}</span>
        </div>
        {taskList.length === 0 && emptyMessage ? (
          <div className="px-2 py-3 text-center text-gray-500 dark:text-gray-400">
            <CheckCircle2 className="w-5 h-5 mx-auto mb-1 opacity-50" />
            <p className="text-[11px]">{emptyMessage}</p>
          </div>
        ) : (
          <ul className="px-2 space-y-2">
            {taskList.map((task) => (
              <DailyTaskItemCompact key={task._id} task={task} onClick={handleDailyTaskClick} />
            ))}
          </ul>
        )}
      </div>
    );
  };

  // Load saved users from localStorage
  useEffect(() => {
    const taincUser = localStorage.getItem("TAINC_USER");
    if (taincUser) {
      try {
        const users = JSON.parse(taincUser);
        if (Array.isArray(users)) {
          setSavedUsers(users);
        }
      } catch (error) {
        console.error("Failed to parse TAINC_USER:", error);
      }
    }
  }, []);

  const handleShowTour = async () => {
    await resetOnboardingTour();
  };

  const handleSwitchAccount = async (user: { name: string; email: string; role: string }) => {
    try {
      await loginByEmailAndRole({
        email: user.email,
        role: user.role,
      }).unwrap();

      toast.success(`Switched to ${user.name}`);

      const savedPath = localStorage.getItem("ADMIN_PATH");

      localStorage.removeItem("TAINC_USER");
      localStorage.removeItem("ADMIN_PATH");

      window.location.href = savedPath || "/";
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to switch account");
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("features");
    sessionStorage.removeItem("features");
    localStorage.removeItem("TAINC_USER");
    localStorage.removeItem("ADMIN_PATH");
    localStorage.removeItem("persist:root");
    sessionStorage.clear();
    dispatch(authApi.util.resetApiState());
    await logout(undefined);
    window.location.href = "/login";
  };

  return (
    <OrganizationSetupGuard>
      <SidebarProvider className={`h-screen overflow-hidden ${bg}`}>
        <AppSidebar />
        <SidebarInset className="h-full overflow-hidden">
          <header className="flex justify-between h-16 shrink-0 items-center gap-2 border-b px-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger id="sidebar-switcher" className="-ml-1" />
              <Separator orientation="vertical" className="h-4" />
              <PathBreadcrumb />
            </div>

            <div className="flex items-center gap-2">
            {/* Credit Balance Button (hidden for Client role) */}
            {/* {!isClient && <CreditBalanceButton />} */}

            {/* My Day Dropdown (hidden for Client role) */}
            {!isClient && (
              <Popover open={myDayOpen} onOpenChange={setMyDayOpen}>
                <PopoverTrigger asChild>
                  {/* <Button variant="outline" size="sm" className="font-semibold">
                    <ListTodo className="h-4 w-4 mr-2" />
                    My Day
                    {(tasks.length + dailyTasks.length) > 0 && (
                      <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-primary text-white min-w-[18px] text-center">
                        {tasks.length + dailyTasks.length}
                      </span>
                    )}
                  </Button> */}
                </PopoverTrigger>
                <PopoverContent align="end" sideOffset={8} className="w-[520px] p-0">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary/10 to-transparent">
                      {/* Tabs */}
                      <div className="flex items-center gap-3 overflow-x-auto pb-1">
                        {/* Tasks Tab */}
                        <button
                          onClick={() => setActiveTab("tasks")}
                          className={`pb-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${activeTab === "tasks" ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                        >
                          <span className="flex items-center gap-1.5">
                            <ListTodo className="h-3.5 w-3.5" />
                            <span>My Tasks</span>
                            {/* <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeTab === "tasks" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                              {tasks.length}
                            </span> */}
                          </span>
                          {activeTab === "tasks" && <div className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                        </button>

                        {/* Daily Tasks Tab */}
                        <button
                          onClick={() => setActiveTab("dailyTasks")}
                          className={`pb-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${activeTab === "dailyTasks" ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                        >
                          <span className="flex items-center gap-1.5">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            <span>Daily Tasks</span>
                            {/* <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeTab === "dailyTasks" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                              {dailyTasks.length}
                            </span> */}
                          </span>
                          {activeTab === "dailyTasks" && <div className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                        </button>

                        {/* Leads Tab */}
                        <button
                          onClick={() => setActiveTab("leads")}
                          className={`pb-1.5 text-xs font-semibold transition-colors relative whitespace-nowrap ${activeTab === "leads" ? "text-primary" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"}`}
                        >
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" />
                            <span>Lead Assignments</span>
                            {/* <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${activeTab === "leads" ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"}`}>
                              {leads.length}
                            </span> */}
                          </span>
                          {activeTab === "leads" && <div className="absolute -bottom-[10px] left-0 right-0 h-0.5 bg-primary rounded-full" />}
                        </button>
                      </div>

                      {/* Search */}
                      <div className="mt-4">
                        <div className="relative">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <Search className="w-3.5 h-3.5" />
                          </div>
                          <input
                            type="text"
                            placeholder={
                              activeTab === "tasks"
                                ? "Search tasks..."
                                : activeTab === "dailyTasks"
                                ? "Search daily tasks..."
                                : "Search leads..."
                            }
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {/* Main User Dropdown */}
            {data?.data?.email && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer border border-primary p-0.5">
                    <AvatarImage className="rounded-full object-cover " src={data?.data?.picture || "/avatar.png"} />
                    <AvatarFallback>
                      {data?.data?.name
                        ? data.data.name
                          .split(" ")
                          .slice(0, 2)
                          .map((word: string) => word[0]?.toUpperCase())
                          .join("")
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-52" align="end">
                  <DropdownMenuLabel>My Territory</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <Link to="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                        <DropdownMenuShortcut><UserRoundPen /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <Link to="/settings">
                        <DropdownMenuItem className="cursor-pointer">
                          Settings
                          <DropdownMenuShortcut><Settings /></DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                    
                    <Link to="/change-password">
                      <DropdownMenuItem className="cursor-pointer">
                        Change Password
                        <DropdownMenuShortcut><KeySquare /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleShowTour} className="cursor-pointer">
                      Show Tour
                      <DropdownMenuShortcut><HelpCircle /></DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <ModeToggleSubmenu />

                    {/* Switch Account Submenu */}
                    {savedUsers.length > 0 && (
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          <Users className="mr-2 h-4 w-4" />
                          Switch Account
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            {savedUsers.map((user, index) => (
                              <DropdownMenuItem
                                key={index}
                                onClick={() => handleSwitchAccount(user)}
                                disabled={isSwitchingAccount}
                                className="cursor-pointer"
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar className="w-8 h-8 border border-primary/50">
                                    <AvatarFallback className="text-xs">
                                      {user.name
                                        ? user.name
                                          .split(" ")
                                          .slice(0, 2)
                                          .map((word: string) => word[0]?.toUpperCase())
                                          .join("")
                                        : "NA"}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="text-xs font-medium">{user.name}</span>
                                    <span className="text-[11px]">({user.role})</span>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                    )}
                    <Link to="/support-tickets">
                      <DropdownMenuItem className="cursor-pointer">
                        Support Tickets
                        <DropdownMenuShortcut><Ticket /></DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    Log out
                    <DropdownMenuShortcut><LogOut className="text-red-500" /></DropdownMenuShortcut>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <div className="flex gap-2">
                      <div>
                        <Avatar className="w-8 h-8 cursor-pointer border border-primary p-0.5">
                          <AvatarImage className="rounded-full object-cover " src={data?.data?.picture || "/avatar.png"} />
                          <AvatarFallback>
                            {data?.data?.name
                              ? data.data.name
                                .split(" ")
                                .slice(0, 2)
                                .map((word: string) => word[0]?.toUpperCase())
                                .join("")
                              : "NA"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <p className="text-xs font-bold">{data?.data?.name || "Not Available"}</p>
                        <p className="text-xs">{data?.data?.email || "Not Available"}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>
        <div className="flex-1 flex flex-col gap-4 p-4 min-h-0 overflow-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  </OrganizationSetupGuard>
  );
}