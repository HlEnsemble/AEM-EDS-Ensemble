/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main columns container
  const columnsContainer = element.querySelector('[data-testid="sectionContainer"] > div');
  if (!columnsContainer) return;

  // Get the two columns
  const columnEls = columnsContainer.children;
  if (columnEls.length < 2) return;

  // --- LEFT COLUMN: IMAGE ---
  const imageEl = columnEls[0].querySelector('img');

  // --- RIGHT COLUMN: TEXT ---
  const rightCol = columnEls[1];
  const textBlock = rightCol.querySelector('.flex.flex-col > div');
  // Heading
  const heading = textBlock?.querySelector('[data-testid="sectionHeader"]');
  // Description
  const description = textBlock?.querySelector('[data-testid="sectionDescription"]');
  // Collect both buttons (desktop and mobile) by class names, not pseudo selectors
  const buttonDesktop = textBlock?.querySelector('button.md\\:block');
  const buttonMobile = textBlock?.querySelector('button.md\\:hidden');

  // Compose right column cell
  const rightCell = document.createElement('div');
  if (heading) rightCell.appendChild(heading);
  if (description) rightCell.appendChild(description);
  if (buttonDesktop) rightCell.appendChild(buttonDesktop);
  if (buttonMobile) rightCell.appendChild(buttonMobile);

  // Build table
  const headerRow = ['Columns (columns36)'];
  const contentRow = [imageEl, rightCell];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
