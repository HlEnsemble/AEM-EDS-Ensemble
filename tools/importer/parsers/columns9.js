/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns (columns9)
  const headerRow = ['Columns (columns9)'];

  // Select only the icon and label for each column
  const columnDivs = Array.from(element.querySelectorAll(':scope > div.flex.justify-center'));

  const contentRow = columnDivs.map(col => {
    // Find the first img inside the column
    const img = col.querySelector('img');
    // Find the label text (usually inside a div with uppercase styling)
    const labelDiv = col.querySelector('.mt-2 .inline');
    // Create a fragment to hold icon and label
    const frag = document.createElement('div');
    if (img) frag.appendChild(img.cloneNode(true));
    if (labelDiv) frag.appendChild(labelDiv.cloneNode(true));
    return frag;
  });

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow,
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
