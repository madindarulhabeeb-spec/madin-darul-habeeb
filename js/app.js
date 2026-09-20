/**
 * Campus Portal - Main Frontend Application Logic
 * Renders dynamic campus data, manages filter tabs and admission submissions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCampusPortal();
});

// Re-render when data changes in localStorage or after cloud sync
window.addEventListener('campusDataUpdated', () => {
  renderAllCampusContent();
});

// Storage event for multi-tab synchronization
window.addEventListener('storage', (e) => {
  if (e.key === 'campus_portal_cms_data') {
    renderAllCampusContent();
  }
});

// Listen for cloud sync status changes
window.addEventListener('cloudSyncStatus', (e) => {
  updateCloudBadge(e.detail);
});

// Automatically check cloud when tab comes into focus
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    CampusDataService.syncFromCloud();
  }
});

async function initCampusPortal() {
  // 1. Check if opened with a shareable URL snapshot
  CampusDataService.checkUrlHashData();

  // 2. Render initial data immediately (0ms delay)
  renderAllCampusContent();
  setupEventListeners();

  // 3. Load baseline data.json if available from web server
  await CampusDataService.loadFromDataJson();
  renderAllCampusContent();

  // 4. Check live cloud sync across all devices
  CampusDataService.syncFromCloud();
}

function updateCloudBadge(detail) {
  const badge = document.getElementById('cloud-status-badge');
  const text = document.getElementById('cloud-status-text');
  if (!badge || !text) return;

  if (detail.status === 'syncing') {
    badge.className = 'cloud-status-badge syncing';
    text.textContent = 'Syncing...';
  } else if (detail.status === 'synced') {
    badge.className = 'cloud-status-badge synced';
    text.textContent = 'Cloud Connected';
  } else if (detail.status === 'offline') {
    badge.className = 'cloud-status-badge offline';
    text.textContent = 'Local Cache';
  }
}

function renderAllCampusContent() {
  const data = CampusDataService.getData();
  if (!data) return;

  // 1. Theme and Color Scheme
  const theme = data.branding.theme || 'emerald';
  document.documentElement.setAttribute('data-theme', theme);
  
  // Page Title
  document.title = `${data.branding.campusName} | Inspired by Ma'din Academy`;

  // Top Bar & Announcement
  const noticeEl = document.getElementById('top-notice-text');
  if (noticeEl) noticeEl.textContent = data.branding.noticeTicker || 'Welcome to our campus portal';

  const topPhone = document.getElementById('top-phone');
  if (topPhone) topPhone.textContent = (data.contact.phone || '').split(',')[0].trim();

  // Branding in Navbar
  const navBrandName = document.getElementById('nav-brand-name');
  if (navBrandName) navBrandName.textContent = data.branding.campusName;

  const navBrandTagline = document.getElementById('nav-brand-tagline');
  if (navBrandTagline) navBrandTagline.textContent = data.branding.tagline;

  // Hero Section
  const heroHeadline = document.getElementById('hero-headline');
  if (heroHeadline) heroHeadline.textContent = data.hero.headline;

  const heroSubtext = document.getElementById('hero-subtext');
  if (heroSubtext) heroSubtext.textContent = data.hero.subtitle;

  const heroBadge = document.getElementById('hero-badge-text');
  if (heroBadge) heroBadge.textContent = data.hero.badgeText || '27+ Years of Legacy';

  const heroBg = document.getElementById('hero-bg');
  if (heroBg && data.hero.bannerImage) {
    heroBg.style.backgroundImage = `url('${data.hero.bannerImage}')`;
  }

  // Quick Stats
  renderStats(data.stats || []);

  // Founder / Principal Message
  renderLeadership(data.leadership);

  // Institutions & Departments Grid
  renderInstitutions(data.institutions || []);

  // Campus Life & Facilities
  renderCampusLife(data.campusLife || []);

  // News and Events Side-by-Side
  renderNews(data.news || []);
  renderEvents(data.events || []);

  // Footer Content
  renderFooter(data);
}

// Render Stats Cards
function renderStats(stats) {
  const grid = document.getElementById('stats-grid');
  if (!grid) return;

  const iconSvgs = {
    school: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
    users: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    award: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>`,
    'user-check': `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><polyline points="17 11 19 13 23 9"></polyline></svg>`,
    book: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`
  };

  grid.innerHTML = stats.map(st => `
    <div class="stat-item">
      <div class="stat-icon-wrap">
        ${iconSvgs[st.icon] || iconSvgs.award}
      </div>
      <div>
        <div class="stat-number">${escapeHTML(st.number)}</div>
        <div class="stat-label">${escapeHTML(st.label)}</div>
      </div>
    </div>
  `).join('');
}

// Render Leadership Section
function renderLeadership(leader) {
  if (!leader) return;
  const imgEl = document.getElementById('leader-img');
  if (imgEl && leader.photo) imgEl.src = leader.photo;

  const quoteEl = document.getElementById('leader-quote-text');
  if (quoteEl) quoteEl.textContent = `"${leader.message}"`;

  const nameEl = document.getElementById('leader-name');
  if (nameEl) nameEl.textContent = leader.name;

  const titleEl = document.getElementById('leader-title');
  if (titleEl) titleEl.textContent = leader.title + (leader.subtitle ? ` • ${leader.subtitle}` : '');

  const sigEl = document.getElementById('leader-signature');
  if (sigEl) sigEl.textContent = leader.signature || leader.name;
}

// Render Institutions Grid
function renderInstitutions(institutions, activeCategory = 'all') {
  const grid = document.getElementById('institutions-grid');
  if (!grid) return;

  const filtered = activeCategory === 'all' 
    ? institutions 
    : institutions.filter(inst => inst.category === activeCategory);

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 3rem; color:#64748b;">No institutions found in this category.</div>`;
    return;
  }

  grid.innerHTML = filtered.map(inst => `
    <article class="institution-card" data-id="${inst.id}">
      <div class="inst-image-wrap">
        <img class="inst-image" src="${inst.image || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80'}" alt="${escapeHTML(inst.name)}" loading="lazy">
        <span class="inst-category-tag">${escapeHTML(inst.categoryLabel || inst.category)}</span>
      </div>
      <div class="inst-body">
        <h3 class="inst-name">${escapeHTML(inst.name)}</h3>
        <p class="inst-desc">${escapeHTML(inst.description)}</p>
        
        ${inst.degrees && inst.degrees.length > 0 ? `
          <div class="inst-degrees">
            ${inst.degrees.map(deg => `<span class="degree-pill">${escapeHTML(deg)}</span>`).join('')}
          </div>
        ` : ''}

        <div class="inst-footer">
          <span style="font-size:0.8rem; color:#64748b;">Est. ${escapeHTML(inst.established || '2000')}</span>
          <a href="#admissions" class="inst-link" onclick="prefillAdmissionCourse('${escapeHTML(inst.name)}')">
            Apply to Institute
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </a>
        </div>
      </div>
    </article>
  `).join('');
}

// Render Campus Life Features
function renderCampusLife(features) {
  const grid = document.getElementById('campus-life-grid');
  if (!grid) return;

  const featureIcons = {
    home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    'book-open': `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
    cpu: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>`,
    activity: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`
  };

  grid.innerHTML = features.map(item => `
    <div class="feature-card">
      <div class="feature-img-box">
        <img src="${item.image || 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80'}" alt="${escapeHTML(item.title)}" loading="lazy">
      </div>
      <div class="feature-content">
        <div class="feature-icon-chip">
          ${featureIcons[item.icon] || featureIcons.home}
        </div>
        <h4 class="feature-title">${escapeHTML(item.title)}</h4>
        <p class="feature-desc">${escapeHTML(item.description)}</p>
      </div>
    </div>
  `).join('');
}

// Render News
function renderNews(newsItems) {
  const container = document.getElementById('news-list');
  if (!container) return;

  container.innerHTML = newsItems.map(item => `
    <article class="news-item-card">
      <img src="${item.image || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80'}" class="news-thumb" alt="${escapeHTML(item.title)}" loading="lazy">
      <div class="news-details">
        <div class="news-meta">
          <span class="news-category-badge">${escapeHTML(item.category || 'News')}</span>
          <span>•</span>
          <span>${escapeHTML(item.date)}</span>
        </div>
        <h4 class="news-title">${escapeHTML(item.title)}</h4>
        <p class="news-excerpt">${escapeHTML(item.summary)}</p>
      </div>
    </article>
  `).join('');
}

// Render Events
function renderEvents(events) {
  const container = document.getElementById('events-list');
  if (!container) return;

  container.innerHTML = events.map(evt => `
    <article class="event-item-card">
      <div class="event-date-box">
        <span class="event-day">${escapeHTML(evt.day)}</span>
        <span class="event-month">${escapeHTML(evt.month)}</span>
      </div>
      <div class="event-info">
        <span class="event-tag">${escapeHTML(evt.category || 'Event')}</span>
        <h4 class="event-title">${escapeHTML(evt.title)}</h4>
        <div class="event-meta-row">
          <span class="event-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            ${escapeHTML(evt.time)}
          </span>
          <span class="event-meta-item">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${escapeHTML(evt.venue)}
          </span>
        </div>
      </div>
    </article>
  `).join('');
}

// Render Footer
function renderFooter(data) {
  const footerBrand = document.getElementById('footer-brand-name');
  if (footerBrand) footerBrand.textContent = data.branding.campusName;

  const footerTagline = document.getElementById('footer-tagline');
  if (footerTagline) footerTagline.textContent = data.branding.tagline;

  const footerAddress = document.getElementById('footer-address');
  if (footerAddress) footerAddress.textContent = data.contact.address;

  const footerPhone = document.getElementById('footer-phone');
  if (footerPhone) footerPhone.textContent = data.contact.phone;

  const footerEmail = document.getElementById('footer-email');
  if (footerEmail) footerEmail.textContent = data.contact.admissionsEmail || data.contact.email;

  const footerCopyright = document.getElementById('footer-copyright');
  if (footerCopyright) {
    footerCopyright.innerHTML = `&copy; ${new Date().getFullYear()} ${escapeHTML(data.branding.campusName)}. Inspired by Ma'din Academy structure. All rights reserved.`;
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Category Filter Tabs
  const filterTabs = document.getElementById('inst-filter-tabs');
  if (filterTabs) {
    filterTabs.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      filterTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');
      const data = CampusDataService.getData();
      renderInstitutions(data.institutions || [], cat);
    });
  }

  // Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close on navigation link click
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }
}

// Modal Handlers
function openApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) modal.classList.add('open');
}

function closeApplyModal() {
  const modal = document.getElementById('apply-modal');
  if (modal) modal.classList.remove('open');
}

function prefillAdmissionCourse(courseName) {
  openApplyModal();
  const select = document.getElementById('modal-course-select');
  if (select) {
    // Check if matching option exists, or create temporary option
    let found = false;
    for (let opt of select.options) {
      if (opt.text.toLowerCase().includes(courseName.toLowerCase())) {
        select.value = opt.value;
        found = true;
        break;
      }
    }
    if (!found) {
      const newOpt = new Option(courseName, courseName, true, true);
      select.add(newOpt);
    }
  }
}

// Submission Handler
function handleAdmissionSubmit(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);

  const application = {
    applicantName: formData.get('applicantName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    course: formData.get('course'),
    qualification: formData.get('qualification') || 'Not specified',
    message: formData.get('message') || ''
  };

  CampusDataService.addSubmission(application);
  closeApplyModal();
  form.reset();
  showToast("Application submitted successfully! Our admissions office will reach out.");
}

// Toast Display
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

// Utilities
function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
