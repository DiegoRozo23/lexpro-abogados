"use client"

import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Users,
  Clock,
  UserCircle,
  LogOut,
  Scale,
  Bell,
  X,
} from "lucide-react"
import { useApp, type Page } from "@/lib/app-context"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { users } from "@/lib/demo-data"
import { useDemoStore } from "@/lib/demo-store"
import { cn } from "@/lib/utils"

const adminNavItems: { label: string; page: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", page: "dashboard", icon: LayoutDashboard },
  { label: "Proyectos", page: "proyectos", icon: FolderKanban },
  { label: "Tareas", page: "tareas", icon: ListTodo },
  { label: "Clientes", page: "clientes", icon: Users },
  { label: "Registro de Tiempos", page: "tiempos", icon: Clock },
]

const abogadoNavItems: { label: string; page: Page; icon: typeof LayoutDashboard }[] = [
  { label: "Mi Panel", page: "mi-panel", icon: UserCircle },
  { label: "Tareas", page: "tareas", icon: ListTodo },
  { label: "Registro de Tiempos", page: "tiempos", icon: Clock },
]

export function AppSidebar() {
  const { currentPage, setCurrentPage, userRole, currentUserId, setIsLoggedIn, sidebarOpen, setSidebarOpen } = useApp()
  const { notifications } = useDemoStore()
  const navItems = userRole === "admin" ? adminNavItems : abogadoNavItems
  const currentUser = users.find((u) => u.id === currentUserId)!
  const unreadCount = notifications.filter((n) => !n.read && (!n.targetRole || n.targetRole === userRole)).length

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage("login")
    setSidebarOpen(false)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-[hsl(216,50%,8%)] text-sidebar-foreground transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header - Firm Branding */}
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(40,60%,50%)]">
            <Scale className="h-5 w-5 text-[hsl(216,50%,8%)]" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold tracking-tight text-[hsl(40,50%,80%)]">LexPro</h1>
            <p className="text-[10px] uppercase tracking-widest text-sidebar-foreground/50">Abogados</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground/60 hover:text-sidebar-foreground lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {userRole === "admin" ? "Administracion" : "Mi Espacio"}
          </p>
          {navItems.map((item) => {
            const isActive = currentPage === item.page
            return (
              <button
                key={item.page}
                onClick={() => {
                  setCurrentPage(item.page)
                  setSidebarOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-[hsl(40,50%,80%)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
                {item.page === "tareas" && (
                  <Badge
                    variant="secondary"
                    className="ml-auto bg-[hsl(40,60%,50%)]/20 text-[hsl(40,50%,80%)] text-xs px-1.5 py-0"
                  >
                    7
                  </Badge>
                )}
              </button>
            )
          })}

          <div className="pt-4">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
              Alertas
            </p>
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
              onClick={() => {
                setCurrentPage("notificaciones")
                setSidebarOpen(false)
              }}
            >
              <Bell className="h-[18px] w-[18px]" />
              Notificaciones
              {unreadCount > 0 && (
                <Badge className="ml-auto bg-red-600 text-red-50 text-xs px-1.5 py-0 hover:bg-red-600">
                  {unreadCount}
                </Badge>
              )}
            </button>
          </div>
        </nav>

        {/* User Section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-[hsl(40,50%,80%)] text-xs font-semibold">
                {currentUser.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="truncate text-xs text-sidebar-foreground/50">
                {userRole === "admin" ? "Admin" : "Abogado"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/50 hover:text-sidebar-foreground"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
