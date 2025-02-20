from utils import load_data, load_template, load_note
import sqlite3

def index():
    note_template = load_template('components/notes.html')
    notes_li = [
        note_template.format(title=dados['titulo'], details=dados['detalhes'], id= dados['id'])
        for dados in load_data('notes')
    ]
    notes = '\n'.join(notes_li)

    return load_template('index.html').format(notes=notes)

def submit(titulo, detalhes):
    conn = sqlite3.connect('db_notes.db')
    cursor = conn.cursor()

    # Obtém a maior posição atual
    cursor.execute("SELECT MAX(Position) FROM notes")
    max_position = cursor.fetchone()[0]  # Pega o valor máximo encontrado

    if max_position is None:  
        max_position = 0  # Se não houver notas, começa do 0

    new_position = max_position + 1  # Nova nota terá a próxima posição

    # Insere a nova nota com uma posição definida
    cursor.execute("INSERT INTO notes (Title, Details, Position) VALUES (?, ?, ?)", 
                   (titulo, detalhes, new_position))

    conn.commit()
    conn.close()


def delete_note(note_id):
    conn = sqlite3.connect('db_notes.db') #Estabelecendo conexão com o servidor

    cursor = conn.cursor() #Definindo o ponteiro para usar outros comandos da biblioteca

    cursor.execute("DELETE FROM notes WHERE id = ?", (note_id,)) #Deletando todos os arquivos que tenham o ID selecionado.

    conn.commit() #Salvando alterações no banco de dados

    conn.close() #Fechando a conexão

def edit_note(note_id, titulo, detalhes):
    conn = sqlite3.connect('db_notes.db') #Estabelecendo conexão com o servidor

    cursor = conn.cursor() #Definindo o ponteiro para usar outros comandos da biblioteca

    cursor.execute("UPDATE notes SET title = ?, details = ? WHERE id = ?", (titulo, detalhes, note_id)) #Deletando todos os arquivos que tenham o ID selecionado.

    conn.commit() #Salvando alterações no banco de dados

    conn.close() #Fechando a conexão