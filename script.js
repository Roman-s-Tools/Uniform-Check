const MEMBER_TYPES = { adult: 'adult', cadet: 'cadet' };
let memberType = MEMBER_TYPES.adult;

const ribbonCatalog = [
  ['AA01.png','CAP Achievement Award',80,'adult'],
  ['cmdrco01.png','Commander’s Commendation Award *',70,'adult'],
  ['distin01.png','Distinguished Service Award',40,'adult'],
  ['except01.png','Exceptional Service Award',50,'adult'],
  ['meriti01.png','Meritorious Service Award',60,'adult'],
  ['silver01.png','Silver Medal of Valor',10,'adult'],
  ['redser-02yr.png','Red Service Ribbon',200,'adult'],
  ['senrec01.png','Senior Recruiter Ribbon',230,'adult'],
  ['encamp01.png','Encampment Ribbon',130,'cadet'],
  ['afa.png','Air Force Association Award',320,'cadet'],
  ['afsa.png','Air Force Sergeants Association Award',321,'cadet'],
  ['afoea.png','Air Force Officers’ Espirit de Corps Award',322,'cadet'],
  ['armstr.png','Neil Armstrong Achievement',141,'cadet'],
  ['arnold.png','General H.H. Arnold Achievement',140,'cadet'],
  ['cac.png','Cadet Advisory Council Ribbon',240,'cadet'],
  ['cadet_blu_ach5.png','Cadet Achievement (Blue)',145,'cadet'],
  ['cadet_cop.png','Cadet Community Service (COP)',260,'cadet'],
  ['cadet_red_ach1.png','Cadet Achievement (Red)',149,'cadet'],
  ['cadet_whi_ach3.png','Cadet Achievement (White)',147,'cadet'],
  ['cadpil01.png','Cadet Pilot Ribbon',161,'cadet'],
  ['cadrec01.png','Cadet Recruiter Ribbon',235,'cadet'],
  ['cmdser.png','Community Service Ribbon',255,'adult'],
  ['commun01.png','Community Service Ribbon',256,'cadet'],
  ['coudru01.png','A. Scott Crossfield Award',152,'cadet'],
  ['crisis.png','Crisis Service Ribbon',265,'adult'],
  ['crossf.png','Crossfield Award Ribbon',151,'cadet'],
  ['curry.png','General J.F. Curry Achievement',148,'cadet'],
  ['disast01.png','Disaster Relief Ribbon',264,'adult'],
  ['doolit.png','General J.H. Doolittle Achievement',143,'cadet'],
  ['eaker.png','General Ira C. Eaker Award',135,'cadet'],
  ['earhar.png','Amelia Earhart Award',136,'cadet'],
  ['falcon.png','Falcon Award',330,'cadet'],
  ['feik.png','Frank F. Borman Falcon/Feik',331,'cadet'],
  ['find01.png','Find Ribbon',270,'adult'],
  ['garber.png','Paul E. Garber Award',180,'adult'],
  ['goddar.png','Dr. Robert H. Goddard Achievement',146,'cadet'],
  ['homeland01.png','Homeland Security Ribbon',266,'adult'],
  ['leader.png','Leadership Award Ribbon',257,'cadet'],
  ['lifesa01.png','Lifesaving Award Ribbon',90,'adult'],
  ['lindbe.png','Charles A. Lindbergh Award',181,'adult'],
  ['loening.png','Loening Award',182,'adult'],
  ['member.png','Membership Award Ribbon',300,'adult'],
  ['mitchel.png','Gen Billy Mitchell Award',137,'cadet'],
  ['natcmdrcom.png','National Commander’s Commendation',71,'adult'],
  ['ncc.png','National Cadet Competition Ribbon',242,'cadet'],
  ['ricken.png','Rickenbacker Award',183,'adult'],
  ['sar01.png','Search and Rescue Ribbon',271,'adult'],
  ['spaatz.png','Gen Carl A. Spaatz Award',130,'cadet'],
  ['unitci-nat01.png','National Unit Citation Award',220,'adult'],
  ['unitci01.png','Unit Citation Award',221,'adult'],
  ['usaf_aam01.png','USAF Airman Medal',95,'adult'],
  ['vfwnco.png','VFW NCO Award',341,'cadet'],
  ['vfwo.png','VFW Officer Award',340,'cadet'],
  ['wilson.png','Gill Robb Wilson Award',184,'adult'],
  ['wright.png','Wright Brothers Award',138,'cadet'],
  ['yeager.png','Brig Gen Chuck Yeager Award',185,'adult']
];

const ribbons = ribbonCatalog.map(([file, name, precedence, type]) => ({
  id: file.replace(/\.png$/,'').replace(/[^a-zA-Z0-9]+/g,'_').toLowerCase(),
  name,
  precedence,
  type,
  image: `ribbons/${file}`
}));

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
  return ribbons.filter(r=>r.type===memberType && r.name.toLowerCase().includes(q)).sort((a,b)=>a.precedence-b.precedence || a.name.localeCompare(b.name));
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
  const sorted = [...selected].map(id=>ribbons.find(r=>r.id===id)).filter(Boolean).sort((a,b)=>a.precedence-b.precedence || a.name.localeCompare(b.name));
  const rows = []; for(let i=0;i<sorted.length;i+=width) rows.push(sorted.slice(i,i+width));
  el('rackPreview').innerHTML = rows.map(row=>`<div class="rack-row">${row.map(r=>`<img class="ribbon-tile" title="${r.name}" src="${r.image}" alt="${r.name}"/>`).join('')}</div>`).join('') || '<div>No ribbons selected.</div>';
  el('selectedRibbons').innerHTML = sorted.map(r=>`<li>${r.name}</li>`).join('') || '<li>No ribbons selected.</li>';
}

init();
