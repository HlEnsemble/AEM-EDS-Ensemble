/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns2)
  const headerRow = ['Columns (columns2)'];

  // Get all immediate child divs (each represents a column's content)
  const items = Array.from(element.children);

  // Defensive: Only process if there are items
  if (!items.length) return;

  // Group items into rows of 2 columns each
  const columnsPerRow = 2;
  const contentRows = [];
  for (let i = 0; i < items.length; i += columnsPerRow) {
    // For each row, grab 2 columns
    const row = [];
    for (let j = 0; j < columnsPerRow; j++) {
      const idx = i + j;
      if (idx < items.length) {
        row.push(items[idx]);
      }
    }
    // If row has less than 2 columns, pad with empty string
    while (row.length < columnsPerRow) {
      row.push('');
    }
    contentRows.push(row);
  }

  // Compose table cells: header + content rows
  const cells = [headerRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
