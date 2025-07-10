import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <SunIcon
            className={`!h-[1.2rem] !w-[1.2rem] transition-all duration-300 ${
              theme === "light" ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <MoonIcon
            className={`absolute !h-[1.2rem] !w-[1.2rem] transition-all duration-300 ${
              theme === "dark" ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <MonitorIcon
            className={`absolute !h-[1.2rem] !w-[1.2rem] transition-all duration-300 ${
              theme === "system" ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <SunIcon className="mr-2 !h-4 !w-4" />
          <span>Light</span>
          {theme === "light" && <CheckIcon className="ml-auto !h-4 !w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <MoonIcon className="mr-2 !h-4 !w-4" />
          <span>Dark</span>
          {theme === "dark" && <CheckIcon className="ml-auto !h-4 !w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <MonitorIcon className="mr-2 !h-4 !w-4" />
          <span>System</span>
          {theme === "system" && <CheckIcon className="ml-auto !h-4 !w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
