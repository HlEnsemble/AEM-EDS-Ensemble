/* global WebImporter */
export default function parse(element, { document }) {
  // Table block name row
  const headerRow = ['Table (striped, bordered, tableStripedBordered14)'];

  // Find all cookie tables
  const cookieTables = Array.from(element.querySelectorAll('table'));

  cookieTables.forEach(table => {
    // Find the label above the table (usually in a span and/or a link)
    let labelDiv = table.parentElement;
    // Gather all nodes before the table within its parent
    const labelParts = [];
    let node = labelDiv.firstChild;
    while (node && node !== table) {
      if (node.nodeType === 1) {
        labelParts.push(node.cloneNode(true));
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        const span = document.createElement('span');
        span.textContent = node.textContent;
        labelParts.push(span);
      }
      node = node.nextSibling;
    }
    // Compose label fragment
    const labelFrag = document.createElement('div');
    labelParts.forEach(part => labelFrag.appendChild(part));
    // Extract table rows and flatten them into the block table
    const rows = Array.from(table.querySelectorAll('tr'));
    // The first row in the original table is the header row, so we keep its cells as-is
    // Only use <td> and <th> elements directly, no extra wrapping
    const dataRows = rows.map(row => {
      return Array.from(row.children).map(cell => cell.cloneNode(true));
    });
    // Compose block table: header row, then label row, then table header row, then data rows
    const cells = [headerRow];
    if (labelParts.length) cells.push([labelFrag]);
    dataRows.forEach(rowArr => cells.push(rowArr));
    const block = WebImporter.DOMUtils.createTable(cells, document);
    labelDiv.replaceWith(block);
  });
}
