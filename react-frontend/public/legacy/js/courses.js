
/* DB is now provided by store.js (LPStore) — no local copy needed here. */
const session = DB.session();
if(!session){ location.href = 'auth.html'; }
document.getElementById('user-chip').textContent = session.name + ' · ' + (session.role === 'admin' ? 'Admin' : 'Student');

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

lpRenderNav(session.role, 'rail');

/* ============ BROWSE ============ */
function viewBrowse(){
  const courses = DB.courses();
  const cats = [...new Set(courses.map(c=>c.category))];
  const enrolls = DB.enrollments().filter(e=>e.email===session.email).map(e=>e.courseId);

  document.getElementById('view').innerHTML = `
    <div class="page-head">
      <div><h1 style="font-size:24px;">Browse courses</h1><p class="mb-0">Find your next path.</p></div>
      ${session.role==='admin' ? `<a href="#new" class="btn btn-primary">+ Add course</a>` : ''}
    </div>
    <div class="filters">
      <input type="text" id="search" placeholder="Search courses...">
      <select id="cat-filter"><option value="">All categories</option>${cats.map(c=>`<option value="${c}">${c}</option>`).join('')}</select>
    </div>
    <div class="course-grid" id="grid"></div>
  `;
  function draw(){
    const q = document.getElementById('search').value.toLowerCase();
    const cat = document.getElementById('cat-filter').value;
    const filtered = courses.filter(c =>
      (!q || c.title.toLowerCase().includes(q)) && (!cat || c.category===cat));
    document.getElementById('grid').innerHTML = filtered.length ? filtered.map(c => `
      <div class="course-card">
        ${enrolls.includes(c.id) ? `<div class="ribbon">Enrolled</div>` : ''}
        <div class="thumb"><span class="cat">${c.category}</span></div>
        <div class="body">
          <h4>${c.title}</h4>
          <p class="text-sm mb-0">${c.description}</p>
          <div class="meta"><span>${c.level}</span><span>${c.modules.reduce((s,m)=>s+m.lessons.length,0)} lessons</span></div>
          <div class="footer">
            <span class="badge badge-muted">${c.instructor}</span>
            <a class="btn btn-outline btn-sm" href="#details-${c.id}">View</a>
          </div>
        </div>
      </div>`).join('') : `<div class="empty-state" style="grid-column:1/-1;"><div class="mark-lg">◌</div>No courses match your search.</div>`;
  }
  document.getElementById('search').addEventListener('input', draw);
  document.getElementById('cat-filter').addEventListener('change', draw);
  draw();
}

/* ============ DETAILS ============ */
function viewDetails(id){
  const course = DB.courses().find(c=>c.id===id);
  if(!course){ location.hash=''; return; }
  const enrolled = DB.enrollments().find(e=>e.email===session.email && e.courseId===id);

  document.getElementById('view').innerHTML = `
    <a href="#" class="text-sm">← Back to courses</a>
    <div class="details-hero mt-16">
      <div class="cat">${course.category} · ${course.level}</div>
      <h1>${course.title}</h1>
      <p>${course.description}</p>
      <div class="flex gap-12 mt-16">
        ${enrolled
          ? `<a class="btn btn-gold" href="learning.html?course=${course.id}">Continue learning</a>`
          : `<button class="btn btn-gold" id="enroll-btn">Enroll now</button>`}
        <span class="badge" style="background:rgba(255,255,255,.15);color:#fff;">By ${course.instructor}</span>
      </div>
    </div>
    <div class="card card-pad">
      <h3 style="font-size:16px;">Course content</h3>
      ${course.modules.map(m => `
        <div class="module-block">
          <h4>${m.title}</h4>
          ${m.lessons.map(l => `<div class="lesson-row"><span>${l.title}</span><span class="text-muted mono">${l.duration}</span></div>`).join('')}
        </div>`).join('')}
    </div>
  `;
  document.querySelector('a[href="#"]').addEventListener('click', e=>{e.preventDefault(); location.hash='';});
  const btn = document.getElementById('enroll-btn');
  if(btn) btn.addEventListener('click', () => {
    const enrolls = DB.enrollments();
    enrolls.push({ email:session.email, courseId:course.id, completed:[], enrolledAt:new Date().toISOString().slice(0,10) });
    DB.saveEnrollments(enrolls);
    location.hash = 'success-' + course.id;
  });
}

/* ============ ENROLLMENT SUCCESS ============ */
function viewSuccess(id){
  const course = DB.courses().find(c=>c.id===id);
  document.getElementById('view').innerHTML = `
    <div class="success-box card card-pad">
      <div class="check">✓</div>
      <h2 style="font-size:22px;">You're enrolled!</h2>
      <p>You've successfully enrolled in <strong>${course ? course.title : 'this course'}</strong>. Your path starts now.</p>
      <div class="flex gap-12" style="justify-content:center;">
        <a class="btn btn-primary" href="learning.html?course=${id}">Start learning</a>
        <a class="btn btn-outline" href="#my">My courses</a>
      </div>
    </div>
  `;
}

