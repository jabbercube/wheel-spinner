const express = require('express');
const cors = require('cors');
const path = require('path');
const { getDb } = require('./db.js');

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve static files from dist/
app.use(express.static(path.join(__dirname, '../dist')));

// --- Wheel CRUD (saved wheels for the default user) ---

app.get('/api/wheels', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT config FROM wheels WHERE uid = ? ORDER BY title COLLATE NOCASE'
    ).all('default');
    const wheels = rows.map(r => JSON.parse(r.config));
    res.json({ wheels });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/wheels', (req, res) => {
  try {
    const db = getDb();
    const config = req.body.config;
    const title = config.title;
    const now = new Date().toISOString();
    const existing = db.prepare(
      'SELECT id FROM wheels WHERE uid = ? AND title = ?'
    ).get('default', title);
    if (existing) {
      db.prepare(
        'UPDATE wheels SET config = ?, last_write = ? WHERE uid = ? AND title = ?'
      ).run(JSON.stringify(config), now, 'default', title);
    } else {
      db.prepare(
        'INSERT INTO wheels (uid, title, config, created, last_write) VALUES (?, ?, ?, ?, ?)'
      ).run('default', title, JSON.stringify(config), now, now);
    }
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.delete('/api/wheels/:title', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM wheels WHERE uid = ? AND title = ?')
      .run('default', req.params.title);
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

// --- Shared wheels ---

app.post('/api/shared-wheels', (req, res) => {
  try {
    const db = getDb();
    const config = req.body.wheelConfig;
    let copyable = false;
    if (req.body.hasOwnProperty('editable')) copyable = req.body.editable;
    if (req.body.hasOwnProperty('copyable')) copyable = req.body.copyable;

    // Dirty words check
    if (containsDirtyWords(db, config.entries || [])) {
      res.status(451).json({ error: 'Please try something more family-friendly.' });
      return;
    }

    const wheelPath = createUniquePath(db);
    config.path = wheelPath;
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO shared_wheels (path, uid, config, copyable, review_status, created, read_count)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(wheelPath, 'default', JSON.stringify(config), copyable ? 1 : 0, 'Pending', now, 0);
    res.json({ path: wheelPath });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/shared-wheels', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare(
      'SELECT path, config, copyable, created, read_count FROM shared_wheels WHERE uid = ? ORDER BY created DESC'
    ).all('default');
    const wheels = rows.map(r => ({
      path: r.path,
      config: JSON.parse(r.config),
      copyable: !!r.copyable,
      created: r.created,
      readCount: r.read_count
    }));
    res.json({ wheels });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/shared-wheels/:path', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare(
      'SELECT config, copyable, review_status FROM shared_wheels WHERE path = ?'
    ).get(req.params.path);
    if (row) {
      res.json({
        wheelConfig: {
          wheelConfig: JSON.parse(row.config),
          copyable: !!row.copyable,
          editable: !!row.copyable,
          reviewStatus: row.review_status
        }
      });
    } else {
      res.status(404).json({ wheelConfig: { wheelNotFound: true } });
    }
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.delete('/api/shared-wheels/:path', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM shared_wheels WHERE path = ? AND uid = ?')
      .run(req.params.path, 'default');
    // Return remaining shared wheels
    const rows = db.prepare(
      'SELECT path, config, copyable, created, read_count FROM shared_wheels WHERE uid = ? ORDER BY created DESC'
    ).all('default');
    const wheels = rows.map(r => ({
      path: r.path,
      config: JSON.parse(r.config),
      copyable: !!r.copyable,
      created: r.created,
      readCount: r.read_count
    }));
    res.json({ wheels });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/shared-wheel-reads', (req, res) => {
  try {
    const db = getDb();
    const wheelPath = req.body.path;
    if (wheelPath) {
      const now = new Date().toISOString();
      db.prepare(
        'UPDATE shared_wheels SET read_count = read_count + 1, last_read = ? WHERE path = ?'
      ).run(now, wheelPath);
    }
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

// --- Admin endpoints ---

app.get('/api/carousels', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT data FROM carousels ORDER BY id').all();
    const carousels = rows.map(r => JSON.parse(r.data));
    res.json(carousels);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/carousels', (req, res) => {
  try {
    const db = getDb();
    const carousel = req.body.carousel;
    db.prepare('DELETE FROM carousels').run();
    const insert = db.prepare('INSERT INTO carousels (data) VALUES (?)');
    for (const item of carousel) {
      insert.run(JSON.stringify(item));
    }
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/admins', (req, res) => {
  try {
    const db = getDb();
    const rows = db.prepare('SELECT uid, name, total_reviews, session_reviews, last_review FROM admins ORDER BY name').all();
    const admins = rows.map(r => ({
      uid: r.uid,
      name: r.name,
      totalReviews: r.total_reviews,
      sessionReviews: r.session_reviews,
      lastReview: r.last_review
    }));
    res.json(admins);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/admins', (req, res) => {
  try {
    const db = getDb();
    db.prepare(
      'INSERT OR REPLACE INTO admins (uid, name) VALUES (?, ?)'
    ).run(req.body.uid, req.body.name);
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.delete('/api/admins/:uid', (req, res) => {
  try {
    const db = getDb();
    db.prepare('DELETE FROM admins WHERE uid = ?').run(req.params.uid);
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/settings/dirty-words', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value FROM settings WHERE key = 'DIRTY_WORDS'").get();
    const words = row ? JSON.parse(row.value) : [];
    res.json(words.sort());
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/settings/dirty-words', (req, res) => {
  try {
    const db = getDb();
    const words = req.body.words.map(w => w.toLowerCase()).sort();
    db.prepare(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('DIRTY_WORDS', ?)"
    ).run(JSON.stringify(words));
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/settings/earnings-per-review', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare("SELECT value FROM settings WHERE key = 'EARNINGS_PER_REVIEW'").get();
    const value = row ? parseFloat(row.value) : 0;
    res.json(value);
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/spin-stats', (req, res) => {
  res.json({ spinsToday: 0, spinsThisWeek: 0, spinsThisMonth: 0 });
});

app.get('/api/review-queue/next', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare(
      "SELECT path, config, copyable, review_status, created, last_read, read_count FROM shared_wheels WHERE review_status = 'Pending' ORDER BY read_count DESC LIMIT 1"
    ).get();
    if (row) {
      res.json({
        path: row.path,
        config: JSON.parse(row.config),
        copyable: !!row.copyable,
        reviewStatus: row.review_status,
        created: row.created,
        lastRead: row.last_read,
        readCount: row.read_count
      });
    } else {
      res.json(null);
    }
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/review-queue/count', (req, res) => {
  try {
    const db = getDb();
    const row = db.prepare(
      "SELECT COUNT(*) as count FROM shared_wheels WHERE review_status = 'Pending'"
    ).get();
    res.json({ wheelsInReviewQueue: row.count });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/review-queue/:path/approve', (req, res) => {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare(
      "UPDATE shared_wheels SET review_status = 'Approved' WHERE path = ?"
    ).run(req.params.path);
    db.prepare(
      'UPDATE admins SET total_reviews = total_reviews + 1, session_reviews = session_reviews + 1, last_review = ? WHERE uid = ?'
    ).run(now, 'default');
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/review-queue/:path/delete', (req, res) => {
  try {
    const db = getDb();
    const now = new Date().toISOString();
    db.prepare('DELETE FROM shared_wheels WHERE path = ?').run(req.params.path);
    db.prepare(
      'UPDATE admins SET total_reviews = total_reviews + 1, session_reviews = session_reviews + 1, last_review = ? WHERE uid = ?'
    ).run(now, 'default');
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/admins/:uid/reset-reviews', (req, res) => {
  try {
    const db = getDb();
    db.prepare(
      'UPDATE admins SET total_reviews = 0, session_reviews = 0 WHERE uid = ?'
    ).run(req.params.uid);
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.post('/api/admins/:uid/reset-session', (req, res) => {
  try {
    const db = getDb();
    db.prepare(
      'UPDATE admins SET session_reviews = 0 WHERE uid = ?'
    ).run(req.params.uid);
    res.json({ status: 'ok' });
  } catch (ex) {
    console.error(ex);
    res.status(500).json({ error: ex.toString() });
  }
});

app.get('/api/user/is-admin', (req, res) => {
  res.json({ userIsAdmin: true });
});

// --- SPA fallback ---

app.get('*', (req, res) => {
  // Serve shared-wheel.html for xxx-xxx pattern paths
  const sharedWheelPattern = /^\/([a-z]{2}(-[A-Z]{2})?\/)?[a-z0-9]{3}-[a-z0-9]{3}$/;
  const viewPattern = /^\/view\/([a-z]{2}(-[A-Z]{2})?\/)?[a-z0-9]{3}-[a-z0-9]{3}$/;

  const htmlFile = (sharedWheelPattern.test(req.path) || viewPattern.test(req.path))
    ? 'shared-wheel.html'
    : 'index.html';

  res.sendFile(path.join(__dirname, 'dist', htmlFile));
});

// --- Helper functions ---

function containsDirtyWords(db, entries) {
  const row = db.prepare("SELECT value FROM settings WHERE key = 'DIRTY_WORDS'").get();
  if (!row) return false;
  const dirtyWords = JSON.parse(row.value);
  return entries.some(e => {
    if (!e.text) return false;
    const textEntry = e.text.toLowerCase().replace(/&nbsp;/g, ' ');
    const wordBreaks = /[,.:;!\/\?\-\+"\[\]\(\)_#=]/g;
    const wordsInEntry = textEntry.replace(wordBreaks, ' ').split(' ');
    return dirtyWords.some(dirtyWord =>
      wordsInEntry.some(wordInEntry => wordInEntry === dirtyWord)
    );
  });
}

function createUniquePath(db) {
  let newPath;
  while (true) {
    newPath = getRandomPath();
    const existing = db.prepare('SELECT path FROM shared_wheels WHERE path = ?').get(newPath);
    if (!existing) break;
  }
  return newPath;
}

function getRandomPath() {
  return `${getRandomChars(3)}-${getRandomChars(3)}`;
}

function getRandomChars(charCount) {
  let retVal = '';
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  for (let i = 0; i < charCount; i++) {
    retVal += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return retVal;
}

// --- Start server ---

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
