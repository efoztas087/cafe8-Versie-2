document.addEventListener('DOMContentLoaded', () => {
  // Jaar automatisch toevoegen
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Openingstijden laden
  fetch('/data/openingstijden.json')
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      const list = document.getElementById('openingstijden-list');
      if (list && Array.isArray(data)) {
        list.innerHTML = '';
        data.forEach(item => {
          const li = document.createElement('li');
          li.textContent = `${item.dag}: ${item.open} - ${item.sluit}`;
          list.appendChild(li);
        });
      }
    })
    .catch(err => console.error('Fout bij laden openingstijden:', err));

  // Menu laden
  fetch('/data/menu.json')
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      const grid = document.getElementById('menu-grid');
      if (grid && Array.isArray(data)) {
        grid.innerHTML = '';
        data.forEach(item => {
          const el = document.createElement('div');
          el.classList.add('menu-item');
          el.innerHTML = `
            <h3>${item.naam}</h3>
            <p>${item.beschrijving}</p>
            <span class="prijs">${item.prijs}</span>
          `;
          grid.appendChild(el);
        });
      }
    })
    .catch(err => console.error('Fout bij laden menu:', err));

  // Gallery laden
  fetch('/data/gallery.json')
    .then(res => res.ok ? res.json() : [])
    .then(data => {
      const gallery = document.getElementById('gallery-grid');
      if (gallery && Array.isArray(data)) {
        gallery.innerHTML = '';
        data.forEach(item => {
          const img = document.createElement('img');
          img.src = item.src;
          img.alt = item.alt || '';
          gallery.appendChild(img);
        });
      }
    })
    .catch(err => console.error('Fout bij laden gallery:', err));

  // Smooth scroll navigatie
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const id = link.getAttribute('href').substring(1);
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Naar-boven-knop
  const toTopBtn = document.getElementById('to-top');
  if (toTopBtn) {
    window.addEventListener('scroll', () => {
      toTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Tekstslider met smooth fade animatie
  const textSlider = document.querySelector('.text-slider');
  if (textSlider) {
    const spans = textSlider.querySelectorAll('span');
    let index = 0;

    function showNextText() {
      spans.forEach(span => span.classList.remove('visible'));
      spans[index].classList.add('visible');
      index = (index + 1) % spans.length;
    }

    // Start animatie
    showNextText();
    setInterval(showNextText, 4000);
  }

  // Contactformulier functionaliteit
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData
        });
        const result = await response.json();

        const messageBox = document.createElement('p');
        messageBox.style.marginTop = '15px';
        messageBox.style.padding = '10px';
        messageBox.style.borderRadius = '5px';
        messageBox.style.textAlign = 'center';

        if (result.success) {
          messageBox.textContent = result.success;
          messageBox.style.backgroundColor = '#d4edda';
          messageBox.style.color = '#155724';
          contactForm.reset();
        } else {
          messageBox.textContent = result.error || 'Er ging iets mis. Probeer opnieuw.';
          messageBox.style.backgroundColor = '#f8d7da';
          messageBox.style.color = '#721c24';
        }

        const oldMsg = contactForm.querySelector('p');
        if (oldMsg) oldMsg.remove();
        contactForm.appendChild(messageBox);
      } catch (err) {
        console.error('Fout bij verzenden formulier:', err);
      }
    });
  }
});
