{{-- Middle Search Organizations Details Data --}}


  <script src="https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js"></script>
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <script>
      $(function() {
          // ==== DATA (add whatever fields you like; these are shown in the modal) ====
          const orgs = [{
                  name: "Raymoch Group",
                  url: "https://example.com/raymoch",
                  sector: "Energy",
                  hq: "Asmara",
                  capex: 320_000_000,
                  projects: 7,
                  desc: "Diversified energy projects across the Horn of Africa."
              },
              {
                  name: "Adulis Logistics",
                  url: "https://example.com/adulis",
                  sector: "Logistics",
                  hq: "Massawa",
                  capex: 85_000_000,
                  projects: 4,
                  desc: "Port & inland logistics services with regional coverage."
              },
              {
                  name: "Aruco Manufacturing",
                  url: "https://example.com/aruo",
                  sector: "Manufacturing",
                  hq: "Keren",
                  capex: 140_000_000,
                  projects: 6,
                  desc: "Scaling light manufacturing and agro-processing."
              },
              {
                  name: "Asmara Textiles",
                  url: "https://example.com/asmara",
                  sector: "Textiles",
                  hq: "Asmara",
                  capex: 60_000_000,
                  projects: 3,
                  desc: "Vertically integrated textile mill and apparel exports."
              },
              {
                  name: "Dahlak Marine",
                  url: "https://example.com/dahlak",
                  sector: "Marine",
                  hq: "Massawa",
                  capex: 45_000_000,
                  projects: 2,
                  desc: "Offshore services and coastal fleet management."
              },
              {
                  name: "Massawa Port Services",
                  url: "https://example.com/mps",
                  sector: "Ports",
                  hq: "Massawa",
                  capex: 210_000_000,
                  projects: 5,
                  desc: "Private concessions improving port throughput."
              },
              {
                  name: "Keren Foods",
                  url: "https://example.com/keren",
                  sector: "Food",
                  hq: "Keren",
                  capex: 55_000_000,
                  projects: 3,
                  desc: "Food processing and cold-chain distribution."
              },
              {
                  name: "Sawa Construction",
                  url: "https://example.com/sawa",
                  sector: "Construction",
                  hq: "Asmara",
                  capex: 120_000_000,
                  projects: 5,
                  desc: "Industrial parks and transport infrastructure builds."
              },
              {
                  name: "Zula Energy",
                  url: "https://example.com/zula",
                  sector: "Energy",
                  hq: "Dekemhare",
                  capex: 95_000_000,
                  projects: 4,
                  desc: "Distributed solar and mini-grid deployments."
              },
              {
                  name: "Himbirti Tech",
                  url: "https://example.com/himbirti",
                  sector: "Technology",
                  hq: "Asmara",
                  capex: 30_000_000,
                  projects: 6,
                  desc: "Cloud, data, and connectivity solutions."
              }
          ];

          // ==== Build ticker HTML: two tracks for seamless loop ====
          const $viewport = $('#tickerViewport');
          const $move = $('<div class="ticker-move"></div>');
          const $trackA = $('<div class="ticker-track"></div>');
          const $trackB = $('<div class="ticker-track" aria-hidden="true"></div>');

          function chip(org, i) {
              const $a = $('<a class="ticker-item" role="button"></a>');
              // store index for lookup when clicked
              $a.attr('data-idx', i);
              $a.append(`<span class="num">${i+1}</span>`);
              $a.append(`<span class="label">${org.name}</span>`);
              return $a;
          }
          orgs.forEach((o, i) => $trackA.append(chip(o, i)));
          orgs.forEach((o, i) => $trackB.append(chip(o, i))); // duplicate set
          $move.append($trackA, $trackB);
          $viewport.append($move);

          // Hover pause
          $viewport.on('mouseenter', () => $('#orgTicker').addClass('ticker-paused'));
          $viewport.on('mouseleave', () => $('#orgTicker').removeClass('ticker-paused'));

          // Start/Pause toggle button
          const $ticker = $('#orgTicker');
          const $status = $('#tickerStatus');
          $('#pauseBtn').on('click', function() {
              $ticker.toggleClass('ticker-paused');
              const paused = $ticker.hasClass('ticker-paused');
              $(this).attr('aria-pressed', paused ? 'true' : 'false');
              $(this).find('.icon-pause').toggleClass('d-none', paused);
              $(this).find('.icon-play').toggleClass('d-none', !paused);
              $status.toggleClass('bg-success', !paused).toggleClass('bg-secondary', paused);
              $ticker.toggleClass('paused', paused);
              $status.find('.status-text').text(paused ? 'Paused' : 'Running');
          });

          // Speed control
          const $speed = $('#speedRange');

          function setSpeed(val) {
              document.getElementById('orgTicker').style.setProperty('--ticker-speed', `${val}s`);
          }
          setSpeed($speed.val());
          $speed.on('input change', function() {
              setSpeed(this.value);
          });

          // ==== Modal helpers ====
          const orgModalEl = document.getElementById('orgModal');
          const orgModal = new bootstrap.Modal(orgModalEl, {
              backdrop: true
          });
          orgModalEl.addEventListener('show.bs.modal', () => $ticker.addClass('ticker-paused'));
          orgModalEl.addEventListener('hidden.bs.modal', () => $ticker.removeClass('ticker-paused'));

          function fmtMoney(n) {
              return '$ ' + n.toLocaleString(undefined, {
                  maximumFractionDigits: 0
              });
          }

          function avatarFor(name) {
              const letter = (name || '?').trim().charAt(0).toUpperCase();
              return `<span>${letter}</span>`;
          }

          function openOrgModal(idx) {
              const o = orgs[idx];
              if (!o) return;
              // fill modal
              $('#modalTitle').text(o.name);
              $('#modalAvatar').html(avatarFor(o.name));
              $('#modalDesc').text(o.desc || '—');
              $('#modalSector').text(o.sector || '—');
              $('#modalHQ').text(o.hq || '—');
              $('#modalCapex').text(fmtMoney(o.capex || 0));
              $('#modalProjects').text(o.projects ?? '—');
              $('#modalLink').attr('href', o.url || '#');

              orgModal.show();
          }

          // Click handler: open modal (centered)
          $viewport.on('click', '.ticker-item', function(e) {
              e.preventDefault();
              const idx = Number($(this).data('idx'));
              openOrgModal(idx);
          });
      });
  </script>
