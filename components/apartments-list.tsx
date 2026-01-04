"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Home, Pencil, Trash2 } from "lucide-react"
import { ApartmentForm } from "@/components/apartment-form"
import { ApartmentView } from "@/components/apartment-view"
import type { Property, Apartment } from "@/types"
import { Badge } from "@/components/ui/badge"

interface ApartmentsListProps {
  property: Property
  activeMonth: number
  activeYear: number
  onUpdate: (property: Property) => void
}

export function ApartmentsList({ property, activeMonth, activeYear, onUpdate }: ApartmentsListProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingApartment, setEditingApartment] = useState<Apartment | null>(null)
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null)

  const handleSave = (apartment: Apartment) => {
    let updatedApartments: Apartment[]

    if (editingApartment) {
      updatedApartments = property.apartments.map((a) => (a.id === apartment.id ? apartment : a))
    } else {
      updatedApartments = [...property.apartments, apartment]
    }

    onUpdate({
      ...property,
      apartments: updatedApartments,
    })

    setShowForm(false)
    setEditingApartment(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este apartamento?")) {
      const updatedApartments = property.apartments.filter((a) => a.id !== id)
      onUpdate({
        ...property,
        apartments: updatedApartments,
      })
    }
  }

  const handleEdit = (apartment: Apartment) => {
    setEditingApartment(apartment)
    setShowForm(true)
  }

  if (selectedApartment) {
    return (
      <ApartmentView
        apartment={selectedApartment}
        property={property}
        activeMonth={activeMonth}
        activeYear={activeYear}
        onBack={() => setSelectedApartment(null)}
        onUpdate={onUpdate}
      />
    )
  }

  if (showForm) {
    return (
      <ApartmentForm
        apartment={editingApartment}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setEditingApartment(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Apartamentos / Unidades</h3>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Apartamento
        </Button>
      </div>

      {property.apartments.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">Nenhum apartamento cadastrado.</p>
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Apartamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {property.apartments.map((apartment) => {
            const hasTenant = apartment.tenant !== null
            const isOccupied = apartment.status === "occupied"

            return (
              <Card key={apartment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{apartment.identifier}</CardTitle>
                    <Badge variant={isOccupied ? "default" : "secondary"}>{isOccupied ? "Ocupado" : "Vazio"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium">Valor do Aluguel</p>
                    <p className="text-lg font-bold text-primary">R$ {apartment.rentAmount.toFixed(2)}</p>
                  </div>
                  {hasTenant && apartment.tenant && (
                    <div>
                      <p className="text-sm text-muted-foreground">Inquilino</p>
                      <p className="text-sm font-medium">{apartment.tenant.name}</p>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => setSelectedApartment(apartment)}
                    >
                      Abrir
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(apartment)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(apartment.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
