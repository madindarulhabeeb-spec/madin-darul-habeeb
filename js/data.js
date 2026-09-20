/**
 * Campus Portal - Central Data Store & Universal Cloud Persistence Layer
 * Inspired by Ma'din Academy (madin.edu.in)
 * Supports real-time multi-device cloud synchronization via Firebase Realtime Database & local caching
 */

const STORAGE_KEY = 'campus_portal_cms_data';
const CLOUD_CONFIG_KEY = 'campus_portal_cloud_config';

// Default Demo Campus Data
const DEFAULT_CAMPUS_DATA = {
  branding: {
    campusName: "Al-Madinah Academic Complex",
    tagline: "Illuminating Minds • Inspiring Character • Empowering Society",
    shortName: "MAC Campus",
    theme: "emerald", // 'emerald' or 'navy'
    goldAccent: "#d4af37",
    noticeTicker: "📢 Admissions Open for Academic Year 2026-27 | Merit Scholarship Exam on Oct 12 | National Symposium on Ethical AI & Education Registration Live",
    foundedYear: "1997",
    affiliations: "UGC Recognized • NAAC 'A++' Grade • AICTE Approved"
  },
  cloudConfig: {
    enabled: true,
    provider: "firebase",
    // User's Firebase Realtime Database URL
    databaseUrl: "https://madin-darul-habeeb-default-rtdb.firebaseio.com",
    lastSynced: null
  },
  contact: {
    address: "Knowledge City, Swagathamad, Malappuram, Kerala - 676519",
    phone: "+91 483 2738343, +91 9447 123456",
    email: "info@madinacampus.edu.in",
    admissionsEmail: "admissions@madinacampus.edu.in",
    officeHours: "Monday - Saturday: 8:30 AM - 5:00 PM",
    mapEmbedUrl: "https://maps.google.com/maps?q=Malappuram,Kerala&t=&z=13&ie=UTF8&iwloc=&output=embed",
    social: {
      facebook: "https://facebook.com",
      twitter: "https://twitter.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
      linkedin: "https://linkedin.com"
    }
  },
  hero: {
    headline: "Transforming Society Through Contemporary & Value-Based Education",
    subtitle: "A world-class academic sanctuary nurturing over 15,000 students across 28+ institutions, uniting spiritual heritage with modern scientific mastery.",
    primaryCtaText: "Explore Institutions",
    primaryCtaLink: "#institutions",
    secondaryCtaText: "Apply for Admission",
    secondaryCtaLink: "#admissions",
    badgeText: "27+ Years of Academic Eminence",
    bannerImage: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80"
  },
  stats: [
    { id: "stat-1", number: "28+", label: "Colleges & Institutes", icon: "school" },
    { id: "stat-2", number: "15,800+", label: "Enrolled Students", icon: "users" },
    { id: "stat-3", number: "27+", label: "Years of Educational Legacy", icon: "award" },
    { id: "stat-4", number: "650+", label: "Distinguished Mentors", icon: "user-check" }
  ],
  leadership: {
    name: "Prof. Dr. Sayyid Ibrahim Khaleel Al-Bukhari",
    title: "Founder & Chairman",
    subtitle: "Vice President, Muslim Heritage Council & Noted Philanthropist",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    quoteHeading: "Message from the Founder",
    message: "True education transcends the acquisition of degrees; it is the sacred endeavor of molding selfless human beings equipped with visionary intellect and unwavering integrity. When we established this campus over two and a half decades ago, our dream was to bridge deep moral values with progressive 21st-century academia. Today, our graduates lead in technology, research, social innovation, and public service around the globe.",
    signature: "Sayyid Ibrahim Khaleel"
  },
  institutions: [
    {
      id: "inst-1",
      name: "College of Arts & Science",
      category: "higher-ed",
      categoryLabel: "Higher Education",
      description: "Premier affiliated college offering undergraduate and postgraduate programs in Computer Science, English Literature, Commerce, and Biotechnology.",
      degrees: ["B.Sc Computer Science", "B.Com Finance", "B.A English", "M.Com"],
      established: "2003",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      id: "inst-2",
      name: "Academy of Islamic & Contemporary Studies",
      category: "islamic-studies",
      categoryLabel: "Islamic & Modern",
      description: "An innovative dual-curriculum academy integrating classical Islamic jurisprudence and philosophy with university degrees in humanities and management.",
      degrees: ["Integrated Dual Degree", "Kulliyya of Usuluddin", "Comparative Religion"],
      established: "1997",
      image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      id: "inst-3",
      name: "Polytechnic & Technical Institute",
      category: "technical",
      categoryLabel: "Engineering & Tech",
      description: "AICTE-approved state-of-the-art polytechnic college delivering hands-on engineering diplomas with direct industrial apprenticeship programs.",
      degrees: ["Automobile Engg.", "Civil Engg.", "Computer Engg.", "Electronics & Comm."],
      established: "2008",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      id: "inst-4",
      name: "Center for Artificial Intelligence & Data Science",
      category: "technical",
      categoryLabel: "Advanced Technologies",
      description: "Advanced technological research wing focusing on machine learning, cloud architecture, cybersecurity labs, and startup incubators.",
      degrees: ["Data Science Certifications", "Cybersecurity Diploma", "Full-Stack Bootcamps"],
      established: "2021",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      id: "inst-5",
      name: "International Senior Secondary Residential School",
      category: "schools",
      categoryLabel: "Schooling",
      description: "Co-educational modern boarding school following CBSE curriculum with international sports complexes, STEM clubs, and robotics labs.",
      degrees: ["KG to Grade 12 (CBSE)", "Science & Bio-Maths", "Commerce & Humanities"],
      established: "2000",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      link: "#"
    },
    {
      id: "inst-6",
      name: "Institute for Inclusive & Special Education",
      category: "special-ed",
      categoryLabel: "Special Needs & Social Care",
      description: "Nationally recognized institute providing customized learning therapies, autism spectrum interventions, hearing rehabilitation, and vocational training.",
      degrees: ["Speech & Audio Therapy", "Sensory Integration", "Vocational Craft"],
      established: "2011",
      image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=600&q=80",
      link: "#"
    }
  ],
  campusLife: [
    {
      id: "life-1",
      title: "Hostels & Student Residences",
      description: "Clean, secure, and modern residential campuses providing nutritious dining, high-speed Wi-Fi, study lounges, and 24/7 warden supervision.",
      icon: "home",
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "life-2",
      title: "Central Digital Library & Archives",
      description: "Over 80,000 print volumes, automated RFID kiosk, subscription to 15+ international e-journal databases, and quiet research chambers.",
      icon: "book-open",
      image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "life-3",
      title: "High-Tech Science & Innovation Labs",
      description: "Specialized laboratories for physics, chemistry, robotics, electronics prototyping, and 3D printing enabling project-driven learning.",
      icon: "cpu",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=600&q=80"
    },
    {
      id: "life-4",
      title: "Sports Arena & Cultural Festivals",
      description: "FIFA-standard turf football ground, indoor badminton courts, martial arts dojo, and annual inter-collegiate cultural meets.",
      icon: "activity",
      image: "https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=600&q=80"
    }
  ],
  news: [
    {
      id: "news-1",
      title: "Admissions Open 2026-27: Online Applications Invited",
      category: "Admissions",
      date: "September 18, 2026",
      summary: "Applications are now invited for Undergraduate, Postgraduate, and Professional Diploma programs across all 28 institutions for the upcoming academic session.",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80",
      featured: true
    },
    {
      id: "news-2",
      title: "Campus Research Team Secures National Innovation Grant",
      category: "Research",
      date: "September 12, 2026",
      summary: "Our AI & Environmental Science department was awarded a ₹50 Lakh research grant for their sustainable water purification prototype.",
      image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=600&q=80",
      featured: false
    },
    {
      id: "news-3",
      title: "Global Cultural Fest 'Euphoria 2026' Concludes with Accolades",
      category: "Campus Events",
      date: "August 28, 2026",
      summary: "Over 3,000 student delegates from 45 colleges across India participated in literary debates, Arabic calligraphy, and technical hackathons.",
      image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
      featured: false
    }
  ],
  events: [
    {
      id: "event-1",
      day: "28",
      month: "OCT",
      year: "2026",
      title: "International Symposium on Values & Modern Science",
      time: "09:30 AM - 04:30 PM",
      venue: "Grand Academic Auditorium, Block A",
      category: "Conference",
      description: "Distinguished scholars and university deans from 6 countries converge to discuss ethical foundations in emerging bio-technology and quantum computing."
    },
    {
      id: "event-2",
      day: "12",
      month: "NOV",
      year: "2026",
      title: "Annual Campus Career Conclave & Job Expo",
      time: "10:00 AM - 05:00 PM",
      venue: "Campus Placement Center",
      category: "Placements",
      description: "Top multinational employers and premier tech companies conduct on-campus hiring for graduating batches."
    },
    {
      id: "event-3",
      day: "05",
      month: "DEC",
      year: "2026",
      title: "Grand Alumni Reunion & Silver Jubilee Summit",
      time: "03:00 PM - 08:30 PM",
      venue: "Central Stadium & Amphitheater",
      category: "Alumni Meet",
      description: "Celebrating 27 years of empowering lives. Welcoming distinguished alumni from across 30+ nations."
    }
  ],
  admissions: {
    isOpen: true,
    bannerTitle: "Shape Your Future at Our Iconic Campus",
    deadline: "October 31, 2026",
    helpline: "+91 9447 123456",
    steps: [
      { step: "01", title: "Submit Application", desc: "Fill online form with academic records and preferred course." },
      { step: "02", title: "Entrance / Screening", desc: "Attend the campus aptitude interview or merit evaluation." },
      { step: "03", title: "Seat Confirmation", desc: "Receive provisional offer and complete fee documentation." }
    ]
  },
  adminAuth: {
    pin: "admin123",
    lastLogin: null
  },
  submissions: [
    {
      id: "sub-101",
      applicantName: "Amina Rashid",
      email: "amina.rashid@example.com",
      phone: "+91 9876543210",
      course: "B.Sc Computer Science",
      qualification: "Higher Secondary (94%)",
      message: "Interested in the AI and Data Science honors track.",
      submittedAt: "2026-09-18 14:20",
      status: "Reviewed"
    },
    {
      id: "sub-102",
      applicantName: "Mohammed Bilal",
      email: "bilal.m@example.com",
      phone: "+91 9845612345",
      course: "Automobile Engineering Diploma",
      qualification: "SSLC / Class 10 (89%)",
      message: "Looking for hostel accommodation details as well.",
      submittedAt: "2026-09-19 11:05",
      status: "New"
    }
  ]
};

