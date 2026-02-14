"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Calendar,
  ArrowUpDown,
  Pencil,
  Trash2,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  categoryColors,
  categoryBgColors,
  priorityColors,
  divisionColors,
  divisionMap,
  fiscalCategories,
  corporativoCategories,
  allCategories,
  priorityOrder,
  statusColors,
  type MainDivision,
  type Project,
  type ProjectCategory,
  type ProjectStatus,
  type Priority,
} from "@/lib/demo-data"
import { useDemoStore } from "@/lib/demo-store"

type SortOption = "vencimiento-asc" | "vencimiento-desc" | "prioridad-asc" | "prioridad-desc"

const emptyProject: Omit<Project, "id"> = {
  name: "",
  clientId: "",
  clientName: "",
  category: "Litigio Fiscal",
  status: "Activo",
  priority: "Media",
  assignedTo: [],
  dueDate: new Date().toISOString().slice(0, 10),
  description: "",
  avance: "",
}

export function ProyectosPage() {
  const { projects, clients, tasks, addProject, updateProject, deleteProject } = useDemoStore()
  const [search, setSearch] = useState("")
  const [divisionFilter, setDivisionFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<SortOption>("vencimiento-asc")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [form, setForm] = useState(emptyProject)

  const filtered = projects
    .filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.clientName.toLowerCase().includes(search.toLowerCase())
      const division = divisionMap[p.category]
      const matchesDivision = divisionFilter === "all" || division === divisionFilter
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter
      return matchesSearch && matchesDivision && matchesCategory
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

  const detail = selectedProject ? projects.find((p) => p.id === selectedProject) : null
  const detailTasks = detail ? tasks.filter((t) => t.projectId === detail.id) : []

  const handleDivisionChange = (val: string) => {
    setDivisionFilter(val)
    setCategoryFilter("all")
  }

  function openCreate() {
    setEditingProject(null)
    setForm(emptyProject)
    setFormOpen(true)
  }

  function openEdit(project: Project) {
    setEditingProject(project)
    setForm({
      name: project.name,
      clientId: project.clientId,
      clientName: project.clientName,
      category: project.category,
      status: project.status,
      priority: project.priority,
      assignedTo: project.assignedTo,
      dueDate: project.dueDate,
      juzgado: project.juzgado,
      expediente: project.expediente,
      description: project.description,
      avance: project.avance,
    })
    setFormOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    // auto-resolve clientName
    const client = clients.find((c) => c.id === form.clientId)
    const finalForm = { ...form, clientName: client?.name || form.clientName }
    if (editingProject) {
      updateProject(editingProject.id, finalForm)
    } else {
      addProject(finalForm)
    }
    setFormOpen(false)
    setEditingProject(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proyectos</h1>
          <p className="text-muted-foreground">Gestion de proyectos del despacho</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
          <Plus className="h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar proyectos..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={divisionFilter} onValueChange={handleDivisionChange}>
          <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Division" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Areas</SelectItem>
            <SelectItem value="Fiscal">Fiscal</SelectItem>
            <SelectItem value="Corporativo">Corporativo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Subcategoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las Categorias</SelectItem>
            {(divisionFilter === "all" || divisionFilter === "Fiscal") && (
              <SelectGroup>
                <SelectLabel>Fiscal</SelectLabel>
                {fiscalCategories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectGroup>
            )}
            {(divisionFilter === "all" || divisionFilter === "Corporativo") && (
              <SelectGroup>
                <SelectLabel>Corporativo</SelectLabel>
                {corporativoCategories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger className="w-full sm:w-52">
            <ArrowUpDown className="mr-2 h-4 w-4" /><SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vencimiento-asc">Vencimiento (proximo)</SelectItem>
            <SelectItem value="vencimiento-desc">Vencimiento (lejano)</SelectItem>
            <SelectItem value="prioridad-asc">Prioridad (mayor)</SelectItem>
            <SelectItem value="prioridad-desc">Prioridad (menor)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((project) => {
          const assigned = users.filter((u) => project.assignedTo.includes(u.id))
          const division = divisionMap[project.category]
          const daysLeft = Math.ceil((new Date(project.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

          return (
            <Dialog key={project.id} onOpenChange={(open) => open && setSelectedProject(project.id)}>
              <DialogTrigger asChild>
                <Card className="cursor-pointer transition-all hover:shadow-md" style={categoryBgColors[project.category]}>
                  <CardHeader className="flex-row items-start justify-between gap-3 pb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${divisionColors[division]}`}>{division}</Badge>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[project.category]}`}>{project.category}</Badge>
                      </div>
                      <CardTitle className="text-sm leading-snug">{project.name}</CardTitle>
                    </div>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 shrink-0 ${priorityColors[project.priority]}`}>{project.priority}</Badge>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">{project.clientName}</p>
                    {project.juzgado && (
                      <div className="rounded-md bg-muted/60 p-2.5 text-xs space-y-0.5">
                        <p className="text-muted-foreground">Juzgado: <span className="font-medium text-foreground">{project.juzgado}</span></p>
                        <p className="text-muted-foreground">Expediente: <span className="font-medium text-foreground">{project.expediente}</span></p>
                      </div>
                    )}
                    {project.avance && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Avance</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{project.avance}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {assigned.map((u) => (
                          <Avatar key={u.id} className="h-7 w-7 border-2 border-card">
                            <AvatarFallback className="text-[10px] bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] font-semibold">{u.avatar}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className={daysLeft <= 7 ? (daysLeft <= 3 ? "text-red-600 font-medium" : "text-amber-600 font-medium") : "text-muted-foreground"}>
                          {new Date(project.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </DialogTrigger>

              {detail && detail.id === project.id && (
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={divisionColors[divisionMap[detail.category]]}>{divisionMap[detail.category]}</Badge>
                      <Badge variant="outline" className={categoryColors[detail.category]}>{detail.category}</Badge>
                      <Badge variant="outline" className={priorityColors[detail.priority]}>{detail.priority}</Badge>
                    </div>
                    <DialogTitle className="text-lg">{detail.name}</DialogTitle>
                    <DialogDescription>{detail.description}</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground text-xs">Cliente</p><p className="font-medium">{detail.clientName}</p></div>
                      <div><p className="text-muted-foreground text-xs">Fecha Limite</p><p className="font-medium">{new Date(detail.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</p></div>
                      {detail.juzgado && (
                        <>
                          <div><p className="text-muted-foreground text-xs">Juzgado</p><p className="font-medium">{detail.juzgado}</p></div>
                          <div><p className="text-muted-foreground text-xs">No. Expediente</p><p className="font-medium">{detail.expediente}</p></div>
                        </>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Tareas ({detailTasks.length})</p>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {detailTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between rounded-md border p-2.5 text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-xs">{task.title}</p>
                              <p className="text-xs text-muted-foreground">{task.assignedToName}</p>
                            </div>
                            <Badge variant="outline" className={`text-xs ${statusColors[task.status]}`}>{task.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Edit / Delete */}
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <DialogClose asChild>
                        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(detail)}>
                          <Pencil className="h-3.5 w-3.5" /> Editar
                        </Button>
                      </DialogClose>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Eliminar</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                            <AlertDialogDescription>Se eliminara &quot;{detail.name}&quot;. Esta accion no se puede deshacer.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => { deleteProject(detail.id); setSelectedProject(null) }}>Eliminar</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </DialogContent>
              )}
            </Dialog>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12 text-muted-foreground">
            No se encontraron proyectos con los filtros seleccionados.
          </CardContent>
        </Card>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
            <DialogDescription>{editingProject ? "Modifica los datos del proyecto" : "Crea un nuevo proyecto"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
            <div className="grid gap-2">
              <Label>Nombre del Proyecto</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Recurso de Revocacion..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Cliente</Label>
                <Select value={form.clientId} onValueChange={(v) => setForm((f) => ({ ...f, clientId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Categoria</Label>
                <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v as ProjectCategory }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Fiscal</SelectLabel>
                      {fiscalCategories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Corporativo</SelectLabel>
                      {corporativoCategories.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                    </SelectGroup>
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
                <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v as ProjectStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Activo">Activo</SelectItem>
                    <SelectItem value="En Espera">En Espera</SelectItem>
                    <SelectItem value="Completado">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Fecha Limite</Label>
                <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Juzgado (opcional)</Label>
                <Input value={form.juzgado || ""} onChange={(e) => setForm((f) => ({ ...f, juzgado: e.target.value }))} placeholder="TFJA - Sala..." />
              </div>
              <div className="grid gap-2">
                <Label>Expediente (opcional)</Label>
                <Input value={form.expediente || ""} onChange={(e) => setForm((f) => ({ ...f, expediente: e.target.value }))} placeholder="RF-1234/2025" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Descripcion</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Descripcion del proyecto..." rows={2} />
            </div>
            <div className="grid gap-2">
              <Label>Avance</Label>
              <Textarea value={form.avance} onChange={(e) => setForm((f) => ({ ...f, avance: e.target.value }))} placeholder="Registro textual del progreso del proyecto..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
              {editingProject ? "Guardar Cambios" : "Crear Proyecto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
