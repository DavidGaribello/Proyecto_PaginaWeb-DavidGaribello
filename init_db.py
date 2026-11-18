import sqlite3
conexion=sqlite3.connect("database.db")
cursor=conexion.cursor()
cursor.execute("PRAGMA foreign_keys=ON")
cursor.execute("""
CREATE TABLE IF NOT EXISTS Usuario(
 id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
 nombre TEXT CHECK (length (nombre)<=20),
 apellido TEXT CHECK (length (apellido)<=20),
 direccion TEXT CHECK (length (direccion)<=20),
 telefono TEXT,
 correo TEXT CHECK (length (correo)<=50)
 )
""")
cursor.execute("""
CREATE TABLE IF NOT EXISTS carrito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    precio INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    seleccionado INTEGER NOT NULL DEFAULT 1,
    imagen TEXT NOT NULL
)
""")
conexion.commit()
conexion.close()