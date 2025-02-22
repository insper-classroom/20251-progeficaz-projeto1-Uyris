from flask import Flask, render_template_string, request, redirect, jsonify
import views
import sqlite3
import random


app = Flask(__name__)

# Configurando a pasta de arquivos estáticos
app.static_folder = 'static'

#INDEX

@app.route('/')
def index():

    return render_template_string(views.index())

#CRIAR NOTAS SEM RECARREGAR
@app.route('/submit', methods=['POST'])
def submit_form():
    titulo = request.form.get('titulo')
    detalhes = request.form.get('detalhes')
    colors = ["#ffeb99", "#ffcccb", "#c3f3c3", "#add8e6", "#e6c3f3"]  # Lista de cores possíveis
    selected_color = random.choice(colors)  # Escolhe uma cor aleatória
    views.submit(titulo, detalhes, selected_color)  # Retorna o ID da nova nota

    return redirect('/')


@app.route('/update/<int:note_id>', methods=['POST'])
def edit_note(note_id):
    titulo = request.form.get('titulo')
    detalhes = request.form.get('detalhes')
    cor = request.form.get('cor')

    views.edit_note(note_id, titulo, detalhes, cor)

    # Retorna JSON com a atualização
    return jsonify({"message": "Nota atualizada!", "titulo": titulo, "detalhes": detalhes, "id": note_id})

#EXCLUIR NOTAS
@app.route('/delete/<int:note_id>', methods=['POST'])
def delete_form(note_id):
    # Deletar a nota do banco de dados
    views.delete_note(note_id)
    return jsonify({"status": "success", "note_id": note_id})

@app.route('/update_order', methods=['POST'])
def update_order():
    views.update_order(request)
    return jsonify({"message": "Ordem atualizada com sucesso!"})

@app.errorhandler(404)
def page_not_found(e):
    return render_template_string(views.error404())

if __name__ == '__main__':
    app.run(debug=True)