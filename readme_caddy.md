
### Caddy rules of portainer
https://portainer:9443 — tells Caddy to use HTTPS (since Portainer uses SSL).

tls_insecure_skip_verify — required because Portainer's SSL is self-signed and Caddy would reject it by default.

rewrite /portainer/* /{path} — strips the /portainer prefix from the path before sending it to Portainer (needed because Portainer expects to be served from /, not /portainer).