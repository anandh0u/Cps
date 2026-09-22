import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

// Simple, secure passcode for Committee / Admin session
const COMMITTEE_PASSCODE = 'committee2026';

router.post('/verify', (req, res) => {
  const { passcode } = req.body;
  if (passcode === COMMITTEE_PASSCODE) {
    res.json({
      success: true,
      role: 'Welfare & Grievance Committee Member',
      token: 'valid-committee-token'
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid committee passcode. Access restricted to authorized faculty & student representatives.'
    });
  }
});

router.get('/metrics', (req, res) => {
  const store = getStore();
  const issues = store.issues || [];
  const suggestions = store.suggestions || [];

  res.json({
    success: true,
    data: {
      totalIssues: issues.length,
      underReview: issues.filter(i => i.status === 'Under Review').length,
      inProgress: issues.filter(i => i.status === 'In Progress').length,
      resolved: issues.filter(i => i.status === 'Resolved').length,
      totalSuggestions: suggestions.length,
      implementedSuggestions: suggestions.filter(s => s.status === 'Implemented').length
    }
  });
});

export default router;
