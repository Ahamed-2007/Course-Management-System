
/* DB is now provided by store.js (LPStore) — no local copy needed here. */
const session = DB.session();
if(!session){ location.href = 'auth.html'; }

const params = new URLSearchParams(location.search);
const courseId = params.get('course');
const course = DB.courses().find(c=>c.id===courseId);
if(!course){ location.href = 'courses.html'; }

let enrollments = DB.enrollments();
let enrollment = enrollments.find(e=>e.email===session.email && e.courseId===courseId);
if(!enrollment){
  enrollment = { email:session.email, courseId, completed:[], enrolledAt:new Date().toISOString().slice(0,10) };
  enrollments.push(enrollment);
  DB.saveEnrollments(enrollments);
}

// flatten lessons with ids "modIdx-lessonIdx"
const flatLessons = [];
course.modules.forEach((m,mi)=> m.lessons.forEach((l,li)=> flatLessons.push({ id:`${mi}-${li}`, mod:m.title, ...l })));

let currentId = location.hash.replace('#','') || (flatLessons.find(l=>!enrollment.completed.includes(l.id))?.id) || flatLessons[0].id;

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

function renderRail(){
  let html = `<h4>${course.title}</h4>`;
  course.modules.forEach((m,mi) => {
    html += `<div class="mod-title">${m.title}</div>`;
    m.lessons.forEach((l,li) => {
      const id = `${mi}-${li}`;
      const done = enrollment.completed.includes(id);
      html += `<div class="lesson-link ${id===currentId?'active':''} ${done?'done':''}" data-id="${id}">
        <span class="dot"></span><span>${l.title}</span></div>`;
    });
  });
  document.getElementById('content-rail').innerHTML = html;
  document.querySelectorAll('.lesson-link').forEach(el => {
    el.addEventListener('click', () => { currentId = el.dataset.id; location.hash = currentId; renderAll(); });
  });
}

function renderMain(){
  const lesson = flatLessons.find(l=>l.id===currentId);
  const idx = flatLessons.findIndex(l=>l.id===currentId);
  const done = enrollment.completed.includes(currentId);
  const materials = [
    { name: lesson.title + ' — slides.pdf', size:'1.2 MB' },
    { name: 'Lesson notes.pdf', size:'340 KB' },
  ];

  document.getElementById('learn-main').innerHTML = `
    <p class="text-sm text-muted mb-0">${course.title} · ${lesson.mod}</p>
    <h1 style="font-size:22px;margin-top:4px;">${lesson.title}</h1>

    <div class="player" id="player">
      <div class="play-btn" id="play-btn">▶</div>
      <span class="caption">${lesson.duration} · ${done?'Watched':'Not started'}</span>
      <div class="progress-bar" id="progress-bar"></div>
    </div>

    <div class="tabs">
      <button class="active" data-tab="content">Content</button>
      <button data-tab="materials">Materials</button>
    </div>
    <div class="tabpane active" id="tab-content">
      <p>This lesson covers <strong>${lesson.title.toLowerCase()}</strong> as part of the “${lesson.mod}” module. Watch the video, then mark the lesson complete to keep your path moving forward.</p>
    </div>
    <div class="tabpane" id="tab-materials">
      ${materials.map(m => `
        <div class="material-row">
          <div class="flex" style="align-items:center;"><span class="icon">PDF</span><div><div style="font-weight:600;font-size:13.5px;">${m.name}</div><div class="text-sm text-muted mb-0">${m.size}</div></div></div>
          <button class="btn btn-outline btn-sm" onclick="toast('Downloaded ${m.name}')">Download</button>
        </div>`).join('')}
    </div>

    <div class="lesson-foot">
      <button class="btn btn-outline" id="prev-btn" ${idx===0?'disabled':''}>← Previous</button>
      <button class="btn ${done?'btn-outline':'btn-primary'}" id="complete-btn">${done?'Completed ✓':'Mark as complete'}</button>
      <button class="btn btn-outline" id="next-btn" ${idx===flatLessons.length-1?'disabled':''}>Next →</button>
    </div>
  `;

  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));
    document.querySelectorAll('.tabpane').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');
    document.getElementById('tab-'+b.dataset.tab).classList.add('active');
  }));

  const player = document.getElementById('player');
  player.addEventListener('click', () => {
    player.classList.add('playing');
    let p = 0;
    const bar = document.getElementById('progress-bar');
    const iv = setInterval(() => {
      p += 4; bar.style.width = Math.min(p,100) + '%';
      if(p >= 100){ clearInterval(iv); player.classList.remove('playing'); }
    }, 120);
  });

  document.getElementById('complete-btn').addEventListener('click', () => {
    if(!enrollment.completed.includes(currentId)){
      enrollment.completed.push(currentId);
      DB.saveEnrollments(enrollments);
      toast('Lesson marked complete.');
      renderAll();
      if(enrollment.completed.length === flatLessons.length){
        setTimeout(()=>{ if(confirm('You finished the course! View your certificate now?')) location.href='progress.html?course='+course.id; }, 300);
      }
    }
  });
  document.getElementById('prev-btn').addEventListener('click', () => { if(idx>0){ currentId=flatLessons[idx-1].id; location.hash=currentId; renderAll(); }});
  document.getElementById('next-btn').addEventListener('click', () => { if(idx<flatLessons.length-1){ currentId=flatLessons[idx+1].id; location.hash=currentId; renderAll(); }});
}

function renderAll(){ renderRail(); renderMain(); }
renderAll();
