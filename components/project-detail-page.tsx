"use client"

import { useState } from "react"
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Timer, FileText, ArrowLeft } from "lucide-react"
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
import { statusColors } from "@/lib/demo-data"

export function ProjectDetailPage({ id }: { id: string }) {
    const { projects, clients } = useDemoStore()
    const { goBack } = useApp()
    const project = projects.find((p) => p.id === id)
    const client = clients.find((c) => c.id === project?.clientId)

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertCircle className="h-10 w-10 text-muted-foreground mb-4" />
                <h2 className="text-lg font-semibold">Proyecto no encontrado</h2>
                <Button variant="link" onClick={goBack} className="mt-2">Volver a Proyectos</Button>
            </div>
        )
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
                    {/* Actions like Edit Project could go here */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Sidebar / Info */}
                <div className="md:col-span-1 space-y-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">Detalles</CardTitle>
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

                {/* Main Content Tabs */}
                <div className="md:col-span-3">
                    <Tabs defaultValue="tareas" className="w-full">
                        <TabsList className="bg-muted/40 p-1 mb-4 h-auto w-full justify-start space-x-2 overflow-x-auto">
                            <TabsTrigger value="tareas" className="gap-2">
                                <CheckCircle2 className="h-4 w-4" /> Tareas
                            </TabsTrigger>
                            <TabsTrigger value="tiempos" className="gap-2">
                                <Timer className="h-4 w-4" /> Tiempos
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="tareas" className="mt-0">
                            <TareasPage projectId={id} isEmbedded={true} />
                        </TabsContent>

                        <TabsContent value="tiempos" className="mt-0">
                            <TiemposPage projectId={id} isEmbedded={true} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div >
        </div >
    )
}
