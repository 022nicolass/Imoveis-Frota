import type { Property, Apartment } from "@/types"

export function generateTenantPDF(property: Property, apartment: Apartment, activeMonth: number, activeYear: number) {
  if (!apartment.tenant) return

  const tenant = apartment.tenant
  const payment = tenant.payments.find((p) => p.month === activeMonth && p.year === activeYear)

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

  // Create PDF content
  const pdfContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Relatório - ${apartment.identifier} - ${months[activeMonth - 1]} ${activeYear}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 210mm;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #d4c5a9;
    }
    
    .header h1 {
      color: #7a6f5d;
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    
    .header p {
      margin: 5px 0;
      color: #666;
    }
    
    .section {
      margin-bottom: 25px;
      page-break-inside: avoid;
    }
    
    .section-title {
      background-color: #f5f0e8;
      color: #5a5040;
      padding: 10px 15px;
      margin-bottom: 15px;
      font-size: 16px;
      font-weight: bold;
      border-left: 4px solid #d4c5a9;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .info-item {
      padding: 10px;
      background-color: #fafaf8;
      border-radius: 4px;
    }
    
    .info-label {
      font-size: 12px;
      color: #888;
      margin-bottom: 5px;
      text-transform: uppercase;
    }
    
    .info-value {
      font-size: 16px;
      color: #333;
      font-weight: 600;
    }
    
    .payment-status {
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    
    .payment-status.paid {
      background-color: #d4edda;
      border: 2px solid #28a745;
      color: #155724;
    }
    
    .payment-status.pending {
      background-color: #fff3cd;
      border: 2px solid #ffc107;
      color: #856404;
    }
    
    .payment-status h2 {
      margin: 0 0 10px 0;
      font-size: 22px;
    }
    
    .payment-status p {
      margin: 5px 0;
      font-size: 16px;
    }
    
    .history-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .history-table th {
      background-color: #e8ded0;
      color: #5a5040;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }
    
    .history-table td {
      padding: 10px 12px;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .history-table tr:last-child td {
      border-bottom: none;
    }
    
    .history-table tr:hover {
      background-color: #fafaf8;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      font-size: 12px;
      color: #888;
    }
    
    @media print {
      body {
        padding: 0;
      }
      
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Imóveis Frota</h1>
    <p><strong>Relatório de Inquilino</strong></p>
    <p>${months[activeMonth - 1]} ${activeYear}</p>
  </div>

  <div class="section">
    <div class="section-title">Dados do Imóvel</div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Nome do Imóvel</div>
        <div class="info-value">${property.name}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Apartamento</div>
        <div class="info-value">${apartment.identifier}</div>
      </div>
    </div>
    <div class="info-item" style="margin-bottom: 10px;">
      <div class="info-label">Endereço</div>
      <div class="info-value">${property.address}</div>
    </div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Registro ENEL</div>
        <div class="info-value">${property.enelRegistry}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Quadro Elétrico</div>
        <div class="info-value">${property.electricPanel}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Dados do Inquilino</div>
    <div class="info-item" style="margin-bottom: 10px;">
      <div class="info-label">Nome Completo</div>
      <div class="info-value">${tenant.name}</div>
    </div>
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">Telefone</div>
        <div class="info-value">${tenant.phone}</div>
      </div>
      <div class="info-item">
        <div class="info-label">CPF</div>
        <div class="info-value">${tenant.cpf}</div>
      </div>
      <div class="info-item">
        <div class="info-label">RG</div>
        <div class="info-value">${tenant.rg}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Dia de Vencimento</div>
        <div class="info-value">Dia ${tenant.dueDay}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Valor do Aluguel</div>
        <div class="info-value">R$ ${tenant.rentAmount.toFixed(2)}</div>
      </div>
      <div class="info-item">
        <div class="info-label">Contrato Ativo</div>
        <div class="info-value">${tenant.hasActiveContract ? "Sim" : "Não"}</div>
      </div>
    </div>
    ${
      tenant.observations
        ? `
    <div class="info-item" style="margin-top: 10px;">
      <div class="info-label">Observações</div>
      <div class="info-value">${tenant.observations}</div>
    </div>
    `
        : ""
    }
  </div>

  <div class="section">
    <div class="section-title">Status do Pagamento - ${months[activeMonth - 1]} ${activeYear}</div>
    ${
      payment
        ? `
    <div class="payment-status paid">
      <h2>✓ Pagamento Confirmado</h2>
      <p><strong>Valor:</strong> R$ ${payment.amount.toFixed(2)}</p>
      <p><strong>Data:</strong> ${new Date(payment.date).toLocaleDateString("pt-BR")}</p>
      <p><strong>Forma de Pagamento:</strong> ${getPaymentMethodLabel(payment.method)}</p>
    </div>
    `
        : `
    <div class="payment-status pending">
      <h2>⚠ Pagamento Pendente</h2>
      <p><strong>Valor:</strong> R$ ${tenant.rentAmount.toFixed(2)}</p>
      <p><strong>Vencimento:</strong> Dia ${tenant.dueDay}</p>
    </div>
    `
    }
  </div>

  ${
    tenant.payments.filter((p) => p.year >= 2026).length > 0
      ? `
  <div class="section">
    <div class="section-title">Histórico de Pagamentos (desde 2026)</div>
    <table class="history-table">
      <thead>
        <tr>
          <th>Mês/Ano</th>
          <th>Data de Pagamento</th>
          <th>Método</th>
          <th>Valor</th>
        </tr>
      </thead>
      <tbody>
        ${tenant.payments
          .filter((p) => p.year >= 2026)
          .sort((a, b) => {
            if (a.year !== b.year) return b.year - a.year
            return b.month - a.month
          })
          .map(
            (p) => `
        <tr>
          <td>${months[p.month - 1]} ${p.year}</td>
          <td>${new Date(p.date).toLocaleDateString("pt-BR")}</td>
          <td>${getPaymentMethodLabel(p.method)}</td>
          <td>R$ ${p.amount.toFixed(2)}</td>
        </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  `
      : ""
  }

  <div class="footer">
    <p>Relatório gerado em ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}</p>
    <p>Imóveis Frota - Sistema de Gestão de Propriedades</p>
  </div>
</body>
</html>
  `

  // Create a new window for printing
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(pdfContent)
    printWindow.document.close()
    printWindow.focus()

    // Wait for content to load before printing
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }
}
