// The .htaccess for Hostinger (Apache), shared by deploy/kit.mjs and the «Deploy a Hostinger» workflow.
export function htaccess(basePath = '') {
  const b = (basePath || '').replace(/\/$/, '');
  return `# Eclipse para restaurantes · Hostinger (Apache). Generado por deploy/htaccess.mjs.
Options -Indexes
DirectoryIndex index.html
ErrorDocument 404 ${b}/404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Siempre por HTTPS.
  RewriteCond %{HTTPS} !=on
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>

<IfModule mod_mime.c>
  AddType image/webp .webp
  AddType image/svg+xml .svg
  AddType application/manifest+json .webmanifest
  AddType text/plain .txt
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  # Publicación de prueba: que no se indexe (las páginas ya traen noindex y robots.txt dice Disallow).
  Header always set X-Robots-Tag "noindex, nofollow"
  # Lo que tiene hash en el nombre no cambia nunca; el HTML, siempre fresco.
  <FilesMatch "\\.(js|css|woff2)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(webp|png|svg|jpg|ico)$">
    Header set Cache-Control "public, max-age=604800"
  </FilesMatch>
  <FilesMatch "\\.(html|txt)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain application/javascript application/json image/svg+xml
</IfModule>
`;
}
