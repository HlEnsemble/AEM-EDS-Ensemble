/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card image and text content
  function extractLargeCard(cardEl) {
    const link = cardEl.querySelector('a[data-testid="portfolio-card"]');
    let imageContainer, image, logo, label;
    if (link) {
      imageContainer = link.querySelector('div.w-full.h-full');
      if (imageContainer) {
        const imgs = imageContainer.querySelectorAll('img');
        image = imgs[0];
        logo = imgs[1];
      }
      label = link.querySelector('div.absolute.pointer-events-none.top-0.left-0');
    }
    // Compose image cell: background + logo stacked
    const imageCell = document.createElement('div');
    if (image) imageCell.appendChild(image.cloneNode(true));
    if (logo) imageCell.appendChild(logo.cloneNode(true));
    // Compose text cell: label + brand (from logo alt, always present)
    const textCell = document.createElement('div');
    if (label) textCell.appendChild(label.cloneNode(true));
    // Add brand name from logo alt as heading if present
    if (logo && logo.alt) {
      const brand = document.createElement('h3');
      brand.textContent = logo.alt.replace(/ Case Study| Portfolio Card/, '').trim();
      textCell.appendChild(brand);
    }
    return [imageCell, textCell];
  }

  function extractSmallCard(cardEl) {
    const card = cardEl.querySelector('[data-testid="portfolio-card"]');
    let image, logo;
    if (card) {
      const imgs = card.querySelectorAll('img');
      image = imgs[0];
      logo = imgs[1];
    }
    // Compose image cell: background + logo stacked
    const imageCell = document.createElement('div');
    if (image) imageCell.appendChild(image.cloneNode(true));
    if (logo) imageCell.appendChild(logo.cloneNode(true));
    // Compose text cell: brand (from logo alt), description, CTA
    const textCell = document.createElement('div');
    if (logo && logo.alt) {
      const brand = document.createElement('h3');
      brand.textContent = logo.alt.replace(' Portfolio Card', '').replace(' Case Study', '').trim();
      textCell.appendChild(brand);
    }
    // Extract description and CTA from the flipped card (only once)
    const flipped = cardEl.querySelector('[data-testid="flipped-portfolio-card"]');
    if (flipped) {
      const desc = flipped.querySelector('p');
      if (desc && desc.textContent.trim()) textCell.appendChild(desc.cloneNode(true));
      const ctaLink = flipped.querySelector('a[data-testid="flipped-portfolio-card-cta"]');
      if (ctaLink && ctaLink.textContent.trim()) {
        textCell.appendChild(ctaLink.cloneNode(true));
        // Also check for extra visible text next to the link
        const extra = ctaLink.parentNode.querySelector('div:not([class*="hidden"])');
        if (extra && extra.textContent.trim()) {
          textCell.appendChild(extra.cloneNode(true));
        }
      } else {
        const ctaBtn = flipped.querySelector('button[data-testid="flipped-portfolio-card-cta"]');
        if (ctaBtn && ctaBtn.textContent.trim()) textCell.appendChild(ctaBtn.cloneNode(true));
      }
    }
    return [imageCell, textCell];
  }

  // Find the grid container
  const grid = element.querySelector('.grid.grid-cols-2');
  if (!grid) return;
  const leftCol = grid.children[0];
  const rightCol = grid.children[1];

  // Large card (left)
  let largeCardRow;
  const largeCardContainer = leftCol.querySelector('[data-testid="large-card-container"]');
  if (largeCardContainer) {
    largeCardRow = extractLargeCard(largeCardContainer);
  }

  // Small cards (right)
  const smallCardRows = [];
  const smallCardContainer = rightCol.querySelector('[data-testid="small-card-container"]');
  if (smallCardContainer) {
    const smallCards = smallCardContainer.querySelectorAll('[data-testid="small-card"]');
    smallCards.forEach(cardEl => {
      smallCardRows.push(extractSmallCard(cardEl));
    });
  }

  // Compose table rows
  const rows = [
    ['Cards (cards27)'],
  ];
  if (largeCardRow) rows.push(largeCardRow);
  smallCardRows.forEach(row => rows.push(row));

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
