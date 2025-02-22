document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("edit-modal");
    const editForm = document.getElementById("edit-form");
    const editTitle = document.getElementById("edit-titulo");
    const editDetails = document.getElementById("edit-detalhes");
    const editId = document.getElementById("edit-id");
    const cancelBtn = document.querySelector(".cancel-btn");
    let activeNote = null; // Para armazenar a nota que está sendo editada

    document.querySelectorAll(".note-buttons button[title='Editar']").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const note = this.closest(".note");
            activeNote = note;
            const noteId = note.getAttribute("data-id");
            const noteTitle = note.querySelector("h3").innerText;
            const noteDetails = note.querySelector("p").innerText;
            const noteBgColor = window.getComputedStyle(note).backgroundColor;

            // Preenche os campos do modal
            editTitle.value = noteTitle;
            editDetails.value = noteDetails;
            editId.value = noteId;
            modal.querySelector(".modal-content").style.backgroundColor = noteBgColor;

            // Adiciona efeito de zoom na nota
            note.classList.add("zoomed-note");

            // Exibe o modal
            modal.style.display = "flex";
        });
    });

    // Submeter formulário via AJAX
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const noteId = editId.value;
        const titulo = editTitle.value;
        const detalhes = editDetails.value;

        fetch(`/update/${noteId}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ titulo, detalhes }) 
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor:", data);

            if (activeNote) {
                activeNote.querySelector("h3").innerText = data.titulo;
                activeNote.querySelector("p").innerText = data.detalhes;
            }

            closeModal(); // Fecha o modal e remove o zoom
        })
        .catch(error => console.error("Erro ao atualizar nota:", error));
    });

    function closeModal() {
        modal.style.display = "none";
        if (activeNote) {
            activeNote.classList.remove("zoomed-note"); // Remove o zoom
            activeNote = null;
        }
    }

    // Fechar modal ao clicar no botão cancelar
    cancelBtn.addEventListener("click", closeModal);

    // Fechar modal ao clicar fora do conteúdo
    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".submit-form form");
    const notesContainer = document.querySelector(".notes-container");

    function attachNoteEvents(note) {
        // Evento de edição
        note.querySelector("[title='Editar']").addEventListener("click", function () {
            const noteId = note.getAttribute("data-id");
            openEditModal(noteId);
        });

        // Evento de deletar
        note.querySelector("[title='Deletar']").addEventListener("click", function () {
            const noteId = note.getAttribute("data-id");
            deleteNote(noteId);
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const formData = new FormData(form);

        fetch("/submit", {
            method: "POST",
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("Erro ao criar a nota:", data.error);
                return;
            }

            // Criar um novo elemento para a nota
            const newNote = document.createElement("li");
            newNote.classList.add("note");
            newNote.setAttribute("data-id", data.id);
            
            newNote.innerHTML = `
                <h3>${data.titulo}</h3>
                <p>${data.detalhes}</p>
                <div class="note-buttons">
                        <button type="submit" title="Editar">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm18.71-11.04c.39-.39.39-1.02 0-1.41l-2.54-2.54c-.39-.39-1.02-.39-1.41 0l-1.82 1.82 3.75 3.75 1.82-1.82z"></path>
                            </svg>
                        </button>
                        <button type="submit" title="Deletar">
                            <span class="material-symbols-outlined"> delete </span>
                        </button>
                </div>
            `;

            // Adicionar eventos para os botões da nova nota
            attachNoteEvents(newNote);

            // Adicionar ao final da lista
            notesContainer.appendChild(newNote);

            setTimeout(function () {
                modal.style.display = "none";
            }, 1000);   

            // Limpar formulário
            form.reset();
        })
        .catch(error => console.error("Erro ao enviar a nota:", error));
    });

    // Adiciona eventos às notas existentes ao carregar a página
    document.querySelectorAll(".note").forEach(attachNoteEvents);
});

document.addEventListener("DOMContentLoaded", function () {
    const notesContainer = document.querySelector(".notes-container");

    function attachNoteEvents(note) {
        // Evento de edição
        note.querySelector("[title='Editar']").addEventListener("click", function () {
            const noteId = note.getAttribute("data-id");
            openEditModal(noteId);  // função para abrir o modal de edição
        });

        // Evento de deletar
        note.querySelector("[title='Deletar']").addEventListener("click", function () {
            const noteId = note.getAttribute("data-id");
            deleteNote(note, noteId);  // função para deletar a nota
        });
    }

    // Função para deletar a nota
    function deleteNote(note, noteId) {
        fetch(`/delete/${noteId}`, {
            method: "POST"
        })
        .then(response => {
            if (response.ok) {
                // Se a resposta for bem-sucedida, removemos a nota do DOM
                note.remove();
            } else {
                console.error("Erro ao deletar a nota");
            }
        })
        .catch(error => console.error("Erro ao enviar a requisição para deletar a nota:", error));
    }

    // Adiciona eventos às notas existentes ao carregar a página
    document.querySelectorAll(".note").forEach(attachNoteEvents);
});

document.addEventListener("DOMContentLoaded", function () {
    const notesContainer = document.querySelector(".notes-container");

    new Sortable(notesContainer, {
        animation: 300,  // Aumenta o tempo da animação para ficar mais fluido
        ghostClass: "ghost",  // Classe CSS para o item arrastado
        easing: "cubic-bezier(0.25, 1, 0.5, 1)",  // Animação mais suave
        swapThreshold: 0.5, // Garante que a troca só ocorra na metade do caminho
    
        onEnd: function (evt) {
            saveNewOrder();
        }
    });
    

    function saveNewOrder() {
        const noteIds = [...document.querySelectorAll(".note")].map(note => note.getAttribute("data-id"));

        fetch("/update_order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: noteIds })
        })
        .then(response => response.json())
        .then(data => console.log("Ordem salva:", data))
        .catch(error => console.error("Erro ao salvar ordem:", error));
    }
});
