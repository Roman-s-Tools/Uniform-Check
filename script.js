const STORAGE_KEY = 'cap_uniform_builder_profile_v1';
const UNIFORM_TYPES = ['Male Blues', 'Female Blues', 'Service Dress'];

const ribbons = [
  { id: 'silver_medal_valor', name: 'Silver Medal of Valor', category: 'Decorations', precedence: 10, allowedDevices: [], notes: 'No devices.' },
  { id: 'bronze_medal_valor', name: 'Bronze Medal of Valor', category: 'Decorations', precedence: 20, allowedDevices: [], notes: 'No devices.' },
  { id: 'distinguished_service', name: 'Distinguished Service', category: 'Service', precedence: 40, allowedDevices: ['bronze_star', 'silver_star'], notes: 'Verify devices.' },
  { id: 'exceptional_service', name: 'Exceptional Service', category: 'Service', precedence: 50, allowedDevices: ['bronze_star', 'silver_star'] },
  { id: 'meritorious_service', name: 'Meritorious Service', category: 'Service', precedence: 60, allowedDevices: ['bronze_star', 'silver_star'] },
  { id: 'commander_commendation', name: "Commander\'s Commendation", category: 'Service', precedence: 70, allowedDevices: ['bronze_star', 'silver_star'] },
  { id: 'achievement_award', name: 'CAP Achievement Award', category: 'Service', precedence: 80, allowedDevices: ['bronze_star', 'silver_star'] },
  { id: 'cadet_community_service', name: 'Cadet Community Service', category: 'Cadet Program', precedence: 120, allowedDevices: [] },
  { id: 'cadet_encampment', name: 'Cadet Encampment', category: 'Cadet Program', precedence: 130, allowedDevices: [] },
  { id: 'cadet_achievement', name: 'Cadet Achievement Ribbon', category: 'Cadet Program', precedence: 140, allowedDevices: ['bronze_star', 'silver_star'], notes: 'Verify specific milestone ribbon details.' },
  { id: 'red_service', name: 'Red Service Ribbon', category: 'Service', precedence: 200, allowedDevices: ['bronze_clasp', 'silver_clasp'] },
  { id: 'recruiting', name: 'Recruiting Ribbon', category: 'Membership', precedence: 230, allowedDevices: ['bronze_star', 'silver_star'] }
];

const palette = ['#2b4c7e', '#a64253', '#3a8f6d', '#7b4fa3', '#0d7e9c', '#ba8a26', '#4f5967'];
const selected = new Map();

const el = (id) => document.getElementById(id);

function init() {
  for (const selId of ['uniformType', 'profileUniformType']) {
    el(selId).innerHTML = UNIFORM_TYPES.map((u) => `<option value="${u}">${u}</option>`).join('');
  }
  bindEvents();
  hydrateFromURL();
  renderRibbonResults(ribbons);
  renderAll();
}

function bindEvents() {
  el('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    renderRibbonResults(ribbons.filter((r) => `${r.name} ${r.category}`.toLowerCase().includes(q)));
  });
  ['rackWidth', 'uniformType', 'sourcePreset'].forEach((id) => el(id).addEventListener('change', renderAll));
  el('saveProfileBtn').addEventListener('click', saveProfile);
  el('loadProfileBtn').addEventListener('click', loadProfile);
  el('saveBtn').addEventListener('click', saveProfile);
  el('previewBtn').addEventListener('click', renderAll);
  el('shareBtn').addEventListener('click', shareLink);
  el('exportPngBtn').addEventListener('click', exportPNG);
  el('exportPdfBtn').addEventListener('click', exportPDF);
}

function renderRibbonResults(list) {
  el('ribbonResults').innerHTML = list.map((r) => {
    const isChecked = selected.has(r.id);
    const count = selected.get(r.id)?.deviceCount ?? 0;
    return `<article class="ribbon-item">
      <div class="ribbon-title"><strong>${r.name}</strong><small>#${r.precedence}</small></div>
      <small>${r.category}</small>
      <label><input type="checkbox" data-id="${r.id}" ${isChecked ? 'checked' : ''}/> Select ribbon</label>
      <label>DeviceSelector
        <select data-device="${r.id}">
          <option value="0" ${count===0?'selected':''}>No devices</option>
          <option value="1" ${count===1?'selected':''}>1 device</option>
          <option value="2" ${count===2?'selected':''}>2 devices</option>
          <option value="3" ${count===3?'selected':''}>3 devices</option>
        </select>
      </label>
    </article>`;
  }).join('');

  document.querySelectorAll('input[type="checkbox"][data-id]').forEach((c) => {
    c.addEventListener('change', () => toggleRibbon(c.dataset.id, c.checked));
  });
  document.querySelectorAll('select[data-device]').forEach((s) => {
    s.addEventListener('change', () => setDeviceCount(s.dataset.device, Number(s.value)));
  });
}

