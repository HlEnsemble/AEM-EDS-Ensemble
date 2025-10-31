/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns17)'];

  // Find all immediate li children (each column)
  const items = Array.from(element.querySelectorAll(':scope > li'));
  if (!items.length) return;

  // Each cell should contain only the icon and label, not the <li> wrapper
  const columns = items.map(li => {
    // Extract the icon (img) and label (p) from each li
    const img = li.querySelector('img');
    const p = li.querySelector('p');
    // Create a fragment to hold both
    const frag = document.createDocumentFragment();
    if (img) frag.appendChild(img.cloneNode(true));
    if (p) frag.appendChild(p.cloneNode(true));
    return frag;
  });

  // The block table: header + single row with all columns
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columns
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
