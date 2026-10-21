import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
    },
    updatedBy: {
      type: String,
      default: 'System',
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a complaint title'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: ['Electricity', 'Wi-Fi', 'Cleanliness', 'Water', 'Furniture', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Please provide the location / building / room number'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    assignedDepartment: {
      type: String,
      default: 'Unassigned',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      default: 'Student',
    },
    userEmail: {
      type: String,
      default: '',
    },
    timeline: [timelineEventSchema],
  },
  {
    timestamps: true,
  }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
