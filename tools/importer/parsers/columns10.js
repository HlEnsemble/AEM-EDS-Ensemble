/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns10)'];

  // Find the main flex container for the hero section
  const heroContainer = element.querySelector('[data-testid="hero-container"]');
  if (!heroContainer) return;

  // Find the two main columns (text and image)
  const columns = heroContainer.querySelectorAll('[class*="items-stretch"]');
  if (columns.length < 2) return;

  // --- Left Column: Textual Content ---
  const leftCol = columns[0];
  // Headline (multiple divs)
  const headlineContainer = leftCol.querySelector('[class*="flex-col"] > [class*="text-2xl"]');
  let headlineElem = null;
  if (headlineContainer) {
    // Preserve line breaks between headline lines
    const lines = Array.from(headlineContainer.children).map(div => div.textContent.trim()).filter(Boolean);
    headlineElem = document.createElement('p');
    headlineElem.innerHTML = `<strong>${lines.join('<br>')}</strong>`;
  }
  // Supporting paragraph
  const paragraph = leftCol.querySelector('p');
  // CTA button
  const ctaDiv = leftCol.querySelector('[data-testid="desktop-hero-cta"]');
  const ctaButton = ctaDiv ? ctaDiv.querySelector('button') : null;

  // Compose left column cell
  const leftCellContent = [];
  if (headlineElem) leftCellContent.push(headlineElem);
  if (paragraph) leftCellContent.push(paragraph);
  if (ctaButton) leftCellContent.push(ctaButton);

  // --- Right Column: Image ---
  const rightCol = columns[1];
  const imgWrapper = rightCol.querySelector('[class*="rounded"]');
  let heroImg = null;
  if (imgWrapper) {
    heroImg = imgWrapper.querySelector('img');
  }

  // Compose right column cell
  const rightCellContent = heroImg ? [heroImg] : [];

  // Build table rows
  const contentRow = [leftCellContent, rightCellContent];

  // Create the block table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
