// 1) Theme toggle, mobile menu, skill cards, scroll reveal, contact form
(function () {
  var root = document.documentElement, btn = document.getElementById('theme');
  function dark() {
    var t = root.getAttribute('data-theme');
    return t ? t === 'dark' : matchMedia('(prefers-color-scheme:dark)').matches;
  }
  function sync() { btn.textContent = dark() ? '☀' : '☾'; }
  try { var s = localStorage.getItem('theme'); if (s) root.setAttribute('data-theme', s); } catch (e) {}
  sync();
  btn.onclick = function () {
    var n = dark() ? 'light' : 'dark';
    root.setAttribute('data-theme', n);
    try { localStorage.setItem('theme', n); } catch (e) {}
    sync();
  };

  var links = document.getElementById('links'), bg = document.getElementById('burger');
  bg.onclick = function () { var o = links.classList.toggle('open'); bg.setAttribute('aria-expanded', o); };
  links.addEventListener('click', function (e) { if (e.target.tagName === 'A') links.classList.remove('open'); });

  var skills = [
    ['Py', 'Python', 'Language', 'Backend logic and scripting'],
    ['Dj', 'Django', 'Framework', 'Models, views, templates and CRUD apps'],
    ['H5', 'HTML5', 'Front end', 'Semantic page structure'],
    ['C3', 'CSS3', 'Front end', 'Responsive layouts and styling'],
    ['JS', 'JavaScript', 'Language', 'Interactive front-end behaviour'],
    ['SQL', 'SQL', 'Database', 'Queries and relational data design'],
    ['Re', 'React', 'Library', 'Component-based interfaces'],
    ['Git', 'Git & GitHub', 'Tools', 'Version control and sharing code']
  ];
  document.getElementById('skillgrid').innerHTML = skills.map(function (s) {
    return '<div class="skill glass rv"><div class="ic">' + s[0] + '</div><h3>' + s[1] + '</h3><span class="tag">' + s[2] + '</span><p>' + s[3] + '</p></div>';
  }).join('');

  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.rv').forEach(function (el, i) {
    el.style.transitionDelay = (el.classList.contains('skill') ? (i % 4) * 80 : 0) + 'ms';
    io.observe(el);
  });

  document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    var f = e.target, n = f.name.value.trim(), m = f.msg.value.trim(), em = f.email.value.trim();
    var body = encodeURIComponent(m + '\n\nFrom: ' + n + ' (' + em + ')');
    document.getElementById('note').textContent = 'Opening your email app to send this message.';
    location.href = 'mailto:aditispawar002@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + n) + '&body=' + body;
  };
})();

// 2) Scroll progress, active nav link, counters, timeline, particles, cursor glow, tilt, magnetic buttons
(function () {
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  var bar = document.createElement('div'); bar.id = 'progress'; document.body.appendChild(bar);
  var nav = document.querySelector('nav');
  var secs = [].slice.call(document.querySelectorAll('main section[id]'));
  var ls = [].slice.call(document.querySelectorAll('.links a'));

  function onScroll() {
    var m = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (m > 0 ? scrollY / m : 0) + ')';
    nav.classList.toggle('scrolled', scrollY > 20);
    var cur = '';
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < innerHeight * .4) cur = s.id; });
    ls.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + cur); });
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // number counters
  var cs = [].slice.call(document.querySelectorAll('[data-count]'));
  var co = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      var el = e.target, to = parseFloat(el.dataset.count), dec = +el.dataset.dec || 0;
      if (rm) { el.textContent = to.toFixed(dec); return; }
      var t0 = performance.now();
      (function f(t) {
        var p = Math.min((t - t0) / 1500, 1);
        el.textContent = (to * (1 - Math.pow(1 - p, 3))).toFixed(dec);
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    });
  }, { threshold: .6 });
  cs.forEach(function (el) { if (!rm) el.textContent = (0).toFixed(+el.dataset.dec || 0); co.observe(el); });

  // timeline line draws itself
  var tl = document.querySelector('.tl');
  if (tl) {
    var to = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { tl.classList.add('in'); to.disconnect(); } });
    }, { threshold: .2 });
    to.observe(tl);
  }
  document.querySelectorAll('.mini,.proj,.stat').forEach(function (el, i) {
    el.style.transitionDelay = (i % 3) * 110 + 'ms';
  });

  if (rm) return;

  // floating code symbols in the hero
  var hero = document.querySelector('.hero');
  var sym = ['{ }', '</>', '( )', 'py', '=>', '[ ]', '#', '1010', 'def'];
  for (var i = 0; i < 14; i++) {
    var s = document.createElement('span');
    s.className = 'pt'; s.textContent = sym[i % sym.length];
    s.style.left = (Math.random() * 96) + '%';
    s.style.fontSize = (.8 + Math.random() * .9) + 'rem';
    s.style.animationDuration = (12 + Math.random() * 14) + 's';
    s.style.animationDelay = (-Math.random() * 20) + 's';
    hero.appendChild(s);
  }

  if (!fine) return;

  // cursor glow
  var g = document.createElement('div'); g.className = 'glow'; document.body.appendChild(g);
  addEventListener('mousemove', function (e) { g.style.left = e.clientX + 'px'; g.style.top = e.clientY + 'px'; }, { passive: true });

  // 3D tilt on cards
  function tilt(el, max) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transition = 'transform .12s ease-out,border-color .3s'; el.style.transitionDelay = '0ms';
      el.style.transform = 'perspective(800px) rotateX(' + (-y * max) + 'deg) rotateY(' + (x * max) + 'deg) translateY(-6px)';
    });
    el.addEventListener('mouseleave', function () { el.style.transition = ''; el.style.transform = ''; });
  }
  document.querySelectorAll('.skill,.stat').forEach(function (el) { tilt(el, 10); });
  document.querySelectorAll('.proj').forEach(function (el) { tilt(el, el.classList.contains('feat') ? 3 : 7); });

  // magnetic buttons
  document.querySelectorAll('.btn').forEach(function (b) {
    b.addEventListener('mousemove', function (e) {
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * .2) + 'px,' + ((e.clientY - r.top - r.height / 2) * .3 - 3) + 'px)';
    });
    b.addEventListener('mouseleave', function () { b.style.transform = ''; });
  });
})();

// 3) Clickable "Open to roles as" tags
(function () {
  document.querySelectorAll('.role').forEach(function (b) {
    b.addEventListener('click', function () {
      b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') !== 'true');
      b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    });
  });
})();