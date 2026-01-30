import nodemailer from 'nodemailer'

// Configurar transportador de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendGoalCompletedEmail(
  userEmail: string,
  userName: string,
  goalTitle: string,
  targetValue: number,
  metric: string
) {
  // Se não houver configuração SMTP, apenas logar
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 [DEMO MODE] Email de meta atingida:', {
      to: userEmail,
      goal: goalTitle,
      value: targetValue,
    })
    return { success: true, mode: 'demo' }
  }

  const metricLabels: Record<string, string> = {
    sales: 'Vendas',
    revenue: 'Receita',
    leads: 'Leads',
    conversions: 'Conversões',
    clicks: 'Cliques',
  }

  const metricLabel = metricLabels[metric] || metric

  try {
    await transporter.sendMail({
      from: `"Sistema de Funis" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `🎉 Meta Atingida: ${goalTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .metric-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 8px; }
            .metric-value { font-size: 32px; font-weight: bold; color: #10b981; margin: 10px 0; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Parabéns ${userName}!</h1>
              <p>Você atingiu sua meta!</p>
            </div>
            <div class="content">
              <h2>${goalTitle}</h2>
              <div class="metric-box">
                <p style="margin: 0; color: #6b7280;">Meta de ${metricLabel}</p>
                <div class="metric-value">${targetValue.toLocaleString('pt-BR')}</div>
                <p style="margin: 0; color: #10b981; font-weight: bold;">✅ META ALCANÇADA!</p>
              </div>
              <p>
                Excelente trabalho! Você alcançou sua meta de ${metricLabel.toLowerCase()}.
                Continue acompanhando suas métricas para alcançar ainda mais resultados.
              </p>
              <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">
                Ver Dashboard
              </a>
            </div>
            <div class="footer">
              <p>Este é um email automático do Sistema de Funis de Vendas</p>
              <p>Para mais informações, acesse seu painel de controle.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    return { success: true, mode: 'sent' }
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return { success: false, error }
  }
}
