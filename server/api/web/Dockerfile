FROM docker-registry.wikimedia.org/python3-bookworm:latest

WORKDIR /opt/app/src

# Work around PEP-668 which doesn't let you install packages outside
# of a virtual env since we're already inside a container.
RUN mv /usr/lib/python3.11/EXTERNALLY-MANAGED /usr/lib/python3.11/EXTERNALLY-MANAGED.old
# Cache dependencies i.e. as long as requirements.txt stays the same,
# docker will retrieve them from the local cache when building.
COPY ./requirements.txt .
RUN pip install -r requirements.txt
COPY . .

# Add a non-root user and switch to it.
RUN addgroup --system app && adduser --system --group app
RUN chown -R app:app .
USER app
