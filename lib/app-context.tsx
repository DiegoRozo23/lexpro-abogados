"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { UserRole } from "./demo-data"

export type ViewName =
  | "login"
  | "dashboard"
  | "proyectos"
  | "project-detail"
  | "tareas"
  | "clientes"
  | "mi-panel"
  | "tiempos"
  | "notificaciones"
  | "task-detail"

export interface View {
  name: ViewName
  params?: any
  title?: string
}

interface AppState {
  navStack: View[]
  pushView: (view: View) => void
  goBack: () => void
  popTo: (index: number) => void
  navigateRoot: (name: ViewName) => void
  currentView: View

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
  const [navStack, setNavStack] = useState<View[]>([{ name: "login" }])
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("admin")
  const [currentUserId, setCurrentUserId] = useState("u1")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const pushView = (view: View) => {
    setNavStack((prev) => [...prev, view])
  }

  const goBack = () => {
    setNavStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }

  const popTo = (index: number) => {
    setNavStack((prev) => prev.slice(0, index + 1))
  }

  const navigateRoot = (name: ViewName) => {
    setNavStack([{ name }])
  }

  return (
    <AppContext.Provider
      value={{
        navStack,
        pushView,
        goBack,
        popTo,
        navigateRoot,
        currentView: navStack[navStack.length - 1],
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
