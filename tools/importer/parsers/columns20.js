/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns20)'];

  // Defensive: Get immediate children (should be two: text and image)
  const children = Array.from(element.children);
  // Find the text column (contains <p>) and the image column (contains <img>)
  let textCol = null, imgCol = null;
  children.forEach(child => {
    if (child.querySelector('p')) {
      textCol = child;
    } else if (child.querySelector('img')) {
      // The image is nested one level deeper
      imgCol = child;
    }
  });

  // Defensive fallback: If not found, try deeper
  if (!textCol) {
    textCol = element.querySelector('div:has(p)');
  }
  if (!imgCol) {
    imgCol = element.querySelector('img')?.closest('div');
  }

  // Compose the columns row
  const columnsRow = [textCol, imgCol];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
