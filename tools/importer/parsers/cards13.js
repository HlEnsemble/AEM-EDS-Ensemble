/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards13) block: 2 columns, multiple rows, first row is block name
  const headerRow = ['Cards (cards13)'];
  const rows = [headerRow];

  // Find the parent container holding all cards
  // Cards are marked with data-testid="benefitCard"
  const cardElements = element.querySelectorAll('[data-testid="benefitCard"]');

  cardElements.forEach(card => {
    // Find the image/icon (first image in the card)
    const img = card.querySelector('img');

    // Find the heading/title (first h2 in the card)
    const heading = card.querySelector('h2');

    // Find the description (first p in the card)
    const desc = card.querySelector('p');

    // Compose the text cell: heading (if exists) + description (if exists)
    const textCell = [];
    if (heading) textCell.push(heading);
    if (desc) textCell.push(desc);

    rows.push([
      img,
      textCell
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
