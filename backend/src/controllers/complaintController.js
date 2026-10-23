import Complaint from '../models/Complaint.js';
import mongoose from 'mongoose';
import { generateComplaintId } from '../utils/generateId.js';

// Safe regex helper to prevent regex injection or parse crashes
const escapeRegex = (text) => {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Students & Admins)
export const createComplaint = async (req, res, next) => {
  try {
    const { title, category, description, location, image, priority } = req.body;

    if (!title || !category || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, category, description, and location',
      });
    }

    const complaintId = await generateComplaintId();

    const newComplaint = await Complaint.create({
      complaintId,
      title: title.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      image: image || '',
      priority: priority || 'Medium',
      status: 'Pending',
      assignedDepartment: 'Unassigned',
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      timeline: [
        {
          status: 'Pending',
          action: 'Complaint Logged',
          note: 'Ticket registered successfully in CampusCare.',
          updatedBy: req.user.name,
          timestamp: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully',
      complaint: newComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's complaints
// @route   GET /api/complaints/my
// @access  Private (Student)
export const getMyComplaints = async (req, res, next) => {
  try {
    const { category, status, search, sort = '-createdAt' } = req.query;

    const query = { userId: req.user._id };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const sanitized = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { complaintId: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query).sort(sort);

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all complaints across campus
// @route   GET /api/complaints/all
// @access  Private (Admin Only)
export const getAllComplaints = async (req, res, next) => {
  try {
    const { category, status, department, priority, search, sort = '-createdAt' } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (department && department !== 'All') {
      query.assignedDepartment = department;
    }

    if (priority && priority !== 'All') {
      query.priority = priority;
    }

    if (search && search.trim()) {
      const sanitized = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { complaintId: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
        { userName: { $regex: sanitized, $options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query).sort(sort);

    res.json({
      success: true,
      count: complaints.length,
      complaints,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single complaint by ID
// @route   GET /api/complaints/:id
// @access  Private (Owner or Admin)
export const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    // Role check: If not admin and not the owner
    if (
      req.user.role !== 'admin' &&
      complaint.userId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this complaint',
      });
    }

    res.json({
      success: true,
      complaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update complaint status, department, or admin notes
// @route   PATCH /api/complaints/:id/status
// @access  Private (Admin Only)
export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedDepartment, priority, adminNotes, actionNote } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    const statusChanged = status && status !== complaint.status;
    const departmentChanged = assignedDepartment && assignedDepartment !== complaint.assignedDepartment;
    const priorityChanged = priority && priority !== complaint.priority;
    const adminNotesChanged = adminNotes !== undefined && adminNotes !== complaint.adminNotes;
    const hasActionNote = Boolean(actionNote && actionNote.trim());

    if (status) complaint.status = status;
    if (assignedDepartment) complaint.assignedDepartment = assignedDepartment;
    if (priority) complaint.priority = priority;
    if (adminNotes !== undefined) complaint.adminNotes = adminNotes;

    // Only record a timeline entry if something actually changed or an action note was provided
    if (statusChanged || departmentChanged || priorityChanged || adminNotesChanged || hasActionNote) {
      let action = 'Status Updated';
      let note = actionNote ? actionNote.trim() : '';

      if (statusChanged && departmentChanged) {
        action = `Assigned to ${assignedDepartment} & Status set to ${status}`;
        if (!note) note = `Transferred to ${assignedDepartment} for urgent resolution.`;
      } else if (departmentChanged) {
        action = `Department Assigned: ${assignedDepartment}`;
        if (!note) note = `Assigned to ${assignedDepartment} team for technical dispatch.`;
      } else if (statusChanged) {
        action = `Status changed to ${status}`;
        if (!note) {
          if (status === 'In Progress') note = 'Field crew has initiated troubleshooting.';
          else if (status === 'Resolved') note = 'Issue resolved and inspected on site.';
          else if (status === 'Rejected') note = 'Ticket reviewed and marked invalid or duplicate.';
        }
      } else if (priorityChanged) {
        action = `Priority changed to ${priority}`;
        if (!note) note = `Priority level adjusted to ${priority}.`;
      } else {
        action = 'Admin Note Added';
        if (!note) note = adminNotes || 'Administrator updated ticket metadata.';
      }

      complaint.timeline.push({
        status: complaint.status,
        action,
        note,
        updatedBy: req.user.name,
        timestamp: new Date(),
      });
    }

    const updatedComplaint = await complaint.save();

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      complaint: updatedComplaint,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics and statistical summary
// @route   GET /api/complaints/analytics
// @access  Private (Student or Admin)
export const getComplaintStats = async (req, res, next) => {
  try {
    const isAdmin = req.user.role === 'admin';
    const matchFilter = isAdmin
      ? {}
      : { userId: new mongoose.Types.ObjectId(req.user._id) };

    const total = await Complaint.countDocuments(matchFilter);
    const pending = await Complaint.countDocuments({ ...matchFilter, status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ ...matchFilter, status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ ...matchFilter, status: 'Resolved' });
    const rejected = await Complaint.countDocuments({ ...matchFilter, status: 'Rejected' });

    // Category breakdown
    const categoryCounts = await Complaint.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    // Department breakdown
    const departmentCounts = await Complaint.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$assignedDepartment', count: { $sum: 1 } } },
    ]);

    // Priority breakdown
    const priorityCounts = await Complaint.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    // Recent 5 complaints
    const recentComplaints = await Complaint.find(matchFilter)
      .sort('-createdAt')
      .limit(5);

    res.json({
      success: true,
      stats: {
        total,
        pending,
        inProgress,
        resolved,
        rejected,
        categoryCounts,
        departmentCounts,
        priorityCounts,
        recentComplaints,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a complaint
// @route   DELETE /api/complaints/:id
// @access  Private (Admin or Owner if Pending)
export const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found',
      });
    }

    if (req.user.role !== 'admin') {
      if (complaint.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to delete this complaint',
        });
      }
      if (complaint.status !== 'Pending') {
        return res.status(400).json({
          success: false,
          message: 'Only pending complaints can be deleted by students',
        });
      }
    }

    await Complaint.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Complaint removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
