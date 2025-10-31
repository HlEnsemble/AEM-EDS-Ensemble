/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with the header row
  const headerRow = ['Columns (columns29)'];

  // Find all carousel items (each is a 3x3 grid)
  const carouselItems = element.querySelectorAll('[data-testid^="carousel-item-"]');

  // We'll collect all rows for all carousel items
  const contentRows = [];
  carouselItems.forEach((carouselItem) => {
    // Each card is a [data-testid="card-container"]
    const cardContainers = carouselItem.querySelectorAll('[data-testid="card-container"]');
    // Group into rows of 3
    for (let i = 0; i < cardContainers.length; i += 3) {
      const row = [];
      for (let j = 0; j < 3; j++) {
        const card = cardContainers[i + j];
        if (card) {
          const img = card.querySelector('img');
          // Create a cell with both the image and its alt text as visible text
          const cell = document.createElement('div');
          if (img) {
            cell.appendChild(img.cloneNode(true));
            // Add visible alt text below the image
            const altText = img.getAttribute('alt');
            if (altText) {
              const text = document.createElement('div');
              text.textContent = altText;
              cell.appendChild(text);
            }
          }
          // Also include any text nodes directly in the card container
          Array.from(card.childNodes).forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              const text = document.createElement('div');
              text.textContent = node.textContent.trim();
              cell.appendChild(text);
            }
          });
          row.push(cell);
        } else {
          row.push('');
        }
      }
      contentRows.push(row);
    }
  });

  // Compose the table data
  const tableData = [headerRow, ...contentRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
