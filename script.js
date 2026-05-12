const ribbonCatalog = [
  ['AA01.png','CAP Achievement Award',90,'adult'],
  ['cmdrco01.png','Commander’s Commendation Award',80,'adult'],
  ['distin01.png','Distinguished Service Medal',50,'adult'],
  ['except01.png','Exceptional Service Award',60,'adult'],
  ['meriti01.png','Meritorious Service Award',70,'adult'],
  ['silver01.png','Silver Medal of Valor',30,'adult'],
  ['silver01.png','Bronze Medal of Valor',40,'adult'],
  ['redser-02yr.png','Red Service Ribbon',400,'adult'],
  ['senrec01.png','Senior Recruiter Ribbon',540,'adult'],
  ['encamp01.png','Encampment Ribbon',530,'cadet'],
  ['afa.png','AFA Squadron Cadet of the Year',350,'cadet'],
  ['afsa.png','AFSA Squadron NCO of the Year',360,'cadet'],
  ['afoea.png','Air Force Officers’ Espirit de Corps Award',322,'cadet'],
  ['armstr.png','Neil Armstrong Achievement',250,'cadet'],
  ['arnold.png','Gen Hap Arnold Achievement',320,'cadet'],
  ['cac.png','Cadet Advisory Council Ribbon',510,'cadet'],
  ['cadet_blu_ach5.png','Cadet Achievement (Blue)',145,'cadet'],
  ['cadet_cop.png','Cadet Community Service (COP)',260,'cadet'],
  ['cadet_red_ach1.png','Cadet Achievement (Red)',149,'cadet'],
  ['cadet_whi_ach3.png','Cadet Achievement (White)',147,'cadet'],
  ['cadpil01.png','Cadet Orientation Pilot Ribbon',460,'cadet'],
  ['cadrec01.png','Command Service Ribbon',340,'adult'],
  ['cmdser.png','Community Service Ribbon',470,'adult'],
  ['commun01.png','Cadet Special Activity Ribbon',520,'cadet'],
  ['coudru01.png','Counterdrug Ribbon',430,'adult'],
  ['crisis.png','CAP Crisis Service Ribbon',390,'adult'],
  ['crossf.png','Crossfield Award Ribbon',151,'cadet'],
  ['curry.png','Gen J.F. Curry Achievement',330,'cadet'],
  ['disast01.png','Disaster Relief Ribbon',440,'adult'],
  ['doolit.png','Gen Jimmy F. Doolittle Achievement',270,'cadet'],
  ['eaker.png','Ira C. Eaker Award',220,'cadet'],
  ['earhar.png','Amelia Earhart Award',230,'cadet'],
  ['falcon.png','Falcon Award',330,'cadet'],
  ['feik.png','Mary Feik Achievement',310,'cadet'],
  ['find01.png','Search “Find” Ribbon',410,'adult'],
  ['garber.png','Paul E. Garber Award',150,'adult'],
  ['goddar.png','Dr. Robert H. Goddard Achievement',260,'cadet'],
  ['homeland01.png','Homeland Security Ribbon',450,'adult'],
  ['leader.png','Leadership Award',170,'cadet'],
  ['lifesa01.png','Lifesaving Award',100,'adult'],
  ['lindbe.png','Charles A. Lindbergh Achievement',280,'cadet'],
  ['loening.png','Grover Loening Aerospace Award',160,'adult'],
  ['member.png','CAP Membership Award',180,'adult'],
  ['mitchel.png','Gen Billy Mitchell Award',240,'cadet'],
  ['natcmdrcom.png','National Commander’s Citation',130,'adult'],
  ['ncc.png','National Cadet Competition Ribbon',490,'cadet'],
  ['afoea.png','National Color Guard Competition Ribbon',500,'cadet'],
  ['falcon.png','International Air Cadet Exchange',480,'cadet'],
  ['ricken.png','Capt Eddie Rickenbacker Achievement',290,'cadet'],
  ['sar01.png','Air Search and Rescue Ribbon',420,'adult'],
  ['spaatz.png','Gen Carl A. Spaatz Award',210,'cadet'],
  ['unitci-nat01.png','National Commander’s Unit Citation',110,'adult'],
  ['unitci01.png','Unit Citation Award',120,'adult'],
  ['usaf_aam01.png','Air Force Aerial Achievement Medal',10,'adult'],
  ['vfwnco.png','VFW Cadet NCO Award',380,'cadet'],
  ['vfwo.png','VFW Cadet Officer Award',370,'cadet'],
  ['wilson.png','Gill Robb Wilson Award',140,'adult'],
  ['wright.png','Wright Brothers Award',300,'cadet'],
  ['yeager.png','Brigadier General Charles E. “Chuck” Yeager Aerospace Education Achievement Award',200,'adult']
];

