"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  HelpCircle,
  LogOut,
  Baby,
  Heart,
  HeartHandshake,
  Scale,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/ui/utils";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Certificate Manager";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/certificates/birth", label: "Birth", icon: Baby },
  { href: "/certificates/death", label: "Death", icon: Heart },
  { href: "/certificates/marriage", label: "Marriage", icon: HeartHandshake },
  { href: "/certificates/divorce", label: "Divorce", icon: Scale },
  { href: "/documents", label: "Documents", icon: FolderOpen },
  { href: "/subscription", label: "Subscription", icon: CreditCard },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help", icon: HelpCircle },
];

const DEFAULT_SIDEBAR_WIDTH = 240;
const MIN_SIDEBAR_WIDTH = 64;
const MAX_SIDEBAR_WIDTH = 340;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarWidth, setSidebarWidth] = useState<number>(DEFAULT_SIDEBAR_WIDTH);
  const [isResizing, setIsResizing] = useState(false);

  // Load saved sidebar width from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("app_sidebar_width");
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed) && parsed >= MIN_SIDEBAR_WIDTH && parsed <= MAX_SIDEBAR_WIDTH) {
        setSidebarWidth(parsed);
      }
    }
  }, []);

  const saveWidth = (w: number) => {
    setSidebarWidth(w);
    localStorage.setItem("app_sidebar_width", w.toString());
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const isCollapsed = sidebarWidth <= 90;

  const toggleCollapse = () => {
    if (isCollapsed) {
      saveWidth(DEFAULT_SIDEBAR_WIDTH);
    } else {
      saveWidth(MIN_SIDEBAR_WIDTH);
    }
  };

  // Drag resizer handler
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < MIN_SIDEBAR_WIDTH + 20) newWidth = MIN_SIDEBAR_WIDTH;
      if (newWidth > MAX_SIDEBAR_WIDTH) newWidth = MAX_SIDEBAR_WIDTH;
      setSidebarWidth(newWidth);
    },
    [isResizing]
  );

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      localStorage.setItem("app_sidebar_width", sidebarWidth.toString());
    }
  }, [isResizing, sidebarWidth]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  return (
    <div className="min-h-screen flex relative">
      {/* Resizable Sidebar */}
      <aside
        className="hidden lg:flex flex-col border-r bg-muted/20 relative shrink-0 transition-[width] duration-75"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Sidebar Header & Toggle */}
        <div className="p-3 border-b flex items-center justify-between min-h-[57px] shrink-0">
          {!isCollapsed && (
            <Link href="/dashboard" className="font-bold text-base text-primary truncate">
              {appName}
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 mx-auto"
            onClick={toggleCollapse}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isCollapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors min-h-[38px]",
                  isCollapsed ? "justify-center px-0" : "",
                  active
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-2 border-t shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-muted-foreground hover:text-foreground",
              isCollapsed ? "justify-center px-0" : ""
            )}
            onClick={handleLogout}
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>

        {/* Drag Resizer Bar */}
        <div
          onMouseDown={handleMouseDown}
          onDoubleClick={toggleCollapse}
          className={cn(
            "absolute top-0 right-[-4px] bottom-0 w-2 cursor-col-resize z-30 group flex items-center justify-center hover:bg-primary/30 transition-colors",
            isResizing ? "bg-primary/50" : ""
          )}
          title="Drag to resize sidebar width / Double-click to toggle"
        >
          <div className="w-1 h-6 rounded-full bg-slate-300 group-hover:bg-primary transition-colors opacity-0 group-hover:opacity-100" />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden border-b p-4 flex items-center justify-between">
          <Link href="/dashboard" className="font-bold text-primary">
            {appName}
          </Link>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const adminNav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/customers", label: "Customers" },
    { href: "/admin/plans", label: "Plans" },
    { href: "/admin/settings", label: "Settings" },
    { href: "/admin/logs", label: "Logs" },
  ];

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r bg-slate-900 text-white">
        <div className="p-4 border-b border-slate-700">
          <span className="font-bold">Admin Panel</span>
        </div>
        <nav className="p-3 space-y-1">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block px-3 py-2 rounded text-sm",
                pathname === item.href
                  ? "bg-slate-700"
                  : "text-slate-300 hover:bg-slate-800"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full text-slate-300 hover:text-white hover:bg-slate-800"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-slate-50 overflow-auto">{children}</main>
    </div>
  );
}
