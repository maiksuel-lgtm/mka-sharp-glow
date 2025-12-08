import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const requestSchema = z.object({
  clientName: z.string().min(1, "Name is required").max(100, "Name too long"),
  clientPhone: z.string().min(1, "Phone is required").max(30, "Phone too long"),
  bookingDate: z.string().min(1, "Date is required"),
  bookingTime: z.string().min(1, "Time is required"),
  haircutStyle: z.string().min(1, "Style is required").max(100, "Style too long"),
  comment: z.string().max(500, "Comment too long").optional().nullable(),
});

// HTML escape function to prevent injection
const escapeHtml = (str: string | null | undefined): string => {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

Deno.serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    
    // Validate input
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      console.error('Validation error:', parseResult.error.errors);
      return new Response(
        JSON.stringify({ error: 'Invalid input data', details: parseResult.error.errors }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    const { clientName, clientPhone, bookingDate, bookingTime, haircutStyle, comment } = parseResult.data;

    console.log('Sending booking notification email for:', clientName);

    const adminEmail = Deno.env.get('ADMIN_EMAIL');
    
    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL not configured');
    }

    // Format the date for better readability
    const formattedDate = new Date(bookingDate).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Escape all user inputs to prevent HTML injection
    const safeClientName = escapeHtml(clientName);
    const safeClientPhone = escapeHtml(clientPhone);
    const safeHaircutStyle = escapeHtml(haircutStyle);
    const safeComment = escapeHtml(comment);
    const safeFormattedDate = escapeHtml(formattedDate);
    const safeBookingTime = escapeHtml(bookingTime);
    
    // Sanitize phone number for WhatsApp link (only digits)
    const whatsappPhone = clientPhone.replace(/\D/g, '');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background: linear-gradient(135deg, #D4AF37 0%, #F4E4C1 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
          <h1 style="color: #1a1a1a; margin: 0; font-size: 28px;">✂️ Novo Agendamento</h1>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #D4AF37; margin-top: 0; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            Detalhes do Cliente
          </h2>
          
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #555;">Nome Completo:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                ${safeClientName}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #555;">Telefone/WhatsApp:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                <a href="https://wa.me/${whatsappPhone}" style="color: #25D366; text-decoration: none;">
                  ${safeClientPhone}
                </a>
              </td>
            </tr>
          </table>

          <h2 style="color: #D4AF37; margin-top: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
            Informações do Agendamento
          </h2>
          
          <table style="width: 100%; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #555;">Data:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                ${safeFormattedDate}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #555;">Horário:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                ${safeBookingTime}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <strong style="color: #555;">Tipo de Corte/Serviço:</strong>
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right;">
                ${safeHaircutStyle}
              </td>
            </tr>
          </table>

          ${safeComment ? `
            <h2 style="color: #D4AF37; margin-top: 30px; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
              Observações Adicionais
            </h2>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #D4AF37; margin-bottom: 20px;">
              <p style="margin: 0; color: #555; font-style: italic;">${safeComment}</p>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0;">Este é um e-mail automático do sistema de agendamentos MkA Cortes</p>
          </div>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'MkA Cortes <onboarding@resend.dev>',
        to: [adminEmail],
        subject: 'Novo agendamento confirmado',
        html: htmlContent,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Resend API error:', data);
      throw new Error(data.message || 'Failed to send email');
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in send-booking-email function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
