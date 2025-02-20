import sqlite3

def load_data(table_name):
    # CONECTANDO AO BANCO DE DADOS PARA ACESSAR AS INFORMAÇÕES
    conn = sqlite3.connect('db_notes.db')
    cursor = conn.cursor() #FUNCIONA COMO PONTEIRO PARA USAR OUTROS COMANDOS DA BIBLIOTECA SQLITE
    
    # SELECIONANDO TODAS AS TABELAS
    cursor.execute(f"SELECT * FROM {table_name} ORDER BY position ASC")
    data_format = []
    data = cursor.fetchall()
    for note in data:
        data_format.append({'id': note[0], 'titulo': note[1], 'detalhes': note[2], 'position': note[3]})

    # FECHANDO CONEXÃO
    conn.close()
    
    return data_format


def load_template(template_path):
    with open('static/templates/'+ template_path, 'r', encoding='utf-8') as template:
        data = template.read()
        return f'''{data}'''

def load_note(note_data):
    data = note_data
    for note in data:
        data_format = {'id': note[0], 'titulo': note[1], 'detalhes': note[2]}
    return data_format
