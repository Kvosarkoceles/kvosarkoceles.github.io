/* ==========================================================================
   Configuración de analítica — Miguel Ángel Mendoza Enríquez
   --------------------------------------------------------------------------
   Credenciales del proyecto de Supabase que recibe las visitas y los clics,
   para poder consultarlos después como JSON.

   La clave 'anon' es PÚBLICA por diseño: viaja al navegador de cada visitante
   y es visible en el código fuente de la página. No es un secreto, y por eso
   puede vivir en este archivo. Lo que protege tus datos es la política RLS de
   la tabla 'eventos': solo permite INSERT anónimo y NO permite SELECT.

   NUNCA pongas aquí la clave 'service_role'. Esa salta RLS por completo y da
   acceso total a la base de datos.
   ========================================================================== */

window.CONFIG_ANALITICA = {
  // Endpoint REST de la tabla. Inserta directamente con la política RLS.
  url: 'https://jxhtzbzukmdlqpzuugdx.supabase.co/rest/v1/eventos',

  // ALTERNATIVA (Nivel 2: con país, región y ciudad).
  // Cuando despliegues la Edge Function, comenta la línea de arriba y
  // descomenta esta. A partir de ese momento los eventos pasan por la función,
  // que resuelve la ubicación desde la IP. Debes hacerlo EN EL MISMO MOMENTO
  // en que elimines la política 'permitir_insert_anonimo' de la tabla.
  //
  // url: 'https://jxhtzbzukmdlqpzuugdx.supabase.co/functions/v1/registrar-evento',

  // Clave 'publishable' del proyecto (Settings -> API).
  // Es pública por diseño: viaja al navegador de cada visitante y es visible
  // en el código fuente. Lo que protege los datos es la política RLS.
  clave: 'sb_publishable_ZW8XyjyhwCP2zzcX1sodhQ_8D-rqzM1',

  // Ponlo en false para dejar de enviar eventos sin tocar el resto del código.
  activo: true
};
