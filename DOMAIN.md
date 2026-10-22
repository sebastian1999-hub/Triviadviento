# Dominio personalizado: triadviento.com

El dominio elegido es `triadviento.com`. La marca de la página sigue siendo Triviadviento.

El archivo `public/CNAME` se copia a `docs/CNAME` durante el build para conservar la configuración al publicar cambios. No subir estos archivos hasta estar listo para configurar DNS: GitHub Pages puede empezar a redirigir el enlace anterior al dominio nuevo.

## Conexión

1. Configurar `triadviento.com` como dominio personalizado de GitHub Pages en el repositorio `sebastian1999-hub/Triviadviento`.
2. En Cloudflare, revisar los registros existentes y añadir los siguientes registros, inicialmente con **DNS only** y TTL automático. No modificar registros de correo ni otros servicios.

| Tipo | Nombre | Destino |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | sebastian1999-hub.github.io |

3. Comprobar que GitHub detecta los DNS y solicita el certificado HTTPS.
4. Activar **Enforce HTTPS** cuando GitHub lo permita y comprobar tanto el dominio principal como `www`. La validación y propagación pueden tardar hasta 24 horas.

No se requieren registros comodín ni un nuevo plan de alojamiento. Las credenciales de Cloudflare no deben guardarse en el repositorio.

Referencia: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
