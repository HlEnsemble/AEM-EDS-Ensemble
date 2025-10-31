/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards23) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards23)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // The cards are direct children with data-testid="card"
  const cardsContainer = element.querySelector('[data-testid="cardsContainer"]');
  if (!cardsContainer) return;

  const cardEls = Array.from(cardsContainer.querySelectorAll('[data-testid="card"]'));

  cardEls.forEach(card => {
    // Image/Icon (first cell)
    const imgWrapper = card.firstElementChild;
    const img = imgWrapper ? imgWrapper.querySelector('img') : null;

    // Text content (second cell)
    // Title: <h2>, Description: <p>
    const title = card.querySelector('h2');
    const desc = card.querySelector('p');
    // Compose text cell: title above description
    const textCell = document.createElement('div');
    if (title) textCell.appendChild(title);
    if (desc) textCell.appendChild(desc);

    rows.push([
      img || '',
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
