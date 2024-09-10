// Import Bootstrap bundle
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js';

// Import KaTeX
import '../node_modules/katex/dist/katex.min.js';
import '../node_modules/katex/dist/contrib/auto-render.min.js';

// Render KaTeX on page load
window.onload = () => renderMathInElement(document.body);

// Matomo analytics
var _paq = window._paq = window._paq || [];
/* tracker methods like "setCustomDimension" should be called before "trackPageView" */
_paq.push(['trackPageView']);
_paq.push(['enableLinkTracking']);
(function() {
  var u="//analytics.sfriedli.org/";
  _paq.push(['setTrackerUrl', u+'matomo.php']);
  _paq.push(['setSiteId', '2']);
  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
  g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
})();