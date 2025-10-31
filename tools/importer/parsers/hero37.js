/* global WebImporter */
export default function parse(element, { document }) {
  // Hero (hero37) block: 1 column, 3 rows
  // 1st row: block name
  // 2nd row: background image (none in this case)
  // 3rd row: heading, desktop subheading, desktop CTA button

  const container = element;
  // Heading (first child div)
  const headingDiv = container.querySelector('[data-testid="email-container"] > div');
  // Subheading (second child div, desktop only)
  const subheadingDiv = container.querySelector('[data-testid="email-container"] > div:nth-child(2)');
  let desktopSubheading = null;
  if (subheadingDiv) {
    // Find the span with class 'md:inline' (responsive desktop subheading)
    const spans = subheadingDiv.querySelectorAll('span');
    for (const span of spans) {
      if (span.className.includes('md:inline')) {
        desktopSubheading = span;
        break;
      }
    }
  }
  // Desktop CTA button only
  let ctaLink = null;
  // Find the desktop CTA button by looking for an a[data-testid="emailButton"] inside a div with both 'md:block' and 'hidden' classes
  const ctaWrappers = container.querySelectorAll('div');
  for (const div of ctaWrappers) {
    if (div.className && div.className.includes('md:block') && div.className.includes('hidden')) {
      const link = div.querySelector('a[data-testid="emailButton"]');
      if (link) {
        ctaLink = link;
        break;
      }
    }
  }

  // Compose the content for the third row
  const contentElements = [];
  if (headingDiv) {
    const h1 = document.createElement('h1');
    h1.textContent = headingDiv.textContent.trim();
    contentElements.push(h1);
  }
  if (desktopSubheading) {
    const p = document.createElement('p');
    p.textContent = desktopSubheading.textContent.trim();
    contentElements.push(p);
  }
  if (ctaLink) {
    contentElements.push(ctaLink.cloneNode(true));
  }

  // Build table rows
  const headerRow = ['Hero (hero37)'];
  const imageRow = ['']; // No background image in this case
  const contentRow = [contentElements];

  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
