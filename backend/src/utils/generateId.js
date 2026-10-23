import Complaint from '../models/Complaint.js';

export const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const prefix = `CC-${currentYear}-`;

  // Find all existing complaints for the current year to determine maximum sequence
  const yearComplaints = await Complaint.find(
    { complaintId: new RegExp(`^${prefix}`) },
    { complaintId: 1 }
  ).lean();

  let maxNum = 0;
  for (const c of yearComplaints) {
    if (c.complaintId) {
      const parts = c.complaintId.split('-');
      if (parts.length >= 3) {
        const num = parseInt(parts[2], 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  }

  let counter = maxNum + 1;
  let candidateId = `${prefix}${counter.toString().padStart(4, '0')}`;

  // Double-check uniqueness in database to guarantee no duplicate key collision
  while (await Complaint.exists({ complaintId: candidateId })) {
    counter++;
    candidateId = `${prefix}${counter.toString().padStart(4, '0')}`;
  }

  return candidateId;
};
