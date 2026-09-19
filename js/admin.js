/**
 * Campus Portal - Host Management CMS Application Logic
 * Dedicated Live Editing, CRUD Operations, and Storage Synchronization
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminPortal();
});

function initAdminPortal() {
  checkAuthentication();
  setupTabNavigation();
  loadAllAdminData();
}

// --------------------------------------------------------------------------
// 1. Host Authentication Gate
// --------------------------------------------------------------------------
function checkAuthentication() {
  const isAuth = CampusDataService.isHostAuthenticated();
  const gate = document.getElementById('auth-gate');
  if (!gate) return;

  if (isAuth) {
    gate.classList.add('hidden');
  } else {
    gate.classList.remove('hidden');
    const input = document.getElementById('auth-pin-input');
    if (input) input.focus();
  }
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const pinInput = document.getElementById('auth-pin-input');
  const remember = document.getElementById('auth-remember').checked;
  const pin = pinInput.value.trim();

  if (CampusDataService.verifyPin(pin)) {
    CampusDataService.setHostAuthenticated(true, remember);
    document.getElementById('auth-gate').classList.add('hidden');
    showAdminToast("Host authentication successful! Welcome to Host Studio.");
  } else {
    alert("Incorrect Host PIN. Default PIN is admin123");
    pinInput.value = '';
    pinInput.focus();
  }
}

function handleLogout() {
  if (confirm("Are you sure you want to lock Host Studio and return to public site?")) {
    CampusDataService.setHostAuthenticated(false);
    window.location.href = "index.html";
  }
}

// --------------------------------------------------------------------------
// 2. Tab Navigation
// --------------------------------------------------------------------------
function setupTabNavigation() {
  const navButtons = document.querySelectorAll('.admin-nav-item');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      if (tabId) switchTab(tabId);
    });
  });
}

function switchTab(tabId) {
  document.querySelectorAll('.admin-nav-item').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

  const activeBtn = document.querySelector(`.admin-nav-item[data-tab="${tabId}"]`);
  const activePane = document.getElementById(tabId);

  if (activeBtn) activeBtn.classList.add('active');
  if (activePane) activePane.classList.add('active');

  // Scroll to top of content
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --------------------------------------------------------------------------
// 3. Load All Data into Admin Forms
// --------------------------------------------------------------------------
function loadAllAdminData() {
  const data = CampusDataService.getData();
  if (!data) return;

  // Overview Counts & Badges
  document.getElementById('metric-inst-count').textContent = (data.institutions || []).length;
  document.getElementById('metric-sub-count').textContent = (data.submissions || []).length;
  document.getElementById('metric-news-count').textContent = (data.news || []).length;
  document.getElementById('metric-event-count').textContent = (data.events || []).length;

  document.getElementById('count-inst').textContent = (data.institutions || []).length;
  document.getElementById('count-life').textContent = (data.campusLife || []).length;
  document.getElementById('count-news').textContent = (data.news || []).length;
  document.getElementById('count-events').textContent = (data.events || []).length;
  document.getElementById('count-submissions').textContent = (data.submissions || []).length;

  renderOverviewRecentSubmissions(data.submissions || []);

  // Branding Form
  document.getElementById('inp-brand-name').value = data.branding.campusName || '';
  document.getElementById('inp-brand-short').value = data.branding.shortName || '';
  document.getElementById('inp-brand-tagline').value = data.branding.tagline || '';
  document.getElementById('inp-brand-theme').value = data.branding.theme || 'emerald';
  document.getElementById('inp-brand-gold').value = data.branding.goldAccent || '#d4af37';
  document.getElementById('inp-brand-affiliations').value = data.branding.affiliations || '';

  // Hero Form
  document.getElementById('inp-hero-ticker').value = data.branding.noticeTicker || '';
  document.getElementById('inp-hero-badge').value = data.hero.badgeText || '';
  document.getElementById('inp-hero-headline').value = data.hero.headline || '';
  document.getElementById('inp-hero-subtext').value = data.hero.subtitle || '';
  document.getElementById('inp-hero-image').value = data.hero.bannerImage || '';

  // Stats Form
  renderStatsEditor(data.stats || []);

  // Leadership Form
  document.getElementById('inp-leader-name').value = data.leadership.name || '';
  document.getElementById('inp-leader-title').value = data.leadership.title || '';
  document.getElementById('inp-leader-subtitle').value = data.leadership.subtitle || '';
  document.getElementById('inp-leader-photo').value = data.leadership.photo || '';
  document.getElementById('inp-leader-message').value = data.leadership.message || '';
  document.getElementById('inp-leader-sig').value = data.leadership.signature || '';

  // Contact Form
  document.getElementById('inp-contact-address').value = data.contact.address || '';
  document.getElementById('inp-contact-phone').value = data.contact.phone || '';
  document.getElementById('inp-contact-email').value = data.contact.admissionsEmail || data.contact.email || '';
  if (data.contact.social) {
    document.getElementById('inp-social-fb').value = data.contact.social.facebook || '';
    document.getElementById('inp-social-insta').value = data.contact.social.instagram || '';
    document.getElementById('inp-social-yt').value = data.contact.social.youtube || '';
  }

  // Lists & Tables
  renderInstitutionsTable(data.institutions || []);
  renderCampusLifeTable(data.campusLife || []);
  renderNewsTable(data.news || []);
  renderEventsTable(data.events || []);
  renderSubmissionsTable(data.submissions || []);
}

// --------------------------------------------------------------------------
// 4. Section Save Functions
// --------------------------------------------------------------------------
function saveBranding() {
  const data = CampusDataService.getData();
  data.branding.campusName = document.getElementById('inp-brand-name').value.trim();
  data.branding.shortName = document.getElementById('inp-brand-short').value.trim();
  data.branding.tagline = document.getElementById('inp-brand-tagline').value.trim();
  data.branding.theme = document.getElementById('inp-brand-theme').value;
  data.branding.goldAccent = document.getElementById('inp-brand-gold').value.trim();
  data.branding.affiliations = document.getElementById('inp-brand-affiliations').value.trim();

  CampusDataService.saveData(data);
  showAdminToast("Campus branding & theme updated successfully!");
}

function saveHero() {
  const data = CampusDataService.getData();
  data.branding.noticeTicker = document.getElementById('inp-hero-ticker').value.trim();
  data.hero.badgeText = document.getElementById('inp-hero-badge').value.trim();
  data.hero.headline = document.getElementById('inp-hero-headline').value.trim();
  data.hero.subtitle = document.getElementById('inp-hero-subtext').value.trim();
  data.hero.bannerImage = document.getElementById('inp-hero-image').value.trim();

  CampusDataService.saveData(data);
  showAdminToast("Hero banner & notice bar saved!");
}

function renderStatsEditor(stats) {
  const container = document.getElementById('stats-editor-rows');
  if (!container) return;

  container.innerHTML = stats.map((st, i) => `
    <div style="display:grid; grid-template-columns: 1fr 2fr 1fr; gap:1rem; margin-bottom:1rem; align-items:flex-end;">
      <div>
        <label class="form-label">Stat #${i + 1} Number</label>
        <input type="text" class="form-input stat-input-num" data-index="${i}" value="${escapeAdminHTML(st.number)}">
      </div>
      <div>
        <label class="form-label">Stat Caption Label</label>
        <input type="text" class="form-input stat-input-label" data-index="${i}" value="${escapeAdminHTML(st.label)}">
      </div>
      <div>
        <label class="form-label">Icon</label>
        <select class="form-select stat-input-icon" data-index="${i}">
          <option value="school" ${st.icon === 'school' ? 'selected' : ''}>School / Building</option>
          <option value="users" ${st.icon === 'users' ? 'selected' : ''}>Students / Users</option>
          <option value="award" ${st.icon === 'award' ? 'selected' : ''}>Award / Legacy</option>
          <option value="user-check" ${st.icon === 'user-check' ? 'selected' : ''}>Faculty / Mentors</option>
          <option value="book" ${st.icon === 'book' ? 'selected' : ''}>Book / Library</option>
        </select>
      </div>
    </div>
  `).join('');
}

function saveStats() {
  const data = CampusDataService.getData();
  const numInputs = document.querySelectorAll('.stat-input-num');
  const labelInputs = document.querySelectorAll('.stat-input-label');
  const iconInputs = document.querySelectorAll('.stat-input-icon');

  const updatedStats = [];
  numInputs.forEach((inp, idx) => {
    updatedStats.push({
      id: `stat-${idx + 1}`,
      number: inp.value.trim(),
      label: labelInputs[idx].value.trim(),
      icon: iconInputs[idx].value
    });
  });

  data.stats = updatedStats;
  CampusDataService.saveData(data);
  showAdminToast("Quick Stats figures updated!");
}

function saveLeadership() {
  const data = CampusDataService.getData();
  data.leadership.name = document.getElementById('inp-leader-name').value.trim();
  data.leadership.title = document.getElementById('inp-leader-title').value.trim();
  data.leadership.subtitle = document.getElementById('inp-leader-subtitle').value.trim();
  data.leadership.photo = document.getElementById('inp-leader-photo').value.trim();
  data.leadership.message = document.getElementById('inp-leader-message').value.trim();
  data.leadership.signature = document.getElementById('inp-leader-sig').value.trim();

  CampusDataService.saveData(data);
  showAdminToast("Leadership profile and message saved!");
}

function saveContact() {
  const data = CampusDataService.getData();
  data.contact.address = document.getElementById('inp-contact-address').value.trim();
  data.contact.phone = document.getElementById('inp-contact-phone').value.trim();
  data.contact.admissionsEmail = document.getElementById('inp-contact-email').value.trim();

  data.contact.social = data.contact.social || {};
  data.contact.social.facebook = document.getElementById('inp-social-fb').value.trim();
  data.contact.social.instagram = document.getElementById('inp-social-insta').value.trim();
  data.contact.social.youtube = document.getElementById('inp-social-yt').value.trim();

  CampusDataService.saveData(data);
  showAdminToast("Contact details & footer links updated!");
}

function saveAllForms() {
  saveBranding();
  saveHero();
  saveStats();
  saveLeadership();
  saveContact();
  showAdminToast("All sections saved and synchronized with public portal!");
}

// --------------------------------------------------------------------------
// 5. Institutions CRUD
// --------------------------------------------------------------------------
function renderInstitutionsTable(institutions) {
  const tbody = document.getElementById('table-inst-body');
  if (!tbody) return;

  if (institutions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b; padding:2rem;">No institutions found. Click Add New Institution above.</td></tr>`;
    return;
  }

  tbody.innerHTML = institutions.map(inst => `
    <tr class="table-row">
      <td style="font-weight:700; color:#0f172a;">${escapeAdminHTML(inst.name)}</td>
      <td><span class="admin-badge">${escapeAdminHTML(inst.categoryLabel || inst.category)}</span></td>
      <td>${escapeAdminHTML(inst.established || '2000')}</td>
      <td style="font-size:0.8rem; max-width:240px; color:#475569;">${escapeAdminHTML((inst.degrees || []).join(', '))}</td>
      <td style="text-align:right;">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="btn-icon" onclick="editInstitution('${inst.id}')">Edit</button>
          <button class="btn-icon btn-icon-danger" onclick="deleteInstitution('${inst.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openInstitutionModal(id = null) {
  const modal = document.getElementById('modal-inst');
  const title = document.getElementById('modal-inst-title');
  const form = document.getElementById('form-inst-modal');
  form.reset();

  if (id) {
    title.textContent = "Edit Institution / Department";
    const data = CampusDataService.getData();
    const inst = data.institutions.find(i => i.id === id);
    if (inst) {
      document.getElementById('inst-edit-id').value = inst.id;
      document.getElementById('modal-inst-name').value = inst.name;
      document.getElementById('modal-inst-cat').value = inst.category;
      document.getElementById('modal-inst-catlabel').value = inst.categoryLabel || '';
      document.getElementById('modal-inst-desc').value = inst.description;
      document.getElementById('modal-inst-degrees').value = (inst.degrees || []).join(', ');
      document.getElementById('modal-inst-year').value = inst.established || '';
      document.getElementById('modal-inst-img').value = inst.image || '';
    }
  } else {
    title.textContent = "Add New Institution / Department";
    document.getElementById('inst-edit-id').value = '';
    document.getElementById('modal-inst-img').value = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';
  }

  modal.classList.add('open');
}

function closeInstitutionModal() {
  document.getElementById('modal-inst').classList.remove('open');
}

function handleSaveInstitution(event) {
  event.preventDefault();
  const id = document.getElementById('inst-edit-id').value;
  const name = document.getElementById('modal-inst-name').value.trim();
  const cat = document.getElementById('modal-inst-cat').value;
  const catLabel = document.getElementById('modal-inst-catlabel').value.trim() || document.getElementById('modal-inst-cat').options[document.getElementById('modal-inst-cat').selectedIndex].text;
  const desc = document.getElementById('modal-inst-desc').value.trim();
  const degreesStr = document.getElementById('modal-inst-degrees').value.trim();
  const degrees = degreesStr ? degreesStr.split(',').map(s => s.trim()) : [];
  const year = document.getElementById('modal-inst-year').value.trim() || "2000";
  const img = document.getElementById('modal-inst-img').value.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80';

  const data = CampusDataService.getData();
  if (id) {
    // Edit
    const idx = data.institutions.findIndex(i => i.id === id);
    if (idx !== -1) {
      data.institutions[idx] = { ...data.institutions[idx], name, category: cat, categoryLabel: catLabel, description: desc, degrees, established: year, image: img };
    }
  } else {
    // Add new
    const newInst = {
      id: 'inst-' + Date.now(),
      name,
      category: cat,
      categoryLabel: catLabel,
      description: desc,
      degrees,
      established: year,
      image: img,
      link: '#'
    };
    data.institutions.push(newInst);
  }

  CampusDataService.saveData(data);
  closeInstitutionModal();
  loadAllAdminData();
  showAdminToast("Institution saved!");
}

function editInstitution(id) {
  openInstitutionModal(id);
}

function deleteInstitution(id) {
  if (confirm("Are you sure you want to delete this institution?")) {
    const data = CampusDataService.getData();
    data.institutions = data.institutions.filter(i => i.id !== id);
    CampusDataService.saveData(data);
    loadAllAdminData();
    showAdminToast("Institution removed.");
  }
}

// --------------------------------------------------------------------------
// 6. Campus Life Features CRUD
// --------------------------------------------------------------------------
function renderCampusLifeTable(features) {
  const tbody = document.getElementById('table-life-body');
  if (!tbody) return;

  tbody.innerHTML = features.map(feat => `
    <tr class="table-row">
      <td style="font-weight:700; color:#0f172a;">${escapeAdminHTML(feat.title)}</td>
      <td style="font-size:0.85rem; color:#475569;">${escapeAdminHTML(feat.description)}</td>
      <td><span class="admin-badge">${escapeAdminHTML(feat.icon)}</span></td>
      <td style="text-align:right;">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="btn-icon btn-icon-danger" onclick="deleteCampusLife('${feat.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openCampusLifeModal() {
  const title = prompt("Enter Facility / Campus Feature Title (e.g. Hostels, Central Library):");
  if (!title) return;
  const desc = prompt("Enter Description of this campus life feature:");
  if (!desc) return;
  const icon = prompt("Enter icon name ('home', 'book-open', 'cpu', or 'activity'):", "home") || "home";

  const data = CampusDataService.getData();
  data.campusLife.push({
    id: 'life-' + Date.now(),
    title,
    description: desc,
    icon,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'
  });
  CampusDataService.saveData(data);
  loadAllAdminData();
  showAdminToast("Campus life facility added!");
}

function deleteCampusLife(id) {
  if (confirm("Delete this campus life feature?")) {
    const data = CampusDataService.getData();
    data.campusLife = data.campusLife.filter(f => f.id !== id);
    CampusDataService.saveData(data);
    loadAllAdminData();
    showAdminToast("Feature removed.");
  }
}

// --------------------------------------------------------------------------
// 7. News CRUD
// --------------------------------------------------------------------------
function renderNewsTable(newsItems) {
  const tbody = document.getElementById('table-news-body');
  if (!tbody) return;

  tbody.innerHTML = newsItems.map(item => `
    <tr class="table-row">
      <td style="font-weight:700; color:#0f172a;">${escapeAdminHTML(item.title)}</td>
      <td><span class="admin-badge">${escapeAdminHTML(item.category)}</span></td>
      <td style="font-size:0.85rem;">${escapeAdminHTML(item.date)}</td>
      <td style="text-align:right;">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="btn-icon" onclick="editNews('${item.id}')">Edit</button>
          <button class="btn-icon btn-icon-danger" onclick="deleteNews('${item.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openNewsModal(id = null) {
  const modal = document.getElementById('modal-news');
  const title = document.getElementById('modal-news-title');
  const form = document.getElementById('form-news-modal');
  form.reset();

  if (id) {
    title.textContent = "Edit News Bulletin";
    const data = CampusDataService.getData();
    const item = data.news.find(n => n.id === id);
    if (item) {
      document.getElementById('news-edit-id').value = item.id;
      document.getElementById('modal-news-headline').value = item.title;
      document.getElementById('modal-news-cat').value = item.category;
      document.getElementById('modal-news-date').value = item.date;
      document.getElementById('modal-news-summary').value = item.summary;
      document.getElementById('modal-news-img').value = item.image || '';
    }
  } else {
    title.textContent = "Publish News Circular";
    document.getElementById('news-edit-id').value = '';
    document.getElementById('modal-news-date').value = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('modal-news-img').value = 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80';
  }

  modal.classList.add('open');
}

function closeNewsModal() {
  document.getElementById('modal-news').classList.remove('open');
}

function handleSaveNews(event) {
  event.preventDefault();
  const id = document.getElementById('news-edit-id').value;
  const headline = document.getElementById('modal-news-headline').value.trim();
  const cat = document.getElementById('modal-news-cat').value.trim() || "Announcements";
  const dateStr = document.getElementById('modal-news-date').value.trim();
  const summary = document.getElementById('modal-news-summary').value.trim();
  const img = document.getElementById('modal-news-img').value.trim() || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80';

  const data = CampusDataService.getData();
  if (id) {
    const idx = data.news.findIndex(n => n.id === id);
    if (idx !== -1) {
      data.news[idx] = { ...data.news[idx], title: headline, category: cat, date: dateStr, summary, image: img };
    }
  } else {
    data.news.unshift({
      id: 'news-' + Date.now(),
      title: headline,
      category: cat,
      date: dateStr,
      summary,
      image: img,
      featured: false
    });
  }

  CampusDataService.saveData(data);
  closeNewsModal();
  loadAllAdminData();
  showAdminToast("News announcement published!");
}

function editNews(id) {
  openNewsModal(id);
}

function deleteNews(id) {
  if (confirm("Delete this news bulletin?")) {
    const data = CampusDataService.getData();
    data.news = data.news.filter(n => n.id !== id);
    CampusDataService.saveData(data);
    loadAllAdminData();
    showAdminToast("News deleted.");
  }
}

// --------------------------------------------------------------------------
// 8. Events Calendar CRUD
// --------------------------------------------------------------------------
function renderEventsTable(events) {
  const tbody = document.getElementById('table-events-body');
  if (!tbody) return;

  tbody.innerHTML = events.map(evt => `
    <tr class="table-row">
      <td style="font-weight:800; color:var(--admin-primary);">${escapeAdminHTML(evt.day)} ${escapeAdminHTML(evt.month)}</td>
      <td style="font-weight:700; color:#0f172a;">${escapeAdminHTML(evt.title)}</td>
      <td style="font-size:0.85rem; color:#475569;">${escapeAdminHTML(evt.time)} • ${escapeAdminHTML(evt.venue)}</td>
      <td><span class="admin-badge">${escapeAdminHTML(evt.category)}</span></td>
      <td style="text-align:right;">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="btn-icon btn-icon-danger" onclick="deleteEvent('${evt.id}')">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openEventModal() {
  const modal = document.getElementById('modal-event');
  document.getElementById('form-event-modal').reset();
  modal.classList.add('open');
}

function closeEventModal() {
  document.getElementById('modal-event').classList.remove('open');
}

function handleSaveEvent(event) {
  event.preventDefault();
  const title = document.getElementById('modal-event-name').value.trim();
  const day = document.getElementById('modal-event-day').value.trim();
  const month = document.getElementById('modal-event-month').value.trim().toUpperCase();
  const cat = document.getElementById('modal-event-cat').value.trim() || 'General';
  const time = document.getElementById('modal-event-time').value.trim() || '10:00 AM';
  const venue = document.getElementById('modal-event-venue').value.trim() || 'Auditorium';
  const desc = document.getElementById('modal-event-desc').value.trim();

  const data = CampusDataService.getData();
  data.events.push({
    id: 'event-' + Date.now(),
    day,
    month,
    year: new Date().getFullYear().toString(),
    title,
    time,
    venue,
    category: cat,
    description: desc
  });

  CampusDataService.saveData(data);
  closeEventModal();
  loadAllAdminData();
  showAdminToast("Upcoming event scheduled!");
}

function deleteEvent(id) {
  if (confirm("Delete this scheduled event?")) {
    const data = CampusDataService.getData();
    data.events = data.events.filter(e => e.id !== id);
    CampusDataService.saveData(data);
    loadAllAdminData();
    showAdminToast("Event cancelled.");
  }
}

// --------------------------------------------------------------------------
// 9. Admissions Submissions Inbox
// --------------------------------------------------------------------------
function renderSubmissionsTable(submissions) {
  const tbody = document.getElementById('table-submissions-body');
  if (!tbody) return;

  if (submissions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2.5rem; color:#64748b;">No admissions applications submitted yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = submissions.map(sub => `
    <tr class="table-row">
      <td style="font-size:0.8rem; color:#64748b;">${escapeAdminHTML(sub.submittedAt)}</td>
      <td style="font-weight:700; color:#0f172a;">${escapeAdminHTML(sub.applicantName)}</td>
      <td style="font-size:0.88rem; color:var(--admin-primary); font-weight:600;">${escapeAdminHTML(sub.course)}</td>
      <td style="font-size:0.825rem;">${escapeAdminHTML(sub.phone)}<br><span style="color:#64748b;">${escapeAdminHTML(sub.email)}</span></td>
      <td>
        <select onchange="updateSubmissionStatus('${sub.id}', this.value)" style="padding:0.25rem 0.5rem; font-size:0.8rem; border-radius:4px; border:1px solid #cbd5e1;">
          <option value="New" ${sub.status === 'New' ? 'selected' : ''}>New</option>
          <option value="Reviewed" ${sub.status === 'Reviewed' ? 'selected' : ''}>Reviewed</option>
          <option value="Offered" ${sub.status === 'Offered' ? 'selected' : ''}>Offered</option>
          <option value="Enrolled" ${sub.status === 'Enrolled' ? 'selected' : ''}>Enrolled</option>
        </select>
      </td>
      <td style="text-align:right;">
        <button class="btn-icon btn-icon-danger" onclick="deleteSubmission('${sub.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function renderOverviewRecentSubmissions(submissions) {
  const container = document.getElementById('overview-recent-submissions');
  if (!container) return;

  if (submissions.length === 0) {
    container.innerHTML = `<div style="padding:1.5rem; text-align:center; color:#64748b;">No inquiries recorded yet.</div>`;
    return;
  }

  container.innerHTML = `
    <table class="item-table">
      <thead>
        <tr><th>Applicant</th><th>Course</th><th>Phone</th><th>Date</th></tr>
      </thead>
      <tbody>
        ${submissions.slice(0, 5).map(s => `
          <tr>
            <td style="font-weight:700;">${escapeAdminHTML(s.applicantName)}</td>
            <td>${escapeAdminHTML(s.course)}</td>
            <td>${escapeAdminHTML(s.phone)}</td>
            <td style="font-size:0.8rem; color:#64748b;">${escapeAdminHTML(s.submittedAt)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

function updateSubmissionStatus(id, newStatus) {
  const data = CampusDataService.getData();
  const sub = data.submissions.find(s => s.id === id);
  if (sub) {
    sub.status = newStatus;
    CampusDataService.saveData(data);
    showAdminToast(`Application marked as ${newStatus}`);
  }
}

function deleteSubmission(id) {
  if (confirm("Delete this submission?")) {
    const data = CampusDataService.getData();
    data.submissions = data.submissions.filter(s => s.id !== id);
    CampusDataService.saveData(data);
    loadAllAdminData();
    showAdminToast("Submission deleted.");
  }
}

function exportSubmissionsCSV() {
  const data = CampusDataService.getData();
  const subs = data.submissions || [];
  if (subs.length === 0) {
    alert("No submissions to export.");
    return;
  }

  let csvContent = "data:text/csv;charset=utf-8,ID,Date,Name,Email,Phone,Course,Qualification,Status,Message\n";
  subs.forEach(s => {
    const row = [
      s.id,
      `"${s.submittedAt || ''}"`,
      `"${s.applicantName || ''}"`,
      `"${s.email || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.course || ''}"`,
      `"${s.qualification || ''}"`,
      `"${s.status || ''}"`,
      `"${(s.message || '').replace(/"/g, '""')}"`
    ].join(",");
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `campus_admissions_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// --------------------------------------------------------------------------
// 10. Security & Backup Management
// --------------------------------------------------------------------------
function updateHostPin() {
  const newPin = document.getElementById('inp-new-pin').value.trim();
  if (!newPin || newPin.length < 4) {
    alert("Please enter a secure PIN with at least 4 characters.");
    return;
  }

  const data = CampusDataService.getData();
  data.adminAuth = data.adminAuth || {};
  data.adminAuth.pin = newPin;
  CampusDataService.saveData(data);
  document.getElementById('inp-new-pin').value = '';
  showAdminToast("Host PIN updated successfully!");
}

function handleImportJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const res = CampusDataService.importJSON(e.target.result);
    if (res.success) {
      showAdminToast("Backup imported successfully!");
      loadAllAdminData();
    } else {
      alert("Failed to import JSON: " + res.error);
    }
  };
  reader.readAsText(file);
}

function handleResetFactoryData() {
  if (confirm("Are you sure you want to restore the default Ma'din Academy inspired data? All local customizations will be replaced with fresh sample data.")) {
    CampusDataService.resetToDefaults();
    loadAllAdminData();
    showAdminToast("Reset to factory defaults completed!");
  }
}

// --------------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------------
function showAdminToast(msg) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

function escapeAdminHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
