export default function decorate(block) {
  const rows = [...block.children];

  // Child "app-link-item" components render as their own rows/blocks
  // inside this container — separate those out from the container-level
  // fields (background, phone image, title, icon, subtitle).
  const itemRows = rows.filter((row) => row.classList.contains('app-link-item'));
  const headerRows = rows.filter((row) => !row.classList.contains('app-link-item'));

  const [bgRow, phoneRow, titleRow, iconRow, subtitleRow] = headerRows;

  // 1. Optional section background image -> block background, discard row
  if (bgRow) {
    const bgImg = bgRow.querySelector('img');
    if (bgImg) {
      block.style.backgroundImage = `url('${bgImg.currentSrc || bgImg.src}')`;
      block.classList.add('has-bg-image');
    }
    bgRow.remove();
  }

  block.classList.add('app-download-link-block');

  const wrapper = document.createElement('div');
  wrapper.className = 'adl-wrapper';

  // 2. Phone mockup (left column)
  if (phoneRow) {
    phoneRow.className = 'adl-phone';
    wrapper.append(phoneRow);
  }

  // Right column: title, feature banner, subtitle, badges
  const body = document.createElement('div');
  body.className = 'adl-body';

  if (titleRow) {
    titleRow.className = 'adl-title';
    body.append(titleRow);
  }

  if (iconRow) {
    iconRow.className = 'adl-icon';
    body.append(iconRow);
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'adl-links';

  if (subtitleRow) {
    subtitleRow.className = 'adl-subtitle';
    linksWrap.append(subtitleRow);
  }

  // 3. Store badges (repeatable app-link-item children)
  const badgeRow = document.createElement('div');
  badgeRow.className = 'adl-badges';

  itemRows.forEach((item) => {
    const picture = item.querySelector('picture');
    const link = item.querySelector('a');
    if (!picture || !link) return;

    const img = picture.querySelector('img');
    if (img) {
      img.loading = 'lazy';
    }

    const badge = document.createElement('a');
    badge.className = 'adl-badge';
    badge.href = link.href;
    badge.target = '_blank';
    badge.rel = 'noopener noreferrer';
    badge.setAttribute(
      'aria-label',
      link.textContent.trim() || item.querySelector('[data-aue-prop="storeLabel"]')?.textContent.trim() || 'Download app',
    );
    badge.append(picture);
    badgeRow.append(badge);
  });

  linksWrap.append(badgeRow);
  body.append(linksWrap);
  wrapper.append(body);

  block.textContent = '';
  block.append(wrapper);
}