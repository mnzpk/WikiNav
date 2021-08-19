import argparse
import pandas as pd
import os
import sqlite3


def convert(dump_file, sqlite_db, table_name):
    print("Creating SQLite database...")
    conn = sqlite3.connect(sqlite_db, isolation_level=None)

    # disable the rollback journal
    conn.execute("PRAGMA journal_mode = OFF;")
    # disable database disk synchronization
    conn.execute("PRAGMA synchronous = 0;")
    # don't release file locks after every transaction
    conn.execute("PRAGMA locking_mode = EXCLUSIVE;")

    print("Loading data into table...")
    clickstream_df = load_csv(dump_file)

    for chunk in clickstream_df:
        chunk.to_sql(table_name, conn, if_exists="append", method="multi", index=False)

    print("Creating index on column 'prev'...")
    conn.execute("CREATE INDEX IDX_CLK_PREV on clickstream(prev)")

    print("Creating index on column 'curr'...")
    conn.execute("CREATE INDEX IDX_CLK_CURR on clickstream(curr)")

    conn.close()
    print(f"The SQLite file {sqlite_db} has been created.")


def load_csv(dump_file):
    return pd.read_csv(
        dump_file,
        compression="gzip",
        sep="\t",
        names=["prev", "curr", "type", "n"],
        quoting=3,
        encoding="utf8",
        chunksize=10_000,
    )


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Convert a clickstream dump to a SQLite database."
    )
    parser.add_argument(
        "language", type=str, help="Clickstream dump language e.g. en for english."
    )
    parser.add_argument(
        "month", type=str, help="Clickstream dump month. Use format YYYY-MM."
    )
    parser.add_argument(
        "sqlite_db",
        type=str,
        nargs="?",
        help="Output SQLite database file. Use format xyz.db. \
                        If not provided, the name of the clickstream dump \
                        will be used.",
        default=None,
    )
    parser.add_argument(
        "table_name",
        type=str,
        nargs="?",
        help="Name of the table to write to in the SQLite \
                        file.",
        default="clickstream",
    )

    args = parser.parse_args()

    clickstream_dir = f"/public/dumps/public/other/clickstream/{args.month}/"
    clickstream = f"clickstream-{args.language}wiki-{args.month}"
    dump_file = os.path.join(clickstream_dir, f"{clickstream}.tsv.gz")
    sqlite_db = args.sqlite_db if args.sqlite_db else f"{clickstream}.db"

    convert(dump_file, sqlite_db, args.table_name)
