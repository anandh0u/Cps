import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

// GET all events with optional filtering
router.get('/', (req, res) => {
  const store = getStore();
  const { status, category, q } = req.query;
  let events = store.events || [];

  if (status && status !== 'All') {
    events = events.filter(e => e.status.toLowerCase() === status.toLowerCase());
  }
  if (category && category !== 'All') {
    events = events.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (q) {
    const query = q.toLowerCase();
    events = events.filter(e => 
      (e.title && e.title.toLowerCase().includes(query)) ||
      (e.venue && e.venue.toLowerCase().includes(query)) ||
      (e.speaker && e.speaker.toLowerCase().includes(query)) ||
      (e.description && e.description.toLowerCase().includes(query)) ||
      (e.category && e.category.toLowerCase().includes(query))
    );
  }

  res.json({
    success: true,
    count: events.length,
    data: events
  });
});

// GET single event by ID
router.get('/:id', (req, res) => {
  const store = getStore();
  const event = (store.events || []).find(e => e.id.toLowerCase() === req.params.id.toLowerCase());

  if (!event) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  res.json({ success: true, data: event });
});

// POST create new event (Admin)
router.post('/', (req, res) => {
  const store = getStore();
  if (!store.events) store.events = [];

  const {
    title,
    category = 'Hackathon',
    status = 'Upcoming',
    date = 'TBD',
    time = 'TBD',
    venue = 'CPS Seminar Hall / Main Auditorium',
    organizer = 'Association of Cyber Physical Systems (ACPS)',
    speaker = 'Industry Experts & Faculty',
    prizePool = '',
    description = '',
    highlights = [],
    eligibility = 'Open to all students',
    capacity = 100,
    registrationOpen = true,
    registrationLink = ''
  } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, error: 'Event title is required.' });
  }

  // Generate unique ID
  const eventNumber = store.events.length + 1;
  const newId = `EVT-2026-${String(eventNumber).padStart(2, '0')}`;

  const newEvent = {
    id: newId,
    title: title.trim(),
    category: category.trim(),
    status: status.trim(),
    date: date.trim(),
    time: time.trim(),
    venue: venue.trim(),
    organizer: organizer.trim(),
    speaker: speaker.trim(),
    prizePool: prizePool.trim(),
    description: description.trim(),
    highlights: Array.isArray(highlights) ? highlights : (typeof highlights === 'string' ? highlights.split('\n').filter(Boolean) : []),
    eligibility: eligibility.trim(),
    capacity: Number(capacity) || 100,
    registeredCount: 0,
    registrationOpen: Boolean(registrationOpen),
    registrationLink: (registrationLink || '').trim(),
    createdAt: new Date().toISOString()
  };

  // Prepend to list so newest appears first
  store.events.unshift(newEvent);
  saveStore();

  res.status(201).json({
    success: true,
    message: 'Event published successfully',
    data: newEvent
  });
});

// PUT update existing event (Admin)
router.put('/:id', (req, res) => {
  const store = getStore();
  const index = (store.events || []).findIndex(e => e.id.toLowerCase() === req.params.id.toLowerCase());

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  const existing = store.events[index];
  const updates = req.body;

  const updatedEvent = {
    ...existing,
    ...updates,
    id: existing.id, // Preserve immutable ID
    highlights: Array.isArray(updates.highlights) 
      ? updates.highlights 
      : (typeof updates.highlights === 'string' 
          ? updates.highlights.split('\n').filter(Boolean) 
          : existing.highlights),
    capacity: updates.capacity !== undefined ? Number(updates.capacity) : existing.capacity,
    registeredCount: updates.registeredCount !== undefined ? Number(updates.registeredCount) : existing.registeredCount,
    registrationOpen: updates.registrationOpen !== undefined ? Boolean(updates.registrationOpen) : existing.registrationOpen,
    updatedAt: new Date().toISOString()
  };

  store.events[index] = updatedEvent;
  saveStore();

  res.json({
    success: true,
    message: 'Event updated successfully',
    data: updatedEvent
  });
});

// DELETE event (Admin)
router.delete('/:id', (req, res) => {
  const store = getStore();
  const initialLength = (store.events || []).length;
  store.events = (store.events || []).filter(e => e.id.toLowerCase() !== req.params.id.toLowerCase());

  if (store.events.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Event not found' });
  }

  saveStore();

  res.json({
    success: true,
    message: `Event ${req.params.id} removed successfully.`
  });
});

// POST register for an event (Student)
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
