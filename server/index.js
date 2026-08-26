import express from 'express';
import cors from 'cors';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { initDb } from './db.js';
import authRoutes from './routes/auth.js';
import bookmarkRoutes from './routes/bookmarks.js';
import bidRoutes from './routes/bids.js';
import feedRoutes from './routes/feed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDb();

const app = express();
const PORT = process.env.PORT || 3001;

app.disable('x-powered-by');
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    service: 'curio-market',
    time: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/feed', feedRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

const distDir = path.resolve(__dirname, '../client/dist');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));

  app.use((req, res, next) => {
    if (req.method !== 'GET' || req.path.startsWith('/api')) {
      return next();
    }

    res.sendFile(path.join(distDir, 'index.html'));
  });
}

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[curio-market] API listening on http://localhost:${PORT}`);
  });
}

export default app;