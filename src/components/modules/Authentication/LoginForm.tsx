/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLazyUserInfoQuery, useLoginMutation, useResetDatabaseMutation } from "@/redux/features/auth/auth.api";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  Trash2,
  Settings,
} from "lucide-react";
import { DEV_DEFAULTS, DevUserType } from "@/constants/devDefaults";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import * as React from "react";

export function LoginForm({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      email: DEV_DEFAULTS.SUPER_ADMIN_EMAIL,
      password: DEV_DEFAULTS.SUPER_ADMIN_PASSWORD,
    },
  });

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [getMe, { isFetching: isGettingMe }] = useLazyUserInfoQuery();
  const [resetDatabase, { isLoading: isResettingDatabase }] = useResetDatabaseMutation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [devUser, setDevUser] = React.useState<DevUserType>("admin");

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    const formData = { email: values.email as string, password: values.password as string };
    try {
      const loginRes = await login(formData).unwrap();
      const payload = (loginRes as any)?.data || loginRes;

      const accessToken = payload?.accessToken || payload?.data?.accessToken;
      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }

      const session = payload?.session;
      if (session?.permissions) {
        localStorage.setItem("permissions", JSON.stringify(session.permissions));
      }
      if (session?.role) {
        localStorage.setItem("role", session.role);
      }

      const me = await getMe(undefined).unwrap();
      const user = me?.data;

      if (!user?.id) {
        toast.error("Could not fetch your session. Please try again.");
        return;
      }

      localStorage.setItem("permissions", JSON.stringify(user.permissions ?? []));
      if (user.role) localStorage.setItem("role", user.role);

      toast.success("Logged in successfully");

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const msg = err?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  const handleResetDatabase = async () => {
    const confirmed = window.confirm(
      "This will remove all application data, recreate the schema, and reseed the admin account. Continue?"
    );

    if (!confirmed) {
      return;
    }

    const secret = window.prompt("Enter the database reset secret");
    if (!secret) {
      return;
    }

    try {
      await resetDatabase({ secret }).unwrap();
      localStorage.removeItem("token");
      localStorage.removeItem("permissions");
      localStorage.removeItem("role");
      toast.success("Database reset and reseeded successfully");
    } catch (err: any) {
      const msg = err?.data?.message || "Database reset failed. Please try again.";
      toast.error(msg);
    }
  };

  const switchDevUser = (type: DevUserType) => {
    setDevUser(type);
    if (type === "admin") {
      form.setValue("email", DEV_DEFAULTS.SUPER_ADMIN_EMAIL);
      form.setValue("password", DEV_DEFAULTS.SUPER_ADMIN_PASSWORD);
    } else {
      form.setValue("email", DEV_DEFAULTS.CATALOG_USER_EMAIL);
      form.setValue("password", DEV_DEFAULTS.CATALOG_USER_PASSWORD);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 relative", className)} {...props}>
      {/* Top-right settings (popover) */}
      <div className="absolute right-2 top-2">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" aria-label="Settings" className="p-2 rounded hover:bg-muted/50 transition">
              <Settings className="h-5 w-5" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="bottom" align="end" className="w-60">
            <div className="text-sm text-muted-foreground mb-2">Dangerous actions</div>
            <Button
              type="button"
              variant="destructive"
              disabled={isLoggingIn || isGettingMe || isResettingDatabase}
              onClick={async () => {
                await handleResetDatabase();
              }}
              className="w-full"
            >
              {isResettingDatabase ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting database…
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Reset database
                </>
              )}
            </Button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-center gap-2 text-center">

        <h1 className="text-2xl font-bold tracking-tight mt-1">Welcome back</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Log in to manage users, roles, and permissions.
        </p>
        <div className="mt-2 flex items-center gap-3">
          <span className="text-sm">Login in as</span>
          <div className="flex items-center gap-2 rounded-md border bg-muted/5 p-1">
            <button
              type="button"
              onClick={() => switchDevUser("catalog")}
              className={cn(
                "px-3 py-1 rounded text-sm",
                devUser === "catalog" ? "bg-system-primary text-system-primary-text" : "bg-transparent"
              )}
            >
              Catalog
            </button>
            <button
              type="button"
              onClick={() => switchDevUser("admin")}
              className={cn(
                "px-3 py-1 rounded text-sm",
                devUser === "admin" ? "bg-system-primary text-system-primary-text" : "bg-transparent"
              )}
            >
              Admin
            </button>
          </div>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Enter a valid email address",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                    </span>
                    <Input
                      placeholder={DEV_DEFAULTS.SUPER_ADMIN_EMAIL}
                      {...field}
                      value={field.value || ""}
                      className="pl-9 focus-visible:border-system-primary focus-visible:ring-2 focus-visible:ring-system-primary"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            rules={{ required: "Password is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <Lock className="h-4 w-4" />
                    </span>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={"********"}
                      {...field}
                      value={field.value || ""}
                      className="pl-9 pr-10 focus-visible:border-system-primary focus-visible:ring-2 focus-visible:ring-system-primary"
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoggingIn || isGettingMe}
            className="w-full bg-system-primary text-system-primary-text hover:bg-system-primary/90"
          >
            {isLoggingIn || isGettingMe ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in…
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Login
              </>
            )}
          </Button>

          {/* Reset moved to settings menu */}
        </form>
      </Form>

      {/* <div className="text-center text-sm">
        Back to{" "}
        <Link to="/" className="underline underline-offset-4 text-system-primary hover:text-system-primary/80">
          Home
        </Link>
      </div> */}
    </div>
  );
}
