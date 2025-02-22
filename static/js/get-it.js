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
            const noteBody = this.closest(".note-body");
            activeNotebody = noteBody;
            const noteId = note.getAttribute("data-id");
            const noteTitle = note.querySelector("h3").innerText;
            const noteDetails = note.querySelector("p").innerText;
            const noteBgColor = window.getComputedStyle(note).backgroundColor;

            // Preenche os campos do modal
            editTitle.value = noteTitle;
            editDetails.value = noteDetails;
            editId.value = noteId;
            modal.querySelector(".modal-content").style.backgroundColor = noteBgColor;

            // Adiciona efeito de filp da nota
            note.classList.add("flipped");
            noteBody.classList.add("none");

            // Exibe o modal
            modal.style.display = "flex";
        });
    });

    let selectedColor = '';  // Variável para armazenar a cor selecionada

    // Quando o usuário selecionar uma cor
    document.querySelectorAll(".color-option").forEach(button => {
        button.addEventListener("click", function () {
            selectedColor = this.getAttribute("data-color");  // Pega a cor do botão clicado
            document.querySelector("#editModal .modal-content").style.backgroundColor = selectedColor;  // Altera a cor do modal
        });
    });

    // Submeter formulário via AJAX
    editForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const noteId = editId.value;
        const titulo = editTitle.value;
        const detalhes = editDetails.value;

            // Atualiza a cor da nota se uma cor for selecionada
        if (selectedColor) {
            document.querySelector(`[data-id='${noteId}']`).style.backgroundColor = selectedColor;
        }

        fetch(`/update/${noteId}`, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ titulo, detalhes, cor: selectedColor }) 
        })
        .then(response => response.json())
        .then(data => {
            console.log("Resposta do servidor:", data);

            if (activeNote) {
                activeNote.querySelector("h3").innerText = data.titulo;
                activeNote.querySelector("p").innerText = data.detalhes;
            }

            closeModal(); 
        })
        .catch(error => console.error("Erro ao atualizar nota:", error));
    });

    function closeModal() {
        modal.style.display = "none";
        if (activeNote) {
            activeNote.classList.remove("flipped");
            activeNote = null;
        };
        if (activeNotebody){
            activeNotebody.classList.remove("none");
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
                overlay.style.display = "none"; // Esconde a sobreposição
            } else {
                console.error("Erro ao deletar a nota");
            }
        })
        .catch(error => console.error("Erro ao enviar a requisição para deletar a nota:", error));
    }

    // Adiciona eventos às notas existentes ao carregar a página
    document.querySelectorAll(".note").forEach(attachNoteEvents);
    overlay.style.display = "none"; // Esconde a sobreposição
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

//scroll da página
document.addEventListener("DOMContentLoaded", function () {
    let lastScrollTop = 0;
    const imgLogo = document.querySelector(".img_logo");

    window.addEventListener("scroll", function () {
        let scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // Rolando para baixo, esconde a logo
            imgLogo.classList.add("hidden");
        } else {
            // Rolando para cima, mostra a logo
            imgLogo.classList.remove("hidden");
        }

        lastScrollTop = scrollTop;
    });
});

//visualizar nota
let overlay = document.createElement("div");
overlay.classList.add("overlay");
document.body.appendChild(overlay);  // Adiciona a sobreposição ao body

document.querySelectorAll(".note h3").forEach(noteTitle => {
    noteTitle.addEventListener("click", function() {
        const note = this.closest(".note");
        note.classList.add("expanded"); // Expande a nota
        overlay.style.display = "block"; // Mostra a sobreposição

        // Impede que a sobreposição clique na página
        overlay.addEventListener("click", function() {
            closeModal(); // Fecha a nota expandida ao clicar fora
        });
    });
});

function closeModal() {
    document.querySelectorAll(".note").forEach(note => note.classList.remove("expanded"));
    overlay.style.display = "none"; // Esconde a sobreposição
}

