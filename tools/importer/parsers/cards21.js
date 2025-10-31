/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card content from a flip-container
  function extractCard(cardEl) {
    // --- Card Model Fields ---
    // Image/Icon
    const front = cardEl.querySelector('.flip-card-front [data-testid="articleCard"]');
    const img = front.querySelector('img');

    // Compose text cell content
    const textCell = document.createElement('div');
    // Get all text blocks from the front overlay
    const overlay = front.querySelector('div.absolute.top-0.left-0');
    if (overlay) {
      Array.from(overlay.children).forEach(child => {
        if (child.className.includes('font-bold')) {
          const heading = document.createElement('strong');
          heading.textContent = child.textContent;
          textCell.appendChild(heading);
        } else {
          const div = document.createElement('div');
          div.textContent = child.textContent;
          textCell.appendChild(div);
        }
      });
    }
    // Get description from back
    const back = cardEl.querySelector('.flip-card-back [data-testid="articleCard"]');
    const description = back?.querySelector('.line-clamp-4');
    if (description) {
      textCell.appendChild(document.createElement('br'));
      textCell.appendChild(description.cloneNode(true));
    }
    // Tech icons row (SVGs/images)
    const iconsRow = back?.querySelector('.flex.flex-wrap');
    if (iconsRow && iconsRow.children.length > 0) {
      textCell.appendChild(document.createElement('br'));
      Array.from(iconsRow.children).forEach(icon => {
        textCell.appendChild(icon.cloneNode(true));
      });
    }
    // CTA
    const ctaBtn = cardEl.querySelector('.button-container button');
    const cardLink = cardEl.querySelector('.flip-card-back')?.getAttribute('href');
    if (ctaBtn && cardLink) {
      textCell.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = cardLink;
      cta.textContent = ctaBtn.textContent;
      textCell.appendChild(cta);
    }
    return [img, textCell];
  }

  // Get all card containers
  const cards = Array.from(element.querySelectorAll('.flip-container'));
  const rows = [
    ['Cards (cards21)'],
    ...cards.map(card => extractCard(card))
  ];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
