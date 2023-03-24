// Import Bootstrap bundle
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

// Import KaTeX
import '../node_modules/katex/dist/katex.min.js';
import '../node_modules/katex/dist/contrib/auto-render.min.js';

// Render KaTeX on page load
window.onload = () => renderMathInElement(document.body);