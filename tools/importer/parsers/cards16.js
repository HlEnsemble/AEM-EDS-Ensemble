/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards16) block header
  const headerRow = ['Cards (cards16)'];

  // Select all card containers using a specific selector
  const cardSelector = '[data-testid="team-card-container"]';
  const cards = Array.from(element.querySelectorAll(cardSelector));

  // Build rows for each card
  const rows = cards.map(card => {
    // Image: first child div contains the image
    const imageContainer = card.firstElementChild;
    const img = imageContainer.querySelector('img');

    // Title: next sibling div (uppercase, bold)
    const titleDiv = imageContainer.nextElementSibling;

    // Description: next sibling div after title
    const descDiv = titleDiv.nextElementSibling;

    // List: next sibling ul after description
    const listUl = descDiv.nextElementSibling;

    // Compose text cell: title (strong), description, list
    // Title as heading (strong)
    const title = document.createElement('strong');
    title.textContent = titleDiv.textContent;
    // Description (paragraph)
    const desc = document.createElement('p');
    desc.textContent = descDiv.textContent;
    // List (clone)
    const list = listUl.cloneNode(true);

    // Compose text cell contents
    const textCell = document.createElement('div');
    textCell.appendChild(title);
    textCell.appendChild(desc);
    textCell.appendChild(list);

    return [img, textCell];
  });

  // Final table: header + card rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
