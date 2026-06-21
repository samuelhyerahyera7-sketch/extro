async function sendOtp(email, role = 'driver') {
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
