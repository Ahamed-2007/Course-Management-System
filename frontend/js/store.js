/* ============================================================
   LearnPath — store.js
   A reusable JS module that centralizes ALL application state.

   Before: every page (auth/dashboard/courses/learning/progress)
   defined its OWN local "DB" object, duplicating the same
   localStorage read/write logic five times.

   Now: this single module is the one source of truth. It:
     1) caches each piece of state in memory (so repeated reads
        don't re-parse localStorage every time),
     2) writes through to localStorage so data still survives
        refreshes/restarts,
     3) publishes change events, so any page can "subscribe" and
        react when data changes elsewhere (e.g. a notification
        badge updating itself without a manual re-render call).

   Every page includes this file and uses `LPStore` directly.
   ============================================================ */

const LPStore = (function(){

  // ---- in-memory state cache -------------------------------
  const state = {
    users: null,
    session: null,
    courses: null,
    enrollments: null,
    notifications: null,
  };

  // ---- pub/sub -----------------------------------------------
  const listeners = {}; // { key: [callback, ...] }

  function subscribe(key, callback){
    (listeners[key] = listeners[key] || []).push(callback);
    return () => { // returns an unsubscribe function
      listeners[key] = (listeners[key] || []).filter(fn => fn !== callback);
    };
  }

  function emit(key){
    (listeners[key] || []).forEach(fn => fn(state[key]));
  }

  // ---- generic read-through / write-through helpers ----------
  function load(key, storageKey, fallback){
    if(state[key] === null){
      state[key] = JSON.parse(localStorage.getItem(storageKey) || fallback);
    }
    return state[key];
  }

  function persist(key, storageKey, value){
    state[key] = value;
    localStorage.setItem(storageKey, JSON.stringify(value));
    emit(key);
  }

  // ---- public API (same shape as the old inline DB objects) --
  return {
    // users
    users(){ return load('users', 'lp_users', '[]'); },
    saveUsers(u){ persist('users', 'lp_users', u); },

    // session
    session(){ return load('session', 'lp_session', 'null'); },
    setSession(s){ persist('session', 'lp_session', s); },
    clearSession(){ state.session = null; localStorage.removeItem('lp_session'); emit('session'); },

    // courses
    courses(){ return load('courses', 'lp_courses', '[]'); },
    saveCourses(c){ persist('courses', 'lp_courses', c); },

    // enrollments
    enrollments(){ return load('enrollments', 'lp_enrollments', '[]'); },
    saveEnrollments(e){ persist('enrollments', 'lp_enrollments', e); },

    // notifications
    notifications(){ return load('notifications', 'lp_notifications', '[]'); },
    saveNotifications(n){ persist('notifications', 'lp_notifications', n); },

    // state subscription — lets any page react live to changes
    // e.g. LPStore.subscribe('notifications', (list) => updateBadge(list))
    subscribe,
  };

})();

/* Back-compat alias: existing page scripts call `DB.xxx()`.
   Pointing DB at the same module means there is now only ONE
   implementation instead of five duplicated copies. */
const DB = LPStore;
