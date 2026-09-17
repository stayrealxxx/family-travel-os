(() => {
  const data = window.TRIP_DATA;
  let activeRoute = localStorage.getItem('travelos.route') || data.defaultRoute;

  const $ = (id) => document.getElementById(id);
  const statusClass = (status) => {
    if (status === 'BOOKED' || status === 'PAID') return 'status-booked';
    if (status === 'STILL NEEDED') return 'status-needed';
    return 'status-considering';
  };

  function formatDateRange() {
    const start = new Date(data.dateStart);
    const end = new Date(data.dateEnd);
    const fmt = new Intl.DateTimeFormat('zh-CN', { month: 'short', day: 'numeric' });
    return `${fmt.format(start)} → ${fmt.format(end)}, ${end.getFullYear()}`;
  }

  function renderHeader() {
    $('tripTitle').textContent = data.title;
    $('tripDates').textContent = formatDateRange();
    $('tripMeta').textContent = `👨‍👩‍👧‍👦 ${data.travelers} · 🏠 ${data.home}`;
    $('lastUpdated').textContent = `Updated ${data.lastUpdated}`;
  }

  function renderStatus() {
    $('statusGrid').innerHTML = data.statuses.map(item => `
      <article class="status-card">
        <div class="status-icon">${item.icon}</div>
        <div class="status-label">${item.label}</div>
        <div class="status-value">${item.detail}</div>
        <div style="margin-top:10px"><span class="status-pill ${statusClass(item.status)}">${item.status}</span></div>
      </article>
    `).join('');
  }

  function renderRouteSelector() {
    $('routeSelector').innerHTML = Object.entries(data.routes).map(([key, route]) => `
      <button class="route-button ${key === activeRoute ? 'active' : ''}" data-route="${key}">${route.name}</button>
    `).join('');

    document.querySelectorAll('.route-button').forEach(btn => {
      btn.addEventListener('click', () => {
        activeRoute = btn.dataset.route;
        localStorage.setItem('travelos.route', activeRoute);
        renderRouteSelector();
        renderRoute();
      });
    });
  }

  function renderRoute() {
    const route = data.routes[activeRoute];
    $('routeNote').textContent = route.note;
    $('timelineLabel').textContent = `${route.name} · planning only`;
    $('mapsLink').href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(route.mapQuery)}`;

    $('routeVisual').innerHTML = route.nodes.map((node, idx) => {
      const nodeHtml = `<div class="route-node"><div class="code">${node.code}</div><div class="city">${node.city}</div></div>`;
      return idx < route.nodes.length - 1 ? nodeHtml + '<div class="route-arrow"></div>' : nodeHtml;
    }).join('');

    $('nextTitle').textContent = route.next.title;
    $('nextDetail').innerHTML = `
      <div><strong>${route.next.date}</strong></div>
      <div>${route.next.detail}</div>
      <div>状态：<span class="status-pill status-considering">CONSIDERING</span></div>
    `;

    $('timeline').innerHTML = route.timeline.map(item => `
      <div class="timeline-item">
        <div class="timeline-date">${item.date}</div>
        <div class="timeline-rail"><div class="timeline-dot"></div></div>
        <div class="timeline-content">
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-desc">${item.desc}</div>
          <div class="timeline-tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>
        </div>
      </div>
    `).join('');

    updateCountdown();
  }

  function updateCountdown() {
    const route = data.routes[activeRoute];
    const target = new Date(`${route.next.date}T08:00:00-05:00`).getTime();
    const now = Date.now();
    let diff = target - now;
    if (diff <= 0) {
      $('countdown').textContent = '已到达行程日期';
      return;
    }
    const days = Math.floor(diff / 86400000); diff %= 86400000;
    const hours = Math.floor(diff / 3600000); diff %= 3600000;
    const mins = Math.floor(diff / 60000);
    $('countdown').innerHTML = `${days} 天<br>${hours} 小时 ${mins} 分`;
  }

  function renderChecklist() {
    const saved = JSON.parse(localStorage.getItem('travelos.checklist') || '{}');
    $('checklist').innerHTML = data.checklist.map(item => `
      <label class="check-item ${saved[item.id] ? 'done' : ''}">
        <input type="checkbox" data-id="${item.id}" ${saved[item.id] ? 'checked' : ''} />
        <div>
          <div class="check-main">${item.title}</div>
          <div class="check-sub">${item.sub}</div>
        </div>
      </label>
    `).join('');

    document.querySelectorAll('.check-item input').forEach(input => {
      input.addEventListener('change', () => {
        const state = JSON.parse(localStorage.getItem('travelos.checklist') || '{}');
        state[input.dataset.id] = input.checked;
        localStorage.setItem('travelos.checklist', JSON.stringify(state));
        renderChecklist();
      });
    });
  }

  function renderDecisions() {
    $('decisionList').innerHTML = data.decisions.map(([key, value]) => `
      <div class="decision-row">
        <div class="decision-key">${key}</div>
        <div class="decision-value">${value}</div>
      </div>
    `).join('');
  }

  function setupTheme() {
    const savedTheme = localStorage.getItem('travelos.theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (systemDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    $('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';

    $('themeToggle').addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      localStorage.setItem('travelos.theme', next);
      $('themeToggle').textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }

  $('resetChecklist').addEventListener('click', () => {
    localStorage.removeItem('travelos.checklist');
    renderChecklist();
  });

  renderHeader();
  renderStatus();
  renderRouteSelector();
  renderRoute();
  renderChecklist();
  renderDecisions();
  setupTheme();
  setInterval(updateCountdown, 60000);
})();
