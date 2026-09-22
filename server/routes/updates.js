import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { category, search, importance } = req.query;
  let updates = store.updates || [];

  if (category && category !== 'All') {
    updates = updates.filter(u => u.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (importance && importance !== 'All') {
    updates = updates.filter(u => u.importance.toLowerCase() === importance.toLowerCase());
  }
  if (search) {
    const q = search.toLowerCase();
    updates = updates.filter(u =>
      u.title.toLowerCase().includes(q) ||
      u.summary.toLowerCase().includes(q) ||
      u.issuedBy.toLowerCase().includes(q)
    );
  }

  // Sort by date desc
  updates = [...updates].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  res.json({
    success: true,
    count: updates.length,
    data: updates
  });
});

export default router;
