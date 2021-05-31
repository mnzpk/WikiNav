import pandas as pd
import sqlite3
import sys
import os

language = sys.argv[1]
month = '2021-01'
dump_dir = f"/public/dumps/public/other/clickstream/{month}/"
clickstream_fn = f'clickstream-{language}-{month}.tsv.gz'
database = os.path.expanduser(f'~/www/python/src/db/clickstream_{language[:2]}.db')

conn = sqlite3.connect(database)
for chunk in pd.read_csv(os.path.join(dump_dir, clickstream_fn), compression='gzip', sep='\t', names=['prev', 'curr', 'type', 'n'], quoting=3, chunksize=60000):
    chunk.to_sql("clickstream", conn, if_exists="append",
                 method='multi', index=False)
conn.execute('CREATE INDEX prev on clickstream(prev)')
conn.execute('CREATE INDEX curr on clickstream(curr)')
conn.close()
