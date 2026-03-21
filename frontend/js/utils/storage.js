// ================================================
// ADVOCATE SAATHI — LOCAL STORAGE WRAPPER
// frontend/js/utils/storage.js
// ================================================

const Storage = (() => {
  const PFX = 'as_';
  const set    = (k, v)  => { try { localStorage.setItem(PFX+k, JSON.stringify(v)); } catch(e){} };
  const get    = (k, fb=null) => { try { const i = localStorage.getItem(PFX+k); return i !== null ? JSON.parse(i) : fb; } catch(e){ return fb; } };
  const remove = (k)     => { try { localStorage.removeItem(PFX+k); } catch(e){} };
  const clear  = ()      => Object.keys(localStorage).filter(k=>k.startsWith(PFX)).forEach(k=>localStorage.removeItem(k));
  return { set, get, remove, clear };
})();
