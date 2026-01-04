"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import type { Property } from "@/types"

interface PropertyFormProps {
  property: Property | null
  onSave: (property: Property) => void
  onCancel: () => void
}

export function PropertyForm({ property, onSave, onCancel }: PropertyFormProps) {
  const [name, setName] = useState(property?.name || "")
  const [address, setAddress] = useState(property?.address || "")
  const [enelRegistry, setEnelRegistry] = useState(property?.enelRegistry || "")
  const [electricPanel, setElectricPanel] = useState(property?.electricPanel || "")
  const [waterSewerMonthly, setWaterSewerMonthly] = useState(property?.waterSewerMonthly?.toString() || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const propertyData: Property = {
      id: property?.id || crypto.randomUUID(),
      name,
      address,
      enelRegistry,
      electricPanel,
      waterSewerMonthly: Number.parseFloat(waterSewerMonthly) || 0,
      apartments: property?.apartments || [],
    }

    onSave(propertyData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{property ? "Editar Imóvel" : "Novo Imóvel"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Imóvel</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Edifício Central"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço Completo</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="enel">Registro da ENEL</Label>
            <Input
              id="enel"
              value={enelRegistry}
              onChange={(e) => setEnelRegistry(e.target.value)}
              placeholder="Número de registro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="panel">Número do Quadro Elétrico</Label>
            <Input
              id="panel"
              value={electricPanel}
              onChange={(e) => setElectricPanel(e.target.value)}
              placeholder="Número do quadro"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="water">Valor Mensal de Água/Esgoto (R$)</Label>
            <Input
              id="water"
              type="number"
              step="0.01"
              value={waterSewerMonthly}
              onChange={(e) => setWaterSewerMonthly(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {property ? "Salvar Alterações" : "Criar Imóvel"}
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
