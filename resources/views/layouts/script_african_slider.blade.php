<script>
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
</script>