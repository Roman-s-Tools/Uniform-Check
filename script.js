const MEMBER_TYPES = { adult: 'adult', cadet: 'cadet' };
let memberType = MEMBER_TYPES.adult;

const ribbons = [
  { id:'silver_medal_valor', name:'Silver Medal of Valor', precedence:10, type:'adult', image:'ribbons/silver01.png' },
  { id:'bronze_medal_valor', name:'Bronze Medal of Valor', precedence:20, type:'adult', image:'ribbons/bronze01.png' },
  { id:'distinguished_service', name:'Distinguished Service Medal', precedence:40, type:'adult', image:'ribbons/distin01.png' },
  { id:'exceptional_service', name:'Exceptional Service Award', precedence:50, type:'adult', image:'ribbons/except01.png' },
  { id:'meritorious_service', name:'Meritorious Service Award', precedence:60, type:'adult', image:'ribbons/meriti01.png' },
  { id:'commanders_commendation', name:"Commander’s Commendation Award *", precedence:70, type:'adult', image:'ribbons/cmdrco01.png' },
  { id:'achievement_award', name:'CAP Achievement Award', precedence:80, type:'adult', image:'ribbons/AA01.png' },
  { id:'red_service', name:'Red Service Ribbon', precedence:200, type:'adult', image:'ribbons/redser-02yr.png' },
  { id:'senior_recruiter', name:'Senior Recruiter Ribbon', precedence:230, type:'adult', image:'ribbons/senrec01.png' },
  { id:'encampment', name:'Encampment Ribbon', precedence:130, type:'cadet', image:'ribbons/encamp01.png' }
];

const selected = new Set();
const el = (id) => document.getElementById(id);

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
    <img class="ribbon-swatch" src="${r.image}" alt="${r.name}" loading="lazy" />
    <div><div class="ribbon-name">${r.name}</div><div class="ribbon-meta">Precedence #${r.precedence}</div>
    <label><input type="checkbox" data-id="${r.id}" ${selected.has(r.id)?'checked':''}/> Select</label></div>
  </article>`).join('') || '<p>No ribbons found.</p>';
  document.querySelectorAll('input[data-id]').forEach((c)=>c.addEventListener('change',()=>{c.checked?selected.add(c.dataset.id):selected.delete(c.dataset.id);renderRack();}));
}

function renderRack(){
  const width = Number(el('rackWidth').value || 3);
  const sorted = [...selected].map(id=>ribbons.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.precedence-b.precedence);
  const rows = []; for(let i=0;i<sorted.length;i+=width) rows.push(sorted.slice(i,i+width));
  el('rackPreview').innerHTML = rows.map(row=>`<div class="rack-row">${row.map(r=>`<img class="ribbon-tile" title="${r.name}" src="${r.image}" alt="${r.name}"/>`).join('')}</div>`).join('') || '<div>No ribbons selected.</div>';
  el('selectedRibbons').innerHTML = sorted.map(r=>`<li>${r.name}</li>`).join('') || '<li>No ribbons selected.</li>';
}

init();
