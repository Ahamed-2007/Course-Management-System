import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Courses() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .filters{ display:flex; gap:10px; margin-bottom:22px; flex-wrap:wrap; align-items:center; }
  .filters input[type=text]{ flex:1; min-width:200px; padding:10px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:14px; }
  .filters select{ padding:10px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); font-size:14px; background:#fff; }
  .page-head{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:22px; flex-wrap:wrap; gap:12px; }
  .details-hero{ background:linear-gradient(135deg,var(--blue),var(--blue-dark)); border-radius:var(--radius); padding:32px; color:#fff; margin-bottom:24px; }
  .details-hero .cat{ font-size:12px; text-transform:uppercase; letter-spacing:.06em; opacity:.85; }
  .details-hero h1{ color:#fff; font-size:28px; margin:8px 0; }
  .details-hero p{ color:rgba(255,255,255,.85); max-width:640px; }
  .module-block{ margin-bottom:14px; }
  .module-block h4{ font-size:14.5px; margin-bottom:8px; }
  .lesson-row{ display:flex; justify-content:space-between; padding:10px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:6px; font-size:13.5px; }
  .success-box{ text-align:center; padding:60px 20px; max-width:480px; margin:0 auto; }
  .success-box .check{ width:64px;height:64px;border-radius:50%; background:var(--green-soft); color:var(--green); display:flex; align-items:center; justify-content:center; font-size:28px; margin:0 auto 18px; }
  .form-grid{ display:grid; grid-template-columns:1fr 1fr; gap:0 16px; }

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
          <a href="courses.html" className="active">Browse courses</a>
          <span id="user-chip" className="text-sm text-muted"></span>
          <a href="dashboard.html" className="btn btn-outline btn-sm">Dashboard</a>
        </nav>
      </div>
      <div className="rail-backdrop" id="rail-backdrop" onClick={() => { lpToggleRail(); }}></div>
      <div className="shell">
        <aside className="rail" id="rail"></aside>
        <main className="main" id="view"></main>
      </div>
      <div className="toast" id="toast"></div>
      </>
            <LegacyScript src="/legacy/js/store.js" />
            <LegacyScript src="/legacy/js/app.js" />
            <LegacyScript src="/legacy/js/courses.js" />
    </>
  );
}
