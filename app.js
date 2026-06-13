/* ===== DATA STORE ===== */
const DEFAULT_ADMIN_PASSWORD = 'varun@123';
const DEFAULT_ADMIN_PASS_HASH = '7f93d3793bec2f7bdd4e7131dad1f3b2cd21a14b648b878d26d82621f5178103';
const OLD_DEFAULT_ADMIN_PASS_HASH = '0efdb605cd270397af9efe0970b8110a3caccad44bce1b90c0b7f833c700e915';

let DATA = {
  adminPass: DEFAULT_ADMIN_PASS_HASH, // default password: varun@123
  profile: {
    firstName: 'Varun',
    lastName: 'Saxena',
    role: 'Web Developer & UI/UX Designer',
    heroDesc: 'MCA student & passionate Web Developer crafting beautiful, functional digital experiences with clean code and creative design.',
    about1: "I'm a detail-oriented MCA student with a strong passion for Web Development, UI/UX Design, and creating seamless digital experiences. I love turning complex problems into simple, beautiful and functional solutions.",
    about2: 'Currently pursuing MCA while working as an Examination Supervisor, I bring discipline, precision, and a team-first mindset to everything I build. My goal is to become a full-stack web developer.',
    location: 'Kota, Rajasthan',
    education: 'MCA (Pursuing)',
    status: 'Open to Work'
  },
  contact: {
    email: 'varunsaxena063@gmail.com',
    phone: '+91 78770402765',
    location: 'Kota, Rajasthan, India',
    github: '',
    linkedin: '',
    twitter: ''
  },
  skills: [
    { name:'HTML5', icon:'🌐', pct:92, color:'#e34f26' },
    { name:'CSS3', icon:'🎨', pct:88, color:'#264de4' },
    { name:'JavaScript', icon:'⚡', pct:80, color:'#f7df1e' },
    { name:'React.js', icon:'⚛️', pct:72, color:'#61dbfb' },
    { name:'Bootstrap', icon:'🅱️', pct:85, color:'#7952b3' },
    { name:'MySQL', icon:'🗄️', pct:75, color:'#00758f' },
    { name:'PHP', icon:'🐘', pct:65, color:'#8993be' },
    { name:'MS Excel', icon:'📊', pct:90, color:'#20b2aa' },
    { name:'Power BI', icon:'📈', pct:78, color:'#f2c811' },
    { name:'Git/GitHub', icon:'🔗', pct:70, color:'#f05032' },
    { name:'Figma', icon:'🖌️', pct:68, color:'#a259ff' },
    { name:'Python', icon:'🐍', pct:60, color:'#3776ab' },
  ],
  projects: [
    {
      title:'Personal Portfolio v1',
      desc:'A clean and minimal portfolio website built with HTML, CSS and vanilla JavaScript showcasing projects and skills.',
      tech:['HTML','CSS','JavaScript'],
      color:'#20b2aa',
      emoji:'🌐',
      link:'#',
      github:'#'
    },
    {
      title:'Data Dashboard',
      desc:'Interactive Power BI-style dashboard for data visualization with real-time chart updates and filter panels.',
      tech:['HTML','CSS','JS','Chart.js'],
      color:'#3a9bd5',
      emoji:'📊',
      link:'#',
      github:'#'
    },
    {
      title:'Student Management System',
      desc:'Full-featured student record system with attendance tracking, marks entry and report generation.',
      tech:['PHP','MySQL','Bootstrap'],
      color:'#8b5cf6',
      emoji:'🏫',
      link:'#',
      github:'#'
    },
    {
      title:'E-Commerce UI',
      desc:'Modern e-commerce frontend with product listing, cart functionality, and responsive design.',
      tech:['React','CSS','JavaScript'],
      color:'#f59e0b',
      emoji:'🛒',
      link:'#',
      github:'#'
    },
    {
      title:'Weather App',
      desc:'Real-time weather app using OpenWeather API with beautiful weather cards and 7-day forecast.',
      tech:['JavaScript','API','CSS'],
      color:'#10b981',
      emoji:'⛅',
      link:'#',
      github:'#'
    },
    {
      title:'Quiz Platform',
      desc:'Timed quiz platform with multiple categories, score tracking, and leaderboard functionality.',
      tech:['HTML','CSS','JavaScript'],
      color:'#ef4444',
      emoji:'❓',
      link:'#',
      github:'#'
    },
  ],
  education: [
    { title:'Master of Computer Applications (MCA)', inst:'Pursuing', year:'2024–20XX', icon:'🎓' },
    { title:'Bachelor of Computer Applications (BCA)', inst:'Completed', year:'2021–2023', icon:'🏅' },
    { title:'12th – RBSE', inst:'Pragati Public Sr. Sec. School, Kota', year:'2018–2020', icon:'📚' },
    { title:'10th – RBSE', inst:'Tarey Sec. School, Kota', year:'2008–2018', icon:'📖' },
    { title:'Basic Data Science & Data Analysis', inst:'Kota', year:'2023–2024', icon:'📊' },
    { title:'Diploma in ASDN Cybernetics', inst:'', year:'2022–2023', icon:'🔐' },
    { title:'ITI Industrial Training', inst:'ITI Industrial Training Institute', year:'2021–2022', icon:'🏭' },
    { title:'Rajasthan State Certificate – IT', inst:'Kota', year:'2019–2020', icon:'🏆' },
  ]
};

