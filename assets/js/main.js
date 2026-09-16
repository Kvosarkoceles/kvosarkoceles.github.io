/* ==========================================================================
   Portafolio — Miguel Ángel Mendoza Enríquez
   Interacciones: tema claro/oscuro, navegación móvil, sección activa,
   barra de progreso y animaciones de entrada.
   JavaScript nativo, sin dependencias. Todo degrada correctamente si algo
   no está disponible (por ejemplo, sin IntersectionObserver).
   ========================================================================== */

(function () {
  'use strict';

  var raiz = document.documentElement;
  var prefiereMenosMovimiento = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ---------------------------------------------------------------- Tema */

  function iniciarTema() {
    var boton = document.getElementById('theme-toggle');
    if (!boton) return;

    var icono = boton.querySelector('use');

    function pintarBoton(tema) {
      var esClaro = tema === 'light';
      boton.setAttribute('aria-pressed', String(esClaro));
      boton.setAttribute(
        'aria-label',
        esClaro ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro'
      );
      if (icono) {
        icono.setAttribute(
          'href',
          'assets/icons/sprite.svg#' + (esClaro ? 'i-moon' : 'i-sun')
        );
      }
    }

    pintarBoton(raiz.dataset.theme);

    boton.addEventListener('click', function () {
      var nuevo = raiz.dataset.theme === 'light' ? 'dark' : 'light';
      raiz.dataset.theme = nuevo;
      pintarBoton(nuevo);
      try {
        localStorage.setItem('tema', nuevo);
      } catch (e) {
        /* modo privado: el tema simplemente no se recuerda */
      }
    });

    // Si el usuario nunca eligió manualmente, seguimos al sistema operativo.
    var media = window.matchMedia('(prefers-color-scheme: light)');
    var alCambiarSistema = function (evento) {
      var guardado = null;
      try {
        guardado = localStorage.getItem('tema');
      } catch (e) {
        guardado = null;
      }
      if (guardado) return;
      var tema = evento.matches ? 'light' : 'dark';
      raiz.dataset.theme = tema;
      pintarBoton(tema);
    };

    if (media.addEventListener) {
      media.addEventListener('change', alCambiarSistema);
    } else if (media.addListener) {
      media.addListener(alCambiarSistema);
    }
  }

  /* --------------------------------------------------- Navegación móvil */

  function iniciarNavegacion() {
    var boton = document.getElementById('nav-toggle');
    var nav = document.getElementById('nav');
    if (!boton || !nav) return;

    var icono = boton.querySelector('use');

    function pintar(abierto) {
      document.body.classList.toggle('nav-open', abierto);
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute(
        'aria-label',
        abierto ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'
      );
      if (icono) {
        icono.setAttribute(
          'href',
          'assets/icons/sprite.svg#' + (abierto ? 'i-close' : 'i-menu')
        );
      }
    }

    boton.addEventListener('click', function () {
      pintar(!document.body.classList.contains('nav-open'));
    });

    nav.addEventListener('click', function (evento) {
      if (evento.target.closest('a')) pintar(false);
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && document.body.classList.contains('nav-open')) {
        pintar(false);
        boton.focus();
      }
    });

    document.addEventListener('click', function (evento) {
      if (!document.body.classList.contains('nav-open')) return;
      if (nav.contains(evento.target) || boton.contains(evento.target)) return;
      pintar(false);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) pintar(false);
    });
  }

  /* ------------------------------------------- Sección activa + progreso */

  function iniciarSeccionActiva() {
    var enlaces = Array.prototype.slice.call(
      document.querySelectorAll('#nav a[href^="#"]')
    );
    if (!enlaces.length) return;

    var porId = {};
    var secciones = [];

    enlaces.forEach(function (enlace) {
      var id = enlace.getAttribute('href').slice(1);
      var seccion = document.getElementById(id);
      if (!seccion) return;
      porId[id] = enlace;
      secciones.push(seccion);
      enlace.dataset.seccion = id;
    });

    if (!secciones.length) return;

    function marcar(id) {
      enlaces.forEach(function (enlace) {
        var activo = enlace.dataset.seccion === id;
        if (activo) {
          enlace.setAttribute('aria-current', 'true');
        } else {
          enlace.removeAttribute('aria-current');
        }
      });
    }

    if (!('IntersectionObserver' in window)) return;

    var observador = new IntersectionObserver(
      function (entradas) {
        var visibles = entradas
          .filter(function (e) { return e.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });

        if (visibles.length) marcar(visibles[0].target.id);
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: [0, 0.25, 0.5] }
    );

    secciones.forEach(function (seccion) { observador.observe(seccion); });

    // Al llegar al final no hay sección con "centro" visible: marcamos Contacto.
    window.addEventListener('scroll', function () {
      var alFinal =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 4;
      if (alFinal && secciones.length) {
        marcar(secciones[secciones.length - 1].id);
      }
    }, { passive: true });
  }

  function iniciarProgreso() {
    var barra = document.getElementById('scroll-progress');
    if (!barra) return;

    var pendiente = false;

    function actualizar() {
      var alto = document.documentElement.scrollHeight - window.innerHeight;
      var porcentaje = alto > 0 ? (window.scrollY / alto) * 100 : 0;
      barra.style.width = Math.min(100, Math.max(0, porcentaje)) + '%';
      pendiente = false;
    }

    window.addEventListener('scroll', function () {
      if (pendiente) return;
      pendiente = true;
      window.requestAnimationFrame(actualizar);
    }, { passive: true });

    actualizar();
  }

  /* ------------------------------------------------------ Animación entrada */

  function iniciarRevelado() {
    var elementos = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!elementos.length) return;

    if (prefiereMenosMovimiento || !('IntersectionObserver' in window)) {
      elementos.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observador = new IntersectionObserver(
      function (entradas, obs) {
        entradas.forEach(function (entrada) {
          if (!entrada.isIntersecting) return;
          var indice = elementos.indexOf(entrada.target);
          var retraso = Math.min(indice, 5) * 60;
          window.setTimeout(function () {
            entrada.target.classList.add('is-visible');
          }, retraso);
          obs.unobserve(entrada.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
    );

    elementos.forEach(function (el) { observador.observe(el); });
  }

  /* ----------------------------------------------------------- Año actual */

  function iniciarAnio() {
    var nodo = document.getElementById('year');
    if (nodo) nodo.textContent = String(new Date().getFullYear());
  }

  /* ------------------------------------------------------------- Arranque */

  function iniciar() {
    iniciarTema();
    iniciarNavegacion();
    iniciarSeccionActiva();
    iniciarProgreso();
    iniciarRevelado();
    iniciarAnio();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
