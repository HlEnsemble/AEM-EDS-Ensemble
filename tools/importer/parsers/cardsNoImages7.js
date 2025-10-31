/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cardsNoImages7) block header
  const headerRow = ['Cards (cardsNoImages7)'];

  // Extract card items only (do NOT include hero headline)
  const cardButtons = element.querySelectorAll('[data-testid="hero-cards"]');
  const cardRows = [];
  cardButtons.forEach(card => {
    // Title
    const titleDiv = card.querySelector('.py-1');
    const title = titleDiv ? `<strong>${titleDiv.textContent.trim()}</strong>` : '';
    // Description
    const descDiv = card.querySelector('.text-sm');
    const desc = descDiv ? descDiv.textContent.trim() : '';
    // Arrow icon (SVG) - preserve the actual SVG image element
    const arrowImg = card.querySelector('img');
    let arrow = '';
    if (arrowImg) {
      arrow = arrowImg.outerHTML;
    }
    // Compose card cell
    const cardContent = document.createElement('div');
    cardContent.innerHTML = `${title}<br>${desc}${arrow}`;
    cardRows.push([cardContent]);
  });

  // Compose table: header + cards only
  const rows = [headerRow, ...cardRows];
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
