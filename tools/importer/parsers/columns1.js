/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container
  const mainContainer = element.querySelector('[data-testid="internship-container"]');
  if (!mainContainer) return;
  const children = Array.from(mainContainer.children);
  if (children.length < 2) return;

  // --- LEFT COLUMN: IMAGE ---
  const imageCol = children[0];
  const img = imageCol.querySelector('img');

  // --- RIGHT COLUMN: CONTENT ---
  const contentCol = children[1];
  // Heading: bold, large font
  const heading = contentCol.querySelector('.font-semibold, .font-bold');
  // Description: paragraph
  // Find the first div after heading that contains text
  let desc = null;
  const contentDivs = Array.from(contentCol.children);
  for (let i = 0; i < contentDivs.length; i++) {
    if (contentDivs[i] === heading && i + 1 < contentDivs.length) {
      // Next div is likely the description
      desc = contentDivs[i + 1];
      break;
    }
  }
  // Fallback: get the first div with text that is not heading
  if (!desc) {
    desc = contentCol.querySelector('div:not(.font-semibold):not(.font-bold)');
  }

  // Email button/link
  const emailContainer = contentCol.querySelector('[data-testid="internship-email-container"]');
  let emailLink = null;
  if (emailContainer) {
    emailLink = emailContainer.querySelector('a');
  }

  // Compose right column cell: preserve order and structure
  const rightCellContent = document.createElement('div');
  if (heading) rightCellContent.appendChild(heading);
  if (desc) rightCellContent.appendChild(desc);
  if (emailLink) rightCellContent.appendChild(emailLink);

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns1)'];
  const contentRow = [img, rightCellContent];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
