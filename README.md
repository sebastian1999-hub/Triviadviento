# Triviadviento

Un calendario de retos navideños entre amigos. Del 1 al 25 de diciembre de 2026: seis categorías, cinco preguntas por jornada y una final especial.

**Estado actual: prelanzamiento.** Se puede visitar la portada y entrar con una cuenta existente, pero todavía no se puede jugar. No hay preguntas, soluciones ni resultados ficticios en los archivos publicados.

## Vista pública

GitHub Pages publica la carpeta `docs/` de la rama `main`. La dirección del proyecto es:

https://sebastian1999-hub.github.io/Triviadviento/

## Desarrollo

Requiere Node.js 20 o posterior.

```sh
npm ci
cp .env.example .env.local
npm test
npm run preview
```

En PowerShell, usar `Copy-Item .env.example .env.local` para copiar la configuración. El visor local sirve en `http://127.0.0.1:4174/Triviadviento/`.

La portada también se compila sin configuración de Supabase: en ese caso el acceso con cuenta queda pendiente. Para habilitarlo, rellenar en `.env.local` la URL del proyecto y exclusivamente su clave pública `anon` o `publishable`. Nunca una clave `service_role` o `secret`. El build rechaza esas claves privadas.

```sh
npm run build
```

El build genera `docs/`, con JavaScript y CSS minimizados, nombres de archivos con hash y sin mapas de código fuente. Para publicar cambios, regenerar `docs/` y subirlo junto con el código.

## Estructura

- `src/`: interfaz editable y estilos.
- `public/`: GIF del trineo; se conserva su orientación hacia la izquierda.
- `scripts/`: build, validación de configuración pública y visor local.
- `tests/`: controles de seguridad de la publicación.
- `docs/`: único contenido destinado a GitHub Pages.

## Acceso y seguridad

Las claves públicas de Supabase son necesariamente visibles en el navegador. La portada solo consulta el nombre del perfil de la cuenta que acaba de autenticarse; no descarga listados de usuarios. Las contraseñas se envían a Supabase y no se almacenan en esta web. La sesión de esta versión se mantiene en memoria.

El repositorio es público por decisión del propietario: su código puede consultarse y copiarse. La minimización dificulta la lectura casual de los archivos publicados, pero no protege el código fuente disponible aquí. `robots.txt` y `noindex` solicitan que los rastreadores no indexen el sitio; no bloquean robots que los ignoren.

Antes de habilitar partidas se deben implementar la validación de respuestas y el control de intentos en el servidor, políticas RLS que impidan leer soluciones y resultados ocultos, y límites de peticiones en los endpoints del juego. Estas protecciones todavía no están implementadas. No hay contenido real de las partidas en este repositorio.

La política CSP limita los scripts a este origen y las conexiones al proyecto Supabase configurado. No sustituye controles de acceso ni medidas contra bots en el servidor. GitHub Pages es alojamiento estático; esta versión no incorpora un cortafuegos, límites de peticiones propios ni desafíos para bots.

## Diseños de insignias

Los modelos de impresión y sus STL se guardan por separado, fuera de este repositorio y de la publicación web.

© 2026 Triviadviento. Todos los derechos reservados. No se concede una licencia de reutilización del código ni de los diseños por su publicación en este repositorio.
