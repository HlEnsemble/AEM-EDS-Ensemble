/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for the block
  const headerRow = ['Columns (columns19)'];

  // Find the contact list container
  const contactList = element.querySelector('[data-testid="contact-list"]');
  if (!contactList) return;

  // Get all direct children (each is a card wrapper)
  const cardWrappers = Array.from(contactList.children);

  // Extract all contact-card elements
  const cards = cardWrappers.map(wrapper => wrapper.querySelector('[data-testid="contact-card"]')).filter(Boolean);

  // Defensive: ensure we have cards
  if (cards.length === 0) return;

  // Arrange cards into rows of 2 columns each (as per screenshot)
  const rows = [];
  for (let i = 0; i < cards.length; i += 2) {
    const row = [];
    row.push(cards[i]);
    if (cards[i + 1]) {
      row.push(cards[i + 1]);
    } else {
      // If odd number, pad with empty cell
      row.push('');
    }
    rows.push(row);
  }

  // Build the table data: header + rows
  const tableData = [headerRow, ...rows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableData, document);

  // Replace the original element
  element.replaceWith(block);
}