/* ===== PASSWORD HASHING (SHA-256) ===== */
async function hashPassword(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function mergeSavedData(parsed) {
  const defaultData = DATA;
  DATA = {
    ...defaultData,
    ...parsed,
    profile: { ...defaultData.profile, ...(parsed.profile || {}) },
    contact: { ...defaultData.contact, ...(parsed.contact || {}) },
    skills: Array.isArray(parsed.skills) && parsed.skills.length ? parsed.skills : defaultData.skills,
    projects: Array.isArray(parsed.projects) && parsed.projects.length ? parsed.projects : defaultData.projects,
    education: Array.isArray(parsed.education) && parsed.education.length ? parsed.education : defaultData.education
  };
  DATA.adminPass = !parsed.adminPass || parsed.adminPass === OLD_DEFAULT_ADMIN_PASS_HASH
    ? DEFAULT_ADMIN_PASS_HASH
    : parsed.adminPass;
  if (parsed.github && !DATA.contact.github) DATA.contact.github = parsed.github;
  if (parsed.linkedin && !DATA.contact.linkedin) DATA.contact.linkedin = parsed.linkedin;
  if (parsed.twitter && !DATA.contact.twitter) DATA.contact.twitter = parsed.twitter;
}

/* ===== LOAD FROM STORAGE ===== */
async function loadData() {
  try {
    const saved = localStorage.getItem('varun_portfolio_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      mergeSavedData(parsed);
      if (
        !Array.isArray(parsed.skills) || !parsed.skills.length ||
        !Array.isArray(parsed.projects) || !parsed.projects.length ||
        !Array.isArray(parsed.education) || !parsed.education.length ||
        parsed.adminPass !== DATA.adminPass
      ) {
        saveData({ cloud: false });
      }
    }
  } catch(e) {}

  try {
    if (window.CloudSync && CloudSync.isConfigured()) {
      const cloudData = await CloudSync.load();
      if (cloudData) {
        mergeSavedData(cloudData);
        localStorage.setItem('varun_portfolio_data', JSON.stringify(DATA));
      }
    }
  } catch(e) {
    console.warn('[CloudSync] Cloud load failed:', e);
  }
}

// ⚠️ Clear any old broken password from localStorage on load
(function fixOldPassword() {
  try {
    const saved = JSON.parse(localStorage.getItem('varun_portfolio_data') || '{}');
    if (!saved.adminPass || saved.adminPass === OLD_DEFAULT_ADMIN_PASS_HASH) {
      saved.adminPass = DEFAULT_ADMIN_PASS_HASH;
      localStorage.setItem('varun_portfolio_data', JSON.stringify(saved));
    }
  } catch(e) {}
})();

function saveData(options = {}) {
  localStorage.setItem('varun_portfolio_data', JSON.stringify(DATA));
  // Sync with DB layer for export/import compatibility
  try {
    if (typeof DB !== 'undefined') {
      DB.setProfile(DATA.profile || {});
      DB.setContact(DATA.contact || {});
      if (Array.isArray(DATA.skills)) DB.bulkSet('skills', DATA.skills);
      if (Array.isArray(DATA.projects)) DB.bulkSet('projects', DATA.projects);
      if (Array.isArray(DATA.education)) DB.bulkSet('education', DATA.education);
      if (DATA.adminPass) DB.setAdminPass(DATA.adminPass);
    }
  } catch(e) { /* DB sync optional */ }

  if (options.cloud !== false && window.CloudSync && CloudSync.isConfigured()) {
    CloudSync.save(DATA).catch(err => console.warn('[CloudSync] Cloud save failed:', err));
  }
}

function setValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value || '';
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value || '';
}

function applyStoredContent() {
  const p = DATA.profile || {};
  const c = DATA.contact || {};
  const fullName = `${p.firstName || 'Varun'} ${p.lastName || 'Saxena'}`.trim();

  setText('heroFirstName', p.firstName);
  setText('heroLastName', p.lastName);
  setText('footerName', fullName);
  setText('aboutName', fullName);
  setText('aboutRole', p.role);
  setText('heroDesc', p.heroDesc);
  setText('aboutDesc', p.about1);
  setText('aboutDesc2', p.about2);
  setText('aboutLocation', p.location);
  setText('aboutEdu', p.education);
  setText('aboutStatus', p.status);
  setText('aboutEmail', c.email);
  setText('contactEmail', c.email);
  setText('aboutPhone', c.phone);
  setText('contactPhone', c.phone);
  setText('contactLoc', c.location);

  setValue('a-fname', p.firstName);
  setValue('a-lname', p.lastName);
  setValue('a-role', p.role);
  setValue('a-desc', p.heroDesc);
  setValue('a-about1', p.about1);
  setValue('a-about2', p.about2);
  setValue('a-location', p.location);
  setValue('a-edu', p.education);
  setValue('a-status', p.status);
  setValue('a-email', c.email);
  setValue('a-phone', c.phone);
  setValue('a-cloc', c.location);
  setValue('a-github', c.github || DATA.github || '');
  setValue('a-linkedin', c.linkedin || DATA.linkedin || '');
  setValue('a-twitter', c.twitter || DATA.twitter || '');
  updateSocialLink('githubLink', c.github || DATA.github || '', false);
  updateSocialLink('linkedinLink', c.linkedin || DATA.linkedin || '', false);
  updateSocialLink('twitterLink', c.twitter || DATA.twitter || '', false);
}

