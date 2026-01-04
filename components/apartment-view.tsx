"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText } from "lucide-react"
import { TenantManagement } from "@/components/tenant-management"
import { generateTenantPDF } from "@/lib/pdf-generator"
import type { Apartment, Property } from "@/types"

interface ApartmentViewProps {
  apartment: Apartment
  property: Property
  activeMonth: number
  activeYear: number
  onBack: () => void
  onUpdate: (property: Property) => void
}

export function ApartmentView({ apartment, property, activeMonth, activeYear, onBack, onUpdate }: ApartmentViewProps) {
  const updateApartment = (updatedApartment: Apartment) => {
    const updatedApartments = property.apartments.map((a) => (a.id === apartment.id ? updatedApartment : a))
    onUpdate({
      ...property,
      apartments: updatedApartments,
    })
  }

  const handleExportPDF = () => {
    if (apartment.tenant) {
      generateTenantPDF(property, apartment, activeMonth, activeYear)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Apartamentos
        </Button>
        {apartment.tenant && (
          <Button onClick={handleExportPDF}>
            <FileText className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{apartment.identifier}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Valor do Aluguel</p>
              <p className="text-xl font-bold text-primary">R$ {apartment.rentAmount.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-lg font-medium">{apartment.status === "occupied" ? "Ocupado" : "Vazio"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TenantManagement
        apartment={apartment}
        activeMonth={activeMonth}
        activeYear={activeYear}
        onUpdate={updateApartment}
      />
    </div>
  )
}
