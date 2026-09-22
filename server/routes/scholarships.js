import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { category, search, status } = req.query;
  let scholarships = store.scholarships || [];

  if (category && category !== 'All') {
    scholarships = scholarships.filter(s => s.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (status && status !== 'All') {
    scholarships = scholarships.filter(s => s.status.toLowerCase().includes(status.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    scholarships = scholarships.filter(s => 
      s.name.toLowerCase().includes(q) ||
      s.provider.toLowerCase().includes(q) ||
      s.eligibility.toLowerCase().includes(q) ||
      s.details.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: scholarships.length,
    data: scholarships
  });
});

router.get('/:id', (req, res) => {
  const store = getStore();
  const item = (store.scholarships || []).find(s => s.id.toLowerCase() === req.params.id.toLowerCase());

  if (!item) {
    return res.status(404).json({ success: false, error: 'Scholarship scheme not found' });
  }

  res.json({ success: true, data: item });
});

export default router;
