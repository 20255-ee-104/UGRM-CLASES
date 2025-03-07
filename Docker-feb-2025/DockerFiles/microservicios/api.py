from flask import Flask, jsonify
import mysql.connector

app = Flask(__name__)

@app.route('/')
def hello():
    # Conexión a la base de datos (nombre del contenedor = 'db')
    db = mysql.connector.connect(
        host='db',
        user='root',
        password='examplepass',
        database='demo'
    )
    cursor = db.cursor()
    cursor.execute('SELECT "Conectado exitosamente a la base de datos!"')
    result = cursor.fetchone()
    db.close()
    return jsonify({'mensaje': result[0]})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
