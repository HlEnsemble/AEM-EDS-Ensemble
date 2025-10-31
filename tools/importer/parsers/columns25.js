/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the image for the left column
  const image = element.querySelector('img');

  // Extract heading, paragraph, and list for the right column
  const heading = element.querySelector('.text-2xl, .font-bold, .md\\:font-extrabold');
  // Find the paragraph below the heading
  let paragraph = null;
  if (heading) {
    // The paragraph is the next div sibling after heading
    paragraph = heading.parentElement.querySelector('.text-base');
  }
  // Find the list (ul) below the paragraph
  const list = element.querySelector('ul');

  // Compose the right column cell: only heading, paragraph, and list
  const rightCol = document.createElement('div');
  if (heading) rightCol.appendChild(heading.cloneNode(true));
  if (paragraph) rightCol.appendChild(paragraph.cloneNode(true));
  if (list) rightCol.appendChild(list.cloneNode(true));

  // Build the table
  const table = WebImporter.DOMUtils.createTable([
    ['Columns (columns25)'],
    [image ? image : '', rightCol]
  ], document);

  // Replace the original element
  element.replaceWith(table);
}
