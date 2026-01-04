"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, User } from "lucide-react"
import { TenantForm } from "@/components/tenant-form"
import { TenantView } from "@/components/tenant-view"
import type { Apartment, Tenant } from "@/types"

interface TenantManagementProps {
  apartment: Apartment
  activeMonth: number
  activeYear: number
  onUpdate: (apartment: Apartment) => void
}

export function TenantManagement({ apartment, activeMonth, activeYear, onUpdate }: TenantManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (tenant: Tenant) => {
    onUpdate({
      ...apartment,
      tenant,
      status: "occupied",
    })
    setShowForm(false)
    setIsEditing(false)
  }

  const handleRemove = () => {
    if (confirm("Tem certeza que deseja remover o inquilino deste apartamento?")) {
      onUpdate({
        ...apartment,
        tenant: null,
        status: "vacant",
      })
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setShowForm(true)
  }

  if (showForm) {
    return (
      <TenantForm
        tenant={apartment.tenant}
        apartmentRent={apartment.rentAmount}
        onSave={handleSave}
        onCancel={() => {
          setShowForm(false)
          setIsEditing(false)
        }}
      />
    )
  }

  if (!apartment.tenant) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Inquilino</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <User className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center mb-4">Nenhum inquilino cadastrado neste apartamento.</p>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Inquilino
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <TenantView
      tenant={apartment.tenant}
      apartment={apartment}
      activeMonth={activeMonth}
      activeYear={activeYear}
      onEdit={handleEdit}
      onRemove={handleRemove}
      onUpdate={(updatedTenant) => handleSave(updatedTenant)}
    />
  )
}
