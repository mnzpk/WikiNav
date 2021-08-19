from dump_to_sqlite import convert
import argparse
import os

CLICKSTREAM_DIR = "/public/dumps/public/other/clickstream/"


def get_latest_snapshot():
    all_snapshots = get_all_subdirs_of(CLICKSTREAM_DIR)
    return os.path.basename(max(all_snapshots, key=os.path.getmtime))


def get_all_subdirs_of(directory="."):
    result = []
    for d in os.listdir(directory):
        subdir = os.path.join(directory, d)
        if os.path.isdir(subdir):
            result.append(subdir)
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convert a clickstream snapshot to a directory \
             containing SQLite databases."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "-l",
        "--latest",
        action="store_true",
        help="If set, the script will convert the latest snaphot in \
            the clickstream directory.",
    )
    group.add_argument(
        "-s",
        "--snapshot",
        type=str,
        help="Snaphot to convert from the clickstream directory e.g. 2021-01.",
    )

    args = parser.parse_args()
    snapshot = get_latest_snapshot() if args.latest else args.snapshot
    snapshot_path = os.path.join(CLICKSTREAM_DIR, snapshot)

    os.mkdir(snapshot)
    os.chdir(snapshot)

    for dump in os.listdir(snapshot_path):
        print(f"Converting {dump}...")
        dump_path = os.path.join(snapshot_path, dump)
        convert(dump_path, dump.replace("tsv.gz", "db"), "clickstream")

    print("Successfully converted the entire snapshot.")
