/* ==========================================================================
   Portafolio — Miguel Ángel Mendoza Enríquez
   Eventos de Google Tag Manager (dataLayer).

   Envía eventos personalizados para medir las acciones que importan:
   descarga del CV, contactos, redes sociales, navegación interna,
   cambio de tema, profundidad de lectura y errores 404.

   Requiere que el contenedor de GTM esté cargado en la página, pero
   funciona igual sin él: solo acumula los pushes en window.dataLayer.

   Además, cada evento se envía a Supabase (tabla 'eventos') para poder
   consultar después las visitas y los clics como JSON. Las credenciales
   viven en assets/js/config.js; si ese archivo falta o está desactivado,
   el envío remoto se omite en silencio.
   ========================================================================== */

(function () {
  'use strict';

  var dataLayer = (window.dataLayer = window.dataLayer || []);

  /* -------------------------------------------------------- Utilidades */

  // Envía un evento al dataLayer con nombre, categoría y etiqueta.
  function enviar(evento, categoria, etiqueta, extra) {
    var datos = {
      event: evento,
      categoria: categoria || 'general',
      etiqueta: etiqueta || ''
    };

    if (extra) {
      for (var clave in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, clave)) {
          datos[clave] = extra[clave];
        }
      }
    }

    dataLayer.push(datos);
    enviarASupabase(evento, categoria, etiqueta, extra);
  }

  /* ------------------------------------------------- Registro en Supabase */

  // Recorta un valor para no chocar con las restricciones de longitud de la
  // tabla: si un campo se pasa de largo, el INSERT falla y el evento se pierde.
  function recortar(valor, maximo) {
    if (valor === null || valor === undefined) return null;
    var texto = String(valor);
    return texto.length > maximo ? texto.slice(0, maximo) : texto;
  }

  // Envía el evento a Supabase. Si falta la configuración o está desactivada,
  // no hace nada: el sitio sigue midiéndose solo con el dataLayer de GTM.
  function enviarASupabase(evento, categoria, etiqueta, extra) {
    var config = window.CONFIG_ANALITICA;

    if (!config || !config.activo || !config.url || !config.clave) return;

    var registro = {
      evento: recortar(evento, 60),
      categoria: recortar(categoria || 'general', 60),
      etiqueta: recortar(etiqueta, 300),
      ruta: recortar(window.location.pathname + window.location.search, 300),
      referrer: recortar(document.referrer, 300),
      idioma: recortar(navigator.language, 20),
      pantalla: recortar(window.innerWidth + 'x' + window.innerHeight, 20),
      extra: extra || null
    };

    try {
      // fetch y no sendBeacon: Supabase exige la cabecera 'apikey' y
      // sendBeacon no permite añadir cabeceras propias.
      fetch(config.url, {
        method: 'POST',
        headers: {
          'apikey': config.clave,
          'Authorization': 'Bearer ' + config.clave,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(registro),
        keepalive: true
      }).catch(function () {});
    } catch (e) {
      // Sin red o navegador sin fetch: el evento solo queda en el dataLayer.
    }
  }

  // Texto visible del elemento, recortado y sin espacios sobrantes.
  function textoDe(elemento) {
    var texto = (elemento.textContent || '').replace(/\s+/g, ' ').trim();
    return texto.length > 80 ? texto.slice(0, 77) + '…' : texto;
  }

  // Clasifica un enlace y devuelve los datos del evento, o null si se ignora.
  function clasificarEnlace(enlace, href) {
    var texto = textoDe(enlace);

    if (href.indexOf('Miguel-Mendoza-CV.pdf') !== -1) {
      return {
        evento: 'descarga_cv',
        categoria: 'conversion',
        etiqueta: 'CV en PDF',
        extra: { texto_enlace: texto, archivo: 'Miguel-Mendoza-CV.pdf' }
      };
    }

    if (href.indexOf('mailto:') === 0) {
      return { evento: 'clic_correo', categoria: 'contacto', etiqueta: href.slice(7), extra: { texto_enlace: texto } };
    }

    if (href.indexOf('tel:') === 0) {
      return { evento: 'clic_telefono', categoria: 'contacto', etiqueta: href.slice(4), extra: { texto_enlace: texto } };
    }

    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) {
      return { evento: 'clic_whatsapp', categoria: 'contacto', etiqueta: 'WhatsApp', extra: { texto_enlace: texto } };
    }

    if (href.indexOf('linkedin.com') !== -1) {
      return { evento: 'clic_linkedin', categoria: 'redes', etiqueta: 'LinkedIn', extra: { texto_enlace: texto } };
    }

    if (href.indexOf('github.com') !== -1) {
      return { evento: 'clic_github', categoria: 'redes', etiqueta: 'GitHub', extra: { texto_enlace: texto } };
    }

    // Enlaces internos con ancla (#seccion).
    if (href.charAt(0) === '#' && href.length > 1) {
      return {
        evento: 'navegacion_seccion',
        categoria: 'navegacion',
        etiqueta: href.slice(1),
        extra: { seccion: href.slice(1), texto_enlace: texto }
      };
    }

    // Enlaces externos (no se cuentan los del propio sitio).
    if (/^https?:/i.test(href)) {
      var igualOrigen = false;
      try {
        igualOrigen = new URL(href, window.location.href).host === window.location.host;
      } catch (e) {
        igualOrigen = false;
      }

      if (!igualOrigen) {
        return { evento: 'clic_enlace_externo', categoria: 'salida', etiqueta: href, extra: { texto_enlace: texto } };
      }
    }

    return null;
  }

  /* ---------------------------------------------------- Clics en enlaces */

  document.addEventListener(
    'click',
    function (evento) {
      var enlace = evento.target && evento.target.closest
        ? evento.target.closest('a[href]')
        : null;

      if (!enlace) return;

      var datos = clasificarEnlace(enlace, enlace.getAttribute('href') || '');
      if (datos) enviar(datos.evento, datos.categoria, datos.etiqueta, datos.extra);
    },
    true
  );

  /* ----------------------------------------------- Otros elementos clicables */

  document.addEventListener(
    'click',
    function (evento) {
      var objetivo = evento.target;
      if (!objetivo || !objetivo.closest) return;

      if (objetivo.closest('#theme-toggle')) {
        enviar('cambio_tema', 'interfaz', document.documentElement.dataset.theme || 'desconocido');
      }
    },
    true
  );

  /* --------------------------------------------------- Profundidad de lectura */

  var hitos = [25, 50, 75, 100];
  var alcanzados = {};

  function medirScroll() {
    var documento = document.documentElement;
    var alturaTotal = documento.scrollHeight - documento.clientHeight;
    if (alturaTotal <= 0) return;

    var porcentaje = Math.min(100, Math.round((documento.scrollTop / alturaTotal) * 100));

    for (var i = 0; i < hitos.length; i++) {
      var hito = hitos[i];
      if (porcentaje >= hito && !alcanzados[hito]) {
        alcanzados[hito] = true;
        enviar('scroll_profundidad', 'lectura', hito + '%', { porcentaje_scroll: hito });
      }
    }
  }

  var ultimaMedicion = 0;

  window.addEventListener(
    'scroll',
    function () {
      var ahora = Date.now();
      if (ahora - ultimaMedicion < 200) return;
      ultimaMedicion = ahora;
      medirScroll();
    },
    { passive: true }
  );

  /* ------------------------------------------------------------ Tiempo en página */

  var inicio = Date.now();

  window.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'hidden') return;
    var segundos = Math.round((Date.now() - inicio) / 1000);
    enviar('tiempo_en_pagina', 'lectura', segundos + 's', { segundos_en_pagina: segundos });
  });

  /* ------------------------------------------------------------------- 404 */

  if (document.body && document.body.hasAttribute('data-page-404')) {
    enviar('pagina_404', 'error', window.location.pathname + window.location.search);
  }

  /* ---------------------------------------------------------------- Visita */

  // Solo a Supabase, nunca al dataLayer: GTM y GA4 ya disparan su propio
  // page_view, así que enviar otro aquí duplicaría la métrica en Analytics.
  enviarASupabase('visita_pagina', 'navegacion', document.title, { titulo: document.title });
})();
