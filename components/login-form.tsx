"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  onSuccess: () => void
  onToggle: () => void
}

export function LoginForm({ onSuccess, onToggle }: LoginFormProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const users = JSON.parse(localStorage.getItem("frota_users") || "[]")
    const user = users.find((u: any) => u.phone === phone && u.password === password)

    if (user) {
      localStorage.setItem("frota_user", JSON.stringify(user))
      onSuccess()
    } else {
      setError("Telefone ou senha incorretos")
    }
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-primary">Imóveis Frota</CardTitle>
        <CardDescription>Entre com seu telefone e senha</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Entrar
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onToggle}>
            Criar nova conta
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
