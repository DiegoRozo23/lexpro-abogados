"use client"

import { useState } from "react"
import { Bell, Check, Clock, Calendar, AlertTriangle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDemoStore } from "@/lib/demo-store"
import { useApp } from "@/lib/app-context"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

export function NotificationsPage() {
    const { notifications, markAsRead, markAllAsRead } = useDemoStore()
    const { userRole, navigateRoot } = useApp()
    const [filter, setFilter] = useState<"all" | "unread">("all")

    const filteredNotifications = notifications
        .filter((n) => (filter === "all" || !n.read) && (!n.targetRole || n.targetRole === userRole))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const unreadCount = notifications.filter(n => !n.read && (!n.targetRole || n.targetRole === userRole)).length

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Notificaciones</h1>
                    <p className="text-muted-foreground">Centro de alertas y recordatorios</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("all")}
                        className={filter === "all" ? "bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]" : ""}
                    >
                        Todas
                    </Button>
                    <Button
                        variant={filter === "unread" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter("unread")}
                        className={filter === "unread" ? "bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] hover:bg-[hsl(216,50%,18%)]" : ""}
                    >
                        No leídas ({unreadCount})
                    </Button>
                    <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        Marcar todas como leídas
                    </Button>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredNotifications.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium">Sin notificaciones</h3>
                        <p className="text-muted-foreground max-w-sm mt-2">
                            {filter === "unread" ? "No tienes notificaciones pendientes de leer." : "No hay notificaciones para mostrar."}
                        </p>
                        {filter === "unread" && (
                            <Button variant="link" onClick={() => setFilter("all")} className="mt-2">
                                Ver todas las notificaciones
                            </Button>
                        )}
                    </Card>
                ) : (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            onClick={() => notification.linkTo && navigateRoot(notification.linkTo as any)}
                            className={`transition-all hover:shadow-sm cursor-pointer ${!notification.read ? "border-l-4 border-l-[hsl(40,60%,50%)] bg-muted/10" : ""}`}
                        >
                            <CardContent className="p-4 flex gap-4 items-start">
                                <div className={`mt-1 h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${notification.type === "vencimiento" ? "bg-red-100 text-red-600" :
                                    notification.type === "recordatorio" ? "bg-amber-100 text-amber-600" :
                                        "bg-blue-100 text-blue-600"
                                    }`}>
                                    {notification.type === "vencimiento" ? <AlertTriangle className="h-4 w-4" /> :
                                        notification.type === "recordatorio" ? <Clock className="h-4 w-4" /> :
                                            <Bell className="h-4 w-4" />}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                            {notification.title}
                                        </p>
                                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                                            {new Date(notification.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {notification.message}
                                    </p>
                                    {/* Link to task would go here if taskId existed in type */}
                                </div>

                                {!notification.read && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                                        onClick={() => markAsRead(notification.id)}
                                        title="Marcar como leída"
                                    >
                                        <Check className="h-4 w-4" />
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div >
    )
}
