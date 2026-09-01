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

  const socialMetadata = [
    ['meta[property="og:title"]', data.title],
    ['meta[property="og:description"]', data.description],
    ['meta[name="twitter:title"]', data.title],
    ['meta[name="twitter:description"]', data.description]
  ];
  socialMetadata.forEach(([selector, value]) => {
    const meta = document.querySelector(selector);
    if (meta && value) meta.content = value;
  });

  document.querySelectorAll('[data-cms]').forEach((element) => {
    const value = resolveContentValue(data, element.dataset.cms);
    if (value !== undefined && value !== null) {
        if (element.tagName === 'A') {
          if (element.dataset.cms === 'contact.email') {
            element.href = `mailto:${value}`;
          } else if (element.dataset.cms === 'contact.phone') {
            const tel = String(value).replace(/[^+\d]/g, '');
            element.href = `tel:${tel}`;
          } else if (element.dataset.cmsUrl) {
            const url = resolveContentValue(data, element.dataset.cmsUrl);
            if (typeof url === 'string' && url) element.href = url;
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
    renderSchoolInfo(data);
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

function renderSchoolInfo(data) {
  const learningLevelsList = document.getElementById('learningLevelsList');
  if (learningLevelsList && Array.isArray(data.learningLevels) && data.learningLevels.length > 0) {
    learningLevelsList.replaceChildren();
    data.learningLevels.forEach((level) => {
      const item = document.createElement('li');
      item.textContent = level;
      learningLevelsList.appendChild(item);
    });
  }

  const facilitiesList = document.getElementById('facilitiesList');
  if (facilitiesList && Array.isArray(data.facilities) && data.facilities.length > 0) {
    facilitiesList.replaceChildren();
    data.facilities.forEach((facility) => {
      const article = document.createElement('article');
      const heading = document.createElement('h3');
      const description = document.createElement('p');
      heading.textContent = facility.name || 'Facility';
      description.textContent = facility.description || '';
      article.append(heading, description);
      facilitiesList.appendChild(article);
    });
  }
}

function setupForms() {
  document.querySelectorAll('form[data-netlify="true"]').forEach((form) => {
    const status = form.querySelector('.form-status');
    const submitButton = form.querySelector('button[type="submit"]');
    const fields = form.querySelectorAll('input:not([type="hidden"]):not([name="bot-field"]), textarea, select');

    const errorIdFor = (field) => `${form.name}-${field.name}-error`.replace(/[^a-zA-Z0-9_-]/g, '-');

    const clearFieldError = (field) => {
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(errorIdFor(field));
      if (error) error.remove();
    };

    const showFieldError = (field) => {
      const errorId = errorIdFor(field);
      let error = document.getElementById(errorId);
      if (!error) {
        error = document.createElement('span');
        error.className = 'form-error';
        error.id = errorId;
        field.closest('label').appendChild(error);
      }
      error.textContent = field.validationMessage || 'Please complete this field.';
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', errorId);
    };

    fields.forEach((field) => {
      field.addEventListener('invalid', () => showFieldError(field));
      field.addEventListener('input', () => {
        if (field.validity.valid) clearFieldError(field);
      });
    });

    form.addEventListener('submit', (event) => {
      if (!form.checkValidity()) return;

      event.preventDefault();
      if (status) {
        status.className = 'form-status';
        status.textContent = 'Submitting your message...';
      }
      if (submitButton) submitButton.disabled = true;

      fetch(form.action || window.location.href, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(form)).toString()
      })
        .then((response) => {
          if (!response.ok) throw new Error('Form submission failed');
          form.reset();
          fields.forEach(clearFieldError);
          if (status) {
            status.className = 'form-status form-status-success';
            status.textContent = 'Thanks. Your message has been sent successfully.';
          }
        })
        .catch(() => {
          if (status) {
            status.className = 'form-status form-status-error';
            status.textContent = 'We could not send your message. Please try again or contact the school directly.';
          }
        })
        .finally(() => {
          if (submitButton) submitButton.disabled = false;
        });
    });
  });
}

const fallbackGalleryAlbumFiles = [
  'arts-music.json',
  'classroom-learning.json',
  'community-events.json',
  'everyday-moments.json',
  'school-trips.json',
  'sports-day.json'
];

async function resolveGalleryAlbumFiles() {
  const repo = (window.SITE_CONFIG && typeof window.SITE_CONFIG.repo === 'string')
    ? window.SITE_CONFIG.repo
    : 'He-casmil/adkins-preparatory-school';
  const branch = (window.SITE_CONFIG && typeof window.SITE_CONFIG.branch === 'string')
    ? window.SITE_CONFIG.branch
    : 'main';

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/content/gallery?ref=${branch}`, {
      headers: { Accept: 'application/vnd.github+json' }
    });

    if (!response.ok) throw new Error('Unable to load gallery list from GitHub.');

    const entries = await response.json();
    const files = Array.isArray(entries)
      ? entries
          .filter((entry) => entry && entry.type === 'file' && /\.json$/i.test(entry.name))
          .map((entry) => entry.name)
          .sort((a, b) => a.localeCompare(b))
      : [];

    if (files.length > 0) return files;
  } catch (error) {
    console.warn('Gallery index failed, using the local fallback catalog.', error);
  }

  return fallbackGalleryAlbumFiles;
}

async function loadGalleryAlbums() {
  const container = document.getElementById('galleryAlbums');
  const status = document.getElementById('galleryStatus');
  if (!container || !status) return;

  const galleryAlbumFiles = await resolveGalleryAlbumFiles();

  Promise.allSettled(galleryAlbumFiles.map((file) => (
    fetch(`content/gallery/${file}`)
      .then((response) => {
        if (!response.ok) throw new Error(`Gallery album not found: ${file}`);
        return response.json();
      })
  ))).then((results) => {
    const albums = results
      .filter((result) => result.status === 'fulfilled' && result.value && result.value.albumName)
      .map((result) => result.value);
    const failedCount = results.length - albums.length;

    renderGalleryAlbums(albums, container);

    if (albums.length === 0) {
      status.textContent = 'Gallery albums are currently unavailable.';
    } else if (failedCount > 0) {
      status.textContent = `${albums.length} albums loaded. Some albums are currently unavailable.`;
    } else {
      status.textContent = `${albums.length} albums loaded.`;
    }
  });
}

function renderGalleryAlbums(albums, container) {
  container.replaceChildren();

  albums.forEach((album) => {
    const card = document.createElement('article');
    const cover = album.featuredImage || (album.photos && album.photos[0] && album.photos[0].image);
    card.className = 'album-card';

    if (cover) {
      const image = document.createElement('img');
      image.src = cover;
      image.alt = `${album.albumName} album cover`;
      card.appendChild(image);
    }

    const heading = document.createElement('h3');
    const description = document.createElement('p');
    const button = document.createElement('button');
    heading.textContent = album.albumName;
    description.textContent = album.description || 'Explore moments from our school community.';
    button.className = 'button button-alt';
    button.type = 'button';
    button.textContent = 'View Album';
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', () => openAlbumDialog(album));
    card.append(heading, description, button);
    container.appendChild(card);
  });
}

function openAlbumDialog(album) {
  const dialog = document.getElementById('albumDialog');
  const title = document.getElementById('albumDialogTitle');
  const description = document.getElementById('albumDialogDescription');
  const grid = document.getElementById('albumPhotoGrid');
  if (!dialog || !title || !description || !grid) return;

  title.textContent = album.albumName;
  description.textContent = album.description || '';
  grid.replaceChildren();

  if (!Array.isArray(album.photos) || album.photos.length === 0) {
    const emptyMessage = document.createElement('p');
    emptyMessage.textContent = 'No photos have been added to this album yet.';
    grid.appendChild(emptyMessage);
  } else {
    album.photos.forEach((photo) => {
      if (!photo || !photo.image) return;
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      image.src = photo.image;
      image.alt = photo.caption || `${album.albumName} photo`;
      figure.appendChild(image);

      if (photo.caption) {
        const caption = document.createElement('figcaption');
        caption.textContent = photo.caption;
        figure.appendChild(caption);
      }

      grid.appendChild(figure);
    });
  }

  dialog.showModal();
}

const albumDialogClose = document.getElementById('albumDialogClose');
if (albumDialogClose) {
  albumDialogClose.addEventListener('click', () => {
    const dialog = document.getElementById('albumDialog');
    if (dialog) dialog.close();
  });
}

function markActiveNavLink() {
  if (!siteNav) return;

  const normalizedCurrent = currentPage === 'index' || currentPage === '' ? 'home' : currentPage;
  siteNav.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const normalizedHref = href === 'index.html' ? 'home' : href.replace(/\.html$/, '') || 'home';
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
    .catch((error) => {
      console.warn(error);
      return {};
    })
    .then((pageData) => {
      return fetch('content/info/school.json')
        .then((response) => {
          if (!response.ok) {
            throw new Error('School information not found');
          }
          return response.json();
        })
        .then((info) => ({ ...info, ...pageData, contact: info.contact || pageData.contact }))
        .catch((error) => {
          console.warn(error);
          return pageData;
        });
    })
    .then((mergedPageData) => applyPageContent(mergedPageData));
}

markActiveNavLink();
setupForms();

if (pageName === 'gallery') loadGalleryAlbums();
