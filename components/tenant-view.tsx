"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Phone, FileText, Calendar, DollarSign, Plus } from "lucide-react"
import { PaymentForm } from "@/components/payment-form"
import { PaymentHistory } from "@/components/payment-history"
import type { Tenant, Apartment, Payment } from "@/types"

interface TenantViewProps {
  tenant: Tenant
  apartment: Apartment
  activeMonth: number
  activeYear: number
  onEdit: () => void
  onRemove: () => void
  onUpdate: (tenant: Tenant) => void
}

export function TenantView({
  tenant,
  apartment,
  activeMonth,
  activeYear,
  onEdit,
  onRemove,
  onUpdate,
}: TenantViewProps) {
  const [showPaymentForm, setShowPaymentForm] = useState(false)

  const handlePaymentSave = (payment: Payment) => {
    const updatedPayments = [...tenant.payments]
    const existingIndex = updatedPayments.findIndex((p) => p.month === payment.month && p.year === payment.year)

    if (existingIndex !== -1) {
      updatedPayments[existingIndex] = payment
    } else {
      updatedPayments.push(payment)
    }

    onUpdate({
      ...tenant,
      payments: updatedPayments,
    })

    setShowPaymentForm(false)
  }

  const handlePaymentDelete = (paymentId: string) => {
    if (confirm("Tem certeza que deseja excluir este pagamento?")) {
      const updatedPayments = tenant.payments.filter((p) => p.id !== paymentId)
      onUpdate({
        ...tenant,
        payments: updatedPayments,
      })
    }
  }

  const currentPayment = tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)
  const isPaid = !!currentPayment

  if (showPaymentForm) {
    return (
      <PaymentForm
        tenant={tenant}
        activeMonth={activeMonth}
        activeYear={activeYear}
        existingPayment={currentPayment}
        onSave={handlePaymentSave}
        onCancel={() => setShowPaymentForm(false)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Informações do Inquilino</CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={onRemove}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-2xl font-bold">{tenant.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Phone className="h-4 w-4" />
                <span className="text-sm">Telefone</span>
              </div>
              <p className="font-medium">{tenant.phone}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">CPF</span>
              </div>
              <p className="font-medium">{tenant.cpf}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                <span className="text-sm">RG</span>
              </div>
              <p className="font-medium">{tenant.rg}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Vencimento</span>
              </div>
              <p className="font-medium">Dia {tenant.dueDay}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Valor do Aluguel</span>
            </div>
            <p className="text-2xl font-bold text-primary">R$ {tenant.rentAmount.toFixed(2)}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Contrato Ativo</p>
            <Badge variant={tenant.hasActiveContract ? "default" : "secondary"}>
              {tenant.hasActiveContract ? "Sim" : "Não"}
            </Badge>
          </div>

          {tenant.documentPhoto && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Documento de Identificação</p>
              <img
                src={tenant.documentPhoto || "/placeholder.svg"}
                alt="Documento"
                className="max-w-md rounded border"
              />
            </div>
          )}

          {tenant.observations && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Observações</p>
              <p className="text-sm bg-muted p-3 rounded">{tenant.observations}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pagamento do Mês Ativo</CardTitle>
            {!isPaid && (
              <Button size="sm" onClick={() => setShowPaymentForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Registrar Pagamento
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isPaid ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div>
                  <p className="font-medium text-green-900 dark:text-green-100">Pagamento Confirmado</p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Pago em {new Date(currentPayment.date).toLocaleDateString("pt-BR")}
                  </p>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Método: {getPaymentMethodLabel(currentPayment.method)}
                  </p>
                </div>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  R$ {currentPayment.amount.toFixed(2)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setShowPaymentForm(true)}>
                  Editar Pagamento
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handlePaymentDelete(currentPayment.id)}>
                  Excluir Pagamento
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="font-medium text-orange-900 dark:text-orange-100">Pagamento Pendente</p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Vencimento: Dia {tenant.dueDay} - Valor: R$ {tenant.rentAmount.toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <PaymentHistory tenant={tenant} onDelete={handlePaymentDelete} />
    </div>
  )
}

function getPaymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    cash: "Dinheiro",
    pix: "PIX",
    transfer: "Transferência",
    card: "Cartão",
    other: "Outro",
  }
  return labels[method] || method
}
