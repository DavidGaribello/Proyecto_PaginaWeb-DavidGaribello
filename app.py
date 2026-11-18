import sqlite3
from pathlib import Path
from flask import Flask, redirect, render_template, request, url_for, jsonify

app=Flask(__name__)
BASE_DATOS=Path(__file__).with_name("database.db")
def get_db():
    conn = sqlite3.connect(BASE_DATOS)
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/")
def inicio():
    return render_template("index.html")
@app.route("/api/carrito", methods=["GET"])
def obtener_carrito():
    conn = get_db()
    filas = conn.execute("SELECT * FROM carrito").fetchall()
    conn.close()

    items = [
        {
            "id": fila["id"],
            "producto_id": fila["producto_id"],
            "name": fila["nombre"],
            "price": fila["precio"],
            "qty": fila["cantidad"],
            "selected": bool(fila["seleccionado"]),
            "image": fila["imagen"]
        }
        for fila in filas
    ]
    return jsonify(items)
@app.route("/api/carrito/agregar", methods=["POST"])
def agregar_al_carrito():
    datos = request.get_json()
    conn = get_db()
    cursor = conn.cursor()
    existente = cursor.execute(
        "SELECT id, cantidad FROM carrito WHERE producto_id = ?",
        (str(datos["producto_id"]),)
    ).fetchone()

    if existente:
        nueva_cant = existente["cantidad"] + int(datos.get("cantidad", 1))
        cursor.execute(
            "UPDATE carrito SET cantidad = ? WHERE id = ?",
            (nueva_cant, existente["id"])
        )
    else:
        cursor.execute(
            """INSERT INTO carrito (producto_id, nombre, precio, cantidad, seleccionado, imagen)
               VALUES (?, ?, ?, ?, 1, ?)""",
            (
                str(datos["producto_id"]),
                datos["nombre"],
                int(datos["precio"]),
                int(datos.get("cantidad", 1)),
                datos["imagen"]
            )
        )

    conn.commit()
    conn.close()
    return jsonify({"ok": True, "mensaje": "Producto agregado al carrito"})
@app.route("/api/carrito/<int:item_id>", methods=["PUT"])
def actualizar_carrito(item_id):
    datos = request.get_json()
    conn = get_db()
    conn.execute(
        "UPDATE carrito SET cantidad = ?, seleccionado = ? WHERE id = ?",
        (int(datos["qty"]), int(datos["selected"]), item_id)
    )
    conn.commit()
    conn.close()
    return jsonify({"ok": True})
@app.route("/api/carrito/<int:item_id>", methods=["DELETE"])
def eliminar_del_carrito(item_id):
    conn = get_db()
    conn.execute("DELETE FROM carrito WHERE id = ?", (item_id,))
    conn.commit()
    conn.close()
    return jsonify({"ok": True})

@app.get("/carrito")
def carrito():
    return render_template("shop_cart.html")

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


@app.get("/consultar")
def consult():
    client_id=request.args.get("id",type=int)
    conexion=sqlite3.connect(BASE_DATOS)
    cursor=conexion.cursor()
    cursor.execute("""
        SELECT nombre, apellido, direccion, telefono, correo
        FROM Usuario
        WHERE id_usuario=?
    """, (client_id,)
    )
    client=cursor.fetchone()
    conexion.close()
    if client is None:
        return render_template(
            "register.html", error="No se encontro el usuario"
        ),400
    nombre, apellido, direccion, telefono, correo = client
    return render_template(
        "register.html",
        client_id = client_id,
        nombre = nombre,
        apellido = apellido,
        direccion = direccion,
        telefono = telefono,
        correo = correo,
        usuario_encontrado = True,
    )


if __name__=="__main__":
    app.run(debug=True)
