from dump_to_sqlite import convert
import argparse
import os

CLICKSTREAM_DIR = "/public/dumps/public/other/clickstream/"


def get_latest_snapshots(n=1):
    all_snapshots = get_all_subdirs_of(CLICKSTREAM_DIR)
    return [
        os.path.basename(path)
        for path in sorted(all_snapshots, key=os.path.getmtime, reverse=True)[:n]
    ]


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
        type=int,
        help="Number of latest snapshots to convert",
    )
    group.add_argument(
        "-s",
        "--snapshot",
        type=str,
        help="Snaphot to convert from the clickstream directory e.g. 2021-01.",
    )

    args = parser.parse_args()
    snapshots = get_latest_snapshots(n=args.latest) if args.latest else [args.snapshot]
    cwd = os.getcwd()

    for snapshot in snapshots:
        print(f"Converting snapshot: {snapshot}...")
        db_path = os.path.join(cwd, snapshot)
        os.mkdir(db_path)
        os.chdir(db_path)
        snapshot_path = os.path.join(CLICKSTREAM_DIR, snapshot)

        for dump in os.listdir(snapshot_path):
            print(f"Processing {dump}...")
            dump_path = os.path.join(snapshot_path, dump)
            convert(dump_path, dump.replace("tsv.gz", "db"), "clickstream")

    print("Successfully converted the entire snapshot.")