/* ============ MY COURSES ============ */
function viewMy(){
  const enrolls = DB.enrollments().filter(e=>e.email===session.email);
  const courses = DB.courses();
  const mine = enrolls.map(e => ({...e, course: courses.find(c=>c.id===e.courseId)})).filter(x=>x.course);
  document.getElementById('view').innerHTML = `
    <h1 style="font-size:24px;">My courses</h1>
    <p class="mb-0">Everything you're enrolled in.</p>
    <div class="course-grid mt-24">
    ${mine.length ? mine.map(e => {
      const total = e.course.modules.reduce((s,m)=>s+m.lessons.length,0);
      const pct = total ? Math.round((e.completed.length/total)*100) : 0;
      return `
      <div class="course-card">
        <div class="ribbon">${pct}%</div>
        <div class="thumb"><span class="cat">${e.course.category}</span></div>
        <div class="body">
          <h4>${e.course.title}</h4>
          <div class="meta"><span>Enrolled ${e.enrolledAt}</span></div>
          <div class="footer">
            <a class="btn btn-outline btn-sm" href="#details-${e.course.id}">Details</a>
            <a class="btn btn-primary btn-sm" href="learning.html?course=${e.course.id}">${pct===100?'Review':'Continue'}</a>
          </div>
        </div>
      </div>`;
    }).join('') : `<div class="empty-state" style="grid-column:1/-1;"><div class="mark-lg">◌</div>No enrollments yet.<div class="mt-16"><a href="#" class="btn btn-primary btn-sm">Browse courses</a></div></div>`}
    </div>
  `;
  const b = document.querySelector('#view .empty-state a');
  if(b) b.addEventListener('click', e=>{e.preventDefault(); location.hash='';});
}

/* ============ ADD / EDIT (admin) ============ */
function viewForm(editId){
  if(session.role !== 'admin'){ location.hash=''; return; }
  const course = editId ? DB.courses().find(c=>c.id===editId) : null;
  document.getElementById('view').innerHTML = `
    <h1 style="font-size:24px;">${course ? 'Edit course' : 'Add a new course'}</h1>
    <p class="mb-0">${course ? 'Update the details below.' : 'Fill in the details to publish a new course.'}</p>
    <div class="card card-pad mt-24" style="max-width:640px;">
      <form id="course-form">
        <div class="field"><label>Title</label><input type="text" id="f-title" required value="${course?course.title:''}"></div>
        <div class="form-grid">
          <div class="field"><label>Category</label><input type="text" id="f-cat" required value="${course?course.category:''}"></div>
          <div class="field"><label>Level</label>
            <select id="f-level">
              ${['Beginner','Intermediate','Advanced'].map(l=>`<option ${course&&course.level===l?'selected':''}>${l}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field"><label>Description</label><textarea id="f-desc" rows="3" required>${course?course.description:''}</textarea></div>
        <div class="field"><label>First module title</label><input type="text" id="f-mod" value="${course?course.modules[0]?.title||'':'Getting started'}"></div>
        <div class="field"><label>First lesson title</label><input type="text" id="f-lesson" value="${course?course.modules[0]?.lessons[0]?.title||'':'Introduction'}"></div>
        <div class="flex gap-12 mt-16">
          <button class="btn btn-primary" type="submit">${course?'Save changes':'Publish course'}</button>
          ${course? `<button class="btn btn-danger" type="button" id="del-btn">Delete course</button>` : ''}
        </div>
      </form>
    </div>
  `;
  document.getElementById('course-form').addEventListener('submit', e=>{
    e.preventDefault();
    const titleInput = document.getElementById('f-title');
    const catInput = document.getElementById('f-cat');
    const descInput = document.getElementById('f-desc');

    const valid = lpValidate([
      { input: titleInput, test: () => LP_RULES.required(titleInput.value), message: 'Course title is required.' },
      { input: catInput,   test: () => LP_RULES.required(catInput.value), message: 'Category is required.' },
      { input: descInput,  test: () => LP_RULES.required(descInput.value), message: 'Description is required.' },
    ]);
    if(!valid) return;

    const courses = DB.courses();
    const data = {
      title: titleInput.value.trim(),
      category: catInput.value.trim(),
      level: document.getElementById('f-level').value,
      description: descInput.value.trim(),
      instructor: session.name,
    };
    if(course){
      Object.assign(course, data);
      if(course.modules[0]) course.modules[0].title = document.getElementById('f-mod').value.trim() || course.modules[0].title;
      if(course.modules[0]?.lessons[0]) course.modules[0].lessons[0].title = document.getElementById('f-lesson').value.trim() || course.modules[0].lessons[0].title;
      DB.saveCourses(courses);
      toast('Course updated.');
    } else {
      const newCourse = { id:'c'+Date.now(), ...data,
        modules:[{ title: document.getElementById('f-mod').value.trim()||'Getting started',
                   lessons:[{ title: document.getElementById('f-lesson').value.trim()||'Introduction', duration:'10 min' }] }] };
      courses.push(newCourse);
      DB.saveCourses(courses);
      toast('Course published.');
    }
    location.hash = '';
  });
  const del = document.getElementById('del-btn');
  if(del) del.addEventListener('click', () => {
    if(!confirm('Delete this course? This cannot be undone.')) return;
    DB.saveCourses(DB.courses().filter(c=>c.id!==course.id));
    toast('Course deleted.');
    location.hash = '';
  });
}

/* ============ ROUTER ============ */
function route(){
  const h = location.hash.replace('#','');
  if(h === 'my') return viewMy();
  if(h === 'new') return viewForm(null);
  if(h.startsWith('edit-')) return viewForm(h.replace('edit-',''));
  if(h.startsWith('details-')) return viewDetails(h.replace('details-',''));
  if(h.startsWith('success-')) return viewSuccess(h.replace('success-',''));
  const params = new URLSearchParams(location.search);
  if(params.get('edit')) return viewForm(params.get('edit'));
  viewBrowse();
}
window.addEventListener('hashchange', route);
route();
