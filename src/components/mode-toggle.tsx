"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <ToggleGroup defaultValue="system" type="single">
      <span className="sr-only">Toggle theme</span>
      <ToggleGroupItem
        value="light"
        onClick={() => setTheme("light")}
        aria-label="Toggle light"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Light</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        onClick={() => setTheme("dark")}
        aria-label="Toggle dark"
      >
        <Moon className="h-4 w-4" />
        <span className="sr-only">Dark</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="system"
        onClick={() => setTheme("system")}
        aria-label="Toggle system"
      >
        <Monitor className="size-4" />
        <span className="sr-only">System</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
