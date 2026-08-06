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
});
