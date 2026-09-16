-- ===========================================================================
-- Añade las columnas de geolocalización a la tabla 'eventos'.
--
-- Solo se almacena dato geográfico grueso (país, región, ciudad), resuelto por
-- la Edge Function 'registrar-evento' a partir de la IP del visitante.
-- LA IP NO SE GUARDA EN NINGÚN MOMENTO: se usa en memoria, se consulta el
-- servicio de geolocalización y se descarta.
--
-- Es idempotente: puede ejecutarse varias veces sin provocar error.
--
-- NO incluye la eliminación de la política 'permitir_insert_anonimo'. Ese paso
-- debe hacerse a mano DESPUÉS de desplegar la Edge Function, porque si se
-- ejecuta antes no quedaría ningún camino válido para insertar eventos.
-- ===========================================================================

alter table public.eventos
  add column if not exists pais   text check (char_length(pais) <= 60),
  add column if not exists region text check (char_length(region) <= 100),
  add column if not exists ciudad text check (char_length(ciudad) <= 100);

comment on column public.eventos.pais is
  'País del visitante resuelto por geo-IP. La IP no se almacena.';
comment on column public.eventos.region is
  'Región o estado del visitante resuelto por geo-IP.';
comment on column public.eventos.ciudad is
  'Ciudad del visitante resuelta por geo-IP.';
