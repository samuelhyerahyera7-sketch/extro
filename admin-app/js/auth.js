async function signInWithPassword(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function sendOtp(email) {
  const { data, error } = await sb.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false },
  });
  return { data, error };
}

async function verifyOtp(email, token) {
  const { data, error } = await sb.auth.verifyOtp({ email, token, type: 'email' });
  return { data, error };
}

async function signOut() {
  await sb.auth.signOut();
}

async function getCurrentProfile() {
  const { data: { user } } = await sb.auth.getUser();
  if (!user) return null;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return profile;
}

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== 'admin') {
    window.location.href = 'index.html';
    return null;
  }
  return profile;
}
