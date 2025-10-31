/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards35) block: 2 columns, multiple rows, header row is block name

  // Header row as required
  const headerRow = ['Cards (cards35)'];

  // Find all card elements (use specific selector for card structure)
  const cardNodes = element.querySelectorAll('[data-testid="officeCard"]');

  // Build rows: each card is one row, [image, text]
  const rows = Array.from(cardNodes).map(card => {
    // Image: find first <img> inside the card
    const img = card.querySelector('img');
    // Title: find first <h2> inside the card
    const title = card.querySelector('h2');
    // Defensive: if either missing, skip row
    if (!img || !title) return null;
    // For text cell, only the heading is present (no description/cta)
    return [img, title];
  }).filter(Boolean);

  // Compose table data
  const tableData = [headerRow, ...rows];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
