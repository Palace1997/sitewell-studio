/* Dev-only logo tuner. Hidden unless the URL contains #tune.
   The footer logo (wordmark + baked-in "powered by iTrust Insights" tagline) is
   one image, so this single slider sets its overall height and everything scales
   together. Once you settle on a size, tell Claude the number and it gets baked
   into css/main.css (--footer-logo-size), after which this file can be removed. */
(function () {
  var root = document.documentElement;

  function get(key, def) {
    try { var v = localStorage.getItem(key); return v ? +v : def; } catch (e) { return def; }
  }
  function set(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }

  var logo = get('fd_logo', 84);
  function apply() { root.style.setProperty('--footer-logo-size', logo + 'px'); }

  var built = false;
  function build() {
    if (built || !/tune/.test(location.hash)) return;
    built = true;
    apply();
    var p = document.createElement('div');
    p.setAttribute('data-tuner', '');
    p.style.cssText = 'position:fixed;bottom:18px;right:18px;z-index:99999;background:#0B362A;color:#F0EBE1;' +
      'border:1px solid #1d5143;border-radius:12px;padding:14px 16px;width:238px;' +
      'font:14px/1.4 Inter,system-ui,sans-serif;box-shadow:0 12px 34px rgba(0,0,0,.4)';
    p.innerHTML =
      '<div style="font-weight:600;margin-bottom:12px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:#5CC2A3">Logo tuner (dev)</div>' +
      '<label style="display:block">' +
        '<span style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12.5px">' +
          '<span>Overall logo size</span><b id="fd-o">' + logo + 'px</b></span>' +
        '<input id="fd-logo" type="range" min="48" max="160" step="1" value="' + logo + '" style="width:100%">' +
      '</label>' +
      '<div style="font-size:11px;color:#9fc3b7;margin-top:8px">Logo and tagline scale together (they are one image).</div>' +
      '<div style="font-size:11px;color:#9fc3b7;margin-top:6px">Only shows with #tune in the URL. Tell Claude the size to lock it in.</div>';
    document.body.appendChild(p);

    var el = document.getElementById('fd-logo'), out = document.getElementById('fd-o');
    el.addEventListener('input', function () {
      logo = Math.round(+el.value);
      out.textContent = logo + 'px';
      set('fd_logo', logo);
      apply();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
  window.addEventListener('hashchange', build);
})();
