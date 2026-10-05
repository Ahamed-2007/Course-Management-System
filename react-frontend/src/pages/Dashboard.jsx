import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Dashboard() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .greet{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:28px; flex-wrap:wrap; gap:16px; }
  .kpis{ display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:32px; }
  .kpi{ padding:18px; }
  .kpi .val{ font-family:var(--font-display); font-size:28px; }
  .kpi .lbl{ font-size:12.5px; color:var(--ink-soft); }
  .two-col{ display:grid; grid-template-columns:1.4fr 1fr; gap:20px; align-items:start; }
  .continue-card{ display:flex; gap:16px; align-items:center; padding:16px; border-bottom:1px solid var(--border); }
  .continue-card:last-child{ border-bottom:none; }
  .continue-card .thumb-sm{ width:56px;height:56px;border-radius:8px; background:linear-gradient(135deg,var(--blue),var(--blue-dark)); flex-shrink:0; }
  .continue-card .info{ flex:1; }
  .continue-card .bar{ height:6px; background:var(--paper-dim); border-radius:100px; margin-top:6px; overflow:hidden; }
  .continue-card .bar > div{ height:100%; background:var(--gold); }
  .notif-item{ display:flex; gap:12px; padding:14px 0; border-bottom:1px solid var(--border); }
  .notif-item:last-child{ border-bottom:none; }
  .notif-dot{ width:8px;height:8px;border-radius:50%; background:var(--blue); margin-top:6px; flex-shrink:0; }
  .notif-item.read .notif-dot{ background:var(--border); }
  .notif-item .body-txt{ font-size:13.5px; }
  .notif-item .time{ font-size:11.5px; color:var(--ink-soft); }
  .admin-table-card{ margin-bottom:24px; }
  @media (max-width:900px){ .kpis{ grid-template-columns:repeat(2,1fr); } .two-col{ grid-template-columns:1fr; } }

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
          <span id="user-chip" className="text-sm text-muted"></span>
          <a href="#" id="logout-link" className="btn btn-outline btn-sm">Log out</a>
        </nav>
      </div>
      <div className="rail-backdrop" id="rail-backdrop" onClick={() => { lpToggleRail(); }}></div>
      <div className="shell">
        <aside className="rail" id="rail"></aside>
        <main className="main" id="main-content">{/* filled by JS based on role */}</main>
      </div>
      </>
            <LegacyScript src="/legacy/js/store.js" />
            <LegacyScript src="/legacy/js/app.js" />
            <LegacyScript src="/legacy/js/dashboard.js" />
    </>
  );
}
