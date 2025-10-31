/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards31) block header
  const headerRow = ['Cards (cards31)'];

  // Find the cards container
  const cardsContainer = element.querySelector('[data-testid="services-cards-container"]');
  if (!cardsContainer) return;

  // Find all card links (each card is an <a> inside a .contents div)
  const cardLinks = Array.from(cardsContainer.querySelectorAll('a'));

  // Parse each card into a [image, text] row
  const rows = cardLinks.map(card => {
    // Image (first cell)
    const imgContainer = card.querySelector('[data-testid="services-card-img"]');
    let imgEl = imgContainer && imgContainer.querySelector('img');
    imgEl = imgEl || null;

    // Text content (second cell)
    const titleEl = card.querySelector('[data-testid="services-card-title"]');
    const secondaryEl = card.querySelector('[data-testid="services-card-secondary"]');
    const descEl = card.querySelector('[data-testid="services-card-description"]');

    // Compose the text cell
    const textCell = document.createElement('div');
    if (titleEl) {
      const h = document.createElement('strong');
      h.textContent = titleEl.textContent;
      textCell.appendChild(h);
    }
    if (secondaryEl) {
      textCell.appendChild(document.createElement('br'));
      const sec = document.createElement('span');
      sec.style.fontSize = 'smaller';
      sec.textContent = secondaryEl.textContent;
      textCell.appendChild(sec);
    }
    if (descEl) {
      textCell.appendChild(document.createElement('br'));
      const desc = document.createElement('span');
      desc.textContent = descEl.textContent;
      textCell.appendChild(desc);
    }
    return [imgEl, textCell];
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
