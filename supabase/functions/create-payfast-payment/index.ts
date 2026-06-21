import md5 from 'npm:md5@2.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Set to 'https://sandbox.payfast.co.za/eng/process' while testing, switch to
// 'https://www.payfast.co.za/eng/process' once you have live PayFast credentials.
const PAYFAST_URL = Deno.env.get('PAYFAST_URL') || 'https://sandbox.payfast.co.za/eng/process';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { order_id, amount, item_name } = await req.json();
    if (!order_id || !amount) return json({ error: 'order_id and amount are required' }, 400);

    const merchantId = Deno.env.get('PAYFAST_MERCHANT_ID');
    const merchantKey = Deno.env.get('PAYFAST_MERCHANT_KEY');
    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || '';
    const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');

    if (!merchantId || !merchantKey) return json({ error: 'PayFast credentials not configured' }, 500);

    const fields: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${siteUrl}/customer.html?order=${order_id}`,
      cancel_url: `${siteUrl}/customer.html?order=${order_id}&cancelled=1`,
      notify_url: `${supabaseUrl}/functions/v1/payfast-itn-webhook`,
      m_payment_id: order_id,
      amount: Number(amount).toFixed(2),
      item_name: item_name || `Order ${order_id}`,
    };

    fields.signature = buildSignature(fields, passphrase);

    return json({ url: PAYFAST_URL, fields });
  } catch (err) {
    console.error('create-payfast-payment error:', err);
    return json({ error: err instanceof Error ? err.message : 'Internal error' }, 500);
  }
});

function buildSignature(fields: Record<string, string>, passphrase: string): string {
  let pairs = Object.entries(fields)
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.toString().trim()).replace(/%20/g, '+')}`);
  if (passphrase) {
    pairs.push(`passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`);
  }
  return md5(pairs.join('&'));
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}
