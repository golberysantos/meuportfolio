document.addEventListener('DOMContentLoaded', function () {

  // Ano no rodapé
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Menu mobile
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Terminal "build" — simula um build Java/Spring no hero
  initTerminal();

  // Projetos — busca ao vivo na GitHub API (com fallback pros cards fixos do HTML)
  loadGitHubProjects();
});

/* ===================================================
   TERMINAL DO HERO
   =================================================== */
function initTerminal() {
  var body = document.getElementById('terminalBody');
  if (!body) return;

  var script = [
    { text: '$ git clone github.com/golberysantos/carreira.git', cls: 'line-cmd' },
    { text: '$ cd carreira && mvn clean install', cls: 'line-cmd' },
    { text: '[INFO] Compilando Java 21 + Spring Boot...', cls: 'line-muted' },
    { text: '[INFO] Aplicando Clean Architecture, DDD, SOLID', cls: 'line-muted' },
    { text: '[INFO] Testes: 3 hackathons vencidos ✔', cls: 'line-muted' },
    { text: '[INFO] BUILD SUCCESS', cls: 'line-success' },
    { text: '> pronto para produção como Dev Java Backend', cls: 'line-success' }
  ];

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    body.innerHTML = script.map(function (l) {
      return '<div class="' + l.cls + '">' + l.text + '</div>';
    }).join('');
    return;
  }

  var lineIndex = 0;

  function typeLine() {
    if (lineIndex >= script.length) return;
    var lineData = script[lineIndex];
    var lineEl = document.createElement('div');
    lineEl.className = lineData.cls;
    body.appendChild(lineEl);

    var charIndex = 0;
    var speed = 18;

    (function typeChar() {
      if (charIndex <= lineData.text.length) {
        lineEl.textContent = lineData.text.slice(0, charIndex);
        charIndex++;
        setTimeout(typeChar, speed);
      } else {
        lineIndex++;
        setTimeout(typeLine, 260);
      }
    })();
  }

  typeLine();
}

/* ===================================================
   PROJETOS — GitHub REST API (pública, sem chave)
   Docs: https://docs.github.com/en/rest/repos/repos
   =================================================== */
function loadGitHubProjects() {
  var GH_USER = 'golberysantos';
  var EXCLUDE_REPOS = ['meuportfolio']; // não faz sentido listar o próprio portfólio como "projeto"
  var MAX_REPOS = 6;

  var grid = document.getElementById('projectsGrid');
  var status = document.getElementById('projectsStatus');
  if (!grid) return;

  var ICONS = ['💬', '🛒', '📊', '⚙️', '🧩', '🚀'];

  fetch('https://api.github.com/users/' + GH_USER + '/repos?sort=pushed&direction=desc&per_page=100')
    .then(function (res) {
      if (!res.ok) throw new Error('GitHub API respondeu ' + res.status);
      return res.json();
    })
    .then(function (repos) {
      var filtered = repos
        .filter(function (r) { return !r.fork && !r.archived; })
        .filter(function (r) { return EXCLUDE_REPOS.indexOf(r.name.toLowerCase()) === -1; })
        .slice(0, MAX_REPOS);

      if (filtered.length === 0) throw new Error('Nenhum repositório público encontrado');

      grid.innerHTML = filtered.map(function (repo, i) {
        var desc = repo.description ? escapeHtml(repo.description) : 'Sem descrição no repositório ainda.';
        var lang = repo.language ? '<span class="project-lang">' + escapeHtml(repo.language) + '</span>' : '';
        return (
          '<div class="col-md-4">' +
            '<a class="project-card" href="' + repo.html_url + '" target="_blank" rel="noopener">' +
              '<span class="project-icon">' + ICONS[i % ICONS.length] + '</span>' +
              '<h3>' + escapeHtml(repo.name) + '</h3>' +
              '<p>' + desc + '</p>' +
              lang +
              '<span class="project-link">ver repositório →</span>' +
            '</a>' +
          '</div>'
        );
      }).join('');

      if (status) {
        status.textContent = '🔄 atualizado automaticamente via GitHub API · ' +
          filtered.length + ' repositório(s) mais recentes de github.com/' + GH_USER;
      }
    })
    .catch(function (err) {
      // Falhou (rate limit, offline, etc.) — mantém os cards fixos que já estão no HTML
      console.warn('Não foi possível carregar projetos da GitHub API:', err.message);
      if (status) {
        status.textContent = '⚠️ não foi possível atualizar automaticamente agora — mostrando destaques fixos.';
      }
    });
}

function escapeHtml(str) {
  var div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}