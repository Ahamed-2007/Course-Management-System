import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Progress() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .prog-card{ display:flex; gap:20px; align-items:center; padding:20px; margin-bottom:16px; }
  .prog-card .info{ flex:1; }
  .prog-card .path{ margin-top:14px; }
  .cert-wrap{ max-width:760px; margin:0 auto; }
  .certificate{
    border:2px solid var(--gold); border-radius:var(--radius); padding:56px 48px; text-align:center;
    background:
      radial-gradient(circle at 0% 0%, rgba(217,142,59,.08), transparent 40%),
      radial-gradient(circle at 100% 100%, rgba(46,90,172,.08), transparent 40%),
      var(--card);
    position:relative;
  }
  .certificate::before{
    content:''; position:absolute; inset:10px; border:1px solid var(--border); border-radius:6px; pointer-events:none;
  }
  .certificate .eyebrow{ font-family:var(--font-mono); font-size:11.5px; letter-spacing:.1em; color:var(--gold); text-transform:uppercase; }
  .certificate h1{ font-size:34px; margin:14px 0 4px; }
  .certificate .name{ font-family:var(--font-display); font-size:26px; color:var(--blue); margin:18px 0 6px; }
  .certificate .course-name{ font-size:18px; font-weight:600; margin-bottom:18px; }
  .certificate .seal{ width:70px;height:70px; border-radius:50%; border:3px solid var(--gold); display:flex; align-items:center; justify-content:center; margin:20px auto 0; color:var(--gold); font-family:var(--font-display); font-weight:700; }
  .certificate .sig-row{ display:flex; justify-content:space-between; margin-top:36px; padding:0 30px; }
  .certificate .sig{ font-family:var(--font-display); font-size:15px; border-top:1px solid var(--border); padding-top:6px; width:160px; }

      ` }} />
      <>
      <div className="topbar">
        <div className="flex gap-12" style={{alignItems: "center"}}>
          <button className="nav-toggle" onClick={() => { lpToggleRail(); }} aria-label="Toggle menu">☰</button>
          <div className="brand">
            <span className="mark"></span>
            LearnPath
          </div>
        </div>
        <nav>
          <a href="courses.html">Browse courses</a>
          <a href="dashboard.html" className="btn btn-outline btn-sm">Dashboard</a>
        </nav>
      </div>
      <div className="rail-backdrop" id="rail-backdrop" onClick={() => { lpToggleRail(); }}></div>
      <div className="shell">
        <aside className="rail" id="rail"></aside>
        <main className="main" id="view"></main>
      </div>
      </>
            <LegacyScript src="/legacy/js/store.js" />
            <LegacyScript src="/legacy/js/app.js" />
            <LegacyScript src="/legacy/js/progress.js" />
    </>
  );
}
