async function sendOtp(email, role = 'customer') {
  if (window.DEMO_MODE) return { data: {}, error: null };
  const { data, error } = await sb.auth.signInWithOtp({
    email,
    options: { data: { role }, shouldCreateUser: true },
  });
  return { data, error };
}

async function verifyOtp(email, token) {
  if (window.DEMO_MODE) return { data: {}, error: null };
  const { data, error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
  return { data, error };
}

async function sendPhoneOtp(phone, role = 'customer') {
  if (window.DEMO_MODE) return { data: {}, error: null };
  const { data, error } = await sb.auth.signInWithOtp({
    phone,
    options: { data: { role }, shouldCreateUser: true },
  });
  return { data, error };
}

async function verifyPhoneOtp(phone, token) {
  if (window.DEMO_MODE) return { data: {}, error: null };
  const { data, error } = await sb.auth.verifyOtp({ phone, token, type: 'sms' });
  return { data, error };
}

async function signOut() {
  await sb.auth.signOut();
}

async function getCurrentProfile() {
  if (window.DEMO_MODE) return window.DEMO_PROFILE;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;

  let { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();

  if (!profile) {
    // Profile missing — create it now that we know the session is active
    await sb.from('profiles').upsert(
      { id: user.id, role: 'customer', phone: user.phone || null },
      { onConflict: 'id', ignoreDuplicates: true }
    );
    const { data: created } = await sb.from('profiles').select('*').eq('id', user.id).maybeSingle();
    profile = created;
  }

  return profile;
}

async function requireRole(expectedRole, loginPage = 'index.html') {
  const profile = await getCurrentProfile();
  const qs = window.DEMO_MODE ? window.location.search : '';
  if (!profile) {
    window.location.href = loginPage + qs;
    return null;
  }
  return profile;
}
