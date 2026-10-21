import './style.css';

const config = __PUBLIC_CONFIG__;
const $ = selector => document.querySelector(selector);
let session = null;

function message(title, description) {
  $('#info-title').textContent = title;
  $('#info-text').textContent = description;
  $('#info').showModal();
}

function comingSoon(day) {
  message(day ? `${day} de diciembre` : 'Triviadviento está en camino',
    'Estamos preparando las preguntas y las sorpresas. Todavía no se puede jugar. El calendario comenzará el 1 de diciembre de 2026.');
}

for (let day = 1; day <= 25; day++) {
  const button = document.createElement('button');
  button.className = `day${day === 25 ? ' final' : ''}`;
  button.type = 'button';
  button.setAttribute('aria-label', `${day} de diciembre, ${day === 25 ? 'gran final' : 'reto'} todavía no disponible`);
  button.innerHTML = day === 25
    ? '✦ <span>25</span><small>LA GRAN FINAL</small>'
    : `${String(day).padStart(2, '0')}<small>♧</small>`;
  button.addEventListener('click', () => comingSoon(day));
  $('#calendar').append(button);
}

function showRanking(daily) {
  $('#general').classList.toggle('selected', !daily);
  $('#daily').classList.toggle('selected', daily);
  $('#general').setAttribute('aria-pressed', String(!daily));
  $('#daily').setAttribute('aria-pressed', String(daily));
  $('#ranking-note').textContent = daily
    ? 'Los resultados del día se revelarán después de completar el reto. ¡Todavía estamos preparando el primero!'
    : 'Aquí empezará el pique. La clasificación se estrenará con los primeros retos de diciembre.';
}
$('#general').addEventListener('click', () => showRanking(false));
$('#daily').addEventListener('click', () => showRanking(true));
showRanking(false);

document.querySelectorAll('.close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
$('.close-info').addEventListener('click', () => $('#info').close());
$('#today').addEventListener('click', () => comingSoon());

async function supabaseRequest(path, options = {}, token) {
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: { apikey: config.key, ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    signal: AbortSignal.timeout(15000),
    cache: 'no-store'
  });
  return response;
}

$('#account').addEventListener('click', async () => {
  if (!session) {
    if (!config.url || !config.key) {
      message('Acceso próximamente', 'La portada está disponible. El acceso con cuenta se habilitará cuando termine la configuración.');
      return;
    }
    $('#auth-error').textContent = '';
    $('#login').showModal();
    return;
  }
  const current = session;
  session = null;
  $('#account').textContent = 'Entrar ↗';
  try { await supabaseRequest('/auth/v1/logout', { method: 'POST' }, current.token); } catch { /* Local session is already cleared. */ }
  message('Has salido de Triviadviento', 'Puedes volver a entrar con tu cuenta habitual.');
});

$('#login-form').addEventListener('submit', async event => {
  event.preventDefault();
  const submit = $('#submit');
  submit.disabled = true;
  submit.textContent = 'Entrando…';
  $('#auth-error').textContent = '';
  let token;
  try {
    const response = await supabaseRequest('/auth/v1/token?grant_type=password', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: $('#email').value.trim().toLowerCase(), password: $('#password').value })
    });
    if (!response.ok) throw new Error('No se pudo entrar. Comprueba tu correo y contraseña.');
    const data = await response.json();
    token = data.access_token;
    if (!token || !data.user?.id) throw new Error('No se pudo validar la sesión.');
    const profileResponse = await supabaseRequest(`/rest/v1/profiles?select=username&id=eq.${encodeURIComponent(data.user.id)}`, {}, token);
    if (!profileResponse.ok) throw new Error('No se pudo comprobar tu perfil. Inténtalo de nuevo.');
    const profiles = await profileResponse.json();
    if (!profiles[0]?.username) throw new Error('Tu cuenta no tiene un perfil habilitado.');
    session = { token };
    $('#account').textContent = `${profiles[0].username} · Salir`;
    $('#password').value = '';
    $('#login').close();
    message('Ya estás dentro ✦', 'Tu cuenta está conectada a Triviadviento. El juego todavía está en preparación.');
  } catch (error) {
    if (token) { try { await supabaseRequest('/auth/v1/logout', { method: 'POST' }, token); } catch {} }
    $('#auth-error').textContent = error.name === 'TimeoutError' ? 'La conexión ha tardado demasiado. Vuelve a intentarlo.' : error.message;
  } finally {
    submit.disabled = false;
    submit.textContent = 'Entrar →';
  }
});
$('#login').addEventListener('close', () => { $('#password').value = ''; });

document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button));
  (button.dataset.view === 'ranking' ? $('aside') : $('#calendar-panel')).scrollIntoView({
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start'
  });
}));
