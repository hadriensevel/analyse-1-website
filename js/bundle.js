// Import Bootstrap bundle
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

// Import KaTeX
import '../node_modules/katex/dist/katex.min.js';
import '../node_modules/katex/dist/contrib/auto-render.min.js';

// Render KaTeX on page load
window.onload = () => renderMathInElement(document.body);

// Matomo analytics
var _mtm = window._mtm = window._mtm || [];
_mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
(function() {
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src='https://analytics.hadri1sev.com/js/container_wNvWf8yD.js'; s.parentNode.insertBefore(g,s);
})();

// Code syntax highlighting
import { highlightCodeTags } from './utils/code-highlighting.js';
highlightCodeTags();