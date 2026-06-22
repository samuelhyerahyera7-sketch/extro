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
  if (!error && data?.user) {
    await sb.from('profiles').upsert({ id: data.user.id, role: 'customer' }, { onConflict: 'id', ignoreDuplicates: true });
  }
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
  if (!error && data?.user) {
    await sb.from('profiles').upsert({ id: data.user.id, role: 'customer', phone: data.user.phone }, { onConflict: 'id', ignoreDuplicates: true });
  }
  return { data, error };
}

async function signOut() {
  await sb.auth.signOut();
}

async function getCurrentProfile() {
  if (window.DEMO_MODE) return window.DEMO_PROFILE;
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: profile } = await sb
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  return profile;
}

async function requireRole(expectedRole, loginPage = 'index.html') {
  const profile = await getCurrentProfile();
  const qs = window.DEMO_MODE ? window.location.search : '';
  if (!profile) {
    window.location.href = loginPage + qs;
    return null;
  }
  if (profile.role !== expectedRole) {
    window.location.href = `index.html${qs}`;
    return null;
  }
  return profile;
}
