/* ============================================================
   database.js — Varun Portfolio Database Layer
   Pure localStorage-based DB with full CRUD operations.
   Usage: include this BEFORE app.js in index.html
   <script src="database.js"></script>
   ============================================================ */

const DB = (() => {
  const DB_KEY = 'varun_portfolio_data';

  /* ─── Internal Helpers ─── */
  function _read() {
    try {
      return JSON.parse(localStorage.getItem(DB_KEY) || '{}');
    } catch (e) {
      console.error('[DB] Read error:', e);
      return {};
    }
  }

  function _write(data) {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('[DB] Write error:', e);
      return false;
    }
  }

  function _timestamp() {
    return new Date().toISOString();
  }

  /* ─── CORE CRUD ─── */

  /**
   * CREATE — ek naya record insert karo kisi bhi collection mein
   * @param {string} collection  — e.g. 'skills', 'projects', 'education'
   * @param {object} record      — naya object jo add karna hai
   * @returns {object|null}      — saved record (with id + timestamps)
   */
  function create(collection, record) {
    const db = _read();
    if (!Array.isArray(db[collection])) db[collection] = [];

    const newRecord = {
      _id: Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      _createdAt: _timestamp(),
      _updatedAt: _timestamp(),
      ...record
    };

    db[collection].push(newRecord);
    _write(db);
    console.log(`[DB] CREATE ${collection}:`, newRecord);
    return newRecord;
  }

  /**
   * READ ALL — poori collection fetch karo
   * @param {string} collection
   * @returns {Array}
   */
  function readAll(collection) {
    const db = _read();
    return Array.isArray(db[collection]) ? db[collection] : [];
  }

  /**
   * READ ONE — ek record dhundo by _id
   * @param {string} collection
   * @param {string} id
   * @returns {object|null}
   */
  function readOne(collection, id) {
    const records = readAll(collection);
    return records.find(r => r._id === id) || null;
  }

  /**
   * READ by INDEX — index se record lo (legacy array support)
   * @param {string} collection
   * @param {number} index
   * @returns {object|null}
   */
  function readByIndex(collection, index) {
    const records = readAll(collection);
    return records[index] ?? null;
  }

  /**
   * UPDATE — existing record update karo by _id
   * @param {string} collection
   * @param {string} id
   * @param {object} updates  — sirf wo fields jo change karni hain
   * @returns {object|null}   — updated record
   */
  function update(collection, id, updates) {
    const db = _read();
    if (!Array.isArray(db[collection])) return null;

    const idx = db[collection].findIndex(r => r._id === id);
    if (idx === -1) {
      console.warn(`[DB] UPDATE: Record not found — ${collection}#${id}`);
      return null;
    }

    db[collection][idx] = {
      ...db[collection][idx],
      ...updates,
      _id: id,                            // id kabhi na badle
      _updatedAt: _timestamp()
    };

    _write(db);
    console.log(`[DB] UPDATE ${collection}#${id}:`, db[collection][idx]);
    return db[collection][idx];
  }

  /**
   * UPDATE by INDEX — legacy index-based update
   * @param {string} collection
   * @param {number} index
   * @param {object} updates
   * @returns {object|null}
   */
  function updateByIndex(collection, index, updates) {
    const db = _read();
    if (!Array.isArray(db[collection]) || !db[collection][index]) return null;

    db[collection][index] = {
      ...db[collection][index],
      ...updates,
      _updatedAt: _timestamp()
    };

    _write(db);
    return db[collection][index];
  }

  /**
   * DELETE — record hatao by _id
   * @param {string} collection
   * @param {string} id
   * @returns {boolean}
   */
  function remove(collection, id) {
    const db = _read();
    if (!Array.isArray(db[collection])) return false;

    const before = db[collection].length;
    db[collection] = db[collection].filter(r => r._id !== id);

    if (db[collection].length === before) {
      console.warn(`[DB] DELETE: Record not found — ${collection}#${id}`);
      return false;
    }

    _write(db);
    console.log(`[DB] DELETE ${collection}#${id}`);
    return true;
  }

  /**
   * DELETE by INDEX — legacy index-based delete
   * @param {string} collection
   * @param {number} index
   * @returns {boolean}
   */
  function removeByIndex(collection, index) {
    const db = _read();
    if (!Array.isArray(db[collection]) || index < 0 || index >= db[collection].length) return false;
    db[collection].splice(index, 1);
    _write(db);
    return true;
  }

  /* ─── PROFILE & CONTACT (Single-object storage) ─── */

  /**
   * getProfile — profile object fetch karo
   */
  function getProfile() {
    return _read().profile || {};
  }

  /**
   * setProfile — poora profile save karo
   * @param {object} profileObj
   */
  function setProfile(profileObj) {
    const db = _read();
    db.profile = { ...(db.profile || {}), ...profileObj, _updatedAt: _timestamp() };
    _write(db);
    console.log('[DB] PROFILE updated');
    return db.profile;
  }

  /**
   * getContact — contact object fetch karo
   */
  function getContact() {
    return _read().contact || {};
  }

  /**
   * setContact — contact info save karo
   * @param {object} contactObj
   */
  function setContact(contactObj) {
    const db = _read();
    db.contact = { ...(db.contact || {}), ...contactObj, _updatedAt: _timestamp() };
    _write(db);
    console.log('[DB] CONTACT updated');
    return db.contact;
  }

  /* ─── ADMIN / AUTH ─── */

  function getAdminPass() {
    return _read().adminPass || null;
  }

  function setAdminPass(hashedPass) {
    const db = _read();
    db.adminPass = hashedPass;
    _write(db);
    console.log('[DB] Admin password updated');
  }

  /* ─── SEARCH / FILTER ─── */

  /**
   * find — collection mein filter lagao
   * @param {string} collection
   * @param {function} predicate  — callback: (record) => boolean
   * @returns {Array}
   */
  function find(collection, predicate) {
    return readAll(collection).filter(predicate);
  }

  /* ─── BULK OPERATIONS ─── */

  /**
   * bulkSet — poori collection ek saath replace karo (for initial load)
   * @param {string} collection
   * @param {Array} records
   */
  function bulkSet(collection, records) {
    const db = _read();
    db[collection] = records;
    _write(db);
    console.log(`[DB] BULK SET ${collection}: ${records.length} records`);
  }

  /* ─── EXPORT / IMPORT ─── */

  /**
   * exportJSON — poora database JSON file ke roop mein download karo
   */
  function exportJSON() {
    const db = _read();
    const json = JSON.stringify(db, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href     = url;
    a.download = `varun_portfolio_db_${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log('[DB] Database exported as JSON');
    return json;
  }

  /**
   * exportCSV — koi bhi ek collection CSV file ke roop mein download karo
   * @param {string} collection  — e.g. 'skills', 'projects', 'education'
   */
  function exportCSV(collection) {
    const records = readAll(collection);
    if (!records.length) {
      console.warn('[DB] exportCSV: No records found in', collection);
      return;
    }

    // Headers: sabhi keys collect karo
    const headers = [...new Set(records.flatMap(r => Object.keys(r)))];
    const csvRows = [
      headers.join(','),
      ...records.map(r =>
        headers.map(h => {
          const val = r[h];
          const str = Array.isArray(val) ? val.join('; ') : String(val ?? '');
          // Comma ya quote ho to wrap in quotes
          return str.includes(',') || str.includes('"') || str.includes('\n')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        }).join(',')
      )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    a.href     = url;
    a.download = `varun_${collection}_${date}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log(`[DB] Collection "${collection}" exported as CSV`);
  }

  /**
   * importJSON — JSON file se data restore karo
   * @param {File} file  — File input se liya hua file object
   * @param {function} [callback]  — import ke baad kya karna hai
   */
  function importJSON(file, callback) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        _write(parsed);
        console.log('[DB] Database imported successfully');
        if (typeof callback === 'function') callback(true, parsed);
      } catch (err) {
        console.error('[DB] Import failed:', err);
        if (typeof callback === 'function') callback(false, null);
      }
    };
    reader.readAsText(file);
  }

  /* ─── STATS / META ─── */

  /**
   * stats — database ka overview
   */
  function stats() {
    const db = _read();
    const info = {
      collections: {},
      totalKeys: Object.keys(db).length,
      storageSizeKB: parseFloat((JSON.stringify(db).length / 1024).toFixed(2)),
      lastExport: null
    };
    ['skills', 'projects', 'education'].forEach(col => {
      info.collections[col] = Array.isArray(db[col]) ? db[col].length : 0;
    });
    console.table(info.collections);
    console.log('[DB] Storage used:', info.storageSizeKB, 'KB');
    return info;
  }

  /**
   * clear — poora database wipe karo (reset)
   */
  function clear() {
    localStorage.removeItem(DB_KEY);
    console.log('[DB] Database cleared');
  }

  /* ─── PUBLIC API ─── */
  return {
    // Core CRUD
    create,
    readAll,
    readOne,
    readByIndex,
    update,
    updateByIndex,
    remove,
    removeByIndex,

    // Profile / Contact
    getProfile,
    setProfile,
    getContact,
    setContact,

    // Auth
    getAdminPass,
    setAdminPass,

    // Search
    find,

    // Bulk
    bulkSet,

    // Export / Import / Download
    exportJSON,
    exportCSV,
    importJSON,

    // Meta
    stats,
    clear,

    // Raw access (emergency)
    _raw: _read
  };
})();

/* ─── AUTO INIT LOG ─── */
console.log('%c[DB] database.js loaded ✅', 'color:#20b2aa;font-weight:bold');
console.log('[DB] Available methods:', Object.keys(DB).filter(k => !k.startsWith('_')).join(', '));
