/* Landscape hero motion (homepage). On load the background eases from a
   zoomed-in state down to its base scale; then scrolling through the hero
   scrubs it the rest of the way out, so the image gently zooms out as you
   move toward the next section. Honours prefers-reduced-motion. */
(function () {
  "use strict";
  var hero = document.querySelector('.lhero');
  if (!hero) return;
  var bg = hero.querySelector('.lhero__bg');
  if (!bg) return;

  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var INTRO = 1.45;   // zoomed-in at the very start
  var BASE  = 1.28;   // settled scale at scroll top (matches the CSS default)
  var MIN   = 1.00;   // fully zoomed out by the end of the hero

  // Reduced motion: leave the calm, slightly-zoomed CSS default in place.
  if (RM) return;

  var scale = INTRO, intro = true, raf = 0;

  function heroH() { return hero.offsetHeight || window.innerHeight; }
  function apply() { bg.style.transform = 'scale(' + scale.toFixed(4) + ')'; }

  function scrollScale() {
    var p = Math.min(1, Math.max(0, window.scrollY / heroH()));
    return BASE - (BASE - MIN) * p;
  }

  function onScroll() {
    if (intro) return;
    scale = scrollScale();
    apply();
  }

  var t0 = null, DUR = 1600;
  function introStep(ts) {
    if (t0 === null) t0 = ts;
    var p = Math.min(1, (ts - t0) / DUR);
    var e = 1 - Math.pow(1 - p, 3);          // easeOutCubic
    scale = INTRO + (BASE - INTRO) * e;
    apply();
    if (p < 1) { raf = requestAnimationFrame(introStep); }
    else { intro = false; onScroll(); }
  }

  window.addEventListener('scroll', function () {
    if (intro) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onScroll);
  }, { passive: true });

  // If the page loads already scrolled, skip the intro and sit at scroll scale.
  if (window.scrollY > 4) { intro = false; scale = scrollScale(); apply(); }
  else { apply(); raf = requestAnimationFrame(introStep); }
})();
