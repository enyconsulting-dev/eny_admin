import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-6 fixed z-10 w-[calc(100%-256px)]">
            <SidebarTrigger className="mr-4" />
            <div className="flex-1">
              {(() => {
                // Get current path from window.location, e.g. "/assessment/pa"
                const path = typeof window !== "undefined" ? window.location.pathname : "";
                // Split and get the first segment after the root
                const segments = path.split("/").filter(Boolean);
                const title = segments[0]
                  ? segments[0][0].toUpperCase() + segments[0].slice(1)
                  : "Dashboard";

                return (
                  <h2 className="text-xl font-bold">
                    {title}
                  </h2>
                );
              })()}
            </div>
            <ThemeToggle />
          </header>
          <div className="flex-1 p-6 mt-16">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}