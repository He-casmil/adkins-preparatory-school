const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.setAttribute('aria-controls', 'siteNav');
  navToggle.setAttribute('aria-expanded', 'false');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (siteNav.classList.contains('active')) {
        siteNav.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

const pageName = document.body.dataset.page || window.location.pathname.replace(/^.*[\\/]/, '').replace('.html', '') || 'home';
const currentPage = pageName || 'home';

function resolveContentValue(data, path) {
  return path.split('.').reduce((current, key) => (current ? current[key] : undefined), data);
}

function applyPageContent(data) {
  if (data.title) document.title = data.title;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription && data.description) {
    metaDescription.content = data.description;
  }

  document.querySelectorAll('[data-cms]').forEach((element) => {
    const value = resolveContentValue(data, element.dataset.cms);
    if (value !== undefined && value !== null) {
        if (element.tagName === 'A') {
          // set href for email or phone links and update text
          if (typeof value === 'string' && value.includes('@')) {
            element.href = `mailto:${value}`;
          } else {
            const tel = String(value).replace(/[^+\d]/g, '');
            element.href = `tel:${tel}`;
          }
          element.textContent = value;
        } else {
          element.textContent = value;
        }
      }
    });

    applyHeroBackground(data);
    renderNewsItems(data.newsItems);
    renderEvents(data.events);
  }

  function applyHeroBackground(data) {
  const hero = document.querySelector('.hero');
  const imageUrl = resolveContentValue(data, 'backgroundImage') || resolveContentValue(data, 'hero.backgroundImage');
  if (!hero || !imageUrl) return;

  hero.style.backgroundImage = `linear-gradient(rgba(15, 35, 88, 0.5), rgba(15, 35, 88, 0.28)), url('${imageUrl}')`;
  hero.style.backgroundSize = 'cover';
  hero.style.backgroundPosition = 'center';
  hero.classList.add('has-background');
}

function renderNewsItems(newsItems) {
  if (!Array.isArray(newsItems) || newsItems.length === 0) return;

  const container = document.getElementById('newsList');
  if (!container) return;

  container.innerHTML = '';
  newsItems.forEach((item) => {
    const article = document.createElement('article');
    article.innerHTML = `
      <h2>${item.title}</h2>
      ${item.date ? `<p class="news-date">${item.date}</p>` : ''}
      <p>${item.summary}</p>
      ${item.linkUrl ? `<a class="button button-alt" href="${item.linkUrl}">${item.linkText || 'Read more'}</a>` : ''}
    `;
    container.appendChild(article);
  });
}

function renderEvents(events) {
  if (!Array.isArray(events) || events.length === 0) return;

  const list = document.getElementById('eventsList');
  if (!list) return;

  list.innerHTML = '';
  events.forEach((event) => {
    const item = document.createElement('li');
    item.innerHTML = `<strong>${event.date}:</strong> ${event.description}`;
    list.appendChild(item);
  });
}

function markActiveNavLink() {
  if (!siteNav) return;

  const normalizedCurrent = currentPage === 'index' || currentPage === '' ? 'home' : currentPage;
  siteNav.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const normalizedHref = href.replace('.html', '') || 'home';
    if (normalizedHref === normalizedCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

if (pageName) {
  fetch(`content/pages/${pageName}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`CMS content not found for ${pageName}`);
      }
      return response.json();
    })
    .then((pageData) => {
      // Fetch shared school info (contact, facilities) and merge into page data
      return fetch('content/info/school.json')
        .then((r) => {
          if (!r.ok) return pageData;
          return r.json().then((info) => {
            // merge contact under pageData.contact for data-cms="contact.xxx"
            pageData.contact = info.contact || info;
            return pageData;
          });
        })
        .catch(() => pageData);
    })
    .then((mergedPageData) => applyPageContent(mergedPageData))
    .catch((error) => console.warn(error));
}

markActiveNavLink();
