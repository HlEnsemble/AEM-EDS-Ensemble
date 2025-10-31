/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards28) block: 2 columns, first row is header, each row = 1 card: [image, text]
  const headerRow = ['Cards (cards28)'];
  const rows = [headerRow];

  // Find all card anchors (each card is an <a> with data-testid="joinCard")
  const cards = element.querySelectorAll('a[data-testid="joinCard"]');

  cards.forEach(card => {
    // Find the image (first img inside the card)
    const img = card.querySelector('img');
    // Find the title (div with uppercase text, always present)
    const titleDiv = card.querySelector('div.text-center');
    // For this source, no description or CTA, just the title
    // We'll use a <strong> for the heading
    let titleEl;
    if (titleDiv) {
      titleEl = document.createElement('strong');
      titleEl.textContent = titleDiv.textContent.trim();
    }
    const textCell = titleEl ? [titleEl] : [];
    // Add the row: [image, text]
    if (img && textCell.length > 0) {
      rows.push([img, textCell]);
    }
  });

  // Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
