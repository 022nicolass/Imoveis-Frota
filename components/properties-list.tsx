"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Building2, Pencil, Trash2 } from "lucide-react"
import { PropertyForm } from "@/components/property-form"
import type { Property } from "@/types"

interface PropertiesListProps {
  onSelectProperty: (id: string) => void
}

export function PropertiesList({ onSelectProperty }: PropertiesListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("frota_properties")
    if (stored) {
      setProperties(JSON.parse(stored))
    }
  }, [])

  const saveProperties = (props: Property[]) => {
    localStorage.setItem("frota_properties", JSON.stringify(props))
    setProperties(props)
  }

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.")) {
      const updated = properties.filter((p) => p.id !== id)
      saveProperties(updated)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleSave = (property: Property) => {
    if (editingProperty) {
      const updated = properties.map((p) => (p.id === property.id ? property : p))
      saveProperties(updated)
    } else {
      saveProperties([...properties, property])
    }
    setShowForm(false)
    setEditingProperty(null)
  }

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setEditingProperty(null)
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Meus Imóveis</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Imóvel
        </Button>
      </div>

      {properties.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center mb-4">Nenhum imóvel cadastrado ainda.</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Imóvel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <Card key={property.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{property.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{property.address}</p>
                <p className="text-xs text-muted-foreground">ENEL: {property.enelRegistry}</p>
                <p className="text-xs text-muted-foreground">Quadro: {property.electricPanel}</p>
                <p className="text-xs text-muted-foreground">Água/Esgoto: R$ {property.waterSewerMonthly.toFixed(2)}</p>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => onSelectProperty(property.id)}
                  >
                    Abrir
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(property)
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(property.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
