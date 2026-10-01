import { Router } from 'express';
import { randomBytes, timingSafeEqual } from 'crypto';
import { getStore } from '../db.js';

const router = Router();

const COMMITTEE_PASSCODE = process.env.COMMITTEE_PASSCODE || (process.env.NODE_ENV === 'production' ? '' : 'committee2026');
const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const committeeSessions = new Map();

function passcodesMatch(candidate) {
  if (!COMMITTEE_PASSCODE || typeof candidate !== 'string') return false;
  const expected = Buffer.from(COMMITTEE_PASSCODE);
  const actual = Buffer.from(candidate);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function createCommitteeSession() {
  const token = randomBytes(32).toString('hex');
  committeeSessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

export function requireCommittee(req, res, next) {
  const authorization = req.get('authorization') || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const expiresAt = committeeSessions.get(token);

  if (!expiresAt || expiresAt <= Date.now()) {
    if (token) committeeSessions.delete(token);
    return res.status(401).json({ success: false, error: 'Committee session expired. Please sign in again.' });
  }

  next();
}

router.post('/verify', (req, res) => {
  const { passcode } = req.body;
  if (passcodesMatch(passcode)) {
    res.json({
      success: true,
      role: 'Welfare & Grievance Committee Member',
      token: createCommitteeSession(),
      expiresIn: SESSION_TTL_MS / 1000
    });
  } else {
    res.status(401).json({
      success: false,
      error: 'Invalid committee passcode. Access restricted to authorized faculty & student representatives.'
    });
  }
});

router.get('/metrics', requireCommittee, (req, res) => {
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
