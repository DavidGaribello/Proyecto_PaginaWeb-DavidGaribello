import sqlite3
from pathlib import Path
from flask import Flask, redirect, render_template, request, url_for

app=Flask(__name__)
BASE_DATOS=Path(__file__).with_name("database.db")

@app.get("/")
def inicio():
    return render_template("index.html")

@app.get("/registro")
def mostrar_registro():
    client_id=request.args.get("id",type=int)
    return render_template("register.html",cliente_id=client_id)

@app.post("/guardar")
def save_send():
    nombre=request.form.get("nombre","").strip()
    apellido=request.form.get("apellido","").strip()
    direccion=request.form.get("direccion","").strip()
    telefono=request.form.get("telefono","").strip()
    correo=request.form.get("correo","").strip()
    if not nombre or not apellido or not direccion or not telefono or not correo:
        return render_template(
            "register.html", error="Todos los campos son obligatorios"
        ),400
    conexion=sqlite3.connect(BASE_DATOS)
    cursor=conexion.cursor()
    cursor.execute("""
        INSERT INTO Usuario (nombre, apellido, direccion, telefono, correo)
        VALUES(?,?,?,?,?)
    """,(nombre,apellido,direccion,telefono,correo)
    )
    client_id=cursor.lastrowid
    conexion.commit()
    conexion.close()
    return redirect(url_for("mostrar_registro",id=client_id))
if __name__=="__main__":
    app.run(debug=True)
