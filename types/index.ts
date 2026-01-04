export interface Property {
  id: string
  name: string
  address: string
  enelRegistry: string
  electricPanel: string
  waterSewerMonthly: number
  apartments: Apartment[]
}

export interface Apartment {
  id: string
  identifier: string
  rentAmount: number
  status: "occupied" | "vacant"
  tenant: Tenant | null
}

export interface Tenant {
  id: string
  name: string
  phone: string
  cpf: string
  rg: string
  observations: string
  rentAmount: number
  dueDay: number
  documentPhoto: string | null
  hasActiveContract: boolean
  payments: Payment[]
}

export interface Payment {
  id: string
  month: number
  year: number
  amount: number
  date: string
  method: "cash" | "pix" | "transfer" | "card" | "other"
}
