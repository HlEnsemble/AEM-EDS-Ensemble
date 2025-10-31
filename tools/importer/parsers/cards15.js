/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get images for a card (prefer desktop, fallback to mobile)
  function getCardImages(card) {
    const desktopImages = card.querySelectorAll('[data-testid="officeImages"] img');
    if (desktopImages.length > 0) {
      return Array.from(desktopImages);
    }
    const mobileImage = card.querySelector('[data-testid="officeImagesMobile"] img');
    return mobileImage ? [mobileImage] : [];
  }

  // Helper: get text content for a card (preserves all text and links)
  function getCardTextContent(card) {
    // Find the content container
    let content = card.querySelector('.p-2, .sm\\:px-0, [class*="px-0"]');
    if (!content) {
      content = card.querySelector('div:has(h2)');
    }
    if (!content) return [];
    // Build a fragment with all children (preserving structure)
    const frag = document.createDocumentFragment();
    Array.from(content.childNodes).forEach(node => {
      frag.appendChild(node.cloneNode(true));
    });
    return frag;
  }

  // Find all card elements
  const cards = element.querySelectorAll('[data-testid="officeCard"]');

  // Build table rows
  const rows = [];
  rows.push(['Cards (cards15)']); // Critical: header row
  cards.forEach(card => {
    const images = getCardImages(card);
    // If multiple images, wrap in a fragment
    let imageCell;
    if (images.length === 1) {
      imageCell = images[0];
    } else if (images.length > 1) {
      const imgFrag = document.createDocumentFragment();
      images.forEach(img => imgFrag.appendChild(img));
      imageCell = imgFrag;
    } else {
      imageCell = '';
    }
    const textCell = getCardTextContent(card);
    rows.push([imageCell, textCell]);
  });

  // Create table and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
