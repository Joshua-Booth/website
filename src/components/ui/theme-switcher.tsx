import { useEffect, useState } from "react";
import { Button, DropdownMenu, Theme } from "@radix-ui/themes";
import { Monitor, Moon, Palette, Sun } from "lucide-react";

type ThemeOption = "system" | "light" | "dark";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<ThemeOption>("system");

  useEffect(() => {
    // Check initial theme preference
    const rawTheme = localStorage.getItem("theme");
    const savedTheme =
      rawTheme === "system" || rawTheme === "light" || rawTheme === "dark"
        ? rawTheme
        : "system";
    const systemPreference = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setTheme(savedTheme);

    // Apply theme to document
    let effectiveTheme: ThemeOption;
    if (savedTheme === "system") {
      effectiveTheme = systemPreference ? "dark" : "light";
    } else {
      effectiveTheme = savedTheme;
    }

    document.documentElement.classList.toggle(
      "dark",
      effectiveTheme === "dark"
    );
  }, []);

  useEffect(() => {
    // Listen for system theme changes when in system mode
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle("dark", e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: ThemeOption) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);

    if (newTheme === "system") {
      const systemIsDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      document.documentElement.classList.toggle("dark", systemIsDark);
    } else {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  return (
    <Theme
      asChild
      accentColor="blue"
      radius="medium"
      panelBackground="solid"
      grayColor="gray"
    >
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button
            variant="ghost"
            size="3"
            aria-label="Change theme"
            color="gray"
          >
            <Palette className="size-4" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end">
          <DropdownMenu.Item
            onClick={() => handleThemeChange("system")}
            className={theme === "system" ? "active" : ""}
          >
            <Monitor className="mr-1 size-4" />
            System
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => handleThemeChange("light")}
            className={theme === "light" ? "active" : ""}
          >
            <Sun className="mr-1 size-4" />
            Light
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={() => handleThemeChange("dark")}
            className={theme === "dark" ? "active" : ""}
          >
            <Moon className="mr-1 size-4" />
            Dark
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );
}
