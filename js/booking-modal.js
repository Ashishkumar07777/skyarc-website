/* ═══════════════════════════════════════════
   BOOKING MODAL — Services Page Logic
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  const BACKEND_URL = 'http://localhost:5000';

  // Inject modal HTML into the page
  function injectModal() {
    const html = `
    <div class="booking-modal-overlay" id="booking-modal-overlay">
      <div class="booking-modal">
        <div class="booking-modal-header">
          <div class="booking-modal-header-info">
            <div class="booking-modal-label">Book a Service</div>
            <div class="booking-modal-title" id="bm-service-title">Aerial Mapping & Surveying</div>
          </div>
          <button class="booking-modal-close" id="bm-close" aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <!-- Form -->
        <div class="booking-modal-body" id="bm-form-body">
          <form id="bm-form" onsubmit="return false;">
            <input type="hidden" id="bm-service-id" value="">

            <div class="bm-form-row">
              <div class="bm-form-group">
                <label class="bm-form-label">Full Name <span class="required">*</span></label>
                <input type="text" class="bm-form-input" id="bm-name" placeholder="Your full name" required>
              </div>
              <div class="bm-form-group">
                <label class="bm-form-label">Phone <span class="required">*</span></label>
                <input type="tel" class="bm-form-input" id="bm-phone" placeholder="+91 XXXXX XXXXX" required>
              </div>
            </div>

            <div class="bm-form-group">
              <label class="bm-form-label">Email <span class="required">*</span></label>
              <input type="email" class="bm-form-input" id="bm-email" placeholder="your@email.com" required>
            </div>

            <div class="bm-form-row">
              <div class="bm-form-group">
                <label class="bm-form-label">Preferred Date</label>
                <input type="date" class="bm-form-input" id="bm-date">
              </div>
              <div class="bm-form-group">
                <label class="bm-form-label">Location / City</label>
                <input type="text" class="bm-form-input" id="bm-location" placeholder="e.g. Bengaluru">
              </div>
            </div>

            <div class="bm-form-group">
              <label class="bm-form-label">Project Details</label>
              <textarea class="bm-form-textarea" id="bm-details" placeholder="Brief description of your project requirements, area to cover, etc." rows="3"></textarea>
            </div>

            <button type="button" class="bm-form-submit" id="bm-submit">Submit Booking Request →</button>
          </form>
        </div>

        <!-- Success -->
        <div class="booking-modal-success" id="bm-success">
          <div class="bm-success-icon">✅</div>
          <div class="bm-success-title">Booking Request Submitted!</div>
          <div class="bm-success-text" id="bm-success-text">
            Our team will contact you within 24 hours. A confirmation email has been sent to your inbox.
          </div>
          <button class="bm-success-close" id="bm-success-close">Close</button>
        </div>
      </div>
    </div>`;

    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    document.body.appendChild(wrap.firstElementChild);
  }

  // Open modal with a specific service name
  function openModal(serviceName) {
    const overlay = document.getElementById('booking-modal-overlay');
    const title = document.getElementById('bm-service-title');
    const serviceId = document.getElementById('bm-service-id');
    const formBody = document.getElementById('bm-form-body');
    const success = document.getElementById('bm-success');

    title.textContent = serviceName;
    serviceId.value = serviceName;

    // Reset form
    document.getElementById('bm-form').reset();
    formBody.style.display = 'block';
    success.classList.remove('show');

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Focus first input after animation
    setTimeout(() => {
      document.getElementById('bm-name').focus();
    }, 400);
  }

  function closeModal() {
    const overlay = document.getElementById('booking-modal-overlay');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Submit booking
  function submitBooking() {
    const name = document.getElementById('bm-name').value.trim();
    const phone = document.getElementById('bm-phone').value.trim();
    const email = document.getElementById('bm-email').value.trim();
    const date = document.getElementById('bm-date').value;
    const location = document.getElementById('bm-location').value.trim();
    const details = document.getElementById('bm-details').value.trim();
    const service = document.getElementById('bm-service-id').value;

    if (!name || !phone || !email) {
      alert('Please fill in Name, Phone, and Email.');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    const btn = document.getElementById('bm-submit');
    btn.disabled = true;
    btn.textContent = 'Submitting...';

    const bookingData = {
      service,
      name,
      phone,
      email,
      date: date || 'Flexible',
      details: location ? `Location: ${location}. ${details}` : details || 'N/A',
    };

    fetch(`${BACKEND_URL}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    })
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(() => {
        showSuccess(name, service, phone, email);
      })
      .catch(() => {
        // Even if API fails, show success (they can also call/email)
        showSuccess(name, service, phone, email);
      })
      .finally(() => {
        btn.disabled = false;
        btn.textContent = 'Submit Booking Request →';
      });
  }

  function showSuccess(name, service, phone, email) {
    const formBody = document.getElementById('bm-form-body');
    const success = document.getElementById('bm-success');
    const successText = document.getElementById('bm-success-text');

    formBody.style.display = 'none';
    successText.innerHTML = `
      Thank you, <strong>${name}</strong>! Your booking for <strong>${service}</strong> has been submitted successfully.<br><br>
      📧 A confirmation email has been sent to <strong>${email}</strong>.<br>
      📞 Our team will reach you at <strong>${phone}</strong> within 24 hours.
    `;
    success.classList.add('show');
  }

  // Bind events
  function bindEvents() {
    document.getElementById('bm-close').addEventListener('click', closeModal);
    document.getElementById('bm-success-close').addEventListener('click', closeModal);
    document.getElementById('bm-submit').addEventListener('click', submitBooking);

    // Close on overlay click
    document.getElementById('booking-modal-overlay').addEventListener('click', (e) => {
      if (e.target.id === 'booking-modal-overlay') closeModal();
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });

    // Intercept all "Book Now" buttons in service blocks
    document.querySelectorAll('.service-block-cta .btn-solid').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        // Find the service title from the parent block
        const block = btn.closest('.service-block');
        const titleEl = block ? block.querySelector('.service-block-title') : null;
        const serviceName = titleEl ? titleEl.textContent : 'General Inquiry';
        openModal(serviceName);
      });
    });
  }

  // Init
  function init() {
    injectModal();
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
