import { Router } from 'express';
import { getStore, saveStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const { type, search } = req.query;
  let opportunities = store.opportunities || [];

  if (type && type !== 'All') {
    opportunities = opportunities.filter(o => o.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    opportunities = opportunities.filter(o => 
      o.title.toLowerCase().includes(q) ||
      o.organization.toLowerCase().includes(q) ||
      o.description.toLowerCase().includes(q) ||
      o.eligibility.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: opportunities.length, data: opportunities });
});

router.post('/', (req, res) => {
  const store = getStore();
  const { title, type, organization, stipend, deadline, location, eligibility, applyUrl, description } = req.body;

  if (!title || !organization || !applyUrl) {
    return res.status(400).json({ success: false, error: 'Title, organization, and apply link are mandatory.' });
  }

  const opportunities = store.opportunities || [];
  const newOpp = {
    id: `OPP-0${opportunities.length + 1}`,
    title: title.trim(),
    type: type || 'Internship',
    organization: organization.trim(),
    stipend: stipend || 'Not Specified',
    deadline: deadline || 'Open Until Filled',
    location: location || 'Hybrid / Kerala',
    eligibility: eligibility || 'CPS Students',
    applyUrl: applyUrl.trim(),
    description: description || ''
  };

  store.opportunities.unshift(newOpp);
  saveStore();

  res.status(201).json({ success: true, message: 'Opportunity posted.', data: newOpp });
});

export default router;
