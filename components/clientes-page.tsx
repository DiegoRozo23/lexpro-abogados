"use client"

import { useState } from "react"
import { Search, Plus, Building2, Mail, Phone, MapPin, FolderKanban, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { categoryColors, divisionColors, divisionMap, type Client } from "@/lib/demo-data"
import { useDemoStore } from "@/lib/demo-store"

const emptyClient: Omit<Client, "id"> = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  projectCount: 0,
}

export function ClientesPage() {
  const { clients, projects, addClient, updateClient, deleteClient } = useDemoStore()
  const [search, setSearch] = useState("")
  const [selectedClient, setSelectedClient] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [form, setForm] = useState(emptyClient)

  const filtered = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase())
  )

  const detail = selectedClient ? clients.find((c) => c.id === selectedClient) : null
  const detailProjects = detail ? projects.filter((p) => p.clientId === detail.id) : []

  function openCreate() {
    setEditingClient(null)
    setForm(emptyClient)
    setFormOpen(true)
  }

  function openEdit(client: Client) {
    setEditingClient(client)
    setForm({ name: client.name, contactName: client.contactName, email: client.email, phone: client.phone, address: client.address, projectCount: client.projectCount })
    setFormOpen(true)
  }

  function handleSave() {
    if (!form.name.trim()) return
    if (editingClient) {
      updateClient(editingClient.id, form)
    } else {
      addClient(form)
    }
    setFormOpen(false)
    setForm(emptyClient)
    setEditingClient(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-muted-foreground">Directorio de clientes del despacho</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
          <Plus className="h-4 w-4" />
          Nuevo Cliente
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar clientes..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((client) => (
          <Dialog key={client.id} onOpenChange={(open) => open && setSelectedClient(client.id)}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer transition-all hover:shadow-md hover:border-[hsl(40,60%,50%)]/40">
                <CardHeader className="flex-row items-start gap-4 pb-3">
                  <Avatar className="h-11 w-11 shrink-0">
                    <AvatarFallback className="bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] font-bold text-sm">
                      {client.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm leading-snug">{client.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">{client.contactName}</p>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2.5 pt-0">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {client.phone}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FolderKanban className="h-3.5 w-3.5" />
                      {projects.filter((p) => p.clientId === client.id).length} proyectos
                    </div>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            {detail && detail.id === client.id && (
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[hsl(216,50%,12%)]/10 text-[hsl(216,50%,12%)] font-bold">
                        {detail.name.split(" ").slice(0, 2).map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {detail.name}
                  </DialogTitle>
                  <DialogDescription>Informacion del cliente</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                      <Building2 className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contacto</p>
                        <p className="text-sm font-medium">{detail.contactName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Email</p>
                        <p className="text-sm font-medium">{detail.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Phone className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Telefono</p>
                        <p className="text-sm font-medium">{detail.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Direccion</p>
                        <p className="text-sm font-medium">{detail.address}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Proyectos Asociados ({detailProjects.length})</p>
                    <div className="space-y-2">
                      {detailProjects.map((project) => {
                        const division = divisionMap[project.category]
                        return (
                          <div key={project.id} className="flex items-center justify-between rounded-md border p-3 text-sm">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-xs">{project.name}</p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${divisionColors[division]}`}>
                                  {division}
                                </Badge>
                                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${categoryColors[project.category]}`}>
                                  {project.category}
                                </Badge>
                              </div>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0 ml-2">
                              {project.status}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Edit / Delete buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <DialogClose asChild>
                      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => openEdit(detail)}>
                        <Pencil className="h-3.5 w-3.5" /> Editar
                      </Button>
                    </DialogClose>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="gap-1.5">
                          <Trash2 className="h-3.5 w-3.5" /> Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar cliente?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Se eliminara &quot;{detail.name}&quot;. Esta accion no se puede deshacer.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => { deleteClient(detail.id); setSelectedClient(null) }}>
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </DialogContent>
            )}
          </Dialog>
        ))}
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingClient ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
            <DialogDescription>
              {editingClient ? "Modifica los datos del cliente" : "Agrega un nuevo cliente al directorio"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="client-name">Razon Social</Label>
              <Input id="client-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Empresa S.A. de C.V." />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-contact">Nombre de Contacto</Label>
              <Input id="client-contact" value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} placeholder="Lic. Juan Perez" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="client-email">Email</Label>
                <Input id="client-email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="email@empresa.com" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="client-phone">Telefono</Label>
                <Input id="client-phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+52 81 1234 5678" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client-address">Direccion</Label>
              <Input id="client-address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} placeholder="Av. Ejemplo 123, Ciudad" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleSave} className="bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]">
              {editingClient ? "Guardar Cambios" : "Crear Cliente"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
