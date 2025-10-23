const tabsContainer = document.getElementById('menu-tabs');
const sectionsContainer = document.getElementById('menu-sections');
const menuHeader = document.getElementById('menu-header');
const year = document.getElementById('year');

if (year) {
  year.textContent = new Date().getFullYear();
}

async function loadMenu() {
  try {
    const response = await fetch('data/menu.json');
    const data = await response.json();
    renderMenu(data.categories);
  } catch (error) {
    sectionsContainer.innerHTML =
      '<p class="menu-error">Het menu kan momenteel niet geladen worden.</p>';
    console.error('Kon menu.json niet laden', error);
  }
}

function renderMenu(categories) {
  tabsContainer.innerHTML = '';
  sectionsContainer.innerHTML = '';

  categories.forEach((category, index) => {
    const tabButton = document.createElement('button');
    tabButton.type = 'button';
    tabButton.className = 'tab-button';
    tabButton.id = `tab-${category.id}`;
    tabButton.setAttribute('role', 'tab');
    tabButton.setAttribute('aria-controls', `panel-${category.id}`);
    tabButton.dataset.category = category.id;
    tabButton.textContent = category.label;

    if (index === 0) {
      tabButton.setAttribute('aria-selected', 'true');
      tabButton.classList.add('active');
    } else {
      tabButton.setAttribute('aria-selected', 'false');
    }

    tabButton.addEventListener('click', () => activateTab(category.id, category));
    tabsContainer.appendChild(tabButton);

    const section = document.createElement('section');
    section.className = 'menu-section';
    section.id = `panel-${category.id}`;
    section.setAttribute('role', 'tabpanel');
    section.setAttribute('aria-labelledby', tabButton.id);

    if (index === 0) {
      section.classList.add('active');
    }

    category.groups.forEach((group) => {
      const groupElement = document.createElement('article');
      groupElement.className = 'menu-group';

      const header = document.createElement('header');
      header.className = 'menu-group-header';

      const title = document.createElement('h2');
      title.className = 'menu-group-title';
      title.textContent = group.title;

      const description = document.createElement('p');
      description.className = 'menu-group-description';
      description.textContent = group.description;

      header.appendChild(title);
      header.appendChild(description);

      const itemsList = document.createElement('div');
      itemsList.className = 'menu-items';

      group.items.forEach((item) => {
        const itemCard = document.createElement('article');
        itemCard.className = 'menu-item';

        const itemTitle = document.createElement('h3');
        itemTitle.textContent = item.name;

        const itemDescription = document.createElement('p');
        itemDescription.textContent = item.description;

        const itemPrice = document.createElement('p');
        itemPrice.className = 'price';
        itemPrice.textContent = item.price;

        itemCard.appendChild(itemTitle);
        itemCard.appendChild(itemDescription);
        itemCard.appendChild(itemPrice);
        itemsList.appendChild(itemCard);
      });

      groupElement.appendChild(header);
      groupElement.appendChild(itemsList);
      section.appendChild(groupElement);
    });

    sectionsContainer.appendChild(section);
  });

  // Toon standaard eerste categorie
  if (categories.length > 0) {
    updateMenuHeader(categories[0]);
  }
}

function activateTab(categoryId, categoryData) {
  const allTabs = tabsContainer.querySelectorAll('.tab-button');
  const allPanels = sectionsContainer.querySelectorAll('.menu-section');

  allTabs.forEach((tab) => {
    const isActive = tab.dataset.category === categoryId;
    tab.setAttribute('aria-selected', String(isActive));
    tab.classList.toggle('active', isActive);
  });

  allPanels.forEach((panel) => {
    if (panel.id === `panel-${categoryId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });

  updateMenuHeader(categoryData);
}

function updateMenuHeader(category) {
  if (menuHeader) {
    menuHeader.innerHTML = `
      <div class="container">
        <h2 class="menu-title">${category.label}</h2>
        <p class="menu-description">${category.description || ''}</p>
      </div>
    `;
  }
}

loadMenu();

// --- Contactformulier functionaliteit (zoals in app.js) ---
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
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