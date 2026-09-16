-- ===========================================================================
-- Añade los campos de perfil de dispositivo a la tabla 'eventos'.
--
-- Todos ellos los expone el navegador sin pedir ningún permiso al visitante,
-- y no identifican a nadie por sí solos:
--   navegador     user-agent completo
--   movil         true si es dispositivo móvil
--   resolucion    pantalla física y densidad, formato ANCHOxALTO@densidad
--   zona_horaria  zona IANA, por ejemplo America/Mexico_City
--
-- Idempotente: puede ejecutarse varias veces sin provocar error.
-- ===========================================================================

alter table public.eventos
  add column if not exists navegador    text    check (char_length(navegador) <= 300),
  add column if not exists movil        boolean,
  add column if not exists resolucion   text    check (char_length(resolucion) <= 30),
  add column if not exists zona_horaria text    check (char_length(zona_horaria) <= 60);

comment on column public.eventos.navegador is
  'User-agent completo tal como lo envía el navegador.';
comment on column public.eventos.movil is
  'true si el visitante navega desde un dispositivo móvil.';
comment on column public.eventos.resolucion is
  'Resolución de pantalla y densidad, formato ANCHOxALTO@densidad.';
comment on column public.eventos.zona_horaria is
  'Zona horaria IANA del visitante. Señal geográfica aproximada.';
