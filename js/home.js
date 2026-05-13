/* ============================================================
   HOME.JS — Scroll-linked Canvas Image Sequence Animation
   Apple-style drone explode/reassemble hero
   ============================================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const heroSection = document.getElementById('hero-sequence');
  const heroGlow = document.getElementById('hero-glow');

  // ── Configuration ──
  const TOTAL_FRAMES = 240;
  const FRAME_PATH = 'assets/frames/ezgif-frame-';

  // ── State ──
  const images = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let currentFrame = 0;
  let isResizing = false;

  // ── Build frame filename ──
  function getFramePath(index) {
    const num = String(index + 1).padStart(3, '0');
    return `${FRAME_PATH}${num}.jpg`;
  }

  // ── Set canvas size to match viewport ──
  function resizeCanvas() {
    if (isResizing) return;
    isResizing = true;

    // Use 1x DPR for performance
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    
    if (images[currentFrame] && images[currentFrame].complete) {
      drawFrame(currentFrame);
    }

    isResizing = false;
  }

  // ── Draw a frame on canvas ──
  function drawFrame(index) {
    if (!images[index] || !images[index].complete || !images[index].naturalWidth) return;

    const img = images[index];
    const cw = canvas.width;
    const ch = canvas.height;

    // Clear
    ctx.clearRect(0, 0, cw, ch);

    // Fill background to match site
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, cw, ch);

    // Cover fit the image with an additional scale to crop out edge watermarks
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = cw / ch;

    let drawW, drawH, drawX, drawY;
    const cropScale = 1.08; // Scales up by 8% to hide watermarks at the edges

    if (canvasRatio > imgRatio) {
      drawW = cw * cropScale;
      drawH = (cw / imgRatio) * cropScale;
    } else {
      drawH = ch * cropScale;
      drawW = (ch * imgRatio) * cropScale;
    }

    drawX = (cw - drawW) / 2;
    drawY = (ch - drawH) / 2;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // ── Preload frames (progressive priority loading) ──
  function preloadFrames() {
    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = getFramePath(0);
    firstImg.onload = () => {
      images[0] = firstImg;
      loadedCount++;
      resizeCanvas();
      drawFrame(0);

      // Load keyframes first (every 10th), then fill in rest
      loadKeyframes();
    };
    firstImg.onerror = () => {
      loadKeyframes();
    };
  }

  function loadKeyframes() {
    // Phase 1: Load every 10th frame for quick scrubbing
    const keyframes = [];
    for (let i = 0; i < TOTAL_FRAMES; i += 10) {
      if (!images[i]) keyframes.push(i);
    }

    let idx = 0;
    const CONCURRENT = 4;

    function loadKeyframe() {
      if (idx >= keyframes.length) {
        // Phase 2: load all remaining frames lazily
        loadRemainingFrames();
        return;
      }

      const frameIdx = keyframes[idx++];
      const img = new Image();
      img.src = getFramePath(frameIdx);
      img.onload = () => {
        images[frameIdx] = img;
        loadedCount++;
        loadKeyframe();
      };
      img.onerror = loadKeyframe;
    }

    for (let i = 0; i < CONCURRENT; i++) loadKeyframe();
  }

  function loadRemainingFrames() {
    let loadIndex = 1;
    const CONCURRENT = 3;

    function loadNext() {
      // Find next unloaded frame
      while (loadIndex < TOTAL_FRAMES && images[loadIndex]) loadIndex++;
      if (loadIndex >= TOTAL_FRAMES) return;

      const idx = loadIndex++;
      const img = new Image();
      img.src = getFramePath(idx);
      img.onload = () => {
        images[idx] = img;
        loadedCount++;
        // Throttle loading — give browser breathing room
        setTimeout(loadNext, 10);
      };
      img.onerror = () => {
        setTimeout(loadNext, 10);
      };
    }

    for (let i = 0; i < CONCURRENT; i++) loadNext();
  }

  // ── Story beat management ──
  const beats = [
    document.getElementById('beat-1'),
    document.getElementById('beat-2'),
    document.getElementById('beat-3'),
    document.getElementById('beat-4'),
    document.getElementById('beat-5')
  ];

  const beatRanges = [
    { start: 0,    end: 0.15 },
    { start: 0.15, end: 0.40 },
    { start: 0.40, end: 0.65 },
    { start: 0.65, end: 0.85 },
    { start: 0.85, end: 1.00 }
  ];

  function updateBeats(progress) {
    beats.forEach((beat, i) => {
      if (!beat) return;
      const range = beatRanges[i];
      const isActive = progress >= range.start && progress < range.end;

      if (isActive && !beat.classList.contains('active')) {
        beat.classList.add('active');
      } else if (!isActive && beat.classList.contains('active')) {
        beat.classList.remove('active');
      }
    });

    if (progress >= 0.98 && beats[4]) {
      beats[4].classList.add('active');
    }
  }

  // ── Main scroll handler ──
  let ticking = false;

  function onScroll() {
    if (ticking) return;

    ticking = true;
    requestAnimationFrame(() => {
      const rect = heroSection.getBoundingClientRect();
      const sectionHeight = heroSection.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight));

      // Map progress to frame index
      const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1));

      if (frameIndex !== currentFrame) {
        // Find closest available frame
        let bestFrame = frameIndex;
        if (!images[frameIndex]) {
          // Look for nearest loaded frame
          for (let delta = 1; delta < 20; delta++) {
            if (images[frameIndex - delta]) { bestFrame = frameIndex - delta; break; }
            if (images[frameIndex + delta]) { bestFrame = frameIndex + delta; break; }
          }
        }

        if (images[bestFrame]) {
          currentFrame = bestFrame;
          drawFrame(bestFrame);
        }
      }

      updateBeats(progress);

      if (heroGlow) {
        if (progress > 0.02 && progress < 0.9) {
          heroGlow.classList.add('visible');
        } else {
          heroGlow.classList.remove('visible');
        }
      }

      ticking = false;
    });
  }

  // ── Initialize ──
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resizeCanvas, 100);
  });

  window.addEventListener('scroll', onScroll, { passive: true });

  // Start loading frames
  preloadFrames();
  onScroll();
  window.addEventListener('load', resizeCanvas);

})();
