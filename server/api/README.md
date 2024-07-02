# WikiNav API

## Prerequisites

- Install [docker](https://docs.docker.com/engine/install/debian/#install-using-the-repository)

## Dumps

The WikiNav API makes use of the [clickstream dataset](https://docs.docker.com/engine/install/debian/#install-using-the-repository) for retrieving the source and target articles for a given article in a given month. This means it needs access to the clickstream dumps. On Cloud VPS, this can be be enabled by mounting the `/public/dumps` NFS share for your project, which you can request:

> You can request for access to the listed shares by filing a task on Phabricator under the Data-Services and VPS-Projects projects. When Shared Storage NFS services have been granted, NFS will be mounted by Puppet on any VMs where the Hiera key `mount_nfs: true` applies.

As these dumps are CSV files, they need to be imported into an sqlite database so we can create indices that are used for doing quick lookups for requests. Additionally, since space is a concern on Cloud VPS VMs, we only keep around sqlite databases for the latest two months. This means that every month, when a new clickstream snapshot is released, we need to delete the sqlite database for the oldest month and generate a new one for this latest snapshot.

The [service for dumps](dumps/Dockerfile) handles this by converting the latest two snapshots when the container is first started and then sets up a cron job for replacing the snapshots as described above. This job runs on the 12th of every month.

Most Cloud VPS VM flavors have ~20 GiB of disk space which might not be enough for the converted dumps, docker images and logs etc. combined, so you'll also need to [attach a Cinder volume](https://wikitech.wikimedia.org/wiki/Help:Adding_disk_space_to_Cloud_VPS_instances) to your VM.

## Deployment

This application can be deployed using Docker Compose:

```bash
$ docker compose up -d
```

This will spin up a container each for the flask app, the nginx forward proxy and the cron daemon. Note that the flask app container doesn't get started until the dumps have been processed and the database is ready and so does the nginx container as it waits on the flask app.

The API should be available at http://localhost:8080/api/v1.

To check the logs, run:

```bash
$ docker compose logs
```

To check the logs for a specific service, append its name to the above command, e.g.:

```bash
$ docker compose logs web
```

If you've made any changes and want to restart the application:

```bash
$ docker compose down
$ docker compose up -d --build
```

Note that you don't _need_ to restart all services. Like the logs command above you can append the name of a single service to these commands which would only stop and remove the associated container.

The sqlite files will still linger under `/opt/app/db` even when the dumps service has stopped. They will be cleared out the next time the container starts but if you wish to remove them manually:

```bash
$ sudo rm -rf /opt/app/db
```

To see the resource usage for all containers:

```bash
$ docker stats
```

To run a command inside a running container, run:

```bash
$ docker compose exec dumps bash
```

> **TIP**: All `docker compose` commands either need to be run from the directory containing the `docker-compose.yml` file or by passing its path to the command itself: `docker compose -f <path-to-docker-compose.yml>`. Also note that if you haven't followed the docker [post-installation steps](https://docs.docker.com/engine/install/linux-postinstall/), you'll need to prefix all docker commands with `sudo`.
