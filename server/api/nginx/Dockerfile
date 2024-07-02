FROM docker-registry.wikimedia.org/bookworm:latest

RUN apt update && apt install -y nginx

# Symlink stdout and stderr so that they show up in docker logs.
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log

COPY nginx.conf /etc/nginx/sites-available/default
RUN ln -sf /etc/nginx/sites-available/default /etc/nginx/sites-enabled

# Send a SIGQUIT instead of SIGTERM when docker stop
# is issued so that nginx shuts down gracefully.
STOPSIGNAL SIGQUIT

# "daemon off" runs nginx in the foreground.
CMD ["nginx", "-g", "daemon off;"]
