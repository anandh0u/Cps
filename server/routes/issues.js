import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

// GET all issues (with optional filtering)
router.get('/', (req, res) => {
  const store = getStore();
  const { category, status, search } = req.query;
  let issues = store.issues || [];

  if (category && category !== 'All') {
    issues = issues.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }
  if (status && status !== 'All') {
    issues = issues.filter(i => i.status.toLowerCase() === status.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    issues = issues.filter(i => 
      i.id.toLowerCase().includes(q) ||
      i.title.toLowerCase().includes(q) ||
      i.location.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q)
    );
  }

  // Sort newest first
  issues = [...issues].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  res.json({ success: true, count: issues.length, data: issues });
});

// GET issue by ID (for student tracking)
router.get('/:id', (req, res) => {
  const store = getStore();
  const issue = (store.issues || []).find(i => i.id.toLowerCase() === req.params.id.toLowerCase());

  if (!issue) {
    return res.status(404).json({ success: false, error: 'Issue ticket not found.' });
  }

  res.json({ success: true, data: issue });
});

// POST new issue (Student -> Website -> Submit Issue)
router.post('/', (req, res) => {
  const store = getStore();
  const { title, category, location, priority, description, reportedBy, contactEmail } = req.body;

  if (!title || !category || !location || !description) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in Title, Category, Location, and Description.'
    });
  }

  const issues = store.issues || [];
  const maxNumber = issues.reduce((max, item) => {
    const match = item.id.match(/\d+/);
    return match ? Math.max(max, parseInt(match[0], 10)) : max;
  }, 2040);

  const newId = `CPS-ISSUE-${maxNumber + 1}`;
  const now = new Date().toISOString();

  // Assign appropriate committee contact
  let assignedCommittee = 'Student Welfare Committee';
  if (category.toLowerCase().includes('lab')) {
    assignedCommittee = 'Er. Sreejith K. (Hardware Lab Superintendent)';
  } else if (category.toLowerCase().includes('software') || category.toLowerCase().includes('it')) {
    assignedCommittee = 'System Administrator (Ragesh P.)';
  } else if (category.toLowerCase().includes('classroom')) {
    assignedCommittee = 'AV & Campus Infrastructure Cell';
  } else if (category.toLowerCase().includes('hostel') || category.toLowerCase().includes('amenities')) {
    assignedCommittee = 'Hostel & Amenities Liaison';
  }

  const newIssue = {
    id: newId,
    title: title.trim(),
    category,
    location: location.trim(),
    priority: priority || 'Medium',
    status: 'Under Review',
    submittedAt: now,
    description: description.trim(),
    reportedBy: reportedBy?.trim() || 'CPS Student (Anonymous)',
    contactEmail: contactEmail?.trim() || null,
    assignedCommittee,
    timeline: [
      {
        timestamp: now,
        actor: 'Student Helpdesk System',
        note: `Issue submitted by student. Assigned to ${assignedCommittee} for initial assessment.`
      }
    ]
  };

  store.issues.unshift(newIssue);
  saveStore();

  res.status(201).json({
    success: true,
    message: `Issue ticket ${newId} submitted successfully.`,
    data: newIssue
  });
});

// PATCH issue status & resolution notes (Committee -> Track/Resolve -> Update)
router.patch('/:id/status', (req, res) => {
  const store = getStore();
  const issue = (store.issues || []).find(i => i.id.toLowerCase() === req.params.id.toLowerCase());

  if (!issue) {
    return res.status(404).json({ success: false, error: 'Issue ticket not found.' });
  }

  const { status, note, actor, assignedCommittee } = req.body;

  if (status) {
    issue.status = status;
  }
  if (assignedCommittee) {
    issue.assignedCommittee = assignedCommittee;
  }

  if (note) {
    issue.timeline = issue.timeline || [];
    issue.timeline.push({
      timestamp: new Date().toISOString(),
      actor: actor || 'Welfare Committee Officer',
      note: note.trim()
    });
  }

  saveStore();
  res.json({
    success: true,
    message: `Issue ${issue.id} status updated to ${issue.status}.`,
    data: issue
  });
});

export default router;
