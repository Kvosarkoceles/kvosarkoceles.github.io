/**
 * Edge Function: registrar-evento
 * ---------------------------------------------------------------------------
 * Recibe un evento desde el navegador, resuelve país, región y ciudad a partir
 * de la IP del visitante, y guarda la fila en la tabla `eventos`.
 *
 * LA IP NO SE ALMACENA. Solo se usa en memoria para consultar el servicio de
 * geolocalización y se descarta inmediatamente. Lo que se guarda es dato
 * geográfico grueso (país/región/ciudad), con mucha menor carga legal.
 *
 * Desplegar:
 *   supabase functions deploy registrar-evento --no-verify-jwt
 *
 * El flag --no-verify-jwt es imprescindible: los visitantes son anónimos y no
 * llevan token de sesión. Como contrapartida, la función es pública; por eso
 * exige la cabecera `apikey` y limita el tamaño y la forma de lo que acepta.
 *
 * Variables de entorno:
 *   SUPABASE_URL              (inyectada automáticamente por Supabase)
 *   SUPABASE_SERVICE_ROLE_KEY (inyectada automáticamente por Supabase)
 *   IPINFO_TOKEN              (secreto propio; hay que crearlo a mano)
 */

import { createClient } from 'jsr:@supabase/supabase-js@2';

const CABECERAS_CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'apikey, authorization, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Límites de la tabla, para no provocar un error de restricción al insertar.
const LIMITES = {
  evento: 60,
  categoria: 60,
  etiqueta: 300,
  ruta: 300,
  referrer: 300,
  idioma: 20,
  pantalla: 20,
  navegador: 300,
  resolucion: 30,
  zona_horaria: 60,
} as const;

type Ubicacion = {
  pais: string | null;
  region: string | null;
  ciudad: string | null;
};

// Tamaño máximo del cuerpo aceptado. Un evento normal ronda los 300 bytes.
const LIMITE_CUERPO = 4096;

const SIN_UBICACION: Ubicacion = { pais: null, region: null, ciudad: null };

function responder(cuerpo: unknown, estado = 200): Response {
  return new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CABECERAS_CORS, 'Content-Type': 'application/json' },
  });
}

// Recorta un valor al límite de su columna. Devuelve null si viene vacío.
function texto(valor: unknown, maximo: number): string | null {
  if (valor === null || valor === undefined || valor === '') return null;
  return String(valor).slice(0, maximo);
}

// Normaliza un valor a booleano. Devuelve null si no es un booleano real, para
// no guardar "false" donde en realidad no hubo dato.
function booleano(valor: unknown): boolean | null {
  return typeof valor === 'boolean' ? valor : null;
}

// El navegador no puede conocer su propia IP pública: solo la ve el servidor.
// La primera entrada de x-forwarded-for es la del cliente; el resto son proxies.
function ipDelVisitante(req: Request): string {
  const reenviadas = req.headers.get('x-forwarded-for') ?? '';
  return reenviadas.split(',')[0].trim();
}

// Las IP privadas no se pueden geolocalizar: en desarrollo siempre será esta.
function esPrivada(ip: string): boolean {
  return (
    ip === '' ||
    ip === '::1' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip)
  );
}

async function ubicacionPorIp(ip: string): Promise<Ubicacion> {
  if (esPrivada(ip)) return SIN_UBICACION;

  const token = Deno.env.get('IPINFO_TOKEN');
  if (!token) {
    console.warn('Falta IPINFO_TOKEN: el evento se guardará sin ubicación.');
    return SIN_UBICACION;
  }

  try {
    const res = await fetch(`https://ipinfo.io/${ip}/json?token=${token}`);
    if (!res.ok) return SIN_UBICACION;

    const { country, region, city } = await res.json();
    return {
      pais: texto(country, 60),
      region: texto(region, 100),
      ciudad: texto(city, 100),
    };
  } catch {
    // Si el servicio falla, el evento se guarda igual, solo que sin ubicación.
    // Perder la ubicación es aceptable; perder el evento no.
    return SIN_UBICACION;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CABECERAS_CORS });
  }

  if (req.method !== 'POST') {
    return responder({ error: 'Método no permitido' }, 405);
  }

  if (!req.headers.get('apikey')) {
    return responder({ error: 'Falta la cabecera apikey' }, 401);
  }

  // La función es pública: cortamos cuerpos desmesurados antes de procesarlos.
  const largo = Number(req.headers.get('content-length') ?? 0);
  if (largo > LIMITE_CUERPO) {
    return responder({ error: 'Cuerpo demasiado grande' }, 413);
  }

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: 'JSON inválido' }, 400);
  }

  const evento = texto(cuerpo.evento, LIMITES.evento);
  if (!evento) {
    return responder({ error: 'Falta el campo evento' }, 400);
  }

  const ubicacion = await ubicacionPorIp(ipDelVisitante(req));

  const fila = {
    evento,
    categoria: texto(cuerpo.categoria, LIMITES.categoria),
    etiqueta: texto(cuerpo.etiqueta, LIMITES.etiqueta),
    ruta: texto(cuerpo.ruta, LIMITES.ruta),
    referrer: texto(cuerpo.referrer, LIMITES.referrer),
    idioma: texto(cuerpo.idioma, LIMITES.idioma),
    pantalla: texto(cuerpo.pantalla, LIMITES.pantalla),
    navegador: texto(cuerpo.navegador, LIMITES.navegador),
    movil: booleano(cuerpo.movil),
    resolucion: texto(cuerpo.resolucion, LIMITES.resolucion),
    zona_horaria: texto(cuerpo.zona_horaria, LIMITES.zona_horaria),
    extra: cuerpo.extra ?? null,
    ...ubicacion,
  };

  // La clave service_role salta RLS. Vive solo aquí, dentro de Supabase, y
  // jamás se expone al navegador.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { error } = await supabase.from('eventos').insert(fila);

  if (error) {
    console.error('Error al insertar el evento:', error.message);
    return responder({ error: 'No se pudo guardar el evento' }, 500);
  }

  return responder({ ok: true }, 201);
});
