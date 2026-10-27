/* FrontDoor, design gallery (portfolio catalog)
   Filters: practice area (dropdown), practice type (pills), keyword search.
   State lives in the URL (?area=&type=&q=) so the homepage finder and links deep-link in. */
(function () {
  var C = window.SW_CATALOG, S = window.SWD; if (!C || !S) return;
  var grid = document.getElementById('designGrid'); if (!grid) return;
  var areaSel = document.getElementById('catAreaSel'), typesEl = document.getElementById('catTypes');
  var search = document.getElementById('catSearch'), head = document.getElementById('catHead');
  var countEl = document.getElementById('catCount'), guide = document.getElementById('catGuide');

  var params = new URLSearchParams(location.search);
  var state = { area: params.get('area') || '', type: params.get('type') || '', q: params.get('q') || '' };
  if (state.area && !S.byId(C.areas, state.area)) state.area = '';
  if (state.type && !S.byId(C.types, state.type)) state.type = '';
  search.value = state.q;

  var builtIn = function (areaId) { return C.designs.filter(function (d) { return !d.soon && (!areaId || d.area === areaId); }).length; };

  /* Practice-area dropdown, grouped, with counts */
  areaSel.innerHTML = '<option value="">All designs (' + builtIn() + ')</option>' + C.groups.map(function (g) {
    return '<optgroup label="' + S.esc(g.name) + '">' + C.areas.filter(function (a) { return a.group === g.id; }).map(function (a) {
      return '<option value="' + a.id + '">' + S.esc(a.name) + ' (' + builtIn(a.id) + ')</option>';
    }).join('') + '</optgroup>';
  }).join('');
  areaSel.value = state.area;

  /* Practice-type pills, limited to the types that exist in the chosen area
     so a zero-result combination can never be selected. */
  function typesInArea(areaId) {
    var seen = {}; C.designs.forEach(function (d) { if (!areaId || d.area === areaId) seen[d.type] = 1; });
    return C.types.filter(function (t) { return seen[t.id]; });
  }
  function renderTypes() {
    var avail = typesInArea(state.area);
    if (state.type && !avail.some(function (t) { return t.id === state.type; })) state.type = '';
    typesEl.innerHTML = '<button class="cat__type' + (state.type ? '' : ' is-active') + '" data-type="">All types</button>' +
      avail.map(function (t) { return '<button class="cat__type' + (state.type === t.id ? ' is-active' : '') + '" data-type="' + t.id + '">' + S.esc(t.name) + '</button>'; }).join('');
  }

  function matches(d) {
    if (state.area && d.area !== state.area) return false;
    if (state.type && d.type !== state.type) return false;
    if (state.q) {
      var hay = [d.name, d.practice, d.feel, d.best, S.areaName(d.area), S.typeName(d.type)].join(' ').toLowerCase();
      if (hay.indexOf(state.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function render() {
    var list = C.designs.filter(matches);

    var a = S.byId(C.areas, state.area);
    head.textContent = a ? a.blurb : 'Real, working websites for every corner of behavioral health. Pick your practice area, preview any design, then choose the one that fits.';
    countEl.textContent = list.length + (list.length === 1 ? ' design' : ' designs') + (state.type ? ' for ' + S.typeName(state.type).toLowerCase() + 's' : '');
    grid.innerHTML = list.length ? list.map(S.cardHTML).join('') : '<p style="grid-column:1/-1;color:var(--g-500);padding:20px 0">No designs match that search. Clear it to see all designs.</p>';
    S.hydrate(grid);

    if (a && list.length > 1) {
      guide.hidden = false;
      guide.innerHTML = '<h3>Compare The ' + S.esc(a.name) + ' Designs</h3><table><thead><tr><th>Design</th><th>Practice type</th><th>Look and feel</th><th>Best for</th></tr></thead><tbody>' +
        list.map(function (d) { return '<tr><td>' + S.esc(d.name) + '</td><td>' + S.esc(S.typeName(d.type)) + '</td><td>' + S.esc(d.feel) + '</td><td>' + S.esc(d.best) + '</td></tr>'; }).join('') +
        '</tbody></table>';
    } else { guide.hidden = true; guide.innerHTML = ''; }

    var q = []; if (state.area) q.push('area=' + state.area); if (state.type) q.push('type=' + state.type); if (state.q) q.push('q=' + encodeURIComponent(state.q));
    history.replaceState(null, '', location.pathname + (q.length ? '?' + q.join('&') : ''));
  }

  areaSel.addEventListener('change', function () { state.area = areaSel.value; renderTypes(); render(); });
  typesEl.addEventListener('click', function (e) { var b = e.target.closest('[data-type]'); if (!b) return; state.type = b.dataset.type; renderTypes(); render(); });
  var t; search.addEventListener('input', function () { clearTimeout(t); t = setTimeout(function () { state.q = search.value.trim(); render(); }, 150); });

  renderTypes(); render();
})();
