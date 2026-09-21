import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Learning() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .learn-shell{ display:flex; min-height:calc(100vh - 65px); }
  .content-rail{ width:280px; flex-shrink:0; border-right:1px solid var(--border); background:var(--paper-dim); padding:20px 14px; overflow-y:auto; }
  .content-rail h4{ font-size:13px; padding:0 8px; margin-bottom:10px; }
  .mod-title{ font-size:11.5px; text-transform:uppercase; letter-spacing:.05em; color:var(--ink-soft); padding:14px 8px 6px; }
  .lesson-link{ display:flex; align-items:center; gap:10px; padding:9px 10px; border-radius:var(--radius-sm); font-size:13.5px; color:var(--ink-soft); cursor:pointer; }
  .lesson-link:hover{ background:var(--paper); }
  .lesson-link.active{ background:var(--card); color:var(--blue); box-shadow:var(--shadow); font-weight:600; }
  .lesson-link .dot{ width:16px;height:16px;border-radius:50%; border:2px solid var(--border); flex-shrink:0; }
  .lesson-link.done .dot{ background:var(--green); border-color:var(--green);
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='white'%3E%3Cpath d='M8 13.4 4.6 10l-1.4 1.4L8 16.2 17 7.2 15.6 5.8z'/%3E%3C/svg%3E");
    background-size:11px; background-repeat:no-repeat; background-position:center; }

  .learn-main{ flex:1; padding:32px 40px; max-width:900px; }
  .player{
    aspect-ratio:16/9; background:linear-gradient(135deg,#111827,#1F2937); border-radius:var(--radius);
    display:flex; align-items:center; justify-content:center; color:#fff; position:relative; overflow:hidden; margin-bottom:20px;
    cursor:pointer;
  }
  .player .play-btn{ width:66px;height:66px;border-radius:50%; background:rgba(255,255,255,.15); border:2px solid rgba(255,255,255,.6);
    display:flex; align-items:center; justify-content:center; font-size:22px; backdrop-filter:blur(2px); }
  .player .caption{ position:absolute; bottom:16px; left:20px; font-size:13px; opacity:.85; }
  .player.playing .play-btn{ display:none; }
  .player .progress-bar{ position:absolute; bottom:0; left:0; height:3px; background:var(--gold); width:0%; transition:width .2s linear; }

  .tabs{ display:flex; gap:4px; border-bottom:1px solid var(--border); margin-bottom:18px; }
  .tabs button{ background:none; border:none; padding:10px 16px; font-weight:600; font-size:13.5px; color:var(--ink-soft); cursor:pointer; border-bottom:2px solid transparent; }
  .tabs button.active{ color:var(--blue); border-color:var(--blue); }
  .tabpane{ display:none; } .tabpane.active{ display:block; }
  .material-row{ display:flex; align-items:center; justify-content:space-between; padding:12px 14px; border:1px solid var(--border); border-radius:var(--radius-sm); margin-bottom:8px; }
  .material-row .icon{ width:36px;height:36px;border-radius:8px; background:var(--gold-soft); color:#8A5A1A; display:flex; align-items:center; justify-content:center; font-size:14px; font-weight:700; margin-right:12px; }
  .lesson-foot{ display:flex; justify-content:space-between; margin-top:24px; }

      ` }} />
      <>
      <div className="topbar">
        <div className="brand">
          <span className="mark"></span>
          LearnPath
        </div>
        <button className="nav-toggle" onClick={() => { lpToggleTopbarNav(); }} aria-label="Toggle menu">☰</button>
        <nav>
          <a href="courses.html#my">My courses</a>
          <a href="dashboard.html" className="btn btn-outline btn-sm">Dashboard</a>
        </nav>
      </div>
      <div className="learn-shell">
        <aside className="content-rail" id="content-rail"></aside>
        <main className="learn-main" id="learn-main"></main>
      </div>
      <div className="toast" id="toast"></div>
      </>
            <LegacyScript src="/legacy/js/store.js" />
            <LegacyScript src="/legacy/js/app.js" />
            <LegacyScript src="/legacy/js/learning.js" />
    </>
  );
}
