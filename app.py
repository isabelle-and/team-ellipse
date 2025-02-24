from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

DATA_FILE = 'dados.json'

def carregar_dados():
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def salvar_dados(data):
    with open(DATA_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# ✅ Endpoint para retornar todos os assentamentos
@app.route('/assentamentos', methods=['GET'])
def get_assentamentos():
    dados = carregar_dados()
    return jsonify(dados)

# ✅ Endpoint para retornar um assentamento por ID
@app.route('/assentamentos/<int:id>', methods=['GET'])
def get_assentamento_por_id(id):
    dados = carregar_dados()
    for item in dados:
        # Garante que ambos sejam comparados como inteiros
        if int(item.get("ID", -1)) == id:
            return jsonify(item)
    return jsonify({'message': 'Assentamento não encontrado.'}), 404


# ✅ Adicionar novo assentamento
@app.route('/assentamentos', methods=['POST'])
def adicionar_assentamento():
    novos_dados = request.json
    dados = carregar_dados()
    
    # Garante que o novo ID é único e incremental
    novos_dados["ID"] = max([item.get("ID", 0) for item in dados], default=0) + 1
    dados.append(novos_dados)
    salvar_dados(dados)
    return jsonify({'message': 'Assentamento adicionado com sucesso!', 'ID': novos_dados["ID"]}), 201


# ✅ Editar assentamento existente por ID
@app.route('/assentamentos/<int:id>', methods=['PUT'])
def editar_assentamento(id):
    novos_dados = request.json
    dados = carregar_dados()
    for index, item in enumerate(dados):
        if item["ID"] == id:
            dados[index] = novos_dados
            salvar_dados(dados)
            return jsonify({'message': 'Assentamento atualizado com sucesso!'})
    return jsonify({'message': 'Assentamento não encontrado.'}), 404

# ✅ Excluir assentamento por ID
@app.route('/assentamentos/<int:id>', methods=['DELETE'])
def excluir_assentamento(id):
    dados = carregar_dados()

    # Filtra os assentamentos excluindo o que tem o ID correspondente
    dados_filtrados = [item for item in dados if int(item.get("ID", -1)) != id]

    if len(dados_filtrados) == len(dados):
        return jsonify({'message': 'Assentamento não encontrado.'}), 404

    salvar_dados(dados_filtrados)
    return jsonify({'message': 'Assentamento excluído com sucesso!'})


if __name__ == '__main__':
    app.run(debug=True)
