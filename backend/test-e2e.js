const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🚀 Starting CampusCare Full-Stack End-to-End API Test Suite...\n');

  // 1. Health check
  console.log('1. Testing /health endpoint...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('   Status:', healthRes.status, healthData.system);
  if (healthData.status !== 'online') throw new Error('Health check failed');

  // 2. Student Login
  console.log('\n2. Testing Student Login (student@campuscare.edu)...');
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@campuscare.edu', password: 'student123' }),
  });
  const studentAuth = await studentLoginRes.json();
  console.log('   Logged in user:', studentAuth.user.name, `(${studentAuth.user.role})`);
  const studentToken = studentAuth.token;
  if (!studentToken) throw new Error('Student login failed');

  // 3. Fetch Student Analytics
  console.log('\n3. Testing Student Analytics (/complaints/analytics)...');
  const studentStatsRes = await fetch(`${BASE_URL}/complaints/analytics`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const studentStats = await studentStatsRes.json();
  console.log('   Student tickets count:', studentStats.stats.total);

  // 4. Student Submits New Complaint
  console.log('\n4. Testing Complaint Submission (POST /complaints)...');
  const newComplaintPayload = {
    title: 'Intermittent Wi-Fi outage in CS Lab 402',
    category: 'Wi-Fi',
    priority: 'High',
    location: 'Computer Science Block, 4th Floor, Lab 402',
    description: 'The 5GHz band drops packet connections every 10 minutes during coding evaluations.',
    image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
  };

  const createRes = await fetch(`${BASE_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${studentToken}`,
    },
    body: JSON.stringify(newComplaintPayload),
  });
  const createData = await createRes.json();
  const createdComplaint = createData.complaint;
  console.log('   Created Ticket ID:', createdComplaint.complaintId);
  console.log('   Status:', createdComplaint.status);
  console.log('   Initial Timeline Entries:', createdComplaint.timeline.length);
  if (!createdComplaint.complaintId.startsWith('CC-2026-')) {
    throw new Error('Complaint ID format invalid');
  }

  // 5. Verify in My Complaints
  console.log('\n5. Testing Student My Complaints (/complaints/my)...');
  const myRes = await fetch(`${BASE_URL}/complaints/my`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const myData = await myRes.json();
  const found = myData.complaints.find((c) => c._id === createdComplaint._id);
  if (!found) throw new Error('Created complaint not found in my complaints list');
  console.log('   Verified newly created complaint in student list successfully.');

  // 6. Admin Login
  console.log('\n6. Testing Admin Login (admin@campuscare.edu)...');
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@campuscare.edu', password: 'admin123' }),
  });
  const adminAuth = await adminLoginRes.json();
  console.log('   Logged in user:', adminAuth.user.name, `(${adminAuth.user.role})`);
  const adminToken = adminAuth.token;
  if (!adminToken || adminAuth.user.role !== 'admin') throw new Error('Admin login failed');

  // 7. Admin Views All Complaints & Stats
  console.log('\n7. Testing Admin All Complaints & Campus Analytics...');
  const allRes = await fetch(`${BASE_URL}/complaints/all`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const allData = await allRes.json();
  console.log('   Total campus complaints visible to admin:', allData.count);

  // 8. Admin Updates Status & Assigns Department
  console.log('\n8. Testing Admin Status Update & Department Assignment (PATCH /complaints/:id/status)...');
  const updateRes = await fetch(`${BASE_URL}/complaints/${createdComplaint._id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      status: 'In Progress',
      assignedDepartment: 'IT & Networking',
      priority: 'High',
      adminNotes: 'Assigned Senior Network Tech Sanjay to replace switch S-402.',
      actionNote: 'Technician dispatched with replacement optical gigabit transceiver.',
    }),
  });
  const updateData = await updateRes.json();
  console.log('   Updated Status:', updateData.complaint.status);
  console.log('   Assigned Department:', updateData.complaint.assignedDepartment);
  console.log('   Timeline Steps count:', updateData.complaint.timeline.length);
  console.log('   Latest Timeline Action:', updateData.complaint.timeline[updateData.complaint.timeline.length - 1].action);

  // 9. Verify Student can see the updated timeline
  console.log('\n9. Verifying Student can view the updated timeline and department...');
  const verifyRes = await fetch(`${BASE_URL}/complaints/${createdComplaint._id}`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const verifyData = await verifyRes.json();
  if (verifyData.complaint.status !== 'In Progress') throw new Error('Status mismatch for student view');
  if (verifyData.complaint.assignedDepartment !== 'IT & Networking') throw new Error('Department mismatch');
  console.log('   Student verified status:', verifyData.complaint.status);
  console.log('   Student verified department:', verifyData.complaint.assignedDepartment);
  console.log('   Timeline length visible to student:', verifyData.complaint.timeline.length);

  console.log('\n🎉 ALL 9 TEST SUITES PASSED FLAWLESSLY! CampusCare is 100% operational.');
}

runTests().catch((err) => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
