import { Moon, Sun, Monitor } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import type { Theme } from "@/providers/theme.provider";
import { useEffect, useState } from "react";

// Standalone version for use outside of dropdown menus (e.g., Navbar)
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themeConfig = {
    light: { icon: Sun, label: "Light" },
    dark: { icon: Moon, label: "Dark" },
    system: { icon: Monitor, label: "System" },
  } satisfies Record<Theme, { icon: typeof Sun; label: string }>;

  const CurrentIcon = themeConfig[theme]?.icon || Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <CurrentIcon className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.entries(themeConfig) as Array<[Theme, { icon: typeof Sun; label: string }]>).map(([key, { icon: Icon, label }]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => setTheme(key)}
            className="cursor-pointer flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
            {theme === key && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Sub-menu version for use inside existing dropdown menus (e.g., DashboardLayout)
export function ModeToggleSubmenu() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themeConfig = {
    light: { icon: Sun, label: "Light" },
    dark: { icon: Moon, label: "Dark" },
    system: { icon: Monitor, label: "System" },
  } satisfies Record<Theme, { icon: typeof Sun; label: string }>;

  const CurrentIcon = themeConfig[theme]?.icon || Sun;
  const currentLabel = themeConfig[theme]?.label || "Theme";

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="cursor-pointer">
        <CurrentIcon className="mr-2 h-4 w-4" />
        {currentLabel}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {(Object.entries(themeConfig) as Array<[Theme, { icon: typeof Sun; label: string }]>).map(([key, { icon: Icon, label }]) => (
            <DropdownMenuItem
              key={key}
              onClick={() => setTheme(key)}
              className="cursor-pointer flex items-center gap-2"
            >
              <Icon className="h-4 w-4" />
              {label}
              {theme === key && <div className="ml-auto w-2 h-2 rounded-full bg-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
