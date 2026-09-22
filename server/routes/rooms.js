import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { type, status } = req.query;
  let rooms = store.rooms || [];

  if (type) {
    rooms = rooms.filter(r => r.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (status) {
    rooms = rooms.filter(r => r.status.toLowerCase().includes(status.toLowerCase()));
  }

  res.json({
    success: true,
    count: rooms.length,
    data: rooms
  });
});

router.get('/:id', (req, res) => {
  const store = getStore();
  const room = (store.rooms || []).find(r => r.id.toLowerCase() === req.params.id.toLowerCase() || r.code.toLowerCase() === req.params.id.toLowerCase());
  
  if (!room) {
    return res.status(404).json({ success: false, error: 'Room or laboratory not found' });
  }

  res.json({ success: true, data: room });
});

router.patch('/:id/status', (req, res) => {
  const store = getStore();
  const room = (store.rooms || []).find(r => r.id.toLowerCase() === req.params.id.toLowerCase());

  if (!room) {
    return res.status(404).json({ success: false, error: 'Room not found' });
  }

  const { status, overallReadinessStatus } = req.body;
  if (status) room.status = status;
  if (overallReadinessStatus) room.readiness.overallStatus = overallReadinessStatus;
  room.readiness.lastInspected = new Date().toISOString().replace('T', ' ').slice(0, 16);

  saveStore();
  res.json({ success: true, message: 'Room status updated successfully', data: room });
});

export default router;