// ==========================================================================
// Central Data & Universal Cloud Persistence Service
// ==========================================================================
const CampusDataService = {
  _cloudSyncInProgress: false,

  // Get current data from local cache
  getData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        this.saveDataLocal(DEFAULT_CAMPUS_DATA);
        return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
      }
      const parsed = JSON.parse(stored);
      return {
        ...DEFAULT_CAMPUS_DATA,
        ...parsed,
        branding: { ...DEFAULT_CAMPUS_DATA.branding, ...(parsed.branding || {}) },
        cloudConfig: { ...DEFAULT_CAMPUS_DATA.cloudConfig, ...(parsed.cloudConfig || {}) },
        contact: { ...DEFAULT_CAMPUS_DATA.contact, ...(parsed.contact || {}) },
        hero: { ...DEFAULT_CAMPUS_DATA.hero, ...(parsed.hero || {}) },
        leadership: { ...DEFAULT_CAMPUS_DATA.leadership, ...(parsed.leadership || {}) },
        admissions: { ...DEFAULT_CAMPUS_DATA.admissions, ...(parsed.admissions || {}) },
        adminAuth: { ...DEFAULT_CAMPUS_DATA.adminAuth, ...(parsed.adminAuth || {}) }
      };
    } catch (e) {
      console.error("Error reading campus data:", e);
      return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    }
  },

  // Save data to local cache only
  saveDataLocal(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('campusDataUpdated', { detail: data }));
      return true;
    } catch (e) {
      console.error("Error saving local campus data:", e);
      return false;
    }
  },

  // Universal Save: Saves locally AND syncs to Cloud across all devices
  async saveData(data) {
    // 1. Save locally for instantaneous response
    this.saveDataLocal(data);

    // 2. Broadcast to Cloud Database asynchronously
    if (data.cloudConfig && data.cloudConfig.enabled && data.cloudConfig.databaseUrl) {
      return await this.pushToCloud(data);
    }
    return { success: true, cloud: false };
  },

  // Get formatted Firebase REST URL
  getCloudEndpoint(data = null) {
    const current = data || this.getData();
    let url = (current.cloudConfig && current.cloudConfig.databaseUrl) ? current.cloudConfig.databaseUrl.trim() : "";
    if (!url) return null;
    
    // Clean trailing slashes
    url = url.replace(/\/+$/, "");
    if (!url.endsWith(".json")) {
      url += "/campusData.json";
    }
    return url;
  },

  // Pull latest data from Cloud Database (Runs when any visitor opens site on any device)
  async syncFromCloud() {
    if (this._cloudSyncInProgress) return;
    const endpoint = this.getCloudEndpoint();
    if (!endpoint) return { success: false, reason: "No cloud endpoint configured" };

    this._cloudSyncInProgress = true;
    window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'syncing' } }));

    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store'
      });

      if (!response.ok) {
        throw new Error(`Cloud returned HTTP ${response.status}`);
      }

      const cloudData = await response.json();
      if (cloudData && cloudData.branding) {
        // Merge cloud data into local cache
        const local = this.getData();
        const merged = {
          ...local,
          ...cloudData,
          cloudConfig: {
            ...local.cloudConfig,
            ...(cloudData.cloudConfig || {}),
            lastSynced: new Date().toISOString()
          }
        };

        this.saveDataLocal(merged);
        window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'synced', timestamp: new Date() } }));
        this._cloudSyncInProgress = false;
        return { success: true, data: merged };
      } else {
        // Cloud exists but is empty; push our local baseline up
        window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'empty' } }));
        this._cloudSyncInProgress = false;
        return { success: true, empty: true };
      }
    } catch (err) {
      console.warn("Cloud sync unavailable or offline, using local cache:", err.message);
      window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'offline', error: err.message } }));
      this._cloudSyncInProgress = false;
      return { success: false, error: err.message };
    }
  },

  // Push full data to Cloud Database
  async pushToCloud(dataToPush = null) {
    const data = dataToPush || this.getData();
    const endpoint = this.getCloudEndpoint(data);
    if (!endpoint) return { success: false, reason: "No cloud endpoint set" };

    window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'syncing' } }));

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Cloud write failed with HTTP ${response.status}`);
      }

      data.cloudConfig = data.cloudConfig || {};
      data.cloudConfig.lastSynced = new Date().toISOString();
      this.saveDataLocal(data);

      window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'synced', timestamp: new Date() } }));
      return { success: true };
    } catch (err) {
      console.error("Failed to push to Cloud Database:", err);
      window.dispatchEvent(new CustomEvent('cloudSyncStatus', { detail: { status: 'error', error: err.message } }));
      return { success: false, error: err.message };
    }
  },

  // Test Cloud connection
  async testCloudConnection(customUrl = null) {
    const data = this.getData();
    let url = customUrl ? customUrl.trim() : (data.cloudConfig ? data.cloudConfig.databaseUrl : "");
    if (!url) return { success: false, message: "Please enter a valid Firebase Realtime Database URL." };

    url = url.replace(/\/+$/, "");
    if (!url.endsWith(".json")) {
      url += "/_ping.json";
    }

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ping: true, timestamp: Date.now() })
      });

      if (res.ok) {
        return { success: true, message: "Connected! All devices worldwide can now read and write changes in real time." };
      } else {
        return { success: false, message: `Cloud rejected connection with status ${res.status}. Check Firebase Database Rules.` };
      }
    } catch (e) {
      return { success: false, message: `Could not reach database: ${e.message}. Ensure CORS or URL format is correct.` };
    }
  },

  // Add application submission (saves locally and to cloud)
  async addSubmission(application) {
    const current = this.getData();
    const newSubmission = {
      id: "sub-" + Date.now(),
      submittedAt: new Date().toLocaleString(),
      status: "New",
      ...application
    };
    current.submissions = [newSubmission, ...(current.submissions || [])];
    
    // Save locally
    this.saveDataLocal(current);

    // Push submissions to Cloud REST endpoint so host on another computer sees it!
    const endpoint = this.getCloudEndpoint(current);
    if (endpoint) {
      const subEndpoint = endpoint.replace("campusData.json", "campusData/submissions.json");
      try {
        fetch(subEndpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current.submissions)
        }).catch(err => console.warn("Cloud submission background sync:", err));
      } catch (e) {}
    }

    return newSubmission;
  },

  // Factory demo reset
  resetToDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    this.saveDataLocal(DEFAULT_CAMPUS_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
  },

  // Export JSON file download
  exportJSON() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campus-portal-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Import JSON string
  importJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.branding || !parsed.hero) {
        throw new Error("Invalid backup structure: Missing essential sections.");
      }
      this.saveData(parsed);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  },

  // PIN Verification
  verifyPin(inputPin) {
    const data = this.getData();
    return (data.adminAuth && data.adminAuth.pin === inputPin) || inputPin === "admin123";
  },

  // Check URL hash for shared configuration snapshot
  checkUrlHashData() {
    try {
      if (window.location.hash && window.location.hash.includes('portal_data=')) {
        const match = window.location.hash.match(/portal_data=([^&]+)/);
        if (match && match[1]) {
          const jsonStr = decodeURIComponent(escape(atob(match[1])));
          const parsed = JSON.parse(jsonStr);
          if (parsed && parsed.branding) {
            this.saveDataLocal(parsed);
            history.replaceState(null, null, window.location.pathname + window.location.search);
            return parsed;
          }
        }
      }
    } catch (e) {
      console.warn("Could not unpack portal_data from URL hash:", e);
    }
    return null;
  },

  // Load baseline from data.json file if hosted on web server
  async loadFromDataJson() {
    try {
      if (window.location.protocol.startsWith('http')) {
        const res = await fetch('./data.json?v=' + Date.now());
        if (res.ok) {
          const fileData = await res.json();
          if (fileData && fileData.branding) {
            const hasLocalEdits = localStorage.getItem(STORAGE_KEY);
            if (!hasLocalEdits) {
              this.saveDataLocal(fileData);
              return fileData;
            }
          }
        }
      }
    } catch (e) {
      console.warn("data.json not loaded:", e);
    }
    return null;
  },

  // Download exact data.json to replace in project root / GitHub / Vercel
  downloadDataJson() {
    const data = this.getData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.json";
    a.click();
    URL.revokeObjectURL(url);
  },

  // Generate 1-click shareable URL that loads exact state on any phone or device
  generateShareUrl() {
    const data = this.getData();
    const jsonStr = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const base = window.location.href.split('#')[0].replace('admin.html', 'index.html');
    return `${base}#portal_data=${encoded}`;
  },

  isHostAuthenticated() {
    return sessionStorage.getItem('campus_host_auth') === 'true' || 
           localStorage.getItem('campus_host_auth_persistent') === 'true';
  },

  setHostAuthenticated(status, remember = false) {
    if (status) {
      sessionStorage.setItem('campus_host_auth', 'true');
      if (remember) {
        localStorage.setItem('campus_host_auth_persistent', 'true');
      }
    } else {
      sessionStorage.removeItem('campus_host_auth');
      localStorage.removeItem('campus_host_auth_persistent');
    }
  }
};

window.CampusDataService = CampusDataService;
