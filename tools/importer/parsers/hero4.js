/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Hero (hero4)
  const headerRow = ['Hero (hero4)'];

  // --- Extract image (background/decorative) ---
  let imageEl = null;
  // Find the image in the left column (icon)
  const imgDiv = Array.from(element.querySelectorAll('div')).find(div =>
    div.querySelector('img')
  );
  if (imgDiv) {
    imageEl = imgDiv.querySelector('img');
  }

  // --- Extract main content (heading, paragraph, CTA) ---
  let contentEls = [];
  // Find the main content container (contains heading, paragraph, buttons)
  const mainContentDiv = Array.from(element.querySelectorAll('div')).find(div =>
    div.querySelector('h2') && div.querySelector('p')
  );
  if (mainContentDiv) {
    // Heading
    const heading = mainContentDiv.querySelector('h2');
    if (heading) contentEls.push(heading);
    // Paragraph
    const paragraph = mainContentDiv.querySelector('p');
    if (paragraph) contentEls.push(paragraph);
    // CTA buttons: only include desktop version (md:flex)
    const ctaDiv = Array.from(mainContentDiv.querySelectorAll('div')).find(div =>
      div.classList.contains('hidden') && div.classList.contains('md:flex')
    );
    if (ctaDiv) {
      const buttons = Array.from(ctaDiv.querySelectorAll('button'));
      if (buttons.length) contentEls.push(...buttons);
    }
  }

  // --- Build table rows ---
  const rows = [
    headerRow,
    [imageEl ? imageEl : ''],
    [contentEls]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
