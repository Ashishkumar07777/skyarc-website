/* ═══════════════════════════════════════════
   SKYARC CHATBOT — AI Assistant Engine
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const BACKEND_URL = 'http://localhost:5000';

  // ── Knowledge Base ──
  const FAQ = [
    { keys: ['hello','hi','hey','hola','greetings'], answer: 'Hello! 👋 Welcome to SkyArc Technologies. I can help you with:\n\n• Booking a drone service\n• Learning about our services\n• Company information\n• Career opportunities\n\nHow can I help you today?', quick: ['Book a Service','Our Services','About SkyArc','Careers'] },
    { keys: ['service','services','what do you do','offer','solutions','capabilities'], answer: 'SkyArc Technologies offers 9 specialized drone services across India:', showServices: true },
    { keys: ['aerial mapping','mapping','survey','surveying','orthomosaic','topograph'], answer: '🗺️ **Aerial Mapping & Surveying**\n\nHigh-fidelity photogrammetry with sub-centimeter accuracy.\n• Orthomosaic Generation\n• Volumetric Analysis\n• Cadastral Surveying\n\nWant to book this service?', quick: ['Book Aerial Mapping','Other Services','Back to Menu'] },
    { keys: ['inspection','monitoring','structural','bridge','chimney'], answer: '🔍 **Inspection & Monitoring**\n\nAutonomous structural health monitoring with AI-driven defect detection.\n• Bridge Integrity Analysis\n• Industrial Chimney Scans\n• 4K Real-time Live Stream\n\nWant to book this service?', quick: ['Book Inspection','Other Services','Back to Menu'] },
    { keys: ['agriculture','crop','farming','ndvi','spray','irrigation'], answer: '🌾 **Agriculture & Crop Health**\n\nNDVI multispectral imaging for precision farming.\n• Multispectral Indexing\n• Precision Crop Spraying\n• Irrigation Management\n\nWant to book this service?', quick: ['Book Agriculture','Other Services','Back to Menu'] },
    { keys: ['defence','defense','surveillance','military','border','security','isr'], answer: '🛡️ **Defence Monitoring & Surveillance**\n\nStealth-profile drones for persistent ISR operations.\n• Border Patrol Automation\n• Night-Vision Intelligence\n• Object Tracking AI\n\nWant to book this service?', quick: ['Book Defence','Other Services','Back to Menu'] },
    { keys: ['thermal','lidar','heat','point cloud','energy','forest'], answer: '🌡️ **Thermal & LiDAR Surveys**\n\nPenetrating vegetation and night-time barriers.\n• Forest Floor Mapping\n• Heat Loss Diagnostics\n• Power Line Clearance\n\nWant to book this service?', quick: ['Book Thermal/LiDAR','Other Services','Back to Menu'] },
    { keys: ['construction','infrastructure','bim','progress','site'], answer: '🏗️ **Construction & Infrastructure**\n\nWeekly site progress with BIM-compatible models.\n• BIM Integration\n• Progress Time-lapses\n• Safety Compliance Checks\n\nWant to book this service?', quick: ['Book Construction','Other Services','Back to Menu'] },
    { keys: ['media','marketing','film','cinematic','fpv','video','photo','8k'], answer: '🎬 **Media & Marketing**\n\nBreathtaking 8K cinematic drone footage.\n• Cinematic 8K ProRes\n• High-Speed FPV Racing\n• Live Event Broadcasting\n\nWant to book this service?', quick: ['Book Media','Other Services','Back to Menu'] },
    { keys: ['solar','panel','pv','hotspot','photovoltaic'], answer: '☀️ **Solar Panel Inspection**\n\nAutomated detection of malfunctioning cells.\n• Hotspot Detection\n• Soiling Analysis\n• PV Plant Mapping\n\nWant to book this service?', quick: ['Book Solar','Other Services','Back to Menu'] },
    { keys: ['r&d','training','consultancy','pilot certification','dgca','custom','fleet'], answer: '🔬 **R&D, Training & Consultancy**\n\nCustom drone engineering and enterprise pilot certification.\n• Custom Payload Integration\n• DGCA Pilot Certification\n• Fleet Management Software\n\nWant to book this service?', quick: ['Book R&D/Training','Other Services','Back to Menu'] },
    { keys: ['about','company','who are you','skyarc','founded','story'], answer: '🏢 **About SkyArc Technologies LLP**\n\nFounded in Bengaluru, SkyArc began with a mission to build drone solutions engineered for India\'s extreme topography.\n\n• 5+ Years of Experience\n• 500+ Projects Completed\n• 12+ Industries Served\n• 50,000+ Acres Surveyed\n• Pan-India Operations across 10+ states\n\nOur founders — aerospace engineers and data scientists — built a proprietary flight controller handling everything from the Himalayas to the Western Ghats.', quick: ['Our Services','Book a Service','Contact Info'] },
    { keys: ['contact','phone','email','address','location','reach','call'], answer: '📍 **Contact SkyArc Technologies**\n\n**Address:** Khata No 10, RAJ SERENITY, Begur-Koppa Rd, Akshayanagar, Bengaluru 560068\n\n📞 **Phone:** +91 9133846685\n📧 **Email:** info@skyarctech.com\n\n🔗 [Instagram](https://www.instagram.com/skyarc_technologies_llp/) | [LinkedIn](https://www.linkedin.com/company/skyarc-technologies-llp/)', quick: ['Book a Service','Our Services','Back to Menu'] },
    { keys: ['career','job','internship','hiring','work','join','opening','vacancy','apply'], answer: '🚀 **Careers at SkyArc**\n\n**Open Positions:**\n• UAS Engineer (Hardware & Payloads)\n• Certified Drone Pilot (DGCA Licensed)\n• GIS & Remote Sensing Specialist\n• AI/ML Developer (Drone Analytics)\n• Business Development Manager\n\n**Internships (3-6 months):**\n• Drone Pilot Intern\n• GIS & Data Analyst Intern\n• Engineering Intern (Design)\n• Business & Marketing Intern\n\n👉 Apply at our [Careers Page](careers.html)', quick: ['Book a Service','About SkyArc','Contact Info'] },
    { keys: ['price','cost','pricing','rate','charge','fee','quote','budget','how much'], answer: '💰 **Pricing Information**\n\nOur pricing varies based on:\n• Type of service\n• Area/acreage to cover\n• Duration & complexity\n• Location & accessibility\n\nFor a personalized quote, I can help you book a free consultation right now!', quick: ['Book a Service','Contact Info','Our Services'] },
    { keys: ['thank','thanks','thx','ty','great','awesome','perfect','ok','okay'], answer: 'You\'re welcome! 😊 Is there anything else I can help you with?', quick: ['Book a Service','Our Services','Contact Info'] },
    { keys: ['bye','goodbye','see you','exit','close','end'], answer: 'Thank you for chatting with SkyArc Technologies! 🛸 Feel free to reach out anytime. Have a great day! ✨', quick: [] },
    { keys: ['book','booking','schedule','consultation','appointment','demo','enquiry','inquiry','request'], answer: 'Great! Let\'s get your service booked. 🚀\n\nPlease select the service you\'d like to book:', showBookingServices: true },
  ];

  const SERVICE_LIST = [
    { id: 'aerial-mapping', icon: '🗺️', name: 'Aerial Mapping' },
    { id: 'inspection', icon: '🔍', name: 'Inspection' },
    { id: 'agriculture', icon: '🌾', name: 'Agriculture' },
    { id: 'defence', icon: '🛡️', name: 'Defence' },
    { id: 'thermal-lidar', icon: '🌡️', name: 'Thermal/LiDAR' },
    { id: 'construction', icon: '🏗️', name: 'Construction' },
    { id: 'media', icon: '🎬', name: 'Media' },
    { id: 'solar', icon: '☀️', name: 'Solar Inspection' },
    { id: 'rnd', icon: '🔬', name: 'R&D/Training' },
  ];

  // ── State ──
  let isOpen = false;
  let bookingState = null; // null | { step, data }

  // ── Inject HTML ──
  function injectChatbot() {
    const html = `
      <button class="chatbot-toggle" id="chatbot-toggle" aria-label="Open chat">
        <img class="cb-icon-chat" src="assets/logo-bird.png" alt="SkyArc" style="width:32px;height:32px;object-fit:contain;">
        <svg class="cb-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        <span class="chatbot-badge" id="chatbot-badge">1</span>
      </button>
      <div class="chatbot-window" id="chatbot-window">
        <div class="chatbot-header">
          <div class="chatbot-header-avatar">
            <img src="assets/logo-bird.png" alt="SkyArc" style="width:24px;height:24px;object-fit:contain;">
          </div>
          <div class="chatbot-header-info">
            <div class="chatbot-header-name">SkyArc Assistant</div>
            <div class="chatbot-header-status">Online</div>
          </div>
          <button class="chatbot-header-close" id="chatbot-close" aria-label="Close chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div class="chatbot-messages" id="chatbot-messages"></div>
        <div class="chatbot-input-area">
          <input type="text" class="chatbot-input" id="chatbot-input" placeholder="Type a message..." autocomplete="off">
          <button class="chatbot-send" id="chatbot-send" aria-label="Send">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div class="chatbot-powered">Powered by SkyArc Technologies LLP</div>
      </div>`;
    const wrap = document.createElement('div');
    wrap.id = 'skyarc-chatbot';
    wrap.innerHTML = html;
    document.body.appendChild(wrap);
  }

  // ── DOM Refs ──
  function refs() {
    return {
      toggle: document.getElementById('chatbot-toggle'),
      window: document.getElementById('chatbot-window'),
      close: document.getElementById('chatbot-close'),
      messages: document.getElementById('chatbot-messages'),
      input: document.getElementById('chatbot-input'),
      send: document.getElementById('chatbot-send'),
      badge: document.getElementById('chatbot-badge'),
    };
  }

  // ── Helpers ──
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function formatText(text) {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  }

  function scrollBottom(el) {
    setTimeout(() => { el.scrollTop = el.scrollHeight; }, 60);
  }

  // ── Render Messages ──
  function addBotMsg(text, extras) {
    const r = refs();
    const div = document.createElement('div');
    div.className = 'cb-msg bot';
    let html = `<div class="cb-msg-avatar"><img src="assets/logo-bird.png" alt="SkyArc" style="width:20px;height:20px;object-fit:contain;"></div>`;
    html += `<div><div class="cb-msg-bubble">${formatText(text)}</div>`;
    if (extras) html += extras;
    html += `<div class="cb-msg-time">${getTime()}</div></div>`;
    div.innerHTML = html;
    r.messages.appendChild(div);
    scrollBottom(r.messages);
  }

  function addUserMsg(text) {
    const r = refs();
    const div = document.createElement('div');
    div.className = 'cb-msg user';
    div.innerHTML = `<div class="cb-msg-avatar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
      <div><div class="cb-msg-bubble">${formatText(text)}</div><div class="cb-msg-time">${getTime()}</div></div>`;
    r.messages.appendChild(div);
    scrollBottom(r.messages);
  }

  function showTyping() {
    const r = refs();
    const div = document.createElement('div');
    div.className = 'cb-typing';
    div.id = 'cb-typing';
    div.innerHTML = `<div class="cb-msg-avatar"><img src="assets/logo-bird.png" alt="SkyArc" style="width:20px;height:20px;object-fit:contain;"></div>
      <div class="cb-typing-bubble"><div class="cb-typing-dot"></div><div class="cb-typing-dot"></div><div class="cb-typing-dot"></div></div>`;
    r.messages.appendChild(div);
    scrollBottom(r.messages);
  }

  function hideTyping() {
    const el = document.getElementById('cb-typing');
    if (el) el.remove();
  }

  function addQuickReplies(options) {
    if (!options || !options.length) return;
    const r = refs();
    const div = document.createElement('div');
    div.className = 'cb-quick-replies';
    div.id = 'cb-quick-active';
    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'cb-quick-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => {
        removeQuickReplies();
        handleUserInput(opt);
      });
      div.appendChild(btn);
    });
    r.messages.appendChild(div);
    scrollBottom(r.messages);
  }

  function removeQuickReplies() {
    const el = document.getElementById('cb-quick-active');
    if (el) el.remove();
  }

  function addServicesGrid() {
    let html = '<div class="cb-services-grid">';
    SERVICE_LIST.forEach(s => {
      html += `<div class="cb-service-card" data-service="${s.id}" onclick="window._cbSelectService('${s.id}','${s.name}')">
        <div class="cb-service-card-icon">${s.icon}</div>
        <div class="cb-service-card-name">${s.name}</div></div>`;
    });
    html += '</div>';
    return html;
  }

  function addBookingForm(serviceName) {
    const html = `<div class="cb-booking-card" id="cb-booking-form">
      <div class="cb-booking-card-title">📋 Book: ${serviceName}</div>
      <div class="cb-form-group"><label class="cb-form-label">Full Name *</label><input type="text" class="cb-form-input" id="cb-book-name" placeholder="Your full name" required></div>
      <div class="cb-form-group"><label class="cb-form-label">Phone *</label><input type="tel" class="cb-form-input" id="cb-book-phone" placeholder="+91 XXXXX XXXXX" required></div>
      <div class="cb-form-group"><label class="cb-form-label">Email *</label><input type="email" class="cb-form-input" id="cb-book-email" placeholder="your@email.com" required></div>
      <div class="cb-form-group"><label class="cb-form-label">Preferred Date</label><input type="date" class="cb-form-input" id="cb-book-date"></div>
      <div class="cb-form-group"><label class="cb-form-label">Project Details</label><textarea class="cb-form-textarea" id="cb-book-details" placeholder="Brief description of your project, location, area..." rows="3"></textarea></div>
      <button class="cb-booking-submit" onclick="window._cbSubmitBooking()">Submit Booking Request →</button>
    </div>`;
    return html;
  }

  // ── Global Handlers ──
  window._cbSelectService = function (id, name) {
    removeQuickReplies();
    addUserMsg(name);
    bookingState = { service: name, serviceId: id };
    showTyping();
    setTimeout(() => {
      hideTyping();
      addBotMsg(`Great choice! Please fill in your details below to book **${name}**:`, addBookingForm(name));
    }, 600);
  };

  window._cbSubmitBooking = function () {
    const name = document.getElementById('cb-book-name')?.value?.trim();
    const phone = document.getElementById('cb-book-phone')?.value?.trim();
    const email = document.getElementById('cb-book-email')?.value?.trim();
    const date = document.getElementById('cb-book-date')?.value;
    const details = document.getElementById('cb-book-details')?.value?.trim();

    if (!name || !phone || !email) {
      alert('Please fill in Name, Phone, and Email.');
      return;
    }

    const form = document.getElementById('cb-booking-form');
    if (form) form.remove();

    const booking = { service: bookingState?.service, name, phone, email, date: date || 'Flexible', details: details || 'N/A' };

    addUserMsg(`Booking: ${booking.service}\nName: ${name}\nPhone: ${phone}`);
    showTyping();

    // Try to send to backend
    fetch(`${BACKEND_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        hideTyping();
        const conf = `<div class="cb-confirmation">
          <div class="cb-confirmation-icon">✅</div>
          <div class="cb-confirmation-title">Booking Confirmed!</div>
          <div class="cb-confirmation-text">Your ${booking.service} consultation request has been submitted. Our team will contact you within 24 hours at ${phone}.</div></div>`;
        addBotMsg('Your booking has been submitted successfully! 🎉', conf);
        addQuickReplies(['Book Another Service', 'Our Services', 'Contact Info']);
        bookingState = null;
      })
      .catch(() => {
        hideTyping();
        const conf = `<div class="cb-confirmation">
          <div class="cb-confirmation-icon">✅</div>
          <div class="cb-confirmation-title">Request Received!</div>
          <div class="cb-confirmation-text">Service: ${booking.service}<br>Name: ${name}<br>Phone: ${phone}<br>Email: ${email}<br>Date: ${booking.date}<br><br>Please also email <strong>info@skyarctech.com</strong> or call <strong>+91 9133846685</strong> for faster response.</div></div>`;
        addBotMsg('Your booking request has been noted! 📝', conf);
        addQuickReplies(['Book Another Service', 'Our Services', 'Contact Info']);
        bookingState = null;
      });
  };

  // ── NLP Matching ──
  function findAnswer(input) {
    const lower = input.toLowerCase().replace(/[^a-z0-9\s&/]/g, '');

    // Check for service-specific booking phrases
    for (const s of SERVICE_LIST) {
      if (lower.includes('book') && lower.includes(s.name.toLowerCase().split('/')[0].split(' ')[0].toLowerCase())) {
        return { answer: `Let's book **${s.name}** for you! Please fill in the form:`, bookService: s };
      }
    }

    // Check FAQ
    let bestMatch = null;
    let bestScore = 0;
    for (const faq of FAQ) {
      let score = 0;
      for (const key of faq.keys) {
        if (lower.includes(key)) score += key.length;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }

    if (bestMatch && bestScore > 0) return bestMatch;

    return {
      answer: "I'm not sure I understand that. Let me help you with what I know best! 😊",
      quick: ['Our Services', 'Book a Service', 'About SkyArc', 'Contact Info', 'Careers'],
    };
  }

  // ── Handle Input ──
  function handleUserInput(text) {
    if (!text.trim()) return;
    addUserMsg(text);
    removeQuickReplies();
    showTyping();

    const delay = 500 + Math.random() * 600;

    // Menu shortcuts
    const lower = text.toLowerCase();
    if (lower === 'back to menu' || lower === 'menu') {
      setTimeout(() => {
        hideTyping();
        addBotMsg("Sure! How can I help you? 😊", '');
        addQuickReplies(['Book a Service', 'Our Services', 'About SkyArc', 'Contact Info', 'Careers']);
      }, delay);
      return;
    }

    if (lower === 'other services' || lower === 'our services') {
      setTimeout(() => {
        hideTyping();
        addBotMsg('Here are all our drone services. Tap one to learn more:', addServicesGrid());
      }, delay);
      return;
    }

    if (lower === 'book another service' || lower === 'book a service') {
      setTimeout(() => {
        hideTyping();
        addBotMsg('Which service would you like to book? 🚀', addServicesGrid());
      }, delay);
      return;
    }

    const result = findAnswer(text);

    setTimeout(() => {
      hideTyping();

      if (result.bookService) {
        addBotMsg(result.answer, addBookingForm(result.bookService.name));
        bookingState = { service: result.bookService.name, serviceId: result.bookService.id };
        return;
      }

      let extras = '';
      if (result.showServices) extras = addServicesGrid();
      if (result.showBookingServices) extras = addServicesGrid();

      addBotMsg(result.answer, extras);
      if (result.quick) addQuickReplies(result.quick);
    }, delay);
  }

  // ── Toggle Chat ──
  function toggleChat() {
    const r = refs();
    isOpen = !isOpen;
    r.toggle.classList.toggle('active', isOpen);
    r.window.classList.toggle('open', isOpen);
    if (isOpen) {
      r.badge.style.display = 'none';
      r.input.focus();
    }
  }

  // ── Init ──
  function init() {
    injectChatbot();
    const r = refs();

    r.toggle.addEventListener('click', toggleChat);
    r.close.addEventListener('click', toggleChat);

    r.send.addEventListener('click', () => {
      const val = r.input.value.trim();
      if (val) { handleUserInput(val); r.input.value = ''; }
    });

    r.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = r.input.value.trim();
        if (val) { handleUserInput(val); r.input.value = ''; }
      }
    });

    // Welcome message after short delay
    setTimeout(() => {
      addBotMsg(
        'Hello! 👋 I\'m the **SkyArc Assistant**.\n\nI can help you book drone services, answer questions about our company, or guide you through our solutions.\n\nWhat would you like to do?',
        ''
      );
      addQuickReplies(['Book a Service', 'Our Services', 'About SkyArc', 'Contact Info', 'Careers']);
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
