"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Tenant } from "@/types"

interface TenantFormProps {
  tenant: Tenant | null
  apartmentRent: number
  onSave: (tenant: Tenant) => void
  onCancel: () => void
}

export function TenantForm({ tenant, apartmentRent, onSave, onCancel }: TenantFormProps) {
  const [name, setName] = useState(tenant?.name || "")
  const [phone, setPhone] = useState(tenant?.phone || "")
  const [cpf, setCpf] = useState(tenant?.cpf || "")
  const [rg, setRg] = useState(tenant?.rg || "")
  const [observations, setObservations] = useState(tenant?.observations || "")
  const [rentAmount, setRentAmount] = useState(tenant?.rentAmount?.toString() || apartmentRent.toString())
  const [dueDay, setDueDay] = useState(tenant?.dueDay?.toString() || "10")
  const [hasActiveContract, setHasActiveContract] = useState(tenant?.hasActiveContract || false)
  const [documentPhoto, setDocumentPhoto] = useState(tenant?.documentPhoto || null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDocumentPhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tenantData: Tenant = {
      id: tenant?.id || crypto.randomUUID(),
      name,
      phone,
      cpf,
      rg,
      observations,
      rentAmount: Number.parseFloat(rentAmount) || 0,
      dueDay: Number.parseInt(dueDay) || 10,
      documentPhoto,
      hasActiveContract,
      payments: tenant?.payments || [],
    }

    onSave(tenantData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tenant ? "Editar Inquilino" : "Novo Inquilino"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do inquilino"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input id="rg" value={rg} onChange={(e) => setRg(e.target.value)} placeholder="00.000.000-0" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rent">Valor do Aluguel (R$)</Label>
              <Input
                id="rent"
                type="number"
                step="0.01"
                value={rentAmount}
                onChange={(e) => setRentAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDay">Dia de Vencimento</Label>
              <Select value={dueDay} onValueChange={setDueDay}>
                <SelectTrigger id="dueDay">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="document">Foto do Documento (RG, CNH, etc.)</Label>
            <Input id="document" type="file" accept="image/*" onChange={handleFileChange} />
            {documentPhoto && (
              <div className="mt-2">
                <img src={documentPhoto || "/placeholder.svg"} alt="Documento" className="max-w-xs rounded border" />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract">Contrato Ativo</Label>
            <Select
              value={hasActiveContract ? "yes" : "no"}
              onValueChange={(val) => setHasActiveContract(val === "yes")}
            >
              <SelectTrigger id="contract">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Sim</SelectItem>
                <SelectItem value="no">Não</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações adicionais sobre o inquilino"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {tenant ? "Salvar Alterações" : "Adicionar Inquilino"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
