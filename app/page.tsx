"use client"

import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppProvider, useApp } from "@/lib/app-context"
import { DemoStoreProvider } from "@/lib/demo-store"
import { AppSidebar } from "@/components/app-sidebar"
import { LoginPage } from "@/components/login-page"
import { DashboardPage } from "@/components/dashboard-page"
import { ProyectosPage } from "@/components/proyectos-page"
import { TareasPage } from "@/components/tareas-page"
import { ClientesPage } from "@/components/clientes-page"
import { MiPanelPage } from "@/components/mi-panel-page"
import { TiemposPage } from "@/components/tiempos-page"

import { NotificationsPage } from "@/components/notifications-page"

function AppContent() {
  const { isLoggedIn, currentPage, setSidebarOpen } = useApp()

  if (!isLoggedIn) {
    return <LoginPage />
  }

  const pageMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardPage />,
    proyectos: <ProyectosPage />,
    tareas: <TareasPage />,
    clientes: <ClientesPage />,
    "mi-panel": <MiPanelPage />,
    tiempos: <TiemposPage />,
    notificaciones: <NotificationsPage />,
  }

  const pageTitles: Record<string, string> = {
    dashboard: "Dashboard",
    proyectos: "Proyectos",
    tareas: "Tareas",
    clientes: "Clientes",
    "mi-panel": "Mi Panel",
    tiempos: "Tiempos",
    notificaciones: "Notificaciones",
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <main className="flex-1 overflow-y-auto">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
          <h2 className="font-semibold">{pageTitles[currentPage] || "LexPro"}</h2>
        </header>
        <div className="p-4 lg:p-8">
          {pageMap[currentPage] || <DashboardPage />}
        </div>
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <DemoStoreProvider>
        <AppContent />
      </DemoStoreProvider>
    </AppProvider>
  )
}
