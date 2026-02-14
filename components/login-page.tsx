"use client"

import { useState } from "react"
import { Scale, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useApp } from "@/lib/app-context"

export function LoginPage() {
  const { setIsLoggedIn, setUserRole, setCurrentUserId, setCurrentPage } = useApp()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = (role: "admin" | "abogado") => {
    if (role === "admin") {
      setUserRole("admin")
      setCurrentUserId("u1")
      setCurrentPage("dashboard")
    } else {
      setUserRole("abogado")
      setCurrentUserId("u3")
      setCurrentPage("mi-panel")
    }
    setIsLoggedIn(true)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[hsl(216,50%,8%)] p-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 -right-20 h-96 w-96 rounded-full bg-[hsl(40,60%,50%)]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-[hsl(216,50%,20%)]/20 blur-[100px]" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-[hsl(216,40%,14%)] bg-[hsl(216,40%,14%)] shadow-2xl">
        <CardHeader className="items-center pb-2 pt-8">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[hsl(40,60%,50%)]">
            <Scale className="h-7 w-7 text-[hsl(216,50%,8%)]" />
          </div>
          <CardTitle className="text-xl font-bold text-[hsl(40,50%,80%)] tracking-tight">
            LexPro
          </CardTitle>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[hsl(216,20%,85%)]/60 mt-0.5">
            Abogados
          </p>
          <CardDescription className="text-[hsl(216,20%,85%)]/50 mt-3">
            Sistema de Gestion y Alertas Legales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5 px-8 pb-8">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[hsl(216,20%,85%)]/80 text-sm">
              Correo Electronico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="usuario@lexpro.mx"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-[hsl(216,40%,20%)] bg-[hsl(216,50%,8%)] text-[hsl(216,20%,85%)] placeholder:text-[hsl(216,20%,85%)]/25 focus-visible:ring-[hsl(40,60%,50%)]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[hsl(216,20%,85%)]/80 text-sm">
              Contrasena
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-[hsl(216,40%,20%)] bg-[hsl(216,50%,8%)] text-[hsl(216,20%,85%)] placeholder:text-[hsl(216,20%,85%)]/25 pr-10 focus-visible:ring-[hsl(40,60%,50%)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(216,20%,85%)]/40 hover:text-[hsl(216,20%,85%)]/70"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <Button
              className="w-full font-semibold bg-[hsl(40,60%,50%)] text-[hsl(216,50%,8%)] hover:bg-[hsl(40,60%,55%)]"
              size="lg"
              onClick={() => handleLogin("admin")}
            >
              Ingresar como Admin
            </Button>
            <Button
              variant="outline"
              className="w-full border-[hsl(216,40%,20%)] bg-transparent text-[hsl(216,20%,85%)] hover:bg-[hsl(216,40%,20%)] hover:text-[hsl(216,20%,85%)]"
              size="lg"
              onClick={() => handleLogin("abogado")}
            >
              Ingresar como Abogado
            </Button>
          </div>

          <p className="pt-2 text-center text-xs text-[hsl(216,20%,85%)]/35">
            Demo interactiva — No se requiere contrasena
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
