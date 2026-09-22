import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

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

router.post('/', (req, res) => {
  const store = getStore();
  const { title, category, summary, issuedBy, urgent } = req.body;

  if (!title || !summary) {
    return res.status(400).json({ success: false, error: 'Title and summary are required.' });
  }

  const list = store.announcements || [];
  const newAnn = {
    id: `ANN-${500 + list.length + 1}`,
    title: title.trim(),
    category: category || 'Welfare Notice',
    date: new Date().toISOString().slice(0, 10),
    summary: summary.trim(),
    issuedBy: issuedBy?.trim() || 'Student Welfare Committee',
    urgent: Boolean(urgent)
  };

  store.announcements.unshift(newAnn);
  saveStore();

  res.status(201).json({ success: true, message: 'Announcement published.', data: newAnn });
});

export default router;
