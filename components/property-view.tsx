"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Building, DollarSign } from "lucide-react"
import { ApartmentsList } from "@/components/apartments-list"
import { PropertyDashboard } from "@/components/property-dashboard"
import type { Property } from "@/types"

interface PropertyViewProps {
  propertyId: string
  onBack: () => void
}

export function PropertyView({ propertyId, onBack }: PropertyViewProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1)
  const [activeYear, setActiveYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const stored = localStorage.getItem("frota_properties")
    if (stored) {
      const properties: Property[] = JSON.parse(stored)
      const found = properties.find((p) => p.id === propertyId)
      if (found) {
        setProperty(found)
      }
    }
  }, [propertyId])

  const updateProperty = (updated: Property) => {
    const stored = localStorage.getItem("frota_properties")
    if (stored) {
      const properties: Property[] = JSON.parse(stored)
      const index = properties.findIndex((p) => p.id === propertyId)
      if (index !== -1) {
        properties[index] = updated
        localStorage.setItem("frota_properties", JSON.stringify(properties))
        setProperty(updated)
      }
    }
  }

  if (!property) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Imóveis
        </Button>
        <p className="text-muted-foreground">Imóvel não encontrado</p>
      </div>
    )
  }

  const months = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar aos Imóveis
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{property.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{property.address}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">ENEL:</span> {property.enelRegistry}
            </div>
            <div>
              <span className="text-muted-foreground">Quadro:</span> {property.electricPanel}
            </div>
            <div>
              <span className="text-muted-foreground">Água/Esgoto:</span> R$ {property.waterSewerMonthly.toFixed(2)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Mês Ativo</label>
              <select
                value={activeMonth}
                onChange={(e) => setActiveMonth(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {months.map((month, index) => (
                  <option key={index} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Ano</label>
              <select
                value={activeYear}
                onChange={(e) => setActiveYear(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard">
            <DollarSign className="h-4 w-4 mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="apartments">
            <Building className="h-4 w-4 mr-2" />
            Apartamentos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <PropertyDashboard property={property} activeMonth={activeMonth} activeYear={activeYear} />
        </TabsContent>
        <TabsContent value="apartments">
          <ApartmentsList
            property={property}
            activeMonth={activeMonth}
            activeYear={activeYear}
            onUpdate={updateProperty}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
