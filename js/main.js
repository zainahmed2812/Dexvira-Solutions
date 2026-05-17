  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
              setTimeout(() => entry.target.classList.add('visible'), i * 80);
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Stats counter
  const counters = document.querySelectorAll('.stat-num');
  const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const target = +entry.target.getAttribute('data-target');
              let count = 0;
              const step = Math.ceil(target / 40);
              const timer = setInterval(() => {
                  count = Math.min(count + step, target);
                  entry.target.textContent = count + (target === 100 ? '%' : '+');
                  if (count >= target) clearInterval(timer);
              }, 40);
              statsObserver.unobserve(entry.target);
          }
      });
  }, { threshold: 0.5 });
  counters.forEach(c => statsObserver.observe(c));

  // Form submit
  document.getElementById('contactForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('.btn-submit');
      btn.textContent = 'Message Sent ✓';
      btn.style.background = '#10b981';
      setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          e.target.reset();
      }, 3000);
  });
  // Contact Form Submit
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const btn = e.target.querySelector('.btn-submit');
    btn.textContent = 'Sending...';
    btn.disabled = true;
  
    const data = {
      firstName: e.target.querySelector('input[placeholder="John"]').value,
      lastName: e.target.querySelector('input[placeholder="Smith"]').value,
      email: e.target.querySelector('input[type="email"]').value,
      service: e.target.querySelector('select').value,
      message: e.target.querySelector('textarea').value
    };
  
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (result.success) {
        btn.textContent = 'Message Sent ✓';
        btn.style.background = '#10b981';
        e.target.reset();
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }
  
    } catch (error) {
      btn.textContent = 'Something went wrong';
      btn.style.background = '#ef4444';
      btn.disabled = false;
    }
  });