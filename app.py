from flask import Flask, render_template, request, redirect, jsonify
from cs50 import SQL

app=Flask(__name__)

db = SQL("sqlite:///menu.db")

'''@app.route("/")
def index():
    platos_rows = db.execute("SELECT nombre FROM platos")
    platos = {}
    for plato in platos_rows:
        platos[plato["nombre"]]=[]
    for plato in platos:
        ingredientes_plato_rows=db.execute("SELECT ingredientes.nombre FROM platos JOIN ingrediente_en_plato ON platos.id=ingrediente_en_plato.plato_id JOIN ingredientes ON ingredientes.id=ingrediente_en_plato.ingrediente_id WHERE platos.nombre=?", plato)
        for ingrediente in ingredientes_plato_rows:
            platos[plato].append(ingrediente["nombre"])
    return render_template("menu.html", platos=platos)'''

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/busqueda", methods=['GET', 'POST'])
def busqueda():
    if request.method=="POST":
        busqueda=request.json.get("listaIngredientes")
        print(busqueda, type(busqueda))
        nombres_ingredientes_rows=db.execute("SELECT nombre FROM ingredientes")
        nombres_ingredientes=[]
        for i in range(len(nombres_ingredientes_rows)):
            nombres_ingredientes.append(nombres_ingredientes_rows[i]["nombre"])
        busqueda=list(filter(lambda x: x in nombres_ingredientes, busqueda))
        print(busqueda)
        nombres_platos=set()
        for ingrediente in busqueda:
            platos_nombre_rows=db.execute("SELECT platos.nombre AS nombre FROM platos JOIN ingrediente_en_plato ON platos.id=ingrediente_en_plato.plato_id JOIN ingredientes ON ingrediente_en_plato.ingrediente_id=ingredientes.id WHERE ingredientes.nombre=?", ingrediente)
            for nombre in platos_nombre_rows:
                nombres_platos.add(nombre["nombre"])
        platos={}
        for nombre_plato in nombres_platos:
            ingredientes_rows=db.execute("SELECT ingredientes.nombre AS nombre FROM platos JOIN ingrediente_en_plato ON platos.id=ingrediente_en_plato.plato_id JOIN ingredientes ON ingrediente_en_plato.ingrediente_id=ingredientes.id WHERE platos.nombre=?", nombre_plato)
            ingredientes=[]
            for i in range(len(ingredientes_rows)):
                ingredientes.append(ingredientes_rows[i]["nombre"])
            platos[nombre_plato]=ingredientes
        print(platos)
        return jsonify(platos)
    else:
        return redirect("/")

'''@app.route("/todos")
def todo():
    platos_rows = db.execute("SELECT nombre FROM platos")
    nombres_platos = []
    for plato in platos_rows:
        nombres_platos.append(platos_rows["nombre"])
    platos = {}
    for plato in nombres_platos:
        ingredientes_rows =  ingredientes_rows=db.execute("SELECT ingredientes.nombre AS nombre FROM platos JOIN ingrediente_en_plato ON platos.id=ingrediente_en_plato.plato_id JOIN ingredientes ON ingrediente_en_plato.ingrediente_id=ingredientes.id WHERE platos.nombre=?", plato)
        ingredientes=[]
        for i in range(len(ingredientes_rows)):
            ingredientes.append(ingredientes_rows[i]["nombre"])
        platos[plato]=ingredientes
    return jsonify(platos)'''

@app.route("/ingredientes")
def ingredientes():
    ingredientes_rows = db.execute("SELECT nombre FROM ingredientes")
    print("ingredientes rows", ingredientes_rows)
    lista_ingredientes = []
    for ingrediente in ingredientes_rows:
        lista_ingredientes.append(ingrediente['nombre'])
    print("lista ingredientes", lista_ingredientes)
    return jsonify({'ingredientes': lista_ingredientes})