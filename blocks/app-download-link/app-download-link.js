export default function decorate(block) {
  const rows = [...block.children];

  // Child "app-link-item" components are rendered by UE as their own
  // rows/blocks inside this container — pull those out from the
  // container-level fields (background, title, icon, subtitle).
  const itemRows = rows.filter((row) => row.classList.contains('app-link-item'));
  const headerRows = rows.filter((row) => !row.classList.contains('app-link-item'));

  const [bgRow, titleRow, iconRow, subtitleRow] = headerRows;

  // 1. Background image -> block background, then discard the row
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

  // 2. Title
  if (titleRow) {
    titleRow.className = 'adl-title';
    wrapper.append(titleRow);
  }

  const contentRow = document.createElement('div');
  contentRow.className = 'adl-content';

  // 3. Icon
  if (iconRow) {
    iconRow.className = 'adl-icon';
    contentRow.append(iconRow);
  }

  const linksWrap = document.createElement('div');
  linksWrap.className = 'adl-links';

  // 4. Subtitle ("Download the MyKia App:")
  if (subtitleRow) {
    subtitleRow.className = 'adl-subtitle';
    linksWrap.append(subtitleRow);
  }

  // 5. Store badges (repeatable app-link-item children)
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
  contentRow.append(linksWrap);
  wrapper.append(contentRow);

  // Clear the block and rebuild with the new structure
  block.textContent = '';
  block.append(wrapper);
}
