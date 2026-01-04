"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const MASTER_CODE = "19751973"
const MAX_USERS = 4

interface RegisterFormProps {
  onSuccess: () => void
  onToggle: () => void
}

export function RegisterForm({ onSuccess, onToggle }: RegisterFormProps) {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [masterCode, setMasterCode] = useState("")
  const [error, setError] = useState("")

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validate master code
    if (masterCode !== MASTER_CODE) {
      setError("Código mestre incorreto. Este aplicativo é privado.")
      return
    }

    // Load users
    const users = JSON.parse(localStorage.getItem("frota_users") || "[]")

    // Check user limit
    if (users.length >= MAX_USERS) {
      setError("Limite de usuários atingido. Este aplicativo é privado.")
      return
    }

    // Check duplicate phone
    if (users.find((u: any) => u.phone === phone)) {
      setError("Este telefone já está cadastrado")
      return
    }

    // Create new user
    const newUser = { phone, password }
    users.push(newUser)
    localStorage.setItem("frota_users", JSON.stringify(users))
    localStorage.setItem("frota_user", JSON.stringify(newUser))

    onSuccess()
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-primary">Imóveis Frota</CardTitle>
        <CardDescription>Criar Nova Conta - Acesso Restrito</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="master-code">Código Mestre</Label>
            <Input
              id="master-code"
              type="password"
              placeholder="Digite o código mestre"
              value={masterCode}
              onChange={(e) => setMasterCode(e.target.value)}
              required
            />
          </div>
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
              placeholder="Crie uma senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            Criar Conta
          </Button>
          <Button type="button" variant="ghost" className="w-full" onClick={onToggle}>
            Voltar ao login
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
