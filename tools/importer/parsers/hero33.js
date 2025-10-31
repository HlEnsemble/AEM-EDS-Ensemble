/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero33) block: 1 column, 3 rows
  // Row 1: Header
  // Row 2: Image
  // Row 3: Heading, subheading, CTA (if present)

  // 1. Header row
  const headerRow = ['Hero (hero33)'];

  // 2. Image row
  // Find the image inside the element
  let imageEl = null;
  const imageContainer = element.querySelector('[data-testid="partnership-description-image"]');
  if (imageContainer) {
    // Prefer <img> inside <picture>
    imageEl = imageContainer.querySelector('img');
  }
  // Defensive fallback if image is not found
  if (!imageEl) {
    imageEl = element.querySelector('img');
  }

  // 3. Content row
  // Heading
  const headingEl = element.querySelector('[data-testid="partnership-header"]');
  // Subheading/description
  const descEl = element.querySelector('[data-testid="partnership-description"]');

  // Find CTA (anchor) if present in hero text area
  let ctaEl = null;
  // Look for a link in heading or description
  if (headingEl) {
    ctaEl = headingEl.querySelector('a');
  }
  if (!ctaEl && descEl) {
    ctaEl = descEl.querySelector('a');
  }

  // Compose content row
  const contentRow = [];
  // Only push actual elements, not arrays
  if (headingEl) contentRow.push(headingEl);
  if (descEl) contentRow.push(descEl);
  if (ctaEl) contentRow.push(ctaEl);

  // Compose table rows
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentRow]
  ];

  // Create table and replace element
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
