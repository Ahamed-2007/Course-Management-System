import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Home() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .hero{
    display:grid; grid-template-columns:1.1fr .9fr; gap:48px; align-items:center;
    padding:80px 32px 60px; max-width:1180px; margin:0 auto;
  }
  .eyebrow{ font-family:var(--font-mono); font-size:12.5px; color:var(--gold); font-weight:500; letter-spacing:.04em; margin-bottom:14px; display:block; }
  .hero h1{ font-size:44px; line-height:1.12; max-width:520px; }
  .hero p.lead{ font-size:16.5px; max-width:460px; }
  .hero-cta{ display:flex; gap:12px; margin-top:26px; }
  .hero-art{ position:relative; }
  .stats-row{ display:flex; gap:28px; margin-top:36px; }
  .stat b{ display:block; font-family:var(--font-display); font-size:26px; color:var(--ink); }
  .stat span{ font-size:12.5px; color:var(--ink-soft); }

  .features{ background:var(--paper-dim); padding:64px 32px; border-top:1px solid var(--border); border-bottom:1px solid var(--border); }
  .features-grid{ max-width:1100px; margin:0 auto; display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
  .feature{ background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:22px; }
  .feature .num{ font-family:var(--font-mono); font-size:12px; color:var(--gold); margin-bottom:10px; }
  .feature h4{ font-size:15.5px; margin-bottom:6px; }
  .feature p{ font-size:13.5px; margin:0; }

  .cta-band{ text-align:center; padding:70px 32px; max-width:640px; margin:0 auto; }

  footer{ border-top:1px solid var(--border); padding:26px 32px; text-align:center; color:var(--ink-soft); font-size:13px; }

  @media (max-width:860px){
    .hero{ grid-template-columns:1fr; padding-top:48px; }
    .features-grid{ grid-template-columns:repeat(2,1fr); }
  }

      ` }} />
      <>
      <div className="topbar">
        <div className="brand">
          <span className="mark"></span>
          LearnPath
        </div>
        <button className="nav-toggle" onClick={() => { lpToggleTopbarNav(); }} aria-label="Toggle menu">☰</button>
        <nav>
          <a href="courses.html">Browse courses</a>
          <a href="auth.html">Log in</a>
          <a href="auth.html?tab=register" className="btn btn-primary btn-sm">Get started</a>
        </nav>
      </div>
      <section className="hero">
        <div>
          <span className="eyebrow">Module 6 — a place to keep learning</span>
          <h1>
            Follow the path.
            <br />
            Finish what you start.
          </h1>
          <p className="lead">LearnPath turns a pile of course videos into a walkable trail — one step at a time, with your progress marked as you go.</p>
          <div className="hero-cta">
            <a href="courses.html" className="btn btn-primary">Browse courses</a>
            <a href="auth.html?tab=register" className="btn btn-outline">Create free account</a>
          </div>
          <div className="stats-row">
            <div className="stat">
              <b>128</b>
              <span>Courses live</span>
            </div>
            <div className="stat">
              <b>4,300+</b>
              <span>Learners enrolled</span>
            </div>
            <div className="stat">
              <b>92%</b>
              <span>Course completion rate</span>
            </div>
          </div>
        </div>
        <div className="hero-art card card-pad">
          <p className="text-sm text-muted mb-0" style={{fontWeight: "600", color: "var(--ink)", marginBottom: "14px"}}>Your path — UX Design Fundamentals</p>
          <div className="path">
            <div className="path-step done">
              <div className="title">Intro to UX</div>
              <div className="sub">Completed · 12 min</div>
            </div>
            <div className="path-step done">
              <div className="title">User research basics</div>
              <div className="sub">Completed · 18 min</div>
            </div>
            <div className="path-step current">
              <div className="title">Wireframing</div>
              <div className="sub">In progress · 9 of 22 min</div>
            </div>
            <div className="path-step">
              <div className="title">Usability testing</div>
              <div className="sub">Locked</div>
            </div>
          </div>
        </div>
      </section>
      <section className="features">
        <div className="features-grid">
          <div className="feature">
            <div className="num">01</div>
            <h4>Browse & enroll</h4>
            <p>Filter courses by topic and level, then enroll in one click.</p>
          </div>
          <div className="feature">
            <div className="num">02</div>
            <h4>Learn by module</h4>
            <p>Video lessons, downloadable materials, and structured modules.</p>
          </div>
          <div className="feature">
            <div className="num">03</div>
            <h4>Track progress</h4>
            <p>See exactly how far along you are in every course you take.</p>
          </div>
          <div className="feature">
            <div className="num">04</div>
            <h4>Earn certificates</h4>
            <p>Finish a course and download a certificate to show for it.</p>
          </div>
        </div>
      </section>
      <section className="cta-band">
        <h2 style={{fontSize: "28px"}}>Ready to start your path?</h2>
        <p>It takes less than a minute to create an account.</p>
        <a href="auth.html?tab=register" className="btn btn-primary">Create free account</a>
      </section>
      <footer>© 2026 LearnPath. Built as a demo project — data is stored locally in your browser.</footer>
      </>
            <LegacyScript src="/legacy/js/app.js" />
    </>
  );
}
