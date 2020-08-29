from flask import Flask, request, jsonify
app = Flask(__name__)

@app.route('/',methods = ['POST', 'GET', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_prelight_response()
    if request.method == 'POST':
        resp = jsonify(request.json)
        return _corsify_actual_response(resp), 200
    else:
        return '', 200


def _build_cors_prelight_response():
    response = jsonify('OK')
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add('Access-Control-Allow-Headers', "*")
    response.headers.add('Access-Control-Allow-Methods', "*")
    return response


def _corsify_actual_response(response):
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response


if __name__ == '__main__':
    app.run(debug = True)