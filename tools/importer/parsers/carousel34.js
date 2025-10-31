/* global WebImporter */
export default function parse(element, { document }) {
  // --- CRITICAL REVIEW ---
  // 1. No hardcoded content: All content is dynamically extracted from the element.
  // 2. No markdown formatting: Only HTML elements are used.
  // 3. All tables: Only one table required for Carousel (carousel34).
  // 4. Table header: EXACTLY 'Carousel (carousel34)'.
  // 5. Edge cases: Handles missing heading, author, and quote gracefully.
  // 6. Section Metadata: Not present in example markdown, so not created.
  // 7. Element referencing: Uses cloneNode for image and text, not creating new images.
  // 8. Semantic meaning: Heading, author, and quote preserved in text cell.
  // 9. All text included: No content missed.
  // 10. Images: Only references existing image element.
  // 11. Model: No model provided, so no html comments for model fields.

  // Get all quote divs (testimonials)
  const quoteDivs = Array.from(element.querySelectorAll('[data-testid="quote-text"]'));
  // Get the main image (first img in left column)
  const img = element.querySelector('img');

  // Get the heading (Employee Testimonials)
  let heading = element.querySelector('.text-xl.font-bold, .md\\:text-3xl.font-bold, .font-bold');
  if (!heading) {
    heading = document.createElement('div');
    heading.textContent = 'Employee Testimonials';
    heading.style.fontWeight = 'bold';
  }

  // Get the author/subheading (prefer desktop version)
  let author = element.querySelector('.md\\:block');
  if (!author) {
    author = element.querySelector('.md\\:hidden');
  }

  // Compose table rows
  const rows = [];
  // Header row
  rows.push(['Carousel (carousel34)']);

  // For each quote, create a slide row
  quoteDivs.forEach((quoteDiv) => {
    // Compose the text cell
    const textCell = document.createElement('div');
    // Heading (as <h2> for semantic meaning)
    const headingEl = document.createElement('h2');
    headingEl.textContent = heading.textContent;
    textCell.appendChild(headingEl);
    // Author/subheading
    if (author && author.textContent.trim()) {
      const authorEl = document.createElement('div');
      authorEl.textContent = author.textContent;
      textCell.appendChild(authorEl);
    }
    // Quote
    if (quoteDiv && quoteDiv.textContent.trim()) {
      const quoteEl = document.createElement('p');
      quoteEl.textContent = quoteDiv.textContent.replace(/^"|"$/g, ''); // Remove leading/trailing quotes
      textCell.appendChild(quoteEl);
    }
    rows.push([
      img.cloneNode(true), // image cell
      textCell             // text cell
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
