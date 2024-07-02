#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

BASE_DIR=/opt/app

cd "$BASE_DIR/db"

# Clear out existing dumps if any to make sure 
# we don't keep any old snapshots around.
rm -rf ./* 

# Import the latest two snapshots into sqlite for faster querying.
python3 "$BASE_DIR/scripts/snapshot_to_sqlite.py" --latest 2

# Write a marker file so downstream processes 
# know that database is ready.
touch "$BASE_DIR/SUCCESS"

# Set up cron job to convert the new snapshot available every month to a sqlite db.
# Redirect all output to this container's stdout and stderr so it shows up in docker logs.
echo "30 2 12 * * root $BASE_DIR/scripts/update_dumps.sh > /proc/1/fd/1 2>/proc/1/fd/2" \
    > /etc/cron.d/wikinav-dumps

# Start cron in the foreground to keep the container running.
cron -f
