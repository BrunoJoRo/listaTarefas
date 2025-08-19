const urlAPI = "http://localhost:3000/tarefas";

// Selecionar elementos do formulário
const inputTarefa = document.querySelector(".campo-tarefa");
const inputDescricao = document.querySelector(".campo-descricao");
const inputStatus = document.querySelector(".campo-status");
const inputPrioridade = document.querySelector(".campo-prioridade");
const inputDataEntrega = document.querySelector(".campo-data-entrega");
const botaoAdicionar = document.querySelector(".botao-adicionar");
const listaTarefas = document.querySelector(".lista-tarefas");
const formularioTarefa = document.querySelector(".formulario-tarefa");

// Função para validar os valores de status e prioridade
function validarValores(status, prioridade) {
    const statusValidos = ["Pendente", "Em andamento", "Concluída"];
    const prioridadesValidas = ["Baixa", "Média", "Alta"];
    
    return statusValidos.includes(status) && prioridadesValidas.includes(prioridade);
}

// Função para formatar a data para exibição
function formatarData(data) {
    if (!data) return "Não definida";
    
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString('pt-BR');
}

// Função para renderizar as tarefas
async function renderizarTarefas() {
    try {
        const resposta = await fetch(urlAPI);
        const tarefas = await resposta.json();

        listaTarefas.innerHTML = "";

        tarefas.forEach(tarefa => {
            const itemLista = document.createElement('li');
            itemLista.className = 'item-tarefa';

            // Criar elementos para exibir os dados da tarefa
            const titulo = document.createElement('div');
            titulo.className = 'titulo-tarefa';
            titulo.textContent = tarefa.titulo;

            const descricao = document.createElement('div');
            descricao.className = 'descricao-tarefa';
            descricao.textContent = tarefa.descricao || "Sem descrição";

            const detalhes = document.createElement('div');
            detalhes.className = 'detalhes-tarefa';

            const status = document.createElement('span');
            status.className = `status-tarefa ${tarefa.status}`;
            status.textContent = `Status: ${tarefa.status}`;

            const prioridade = document.createElement('span');
            prioridade.className = `prioridade-tarefa ${tarefa.prioridade}`;
            prioridade.textContent = `Prioridade: ${tarefa.prioridade}`;

            const dataCriacao = document.createElement('span');
            dataCriacao.className = 'data-criacao';
            dataCriacao.textContent = `Criada em: ${formatarData(tarefa.data_criacao)}`;

            const dataEntrega = document.createElement('span');
            dataEntrega.className = 'data-entrega';
            dataEntrega.textContent = `Entrega: ${formatarData(tarefa.data_entrega)}`;

            detalhes.appendChild(status);
            detalhes.appendChild(prioridade);
            detalhes.appendChild(dataCriacao);
            detalhes.appendChild(dataEntrega);

            const botoesAcao = document.createElement('div');
            botoesAcao.className = 'botoes-acao';

            const botaoRemover = document.createElement('button');
            botaoRemover.className = 'botao-remover';
            botaoRemover.textContent = 'Excluir';
            botaoRemover.addEventListener("click", () => removerTarefa(tarefa.id));

            const botaoEditar = document.createElement('button');
            botaoEditar.className = 'botao-editar';
            botaoEditar.textContent = 'Editar';
            botaoEditar.addEventListener("click", () => editarTarefa(tarefa));

            botoesAcao.appendChild(botaoEditar);
            botoesAcao.appendChild(botaoRemover);

            itemLista.appendChild(titulo);
            itemLista.appendChild(descricao);
            itemLista.appendChild(detalhes);
            itemLista.appendChild(botoesAcao);

            listaTarefas.appendChild(itemLista);
        });
    } catch (erro) {
        console.error("Erro ao renderizar tarefas: " + erro);
    }
}

// Função para adicionar uma nova tarefa
async function adicionarTarefa(titulo, descricao, status, prioridade, data_entrega) {
    try {
        // Validar os valores de status e prioridade
        if (!validarValores(status, prioridade)) {
            alert("Valores de status ou prioridade inválidos!");
            return;
        }

        const payload = {
            titulo: titulo,
            descricao: descricao,
            status: status,
            prioridade: prioridade,
            data_entrega: data_entrega || null
        };

        await fetch(urlAPI, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Limpar o formulário
        formularioTarefa.reset();
        
        // Recarregar a lista de tarefas
        renderizarTarefas();
    } catch (erro) {
        console.error("Erro ao adicionar tarefa:", erro);
    }
}

// Função para remover tarefa
async function removerTarefa(id) {
    try {
        await fetch(`${urlAPI}/${id}`, {
            method: "DELETE"
        });
        renderizarTarefas();
    } catch (erro) {
        console.error("Erro ao deletar tarefa:", erro);
    }
}

// Função para editar tarefa
async function editarTarefa(tarefa) {
    const novoTitulo = prompt('Editar título:', tarefa.titulo);
    if (!novoTitulo || novoTitulo.trim() === "") return;

    const novaDescricao = prompt('Editar descrição:', tarefa.descricao || "");
    
    let novoStatus = prompt('Editar status (Pendente, Em andamento, Concluída):', tarefa.status);
    if (novoStatus && !["Pendente", "Em andamento", "Concluída"].includes(novoStatus)) {
        alert("Status inválido! Use: Pendente, Em andamento ou Concluída");
        return;
    }
    
    let novaPrioridade = prompt('Editar prioridade (Baixa, Média, Alta):', tarefa.prioridade);
    if (novaPrioridade && !["Baixa", "Média", "Alta"].includes(novaPrioridade)) {
        alert("Prioridade inválida! Use: Baixa, Média ou Alta");
        return;
    }
    
    const novaDataEntrega = prompt('Editar data de entrega (YYYY-MM-DD):', tarefa.data_entrega || "");

    try {
        const payload = {
            titulo: novoTitulo,
            descricao: novaDescricao,
            status: novoStatus || tarefa.status,
            prioridade: novaPrioridade || tarefa.prioridade,
            data_entrega: novaDataEntrega || null
        };

        await fetch(`${urlAPI}/${tarefa.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        renderizarTarefas();
    } catch (erro) {
        console.error("Erro ao editar tarefa", erro);
    }
}

// Event listener para o formulário
formularioTarefa.addEventListener("submit", function (evento) {
    evento.preventDefault();
    
    const titulo = inputTarefa.value.trim();
    const descricao = inputDescricao.value.trim();
    const status = inputStatus.value;
    const prioridade = inputPrioridade.value;
    const dataEntrega = inputDataEntrega.value;

    // Validar campos obrigatórios
    if (!titulo || !status || !prioridade) {
        alert("Por favor, preencha todos os campos obrigatórios!");
        return;
    }

    adicionarTarefa(titulo, descricao, status, prioridade, dataEntrega);
});

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', renderizarTarefas);

