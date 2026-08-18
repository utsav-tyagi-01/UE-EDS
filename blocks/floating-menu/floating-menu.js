/*
 * Floating Menu block
 * Authored in Universal Editor as a list of items, each with:
 *  - text (text)          -> visible label
 *  - link (aem-content)   -> the <a> href
 *  - iconCode (textarea)  -> raw icon/SVG markup pasted by the author
 *
 * Any authored row that does not contain a link is ignored, so
 * block-level config fields won't break rendering.
 */

function buildMenuList(block) {
  const ul = document.createElement('ul');
  ul.className = 'floating-menu-list';

  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    if (!link) return;

    const cells = [...row.children];
    const label = link.textContent.trim() || cells[0]?.textContent.trim() || '';
    // last cell holds the pasted icon markup (textarea field)
    const iconCode = cells[cells.length - 1]?.textContent.trim() || '';

    const li = document.createElement('li');
    li.className = 'floating-menu-item';

    const a = document.createElement('a');
    a.href = link.getAttribute('href');
    a.className = 'floating-menu-link';
    if (link.hasAttribute('target')) a.setAttribute('target', link.getAttribute('target'));

    const text = document.createElement('span');
    text.className = 'text';
    text.textContent = label;

    const icon = document.createElement('span');
    icon.className = 'icon';
    if (iconCode) {
      // eslint-disable-next-line no-unsanitized/property
      icon.innerHTML = iconCode;
    }

    a.append(text, icon);
    li.append(a);
    ul.append(li);
  });

  return ul;
}

function buildChatWidget() {
  const wrap = document.createElement('div');
  wrap.className = 'chatbot-wrap';

  const chat = document.createElement('div');
  chat.id = 'chat-with-kian';
  chat.innerHTML = '<div class="-carla-container"><div class="chatbotv3" id="carlabs-root-element"></div></div>';

  wrap.append(chat);
  return wrap;
}

export default function decorate(block) {
  const list = buildMenuList(block);
  const chatWidget = buildChatWidget();

  const heading = document.createElement('h2');
  heading.className = 'a11y';
  heading.textContent = 'Quick Menu';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'cta-toggle';
  toggle.innerHTML = '<span class="button-icon"></span><span class="a11y">Open</span>';
  toggle.addEventListener('click', () => {
    block.classList.toggle('is-active');
    toggle.setAttribute('aria-expanded', block.classList.contains('is-active'));
  });

  const circle = document.createElement('div');
  circle.className = 'circle';

  block.textContent = '';
  block.append(heading, chatWidget, list, toggle, circle);

  block.id = block.id || 'floating-menu';
  block.classList.add('floating-menu', 'is-active');
  block.setAttribute('data-menu-is', 'closed');
}