"""Print database tables and rows (local SQLite)."""
import sqlite3
import sys
from pathlib import Path

root = Path(__file__).resolve().parents[1]
candidates = [
    root / "Backend" / "instance" / "banking_app.db",
    root / "Backend" / "banking_app.db",
    root / "banking_app.db",
]

db_path = next((p for p in candidates if p.exists()), None)
if not db_path:
    print("No local database file found.")
    sys.exit(1)

print(f"Database file: {db_path}")
print(f"Size: {db_path.stat().st_size:,} bytes\n")

conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = [r[0] for r in cur.fetchall() if not r[0].startswith("sqlite_")]
print("Tables:", ", ".join(tables) or "(none)")
print()

for table in tables:
    cur.execute(f"SELECT COUNT(*) AS c FROM [{table}]")
    count = cur.fetchone()["c"]
    print(f"--- {table.upper()} ({count} rows) ---")
    if count == 0:
        print("(empty)\n")
        continue
    cur.execute(f"SELECT * FROM [{table}] LIMIT 20")
    rows = cur.fetchall()
    cols = rows[0].keys()
    print(" | ".join(cols))
    print("-" * 60)
    for row in rows:
        print(" | ".join(str(row[c]) for c in cols))
    if count > 20:
        print(f"... and {count - 20} more rows")
    print()

conn.close()
