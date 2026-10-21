import Complaint from '../models/Complaint.js';

export const generateComplaintId = async () => {
  const currentYear = new Date().getFullYear();
  const count = await Complaint.countDocuments();
  const nextNum = (count + 1).toString().padStart(4, '0');
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `CC-${currentYear}-${nextNum}`;
};
