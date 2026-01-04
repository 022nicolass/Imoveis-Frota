"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Receipt } from "lucide-react"
import type { Tenant } from "@/types"

interface PaymentHistoryProps {
  tenant: Tenant
  onDelete: (paymentId: string) => void
}

export function PaymentHistory({ tenant, onDelete }: PaymentHistoryProps) {
  const sortedPayments = [...tenant.payments]
    .filter((p) => p.year >= 2026)
    .sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })

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

  const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
      cash: "Dinheiro",
      pix: "PIX",
      transfer: "Transferência",
      card: "Cartão",
      other: "Outro",
    }
    return labels[method] || method
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Pagamentos (desde 2026)</CardTitle>
      </CardHeader>
      <CardContent>
        {sortedPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Receipt className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">Nenhum pagamento registrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedPayments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex-1">
                  <p className="font-medium">
                    {months[payment.month - 1]} {payment.year}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Pago em {new Date(payment.date).toLocaleDateString("pt-BR")} -{" "}
                    {getPaymentMethodLabel(payment.method)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-lg font-bold text-primary">R$ {payment.amount.toFixed(2)}</p>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(payment.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
