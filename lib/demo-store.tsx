"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import {
    clients as initialClients,
    projects as initialProjects,
    tasks as initialTasks,
    timeEntries as initialTimeEntries,
    notifications as initialNotifications,
    users,
    type Client,
    type Project,
    type Task,
    type TimeEntry,
    type Notification,
    type ProgressUpdate,
} from "./demo-data"

// ---------- helpers ----------
let _id = 100
function nextId(prefix: string) {
    _id++
    return `${prefix}${_id}`
}

// ---------- store interface ----------
interface DemoStore {
    // data
    clients: Client[]
    projects: Project[]
    tasks: Task[]
    timeEntries: TimeEntry[]

    // clients
    addClient: (c: Omit<Client, "id">) => void
    updateClient: (id: string, c: Partial<Client>) => void
    deleteClient: (id: string) => void

    // projects
    addProject: (p: Omit<Project, "id">) => void
    updateProject: (id: string, p: Partial<Project>) => void
    deleteProject: (id: string) => void

    // tasks
    addTask: (t: Omit<Task, "id">) => void
    updateTask: (id: string, t: Partial<Task>) => void
    deleteTask: (id: string) => void
    addProgressUpdate: (taskId: string, update: Omit<ProgressUpdate, "id">) => void

    // time entries
    addTimeEntry: (te: Omit<TimeEntry, "id">) => void
    updateTimeEntry: (id: string, te: Partial<TimeEntry>) => void
    deleteTimeEntry: (id: string) => void

    // notifications
    notifications: Notification[]
    markAsRead: (id: string) => void
    markAllAsRead: () => void
}

const DemoStoreContext = createContext<DemoStore | null>(null)

export function DemoStoreProvider({ children }: { children: ReactNode }) {
    const [clientsData, setClients] = useState<Client[]>(initialClients)
    const [projectsData, setProjects] = useState<Project[]>(initialProjects)
    const [tasksData, setTasks] = useState<Task[]>(initialTasks)
    const [timeEntriesData, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
    const [notificationsData, setNotifications] = useState<Notification[]>(initialNotifications)

    // ---- Clients ----
    const addClient = useCallback((c: Omit<Client, "id">) => {
        setClients((prev) => [...prev, { ...c, id: nextId("c") }])
    }, [])
    const updateClient = useCallback((id: string, c: Partial<Client>) => {
        setClients((prev) => prev.map((x) => (x.id === id ? { ...x, ...c } : x)))
    }, [])
    const deleteClient = useCallback((id: string) => {
        setClients((prev) => prev.filter((x) => x.id !== id))
    }, [])

    // ---- Projects ----
    const addProject = useCallback((p: Omit<Project, "id">) => {
        setProjects((prev) => [...prev, { ...p, id: nextId("p") }])
    }, [])
    const updateProject = useCallback((id: string, p: Partial<Project>) => {
        setProjects((prev) => prev.map((x) => (x.id === id ? { ...x, ...p } : x)))
    }, [])
    const deleteProject = useCallback((id: string) => {
        setProjects((prev) => prev.filter((x) => x.id !== id))
    }, [])

    // ---- Tasks ----
    const addTask = useCallback((t: Omit<Task, "id">) => {
        setTasks((prev) => [...prev, { ...t, id: nextId("t") }])
    }, [])
    const updateTask = useCallback((id: string, t: Partial<Task>) => {
        setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)))
    }, [])
    const deleteTask = useCallback((id: string) => {
        setTasks((prev) => prev.filter((x) => x.id !== id))
    }, [])

    const addProgressUpdate = useCallback((taskId: string, update: Omit<ProgressUpdate, "id">) => {
        setTasks((prev) => prev.map((t) => {
            if (t.id === taskId) {
                const newUpdate = { ...update, id: nextId("pu") }
                const updates = t.progressUpdates ? [...t.progressUpdates, newUpdate] : [newUpdate]
                return { ...t, progressUpdates: updates, avance: update.content }
            }
            return t
        }))
    }, [])

    // ---- Time Entries ----
    const addTimeEntry = useCallback((te: Omit<TimeEntry, "id">) => {
        setTimeEntries((prev) => [...prev, { ...te, id: nextId("te") }])
    }, [])
    const updateTimeEntry = useCallback((id: string, te: Partial<TimeEntry>) => {
        setTimeEntries((prev) => prev.map((x) => (x.id === id ? { ...x, ...te } : x)))
    }, [])
    const deleteTimeEntry = useCallback((id: string) => {
        setTimeEntries((prev) => prev.filter((x) => x.id !== id))
    }, [])

    // ---- Notifications ----
    const markAsRead = useCallback((id: string) => {
        setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
    }, [])

    const markAllAsRead = useCallback(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }, [])

    return (
        <DemoStoreContext.Provider
            value={{
                clients: clientsData,
                projects: projectsData,
                tasks: tasksData,
                timeEntries: timeEntriesData,
                addClient, updateClient, deleteClient,
                addProject, updateProject, deleteProject,
                addTask, updateTask, deleteTask, addProgressUpdate,
                addTimeEntry, updateTimeEntry, deleteTimeEntry,
                notifications: notificationsData, markAsRead, markAllAsRead,
            }}
        >
            {children}
        </DemoStoreContext.Provider>
    )
}

export function useDemoStore() {
    const ctx = useContext(DemoStoreContext)
    if (!ctx) throw new Error("useDemoStore must be used within DemoStoreProvider")
    return ctx
}
