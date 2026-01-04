"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Apartment } from "@/types"

interface ApartmentFormProps {
  apartment: Apartment | null
  onSave: (apartment: Apartment) => void
  onCancel: () => void
}

export function ApartmentForm({ apartment, onSave, onCancel }: ApartmentFormProps) {
  const [identifier, setIdentifier] = useState(apartment?.identifier || "")
  const [rentAmount, setRentAmount] = useState(apartment?.rentAmount?.toString() || "")
  const [status, setStatus] = useState<"occupied" | "vacant">(apartment?.status || "vacant")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const apartmentData: Apartment = {
      id: apartment?.id || crypto.randomUUID(),
      identifier,
      rentAmount: Number.parseFloat(rentAmount) || 0,
      status,
      tenant: apartment?.tenant || null,
    }

    onSave(apartmentData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{apartment ? "Editar Apartamento" : "Novo Apartamento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Identificador (ex: Apto 101)</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Ex: Apto 101, Unidade A"
              required
            />
          </div>

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
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value: "occupied" | "vacant") => setStatus(value)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacant">Vazio</SelectItem>
                <SelectItem value="occupied">Ocupado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {apartment ? "Salvar Alterações" : "Criar Apartamento"}
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
