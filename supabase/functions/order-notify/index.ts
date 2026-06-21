import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const STATUS_COPY: Record<string, string> = {
  pending: "We've received your order and sent it to the restaurant.",
  accepted: 'The restaurant has accepted your order.',
  preparing: 'Your order is being prepared.',
  ready: 'Your order is ready and waiting for a driver.',
  picked_up: 'A driver has picked up your order and is on the way.',
  delivered: 'Your order has been delivered. Enjoy!',
  cancelled: 'Your order has been cancelled.',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { order_id } = await req.json();
    if (!order_id) return json({ error: 'order_id is required' }, 400);

    const resendKey = Deno.env.get('RESEND_API_KEY');
    if (!resendKey) return json({ error: 'RESEND_API_KEY not set' }, 500);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const { data: order, error } = await supabase
      .from('orders')
      .select('*, restaurants(name), profiles:customer_id(full_name)')
      .eq('id', order_id)
      .single();
    if (error || !order) return json({ error: 'Order not found' }, 404);

    const { data: authUser } = await supabase.auth.admin.getUserById(order.customer_id);
    const email = authUser?.user?.email;
    if (!email) return json({ error: 'Customer email not found' }, 404);

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:520px;margin:0 auto;color:#1a1d29">
        <div style="background:#1a1d29;padding:24px 28px;border-radius:12px 12px 0 0">
          <span style="font-size:1.5rem;font-weight:900;color:#fff">Extro<span style="color:#ff5a3c">.</span></span>
        </div>
        <div style="background:#f7f8fa;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="font-size:1.2rem;font-weight:800;margin:0 0 12px">${order.restaurants?.name || 'Your order'}</h2>
          <p style="font-size:0.95rem;line-height:1.7;color:#374151;margin:0 0 18px">
            ${STATUS_COPY[order.status] || `Order status: ${order.status}`}
          </p>
          <div style="background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px 18px">
            <p style="font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;margin:0 0 8px">Order total</p>
            <p style="font-size:1.1rem;font-weight:800;margin:0">R${Number(order.total).toFixed(2)}</p>
          </div>
          <p style="font-size:0.8rem;color:#9ca3af;margin-top:20px">Order #${order.id.slice(0, 8)}</p>
        </div>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Extro <onboarding@resend.dev>',
        to: [email],
        subject: `Order update — ${STATUS_COPY[order.status] ? order.status.replace('_', ' ') : 'update'}`,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) return json({ error: result.message || 'Email failed' }, 500);

    return json({ sent: true, id: result.id });
  } catch (err) {
    console.error('order-notify error:', err);
    return json({ error: err instanceof Error ? err.message : 'Internal error' }, 500);
  }
});

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
