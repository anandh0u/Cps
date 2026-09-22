import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import issuesRoutes from './routes/issues.js';
import suggestionsRoutes from './routes/suggestions.js';
import scholarshipsRoutes from './routes/scholarships.js';
import opportunitiesRoutes from './routes/opportunities.js';
import supportRoutes from './routes/support.js';
import emergencyRoutes from './routes/emergency.js';
import announcementsRoutes from './routes/announcements.js';
import adminRoutes from './routes/admin.js';
import departmentRoutes from './routes/department.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[CPS-API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'CPS Student Welfare & Issue Resolution Portal',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/issues', issuesRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/scholarships', scholarshipsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/announcements', announcementsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/department', departmentRoutes);

// Fallback for older complaints route pointing to issues
app.use('/api/complaints', issuesRoutes);
app.use('/api/updates', announcementsRoutes);

// Serve static frontend build
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));

// Fallback for SPA routing in client
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>CPS Portal API Server</title></head>
          <body style="font-family: sans-serif; padding: 40px; line-height: 1.6; background: #f5f5f4;">
            <h2>CPS Student Welfare & Issue Resolution Server Online</h2>
            <p>API endpoints:</p>
            <ul>
              <li><a href="/api/issues">/api/issues</a></li>
              <li><a href="/api/suggestions">/api/suggestions</a></li>
              <li><a href="/api/scholarships">/api/scholarships</a></li>
              <li><a href="/api/opportunities">/api/opportunities</a></li>
              <li><a href="/api/support">/api/support</a></li>
              <li><a href="/api/emergency">/api/emergency</a></li>
              <li><a href="/api/announcements">/api/announcements</a></li>
              <li><a href="/api/admin/metrics">/api/admin/metrics</a></li>
            </ul>
          </body>
        </html>
      `);
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`   CPS Student Welfare & Action Portal Online       `);
  console.log(`   URL: http://localhost:${PORT}                   `);
  console.log(`====================================================`);
});

export default app;