function bindAdminSaveButtons() {
  const profileSave = document.querySelector('#tab-profile .btn-primary');
  const contactSave = document.querySelector('#tab-contact .btn-primary');
  if (profileSave) profileSave.onclick = saveProfile;
  if (contactSave) contactSave.onclick = saveContact;
}

function cloudSaveSuffix() {
  return window.CloudSync && CloudSync.isConfigured() ? ' Synced online.' : ' Saved on this browser.';
}

/* ===== LOADER ===== */
window.addEventListener('load', async () => {
  await loadData();
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initAll();
  }, 2400);
});

function initAll() {
  applyStoredContent();
  bindAdminSaveButtons();
  initCursor();
  initNavbar();
  initTheme();
  initTypewriter();
  initParticles();
  initSkills();
  initProjects();
  initTimeline();
  initScrollAnimations();
  initMobileMenu();
  // Dynamic footer year
  const fyEl = document.getElementById('footerYear');
  if(fyEl) fyEl.textContent = new Date().getFullYear();
}

/* ===== CURSOR ===== */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  let mx=0, my=0, fx=0, fy=0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.left=mx+'px'; cursor.style.top=my+'px'; });
  function followCursor() {
    fx += (mx-fx)*.12; fy += (my-fy)*.12;
    follower.style.left=fx+'px'; follower.style.top=fy+'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();
  document.querySelectorAll('a,button,.btn-primary,.btn-secondary,.skill-icon-card,.project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.style.width='18px'; cursor.style.height='18px'; follower.style.width='52px'; follower.style.height='52px'; follower.style.opacity='.3'; });
    el.addEventListener('mouseleave', () => { cursor.style.width='10px'; cursor.style.height='10px'; follower.style.width='36px'; follower.style.height='36px'; follower.style.opacity='.5'; });
  });
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
    const sections = document.querySelectorAll('section[id]');
    let curr = '';
    sections.forEach(s => { if(window.scrollY >= s.offsetTop - 140) curr = s.id; });
    links.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#'+curr); });
  });
}

/* ===== MOBILE MENU ===== */
function initMobileMenu() {
  const hb = document.getElementById('hamburger');
  const nl = document.getElementById('navLinks');
  hb.addEventListener('click', () => { hb.classList.toggle('active'); nl.classList.toggle('open'); });
  document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => { hb.classList.remove('active'); nl.classList.remove('open'); }));
}

