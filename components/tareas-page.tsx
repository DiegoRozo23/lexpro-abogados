"use client"

import { useState } from "react"
import { Search, Plus, Clock, AlertCircle, CheckCircle2, Circle, Timer, ArrowUpDown, Pencil, Trash2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  users,
  priorityColors,
  statusColors,
  priorityOrder,
  type TaskStatus,
  type Task,
  type TaskAlert,
  type Priority,
} from "@/lib/demo-data"
import { useApp } from "@/lib/app-context"
import { useDemoStore } from "@/lib/demo-store"

const statusIcon: Record<TaskStatus, typeof Circle> = {
  Pendiente: Circle,
  "En Progreso": Timer,
  Completada: CheckCircle2,
  Vencida: AlertCircle,
}

type SortOption = "vencimiento-asc" | "vencimiento-desc" | "prioridad-asc" | "prioridad-desc"

const emptyTask: Omit<Task, "id"> = {
  title: "",
  projectId: "",
  projectName: "",
  assignedTo: "",
  assignedToName: "",
  priority: "Media",
  status: "Pendiente",
  dueDate: new Date().toISOString().slice(0, 10),
  description: "",
  hoursLogged: 0,
  alerts: [],
  avance: "",
}

export function TareasPage({ projectId, isEmbedded }: { projectId?: string, isEmbedded?: boolean }) {
  const { userRole, pushView } = useApp()
  const { tasks, projects, addTask, updateTask, deleteTask } = useDemoStore()
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [statusTab, setStatusTab] = useState("all")
  const [sortBy, setSortBy] = useState<SortOption>("vencimiento-asc")
  const [formOpen, setFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Pre-fill projectId if embedded
  const defaultTask = { ...emptyTask, projectId: projectId || "" }
  const [form, setForm] = useState(defaultTask)
  const [detailTask, setDetailTask] = useState<Task | null>(null)

  const projectTasks = tasks.filter(t => !projectId || t.projectId === projectId)

  const filtered = projectTasks
    .filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.projectName.toLowerCase().includes(search.toLowerCase())
      const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter
      const matchesStatus = statusTab === "all" || t.status === statusTab
      return matchesSearch && matchesPriority && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "vencimiento-asc":
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case "vencimiento-desc":
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
        case "prioridad-asc":
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case "prioridad-desc":
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  function openCreate() {
    setEditingTask(null)
    setForm(defaultTask)
    setFormOpen(true)
  }

  function openEdit(task: Task) {
    setEditingTask(task)
    setForm({
      title: task.title,
      projectId: task.projectId,
      projectName: task.projectName,
      assignedTo: task.assignedTo,
      assignedToName: task.assignedToName,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      description: task.description,
      hoursLogged: task.hoursLogged,
      alerts: task.alerts,
      avance: task.avance || "",
    })
    setFormOpen(true)
    setDetailTask(null)
  }

  function handleSave() {
    if (!form.title.trim()) return
    const project = projects.find((p) => p.id === form.projectId)
    const user = users.find((u) => u.id === form.assignedTo)
    const finalForm = {
      ...form,
      projectName: project?.name || form.projectName,
      assignedToName: user ? user.name : form.assignedToName,
      avance: form.avance || "",
    }
    if (editingTask) {
      updateTask(editingTask.id, finalForm)
    } else {
      addTask(finalForm)
    }
    setFormOpen(false)
    setEditingTask(null)
  }

  const abogados = users.filter((u) => u.role === "abogado")

  const clearFilters = () => {
    setSearch("")
    setPriorityFilter("all")
    setStatusTab("all")
    setSortBy("vencimiento-asc")
  }

  return (
    <div className="space-y-6">
      {!isEmbedded && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tareas</h1>
            <p className="text-muted-foreground">Seguimiento de todas las tareas</p>
          </div>
          {userRole === "admin" && (
            <Button onClick={openCreate} className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
              <Plus className="h-4 w-4" />
              Nueva Tarea
            </Button>
          )}
        </div>
      )}

      {isEmbedded && userRole === "admin" && (
        <div className="flex justify-end">
          <Button onClick={openCreate} size="sm" className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px] w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar tareas..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Prioridad" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Prioridad: Todas</SelectItem>
            <SelectItem value="Critica">Critica</SelectItem>
            <SelectItem value="Alta">Alta</SelectItem>
            <SelectItem value="Media">Media</SelectItem>
            <SelectItem value="Baja">Baja</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-40">
            <ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vencimiento-asc">Vencimiento (proximo)</SelectItem>
            <SelectItem value="vencimiento-desc">Vencimiento (lejano)</SelectItem>
            <SelectItem value="prioridad-asc">Prioridad (mayor)</SelectItem>
            <SelectItem value="prioridad-desc">Prioridad (menor)</SelectItem>
          </SelectContent>
        </Select>
        {(search || priorityFilter !== "all" || statusTab !== "all") && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4 mr-1" /> Limpiar
          </Button>
        )}
      </div>

      {/* Status tabs */}
      <Tabs value={statusTab} onValueChange={setStatusTab}>
        <TabsList>
          <TabsTrigger value="all">Todas ({projectTasks.length})</TabsTrigger>
          <TabsTrigger value="Pendiente">Pendientes ({projectTasks.filter((t) => t.status === "Pendiente").length})</TabsTrigger>
          <TabsTrigger value="En Progreso">En Progreso ({projectTasks.filter((t) => t.status === "En Progreso").length})</TabsTrigger>
          <TabsTrigger value="Vencida">Vencidas ({projectTasks.filter((t) => t.status === "Vencida").length})</TabsTrigger>
          <TabsTrigger value="Completada">Completadas ({projectTasks.filter((t) => t.status === "Completada").length})</TabsTrigger>
        </TabsList>

        <TabsContent value={statusTab} className="mt-4">
          <div className="space-y-2">
            {filtered.length === 0 ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
                  No se encontraron tareas
                </CardContent>
              </Card>
            ) : (
              filtered.map((task) => {
                const IconComponent = statusIcon[task.status]
                const isOverdue = task.status === "Vencida"
                const daysLeft = Math.ceil(
                  (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <Card
                    key={task.id}
                    className={`transition-all hover:shadow-sm cursor-pointer ${isOverdue ? "border-red-200 bg-red-50/30" : ""}`}
                    onClick={() => pushView({ name: "task-detail", params: { id: task.id }, title: task.title })}
                  >
                    <CardContent className="flex items-center gap-4 p-4">
                      <div className={`shrink-0 ${isOverdue ? "text-red-500" : task.status === "Completada" ? "text-emerald-500" : task.status === "En Progreso" ? "text-sky-600" : "text-muted-foreground"}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-sm">{task.title}</p>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${priorityColors[task.priority]}`}>{task.priority}</Badge>
                          <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${statusColors[task.status]}`}>{task.status}</Badge>
                        </div>

                        <p className="mt-0.5 text-xs text-muted-foreground">{task.projectName}</p>
                        {task.avance && (
                          <div className="mt-2 text-xs bg-muted/50 p-1.5 rounded border border-muted-foreground/10">
                            <span className="font-medium text-muted-foreground">Progreso: </span>
                            {task.avance}
                          </div>
                        )}
                      </div>

                      <div className="hidden sm:flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-[10px] bg-muted">
                              {task.assignedToName.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">{task.assignedToName.split(" ")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {task.hoursLogged}h
                        </div>
                        <div className="text-right w-20">
                          <p className={`text-xs font-medium ${isOverdue ? "text-red-600" : daysLeft <= 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                            {new Date(task.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                          </p>
                          {!isOverdue && task.status !== "Completada" && (
                            <p className={`text-[10px] ${daysLeft <= 3 ? "text-amber-600" : "text-muted-foreground"}`}>
                              {daysLeft > 0 ? `${daysLeft} dias` : "Hoy"}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Detail dialog */}
      <Dialog open={!!detailTask} onOpenChange={(open) => !open && setDetailTask(null)}>
        {detailTask && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{detailTask.title}</DialogTitle>
              <DialogDescription>{detailTask.projectName}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className={priorityColors[detailTask.priority]}>{detailTask.priority}</Badge>
                <Badge variant="outline" className={statusColors[detailTask.status]}>{detailTask.status}</Badge>
              </div>
              <p className="text-muted-foreground">{detailTask.description}</p>
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Asignado a</p><p className="font-medium">{detailTask.assignedToName}</p></div>
                <div><p className="text-xs text-muted-foreground">Fecha Limite</p><p className="font-medium">{new Date(detailTask.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p></div>
                <div><p className="text-xs text-muted-foreground">Horas Registradas</p><p className="font-medium">{detailTask.hoursLogged}h</p></div>
              </div>
              {detailTask.avance && (
                <div>
                  <p className="text-xs text-muted-foreground">Progreso Actual</p>
                  <p className="text-sm bg-muted p-2 rounded-md mt-1">{detailTask.avance}</p>
                </div>
              )}
              <div className="rounded-md bg-muted/60 p-3 space-y-1.5">
                <p className="text-xs font-medium text-muted-foreground">Notificaciones configuradas</p>
                {detailTask.alerts.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {detailTask.alerts
                      .sort((a, b) => new Date(a.date + "T" + a.time).getTime() - new Date(b.date + "T" + b.time).getTime())
                      .map((alert, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] px-2 py-0.5">
                          {new Date(alert.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })} - {alert.time}h
                        </Badge>
                      ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">Sin notificaciones</p>
                )}
              </div>
              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(detailTask)}>
                  <Pencil className="h-3.5 w-3.5" /> {userRole === "admin" ? "Editar" : "Actualizar Avance"}
                </Button>
                {userRole === "admin" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm" className="gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Eliminar</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                        <AlertDialogDescription>Se eliminara &quot;{detailTask.title}&quot;. Esta accion no se puede deshacer.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { deleteTask(detailTask.id); setDetailTask(null) }}>Eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          {userRole === "admin" ? (
            <>
              <DialogHeader>
                <DialogTitle>{editingTask ? "Editar Tarea" : "Nueva Tarea"}</DialogTitle>
                <DialogDescription>{editingTask ? "Modifica los datos de la tarea" : "Crea una nueva tarea"}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                <div className="grid gap-2">
                  <Label>Titulo</Label>
                  <Input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Preparar escrito..." />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-2">
                    <Label>Proyecto</Label>
                    <Select value={form.projectId || undefined} onValueChange={(v) => {
                      const proj = projects.find((p) => p.id === v)
                      setForm((f) => ({ ...f, projectId: v, projectName: proj?.name ?? "" }))
                    }}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (<SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Asignar a</Label>
                    <Select value={form.assignedTo || undefined} onValueChange={(v) => {
                      const user = users.find((u) => u.id === v)
                      setForm((f) => ({ ...f, assignedTo: v, assignedToName: user?.name ?? "" }))
                    }}>
                      <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                      <SelectContent>
                        {abogados.map((u) => (<SelectItem key={u.id} value={u.id}>{u.name.replace("Lic. ", "")}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="grid gap-2">
                    <Label>Prioridad</Label>
                    <Select value={form.priority} onValueChange={(v) => setForm((f) => ({ ...f, priority: v as Priority }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Critica">Critica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Estatus</Label>
                    <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as TaskStatus }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En Progreso">En Progreso</SelectItem>
                        <SelectItem value="Completada">Completada</SelectItem>
                        <SelectItem value="Vencida">Vencida</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Fecha Limite</Label>
                    <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Descripcion</Label>
                  <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descripcion de la tarea..." rows={2} />
                </div>
                <div className="grid gap-2">
                  <Label>Progreso / Avance</Label>
                  <Textarea value={form.avance} onChange={(e) => setForm((f) => ({ ...f, avance: e.target.value }))} placeholder="Escribe el avance actual..." rows={2} className="bg-muted/30" />
                </div>
                <div className="grid gap-2">
                  <Label>Alertas de Notificacion</Label>
                  <p className="text-xs text-muted-foreground">Configura fecha y hora para cada notificacion</p>
                  <div className="space-y-2">
                    {form.alerts.map((alert, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={alert.date}
                          onChange={(e) => {
                            const newAlerts = [...form.alerts]
                            newAlerts[index] = { ...newAlerts[index], date: e.target.value }
                            setForm((f) => ({ ...f, alerts: newAlerts }))
                          }}
                          className="flex-1"
                        />
                        <Input
                          type="time"
                          value={alert.time}
                          onChange={(e) => {
                            const newAlerts = [...form.alerts]
                            newAlerts[index] = { ...newAlerts[index], time: e.target.value }
                            setForm((f) => ({ ...f, alerts: newAlerts }))
                          }}
                          className="w-28"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-8 w-8 p-0"
                          onClick={() => {
                            setForm((f) => ({ ...f, alerts: f.alerts.filter((_, i) => i !== index) }))
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs"
                      onClick={() => {
                        setForm((f) => ({ ...f, alerts: [...f.alerts, { date: f.dueDate, time: "09:00" }] }))
                      }}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Agregar Alerta
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
                  {editingTask ? "Guardar Cambios" : "Crear Tarea"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Actualizar Avance</DialogTitle>
                <DialogDescription>{editingTask?.title}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="grid gap-2">
                  <Label>Progreso / Avance</Label>
                  <Textarea
                    value={form.avance}
                    onChange={(e) => setForm((f) => ({ ...f, avance: e.target.value }))}
                    placeholder="Escribe el avance actual..."
                    rows={6}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
                <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
                  Guardar Avance
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
