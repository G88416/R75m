// Bophelong Ola Age Home - Shared JavaScript

// ─── Role & Auth ────────────────────────────────────────────────────────────

function checkRole(requiredRole) {
    const role = localStorage.getItem('role');
    if (role !== requiredRole) {
        showToast('Access denied. Please login.', 'danger');
        setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    }
}

function logout() {
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function login(role) {
    localStorage.setItem('role', role);
    window.location.href = role + '.html';
}

// ─── Data Layer (localStorage) ──────────────────────────────────────────────

const KEYS = {
    residents: 'boph_residents',
    staff: 'boph_staff',
    rooms: 'boph_rooms',
    appointments: 'boph_appointments',
    feedback: 'boph_feedback',
    activities: 'boph_activities'
};

function loadData(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        return [];
    }
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function generateId(items) {
    if (!items.length) return 1;
    return Math.max(...items.map(i => Number(i.id) || 0)) + 1;
}

function addItem(key, item) {
    const items = loadData(key);
    item.id = generateId(items);
    item.createdAt = new Date().toISOString();
    items.push(item);
    saveData(key, items);
    return item;
}

function updateItem(key, updatedItem) {
    const items = loadData(key);
    const index = items.findIndex(i => String(i.id) === String(updatedItem.id));
    if (index !== -1) {
        updatedItem.updatedAt = new Date().toISOString();
        items[index] = { ...items[index], ...updatedItem };
        saveData(key, items);
        return true;
    }
    return false;
}

function deleteItem(key, id) {
    let items = loadData(key);
    items = items.filter(i => String(i.id) !== String(id));
    saveData(key, items);
}

// ─── Seed Demo Data ──────────────────────────────────────────────────────────

function seedDemoData() {
    if (loadData(KEYS.residents).length === 0) {
        const residents = [
            { name: 'Nomsa Dlamini', age: 72, contact: '011-234-5678', room: '101', medical: 'Hypertension, controlled with medication.', emergencyContact: 'Thabo Dlamini (son) 082-111-2222' },
            { name: 'Johannes Botha', age: 68, contact: '021-987-6543', room: '102', medical: 'Diabetes Type 2. Insulin twice daily.', emergencyContact: 'Maria Botha (daughter) 083-333-4444' },
            { name: 'Miriam Nkosi', age: 80, contact: '031-555-7890', room: '103', medical: 'Arthritis. Physiotherapy weekly.', emergencyContact: 'Sipho Nkosi (grandson) 071-555-6666' },
        ];
        residents.forEach(r => addItem(KEYS.residents, r));
    }
    if (loadData(KEYS.staff).length === 0) {
        const staff = [
            { name: 'Dr. Lerato Mokoena', role: 'Doctor', contact: '011-100-2000', specialization: 'Geriatrics', shift: 'Morning' },
            { name: 'Sister Fatima Patel', role: 'Nurse', contact: '011-100-2001', specialization: 'General Care', shift: 'Morning' },
            { name: 'Mr. David Sithole', role: 'Caregiver', contact: '011-100-2002', specialization: 'Personal Care', shift: 'Afternoon' },
        ];
        staff.forEach(s => addItem(KEYS.staff, s));
    }
    if (loadData(KEYS.rooms).length === 0) {
        const rooms = [
            { number: '101', type: 'Single', status: 'Occupied', residentId: '1', floor: '1' },
            { number: '102', type: 'Single', status: 'Occupied', residentId: '2', floor: '1' },
            { number: '103', type: 'Double', status: 'Occupied', residentId: '3', floor: '1' },
            { number: '104', type: 'Single', status: 'Vacant', residentId: '', floor: '1' },
            { number: '201', type: 'Double', status: 'Vacant', residentId: '', floor: '2' },
            { number: '202', type: 'Single', status: 'Vacant', residentId: '', floor: '2' },
        ];
        rooms.forEach(r => addItem(KEYS.rooms, r));
    }
    if (loadData(KEYS.appointments).length === 0) {
        const today = new Date();
        const fmtDate = (d) => d.toISOString().split('T')[0];
        const appointments = [
            { residentId: '1', staffId: '1', date: fmtDate(today), time: '09:00', type: 'Check-up', notes: 'Routine blood pressure check.', status: 'Scheduled' },
            { residentId: '2', staffId: '1', date: fmtDate(new Date(today.getTime() + 86400000)), time: '10:30', type: 'Follow-up', notes: 'Insulin dosage review.', status: 'Scheduled' },
            { residentId: '3', staffId: '2', date: fmtDate(new Date(today.getTime() + 172800000)), time: '14:00', type: 'Physiotherapy', notes: 'Weekly physiotherapy session.', status: 'Scheduled' },
        ];
        appointments.forEach(a => addItem(KEYS.appointments, a));
    }
    if (loadData(KEYS.activities).length === 0) {
        const activities = [
            { name: 'Morning Exercise', day: 'Monday, Wednesday, Friday', time: '07:30', location: 'Garden', facilitator: 'Mr. David Sithole' },
            { name: 'Arts & Crafts', day: 'Tuesday, Thursday', time: '10:00', location: 'Activity Room', facilitator: 'Volunteer Team' },
            { name: 'Movie Afternoon', day: 'Saturday', time: '14:00', location: 'Lounge', facilitator: 'Staff on Duty' },
            { name: 'Religious Service', day: 'Sunday', time: '09:00', location: 'Chapel', facilitator: 'Chaplain' },
        ];
        activities.forEach(a => addItem(KEYS.activities, a));
    }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function updateStats() {
    const residents = loadData(KEYS.residents);
    const staff = loadData(KEYS.staff);
    const rooms = loadData(KEYS.rooms);
    const appointments = loadData(KEYS.appointments);

    const vacantRooms = rooms.filter(r => r.status === 'Vacant').length;
    const today = new Date().toISOString().split('T')[0];
    const todayApps = appointments.filter(a => a.date === today).length;

    setEl('statResidents', residents.length);
    setEl('statStaff', staff.length);
    setEl('statVacant', vacantRooms);
    setEl('statAppointments', todayApps);
}

function setEl(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// ─── Residents CRUD ──────────────────────────────────────────────────────────

function saveResident() {
    const id = document.getElementById('residentId').value.trim();
    const name = document.getElementById('residentName').value.trim();
    const age = document.getElementById('residentAge').value.trim();
    const contact = document.getElementById('residentContact').value.trim();
    const medical = document.getElementById('residentMedical').value.trim();
    const room = document.getElementById('residentRoom').value.trim();
    const emergency = document.getElementById('residentEmergency').value.trim();

    if (!name || !age || !contact) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    const resident = { name, age, contact, medical, room, emergencyContact: emergency };

    if (id) {
        resident.id = id;
        updateItem(KEYS.residents, resident);
        showToast('Resident updated successfully!', 'success');
    } else {
        addItem(KEYS.residents, resident);
        showToast('Resident added successfully!', 'success');
    }
    clearForm('residentForm');
    loadResidents();
    updateStats();
}

function loadResidents(filter) {
    const residents = loadData(KEYS.residents);
    const table = document.getElementById('residentsTable');
    if (!table) return;

    const list = filter
        ? residents.filter(r =>
            r.name.toLowerCase().includes(filter.toLowerCase()) ||
            String(r.id).includes(filter) ||
            (r.room || '').includes(filter))
        : residents;

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No residents found.</td></tr>`;
        return;
    }

    table.innerHTML = list.map(r => `
        <tr>
            <td data-label="ID">${r.id}</td>
            <td data-label="Name"><strong>${esc(r.name)}</strong></td>
            <td data-label="Age">${r.age}</td>
            <td data-label="Room">${esc(r.room || 'N/A')}</td>
            <td data-label="Contact">${esc(r.contact)}</td>
            <td data-label="Medical"><span class="text-truncate d-inline-block" style="max-width:150px" title="${esc(r.medical)}">${esc(r.medical || '-')}</span></td>
            <td data-label="Actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editResident(${r.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${KEYS.residents}', ${r.id}, loadResidents)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

function editResident(id) {
    const r = loadData(KEYS.residents).find(r => String(r.id) === String(id));
    if (!r) return;
    document.getElementById('residentId').value = r.id;
    document.getElementById('residentName').value = r.name;
    document.getElementById('residentAge').value = r.age;
    document.getElementById('residentContact').value = r.contact;
    document.getElementById('residentMedical').value = r.medical || '';
    document.getElementById('residentRoom').value = r.room || '';
    document.getElementById('residentEmergency').value = r.emergencyContact || '';
    document.getElementById('residentFormTitle').textContent = 'Edit Resident';
    document.getElementById('residentForm').scrollIntoView({ behavior: 'smooth' });
}

// ─── Staff CRUD ───────────────────────────────────────────────────────────────

function saveStaff() {
    const id = document.getElementById('staffId').value.trim();
    const name = document.getElementById('staffName').value.trim();
    const role = document.getElementById('staffRole').value.trim();
    const contact = document.getElementById('staffContact').value.trim();
    const spec = document.getElementById('staffSpec').value.trim();
    const shift = document.getElementById('staffShift').value.trim();

    if (!name || !role || !contact) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    const staff = { name, role, contact, specialization: spec, shift };

    if (id) {
        staff.id = id;
        updateItem(KEYS.staff, staff);
        showToast('Staff updated successfully!', 'success');
    } else {
        addItem(KEYS.staff, staff);
        showToast('Staff member added successfully!', 'success');
    }
    clearForm('staffForm');
    loadStaff();
    updateStats();
}

function loadStaff(filter) {
    const staff = loadData(KEYS.staff);
    const table = document.getElementById('staffTable');
    if (!table) return;

    const list = filter
        ? staff.filter(s =>
            s.name.toLowerCase().includes(filter.toLowerCase()) ||
            s.role.toLowerCase().includes(filter.toLowerCase()))
        : staff;

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No staff found.</td></tr>`;
        return;
    }

    table.innerHTML = list.map(s => `
        <tr>
            <td data-label="ID">${s.id}</td>
            <td data-label="Name"><strong>${esc(s.name)}</strong></td>
            <td data-label="Role"><span class="badge bg-secondary">${esc(s.role)}</span></td>
            <td data-label="Specialization">${esc(s.specialization || '-')}</td>
            <td data-label="Shift">${esc(s.shift || '-')}</td>
            <td data-label="Contact">${esc(s.contact)}</td>
            <td data-label="Actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editStaff(${s.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${KEYS.staff}', ${s.id}, loadStaff)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

function editStaff(id) {
    const s = loadData(KEYS.staff).find(s => String(s.id) === String(id));
    if (!s) return;
    document.getElementById('staffId').value = s.id;
    document.getElementById('staffName').value = s.name;
    document.getElementById('staffRole').value = s.role;
    document.getElementById('staffContact').value = s.contact;
    document.getElementById('staffSpec').value = s.specialization || '';
    document.getElementById('staffShift').value = s.shift || '';
    document.getElementById('staffFormTitle').textContent = 'Edit Staff Member';
    document.getElementById('staffForm').scrollIntoView({ behavior: 'smooth' });
}

// ─── Rooms CRUD ───────────────────────────────────────────────────────────────

function saveRoom() {
    const id = document.getElementById('roomId').value.trim();
    const number = document.getElementById('roomNumber').value.trim();
    const type = document.getElementById('roomType').value.trim();
    const status = document.getElementById('roomStatus').value.trim();
    const residentId = document.getElementById('roomResident').value.trim();
    const floor = document.getElementById('roomFloor').value.trim();

    if (!number) {
        showToast('Room number is required.', 'warning');
        return;
    }

    const room = { number, type, status, residentId, floor };

    if (id) {
        room.id = id;
        updateItem(KEYS.rooms, room);
        showToast('Room updated!', 'success');
    } else {
        addItem(KEYS.rooms, room);
        showToast('Room added!', 'success');
    }
    clearForm('roomForm');
    loadRooms();
    updateStats();
}

function loadRooms(filter) {
    const rooms = loadData(KEYS.rooms);
    const residents = loadData(KEYS.residents);
    const table = document.getElementById('roomsTable');
    if (!table) return;

    const list = filter
        ? rooms.filter(r =>
            r.number.includes(filter) ||
            r.status.toLowerCase().includes(filter.toLowerCase()))
        : rooms;

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-muted">No rooms found.</td></tr>`;
        return;
    }

    table.innerHTML = list.map(r => {
        const res = r.residentId ? residents.find(res => String(res.id) === String(r.residentId)) : null;
        const badgeClass = r.status === 'Occupied' ? 'bg-danger' : 'bg-success';
        return `
        <tr>
            <td data-label="Room #"><strong>${esc(r.number)}</strong></td>
            <td data-label="Type">${esc(r.type || '-')}</td>
            <td data-label="Floor">${esc(r.floor || '-')}</td>
            <td data-label="Status"><span class="badge ${badgeClass}">${esc(r.status)}</span></td>
            <td data-label="Resident">${res ? esc(res.name) : (r.residentId ? '#' + r.residentId : 'Unoccupied')}</td>
            <td data-label="Actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editRoom(${r.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${KEYS.rooms}', ${r.id}, loadRooms)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function editRoom(id) {
    const r = loadData(KEYS.rooms).find(r => String(r.id) === String(id));
    if (!r) return;
    document.getElementById('roomId').value = r.id;
    document.getElementById('roomNumber').value = r.number;
    document.getElementById('roomType').value = r.type || '';
    document.getElementById('roomStatus').value = r.status;
    document.getElementById('roomResident').value = r.residentId || '';
    document.getElementById('roomFloor').value = r.floor || '';
    document.getElementById('roomFormTitle').textContent = 'Edit Room';
    document.getElementById('roomForm').scrollIntoView({ behavior: 'smooth' });
}

// ─── Appointments CRUD ────────────────────────────────────────────────────────

function saveAppointment() {
    const id = document.getElementById('appointmentId').value.trim();
    const residentId = document.getElementById('appResident').value.trim();
    const staffId = document.getElementById('appDoctor').value.trim();
    const date = document.getElementById('appDate').value.trim();
    const time = document.getElementById('appTime').value.trim();
    const type = document.getElementById('appType').value.trim();
    const notes = document.getElementById('appNotes').value.trim();
    const status = document.getElementById('appStatus').value.trim();

    if (!residentId || !staffId || !date) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    const app = { residentId, staffId, date, time, type, notes, status };

    if (id) {
        app.id = id;
        updateItem(KEYS.appointments, app);
        showToast('Appointment updated!', 'success');
    } else {
        addItem(KEYS.appointments, app);
        showToast('Appointment scheduled!', 'success');
    }
    clearForm('appointmentForm');
    loadAppointments();
    updateStats();
}

function loadAppointments(filter) {
    const apps = loadData(KEYS.appointments);
    const residents = loadData(KEYS.residents);
    const staff = loadData(KEYS.staff);
    const table = document.getElementById('appointmentsTable');
    if (!table) return;

    const list = filter
        ? apps.filter(a =>
            a.date.includes(filter) ||
            (a.type || '').toLowerCase().includes(filter.toLowerCase()) ||
            (a.status || '').toLowerCase().includes(filter.toLowerCase()))
        : apps;

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
        return;
    }

    const statusColors = { Scheduled: 'bg-primary', Completed: 'bg-success', Cancelled: 'bg-danger', 'In Progress': 'bg-warning text-dark' };

    table.innerHTML = list.map(a => {
        const res = residents.find(r => String(r.id) === String(a.residentId));
        const doc = staff.find(s => String(s.id) === String(a.staffId));
        const badgeClass = statusColors[a.status] || 'bg-secondary';
        return `
        <tr>
            <td data-label="Date"><strong>${a.date}</strong>${a.time ? ' ' + a.time : ''}</td>
            <td data-label="Resident">${res ? esc(res.name) : '#' + a.residentId}</td>
            <td data-label="Staff">${doc ? esc(doc.name) : '#' + a.staffId}</td>
            <td data-label="Type">${esc(a.type || '-')}</td>
            <td data-label="Status"><span class="badge ${badgeClass}">${esc(a.status || 'Scheduled')}</span></td>
            <td data-label="Notes"><small>${esc(a.notes || '-')}</small></td>
            <td data-label="Actions">
                <button class="btn btn-sm btn-outline-primary me-1" onclick="editAppointment(${a.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${KEYS.appointments}', ${a.id}, loadAppointments)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function editAppointment(id) {
    const a = loadData(KEYS.appointments).find(a => String(a.id) === String(id));
    if (!a) return;
    document.getElementById('appointmentId').value = a.id;
    document.getElementById('appResident').value = a.residentId;
    document.getElementById('appDoctor').value = a.staffId;
    document.getElementById('appDate').value = a.date;
    document.getElementById('appTime').value = a.time || '';
    document.getElementById('appType').value = a.type || '';
    document.getElementById('appNotes').value = a.notes || '';
    document.getElementById('appStatus').value = a.status || 'Scheduled';
    document.getElementById('appointmentFormTitle').textContent = 'Edit Appointment';
    document.getElementById('appointmentForm').scrollIntoView({ behavior: 'smooth' });
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function saveFeedback() {
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone') ? document.getElementById('contactPhone').value.trim() : '';
    const subject = document.getElementById('contactSubject') ? document.getElementById('contactSubject').value.trim() : '';
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !message) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    addItem(KEYS.feedback, { name, email, phone, subject, message });
    showToast('Thank you! Your message has been submitted.', 'success');
    clearForm('contactForm');
}

function loadFeedback(filter) {
    const feedbacks = loadData(KEYS.feedback);
    const table = document.getElementById('feedbackTable');
    if (!table) return;

    const list = filter
        ? feedbacks.filter(f =>
            f.name.toLowerCase().includes(filter.toLowerCase()) ||
            f.email.toLowerCase().includes(filter.toLowerCase()))
        : feedbacks;

    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No feedback yet.</td></tr>`;
        return;
    }

    table.innerHTML = list.map(f => `
        <tr>
            <td data-label="Name"><strong>${esc(f.name)}</strong></td>
            <td data-label="Email">${esc(f.email)}</td>
            <td data-label="Subject">${esc(f.subject || '-')}</td>
            <td data-label="Message"><small>${esc(f.message)}</small></td>
            <td data-label="Actions">
                <button class="btn btn-sm btn-outline-danger" onclick="confirmDelete('${KEYS.feedback}', ${f.id}, loadFeedback)" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`).join('');
}

// ─── Activities ───────────────────────────────────────────────────────────────

function loadActivities() {
    const activities = loadData(KEYS.activities);
    const container = document.getElementById('activitiesList');
    if (!container) return;
    if (activities.length === 0) {
        container.innerHTML = '<p class="text-muted">No activities scheduled.</p>';
        return;
    }
    container.innerHTML = activities.map(a => `
        <div class="card mb-2">
            <div class="card-body py-2 px-3">
                <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                        <strong>${esc(a.name)}</strong>
                        <div class="text-muted small">${esc(a.day)} at ${esc(a.time)} — ${esc(a.location)}</div>
                    </div>
                    <small class="text-muted">${esc(a.facilitator)}</small>
                </div>
            </div>
        </div>`).join('');
}

// ─── Doctor Page Helpers ──────────────────────────────────────────────────────

function loadDocResidents(filter) {
    const residents = loadData(KEYS.residents);
    const table = document.getElementById('docResidentsTable');
    if (!table) return;
    const list = filter
        ? residents.filter(r => r.name.toLowerCase().includes(filter.toLowerCase()))
        : residents;
    if (list.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No residents found.</td></tr>`;
        return;
    }
    table.innerHTML = list.map(r => `
        <tr>
            <td data-label="ID">${r.id}</td>
            <td data-label="Name"><strong>${esc(r.name)}</strong></td>
            <td data-label="Age">${r.age}</td>
            <td data-label="Room">${esc(r.room || 'N/A')}</td>
            <td data-label="Medical">${esc(r.medical || '-')}</td>
        </tr>`).join('');
}

function loadDocAppointments() {
    const apps = loadData(KEYS.appointments);
    const residents = loadData(KEYS.residents);
    const table = document.getElementById('docAppointmentsTable');
    if (!table) return;
    const today = new Date().toISOString().split('T')[0];
    const upcoming = apps.filter(a => a.date >= today).sort((a, b) => a.date.localeCompare(b.date));
    if (upcoming.length === 0) {
        table.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-muted">No upcoming appointments.</td></tr>`;
        return;
    }
    table.innerHTML = upcoming.map(a => {
        const res = residents.find(r => String(r.id) === String(a.residentId));
        const isToday = a.date === today;
        return `
        <tr class="${isToday ? 'table-warning' : ''}">
            <td data-label="Date"><strong>${a.date}</strong>${a.time ? ' ' + a.time : ''} ${isToday ? '<span class="badge bg-warning text-dark ms-1">Today</span>' : ''}</td>
            <td data-label="Resident">${res ? esc(res.name) : '#' + a.residentId}</td>
            <td data-label="Type">${esc(a.type || '-')}</td>
            <td data-label="Notes">${esc(a.notes || '-')}</td>
            <td data-label="Status"><span class="badge bg-primary">${esc(a.status || 'Scheduled')}</span></td>
        </tr>`;
    }).join('');
}

function updateMedical() {
    const resId = document.getElementById('medicalResidentId').value.trim();
    const update = document.getElementById('medicalUpdate').value.trim();
    if (!resId || !update) {
        showToast('Please enter resident ID and medical update.', 'warning');
        return;
    }
    const residents = loadData(KEYS.residents);
    const index = residents.findIndex(r => String(r.id) === String(resId));
    if (index !== -1) {
        const timestamp = new Date().toLocaleDateString();
        residents[index].medical = (residents[index].medical || '') + `\n[${timestamp}] ${update}`;
        saveData(KEYS.residents, residents);
        showToast('Medical record updated!', 'success');
        document.getElementById('medicalUpdate').value = '';
        document.getElementById('medicalResidentId').value = '';
        loadDocResidents();
    } else {
        showToast('Resident not found. Check the ID.', 'danger');
    }
}

// ─── Resident Page Helpers ────────────────────────────────────────────────────

function viewMyDetails() {
    const resId = document.getElementById('resId').value.trim();
    const residents = loadData(KEYS.residents);
    const r = residents.find(r => String(r.id) === String(resId));
    const details = document.getElementById('myDetails');
    if (!details) return;
    if (r) {
        details.innerHTML = `
            <div class="card">
                <div class="card-header">My Profile</div>
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-sm-6"><strong>Name:</strong> ${esc(r.name)}</div>
                        <div class="col-sm-6"><strong>Age:</strong> ${r.age}</div>
                        <div class="col-sm-6"><strong>Room:</strong> ${esc(r.room || 'N/A')}</div>
                        <div class="col-sm-6"><strong>Contact:</strong> ${esc(r.contact)}</div>
                        <div class="col-12"><strong>Emergency Contact:</strong> ${esc(r.emergencyContact || 'N/A')}</div>
                        <div class="col-12"><strong>Medical History:</strong><br><pre class="mt-1 bg-light p-2 rounded small">${esc(r.medical || 'No records.')}</pre></div>
                    </div>
                </div>
            </div>`;
    } else {
        details.innerHTML = `<div class="alert alert-warning">Resident not found. Please check your ID.</div>`;
    }
}

function viewMyAppointments() {
    const resId = document.getElementById('appResId').value.trim();
    const apps = loadData(KEYS.appointments).filter(a => String(a.residentId) === String(resId));
    const staff = loadData(KEYS.staff);
    const table = document.getElementById('myAppointmentsTable');
    if (!table) return;
    if (apps.length === 0) {
        table.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-muted">No appointments found.</td></tr>`;
        return;
    }
    table.innerHTML = apps.map(a => {
        const doc = staff.find(s => String(s.id) === String(a.staffId));
        return `
        <tr>
            <td data-label="Date">${a.date}${a.time ? ' ' + a.time : ''}</td>
            <td data-label="Staff">${doc ? esc(doc.name) : '#' + a.staffId}</td>
            <td data-label="Type">${esc(a.type || '-')}</td>
            <td data-label="Notes">${esc(a.notes || '-')}</td>
        </tr>`;
    }).join('');
}

function requestAppointment() {
    const resId = document.getElementById('reqResident').value.trim();
    const staffId = document.getElementById('reqDoctor').value.trim();
    const date = document.getElementById('reqDate').value.trim();
    const time = document.getElementById('reqTime').value.trim();
    const type = document.getElementById('reqType').value.trim();
    const notes = document.getElementById('reqNotes').value.trim();

    if (!resId || !staffId || !date) {
        showToast('Please fill in all required fields.', 'warning');
        return;
    }

    addItem(KEYS.appointments, { residentId: resId, staffId, date, time, type, notes, status: 'Scheduled' });
    showToast('Appointment requested successfully!', 'success');
    clearForm('requestForm');
}

// ─── Confirm Delete ───────────────────────────────────────────────────────────

function confirmDelete(key, id, reloadFn) {
    if (confirm('Are you sure you want to delete this record?')) {
        deleteItem(key, id);
        reloadFn();
        showToast('Record deleted.', 'info');
    }
}

// ─── Form Helpers ─────────────────────────────────────────────────────────────

function clearForm(formId) {
    const form = document.getElementById(formId);
    if (form) form.reset();
    const hiddenId = form ? form.querySelector('input[type=hidden]') : null;
    if (hiddenId) hiddenId.value = '';
}

function resetFormTitle(titleId, defaultTitle) {
    const el = document.getElementById(titleId);
    if (el) el.textContent = defaultTitle;
}

// ─── Toast Notifications ──────────────────────────────────────────────────────

function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const id = 'toast-' + Date.now();
    const icons = { success: 'bi-check-circle-fill', danger: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
    const icon = icons[type] || 'bi-info-circle-fill';
    const toast = document.createElement('div');
    toast.innerHTML = `
        <div id="${id}" class="toast align-items-center text-bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi ${icon} me-2"></i>${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" onclick="this.closest('.toast').remove()"></button>
            </div>
        </div>`;
    container.appendChild(toast.firstElementChild);
    const toastEl = document.getElementById(id);
    if (typeof bootstrap !== 'undefined' && bootstrap.Toast) {
        const bsToast = new bootstrap.Toast(toastEl, { delay: 3500 });
        bsToast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    } else {
        // Fallback: show and auto-remove after 3.5s
        toastEl.style.display = 'block';
        toastEl.style.opacity = '1';
        setTimeout(() => { if (toastEl.parentNode) toastEl.remove(); }, 3500);
    }
}

// ─── Escape HTML ──────────────────────────────────────────────────────────────

function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
    seedDemoData();
});
