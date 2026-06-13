(function () {
  const config = window.VARUN_FIREBASE_CONFIG || {};
  const path = window.VARUN_FIREBASE_PATH || 'portfolio/live';
  let ref = null;
  let ready = false;
  let initPromise = null;

  function hasConfig() {
    return Boolean(
      config.apiKey &&
      config.databaseURL &&
      !String(config.apiKey).includes('PASTE_') &&
      !String(config.databaseURL).includes('PASTE_')
    );
  }

  function cloneData(data) {
    return JSON.parse(JSON.stringify(data || {}));
  }

  async function init() {
    if (initPromise) return initPromise;
    initPromise = new Promise((resolve) => {
      try {
        if (!hasConfig() || !window.firebase) {
          resolve(false);
          return;
        }
        if (!firebase.apps.length) firebase.initializeApp(config);
        ref = firebase.database().ref(path);
        ready = true;
        resolve(true);
      } catch (err) {
        console.warn('[CloudSync] Firebase disabled:', err);
        resolve(false);
      }
    });
    return initPromise;
  }

  async function load() {
    const ok = await init();
    if (!ok || !ref) return null;
    const snap = await ref.once('value');
    return snap.exists() ? snap.val() : null;
  }

  async function save(data) {
    const ok = await init();
    if (!ok || !ref) return false;
    const payload = cloneData(data);
    payload._cloudUpdatedAt = new Date().toISOString();
    await ref.set(payload);
    return true;
  }

  window.CloudSync = {
    init,
    load,
    save,
    isConfigured: hasConfig,
    isReady: () => ready
  };
})();
