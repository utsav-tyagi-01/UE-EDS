export default function decorate(block) {
  const rows = [...block.children];

  // Fixed row order authored in the block table:
  // 1. Background image (optional)
  // 2. Phone mockup image
  // 3. Title text
  // 4. Feature banner image
  // 5. Subtitle text
  // 6-9. Up to 4 store badge rows, each: [image cell, link cell]
  const [bgRow, phoneRow, titleRow, iconRow, subtitleRow, ...badgeRows] = rows;

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

  // 3. Up to 4 store badges — each row has an image cell and a link cell
  const badgeContainer = document.createElement('div');
  badgeContainer.className = 'adl-badges';

  badgeRows.forEach((row) => {
    const picture = row.querySelector('picture');
    const link = row.querySelector('a');

    // Skip empty/unfilled badge slots (author left 3rd/4th badge blank)
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
    badge.setAttribute('aria-label', link.textContent.trim() || 'Download app');
    badge.append(picture);
    badgeContainer.append(badge);
  });

  linksWrap.append(badgeContainer);
  body.append(linksWrap);
  wrapper.append(body);

  block.textContent = '';
  block.append(wrapper);
}