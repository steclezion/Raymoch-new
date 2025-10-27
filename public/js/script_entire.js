



   
$(function(){
  // ======== Countries (AU members + Western Sahara) ========
  const AFRICA = [
    {n:'Algeria',c:'dz'},{n:'Angola',c:'ao'},{n:'Benin',c:'bj'},{n:'Botswana',c:'bw'},
    {n:'Burkina Faso',c:'bf'},{n:'Burundi',c:'bi'},{n:'Cabo Verde',c:'cv'},
    {n:'Cameroon',c:'cm'},{n:'Central African Rep.',c:'cf'},{n:'Chad',c:'td'},
    {n:'Comoros',c:'km'},{n:'Congo (Rep.)',c:'cg'},{n:'Congo (DRC)',c:'cd'},
    {n:"Côte d’Ivoire",c:'ci'},{n:'Djibouti',c:'dj'},{n:'Egypt',c:'eg'},
    {n:'Equatorial Guinea',c:'gq'},{n:'Eritrea',c:'er'},{n:'Eswatini',c:'sz'},
    {n:'Ethiopia',c:'et'},{n:'Gabon',c:'ga'},{n:'Gambia',c:'gm'},
    {n:'Ghana',c:'gh'},{n:'Guinea',c:'gn'},{n:'Guinea-Bissau',c:'gw'},
    {n:'Kenya',c:'ke'},{n:'Lesotho',c:'ls'},{n:'Liberia',c:'lr'},
    {n:'Libya',c:'ly'},{n:'Madagascar',c:'mg'},{n:'Malawi',c:'mw'},
    {n:'Mali',c:'ml'},{n:'Mauritania',c:'mr'},{n:'Mauritius',c:'mu'},
    {n:'Morocco',c:'ma'},{n:'Mozambique',c:'mz'},{n:'Namibia',c:'na'},
    {n:'Niger',c:'ne'},{n:'Nigeria',c:'ng'},{n:'Rwanda',c:'rw'},
    {n:'São Tomé & Príncipe',c:'st'},{n:'Senegal',c:'sn'},{n:'Seychelles',c:'sc'},
    {n:'Sierra Leone',c:'sl'},{n:'Somalia',c:'so'},{n:'South Africa',c:'za'},
    {n:'South Sudan',c:'ss'},{n:'Sudan',c:'sd'},{n:'Tanzania',c:'tz'},
    {n:'Togo',c:'tg'},{n:'Tunisia',c:'tn'},{n:'Uganda',c:'ug'},
    {n:'Zambia',c:'zm'},{n:'Zimbabwe',c:'zw'},{n:'Western Sahara',c:'eh'}
  ];

  // ======== Build marquee ========
  const $track = $('#track');
  function chip(country){
    const url = `https://flagcdn.com/w40/${country.c}.png`;
    return $(`
      <a class="flag-chip" data-code="${country.c}" data-name="${country.n}">
        <img src="${url}" alt="${country.n} flag" loading="lazy"/><span>${country.n}</span>
      </a>`);
  }
  const $setA = $('<div class="d-inline-flex align-items-center gap-2 pe-2"></div>');
  const $setB = $('<div class="d-inline-flex align-items-center gap-2 ps-2" aria-hidden="true"></div>');
  AFRICA.forEach(c=> $setA.append(chip(c)));
  AFRICA.forEach(c=> $setB.append(chip(c)));
  $track.append($setA,$setB);

  // Pause / speed
  const $ticker = $('#ticker');
  $('#pauseBtn').on('click', function(){
    $ticker.toggleClass('ticker-paused');
    $(this).text($ticker.hasClass('ticker-paused') ? 'Resume' : 'Pause');
  });
  $('#speed').on('input', function(){
    document.documentElement.style.setProperty('--ticker-speed', this.value + 's');
  });

  // Hover pause (optional)
  $ticker.on('mouseenter', ()=> $ticker.addClass('ticker-paused'));
  $ticker.on('mouseleave', ()=> $ticker.removeClass('ticker-paused'));

  // ======== Stats + chart ========
  const ctx = document.getElementById('sectorChart');
  let sectorChart = new Chart(ctx, {
    type:'doughnut',
    data:{ labels:['Energy','Telecom','Manufacturing','Finance','Logistics'],
      datasets:[{ data:[0,0,0,0,0] }]},
    options:{ plugins:{ legend:{ position:'bottom' }}, cutout:'60%' }
  });

  function fmtMoney(n){ return n.toLocaleString(undefined,{maximumFractionDigits:0}); }

  function updateUI(country, payload){
    // header
    $('#countryName').text(country.n);
    $('#countryFlag').attr('src', `https://flagcdn.com/w20/${country.c}.png`);
    $('#lastUpdated').text('Updated: '+ new Date().toLocaleString());

    // stats
    $('#statCompanies').text(fmtMoney(payload.totals.companies));
    $('#statCapex').text('$ '+ fmtMoney(payload.totals.capex));
    $('#statProjects').text(fmtMoney(payload.totals.projects));
    $('#statNew').text(payload.totals.new);
    $('#statExp').text(payload.totals.expansion);

    // chart
    sectorChart.data.datasets[0].data = payload.sectors.map(s=>s.value);
    sectorChart.data.labels = payload.sectors.map(s=>s.name);
    sectorChart.update();

    // table
    const $rows = $('#companyRows');
    $rows.empty();
    payload.companies.forEach(row=>{
      $rows.append(`<tr>
        <td>${row.name}</td>
        <td>${row.sector}</td>
        <td class="text-end">$ ${fmtMoney(row.capex)}</td>
        <td><span class="badge ${row.status==='New'?'text-bg-primary':'text-bg-secondary'}">${row.status}</span></td>
      </tr>`);
    });
  }

  // Demo data generator (replace with your API)
  function demoData(code){
    const sectors = ['Energy','Telecom','Manufacturing','Finance','Logistics'];
    const rnd = (min,max)=> Math.floor(Math.random()*(max-min+1))+min;
    const companies = [];
    const count = rnd(6,12);
    let capexTotal = 0, newCount = 0, expCount = 0;
    for(let i=0;i<count;i++){
      const sector = sectors[rnd(0,sectors.length-1)];
      const capex = rnd(2,120)*1_000_000; // $2M–$120M
      const status = Math.random()<.55 ? 'New' : 'Expansion';
      if(status==='New') newCount++; else expCount++;
      capexTotal += capex;
      companies.push({
        name:`${sector} Corp ${i+1}`,
        sector, capex, status
      });
    }
    // sector totals
    const agg = {};
    companies.forEach(c=> agg[c.sector]=(agg[c.sector]||0)+c.capex);
    const sectorArr = Object.entries(agg).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);

    return {
      totals:{ companies: count, capex: capexTotal, projects: count, new:newCount, expansion:expCount },
      sectors: sectorArr,
      companies
    };
  }

  // If you have a backend route, swap to this:
  // function fetchData(country){
  //   return $.getJSON(`/api/investments?country=${country.c}`); // -> {totals, sectors, companies}
  // }

  // Handle selection
  function selectCountry(code){
    // active style
    $('.flag-chip').removeClass('active');
    $(`.flag-chip[data-code="${code}"]`).addClass('active');

    const c = AFRICA.find(x=>x.c===code);
    // fetchData(c).then(payload => updateUI(c, payload));
    const payload = demoData(code);
    updateUI(c, payload);
  }

  // Click on any flag
  $(document).on('click','.flag-chip', function(){
    selectCountry($(this).data('code'));
  });

  // Search in table
  $('#tableSearch').on('input', function(){
    const q = this.value.toLowerCase();
    $('#companyRows tr').each(function(){
      const txt = $(this).text().toLowerCase();
      $(this).toggle(txt.includes(q));
    });
  });

  // Select a sensible default (e.g., Nigeria)
  selectCountry('ng');
});

  



    /* Tier-1 Explore menu toggle */
    (() => {
      const btn = document.getElementById('exploreToggle');
      const menu = document.getElementById('t1Menu');
      if (!btn || !menu) return;
      const openMenu = (on) => { btn.setAttribute('aria-expanded', on ? 'true' : 'false'); menu.hidden = !on; };
      btn.addEventListener('click', (e) => { e.preventDefault(); openMenu(btn.getAttribute('aria-expanded') !== 'true'); });
      document.addEventListener('click', (e) => { if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) openMenu(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openMenu(false); });
    })();

    /* A11y roles for menu items */
    (() => {
      const menu = document.getElementById('t1Menu');
      menu?.querySelectorAll('a.menu-item').forEach(a => a.setAttribute('role','menuitem'));
    })();

    /* Tiny color controller */
    (function(){
      const scope = document.querySelector('#what-we-do');
      const ctl = scope?.querySelector('.mini-ctl');
      if(!scope || !ctl) return;
      const KEY = k => `what-we-do:${k}`;
      const toHex = (value) => {
        if(!value) return '#ffffff';
        if(/^#/.test(value)) return value;
        const m = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if(m){ const [r,g,b] = m.slice(1,4).map(Number); return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join(''); }
        const tmp = document.createElement('div'); tmp.style.color = value; document.body.appendChild(tmp);
        const c = getComputedStyle(tmp).color; document.body.removeChild(tmp);
        const mm = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
        if(mm){ const [r,g,b] = mm.slice(1,4).map(Number); return '#' + [r,g,b].map(x => x.toString(16).padStart(2,'0')).join(''); }
        return '#ffffff';
      };
      ctl.querySelectorAll('input[type="color"]').forEach(inp=>{
        const vname = inp.dataset.var;
        const saved = localStorage.getItem(KEY(vname));
        const computed = getComputedStyle(scope).getPropertyValue(vname).trim();
        const initial = saved || toHex(computed) || '#ffffff';
        inp.value = initial;
        if(saved) scope.style.setProperty(vname, saved);
      });
      ctl.addEventListener('input', e=>{
        const inp = e.target; if(inp.type !== 'color') return;
        const vname = inp.dataset.var; scope.style.setProperty(vname, inp.value);
        localStorage.setItem(KEY(vname), inp.value);
      });
    })();

    /* Signals marquee (duplicated content for seamless loop) */
    const signalsData = [
      { tag:"Incentive", text:"Kenya: 10% VAT relief on solar mini-grid components announced." },
      { tag:"Policy",    text:"Ghana: FX repatriation rules eased for exporters (pilot Q4)." },
      { tag:"Grant",     text:"AfDB SME window expands to climate-adaptive agritech — $50m tranche." },
      { tag:"Regulatory",text:"Egypt sandbox fast-track for healthtech devices (duty cut 5%)." }
    ];
    const ticker = document.getElementById('signalsTicker');
    if (ticker){
      const chips = signalsData.map(s => `<span class="chip">${s.tag} — ${s.text}</span>`).join("");
      ticker.innerHTML = `<div class="track">${chips}${chips}</div>`;
    }

    /* Live Panel Simulation */
    const DATA = {
      "Nigeria": {flag:"🇳🇬",companies:9,capex:650_000_000,projects:9,new:5,expansion:4,
        sectors:{Manufacturing:38,Finance:27,Telecom:18,Energy:15,Logistics:7},
        plans:[["Telecom Corp 1","Telecom",38000000,"New"],["Finance Corp 2","Finance",97000000,"Expansion"],
               ["Manufacturing Corp 3","Manufacturing",67000000,"Expansion"],["Finance Corp 4","Finance",55000000,"Expansion"],
               ["Energy Corp 5","Energy",100000000,"Expansion"],["Manufacturing Corp 6","Manufacturing",108000000,"New"],
               ["Telecom Corp 7","Telecom",73000000,"New"]]},
      "Kenya": {flag:"🇰🇪",companies:7,capex:410_000_000,projects:8,new:4,expansion:4,
        sectors:{Manufacturing:30,Finance:25,Telecom:20,Energy:15,Logistics:10},
        plans:[["AgriTech A","Manufacturing",56000000,"Expansion"],["FinCo B","Finance",72000000,"New"],["TelCom C","Telecom",41000000,"New"],
               ["Energy D","Energy",66000000,"Expansion"],["Logi E","Logistics",29000000,"Expansion"]]},
      "Ghana": {flag:"🇬🇭",companies:6,capex:290_000_000,projects:6,new:3,expansion:3,
        sectors:{Manufacturing:28,Finance:22,Telecom:21,Energy:18,Logistics:11},
        plans:[["FinCo G1","Finance",42000000,"New"],["Mfg G2","Manufacturing",52000000,"Expansion"],["Tel G3","Telecom",33000000,"New"],
               ["Energy G4","Energy",58000000,"Expansion"]]}
    };
    const COLORS={Manufacturing:"#60a5fa",Finance:"#f472b6",Telecom:"#fbbf24",Energy:"#f59e0b",Logistics:"#34d399"};
    const nf=new Intl.NumberFormat('en-US'); const money=v=>'$ '+nf.format(v);

    const pills=document.getElementById('countryPills'),countryLabel=document.getElementById('countryLabel'),
      kpiCompanies=document.getElementById('kpiCompanies'),kpiCapex=document.getElementById('kpiCapex'),
      kpiProjects=document.getElementById('kpiProjects'),kpiNE=document.getElementById('kpiNE'),
      donut=document.getElementById('donut'),legend=document.getElementById('legend'),
      tblBody=document.getElementById('planTable')?.querySelector('tbody'),
      search=document.getElementById('tblSearch'),updatedAt=document.getElementById('updatedAt'),
      speed=document.getElementById('speed'),liveTag=document.getElementById('liveTag');

    Object.keys(DATA).forEach((name,i)=>{const b=document.createElement('button');b.className='pill'+(i===0?' active':'');b.textContent=`${DATA[name].flag} ${name}`;
      b.onclick=()=>{document.querySelectorAll('.pill').forEach(p=>p.classList.remove('active'));b.classList.add('active');render(name,true);};
      pills.appendChild(b);});

    function renderDonut(entries){
      const cx=110,cy=110,r=80; donut.innerHTML='';
      donut.innerHTML+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e7edf7" stroke-width="28"></circle><circle cx="${cx}" cy="${cy}" r="50" fill="#fff"></circle>`;
      const sum=Object.values(entries).reduce((a,b)=>a+b,0); let a=-Math.PI/2;
      Object.entries(entries).forEach(([k,v])=>{
        const f=v/sum,t=f*2*Math.PI;const x1=cx+r*Math.cos(a),y1=cy+r*Math.sin(a);a+=t;const x2=cx+r*Math.cos(a),y2=cy+r*Math.sin(a);
        const large=f>0.5?1:0, col=COLORS[k]||'#9ca3af';
        donut.innerHTML+=`<path d="M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z" fill="${col}" opacity=".9"></path>`;
      });
      legend.innerHTML='';
      Object.keys(entries).forEach(k=>{
        const s=document.createElement('span');s.innerHTML=`<i class="swatch" style="background:${COLORS[k]||'#9ca3af'}"></i>${k}`;legend.appendChild(s);
      });
    }
    function renderTable(rows,q=''){
      if(!tblBody) return; const qq=q.trim().toLowerCase();
      const filtered=rows.filter(r=>r[0].toLowerCase().includes(qq)||r[1].toLowerCase().includes(qq));
      tblBody.innerHTML=filtered.map(([c,s,cap,st])=>`<tr><td>${c}</td><td>${s}</td><td>${money(cap)}</td><td><span class="status ${st==='Expansion'?'exp':''}">${st}</span></td></tr>`).join('')
        || `<tr><td colspan="4" style="color:#6b7280">No matches</td></tr>`;
    }
    let current="Nigeria";
    function render(name,hard=false){
      current=name||current;const d=DATA[current];countryLabel.textContent=`${d.flag} ${current}`;
      kpiCompanies.textContent=d.companies;kpiCapex.textContent=money(d.capex);kpiProjects.textContent=d.projects;kpiNE.textContent=`${d.new} / ${d.expansion}`;
      renderDonut(d.sectors);renderTable(d.plans,search?.value||'');updatedAt.textContent="Updated: "+new Date().toLocaleString();if(hard) lastTick=performance.now();
    }
    search?.addEventListener('input',()=>renderTable(DATA[current].plans,search.value));

    let lastTick=performance.now();
    function tick(now){
      const d=DATA[current], s=parseFloat(speed.value);
      liveTag.style.animationDuration=(1.2/s)+'s';
      if(now-lastTick>1400/s){lastTick=now;
        d.capex=Math.max(0,d.capex+Math.round((Math.random()-0.48)*3_500_000));
        d.projects=Math.max(1,d.projects+(Math.random()>0.75?1:0)-(Math.random()>0.9?1:0));
        d.new=Math.max(0,d.new+(Math.random()>0.7?1:0)-(Math.random()>0.9?1:0)); d.expansion=Math.max(0,d.projects-d.new);
        const keys=Object.keys(d.sectors), k=keys[Math.floor(Math.random()*keys.length)];
        d.sectors[k]=Math.max(5,d.sectors[k]+(Math.random()>0.5?2:-2));
        const total=keys.reduce((a,k)=>a+d.sectors[k],0);
        keys.forEach(k2=>d.sectors[k2]=Math.max(5,Math.round(d.sectors[k2]*100/total)));
        if(d.plans.length>1){
          const i=Math.floor(Math.random()*d.plans.length), row=d.plans.splice(i,1)[0];
          row[2]=Math.max(10_000_000,row[2]+Math.round((Math.random()-0.5)*5_000_000));
          d.plans.unshift(row);
        }
        render();
      }
      requestAnimationFrame(tick);
    }
    render(current,true); requestAnimationFrame(tick);
    