//Array para armazenar as tarefas
let tarefas = [];
""
const inputTarefa = document.querySelector(".campo-tarefa"); //<input>
const botaoAdicionar = document.querySelector(".botao-adicionar"); //<button>
const listaTarefas = document.querySelector(".lista-tarefas"); //<ul>
 

//Função para adicionar uma tarefa
function renderizarTarefas(){
    
    listaTarefas.innerHTML = "";
 
    //para percorrer o array com as tarefas alocadas e posicionadas na tela (i)
    for (let i = 0; i < tarefas.length; i++){
        const tarefaTexto = tarefas[i]; //texto da tarefa é o valor do array

        //cria um elemento li para cada tarefa
        const itemLista = document.createElement("li");
        itemLista.className = "item-tarefa";
        itemLista.textContent = tarefaTexto;

        //Cria o elemento botão remover para cada tarefa
        const botaoRemover = document.createElement("button");
        botaoRemover.className = "botao-remover";
        botaoRemover.textContent = "Remover";

        //Cria o elemento botão editar para cada tarefa
        const botaoEditar = document.createElement("button");
        botaoEditar.className = "botao-editar";
        botaoEditar.textContent = "Editar";


       //adiciona o botão (clique) de remover a tarefa
       botaoRemover.addEventListener("click", 
        function(i) {
            tarefas.splice(i, 1); //remove a tarefa do array
            renderizarTarefas(); //atualiza a lista de tarefas
        });


        //adicionar o botão (clique) para editar a tarefa
        botaoEditar.addEventListener("click", function() {
                editarTarefa(i); //chama a função para editar a tarefa
        }); 
    

     itemLista.appendChild(botaoRemover); //adiciona o botão de remover a tarefa
     itemLista.appendChild(botaoEditar); //adiciona o botão de editar a tarefa
     listaTarefas.appendChild(itemLista); //adiciona a tarefa (li) na lista de tarefas (ul)
    }
}
 
     //Função para editar uma tarefa
        function editarTarefa(i) {
                const tarefaAtualizada = prompt("Editar tarefa: ", tarefas[i]);
                if (tarefaAtualizada !== null && tarefaAtualizada.trim() !== "") {
                    tarefas[i] = tarefaAtualizada; //atualiza a tarefa no array
                    console.log(tarefas[i]);
                    renderizarTarefas(); //atualiza a lista de tarefas
                }
            }

    // Evento para adicionar a tarefa
   botaoAdicionar.addEventListener("click", 
    function(evento) {
        evento.preventDefault(); //previne o comportamento padrão do botão
        
        const novaTarefa = inputTarefa.value.trim(); //pega o valor do input
       
        if (novaTarefa !== "") { //verifica se o campo não está vazio
            tarefas.push(novaTarefa); //adiciona a tarefa no array
            inputTarefa.value = ""; //limpa o campo de texto
            renderizarTarefas(); //atualiza a lista de tarefas
        }
    });
