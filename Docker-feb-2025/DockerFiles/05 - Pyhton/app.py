from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "¡Bienvenido a la API Flask en Docker!"

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {
        "message": "Hola desde Flask en Docker",
        "status": "success"
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
