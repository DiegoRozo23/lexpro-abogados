"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { UserRole } from "./demo-data"

export type Page =
  | "login"
  | "dashboard"
  | "proyectos"
  | "tareas"
  | "clientes"
  | "mi-panel"
  | "tiempos"
  | "notificaciones"

interface AppState {
  currentPage: Page
  setCurrentPage: (page: Page) => void
  isLoggedIn: boolean
  setIsLoggedIn: (v: boolean) => void
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  currentUserId: string
  setCurrentUserId: (id: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<Page>("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("admin")
  const [currentUserId, setCurrentUserId] = useState("u1")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        currentUserId,
        setCurrentUserId,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error("useApp must be used within AppProvider")
  return ctx
}
