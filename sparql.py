import collections
from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO
from json.encoder import JSONEncoder
from lxml import etree
import rdflib
import json
import xmltodict

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/query',methods = ['POST'])
def query():
    query = request.json["query"]
    g = rdflib.Graph()
    g.load("assets/Pokedex.owl")
    query_res = g.query(query)
    query = query_res.serialize(encoding='utf-8').decode().split('q', 1)
    final_str = query[0] + "ql>"
    l_split = query[1].split('>', 1)
    final_str += l_split[1]
    return xmltodict.parse(final_str)




if __name__ == "__main__":
    app.run()
