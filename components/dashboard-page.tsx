"use client"

import {
  FolderKanban,
  ListTodo,
  AlertTriangle,
  Clock,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  users,
  categoryDistribution,
  divisionDistribution,
  weeklyHoursData,
  categoryColors,
  categoryBgColors,
  priorityColors,
  divisionColors,
  divisionMap,
  type Project,
} from "@/lib/demo-data"
import { useApp } from "@/lib/app-context"
import { useDemoStore } from "@/lib/demo-store"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color,
}: {
  title: string
  value: string | number
  subtitle: string
  icon: typeof FolderKanban
  trend?: string
  color: string
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {trend && (
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ProjectRow({ project }: { project: Project }) {
  const division = divisionMap[project.category]

  return (
    <div className="flex items-center gap-4 rounded-lg border p-3.5 transition-colors hover:shadow-sm" style={categoryBgColors[project.category]}>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-sm truncate">{project.name}</p>
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
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
        <p className="mt-1 text-xs text-muted-foreground">{project.clientName}</p>
      </div>
      {project.avance && (
        <div className="hidden sm:block flex-1 min-w-0">
          <p className="text-xs text-muted-foreground line-clamp-2">{project.avance}</p>
        </div>
      )}
      <div className="hidden md:block text-right shrink-0">
        <p className="text-xs text-muted-foreground">Vence</p>
        <p className="text-sm font-medium">{new Date(project.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}</p>
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { setCurrentPage } = useApp()
  const { projects, tasks, timeEntries } = useDemoStore()

  const upcomingTasks = tasks
    .filter((t) => t.status !== "Completada")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5)

  const totalHoursWeek = timeEntries.reduce((acc, te) => acc + te.hours, 0)
  const billableHoursWeek = timeEntries.filter((te) => te.billable).reduce((acc, te) => acc + te.hours, 0)
  const dashboardStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "Activo").length,
    totalTasks: tasks.length,
    pendingTasks: tasks.filter((t) => t.status === "Pendiente").length,
    overdueTasks: tasks.filter((t) => t.status === "Vencida").length,
    criticalTasks: tasks.filter((t) => t.priority === "Critica").length,
    totalClients: 6,
    hoursThisWeek: totalHoursWeek,
    billableHours: billableHoursWeek,
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Gerencial</h1>
        <p className="text-muted-foreground">LexPro — Vista general</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Proyectos Activos"
          value={dashboardStats.activeProjects}
          subtitle={`${dashboardStats.totalProjects} total`}
          icon={FolderKanban}
          color="bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)]"
        />
        <StatCard
          title="Tareas Pendientes"
          value={dashboardStats.pendingTasks}
          subtitle={`${dashboardStats.criticalTasks} criticas`}
          icon={ListTodo}
          color="bg-amber-100 text-amber-700"
        />
        <StatCard
          title="Tareas Vencidas"
          value={dashboardStats.overdueTasks}
          subtitle="Requieren atencion"
          icon={AlertTriangle}
          color="bg-red-100 text-red-700"
        />
        <StatCard
          title="Horas esta Semana"
          value={dashboardStats.hoursThisWeek}
          subtitle={`${dashboardStats.billableHours} facturables`}
          icon={Clock}
          trend="+12%"
          color="bg-emerald-100 text-emerald-700"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Division + Category Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Por Area</CardTitle>
            <CardDescription>Fiscal vs Corporativo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie
                  data={divisionDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {divisionDistribution.map((entry, i) => (
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
            <div className="flex justify-center gap-6 mt-1">
              {divisionDistribution.map((d) => (
                <div key={d.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-semibold">{d.value}</span>
                </div>
              ))}
            </div>
            {/* Subcategory breakdown */}
            <div className="mt-4 space-y-1.5">
              {categoryDistribution.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2 text-xs">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: cat.fill }} />
                  <span className="flex-1 text-muted-foreground truncate">{cat.name}</span>
                  <span className="font-medium">{cat.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Hours */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Horas por Abogado (Semana)</CardTitle>
            <CardDescription>Distribucion de carga de trabajo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weeklyHoursData}>
                <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Arturo" fill="#1a2744" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Maria" fill="#c5913a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Fernando" fill="#64748b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Projects & Tasks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Active Projects */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Proyectos Activos</CardTitle>
              <CardDescription>Progreso de proyectos</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setCurrentPage("proyectos")}>
              Ver todos
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {projects
              .filter((p) => p.status === "Activo")
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .slice(0, 5)
              .map((project) => (
                <ProjectRow key={project.id} project={project} />
              ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base">Proximas Tareas</CardTitle>
              <CardDescription>Ordenadas por vencimiento</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs" onClick={() => setCurrentPage("tareas")}>
              Ver todas
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {upcomingTasks.map((task) => {
              const isOverdue = new Date(task.dueDate) < new Date()
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 rounded-lg border p-3.5 transition-colors hover:bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm truncate">{task.title}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority]}`}>
                        {task.priority}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{task.projectName}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-muted">
                        {task.assignedToName.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                      <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-muted-foreground"}`}>
                        {new Date(task.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Team overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Equipo del Despacho</CardTitle>
          <CardDescription>Carga de trabajo actual</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {users
              .filter((u) => u.role === "abogado")
              .map((user) => {
                const userTasks = tasks.filter((t) => t.assignedTo === user.id)
                const pendingCount = userTasks.filter((t) => t.status !== "Completada").length
                const totalHours = userTasks.reduce((acc, t) => acc + t.hoursLogged, 0)
                return (
                  <div key={user.id} className="flex items-center gap-3 rounded-lg border p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] font-semibold text-sm">
                        {user.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name.replace("Lic. ", "")}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-muted-foreground">{pendingCount} pendientes</span>
                        <span className="text-xs text-muted-foreground">{totalHours}h registradas</span>
                      </div>
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
