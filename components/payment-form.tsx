"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Payment, Tenant } from "@/types"

interface PaymentFormProps {
  tenant: Tenant
  activeMonth: number
  activeYear: number
  existingPayment?: Payment
  onSave: (payment: Payment) => void
  onCancel: () => void
}

export function PaymentForm({ tenant, activeMonth, activeYear, existingPayment, onSave, onCancel }: PaymentFormProps) {
  const [month, setMonth] = useState(existingPayment?.month?.toString() || activeMonth.toString())
  const [year, setYear] = useState(existingPayment?.year?.toString() || activeYear.toString())
  const [amount, setAmount] = useState(existingPayment?.amount?.toString() || tenant.rentAmount.toString())
  const [date, setDate] = useState(existingPayment?.date || new Date().toISOString().split("T")[0])
  const [method, setMethod] = useState<"cash" | "pix" | "transfer" | "card" | "other">(existingPayment?.method || "pix")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payment: Payment = {
      id: existingPayment?.id || crypto.randomUUID(),
      month: Number.parseInt(month),
      year: Number.parseInt(year),
      amount: Number.parseFloat(amount),
      date,
      method,
    }

    onSave(payment)
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
    <Card>
      <CardHeader>
        <CardTitle>{existingPayment ? "Editar Pagamento" : "Registrar Pagamento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Mês</Label>
              <Select value={month} onValueChange={setMonth}>
                <SelectTrigger id="month">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map((m, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger id="year">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => 2026 + i).map((y) => (
                    <SelectItem key={y} value={y.toString()}>
                      {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data do Pagamento</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="method">Forma de Pagamento</Label>
            <Select
              value={method}
              onValueChange={(val: "cash" | "pix" | "transfer" | "card" | "other") => setMethod(val)}
            >
              <SelectTrigger id="method">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Dinheiro</SelectItem>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="transfer">Transferência</SelectItem>
                <SelectItem value="card">Cartão</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {existingPayment ? "Salvar Alterações" : "Registrar Pagamento"}
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
