/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards18) block: 2 columns, multiple rows, header row is block name
  const headerRow = ['Cards (cards18)'];
  const rows = [headerRow];

  // Find all card elements using a specific selector
  const cardNodes = element.querySelectorAll('[data-testid="storyCard"]');

  cardNodes.forEach(card => {
    // Image: always the first img inside the card
    const imgWrapper = card.querySelector('div > img')?.parentElement;
    let img = imgWrapper?.querySelector('img');
    // Defensive: fallback if structure changes
    if (!img && card.querySelector('img')) img = card.querySelector('img');

    // Text content: find the flex-row-reverse div
    const textRow = card.querySelector('.flex-row-reverse');
    let year = '';
    let desc = '';
    if (textRow) {
      // Year is in a rotated div inside the first child
      const yearDiv = textRow.querySelector('.rotate-90');
      if (yearDiv) {
        year = yearDiv.textContent.trim();
      }
      // Description is the paragraph
      const p = textRow.querySelector('p');
      if (p) {
        desc = p.textContent.trim();
      }
    }

    // Compose text cell: year as heading, then description
    const textCell = document.createElement('div');
    if (year) {
      const heading = document.createElement('h3');
      heading.textContent = year;
      textCell.appendChild(heading);
    }
    if (desc) {
      const para = document.createElement('p');
      para.textContent = desc;
      textCell.appendChild(para);
    }

    // Add row: [image, text cell]
    rows.push([img, textCell]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
