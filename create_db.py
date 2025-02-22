import sqlite3 as sql

# Conecta ao SQLite
con = sql.connect('db_notes.db')

# Cria um cursor
cur = con.cursor()

# Remove a tabela se já existir
cur.execute("DROP TABLE IF EXISTS notes")

# Cria a tabela notes
sql = '''CREATE TABLE "notes" (
    "ID" INTEGER PRIMARY KEY AUTOINCREMENT,
    "Title" TEXT,
    "Details" TEXT,
    "position" INTEGER,
    "color" TEXT
)'''
cur.execute(sql)

# Confirma as mudanças
con.commit()

# Fecha a conexão
con.close()
