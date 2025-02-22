# **GET-IT** // Projeto 1 - Programação Eficaz
O site Get-it é um site em que você pode criar, editar, deletar e organizar notas.

Para funcionalidades de A+ quase todo o site conta com um processos assíncronos, sem a necessidade de recarregar a página. E a funcionalidade escolhida para A+ é a de arrastar e reorganizar as notas como o usuário quiser.

# **Funcionalidades**

### **1. Adicionar Notas**
Você pode adicionar novas notas ao clicar em um botão de "Adicionar Nota". Embora a adição de notas aconteça de forma assíncrona, não há recarregamento da página. Após o envio da nota, ela é adicionada imediatamente à lista de notas.

### 2. Editar Notas
Cada nota possui um ícone de editar que permite modificar o título e o conteúdo da nota. Ao clicar nesse ícone, um formulário de edição é exibido, permitindo que você altere os dados e cor da nota. As alterações são salvas de forma assíncrona e a página não precisa ser recarregada para refletir as mudanças.

### 3. Visualizar Notas
Para visualizar uma nota, basta clicar no título da nota. A nota será ampliada, centralizada na tela e exibida. Ao sair do modo de visualização, a nota volta ao seu lugar original, sem perder suas informações.

### 4. Apagar Notas
Cada nota tem um ícone de excluir. Ao clicar nesse ícone de lixeira, a nota será removida de forma assíncrona sem a necessidade de recarregar a página.

### 5. Reorganizar Notas // *(Funcionalidade A+ Aprovada)*.
Você pode reorganizar as notas na tela ao clicar e arrastar para mover uma nota de lugar. A ordem das notas é automaticamente salva e a nova posição é atualizada sem precisar recarregar a página.

### 6. Interações Assíncronas
Todas as operações de edição, exclusão e reordenação de notas são feitas de maneira assíncrona, garantindo uma experiência mais rápida e sem interrupções. A única operação que não é feita de forma assíncrona, por uma limitação técnica, é a criação de novas notas.

### 7. Página de Erro 404
O site também conta com uma página de erro 404 personalizada para lidar com URLs inválidas ou páginas não encontradas. Se você acessar uma URL inexistente, será redirecionado para a página de erro 404.

# Tecnologias Utilizadas
-   HTML5
-	CSS3 (com transições suaves) 
-	JavaScript (para manipulação assíncrona de notas)
-	Flask (para o backend)
-	AJAX (para operações assíncronas)
-	SQLite (ou outro banco de dados simples) para armazenar as notas