import md5 from 'npm:md5@2.3.0';
import { createClient } from 'npm:@supabase/supabase-js@2';

// PayFast posts application/x-www-form-urlencoded data to this endpoint (notify_url).
// Docs: https://developers.payfast.co.za/docs#notify_url

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  try {
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const fields: Record<string, string> = {};
    for (const [k, v] of params.entries()) fields[k] = v;

    const passphrase = Deno.env.get('PAYFAST_PASSPHRASE') || '';
    const receivedSignature = fields.signature;
    const expectedSignature = buildSignature(fields, passphrase);

    if (receivedSignature !== expectedSignature) {
      console.error('payfast-itn-webhook: signature mismatch');
      return new Response('Invalid signature', { status: 400 });
    }

    const orderId = fields.m_payment_id;
    const paymentStatus = fields.payment_status; // COMPLETE | FAILED | PENDING
    const paymentRef = fields.pf_payment_id;

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus === 'COMPLETE' ? 'paid' : 'failed',
        payment_ref: paymentRef,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return new Response('OK', { status: 200 });
  } catch (err) {
    console.error('payfast-itn-webhook error:', err);
    return new Response('Internal error', { status: 500 });
  }
});

function buildSignature(fields: Record<string, string>, passphrase: string): string {
  const ordered = Object.entries(fields).filter(([k]) => k !== 'signature');
  let pairs = ordered
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .map(([k, v]) => `${k}=${encodeURIComponent(v.toString().trim()).replace(/%20/g, '+')}`);
  if (passphrase) {
    pairs.push(`passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`);
  }
  return md5(pairs.join('&'));
}
