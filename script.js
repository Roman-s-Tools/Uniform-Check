const MEMBER_TYPES = { adult: 'adult', cadet: 'cadet' };
let memberType = MEMBER_TYPES.adult;

const ribbons = [
  { id:'silver_medal_valor', name:'Silver Medal of Valor', precedence:10, type:'adult', colors:['#1e3a8a','#f3f4f6','#991b1b'] },
  { id:'bronze_medal_valor', name:'Bronze Medal of Valor', precedence:20, type:'adult', colors:['#92400e','#fef3c7','#78350f'] },
  { id:'distinguished_service', name:'Distinguished Service', precedence:40, type:'adult', colors:['#065f46','#bbf7d0','#065f46'] },
  { id:'exceptional_service', name:'Exceptional Service', precedence:50, type:'adult', colors:['#0f766e','#99f6e4','#0f766e'] },
  { id:'meritorious_service', name:'Meritorious Service', precedence:60, type:'adult', colors:['#7c2d12','#fdba74','#7c2d12'] },
  { id:'commanders_commendation', name:"Commander's Commendation", precedence:70, type:'adult', colors:['#1d4ed8','#93c5fd','#1d4ed8'] },
  { id:'achievement_award', name:'CAP Achievement Award', precedence:80, type:'adult', colors:['#4c1d95','#ddd6fe','#4c1d95'] },
  { id:'red_service', name:'Red Service Ribbon', precedence:200, type:'adult', colors:['#991b1b','#fca5a5','#991b1b'] },
  { id:'recruiting', name:'Recruiting Ribbon', precedence:230, type:'adult', colors:['#7f1d1d','#fecaca','#7f1d1d'] },
  { id:'cadet_encampment', name:'Cadet Encampment', precedence:130, type:'cadet', colors:['#0c4a6e','#bae6fd','#0c4a6e'] }
];

const selected = new Set();
const el = (id) => document.getElementById(id);

function ribbonStyle(colors){ return `linear-gradient(90deg, ${colors.map((c,i)=>`${c} ${i*33}% ${(i+1)*33}%`).join(',')})`; }

function init(){
  el('searchInput').addEventListener('input', renderCatalog);
  el('rackWidth').addEventListener('change', renderRack);
  el('adultToggle').addEventListener('click', () => setType(MEMBER_TYPES.adult));
  el('cadetToggle').addEventListener('click', () => setType(MEMBER_TYPES.cadet));
  renderCatalog(); renderRack();
}

function setType(type){
  memberType = type;
  el('adultToggle').classList.toggle('active', type===MEMBER_TYPES.adult);
  el('cadetToggle').classList.toggle('active', type===MEMBER_TYPES.cadet);
  [...selected].forEach((id)=>{ if(ribbons.find(r=>r.id===id)?.type!==type) selected.delete(id); });
  renderCatalog(); renderRack();
}

function getVisibleRibbons(){
  const q = el('searchInput').value.toLowerCase().trim();
  return ribbons.filter(r=>r.type===memberType && r.name.toLowerCase().includes(q)).sort((a,b)=>a.precedence-b.precedence);
}

function renderCatalog(){
  const list = getVisibleRibbons();
  el('ribbonResults').innerHTML = list.map(r=>`<article class="ribbon-item">
    <div class="ribbon-swatch" style="background:${ribbonStyle(r.colors)}"></div>
    <div><div class="ribbon-name">${r.name}</div><div class="ribbon-meta">Precedence #${r.precedence}</div>
    <label><input type="checkbox" data-id="${r.id}" ${selected.has(r.id)?'checked':''}/> Select</label></div>
  </article>`).join('') || '<p>No ribbons found.</p>';
  document.querySelectorAll('input[data-id]').forEach((c)=>c.addEventListener('change',()=>{c.checked?selected.add(c.dataset.id):selected.delete(c.dataset.id);renderRack();}));
}

function renderRack(){
  const width = Number(el('rackWidth').value || 3);
  const sorted = [...selected].map(id=>ribbons.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.precedence-b.precedence);
  const rows = []; for(let i=0;i<sorted.length;i+=width) rows.push(sorted.slice(i,i+width));
  el('rackPreview').innerHTML = rows.map(row=>`<div class="rack-row">${row.map(r=>`<div class="ribbon-tile" title="${r.name}" style="background:${ribbonStyle(r.colors)}"></div>`).join('')}</div>`).join('') || '<div>No ribbons selected.</div>';
  el('selectedRibbons').innerHTML = sorted.map(r=>`<li>${r.name}</li>`).join('') || '<li>No ribbons selected.</li>';
}

init();
