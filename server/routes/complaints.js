import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { category, status, search } = req.query;
  let complaints = store.complaints || [];

  if (category && category !== 'All') {
    complaints = complaints.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== 'All') {
    complaints = complaints.filter(c => c.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    complaints = complaints.filter(c => 
      c.id.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }

  // Sort latest first
  complaints = [...complaints].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  res.json({
    success: true,
    count: complaints.length,
    data: complaints
  });
});

router.get('/:id', (req, res) => {
  const store = getStore();
  const complaint = (store.complaints || []).find(c => c.id.toLowerCase() === req.params.id.toLowerCase());

  if (!complaint) {
    return res.status(404).json({ success: false, error: 'Complaint ticket not found' });
  }

  res.json({ success: true, data: complaint });
});

router.post('/', (req, res) => {
  const store = getStore();
  const { title, category, location, priority, description, reportedBy, contactEmail } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: title, category, location, description are mandatory.'
    });
  }

  const complaints = store.complaints || [];
  // Generate ticket number e.g. CPS-TKT-1045
  const maxNumber = complaints.reduce((max, c) => {
    const match = c.id.match(/\d+/);
    return match ? Math.max(max, parseInt(match[0], 10)) : max;
  }, 1040);

  const newId = `CPS-TKT-${maxNumber + 1}`;
  const now = new Date().toISOString();

  // Assign default in-charge based on category/location
  let assignedTo = 'Department Maintenance Helpdesk';
  if (category.toLowerCase().includes('hardware')) {
    assignedTo = 'Er. Sreejith K. (Hardware Lab Superintendent)';
  } else if (category.toLowerCase().includes('software')) {
    assignedTo = 'System Administrator (Ragesh P.)';
  } else if (category.toLowerCase().includes('classroom') || location.toLowerCase().includes('cr-')) {
    assignedTo = 'AV & Campus Infrastructure Cell';
  }

  const newTicket = {
    id: newId,
    title: title.trim(),
    category,
    location: location.trim(),
    priority: priority || 'Medium',
    status: 'Under Review',
    submittedAt: now,
    description: description.trim(),
    reportedBy: reportedBy?.trim() || 'CPS Department Student (Anonymous)',
    contactEmail: contactEmail?.trim() || null,
    assignedTo,
    updates: [
      {
        timestamp: now,
        note: `Ticket generated and routed to ${assignedTo}.`
      }
    ]
  };

  store.complaints.unshift(newTicket);
  saveStore();

  res.status(201).json({
    success: true,
    message: `Grievance ticket ${newId} registered successfully`,
    data: newTicket
  });
});

router.patch('/:id/status', (req, res) => {
  const store = getStore();
  const complaint = (store.complaints || []).find(c => c.id.toLowerCase() === req.params.id.toLowerCase());

  if (!complaint) {
    return res.status(404).json({ success: false, error: 'Complaint ticket not found' });
  }

  const { status, note } = req.body;
  if (status) complaint.status = status;

  if (note) {
    complaint.updates = complaint.updates || [];
    complaint.updates.push({
      timestamp: new Date().toISOString(),
      note: note.trim()
    });
  }

  saveStore();
  res.json({ success: true, message: 'Ticket updated', data: complaint });
});

export default router;
