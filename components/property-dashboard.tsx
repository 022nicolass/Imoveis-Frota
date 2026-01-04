"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, Home, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import { generatePropertyDashboardPDF } from "@/lib/pdf-generator-dashboard"
import type { Property } from "@/types"

interface PropertyDashboardProps {
  property: Property
  activeMonth: number
  activeYear: number
}

export function PropertyDashboard({ property, activeMonth, activeYear }: PropertyDashboardProps) {
  const totalReceived = property.apartments.reduce((sum, apt) => {
    if (apt.tenant) {
      const payment = apt.tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)
      if (payment) {
        return sum + payment.amount
      }
    }
    return sum
  }, 0)

  const totalPending = property.apartments.reduce((sum, apt) => {
    if (apt.tenant) {
      const payment = apt.tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)
      if (!payment) {
        return sum + apt.rentAmount
      }
    }
    return sum
  }, 0)

  const occupiedCount = property.apartments.filter((a) => a.status === "occupied").length
  const vacantCount = property.apartments.filter((a) => a.status === "vacant").length

  const paidCount = property.apartments.filter((apt) => {
    if (apt.tenant) {
      return apt.tenant.payments.some((p) => p.month === activeMonth && p.year === activeYear)
    }
    return false
  }).length

  const pendingCount = property.apartments.filter((apt) => {
    if (apt.tenant) {
      return !apt.tenant.payments.some((p) => p.month === activeMonth && p.year === activeYear)
    }
    return false
  }).length

  const handleExportDashboardPDF = () => {
    generatePropertyDashboardPDF(property, activeMonth, activeYear)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Resumo do Mês</h3>
        <Button onClick={handleExportDashboardPDF}>
          <FileText className="h-4 w-4 mr-2" />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recebido no Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ {totalReceived.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente no Mês</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">R$ {totalPending.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apartamentos</CardTitle>
            <Home className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{property.apartments.length}</div>
            <p className="text-xs text-muted-foreground">
              {occupiedCount} ocupados, {vacantCount} vazios
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagamentos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paidCount}</div>
            <p className="text-xs text-muted-foreground">{pendingCount} pendentes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Apartamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {property.apartments.map((apt) => {
              const hasTenant = apt.tenant !== null
              const payment = apt.tenant?.payments.find((p) => p.month === activeMonth && p.year === activeYear)
              const isPaid = !!payment
              const dueDate = apt.tenant ? new Date(activeYear, activeMonth - 1, apt.tenant.dueDay) : null
              const today = new Date()
              const isOverdue = dueDate && today > dueDate && !isPaid

              let statusColor = "bg-gray-200"
              let statusText = "Vazio"

              if (hasTenant) {
                if (isPaid) {
                  statusColor = "bg-green-500"
                  statusText = "Pago"
                } else if (isOverdue) {
                  statusColor = "bg-red-500"
                  statusText = "Vencido"
                } else {
                  statusColor = "bg-yellow-500"
                  statusText = "Pendente"
                }
              }

              return (
                <div key={apt.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                    <div>
                      <p className="font-medium">{apt.identifier}</p>
                      {hasTenant && apt.tenant && <p className="text-sm text-muted-foreground">{apt.tenant.name}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{statusText}</p>
                    <p className="text-sm text-muted-foreground">R$ {apt.rentAmount.toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
