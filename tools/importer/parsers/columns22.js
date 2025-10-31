/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns22)'];

  // Find all direct button children inside the visual columns container
  // Defensive: Only include actual buttons found
  const buttons = Array.from(element.querySelectorAll('button'));

  // Edge case: If no buttons found, create empty columns
  const columnsRow = buttons.length > 0 ? buttons : ['',''];

  // Each button goes into its own column (cell)
  const rows = [
    headerRow,
    columnsRow,
  ];

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