/* ===== THEME ===== */
function initTheme() {
  const saved = localStorage.getItem('varun_theme') || 'light';
  setTheme(saved);
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('varun_theme', theme);
  const icon = document.getElementById('themeIcon');
  if(icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

document.getElementById('themeToggle').addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

/* ===== TYPEWRITER ===== */
function initTypewriter() {
  const words = ['Websites 🌐','Web Apps 🚀','UI/UX Designs 🎨','Dashboards 📊','React Apps ⚛️','Clean Code 💻'];
  let wi=0, ci=0, deleting=false;
  const el = document.getElementById('typewriter');
  function type() {
    const word = words[wi];
    if(!deleting) {
      el.textContent = word.slice(0, ++ci);
      if(ci === word.length) { deleting=true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = word.slice(0, --ci);
      if(ci === 0) { deleting=false; wi=(wi+1)%words.length; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
}

/* ===== PARTICLES ===== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  class P {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random()*canvas.width;
      this.y = Math.random()*canvas.height;
      this.vx = (Math.random()-.5)*.4;
      this.vy = (Math.random()-.5)*.4;
      this.r = Math.random()*2+1;
      this.alpha = Math.random()*.5+.15;
    }
    update() {
      this.x+=this.vx; this.y+=this.vy;
      if(this.x<0||this.x>canvas.width||this.y<0||this.y>canvas.height) this.reset();
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme')==='dark';
      ctx.beginPath();
      ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
      ctx.fillStyle = isDark ? `rgba(32,178,170,${this.alpha})` : `rgba(58,155,213,${this.alpha})`;
      ctx.fill();
    }
  }
  for(let i=0;i<80;i++) particles.push(new P());
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{p.update();p.draw();});
    // draw lines
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<120){
          ctx.beginPath();
          ctx.moveTo(particles[i].x,particles[i].y);
          ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(32,178,170,${.15*(1-dist/120)})`;
          ctx.lineWidth=.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ===== SKILLS ===== */
function initSkills() {
  renderSkillIcons();
  renderSkillBars();
}

function renderSkillIcons() {
  const container = document.getElementById('skillsIcons');
  container.innerHTML = DATA.skills.map((s,i) => `
    <div class="skill-icon-card animate-up" style="transition-delay:${i*0.05}s" data-skill="${s.name}">
      <span class="sk-emoji">${s.icon}</span>
      <div class="sk-name">${s.name}</div>
      <div class="sk-badge">${s.pct}%</div>
    </div>
  `).join('');
}

function renderSkillBars() {
  const container = document.getElementById('skillsBarsWrap');
  container.innerHTML = DATA.skills.map((s,i) => `
    <div class="skill-bar-item animate-up" style="transition-delay:${i*0.06}s">
      <div class="sb-header"><span>${s.icon} ${s.name}</span><span class="sb-pct">${s.pct}%</span></div>
      <div class="sb-track"><div class="sb-fill" data-pct="${s.pct}" style="background:linear-gradient(90deg,${s.color},${s.color}88)"></div></div>
    </div>
  `).join('');
}

/* ===== URL HELPER ===== */
function isValidUrl(url) {
  if (!url || url.trim() === '' || url.trim() === '#') return false;
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch(e) {
    // Try with https prefix
    try {
      const u = new URL('https://' + url);
      return u.hostname.includes('.');
    } catch(e2) { return false; }
  }
}

function normalizeUrl(url) {
  if (!url || url.trim() === '' || url.trim() === '#') return '#';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  // If it looks like a domain
  if (url.includes('.') && !url.startsWith('#')) return 'https://' + url;
  return url;
}

function makeLinkHtml(url, label, icon) {
  const valid = isValidUrl(url);
  const normalized = normalizeUrl(url);
  if (valid) {
    return `<a href="${normalized}" class="proj-link" target="_blank" rel="noopener noreferrer">${icon} ${label}</a>`;
  } else {
    return `<span class="proj-link proj-link-disabled" title="URL not set">${icon} ${label}</span>`;
  }
}

/* ===== PROJECTS ===== */
function initProjects() {
  const container = document.getElementById('projectsGrid');
  container.innerHTML = DATA.projects.map((p,i) => `
    <div class="project-card animate-up" style="transition-delay:${i*0.08}s">
      <div class="project-header" style="background:linear-gradient(135deg,${p.color}22,${p.color}44);${p.image ? 'padding:0;overflow:hidden;' : ''}">
        ${p.image
          ? `<img src="${p.image}" alt="${p.title}" style="width:100%;height:100%;object-fit:cover;display:block;min-height:140px" />`
          : `<span style="position:relative;z-index:1;font-size:3.5rem">${p.emoji || '🚀'}</span>`
        }
      </div>
      <div class="project-body">
        <div class="project-title">${p.title}</div>
        <div class="project-desc">${p.desc}</div>
        <div class="project-tech">${p.tech.map(t=>`<span class="tech-tag">${t}</span>`).join('')}</div>
        <div class="project-links">
          ${makeLinkHtml(p.link, 'Live Demo', '🔗')}
          ${makeLinkHtml(p.github, 'GitHub', '🐙')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ===== TIMELINE ===== */
function initTimeline() {
  const container = document.getElementById('timelineWrap');
  container.innerHTML = DATA.education.map((e,i) => `
    <div class="timeline-item animate-up" style="transition-delay:${i*0.07}s">
      <div class="ti-card">
        <div class="ti-header">
          <div class="ti-title">${e.icon} ${e.title}</div>
          <div class="ti-year">${e.year}</div>
        </div>
        ${e.inst ? `<div class="ti-inst">📍 ${e.inst}</div>` : ''}
      </div>
    </div>
  `).join('');
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Animate skill bars
        const bars = entry.target.querySelectorAll ? entry.target.querySelectorAll('.sb-fill') : [];
        bars.forEach(b => { setTimeout(() => { b.style.width = b.dataset.pct+'%'; }, 200); });
      }
    });
  }, { threshold: 0.12 });
  
  // observe section content
  document.querySelectorAll('.animate-up').forEach(el => observer.observe(el));
  
  // Observe sections for skill bars
  const skillSection = document.getElementById('skills');
  if(skillSection) {
    new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        setTimeout(() => {
          document.querySelectorAll('.sb-fill').forEach(b => { b.style.width = b.dataset.pct+'%'; });
        }, 300);
      }
    }, {threshold:0.2}).observe(skillSection);
  }
  
  // Observe all sections and animate children
  document.querySelectorAll('section').forEach(sec => {
    new IntersectionObserver((entries) => {
      if(entries[0].isIntersecting) {
        entries[0].target.querySelectorAll('.animate-up').forEach((el,i) => {
          setTimeout(() => el.classList.add('visible'), i*80);
        });
      }
    }, {threshold:0.1}).observe(sec);
  });
}

/* ===== CONTACT FORM ===== */
async function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const defaultText = 'Send Message 🚀';

  btn.disabled = true;
  btn.textContent = 'Sending...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    });

    if (!res.ok) throw new Error('Message service failed');

    btn.textContent = '✅ Message Sent!';
    btn.style.background = 'var(--success)';
    showToast('✅ Message sent to Varun successfully!');
    form.reset();
  } catch (err) {
    btn.textContent = 'Try Again';
    btn.style.background = '#ef4444';
    showToast('❌ Message not sent. Please try again or email directly.');
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      btn.textContent = defaultText;
      btn.style.background = '';
    }, 3000);
  }
}

/* ===== SYSTEM STATUS CHECKER ===== */
function checkSystemStatus() {
  const modal = document.getElementById('statusModal');
  modal.classList.add('show');
  runStatusChecks();
}

function closeStatusModal() {
  document.getElementById('statusModal').classList.remove('show');
}

function setStatus(id, state, msg) {
  const row = document.getElementById(id);
  if (!row) return;
  const dot = row.querySelector('.st-dot');
  const label = row.querySelector('.st-label');
  const detail = row.querySelector('.st-detail');
  dot.className = 'st-dot ' + state;
  label.textContent = state === 'ok' ? '✅ Working' : state === 'warn' ? '⚠️ Partial' : state === 'loading' ? '🔄 Checking...' : '❌ Error';
  if (detail) detail.textContent = msg || '';
}

async function runStatusChecks() {
  // Reset all to loading
  ['st-frontend','st-localstorage','st-dom','st-password','st-data'].forEach(id => setStatus(id,'loading',''));

  // 1. Frontend check
  try {
    const hasCanvas = !!document.getElementById('particleCanvas');
    const hasNav = !!document.getElementById('navbar');
    const hasSections = document.querySelectorAll('section').length >= 4;
    if (hasCanvas && hasNav && hasSections) {
      setStatus('st-frontend','ok','All HTML sections loaded correctly');
    } else {
      setStatus('st-frontend','warn','Some elements may be missing');
    }
  } catch(e) { setStatus('st-frontend','error','Frontend check failed: '+e.message); }

  await sleep(400);

  // 2. LocalStorage (acts as database)
  try {
    const testKey = '__vstest__';
    localStorage.setItem(testKey, '1');
    const val = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    if (val === '1') {
      const stored = localStorage.getItem('varun_portfolio_data');
      const msg = stored ? 'Data found in storage (' + Math.round(stored.length/1024*10)/10 + ' KB)' : 'Storage OK — no saved data yet';
      setStatus('st-localstorage','ok', msg);
    } else {
      setStatus('st-localstorage','error','localStorage read/write failed');
    }
  } catch(e) { setStatus('st-localstorage','error','LocalStorage blocked: '+e.message); }

  await sleep(400);

  // 3. DOM / JS Engine check
  try {
    const dynEl = document.createElement('div');
    dynEl.id = '__vsdomtest__';
    document.body.appendChild(dynEl);
    const found = !!document.getElementById('__vsdomtest__');
    document.body.removeChild(dynEl);
    const jsOk = typeof DATA === 'object' && Array.isArray(DATA.skills);
    if (found && jsOk) {
      setStatus('st-dom','ok','JavaScript engine & DOM working fine');
    } else {
      setStatus('st-dom','warn','DOM works but DATA object issue');
    }
  } catch(e) { setStatus('st-dom','error','DOM/JS error: '+e.message); }

  await sleep(400);

  // 4. Password check
  try {
    const passOk = DATA.adminPass && DATA.adminPass.length >= 6;
    const saved = JSON.parse(localStorage.getItem('varun_portfolio_data') || '{}');
    const savedPassMatch = !saved.adminPass || saved.adminPass === DATA.adminPass;
    if (passOk && savedPassMatch) {
      setStatus('st-password','ok','Password is set and synced correctly');
    } else if (passOk && !savedPassMatch) {
      setStatus('st-password','warn','Password mismatch between memory and storage');
    } else {
      setStatus('st-password','error','Password not set or too short');
    }
  } catch(e) { setStatus('st-password','error','Password check failed'); }

  await sleep(400);

  // 5. Data integrity check
  try {
    const skillsOk = Array.isArray(DATA.skills) && DATA.skills.length > 0;
    const projectsOk = Array.isArray(DATA.projects) && DATA.projects.length > 0;
    const eduOk = Array.isArray(DATA.education) && DATA.education.length > 0;
    if (skillsOk && projectsOk && eduOk) {
      setStatus('st-data','ok',`${DATA.skills.length} skills, ${DATA.projects.length} projects, ${DATA.education.length} education entries`);
    } else {
      setStatus('st-data','warn','Some data arrays are empty');
    }
  } catch(e) { setStatus('st-data','error','Data integrity check failed'); }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ===== ADMIN PANEL ===== */
document.getElementById('openAdmin').addEventListener('click', openAdmin);

function openAdmin() {
  document.getElementById('adminOverlay').classList.add('show');
  document.getElementById('adminPanel').classList.add('open');
  document.body.style.overflow='hidden';
}

function closeAdmin() {
  document.getElementById('adminOverlay').classList.remove('show');
  document.getElementById('adminPanel').classList.remove('open');
  document.body.style.overflow='';
}

async function checkAdminPassword() {
  const input = document.getElementById('adminPassword');
  const hashed = await hashPassword(input.value);
  const isDefaultPassword = input.value === DEFAULT_ADMIN_PASSWORD;
  if(hashed === DATA.adminPass || isDefaultPassword) {
    if (isDefaultPassword && DATA.adminPass !== DEFAULT_ADMIN_PASS_HASH) {
      DATA.adminPass = DEFAULT_ADMIN_PASS_HASH;
      saveData();
    }
    document.getElementById('adminLogin').style.display='none';
    document.getElementById('adminDash').style.display='block';
    renderAdminSkills();
    renderAdminProjects();
    renderAdminEdu();
    // Restore social link inputs
    applyStoredContent();
    showToast('✅ Welcome back, Varun!');
  } else {
    input.style.borderColor='var(--danger)';
    input.placeholder='Wrong password! Try again';
    input.value='';
    setTimeout(() => { input.style.borderColor=''; input.placeholder='Enter password'; }, 2000);
  }
}

function switchTab(btn, tabId) {
  document.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.tab-content').forEach(t => t.style.display='none');
  document.getElementById(tabId).style.display='flex';
}

/* ===== LIVE UPDATE ===== */
function liveUpdate(id, value) {
  const el = document.getElementById(id);
  if(el) el.textContent = value;
}

function updateCSSVar(varName, value) {
  document.documentElement.style.setProperty(varName, value);
}

/* ===== ADMIN SKILLS ===== */
function renderAdminSkills() {
  const container = document.getElementById('skillsEditor');
  container.innerHTML = DATA.skills.map((s,i) => `
    <div class="skill-editor-item" id="skill-item-${i}">
      <span>${s.icon}</span>
      <span class="editor-name">${s.name}</span>
      <span class="editor-pct">${s.pct}%</span>
      <button class="edit-btn" onclick="editSkill(${i})" title="Edit">✏️</button>
      <button class="del-btn" onclick="deleteSkill(${i})" title="Delete">🗑</button>
    </div>
    <div class="edit-form-inline" id="skill-edit-${i}" style="display:none">
      <input type="text" id="es-name-${i}" value="${s.name}" placeholder="Skill name" />
      <input type="text" id="es-icon-${i}" value="${s.icon}" placeholder="Emoji" />
      <input type="number" id="es-pct-${i}" value="${s.pct}" placeholder="%" min="0" max="100" />
      <input type="text" id="es-color-${i}" value="${s.color}" placeholder="Color" />
      <div style="display:flex;gap:.5rem">
        <button class="btn-primary" onclick="saveSkillEdit(${i})" style="flex:1">💾 Save</button>
        <button class="btn-secondary" onclick="cancelSkillEdit(${i})" style="flex:1">✕ Cancel</button>
      </div>
    </div>
  `).join('');
}

function editSkill(i) {
  document.querySelectorAll('.edit-form-inline').forEach(f => f.style.display='none');
  document.getElementById(`skill-edit-${i}`).style.display='flex';
}

function cancelSkillEdit(i) {
  document.getElementById(`skill-edit-${i}`).style.display='none';
}

function saveSkillEdit(i) {
  DATA.skills[i].name  = document.getElementById(`es-name-${i}`).value.trim() || DATA.skills[i].name;
  DATA.skills[i].icon  = document.getElementById(`es-icon-${i}`).value.trim() || DATA.skills[i].icon;
  DATA.skills[i].pct   = parseInt(document.getElementById(`es-pct-${i}`).value) || DATA.skills[i].pct;
  DATA.skills[i].color = document.getElementById(`es-color-${i}`).value.trim() || DATA.skills[i].color;
  saveData(); renderSkillIcons(); renderSkillBars(); renderAdminSkills();
  showToast('✅ Skill updated!');
}

function addSkill() {
  const name = document.getElementById('ns-name').value.trim();
  const icon = document.getElementById('ns-icon').value.trim() || '💡';
  const pct = parseInt(document.getElementById('ns-pct').value) || 70;
  const color = document.getElementById('ns-color').value.trim() || '#20b2aa';
  if(!name) { showToast('⚠️ Please enter skill name'); return; }
  DATA.skills.push({ name, icon, pct, color });
  saveData(); renderSkillIcons(); renderSkillBars(); renderAdminSkills();
  document.getElementById('ns-name').value=''; document.getElementById('ns-icon').value=''; document.getElementById('ns-pct').value=''; document.getElementById('ns-color').value='';
  showToast('✅ Skill added!');
}

function deleteSkill(i) {
  if(!confirm('Delete this skill?')) return;
  DATA.skills.splice(i,1);
  saveData(); renderSkillIcons(); renderSkillBars(); renderAdminSkills();
  showToast('🗑️ Skill removed');
}

/* ===== ADMIN PROJECTS ===== */
function renderAdminProjects() {
  const container = document.getElementById('projectsEditor');
  container.innerHTML = DATA.projects.map((p,i) => `
    <div class="project-editor-item" id="proj-item-${i}">
      <span>${p.emoji || '🚀'}</span>
      <span class="editor-name">${p.title}</span>
      <button class="edit-btn" onclick="editProject(${i})" title="Edit">✏️</button>
      <button class="del-btn" onclick="deleteProject(${i})" title="Delete">🗑</button>
    </div>
    <div class="edit-form-inline" id="proj-edit-${i}" style="display:none">
      <input type="text" id="ep-title-${i}" value="${p.title}" placeholder="Project Title" />
      <textarea id="ep-desc-${i}" placeholder="Description">${p.desc}</textarea>
      <input type="text" id="ep-tech-${i}" value="${p.tech.join(', ')}" placeholder="Tech stack (comma separated)" />
      <input type="text" id="ep-color-${i}" value="${p.color}" placeholder="Accent color" />
      <input type="url" id="ep-link-${i}" value="${p.link === '#' ? '' : p.link}" placeholder="Live URL (e.g. https://mysite.com)" />
      <input type="url" id="ep-github-${i}" value="${p.github === '#' ? '' : p.github}" placeholder="GitHub URL (e.g. https://github.com/user/repo)" />
      <label style="font-size:.82rem;color:var(--text2);margin-top:.4rem">🖼️ Project Image (optional)</label>
      ${p.image ? `<img src="${p.image}" style="width:100%;max-height:120px;object-fit:cover;border-radius:8px;margin-bottom:.4rem" />` : ''}
      <input type="file" id="ep-img-${i}" accept="image/*" style="font-size:.82rem" onchange="handleProjectImgUpload(this,${i})" />
      <div id="ep-img-preview-${i}" style="margin-top:.3rem"></div>
      <div style="display:flex;gap:.5rem">
        <button class="btn-primary" onclick="saveProjectEdit(${i})" style="flex:1">💾 Save</button>
        <button class="btn-secondary" onclick="cancelProjectEdit(${i})" style="flex:1">✕ Cancel</button>
      </div>
    </div>
  `).join('');
}

function editProject(i) {
  document.querySelectorAll('.edit-form-inline').forEach(f => f.style.display='none');
  document.getElementById(`proj-edit-${i}`).style.display='flex';
}

function cancelProjectEdit(i) {
  document.getElementById(`proj-edit-${i}`).style.display='none';
}

function saveProjectEdit(i) {
  const title = document.getElementById(`ep-title-${i}`).value.trim();
  const desc  = document.getElementById(`ep-desc-${i}`).value.trim();
  const tech  = document.getElementById(`ep-tech-${i}`).value.split(',').map(t=>t.trim()).filter(Boolean);
  const color = document.getElementById(`ep-color-${i}`).value.trim();
  const link  = normalizeUrl(document.getElementById(`ep-link-${i}`).value.trim());
  const github= normalizeUrl(document.getElementById(`ep-github-${i}`).value.trim());
  if(title) DATA.projects[i].title = title;
  if(desc)  DATA.projects[i].desc  = desc;
  if(tech.length) DATA.projects[i].tech = tech;
  if(color) DATA.projects[i].color = color;
  DATA.projects[i].link   = link;
  DATA.projects[i].github = github;
  // Save image if new one was picked
  const imgInput = document.getElementById(`ep-img-${i}`);
  if(imgInput && imgInput._base64) DATA.projects[i].image = imgInput._base64;
  saveData(); initProjects(); renderAdminProjects();
  showToast('✅ Project updated!');
}

function addProject() {
  const title = document.getElementById('np-title').value.trim();
  const desc = document.getElementById('np-desc').value.trim();
  const tech = document.getElementById('np-tech').value.split(',').map(t=>t.trim()).filter(Boolean);
  const color = document.getElementById('np-color').value.trim() || '#20b2aa';
  const link = document.getElementById('np-link').value.trim() || '#';
  const github = document.getElementById('np-github').value.trim() || '#';
  const imgInput = document.getElementById('np-img');
  const image = (imgInput && imgInput._base64) ? imgInput._base64 : '';
  if(!title) { showToast('⚠️ Please enter project title'); return; }
  DATA.projects.push({ title, desc, tech, color, emoji:'🚀', link, github, image });
  saveData(); initProjects(); renderAdminProjects();
  document.getElementById('np-title').value=''; document.getElementById('np-desc').value=''; document.getElementById('np-tech').value='';
  if(imgInput) { imgInput.value=''; imgInput._base64=null; }
  document.getElementById('np-img-preview').innerHTML='';
  showToast('✅ Project added!');
}

/* ===== IMAGE UPLOAD HANDLER ===== */
function handleProjectImgUpload(input, idx) {
  const file = input.files[0];
  if(!file) return;
  if(file.size > 2*1024*1024) { showToast('⚠️ Image too large (max 2MB)'); input.value=''; return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    input._base64 = e.target.result;
    const previewId = (idx !== undefined) ? `ep-img-preview-${idx}` : 'np-img-preview';
    const preview = document.getElementById(previewId);
    if(preview) preview.innerHTML = `<img src="${e.target.result}" style="width:100%;max-height:120px;object-fit:cover;border-radius:8px;margin-top:.3rem" />`;
  };
  reader.readAsDataURL(file);
}

function deleteProject(i) {
  if(!confirm('Delete this project?')) return;
  DATA.projects.splice(i,1);
  saveData(); initProjects(); renderAdminProjects();
  showToast('🗑️ Project removed');
}

/* ===== ADMIN EDUCATION ===== */
function renderAdminEdu() {
  const container = document.getElementById('eduEditor');
  container.innerHTML = DATA.education.map((e,i) => `
    <div class="edu-editor-item" id="edu-item-${i}">
      <span>${e.icon}</span>
      <span class="editor-name">${e.title}</span>
      <span class="editor-pct">${e.year}</span>
      <button class="edit-btn" onclick="editEdu(${i})" title="Edit">✏️</button>
      <button class="del-btn" onclick="deleteEdu(${i})" title="Delete">🗑</button>
    </div>
    <div class="edit-form-inline" id="edu-edit-${i}" style="display:none">
      <input type="text" id="ee-title-${i}" value="${e.title}" placeholder="Degree / Course" />
      <input type="text" id="ee-inst-${i}" value="${e.inst}" placeholder="Institution" />
      <input type="text" id="ee-year-${i}" value="${e.year}" placeholder="Year" />
      <input type="text" id="ee-icon-${i}" value="${e.icon}" placeholder="Icon emoji" />
      <div style="display:flex;gap:.5rem">
        <button class="btn-primary" onclick="saveEduEdit(${i})" style="flex:1">💾 Save</button>
        <button class="btn-secondary" onclick="cancelEduEdit(${i})" style="flex:1">✕ Cancel</button>
      </div>
    </div>
  `).join('');
}

function editEdu(i) {
  document.querySelectorAll('.edit-form-inline').forEach(f => f.style.display='none');
  document.getElementById(`edu-edit-${i}`).style.display='flex';
}

function cancelEduEdit(i) {
  document.getElementById(`edu-edit-${i}`).style.display='none';
}

function saveEduEdit(i) {
  DATA.education[i].title = document.getElementById(`ee-title-${i}`).value.trim() || DATA.education[i].title;
  DATA.education[i].inst  = document.getElementById(`ee-inst-${i}`).value.trim();
  DATA.education[i].year  = document.getElementById(`ee-year-${i}`).value.trim() || DATA.education[i].year;
  DATA.education[i].icon  = document.getElementById(`ee-icon-${i}`).value.trim() || DATA.education[i].icon;
  saveData(); initTimeline(); renderAdminEdu();
  showToast('✅ Education updated!');
}

function addEdu() {
  const title = document.getElementById('ne-title').value.trim();
  const inst = document.getElementById('ne-inst').value.trim();
  const year = document.getElementById('ne-year').value.trim();
  const icon = document.getElementById('ne-icon').value.trim() || '🎓';
  if(!title) { showToast('⚠️ Please enter title'); return; }
  DATA.education.unshift({ title, inst, year, icon });
  saveData(); initTimeline(); renderAdminEdu();
  document.getElementById('ne-title').value=''; document.getElementById('ne-inst').value=''; document.getElementById('ne-year').value='';
  showToast('✅ Education entry added!');
}

function deleteEdu(i) {
  if(!confirm('Delete this entry?')) return;
  DATA.education.splice(i,1);
  saveData(); initTimeline(); renderAdminEdu();
  showToast('🗑️ Entry removed');
}

/* ===== PASSWORD ===== */
async function changePassword() {
  const newPass = document.getElementById('a-newpass').value.trim();
  if(!newPass || newPass.length < 6) { showToast('⚠️ Password must be 6+ characters'); return; }
  DATA.adminPass = await hashPassword(newPass);
  saveData();
  document.getElementById('a-newpass').value='';
  showToast('🔒 Password updated!');
}

/* ===== EXPORT ===== */
function exportData() {
  // Use DB layer export if available (gives richer JSON)
  if (typeof DB !== 'undefined') {
    DB.exportJSON();
    showToast('📤 Data exported via DB!');
    return;
  }
  const blob = new Blob([JSON.stringify(DATA, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'varun_portfolio_data.json';
  a.click();
  showToast('📤 Data exported!');
}

/* ===== RESET ===== */
function resetAll() {
  if(!confirm('Reset all data? This cannot be undone!')) return;
  localStorage.removeItem('varun_portfolio_data');
  location.reload();
}

/* ===== TOAST ===== */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ===== SAVE PROFILE ===== */

/* ===== SOCIAL LINKS ===== */
function updateSocialLink(id, value, persist = true) {
  const el = document.getElementById(id);
  if (!el) return;
  const url = normalizeUrl(value.trim());
  el.href = url;
  if (isValidUrl(value.trim())) {
    el.style.opacity = '1';
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  } else {
    el.style.opacity = '0.5';
    el.removeAttribute('target');
  }
  // Persist
  if (!persist) return;
  DATA.contact = DATA.contact || {};
  if(id === 'githubLink')   { DATA.contact.github   = value.trim(); DATA.github = value.trim(); saveData(); }
  if(id === 'linkedinLink') { DATA.contact.linkedin = value.trim(); DATA.linkedin = value.trim(); saveData(); }
  if(id === 'twitterLink')  { DATA.contact.twitter  = value.trim(); DATA.twitter = value.trim(); saveData(); }
}

/* ===== SMART URL NAVIGATION ===== */
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    // Internal section scroll
    if (href && href.startsWith('#') && href.length > 1) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
      return;
    }
    // Bare '#' — do nothing
    if (href === '#') {
      e.preventDefault();
      return;
    }
    // External URL — validate before opening
    if (link.getAttribute('target') === '_blank') {
      const url = normalizeUrl(href);
      if (!isValidUrl(url)) {
        e.preventDefault();
        showToast('⚠️ URL not set. Update in Admin Panel ⚙️');
      } else {
        link.href = url;
      }
    }
  });
});

/* ===== PERSIST ADMIN PROFILE/CONTACT EDITS ===== */
function saveProfile() {
  DATA.profile = {
    ...(DATA.profile || {}),
    firstName: document.getElementById('a-fname').value.trim() || 'Varun',
    lastName: document.getElementById('a-lname').value.trim() || 'Saxena',
    role: document.getElementById('a-role').value.trim(),
    heroDesc: document.getElementById('a-desc').value.trim(),
    about1: document.getElementById('a-about1').value.trim(),
    about2: document.getElementById('a-about2').value.trim(),
    location: document.getElementById('a-location').value.trim(),
    education: document.getElementById('a-edu').value.trim(),
    status: document.getElementById('a-status').value.trim()
  };
  saveData();
  applyStoredContent();
  showToast('✅ Profile saved successfully!' + cloudSaveSuffix());
}

function saveContact() {
  DATA.contact = {
    ...(DATA.contact || {}),
    email: document.getElementById('a-email').value.trim(),
    phone: document.getElementById('a-phone').value.trim(),
    location: document.getElementById('a-cloc').value.trim(),
    github: document.getElementById('a-github').value.trim(),
    linkedin: document.getElementById('a-linkedin').value.trim(),
    twitter: document.getElementById('a-twitter').value.trim()
  };
  saveData();
  applyStoredContent();
  showToast('✅ Contact info saved!' + cloudSaveSuffix());
}
