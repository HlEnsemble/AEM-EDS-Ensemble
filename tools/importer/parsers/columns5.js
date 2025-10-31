/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to clone and preserve all text and images in a node
  function cloneContent(src) {
    const div = document.createElement('div');
    Array.from(src.childNodes).forEach((node) => {
      div.appendChild(node.cloneNode(true));
    });
    return div;
  }

  // Find the main content wrapper (the one with md:flex)
  const contentWrapper = Array.from(element.querySelectorAll('div')).find(div => div.className.includes('md:flex'));
  if (!contentWrapper) return;

  // Find the first grid-cols-2 block (main columns)
  const grid2 = Array.from(contentWrapper.querySelectorAll('div')).find(div => div.className.includes('md:grid') && div.className.includes('grid-cols-2'));
  if (!grid2) return;

  // The first grid-cols-2 contains two grid-cols-2 blocks (left and right)
  const grid2Children = Array.from(grid2.children);
  if (grid2Children.length < 2) return;
  const leftGrid = grid2Children[0];
  const rightGrid = grid2Children[1];

  // Left grid: Locations and Get In Touch
  const leftCols = Array.from(leftGrid.children);
  if (leftCols.length < 2) return;
  const getInTouchCol = leftCols[0];
  const locationsCol = leftCols[1];

  // Right grid: Join Our Team and Legal Links
  const rightCols = Array.from(rightGrid.children);
  if (rightCols.length < 2) return;
  const joinTeamCol = rightCols[0];
  const legalLinksCol = rightCols[1];

  // Find the bottom grid (logo/social/copyright)
  const bottomGrid = Array.from(contentWrapper.querySelectorAll('div')).find(div => div.className.includes('md:grid') && div.className.includes('grid-cols-4'));
  if (!bottomGrid) return;

  // Bottom grid columns
  const bottomCols = Array.from(bottomGrid.children);
  // 0: logo, 1: social, 2: hidden, 3: copyright
  const logoCol = bottomCols[0];
  const socialCol = bottomCols[1];
  const copyrightCol = bottomCols[3];

  // Compose table rows
  const headerRow = ['Columns (columns5)'];

  // Main content row: 4 columns, clone content to ensure all text/images included
  // Place logo and locations together, LinkedIn and Get In Touch together
  const locationsWithLogo = document.createElement('div');
  locationsWithLogo.appendChild(cloneContent(locationsCol));
  locationsWithLogo.appendChild(cloneContent(logoCol));

  const getInTouchWithSocial = document.createElement('div');
  getInTouchWithSocial.appendChild(cloneContent(getInTouchCol));
  getInTouchWithSocial.appendChild(cloneContent(socialCol));

  // Third column: Join Our Team
  const joinTeamContent = cloneContent(joinTeamCol);

  // Fourth column: Legal links and copyright info
  const legalLinksList = legalLinksCol.querySelector('ul');
  const copyrightDiv = cloneContent(copyrightCol);
  const legalAndCopyright = document.createElement('div');
  if (legalLinksList) legalAndCopyright.appendChild(legalLinksList.cloneNode(true));
  Array.from(copyrightDiv.childNodes).forEach(node => legalAndCopyright.appendChild(node));

  // Build table
  const cells = [
    headerRow,
    [locationsWithLogo, getInTouchWithSocial, joinTeamContent, legalAndCopyright]
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element
  element.replaceWith(table);
}
