import PageCss from "../components/PageCss";
import LegacyScript from "../components/LegacyScript";

export default function Auth() {
  return (
    <>
      <PageCss href="/css/styles.css" />
      <style dangerouslySetInnerHTML={{ __html: `

  .auth-wrap{ max-width:420px; margin:0 auto; padding:56px 20px 80px; }
  .auth-tabs{ display:flex; border:1px solid var(--border); border-radius:100px; padding:4px; margin-bottom:28px; background:var(--paper-dim); }
  .auth-tabs button{
    flex:1; border:none; background:transparent; padding:9px; font-family:var(--font-body); font-weight:600;
    font-size:13.5px; color:var(--ink-soft); border-radius:100px; cursor:pointer;
  }
  .auth-tabs button.active{ background:var(--card); color:var(--blue); box-shadow:var(--shadow); }
  .view{ display:none; }
  .view.active{ display:block; }
  .auth-head{ text-align:center; margin-bottom:24px; }
  .auth-head .eyebrow{ font-family:var(--font-mono); font-size:11.5px; color:var(--gold); }
  .switch-line{ text-align:center; font-size:13.5px; margin-top:16px; color:var(--ink-soft); }
  .back-home{ display:inline-block; margin-bottom:18px; font-size:13px; color:var(--ink-soft); }
  .role-toggle{ display:flex; gap:10px; margin-bottom:18px; }
  .role-toggle label{
    flex:1; border:1px solid var(--border); border-radius:var(--radius-sm); padding:10px; text-align:center;
    font-size:13px; font-weight:600; cursor:pointer; color:var(--ink-soft);
  }
  .role-toggle input{ display:none; }
  .role-toggle input:checked + span{ color:var(--blue); }
  .role-toggle label:has(input:checked){ border-color:var(--blue); background:#EEF3FB; }

      ` }} />
      <>
      <div className="auth-wrap">
        <a className="back-home" href="index.html">← Back to home</a>
        <div className="card card-pad">
          <div className="auth-tabs">
            <button data-view="login" className="active">Log in</button>
            <button data-view="register">Register</button>
            <button data-view="forgot">Forgot password</button>
          </div>
          {/* LOGIN */}
          <div className="view active" id="view-login">
            <div className="auth-head">
              <span className="eyebrow">Module 1 — Authentication</span>
              <h2 style={{fontSize: "22px"}}>Welcome back</h2>
              <p className="text-sm mb-0">Log in to keep walking your path.</p>
            </div>
            <div className="alert alert-error" id="login-alert"></div>
            <form id="login-form" noValidate={true}>
              <div className="field">
                <label htmlFor="login-email">Email</label>
                <input type="email" id="login-email" required={true} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="login-password">Password</label>
                <input type="password" id="login-password" required={true} placeholder="••••••••" />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Log in</button>
            </form>
            <p className="switch-line">
              No account?
              <a href="#" data-goto="register">Register here</a>
            </p>
            <p className="switch-line text-sm">Demo admin — admin@learnpath.com / admin123</p>
          </div>
          {/* REGISTER */}
          <div className="view" id="view-register">
            <div className="auth-head">
              <span className="eyebrow">Module 1 — Authentication</span>
              <h2 style={{fontSize: "22px"}}>Create your account</h2>
              <p className="text-sm mb-0">Start walking your first path in seconds.</p>
            </div>
            <div className="alert alert-error" id="register-alert"></div>
            <form id="register-form" noValidate={true}>
              <div className="field">
                <label htmlFor="reg-name">Full name</label>
                <input type="text" id="reg-name" required={true} placeholder="Jordan Lee" />
              </div>
              <div className="field">
                <label htmlFor="reg-email">Email</label>
                <input type="email" id="reg-email" required={true} placeholder="you@example.com" />
              </div>
              <div className="field">
                <label htmlFor="reg-password">Password</label>
                <input type="password" id="reg-password" required={true} placeholder="At least 6 characters" />
              </div>
              <div className="field">
                <label>I'm joining as</label>
                <div className="role-toggle">
                  <label>
                    <input type="radio" name="role" value="student" checked={true} />
                    <span>Student</span>
                  </label>
                  <label>
                    <input type="radio" name="role" value="admin" />
                    <span>Instructor / Admin</span>
                  </label>
                </div>
              </div>
              <button className="btn btn-primary btn-block" type="submit">Create account</button>
            </form>
            <p className="switch-line">
              Already have an account?
              <a href="#" data-goto="login">Log in</a>
            </p>
          </div>
          {/* FORGOT */}
          <div className="view" id="view-forgot">
            <div className="auth-head">
              <span className="eyebrow">Module 1 — Authentication</span>
              <h2 style={{fontSize: "22px"}}>Reset your password</h2>
              <p className="text-sm mb-0">Enter your email and we'll simulate sending a reset link.</p>
            </div>
            <div className="alert alert-success" id="forgot-alert"></div>
            <form id="forgot-form" noValidate={true}>
              <div className="field">
                <label htmlFor="forgot-email">Email</label>
                <input type="email" id="forgot-email" required={true} placeholder="you@example.com" />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Send reset link</button>
            </form>
            <p className="switch-line">
              Remembered it?
              <a href="#" data-goto="login">Back to log in</a>
            </p>
          </div>
          {/* RESET (reached via simulated link) */}
          <div className="view" id="view-reset">
            <div className="auth-head">
              <span className="eyebrow">Module 1 — Authentication</span>
              <h2 style={{fontSize: "22px"}}>Set a new password</h2>
              <p className="text-sm mb-0" id="reset-for-email">Resetting password for you@example.com</p>
            </div>
            <div className="alert alert-error" id="reset-alert"></div>
            <form id="reset-form" noValidate={true}>
              <div className="field">
                <label htmlFor="reset-password">New password</label>
                <input type="password" id="reset-password" required={true} placeholder="At least 6 characters" />
              </div>
              <div className="field">
                <label htmlFor="reset-password2">Confirm new password</label>
                <input type="password" id="reset-password2" required={true} placeholder="Repeat password" />
              </div>
              <button className="btn btn-primary btn-block" type="submit">Update password</button>
            </form>
          </div>
        </div>
      </div>
      <div className="toast" id="toast"></div>
      </>
            <LegacyScript src="/legacy/js/store.js" />
            <LegacyScript src="/legacy/js/app.js" />
            <LegacyScript src="/legacy/js/auth.js" />
    </>
  );
}
