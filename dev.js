import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting CPS Department Portal in Development Mode...');

// Start Express Backend
const server = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  shell: true,
  cwd: __dirname
});

// Start Vite Client
const client = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true,
  cwd: path.join(__dirname, 'client')
});

function cleanup() {
  console.log('\n🛑 Shutting down development servers...');
  server.kill();
  client.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
