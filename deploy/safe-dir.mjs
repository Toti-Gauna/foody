// Shared by deploy/kit.mjs and the «Deploy a Hostinger» workflow.
/**
 * The upload mirrors with --delete: pointed at a web root it would wipe the site there (eclipse-business.com). So no
 * default, and never empty, `/`, `.`, a bare `public_html` / `www` / `htdocs`, or `domains/<other domain>[/public_html]`.
 * `domains/<this site's domain>/public_html` is fine: on Hostinger that is the subdomain's own folder.
 */
export const safeFtpDir = (dir, siteDomain = '') => {
  const d = String(dir ?? '').trim().replace(/^\.?\/+/, '').replace(/\/+$/, '');
  if (!d || d === '.' || /^(public_html|www|htdocs)$/i.test(d)) return false;
  const m = d.match(/^domains\/([^/]+)(?:\/public_html)?$/i);
  if (m) return !!siteDomain && m[1].toLowerCase() === String(siteDomain).toLowerCase() && /\/public_html$/i.test(d);
  return true;
};
