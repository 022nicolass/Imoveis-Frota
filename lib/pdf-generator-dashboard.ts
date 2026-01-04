import type { Property } from "@/types"

export function generatePropertyDashboardPDF(property: Property, activeMonth: number, activeYear: number) {
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

  const totalReceived = property.apartments.reduce((sum, apt) => {
    if (apt.tenant) {
      const payment = apt.tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)
      if (payment) return sum + payment.amount
    }
    return sum
  }, 0)

  const totalPending = property.apartments.reduce((sum, apt) => {
    if (apt.tenant) {
      const payment = apt.tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)
      if (!payment) return sum + apt.rentAmount
    }
    return sum
  }, 0)

  const occupiedCount = property.apartments.filter((a) => a.status === "occupied").length
  const vacantCount = property.apartments.filter((a) => a.status === "vacant").length

  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório - ${property.name} - ${months[activeMonth - 1]} ${activeYear}</title>
  <style>
    @page { size: A4; margin: 2cm; }
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 210mm; margin: 0 auto; padding: 20px; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #d4c5a9; }
    .header h1 { color: #7a6f5d; margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 5px 0; color: #666; }
    .section { margin-bottom: 25px; page-break-inside: avoid; }
    .section-title { background-color: #f5f0e8; color: #5a5040; padding: 10px 15px; margin-bottom: 15px; font-size: 16px; font-weight: bold; border-left: 4px solid #d4c5a9; }
    .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; }
    .stat-card { padding: 20px; background-color: #fafaf8; border-radius: 8px; border: 2px solid #e8ded0; }
    .stat-label { font-size: 12px; color: #888; margin-bottom: 5px; text-transform: uppercase; }
    .stat-value { font-size: 28px; font-weight: bold; color: #333; }
    .stat-value.green { color: #28a745; }
    .stat-value.orange { color: #fd7e14; }
    .apartments-list { margin-top: 15px; }
    .apartment-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; border-bottom: 1px solid #e0e0e0; }
    .apartment-item:last-child { border-bottom: none; }
    .status-indicator { width: 12px; height: 12px; border-radius: 50%; display: inline-block; margin-right: 10px; }
    .status-indicator.green { background-color: #28a745; }
    .status-indicator.yellow { background-color: #ffc107; }
    .status-indicator.red { background-color: #dc3545; }
    .status-indicator.gray { background-color: #6c757d; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center; font-size: 12px; color: #888; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Imóveis Frota</h1>
    <p><strong>Relatório do Imóvel</strong></p>
    <p>${property.name}</p>
    <p>${months[activeMonth - 1]} ${activeYear}</p>
  </div>

  <div class="section">
    <div class="section-title">Informações do Imóvel</div>
    <p><strong>Endereço:</strong> ${property.address}</p>
    <p><strong>Registro ENEL:</strong> ${property.enelRegistry}</p>
    <p><strong>Quadro Elétrico:</strong> ${property.electricPanel}</p>
    <p><strong>Água/Esgoto Mensal:</strong> R$ ${property.waterSewerMonthly.toFixed(2)}</p>
  </div>

  <div class="section">
    <div class="section-title">Resumo Financeiro - ${months[activeMonth - 1]} ${activeYear}</div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Recebido</div>
        <div class="stat-value green">R$ ${totalReceived.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Pendente</div>
        <div class="stat-value orange">R$ ${totalPending.toFixed(2)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Apartamentos Ocupados</div>
        <div class="stat-value">${occupiedCount}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Apartamentos Vazios</div>
        <div class="stat-value">${vacantCount}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Status dos Apartamentos</div>
    <div class="apartments-list">
      ${property.apartments
        .map((apt) => {
          const hasTenant = apt.tenant !== null
          const payment = apt.tenant?.payments.find((p) => p.month === activeMonth && p.year === activeYear)
          const isPaid = !!payment
          const dueDate = apt.tenant ? new Date(activeYear, activeMonth - 1, apt.tenant.dueDay) : null
          const today = new Date()
          const isOverdue = dueDate && today > dueDate && !isPaid

          let statusColor = "gray"
          let statusText = "Vazio"

          if (hasTenant) {
            if (isPaid) {
              statusColor = "green"
              statusText = "Pago"
            } else if (isOverdue) {
              statusColor = "red"
              statusText = "Vencido"
            } else {
              statusColor = "yellow"
              statusText = "Pendente"
            }
          }

          return `
        <div class="apartment-item">
          <div>
            <span class="status-indicator ${statusColor}"></span>
            <strong>${apt.identifier}</strong>
            ${hasTenant && apt.tenant ? `<br><span style="margin-left: 22px; color: #666;">${apt.tenant.name}</span>` : ""}
          </div>
          <div style="text-align: right;">
            <div><strong>${statusText}</strong></div>
            <div style="color: #666;">R$ ${apt.rentAmount.toFixed(2)}</div>
          </div>
        </div>
        `
        })
        .join("")}
    </div>
  </div>

  <div class="footer">
    <p>Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
    <p>Imóveis Frota - Sistema de Gestão de Propriedades</p>
  </div>
</body>
</html>
  `

  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(pdfContent)
    printWindow.document.close()
    printWindow.focus()
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }
}
