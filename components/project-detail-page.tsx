import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Timer, FileText, ArrowLeft, Pencil, Trash2 } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useDemoStore } from "@/lib/demo-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { TiemposPage } from "./tiempos-page"
import { TareasPage } from "./tareas-page"
import {
    statusColors,
    priorityColors,
    fiscalCategories,
    corporativoCategories,
    type Project,
    type ProjectCategory,
    type ProjectStatus,
    type Priority
} from "@/lib/demo-data"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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


export function ProjectDetailPage({ id }: { id: string }) {
    const { projects, clients, tasks, timeEntries, updateProject, deleteProject } = useDemoStore()
    const { goBack, pushView, userRole } = useApp()
    const project = projects.find((p) => p.id === id)
    const client = clients.find((c) => c.id === project?.clientId)

    const [isEditOpen, setIsEditOpen] = useState(false)
    const [form, setForm] = useState<Project | null>(null)

    useEffect(() => {
        if (project) {
            setForm(project)
        }
    }, [project])


    if (!project || !form) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">Proyecto no encontrado</h2>
                <Button variant="link" onClick={goBack} className="mt-2">Volver a Proyectos</Button>
            </div>
        )
    }

    const projectTasks = tasks.filter(t => t.projectId === id)
    const pendingTasks = projectTasks.filter(t => t.status !== "Completada" && t.status !== "Vencida").length
    const projectHours = timeEntries.filter(te => {
        const t = tasks.find(task => task.id === te.taskId)
        return (t && t.projectId === id) || te.projectName === project.name
    }).reduce((acc, te) => acc + te.hours, 0)

    function handleSave() {
        if (!form || !form.name.trim()) return
        const client = clients.find((c) => c.id === form.clientId)
        const finalForm = { ...form, clientName: client?.name || form.clientName }
        updateProject(project!.id, finalForm)
        setIsEditOpen(false)
    }

    function handleDelete() {
        deleteProject(project!.id)
        goBack()
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 mr-1" onClick={goBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-[hsl(216,50%,12%)]">{project.name}</h1>
                        <Badge variant="outline" className={statusColors[project.status as keyof typeof statusColors] || ""}>{project.status}</Badge>
                    </div>
                    <p className="text-muted-foreground text-lg ml-9">{client?.name || "Cliente desconocido"}</p>
                </div>
                <div className="flex gap-2">
                    {userRole === "admin" && (
                        <>
                            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2">
                                        <Pencil className="h-4 w-4" /> Editar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-lg">
                                    <DialogHeader>
                                        <DialogTitle>Editar Proyecto</DialogTitle>
                                        <DialogDescription>Modifica los datos del proyecto</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                                        <div className="grid gap-2">
                                            <Label>Nombre del Proyecto</Label>
                                            <Input value={form.name} onChange={(e) => setForm((f) => f && ({ ...f, name: e.target.value }))} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-2">
                                                <Label>Cliente</Label>
                                                <Select value={form.clientId} onValueChange={(v) => setForm((f) => f && ({ ...f, clientId: v }))}>
                                                    <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                                                    <SelectContent>
                                                        {clients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Categoria</Label>
                                                <Select value={form.category} onValueChange={(v) => setForm((f) => f && ({ ...f, category: v as ProjectCategory }))}>
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
                                                <Select value={form.priority} onValueChange={(v) => setForm((f) => f && ({ ...f, priority: v as Priority }))}>
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
                                                <Select value={form.status} onValueChange={(v) => setForm((f) => f && ({ ...f, status: v as ProjectStatus }))}>
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
                                                <Input type="date" value={form.dueDate} onChange={(e) => setForm((f) => f && ({ ...f, dueDate: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="grid gap-2">
                                                <Label>Juzgado (opcional)</Label>
                                                <Input value={form.juzgado || ""} onChange={(e) => setForm((f) => f && ({ ...f, juzgado: e.target.value }))} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Expediente (opcional)</Label>
                                                <Input value={form.expediente || ""} onChange={(e) => setForm((f) => f && ({ ...f, expediente: e.target.value }))} />
                                            </div>
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Descripcion</Label>
                                            <Textarea value={form.description} onChange={(e) => setForm((f) => f && ({ ...f, description: e.target.value }))} rows={2} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label>Avance</Label>
                                            <Textarea value={form.avance} onChange={(e) => setForm((f) => f && ({ ...f, avance: e.target.value }))} rows={3} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                                        <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)]">Guardar Cambios</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="gap-2">
                                        <Trash2 className="h-4 w-4" /> Eliminar
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Esta acción no se puede deshacer. Se eliminará el proyecto <strong>{project.name}</strong> y todos sus datos asociados.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                            Eliminar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    {/* Key Metrics / Modules */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card
                            className="hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-blue-500"
                            onClick={() => pushView({ name: "project-tasks", params: { projectId: project.id }, title: `Tareas - ${project.name}` })}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    Tareas
                                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projectTasks.length}</div>
                                <p className="text-xs text-muted-foreground">{pendingTasks} pendientes</p>
                            </CardContent>
                        </Card>

                        <Card
                            className="hover:bg-muted/50 cursor-pointer transition-colors border-l-4 border-l-amber-500"
                            onClick={() => pushView({ name: "project-times", params: { projectId: project.id }, title: `Tiempos - ${project.name}` })}
                        >
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
                                    Tiempos
                                    <Clock className="h-4 w-4 text-amber-500" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{projectHours}h</div>
                                <p className="text-xs text-muted-foreground">Total registrado</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.description || "Sin descripción."}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Detalles Adicionales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Juzgado</p>
                                    <p className="font-medium">{project.juzgado || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-xs mb-1">Expediente</p>
                                    <p className="font-medium">{project.expediente || "N/A"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Información</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Fecha de Inicio</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Fecha Limite</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(project.dueDate).toLocaleDateString()}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Equipo</p>
                                <div className="flex -space-x-2 overflow-hidden py-1">
                                    {project.team.slice(0, 4).map((memberId: string) => (
                                        <Avatar key={memberId} className="inline-block h-6 w-6 ring-2 ring-background">
                                            <AvatarFallback className="text-[9px] bg-muted">
                                                U
                                            </AvatarFallback>
                                        </Avatar>
                                    ))}
                                    {project.team.length > 4 && (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-background bg-muted text-[9px] font-medium text-muted-foreground">
                                            +{project.team.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                </div>
            </div >
        </div >
    )
}
