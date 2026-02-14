"use client"

import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ListTodo,
  Timer,
  Circle,
  AlertCircle,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useApp } from "@/lib/app-context"
import {
  users,
  priorityColors,
  categoryColors,
  categoryBgColors,
  divisionColors,
  divisionMap,
  type TaskStatus,
} from "@/lib/demo-data"
import { useDemoStore } from "@/lib/demo-store"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const statusIcon: Record<TaskStatus, typeof Circle> = {
  Pendiente: Circle,
  "En Progreso": Timer,
  Completada: CheckCircle2,
  Vencida: AlertCircle,
}

export function MiPanelPage() {
  const { currentUserId } = useApp()
  const { tasks, timeEntries, projects } = useDemoStore()
  const currentUser = users.find((u) => u.id === currentUserId)!

  const myTasks = tasks.filter((t) => t.assignedTo === currentUserId)
  const pendingTasks = myTasks.filter((t) => t.status !== "Completada").sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  )
  const overdueTasks = myTasks.filter((t) => t.status === "Vencida")
  const inProgressTasks = myTasks.filter((t) => t.status === "En Progreso")
  const completedTasks = myTasks.filter((t) => t.status === "Completada")

  const myTimeEntries = timeEntries.filter((te) => te.userId === currentUserId)
  const totalHours = myTimeEntries.reduce((acc, te) => acc + te.hours, 0)
  const billableHours = myTimeEntries.filter((te) => te.billable).reduce((acc, te) => acc + te.hours, 0)

  const myProjects = projects.filter((p) => p.assignedTo.includes(currentUserId))

  const taskStatusData = [
    { name: "Pendientes", value: myTasks.filter((t) => t.status === "Pendiente").length, fill: "#64748b" },
    { name: "En Progreso", value: inProgressTasks.length, fill: "#0ea5e9" },
    { name: "Completadas", value: completedTasks.length, fill: "#10b981" },
    { name: "Vencidas", value: overdueTasks.length, fill: "#ef4444" },
  ].filter((d) => d.value > 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mi Panel</h1>
        <p className="text-muted-foreground">Bienvenido, {currentUser.name.replace("Lic. ", "")}</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingTasks.length}</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{overdueTasks.length}</p>
              <p className="text-xs text-muted-foreground">Vencidas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalHours}h</p>
              <p className="text-xs text-muted-foreground">Horas Semana</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{billableHours}h</p>
              <p className="text-xs text-muted-foreground">Facturables</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* My Tasks */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mis Pendientes</CardTitle>
            <CardDescription>Ordenados por fecha de vencimiento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingTasks.map((task) => {
              const IconComponent = statusIcon[task.status]
              const isOverdue = task.status === "Vencida"
              const daysLeft = Math.ceil(
                (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              )

              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 rounded-lg border p-3.5 transition-colors hover:bg-muted/50 ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}
                >
                  <div className={`shrink-0 ${isOverdue ? "text-red-500" : task.status === "En Progreso" ? "text-sky-600" : "text-muted-foreground"}`}>
                    <IconComponent className="h-[18px] w-[18px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">{task.title}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{task.projectName}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : daysLeft <= 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                      {new Date(task.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                    </p>
                    {!isOverdue && (
                      <p className={`text-[10px] ${daysLeft <= 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                        {daysLeft > 0 ? `${daysLeft} dias` : "Hoy"}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Status Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Estado de Tareas</CardTitle>
            <CardDescription>{myTasks.length} tareas asignadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {taskStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {taskStatusData.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="ml-auto font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Projects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Mis Proyectos</CardTitle>
          <CardDescription>Proyectos asignados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {myProjects.map((project) => {
              const division = divisionMap[project.category]
              return (
                <div key={project.id} className="rounded-lg border p-4 space-y-3" style={categoryBgColors[project.category]}>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${divisionColors[division]}`}>
                      {division}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[project.category]}`}>
                      {project.category}
                    </Badge>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[project.priority]}`}>
                      {project.priority}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{project.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{project.clientName}</p>
                  </div>
                  {project.avance && (
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Avance</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{project.avance}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Vence: {new Date(project.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
