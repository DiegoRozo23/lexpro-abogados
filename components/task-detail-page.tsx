"use client"

import { useState } from "react"
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Timer, ArrowLeft, Pencil, Trash2, User, Plus, History } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useDemoStore } from "@/lib/demo-store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { statusColors, priorityColors } from "@/lib/demo-data"

export function TaskDetailPage({ id }: { id: string }) {
    const { tasks, deleteTask, addProgressUpdate } = useDemoStore()
    const { goBack, userRole } = useApp()
    const task = tasks.find((t) => t.id === id)

    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
    const [newUpdateContent, setNewUpdateContent] = useState("")
    const [newUpdateDate, setNewUpdateDate] = useState(new Date().toISOString().split('T')[0])

    if (!task) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">Tarea no encontrada</h2>
                <Button variant="link" onClick={goBack} className="mt-2">Volver</Button>
            </div>
        )
    }

    const handleDelete = () => {
        deleteTask(task.id)
        goBack()
    }

    const handleAddUpdate = () => {
        if (!newUpdateContent.trim()) return

        addProgressUpdate(task.id, {
            date: newUpdateDate,
            content: newUpdateContent,
            author: "Usuario Actual" // Should come from auth context in real app
        })
        setNewUpdateContent("")
        setIsUpdateDialogOpen(false)
    }

    const sortedUpdates = task.progressUpdates
        ? [...task.progressUpdates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        : []

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 -ml-2 mr-1" onClick={goBack}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-[hsl(216,50%,12%)]">{task.title}</h1>
                        <Badge variant="outline" className={statusColors[task.status]}>{task.status}</Badge>
                        <Badge variant="outline" className={priorityColors[task.priority]}>{task.priority}</Badge>
                    </div>
                    <p className="text-muted-foreground text-lg ml-9">{task.projectName}</p>
                </div>
                <div className="flex gap-2">
                    {userRole === "admin" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm" className="gap-1.5"><Trash2 className="h-3.5 w-3.5" /> Eliminar</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>¿Eliminar tarea?</AlertDialogTitle>
                                    <AlertDialogDescription>Se eliminara &quot;{task.title}&quot;. Esta accion no se puede deshacer.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Descripción</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task.description || "Sin descripción."}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-base flex items-center gap-2">
                                <History className="h-4 w-4" /> Historial de Progreso
                            </CardTitle>
                            <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline" className="gap-1">
                                        <Plus className="h-3.5 w-3.5" /> Agregar Avance
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Registrar Avance</DialogTitle>
                                        <DialogDescription>
                                            Describe el progreso realizado en esta tarea.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="date" className="text-right">Fecha</Label>
                                            <Input
                                                id="date"
                                                type="date"
                                                value={newUpdateDate}
                                                onChange={(e) => setNewUpdateDate(e.target.value)}
                                                className="col-span-3"
                                            />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="content" className="text-right">Detalle</Label>
                                            <Textarea
                                                id="content"
                                                value={newUpdateContent}
                                                onChange={(e) => setNewUpdateContent(e.target.value)}
                                                placeholder="Describe lo realizado..."
                                                className="col-span-3"
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button onClick={handleAddUpdate}>Guardar</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {sortedUpdates.length > 0 ? (
                                <div className="space-y-4">
                                    {sortedUpdates.map((update) => (
                                        <div key={update.id} className="flex gap-4 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                                            <div className="flex-none pt-0.5">
                                                <div className="h-2 w-2 mt-1.5 rounded-full bg-blue-500" />
                                            </div>
                                            <div className="space-y-1 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm font-medium leading-none">{update.author}</p>
                                                    <span className="text-xs text-muted-foreground">{new Date(update.date).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{update.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground text-sm">
                                    {task.avance ? (
                                        <div className="p-3 bg-muted/50 rounded-md text-left">
                                            <p className="text-xs font-semibold mb-1">Último estado registrado:</p>
                                            {task.avance}
                                        </div>
                                    ) : (
                                        <p>No hay avances registrados.</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Detalles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Asignado a</p>
                                <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[9px] bg-muted">
                                            {task.assignedToName.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{task.assignedToName}</span>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Fecha Limite</p>
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{new Date(task.dueDate).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</span>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Horas Registradas</p>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{task.hoursLogged}h</span>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-muted-foreground text-xs mb-1">Notificaciones</p>
                                {task.alerts.length > 0 ? (
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {task.alerts
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
