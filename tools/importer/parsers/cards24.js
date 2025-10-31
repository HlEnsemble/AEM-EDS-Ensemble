/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards24) block header
  const headerRow = ['Cards (cards24)'];
  const rows = [headerRow];

  // Helper to extract card content from a cultureCard div
  function extractCard(cardDiv) {
    // Find the image (always present)
    const img = cardDiv.querySelector('img');
    // Find the heading (h2) and description (p)
    const textContainer = cardDiv.querySelector('div');
    let heading = null;
    let description = null;
    if (textContainer) {
      heading = textContainer.querySelector('h2');
      description = textContainer.querySelector('p');
    }
    // Compose the text cell
    const textCell = [];
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    return [img, textCell];
  }

  // Select all card containers (data-testid="cultureCard")
  const cardDivs = element.querySelectorAll('[data-testid="cultureCard"]');
  cardDivs.forEach(cardDiv => {
    rows.push(extractCard(cardDiv));
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
