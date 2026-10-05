
/* DB is now provided by store.js (LPStore) — no local copy needed here. */

// seed a demo admin account once
(function seed(){
  const users = DB.users();
  if(!users.find(u => u.email === 'admin@learnpath.com')){
    users.push({ name:'Admin', email:'admin@learnpath.com', password:'admin123', role:'admin' });
    DB.saveUsers(users);
  }
})();

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

/* ---------- tab switching ---------- */
const tabs = document.querySelectorAll('.auth-tabs button');
const views = document.querySelectorAll('.view');
function showView(name){
  tabs.forEach(b => b.classList.toggle('active', b.dataset.view === name));
  views.forEach(v => v.classList.toggle('active', v.id === 'view-' + name));
}
tabs.forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
document.querySelectorAll('[data-goto]').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); showView(a.dataset.goto); });
});

// open on tab from ?tab= or #reset
const params = new URLSearchParams(location.search);
if(location.hash === '#reset'){
  showView('reset');
  document.getElementById('reset-for-email').textContent =
    'Resetting password for ' + (params.get('email') || 'you@example.com');
} else if(params.get('tab')){
  showView(params.get('tab'));
}

/* ---------- LOGIN ---------- */
document.getElementById('login-form').addEventListener('submit', e => {
  e.preventDefault();
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-password');
  const alertBox = document.getElementById('login-alert');
  alertBox.classList.remove('show');

  const valid = lpValidate([
    { input: emailInput, test: () => LP_RULES.required(emailInput.value) && LP_RULES.email(emailInput.value), message: 'Enter a valid email address.' },
    { input: passInput,  test: () => LP_RULES.required(passInput.value), message: 'Password is required.' },
  ]);
  if(!valid) return;

  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput.value;
  const user = DB.users().find(u => u.email.toLowerCase() === email && u.password === pass);
  if(!user){
    alertBox.textContent = 'Email or password is incorrect.';
    alertBox.classList.add('show');
    return;
  }
  DB.setSession({ name:user.name, email:user.email, role:user.role });
  toast('Welcome back, ' + user.name + '!');
  setTimeout(() => location.href = 'dashboard.html', 500);
});

/* ---------- REGISTER ---------- */
document.getElementById('register-form').addEventListener('submit', e => {
  e.preventDefault();
  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passInput = document.getElementById('reg-password');
  const alertBox = document.getElementById('register-alert');
  alertBox.classList.remove('show');

  const valid = lpValidate([
    { input: nameInput,  test: () => LP_RULES.required(nameInput.value), message: 'Full name is required.' },
    { input: emailInput, test: () => LP_RULES.required(emailInput.value) && LP_RULES.email(emailInput.value), message: 'Enter a valid email address.' },
    { input: passInput,  test: () => LP_RULES.minLen(passInput.value, 6), message: 'Password must be at least 6 characters.' },
  ]);
  if(!valid) return;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const pass = passInput.value;
  const role = document.querySelector('input[name="role"]:checked').value;

  const users = DB.users();
  if(users.find(u => u.email.toLowerCase() === email)){
    alertBox.textContent = 'An account with that email already exists.';
    alertBox.classList.add('show');
    return;
  }
  users.push({ name, email, password:pass, role });
  DB.saveUsers(users);
  DB.setSession({ name, email, role });
  toast('Account created — welcome, ' + name + '!');
  setTimeout(() => location.href = 'dashboard.html', 500);
});

/* ---------- FORGOT PASSWORD ---------- */
document.getElementById('forgot-form').addEventListener('submit', e => {
  e.preventDefault();
  const emailInput = document.getElementById('forgot-email');
  const alertBox = document.getElementById('forgot-alert');
  alertBox.classList.remove('show');

  const valid = lpValidate([
    { input: emailInput, test: () => LP_RULES.required(emailInput.value) && LP_RULES.email(emailInput.value), message: 'Enter a valid email address.' },
  ]);
  if(!valid) return;

  const email = emailInput.value.trim().toLowerCase();
  const exists = DB.users().find(u => u.email.toLowerCase() === email);
  // for demo purposes we proceed either way, but message differs slightly
  alertBox.textContent = exists
    ? 'Reset link sent. Since this is a demo, click below to continue.'
    : 'If that email exists, a reset link has been sent. Since this is a demo, click below to continue.';
  alertBox.classList.add('show');
  const btn = document.createElement('a');
  btn.href = 'auth.html?email=' + encodeURIComponent(email) + '#reset';
  btn.className = 'btn btn-outline btn-block mt-16';
  btn.textContent = 'Continue to reset password →';
  alertBox.after(btn);
});

/* ---------- RESET PASSWORD ---------- */
document.getElementById('reset-form').addEventListener('submit', e => {
  e.preventDefault();
  const p1Input = document.getElementById('reset-password');
  const p2Input = document.getElementById('reset-password2');
  const alertBox = document.getElementById('reset-alert');
  alertBox.classList.remove('show');

  const valid = lpValidate([
    { input: p1Input, test: () => LP_RULES.minLen(p1Input.value, 6), message: 'Password must be at least 6 characters.' },
    { input: p2Input, test: () => p2Input.value === p1Input.value, message: 'Passwords do not match.' },
  ]);
  if(!valid) return;

  const email = (params.get('email') || '').toLowerCase();
  const p1 = p1Input.value;
  const users = DB.users();
  const user = users.find(u => u.email.toLowerCase() === email);
  if(!user){ alertBox.textContent = 'Could not find that account.'; alertBox.classList.add('show'); return; }
  user.password = p1;
  DB.saveUsers(users);
  toast('Password updated — please log in.');
  setTimeout(() => { location.href = 'auth.html'; showView('login'); }, 600);
});