function toggleRibbon(id, checked) {
  if (checked) selected.set(id, { deviceCount: 0 });
  else selected.delete(id);
  renderAll();
}
function setDeviceCount(id, count) {
  if (!selected.has(id)) selected.set(id, { deviceCount: 0 });
  selected.get(id).deviceCount = count;
  renderAll();
}
function getSortedSelected() {
  return [...selected.entries()]
    .map(([id, meta]) => ({ ...ribbons.find((r) => r.id === id), ...meta }))
    .sort((a, b) => a.precedence - b.precedence);
}

function renderAll() {
  const sorted = getSortedSelected();
  el('selectedRibbons').innerHTML = sorted.map((r) => `<li>${r.name} ${r.deviceCount ? `(devices: ${r.deviceCount})` : ''}</li>`).join('') || '<li>No ribbons selected yet.</li>';
  renderRack(sorted);
  renderWarnings(sorted);
  renderUniformPreview();
}

function renderRack(sorted) {
  const width = Number(el('rackWidth').value || 3);
  const rows = [];
  for (let i = 0; i < sorted.length; i += width) rows.push(sorted.slice(i, i + width));
  const html = rows.map((row) => `<div class="rack-row">${row.map((r, idx) => {
    const color = palette[(r.precedence + idx) % palette.length];
    return `<div class="ribbon-tile" style="background:${color}" title="${r.name}">${r.name.split(' ')[0]}${r.deviceCount ? `<span class="device-count">+${r.deviceCount}</span>` : ''}</div>`;
  }).join('')}</div>`).join('');
  el('rackPreview').innerHTML = html || '<p class="muted">Your ribbon rack preview appears here.</p>';
  el('rackClone').innerHTML = html;
}

function renderUniformPreview() {
  const type = el('uniformType').value;
  document.querySelector('.uniform.torso').style.filter = type === 'Service Dress' ? 'saturate(0.8)' : 'none';
}

function renderWarnings(sorted) {
  const warnings = [];
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].precedence < sorted[i - 1].precedence) warnings.push('Ribbon precedence appears out of order.');
  }
  const width = Number(el('rackWidth').value || 3);
  if (![1, 2, 3, 4].includes(width)) warnings.push('Rack layout is unusual.');
  sorted.forEach((r) => {
    if (r.deviceCount > 0 && (!r.allowedDevices || r.allowedDevices.length === 0)) warnings.push(`${r.name} may not support devices.`);
    if (r.deviceCount > 2) warnings.push(`${r.name} has a high device count; verify against current CAP guidance.`);
  });
  if (!sorted.length) warnings.push('No ribbons selected yet.');
  el('warnings').innerHTML = warnings.map((w) => `<li>${w}</li>`).join('');
}

function saveProfile() {
  const profile = {
    name: el('profileName').value,
    grade: el('profileGrade').value,
    unit: el('profileUnit').value,
    preferredUniformType: el('profileUniformType').value,
    rackWidth: el('rackWidth').value,
    sourcePreset: el('sourcePreset').value,
    selectedRibbons: [...selected.entries()]
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  el('profileStatus').textContent = 'Profile saved locally.';
}

function loadProfile() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return (el('profileStatus').textContent = 'No saved profile found.');
  const p = JSON.parse(raw);
  el('profileName').value = p.name || '';
  el('profileGrade').value = p.grade || '';
  el('profileUnit').value = p.unit || '';
  el('profileUniformType').value = p.preferredUniformType || UNIFORM_TYPES[0];
  el('uniformType').value = p.preferredUniformType || UNIFORM_TYPES[0];
  el('rackWidth').value = p.rackWidth || '3';
  el('sourcePreset').value = p.sourcePreset || 'cadet';
  selected.clear();
  (p.selectedRibbons || []).forEach(([id, meta]) => selected.set(id, meta));
  el('profileStatus').textContent = 'Profile loaded.';
  renderRibbonResults(ribbons);
  renderAll();
}

function shareLink() {
  const payload = btoa(encodeURIComponent(JSON.stringify({
    rackWidth: el('rackWidth').value,
    uniformType: el('uniformType').value,
    selected: [...selected.entries()]
  })));
  const url = `${location.origin}${location.pathname}#rack=${payload}`;
  navigator.clipboard.writeText(url).then(() => (el('profileStatus').textContent = 'Share link copied.'));
}
function hydrateFromURL() {
  const hash = location.hash.match(/rack=(.*)$/);
  if (!hash) return;
  try {
    const data = JSON.parse(decodeURIComponent(atob(hash[1])));
    el('rackWidth').value = data.rackWidth || '3';
    el('uniformType').value = data.uniformType || UNIFORM_TYPES[0];
    selected.clear();
    (data.selected || []).forEach(([id, meta]) => selected.set(id, meta));
  } catch {}
}

function exportPNG() {
  const node = el('rackPreview');
  const w = node.offsetWidth, h = node.offsetHeight;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'><foreignObject width='100%' height='100%'><div xmlns='http://www.w3.org/1999/xhtml'>${node.outerHTML}</div></foreignObject></svg>`;
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0);
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'cap-ribbon-rack.png';
    a.click();
  };
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function exportPDF() {
  window.print();
}

init();
