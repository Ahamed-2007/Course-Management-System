
/* DB is now provided by store.js (LPStore) — no local copy needed here. */
const session = DB.session();
if(!session){ location.href = 'auth.html'; }
lpRenderNav(session.role, 'rail');

function ring(pct){
  const r = 36, c = 2*Math.PI*r;
  const offset = c - (pct/100)*c;
  return `<div class="ring"><svg width="88" height="88"><circle cx="44" cy="44" r="${r}" stroke="var(--paper-dim)" stroke-width="8" fill="none"/>
    <circle cx="44" cy="44" r="${r}" stroke="var(--gold)" stroke-width="8" fill="none" stroke-linecap="round"
      stroke-dasharray="${c}" stroke-dashoffset="${offset}"/></svg><div class="pct">${pct}%</div></div>`;
}

function viewOverview(){
  const courses = DB.courses();
  const mine = DB.enrollments().filter(e=>e.email===session.email)
    .map(e => ({...e, course: courses.find(c=>c.id===e.courseId)})).filter(x=>x.course);

  document.getElementById('view').innerHTML = `
    <h1 style="font-size:24px;">Your progress</h1>
    <p class="mb-0">Track how far you've come in every course.</p>
    <div class="mt-24">
    ${mine.length ? mine.map(e => {
      const total = e.course.modules.reduce((s,m)=>s+m.lessons.length,0);
      const pct = total ? Math.round((e.completed.length/total)*100) : 0;
      const flat = []; e.course.modules.forEach((m,mi)=>m.lessons.forEach((l,li)=>flat.push({id:`${mi}-${li}`,title:l.title})));
      return `
      <div class="card prog-card">
        ${ring(pct)}
        <div class="info">
          <strong>${e.course.title}</strong>
          <p class="text-sm mb-0">${e.completed.length} of ${total} lessons complete</p>
          <div class="path mt-8">
            ${flat.slice(0,4).map(l => `<span class="badge ${e.completed.includes(l.id)?'badge-green':'badge-muted'}" style="margin-right:6px;">${l.title}</span>`).join('')}
            ${flat.length>4 ? `<span class="badge badge-muted">+${flat.length-4} more</span>` : ''}
          </div>
        </div>
        <div>
          ${pct===100
            ? `<a class="btn btn-gold btn-sm" href="#cert-${e.course.id}">View certificate</a>`
            : `<a class="btn btn-outline btn-sm" href="learning.html?course=${e.course.id}">Continue</a>`}
        </div>
      </div>`;
    }).join('') : `<div class="empty-state card"><div class="mark-lg">◐</div>No progress yet — enroll in a course to start tracking.<div class="mt-16"><a href="courses.html" class="btn btn-primary btn-sm">Browse courses</a></div></div>`}
    </div>
  `;
}

function viewCertificate(courseId){
  const course = DB.courses().find(c=>c.id===courseId);
  const e = DB.enrollments().find(x=>x.email===session.email && x.courseId===courseId);
  const total = course.modules.reduce((s,m)=>s+m.lessons.length,0);
  const complete = e && e.completed.length === total;

  document.getElementById('view').innerHTML = `
    <a href="#" id="back-link" class="text-sm">← Back to progress</a>
    <div class="cert-wrap mt-16">
      ${complete ? `
      <div class="certificate">
        <div class="eyebrow">Certificate of Completion</div>
        <h1>LearnPath</h1>
        <p class="mb-0 text-sm">This certifies that</p>
        <div class="name">${session.name}</div>
        <p class="mb-0 text-sm">has successfully completed</p>
        <div class="course-name">${course.title}</div>
        <div class="seal">LP</div>
        <div class="sig-row">
          <div class="sig">Instructor<br>${course.instructor}</div>
          <div class="sig">Date<br>${new Date().toLocaleDateString()}</div>
        </div>
      </div>
      <div class="center mt-24"><button class="btn btn-primary" onclick="window.print()">Download / Print certificate</button></div>
      ` : `<div class="empty-state card"><div class="mark-lg">◐</div>You haven't finished this course yet — complete every lesson to unlock your certificate.
      <div class="mt-16"><a class="btn btn-primary btn-sm" href="learning.html?course=${courseId}">Resume course</a></div></div>`}
    </div>
  `;
  document.getElementById('back-link').addEventListener('click', e=>{e.preventDefault(); location.hash='';});
}

function route(){
  const h = location.hash.replace('#','');
  const params = new URLSearchParams(location.search);
  if(h.startsWith('cert-')) return viewCertificate(h.replace('cert-',''));
  if(params.get('course')) return viewCertificate(params.get('course'));
  viewOverview();
}
window.addEventListener('hashchange', route);
route();
