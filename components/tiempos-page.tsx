"use client"

import { useState } from "react"
import { Plus, Clock, DollarSign, Search, Calendar, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { useApp } from "@/lib/app-context"
import { users, type TimeEntry } from "@/lib/demo-data"
import { useDemoStore } from "@/lib/demo-store"

const emptyEntry: Omit<TimeEntry, "id"> = {
  taskId: "",
  taskTitle: "",
  projectName: "",
  userId: "",
  userName: "",
  date: new Date().toISOString().slice(0, 10),
  hours: 1,
  billable: true,
  description: "",
}

export function TiemposPage({ projectId, isEmbedded }: { projectId?: string, isEmbedded?: boolean }) {
  const { userRole, currentUserId } = useApp()
  const { timeEntries, tasks, projects, addTimeEntry, updateTimeEntry, deleteTimeEntry } = useDemoStore()
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null)

  // Pre-fill projectId if embedded (indirectly via task selection)
  const [form, setForm] = useState(emptyEntry)

  const allEntries =
    userRole === "admin"
      ? timeEntries
      : timeEntries.filter((te) => te.userId === currentUserId)

  const entries = projectId
    ? allEntries.filter(te => {
      const task = tasks.find(t => t.id === te.taskId)
      return task?.projectId === projectId || te.projectName === projects.find(p => p.id === projectId)?.name
    })
    : allEntries

  const filtered = entries.filter(
    (te) =>
      te.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      te.projectName.toLowerCase().includes(search.toLowerCase()) ||
      te.userName.toLowerCase().includes(search.toLowerCase())
  )

  const totalHours = filtered.reduce((acc, te) => acc + te.hours, 0)
  const billableHours = filtered.filter((te) => te.billable).reduce((acc, te) => acc + te.hours, 0)
  const nonBillableHours = totalHours - billableHours

  const userSummary = userRole === "admin"
    ? users
      .filter((u) => u.role === "abogado")
      .map((u) => {
        const userEntries = timeEntries.filter((te) => te.userId === u.id)
        const total = userEntries.reduce((acc, te) => acc + te.hours, 0)
        const billable = userEntries.filter((te) => te.billable).reduce((acc, te) => acc + te.hours, 0)
        return { ...u, total, billable }
      })
    : []

  function openCreate() {
    setEditingEntry(null)
    const currentUser = users.find((u) => u.id === currentUserId)
    setForm({ ...emptyEntry, userId: currentUserId, userName: currentUser ? currentUser.name.replace("Lic. ", "") : "" })
    setFormOpen(true)
  }

  function openEdit(entry: TimeEntry) {
    setEditingEntry(entry)
    setForm({
      taskId: entry.taskId,
      taskTitle: entry.taskTitle,
      projectName: entry.projectName,
      userId: entry.userId,
      userName: entry.userName,
      date: entry.date,
      hours: entry.hours,
      billable: entry.billable,
      description: entry.description,
    })
    setFormOpen(true)
  }

  function handleSave() {
    if (!form.taskId || form.hours <= 0) return
    const task = tasks.find((t) => t.id === form.taskId)
    const user = users.find((u) => u.id === form.userId)
    const finalForm = {
      ...form,
      taskTitle: task?.title || form.taskTitle,
      projectName: task?.projectName || form.projectName,
      userName: user ? user.name.replace("Lic. ", "") : form.userName,
    }
    if (editingEntry) {
      updateTimeEntry(editingEntry.id, finalForm)
    } else {
      addTimeEntry(finalForm)
    }
    setFormOpen(false)
    setEditingEntry(null)
  }

  const abogados = users.filter((u) => u.role === "abogado")

  return (
    <div className="space-y-6">
      {!isEmbedded && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Registro de Tiempos</h1>
            <p className="text-muted-foreground">
              {userRole === "admin" ? "Horas registradas por el equipo" : "Mis horas registradas"}
            </p>
          </div>
          {userRole === "abogado" && (
            <Button onClick={openCreate} className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
              <Plus className="h-4 w-4" />
              Registrar Horas
            </Button>
          )}
        </div>
      )}

      {isEmbedded && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Historial de Horas</h3>
          <Button onClick={openCreate} size="sm" className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
            <Plus className="h-4 w-4" />
            Registrar Horas
          </Button>
        </div>
      )}

      {/* Summary Cards */}
      {!isEmbedded && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHours}h</p>
                <p className="text-xs text-muted-foreground">Total Horas</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 shrink-0">
                <DollarSign className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{billableHours}h</p>
                <p className="text-xs text-muted-foreground">Facturables</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted text-muted-foreground shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{nonBillableHours}h</p>
                <p className="text-xs text-muted-foreground">No Facturables</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Admin: Per-user summary */}
      {userRole === "admin" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Resumen por Abogado</CardTitle>
            <CardDescription>Horas acumuladas esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {userSummary.map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-lg border p-4">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] text-xs font-semibold">
                      {u.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{u.name.replace("Lic. ", "")}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-muted-foreground">{u.total}h total</span>
                      <span className="text-xs text-emerald-600">{u.billable}h facturables</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Buscar registros..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Proyecto</TableHead>
                  {userRole === "admin" && <TableHead>Abogado</TableHead>}
                  <TableHead className="text-right">Horas</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Descripcion</TableHead>
                  <TableHead className="w-20">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="whitespace-nowrap text-sm">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {new Date(entry.date).toLocaleDateString("es-MX", { day: "2-digit", month: "short" })}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm max-w-[200px] truncate">{entry.taskTitle}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[160px] truncate">{entry.projectName}</TableCell>
                      {userRole === "admin" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-[10px] bg-muted">
                                {entry.userName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm whitespace-nowrap">{entry.userName.split(" ")[0]}</span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell className="text-right font-medium text-sm">{entry.hours}h</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={entry.billable ? "bg-emerald-100 text-emerald-800 border-emerald-200 text-xs" : "text-xs"}>
                          {entry.billable ? "Facturable" : "No Facturable"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground max-w-[200px] truncate">{entry.description}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(entry)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
                                <AlertDialogDescription>Se eliminara el registro de {entry.hours}h en &quot;{entry.taskTitle}&quot;.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteTimeEntry(entry.id)}>Eliminar</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingEntry ? "Editar Registro" : "Registrar Horas"}</DialogTitle>
            <DialogDescription>{editingEntry ? "Modifica el registro de tiempo" : "Registra horas trabajadas"}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label>Tarea</Label>
              <Select value={form.taskId} onValueChange={(v) => setForm((f) => ({ ...f, taskId: v }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar tarea" /></SelectTrigger>
                <SelectContent>
                  {tasks
                    .filter(t => !projectId || t.projectId === projectId)
                    .map((t) => (<SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>))
                  }
                </SelectContent>
              </Select>
            </div>
            {userRole === "admin" && (
              <div className="grid gap-2">
                <Label>Abogado</Label>
                <Select value={form.userId} onValueChange={(v) => setForm((f) => ({ ...f, userId: v }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    {abogados.map((u) => (<SelectItem key={u.id} value={u.id}>{u.name.replace("Lic. ", "")}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Fecha</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
              </div>
              <div className="grid gap-2">
                <Label>Horas</Label>
                <Input type="number" step="0.5" min="0.5" value={form.hours} onChange={(e) => setForm((f) => ({ ...f, hours: parseFloat(e.target.value) || 0 }))} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.billable} onCheckedChange={(v) => setForm((f) => ({ ...f, billable: v }))} id="billable" />
              <Label htmlFor="billable">Facturable</Label>
            </div>
            <div className="grid gap-2">
              <Label>Descripcion</Label>
              <Textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Que se realizo..." rows={2} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancelar</Button></DialogClose>
            <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
              {editingEntry ? "Guardar Cambios" : "Registrar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
