/* ============================================================
   CAREERS.JS — Accordion & Form handling
   ============================================================ */

// ── Job accordion toggle ──
function toggleJob(header) {
  const item = header.closest('.job-item');
  const wasActive = item.classList.contains('active');

  // Close all in same list
  const list = item.closest('.job-list');
  if (list) {
    list.querySelectorAll('.job-item.active').forEach(active => {
      active.classList.remove('active');
    });
  }

  // Toggle clicked
  if (!wasActive) {
    item.classList.add('active');
  }
}

// ── File upload display ──
(function() {
  'use strict';

  const fileInput = document.getElementById('resume');
  const fileNameDisplay = document.getElementById('file-name');
  const fileUpload = document.getElementById('file-upload');

  if (fileInput && fileNameDisplay) {
    fileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        const fileSize = (e.target.files[0].size / 1024 / 1024).toFixed(2);
        fileNameDisplay.textContent = `📎 ${fileName} (${fileSize} MB)`;
        fileNameDisplay.classList.add('active');
        fileUpload.style.borderColor = 'rgba(0, 102, 255, 0.4)';
      } else {
        fileNameDisplay.classList.remove('active');
        fileUpload.style.borderColor = '';
      }
    });

    // Drag and drop visual
    if (fileUpload) {
      fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.style.borderColor = 'var(--color-accent-blue)';
        fileUpload.style.background = 'rgba(0, 102, 255, 0.04)';
      });

      fileUpload.addEventListener('dragleave', () => {
        fileUpload.style.borderColor = '';
        fileUpload.style.background = '';
      });

      fileUpload.addEventListener('drop', () => {
        fileUpload.style.borderColor = '';
        fileUpload.style.background = '';
      });
    }
  }
})();

// ── Form submission ──
async function handleFormSubmit(event) {
  event.preventDefault();

  const form = document.getElementById('apply-form');
  const successMsg = document.getElementById('form-success');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (form && successMsg) {
    const originalBtnContent = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>Submitting...</span>';
    submitBtn.disabled = true;

    try {
      const formData = new FormData(form);
      const positionSelect = document.getElementById('position');
      const selectedOption = positionSelect.options[positionSelect.selectedIndex];
      const optGroup = selectedOption.parentNode;
      const applicationType = optGroup.label === 'Internships' ? 'internship' : 'career';
      formData.append('applicationType', applicationType);

      const API_ENDPOINT = 'https://skyarc-backend.onrender.com/api/applications/submit';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Animate out form
        form.style.opacity = '0';
        form.style.transform = 'translateY(-10px)';
        form.style.transition = 'all 0.4s ease';

        setTimeout(() => {
          form.style.display = 'none';
          successMsg.classList.add('active');
          successMsg.style.animation = 'fadeInUp 0.6s ease forwards';
        }, 400);
        form.reset();
        
        // Reset file name display
        const fileNameDisplay = document.getElementById('file-name');
        if (fileNameDisplay) {
          fileNameDisplay.textContent = '';
          fileNameDisplay.classList.remove('active');
        }
      } else {
        alert('❌ Error: ' + (data.message || 'Failed to submit application.'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to submit. Please try again or check your connection.');
    } finally {
      submitBtn.innerHTML = originalBtnContent;
      submitBtn.disabled = false;
    }
  }
}
