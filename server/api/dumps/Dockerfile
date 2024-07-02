FROM docker-registry.wikimedia.org/python3-bookworm:latest

WORKDIR /opt/app/scripts

RUN apt update && apt install -y cron
RUN mv /usr/lib/python3.11/EXTERNALLY-MANAGED /usr/lib/python3.11/EXTERNALLY-MANAGED.old && \
    pip install pandas==2.2.2

COPY ./scripts .
RUN chmod +x entrypoint.sh update_dumps.sh

ENTRYPOINT ./entrypoint.sh
