#!/usr/bin/env bash

set -o errexit
set -o nounset
set -o pipefail

# Switch to the directory containing sqlite files.
cd /opt/app/db
 
# Delete the earliest snaphot to make space for a new one.
ls | sort | head -1 | xargs rm -rf
 
# Convert the newest available snapshot to sqlite files.
python3 /opt/app/scripts/snapshot_to_sqlite.py --latest 1
 