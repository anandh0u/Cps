import { Router } from 'express';
import { getStore, saveStore } from '../db.js';
import { requireCommittee } from './admin.js';

const router = Router();

function parseBoolean(value) {
  return value === true || value === 'true';
}

router.get('/', (req, res) => {
  const store = getStore();
  const { category, search } = req.query;
  let list = store.announcements || [];

  if (category && category !== 'All') {
    list = list.filter(a => a.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    list = list.filter(a => 
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.issuedBy.toLowerCase().includes(q)
    );
  }

  list = [...list].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json({ success: true, count: list.length, data: list });
});

router.post('/', requireCommittee, (req, res) => {
  const store = getStore();
  const { title, category, summary, issuedBy, urgent } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ success: false, error: 'Title and summary are required.' });
  }

  const list = store.announcements || [];
  store.announcements = list;
  const maxNumber = list.reduce((max, item) => {
    const match = String(item.id || '').match(/\d+/);
    return match ? Math.max(max, Number(match[0])) : max;
  }, 500);
  const newAnn = {
    id: `ANN-${maxNumber + 1}`,
    title: title.trim(),
    category: category || 'Welfare Notice',
    date: new Date().toISOString().slice(0, 10),
    summary: summary.trim(),
    issuedBy: issuedBy?.trim() || 'Student Welfare Committee',
    urgent: parseBoolean(urgent)
  };

  store.announcements.unshift(newAnn);
  saveStore();

  res.status(201).json({ success: true, message: 'Announcement published.', data: newAnn });
});

router.delete('/:id', requireCommittee, (req, res) => {
  const store = getStore();
  const { id } = req.params;
  const initialLength = (store.announcements || []).length;
  store.announcements = (store.announcements || []).filter(a => a.id !== id);
  if (store.announcements.length === initialLength) {
    return res.status(404).json({ success: false, error: 'Announcement not found.' });
  }
  saveStore();
  res.json({ success: true, message: 'Announcement deleted.' });
});

export default router;
