import User from '../models/User.js';
import Complaint from '../models/Complaint.js';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already has users, skipping initial seed.');
      return;
    }

    console.log('Seeding demo users and complaints for CampusCare...');

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. Arthur Vance (Dean of Facilities)',
      email: 'admin@campuscare.edu',
      password: 'admin123',
      role: 'admin',
      department: 'Campus Administration',
    });

    // 2. Create Students
    const student1 = await User.create({
      name: 'Alex Rivera',
      email: 'student@campuscare.edu',
      password: 'student123',
      role: 'student',
      studentId: 'CS-2024-4192',
      department: 'Computer Science & Engineering',
    });

    const student2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya@campuscare.edu',
      password: 'student123',
      role: 'student',
      studentId: 'EE-2024-1108',
      department: 'Electrical Engineering',
    });

    // 3. Create Sample Complaints
    const sampleComplaints = [
      {
        complaintId: 'CC-2026-0001',
        title: 'High-speed Wi-Fi deadzone in Library 3rd Floor East Wing',
        category: 'Wi-Fi',
        description: 'The Wi-Fi access point near Study Hall 3B frequently drops connection or gives DNS probe errors during peak study hours (2 PM - 6 PM). Over 40 students cannot access research portals.',
        location: 'Central Library, 3rd Floor, Room 304',
        image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
        status: 'In Progress',
        priority: 'High',
        assignedDepartment: 'IT & Networking',
        adminNotes: 'IT team dispatched a technician to replace the AP-Aruba gateway router.',
        userId: student1._id,
        userName: student1.name,
        userEmail: student1.email,
        timeline: [
          {
            status: 'Pending',
            action: 'Complaint Registered',
            note: 'Ticket automatically generated and queued for review.',
            updatedBy: student1.name,
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'Pending',
            action: 'Reviewed by Helpdesk',
            note: 'Verified signal drop logs with network administrator.',
            updatedBy: 'Admin Team',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Progress',
            action: 'Assigned to IT & Networking',
            note: 'Technician Rajesh Kumar assigned. New enterprise Cisco AP ordered for replacement.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        complaintId: 'CC-2026-0002',
        title: 'Ceiling water leakage near Electrical Switchboard in Lab 204',
        category: 'Water',
        description: 'Noticeable water dripping from overhead pipe joint directly adjacent to the high-voltage lab panel. Immediate hazard risk of short circuit.',
        location: 'Engineering Block B, Room 204',
        image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80',
        status: 'Pending',
        priority: 'Critical',
        assignedDepartment: 'Plumbing & Facilities',
        adminNotes: '',
        userId: student1._id,
        userName: student1.name,
        userEmail: student1.email,
        timeline: [
          {
            status: 'Pending',
            action: 'Complaint Registered',
            note: 'Urgent priority ticket logged by student.',
            updatedBy: student1.name,
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
          },
        ],
      },
      {
        complaintId: 'CC-2026-0003',
        title: 'Broken benches and damaged projector mount in Seminar Hall 1',
        category: 'Furniture',
        description: 'Row 4 seats 12-15 have cracked hydraulic hinges. Also, projector mount vibration causes distorted display during lectures.',
        location: 'Academic Complex 1, Seminar Hall A',
        image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
        status: 'Resolved',
        priority: 'Medium',
        assignedDepartment: 'Carpentry & Maintenance',
        adminNotes: 'Repaired broken hinges and recalibrated ceiling bracket. Inspected by Estate Officer.',
        userId: student1._id,
        userName: student1.name,
        userEmail: student1.email,
        timeline: [
          {
            status: 'Pending',
            action: 'Complaint Registered',
            note: 'Ticket submitted with photo proof.',
            updatedBy: student1.name,
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Progress',
            action: 'Assigned to Carpentry',
            note: 'Carpentry team visited site and reinstalled seating hinges.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'Resolved',
            action: 'Issue Resolved & Verified',
            note: 'All 4 seats replaced and projector securely bolted. Ready for presentations.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        complaintId: 'CC-2026-0004',
        title: 'Flickering LED tubes and faulty switch in Hostel 4 corridor',
        category: 'Electricity',
        description: 'The second floor corridor lighting is flickering constantly at night, causing severe discomfort and poor visibility.',
        location: 'Hostel Block 4, 2nd Floor Corridor',
        image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=600&q=80',
        status: 'In Progress',
        priority: 'Medium',
        assignedDepartment: 'Electrical Department',
        adminNotes: 'Electrician scheduled for bulb ballast replacement tomorrow morning.',
        userId: student2._id,
        userName: student2.name,
        userEmail: student2.email,
        timeline: [
          {
            status: 'Pending',
            action: 'Complaint Registered',
            note: 'Hostel lighting issue reported.',
            updatedBy: student2.name,
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Progress',
            action: 'Assigned to Electrical Dept',
            note: 'Choke and LED strips replacement work initiated.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
        ],
      },
      {
        complaintId: 'CC-2026-0005',
        title: 'Waste bins overflowing near Food Court cafeteria lawn',
        category: 'Cleanliness',
        description: 'Recycling and compost bins have been overflowing since yesterday evening. Stray animals are scattering food packaging.',
        location: 'Student Activity Center, Outdoor Food Court',
        image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80',
        status: 'Resolved',
        priority: 'High',
        assignedDepartment: 'Sanitation & Housekeeping',
        adminNotes: 'Sanitation squad cleared bins and sanitized the surrounding perimeter.',
        userId: student2._id,
        userName: student2.name,
        userEmail: student2.email,
        timeline: [
          {
            status: 'Pending',
            action: 'Complaint Registered',
            note: 'Cleanliness violation reported.',
            updatedBy: student2.name,
            timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'In Progress',
            action: 'Cleaning Crew Dispatched',
            note: 'Housekeeping supervisor on site.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            status: 'Resolved',
            action: 'Cleared & Sanitized',
            note: 'Area thoroughly cleaned. Two extra wheelie bins stationed.',
            updatedBy: 'Campus Admin',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          },
        ],
      },
    ];

    await Complaint.insertMany(sampleComplaints);
    console.log('Demo database seeded successfully with 2 students, 1 admin, and 5 detailed complaints!');
  } catch (err) {
    console.error('Error during database seeding:', err.message);
  }
};
