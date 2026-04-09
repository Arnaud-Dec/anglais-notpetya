document.addEventListener('DOMContentLoaded', () => {
  // Slide Management
  const slides = document.querySelectorAll('.slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const slideNumEl = document.getElementById('current-slide-num');
  const progressBarFill = document.getElementById('progress-bar-fill');
  
  let currentSlideIndex = 0;
  const totalSlides = slides.length;

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev');
      if (index === currentSlideIndex) {
        slide.classList.add('active');
        // Trigger animations for elements inside the active slide
        triggerSlideAnimations(slide);
      } else if (index < currentSlideIndex) {
        slide.classList.add('prev');
      }
    });

    // Update counter and progress bar
    slideNumEl.textContent = currentSlideIndex + 1;
    const progressPercent = ((currentSlideIndex) / (totalSlides - 1)) * 100;
    progressBarFill.style.width = `${progressPercent}%`;

    // Button states
    prevBtn.style.opacity = currentSlideIndex === 0 ? '0.3' : '1';
    prevBtn.style.cursor = currentSlideIndex === 0 ? 'default' : 'pointer';
    
    nextBtn.style.opacity = currentSlideIndex === totalSlides - 1 ? '0.3' : '1';
    nextBtn.style.cursor = currentSlideIndex === totalSlides - 1 ? 'default' : 'pointer';
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      currentSlideIndex++;
      updateSlides();
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      currentSlideIndex--;
      updateSlides();
    }
  }

  // Event Listeners for Navigation
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Space' || e.key === 'Enter') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  // Matrix Rain Background Effect
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン';
  const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  const characters = katakana + latin + nums;
  const chars = characters.split('');

  const fontSize = 16;
  const columns = canvas.width / fontSize;
  const drops = [];

  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
  }

  setInterval(drawMatrix, 33);

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Additional Slide Animations
  function triggerSlideAnimations(slide) {
    // Reveal child elements with slight delays if they have 'card' or 'feature-item'
    const animatableElements = slide.querySelectorAll('.card, .feature-item, .timeline-item, .vocab-card');
    animatableElements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 + (i * 100)); // Stagger effect
    });
  }

  // Initialize
  updateSlides();
});
