import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  res.json({
    success: true,
    data: store.support || { counsellors: [], helplines: [] }
  });
});

export default router;
