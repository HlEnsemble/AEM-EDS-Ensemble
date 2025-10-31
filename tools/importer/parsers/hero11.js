/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero11) block parsing
  // 1 column, 3 rows: [block name], [background image], [text content]

  // Header row
  const headerRow = ['Hero (hero11)'];

  // Find the image (background)
  const imgContainer = element.querySelector('div');
  let imgEl = null;
  if (imgContainer) {
    imgEl = imgContainer.querySelector('img');
  }

  // Find the heading (h1)
  const headingEl = element.querySelector('h1');

  // Compose the text content row
  const textContent = [];
  if (headingEl) textContent.push(headingEl);
  // No subheading or CTA present in source HTML

  // Build table rows
  const rows = [
    headerRow,
    [imgEl ? imgEl : ''],
    [textContent.length ? textContent : ''],
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
