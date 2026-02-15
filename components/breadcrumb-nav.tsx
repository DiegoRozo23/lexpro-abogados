"use client"

import { ChevronRight, Home } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

const titleMap: Record<string, string> = {
    dashboard: "Dashboard",
    proyectos: "Proyectos",
    tareas: "Tareas",
    clientes: "Clientes",
    "mi-panel": "Mi Panel",
    tiempos: "Tiempos",
    notificaciones: "Notificaciones",
    "project-detail": "Detalles del Proyecto",
}

export function BreadcrumbNav() {
    const { navStack, popTo } = useApp()

    if (navStack.length <= 1) return null

    return (
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            {navStack.map((view, index) => {
                const isLast = index === navStack.length - 1
                const title = view.title || titleMap[view.name] || view.name

                return (
                    <div key={index} className="flex items-center gap-1">
                        {index > 0 && <ChevronRight className="h-4 w-4" />}
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`h-auto p-1 px-2 font-normal ${isLast ? "text-foreground font-medium pointer-events-none" : "text-muted-foreground hover:text-foreground"}`}
                            onClick={() => !isLast && popTo(index)}
                        >
                            {index === 0 && view.name === "dashboard" ? <Home className="h-3.5 w-3.5" /> : title}
                        </Button>
                    </div>
                )
            })}
        </div>
    )
}
