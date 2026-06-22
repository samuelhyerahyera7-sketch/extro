async function signInWithPassword(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  await sb.auth.signOut();
}

async function getCurrentProfile() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session?.user) return null;
  const { data: profile } = await sb.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
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
