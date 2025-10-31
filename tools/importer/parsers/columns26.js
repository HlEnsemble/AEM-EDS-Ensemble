/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Columns (columns26)'];

  // --- COLUMN 1: Image ---
  const heroImageContainer = element.querySelector('[data-testid="hero-image-container"]');
  let imageCellContent = [];
  if (heroImageContainer) {
    const picture = heroImageContainer.querySelector('picture');
    if (picture) imageCellContent.push(picture);
    const svgLogo = heroImageContainer.querySelector('img[src$="AdobeLogo.svg"]');
    if (svgLogo) imageCellContent.push(svgLogo);
  }

  // --- COLUMN 2: Text, tags, description ---
  // Only use desktop details container (do not include mobile/tablet)
  let textCellContent = [];
  const desktopDetails = element.querySelector('[data-testid="details-container"]');
  if (desktopDetails) {
    Array.from(desktopDetails.children).forEach(child => {
      if (child.textContent.trim() || child.querySelector('[data-testid="tags-container"]')) {
        textCellContent.push(child);
      }
    });
  }

  // Build table rows
  const rows = [
    headerRow,
    [imageCellContent, textCellContent]
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace element
  element.replaceWith(block);
}
