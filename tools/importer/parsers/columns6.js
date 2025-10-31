/* global WebImporter */
export default function parse(element, { document }) {
  // Critical review: Ensure all content is dynamically extracted, no hardcoding, and semantic meaning is retained.
  // 1. Extract all direct button children (each is a column)
  const buttons = Array.from(element.children).filter(el => el.tagName === 'BUTTON');

  // 2. Edge case: If no direct button children, fallback to querySelectorAll for buttons inside
  const columns = buttons.length > 0 ? buttons : Array.from(element.querySelectorAll('button'));

  // 3. Defensive: If no buttons found, create empty columns to preserve structure
  const numCols = columns.length > 0 ? columns.length : 2;
  const contentRow = columns.length > 0 ? columns : Array(numCols).fill(document.createElement('span'));

  // 4. Table header must match block name exactly
  const headerRow = ['Columns (columns6)'];

  // 5. Build table using referenced elements (not clones)
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // 6. Replace the original element with the table
  element.replaceWith(table);
}
