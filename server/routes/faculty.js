import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { search } = req.query;
  let faculty = store.faculty || [];

  if (search) {
    const q = search.toLowerCase();
    faculty = faculty.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.labInCharge.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: faculty.length,
    data: faculty
  });
});

export default router;
