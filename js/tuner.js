/* Dev-only logo tuner. Hidden unless the URL contains #tune (works on the live
   site too: add #tune to the address). Sliders set the nav and footer logo
   heights live and remember your last values in this browser. Once you settle,
   tell Claude the numbers and they get baked into css/main.css
   (--nav-logo-size, --footer-logo-size); this file can then be removed. */
(function () {
  var root = document.documentElement;

  function get(key, def) {
    try { var v = localStorage.getItem(key); return v ? +v : def; } catch (e) { return def; }
  }
  function set(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }

  var nav = get('fd_nav', 64);
  var foot = get('fd_logo', 84);

  function apply() {
    root.style.setProperty('--nav-logo-size', nav + 'px');
    root.style.setProperty('--footer-logo-size', foot + 'px');
  }

  function row(label, id, min, max, val) {
    return '<label style="display:block;margin-bottom:12px">' +
      '<span style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:12.5px">' +
      '<span>' + label + '</span><b id="' + id + '-o">' + val + 'px</b></span>' +
      '<input id="' + id + '" type="range" min="' + min + '" max="' + max + '" step="1" value="' + val + '" style="width:100%">' +
      '</label>';
  }

  function bind(id, onChange) {
    var el = document.getElementById(id), out = document.getElementById(id + '-o');
    el.addEventListener('input', function () {
      var v = Math.round(+el.value);
      out.textContent = v + 'px';
      onChange(v);
      apply();
    });
  }

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
      row('Nav logo size', 'fd-nav', 40, 92, nav) +
      row('Footer logo size', 'fd-logo', 48, 160, foot) +
      '<div style="font-size:11px;color:#9fc3b7;margin-top:6px">Only shows with #tune in the URL. Tell Claude the sizes to lock them in.</div>';
    document.body.appendChild(p);

    bind('fd-nav', function (v) { nav = v; set('fd_nav', v); });
    bind('fd-logo', function (v) { foot = v; set('fd_logo', v); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
  window.addEventListener('hashchange', build);
})();
