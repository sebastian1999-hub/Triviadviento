# Alcance de la protección

Esta publicación es una portada sin partidas jugables. No incluye bancos de preguntas ni respuestas correctas.

Controles actuales:

- Build que rechaza claves secretas y `service_role`.
- `.env.local` excluido de Git; no se suben contraseñas ni sesiones.
- Consulta del perfil propio solo después de autenticar al usuario.
- CSP con scripts del propio origen y conexiones limitadas al proyecto Supabase.
- Credenciales y peticiones de autenticación sin almacenamiento local ni caché solicitada.
- Archivos minimizados, sin sourcemaps y sin código de demos.
- Exclusión de indexación solicitada mediante meta robots y `robots.txt`.

Estos controles no impiden descargar la página ni copiar un repositorio público. No se bloquea el clic derecho ni la selección de texto: esas medidas no protegen el contenido y perjudican el uso de la web.

Quedan pendientes los controles de las partidas: respuestas y puntuación en servidor, intentos únicos, tiempos de servidor, reglas RLS, resultados condicionados a completar el reto y límites de peticiones. No debe habilitarse el juego real sin esos controles.

Para informar de una vulnerabilidad, contactar directamente con el propietario del repositorio sin publicar claves, contraseñas ni datos personales en un issue público.
