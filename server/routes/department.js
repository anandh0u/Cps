import { Router } from 'express';
import { getStore } from '../db.js';

const router = Router();

router.get('/', (req, res) => {
  const store = getStore();
  const rooms = store.rooms || [];
  const complaints = store.complaints || [];
  const scholarships = store.scholarships || [];
  const events = store.events || [];
  const updates = store.updates || [];

  const liveStats = {
    activeLabs: rooms.filter(r => r.type === 'Laboratory').length,
    classrooms: rooms.filter(r => r.type === 'Classroom').length,
    seminarHalls: rooms.filter(r => r.type.includes('Seminar')).length,
    availableScholarships: scholarships.length,
    openComplaints: complaints.filter(c => c.status !== 'Resolved').length,
    resolvedComplaints: complaints.filter(c => c.status === 'Resolved').length,
    upcomingEventsCount: events.filter(e => e.status !== 'Past').length,
    activeNotices: updates.length
  };

  res.json({
    success: true,
    data: {
      ...store.department,
      stats: liveStats
    }
  });
});

export default router;
