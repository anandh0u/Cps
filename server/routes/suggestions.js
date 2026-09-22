import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

// GET all suggestions
router.get('/', (req, res) => {
  const store = getStore();
  const suggestions = store.suggestions || [];
  // Sort by upvotes desc, then date desc
  const sorted = [...suggestions].sort((a, b) => b.upvotes - a.upvotes || new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  res.json({ success: true, count: sorted.length, data: sorted });
});

// POST new anonymous suggestion
router.post('/', (req, res) => {
  const store = getStore();
  const { title, category, idea } = req.body;

  if (!title || !idea) {
    return res.status(400).json({ success: false, error: 'Title and suggestion idea are required.' });
  }

  const suggestions = store.suggestions || [];
  const maxNumber = suggestions.reduce((max, item) => {
    const match = item.id.match(/\d+/);
    return match ? Math.max(max, parseInt(match[0], 10)) : max;
  }, 100);

  const newSuggestion = {
    id: `SUG-${maxNumber + 1}`,
    title: title.trim(),
    category: category || 'General Welfare',
    idea: idea.trim(),
    submittedAt: new Date().toISOString(),
    upvotes: 1,
    status: 'Under Review',
    officialResponse: 'Submitted to Welfare Committee for agenda review.'
  };

  store.suggestions.unshift(newSuggestion);
  saveStore();

  res.status(201).json({
    success: true,
    message: 'Anonymous suggestion submitted successfully.',
    data: newSuggestion
  });
});

// POST upvote suggestion
router.post('/:id/upvote', (req, res) => {
  const store = getStore();
  const item = (store.suggestions || []).find(s => s.id.toLowerCase() === req.params.id.toLowerCase());

  if (!item) {
    return res.status(404).json({ success: false, error: 'Suggestion not found.' });
  }

  item.upvotes = (item.upvotes || 0) + 1;
  saveStore();
  res.json({ success: true, upvotes: item.upvotes });
});

// PATCH suggestion status by committee
router.patch('/:id/status', (req, res) => {
  const store = getStore();
  const item = (store.suggestions || []).find(s => s.id.toLowerCase() === req.params.id.toLowerCase());

  if (!item) {
    return res.status(404).json({ success: false, error: 'Suggestion not found.' });
  }

  const { status, officialResponse } = req.body;
  if (status) item.status = status;
  if (officialResponse) item.officialResponse = officialResponse.trim();

  saveStore();
  res.json({ success: true, message: 'Suggestion updated', data: item });
});

export default router;
