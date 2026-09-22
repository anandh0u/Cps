import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { status, category } = req.query;
  let events = store.events || [];

  if (status && status !== 'All') {
    events = events.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'All') {
    events = events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  }

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

router.get('/:id', (req, res) => {
  const store = getStore();
  const event = (store.events || []).find(e => e.id.toLowerCase() === req.params.id.toLowerCase());

  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  res.json({ success: true, data: event });
});

router.post('/:id/register', (req, res) => {
  const store = getStore();
  const event = (store.events || []).find(e => e.id.toLowerCase() === req.params.id.toLowerCase());

  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  if (!event.registrationOpen) {
    return res.status(400).json({ success: false, error: 'Registration is closed for this event.' });
  }

  if (event.registeredCount >= event.capacity) {
    return res.status(400).json({ success: false, error: 'Event capacity reached.' });
  }

  const { name, email, year } = req.body;
  event.registeredCount = (event.registeredCount || 0) + 1;
  saveStore();

  const registrationPass = `PASS-${event.id}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    message: 'Registered successfully!',
    data: {
      registrationPass,
      eventTitle: event.title,
      venue: event.venue,
      date: event.date,
      time: event.time,
      name,
      registeredCount: event.registeredCount
    }
  });
});

export default router;
