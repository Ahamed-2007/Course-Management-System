/* ============================================================
   LearnPath — shared app.js
   1) Dynamic navigation: builds + highlights the sidebar rail
      based on the current page/hash, from one config object.
   2) Form validation helpers: reusable inline field validation
      used across auth.html and courses.html forms.
   ============================================================ */

/* ---------------- 1. DYNAMIC NAVIGATION ---------------- */

const LP_NAV = {
  admin: [
    { href:'dashboard.html',              label:'⌂ Dashboard' },
    { href:'courses.html',                label:'▤ Manage courses' },
    { href:'dashboard.html#notifications',label:'🔔 Notifications' },
  ],
  student: [
    { href:'dashboard.html',              label:'⌂ Dashboard' },
    { href:'courses.html',                label:'▤ Browse courses' },
    { href:'courses.html#my',             label:'✓ My courses' },
    { href:'progress.html',               label:'◐ Progress' },
    { href:'dashboard.html#notifications',label:'🔔 Notifications' },
  ],
};

// remembers the last role/rail used so hash changes can re-render without a full reload
let __lpNavState = null;

function lpCurrentKey(){
  const page = location.pathname.split('/').pop() || 'index.html';
  return page + (location.hash || '');
}

function lpRenderNav(role, railId){
  __lpNavState = { role, railId };
  const items = LP_NAV[role] || LP_NAV.student;
  const page = location.pathname.split('/').pop() || 'index.html';
  const currentKey = lpCurrentKey();

  const html = items.map(it => {
    const itPage = it.href.split('#')[0];
    const hasHash = it.href.includes('#');
    // active if full href+hash matches exactly, OR it's the page-only link and we're on that
    // page with no hash currently set
    const isActive = it.href === currentKey || (!hasHash && itPage === page && !location.hash);
    return `<a href="${it.href}" class="${isActive ? 'active' : ''}">${it.label}</a>`;
  }).join('');

  const rail = document.getElementById(railId);
  if(rail) rail.innerHTML = html;
}

// re-render the rail automatically whenever the hash changes (dynamic nav across
// sections like courses.html -> #my, without needing a page reload)
window.addEventListener('hashchange', () => {
  if(__lpNavState) lpRenderNav(__lpNavState.role, __lpNavState.railId);
});

/* ---------------- 2. FORM VALIDATION ---------------- */

function lpFieldWrap(input){
  return input.closest('.field') || input.parentElement;
}

function lpShowError(input, message){
  const field = lpFieldWrap(input);
  field.classList.add('has-error');
  let err = field.querySelector('.error');
  if(!err){
    err = document.createElement('div');
    err.className = 'error';
    field.appendChild(err);
  }
  err.textContent = message;
}

function lpClearError(input){
  const field = lpFieldWrap(input);
  field.classList.remove('has-error');
}

/**
 * Validate a list of rules. Each rule: { input, test: fn()=>bool, message }
 * Clears all fields first, then flags failing ones. Returns true only if
 * every rule passes. Also wires "clear on input" so errors disappear as
 * the user corrects the field.
 */
function lpValidate(rules){
  let allValid = true;
  rules.forEach(rule => {
    lpClearError(rule.input);
    if(!rule.test()){
      lpShowError(rule.input, rule.message);
      allValid = false;
    }
    if(!rule.input.dataset.lpBound){
      rule.input.dataset.lpBound = '1';
      rule.input.addEventListener('input', () => lpClearError(rule.input));
    }
  });
  return allValid;
}

/* ---------------- 3. MOBILE NAV TOGGLES ---------------- */

// toggles the sidebar rail as an overlay drawer on small screens
// (dashboard.html, courses.html, progress.html)
function lpToggleRail(){
  document.getElementById('rail')?.classList.toggle('mobile-open');
  document.getElementById('rail-backdrop')?.classList.toggle('show');
}

// toggles the topbar's own nav links as a dropdown on small screens
// (index.html, learning.html, or any page without a sidebar)
function lpToggleTopbarNav(){
  document.querySelector('.topbar nav')?.classList.toggle('force-show');
}

/* Common reusable field tests */
const LP_RULES = {
  required: v => v.trim().length > 0,
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
  minLen: (v, n) => v.length >= n,
};

