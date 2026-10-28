/* Immersive hero: value-pillar chapters that swap the headline, blurb and
   background, with decode-text labels and a one-time entrance. Original to
   FrontDoor. Degrades gracefully with prefers-reduced-motion. */
(function () {
  "use strict";
  var xhero = document.querySelector('.xhero');
  if (!xhero) return;
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  var CHAPTERS = [
    [['Behavioral Health Websites,', 'Built For You'],
      'Pick a design made for your kind of practice. We shape every page, word and image around how you work.'],
    [['We Write It, Build It,', 'And Look After It'],
      'From the first draft to launch and every change after, the website stays off your plate so your hours go to your clients.'],
    [['Made For Your', 'Kind Of Practice'],
      'Psychiatry, counseling, family therapy, ABA, recovery support and more. Each design already speaks your field’s language.'],
    [['Looked After,', 'Long After Launch'],
      'Hosting, updates and a real person to reach. Your site stays current and cared for without you touching a line of code.'],
    [['Built With Care', 'And Credibility'],
      'Private by default, with the 988 crisis line in every footer and no client details ever collected through a form.']
  ];

  /* ---- decode labels ---- */
  var labels = [].slice.call(xhero.querySelectorAll('.t'));
  labels.forEach(function (el) { el.dataset.text = el.textContent; });
  function settle(el) { if (el._raf) { cancelAnimationFrame(el._raf); el._raf = 0; } el.textContent = el.dataset.text; }
  function decode(el) {
    if (RM) { settle(el); return; }
    var text = el.dataset.text, n = text.length, t0 = performance.now(), last = 0, rand = new Array(n);
    function roll() { for (var i = 0; i < n; i++) rand[i] = CH.charAt((Math.random() * 26) | 0); }
    roll();
    function step(now) {
      var p = Math.min(1, (now - t0) / 420), front = p * n, out = '', i;
      if (now - last > 45) { roll(); last = now; }
      for (i = 0; i < n; i++) {
        var c = text.charAt(i);
        if (i < front) out += c;
        else if (i < front + 3.6) out += (c === ' ' ? ' ' : rand[i]);
        else break;
      }
      el.textContent = out;
      if (p < 1) el._raf = requestAnimationFrame(step); else settle(el);
    }
    el._raf = requestAnimationFrame(step);
  }
  [].forEach.call(xhero.querySelectorAll('a,button'), function (el) {
    var t = el.querySelector('.t');
    if (t) el.addEventListener('pointerenter', function () { decode(t); });
  });

  /* ---- chapters ---- */
  var imgs = [].slice.call(xhero.querySelectorAll('.xhero__img'));
  var rail = [].slice.call(xhero.querySelectorAll('.xrail li'));
  var rises = [].slice.call(xhero.querySelectorAll('.xrise'));
  var blurb = xhero.querySelector('.xblurb');
  var cur = 0, swapT = 0;

  function go(i) {
    if (i === cur || !CHAPTERS[i]) return;
    cur = i;
    rail.forEach(function (li, k) {
      li.classList.toggle('on', k === i);
      var b = li.querySelector('button'); if (b) b.setAttribute('aria-current', k === i ? 'true' : 'false');
    });
    imgs.forEach(function (im, k) { im.classList.toggle('on', k === i); });
    var c = CHAPTERS[i];
    clearTimeout(swapT);
    xhero.classList.add('swap');
    swapT = setTimeout(function () {
      rises[0].textContent = c[0][0];
      rises[1].textContent = c[0][1];
      blurb.textContent = c[1];
      void xhero.offsetWidth;
      xhero.classList.remove('swap');
    }, RM ? 0 : 420);
  }
  rail.forEach(function (li, i) {
    var b = li.querySelector('button');
    if (b) b.addEventListener('click', function () { decode(b.querySelector('.t')); go(i); });
  });

  /* ---- scroll cue ---- */
  var sc = document.getElementById('xscroll');
  if (sc) sc.addEventListener('click', function (e) {
    e.preventDefault();
    var t = document.querySelector('#why') || document.querySelector('.tagband') || xhero.nextElementSibling;
    if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---- entrance + boot decode ---- */
  function boot() {
    if (RM) { labels.forEach(settle); return; }
    xhero.classList.add('is-anim');
    setTimeout(function () { xhero.classList.remove('is-anim'); }, 2400);
    xhero.querySelectorAll('.xrail .t').forEach(function (el, i) { setTimeout(function () { decode(el); }, 700 + i * 70); });
    setTimeout(function () { decode(xhero.querySelector('.xcta .t')); }, 1000);
    [].forEach.call(xhero.querySelectorAll('.xdock .t'), function (el, i) { setTimeout(function () { decode(el); }, 1060 + i * 70); });
    setTimeout(function () { labels.forEach(settle); }, 2800);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot); else addEventListener('load', boot);
})();