const ribbons = ribbonCatalog.map(([file, name, precedence]) => ({
  id: file.replace(/\.png$/,'').replace(/[^a-zA-Z0-9]+/g,'_').toLowerCase(),
  name,
  precedence,
  image: `ribbons/${file}`
}));

const selected = new Map();
const el = (id) => document.getElementById(id);

function init(){
  el('searchInput').addEventListener('input', renderCatalog);
  el('rackWidth').addEventListener('change', renderRack);
  renderCatalog();
  renderRack();
}

function getVisibleRibbons(){
  const q = el('searchInput').value.toLowerCase().trim();
  return ribbons
    .filter((r)=>r.name.toLowerCase().includes(q))
    .sort((a,b)=>a.precedence-b.precedence || a.name.localeCompare(b.name));
}

function renderCatalog(){
  const list = getVisibleRibbons();
  el('ribbonResults').innerHTML = list.map((r)=>{
    const qty = selected.get(r.id) ?? '';
    return `<article class="ribbon-item">
      <img class="ribbon-swatch" src="${r.image}" alt="${r.name}" loading="lazy" />
      <div>
        <div class="ribbon-name">${r.name}</div>
        <label class="qty-label">Awards Earned
          <input class="qty-input" type="number" min="0" step="1" data-id="${r.id}" value="${qty}" placeholder="0" />
        </label>
      </div>
    </article>`;
  }).join('') || '<p>No ribbons found.</p>';

  document.querySelectorAll('input[data-id]').forEach((input)=>{
    input.addEventListener('input', ()=>{
      const parsed = Number.parseInt(input.value, 10);
      if (Number.isNaN(parsed) || parsed <= 0) {
        selected.delete(input.dataset.id);
      } else {
        selected.set(input.dataset.id, parsed);
      }
      renderRack();
    });
  });
}

function getDeviceCounts(totalAwards){
  const additionalAwards = Math.max(0, totalAwards - 1);
  const silver = Math.floor(additionalAwards / 5);
  const bronze = additionalAwards % 5;

  const devices = [
    ...Array.from({ length: silver }, ()=> 'silver'),
    ...Array.from({ length: bronze }, ()=> 'bronze')
  ];

  return devices.slice(0, 4);
}

function renderRack(){
  const width = Number(el('rackWidth').value || 3);
  const sorted = [...selected.entries()]
    .map(([id, count])=>({ ribbon: ribbons.find((r)=>r.id===id), count }))
    .filter((entry)=>entry.ribbon)
    .sort((a,b)=>a.ribbon.precedence-b.ribbon.precedence || a.ribbon.name.localeCompare(b.ribbon.name));

  const rows = [];
  for(let i=0;i<sorted.length;i+=width) rows.push(sorted.slice(i,i+width));

  el('rackPreview').innerHTML = rows.map((row)=>`<div class="rack-row">${row.map(({ ribbon, count })=>{
    const devices = getDeviceCounts(count)
      .map((deviceType)=>`<img class="device-icon" src="ribbons/devices/${deviceType}triangle.png" alt="${deviceType === 'silver' ? 'Silver' : 'Bronze'} triangle device"/>`)
      .join('');

    return `<div class="ribbon-stack" title="${ribbon.name} (x${count})"><img class="ribbon-tile" src="${ribbon.image}" alt="${ribbon.name}"/><div class="device-overlay">${devices}</div></div>`;
  }).join('')}</div>`).join('') || '<div>No ribbons selected.</div>';

  el('selectedRibbons').innerHTML = sorted
    .map(({ ribbon, count })=>`<li>${ribbon.name} × ${count}</li>`)
    .join('') || '<li>No ribbons selected.</li>';
}

init();
