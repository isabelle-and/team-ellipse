const apiURL = "http://localhost:5000/assentamentos";

document.addEventListener("DOMContentLoaded", () => {
    carregarAssentamentos();
    const cadastrarNovoBtn = document.createElement("button");
    cadastrarNovoBtn.id = "cadastrarNovo";
    cadastrarNovoBtn.textContent = "Cadastrar Novo Assentamento";
    cadastrarNovoBtn.addEventListener("click", abrirFormularioNovo);
    document.body.insertBefore(cadastrarNovoBtn, document.getElementById("formContainer"));
});

function carregarAssentamentos() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            // Ordenar os assentamentos pelo Nome do Projeto em ordem alfabética
            data.sort((a, b) => (a["Nome do Projeto"] || "").localeCompare(b["Nome do Projeto"] || ""));
            renderizarTabela(data);
            document.getElementById("totalAssentamentos").innerText = data.length;
            document.getElementById("cadastrarNovo").style.display = "block";
        })
        .catch(error => console.error("Erro ao buscar assentamentos:", error));
}

function renderizarTabela(assentamentos) {
    const tabela = document.getElementById("assentamentoTable");
    tabela.innerHTML = "";

    assentamentos.forEach(assentamento => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${assentamento["Nome do Projeto"]}</td>
            <td>${assentamento["CÓD SIPRA"]}</td>
            <td>${assentamento["Município"]}</td>
            <td>
                <button onclick="editarAssentamento(${assentamento.ID})">Editar</button>
                <button onclick="excluirAssentamento(${assentamento.ID})">Excluir</button>
                ${deveMostrarBotaoCompletar(assentamento) ? `<button style="background-color: red; color: white;" onclick="completarCadastro(${assentamento.ID})">Complete o Cadastro</button>` : ""}
            </td>
        `;
        tabela.appendChild(linha);
    });
}

function deveMostrarBotaoCompletar(assentamento) {
    return !assentamento.completo &&
        assentamento["Nome do Projeto"] &&
        assentamento["CÓD SIPRA"] &&
        assentamento["Município"] &&
        Object.keys(assentamento).length <= 4;
}

/* Abrir Formulário Vazio para Novo Assentamento */
function abrirFormularioNovo() {
    const formContainer = document.getElementById("formContainer");

    // Lista completa de campos do formulário, sem o campo "ID"
    const todosCampos = [
        "Nome do Projeto", "CÓD SIPRA", "Município", "Área (ha) desatualizada", "Capacidade de famílias do PA",
        "Quantidade de Famílias Assentadas no PA", " Vagas Ociosas", "PARCELA LOTE", "Fase", "Ato de criação TIPO",
        "Nº", "MICRORREGIÃO DE PLANEJAMENTO DO ESTADO", "MERCADO DE TERRAS", "BACIA HIDROGRÁFICA",
        "TERRITORIO DA CIDADANIA", "TERRITORIO SDA/MDA  ", "EAT", "EAT Nº", "TIPO", "TRÂNSITO EM JULGADO ",
        "PROVIDENCIA SOLICITADA", "Data CRIAÇÃO", "Obtenção Forma", "Data OBTENÇÃO", "SPIUNET COD MUNICIPIO",
        "PROCESSO JUDICIAL", "SNCR", "Proc. CRIAÇÃO no SEI", "Proc.  CRIAÇÃO no SEI", "Proc. OBTENÇÃO no SEI",
        "Proc. de OBTENÇÃO no SEI", "Kit SPIUNETno SEI", "Proc. SPIUNET no SEI", "PROC. CERTIFICAÇÃO NO SEI",
        "PROCESSO CERTIFICAÇÃO", "Area (Ha)", "Perimetro (metros)", "CERTIFICAÇÃO", "TITULADOS", "MATRICULA ATUAL"
    ];

    // Gera o formulário vazio
    formContainer.innerHTML = gerarFormulario(todosCampos, {});
    formContainer.style.display = "grid";
    formContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
    formContainer.style.gap = "15px";
    formContainer.style.width = "100%";
    document.getElementById("cadastrarNovo").style.display = "none"; // Oculta o botão ao abrir o formulário

    // Adiciona os botões de ação
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Salvar Novo Assentamento";
    saveButton.onclick = salvarNovoAssentamento;
    buttonContainer.appendChild(saveButton);

    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancelar";
    cancelButton.onclick = fecharFormulario;
    buttonContainer.appendChild(cancelButton);

    formContainer.appendChild(buttonContainer);
}

/* Gerar Formulário com Campos */
function gerarFormulario(campos, dados = {}) {
    let formHTML = "<h3>Formulário de Assentamento</h3>";

    campos.forEach(campo => {
        formHTML += `
            <div class="form-group ${getFieldSizeClass(campo)}">
                <label>${campo}:</label>
                <input type="text" id="${campo}" value="${dados[campo] || ""}">
            </div>
        `;
    });

    return formHTML;
}

/* Define o Tamanho dos Campos */
function getFieldSizeClass(campo) {
    const longFields = ["Nome do Projeto", "Proc. de OBTENÇÃO no SEI", "Endereço"];
    const mediumFields = ["Município", "CÓD SIPRA", "Bairro"];
    const shortFields = ["ID", "UF", "CEP"];

    if (longFields.includes(campo)) return "field-long";
    if (mediumFields.includes(campo)) return "field-medium";
    if (shortFields.includes(campo)) return "field-short";
    return "field-medium";  // padrão
}

/* Salvar Novo Assentamento */
function salvarNovoAssentamento() {
    const formInputs = document.querySelectorAll("#formContainer input");
    const novoAssentamento = {};

    formInputs.forEach(input => {
        novoAssentamento[input.id] = input.value.trim();
    });

    // Verificação básica antes do envio
    if (!novoAssentamento["Nome do Projeto"] || !novoAssentamento["CÓD SIPRA"] || !novoAssentamento["Município"]) {
        alert("Por favor, preencha os campos obrigatórios: Nome do Projeto, CÓD SIPRA e Município.");
        return;
    }

    fetch(apiURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoAssentamento)
    })
    .then(response => {
        if (response.ok) {
            alert("Novo assentamento cadastrado com sucesso!");
            carregarAssentamentos();
            fecharFormulario();
        } else {
            alert("Erro ao salvar o assentamento.");
        }
    })
    .catch(error => console.error("Erro ao salvar novo assentamento:", error));
}

/* Editar Assentamento Existente */
function editarAssentamento(id) {
    fetch(`${apiURL}/${id}`)
        .then(response => {
            if (!response.ok) throw new Error("Assentamento não encontrado.");
            return response.json();
        })
        .then(assentamento => {
            const formContainer = document.getElementById("formContainer");
            formContainer.innerHTML = gerarFormulario(Object.keys(assentamento), assentamento);
            formContainer.style.display = "grid";

            const buttonContainer = document.createElement("div");
            const saveButton = document.createElement("button");
            saveButton.textContent = "Salvar Alterações";
            saveButton.onclick = () => salvarEdicao(id);
            buttonContainer.appendChild(saveButton);

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancelar";
            cancelButton.onclick = fecharFormulario;
            buttonContainer.appendChild(cancelButton);

            formContainer.appendChild(buttonContainer);
        })
        .catch(error => alert(error.message));
}

/* Salvar Edição */
function salvarEdicao(id) {
    const formInputs = document.querySelectorAll("#formContainer input");
    const assentamentoAtualizado = {};

    formInputs.forEach(input => {
        assentamentoAtualizado[input.id] = input.value.trim();
    });

    fetch(`${apiURL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assentamentoAtualizado)
    })
    .then(() => {
        alert("Assentamento atualizado com sucesso!");
        carregarAssentamentos();
        fecharFormulario();
    })
    .catch(error => console.error("Erro ao salvar edição:", error));
}

/* Excluir Assentamento */
function excluirAssentamento(id) {
    if (confirm("Você realmente quer excluir este assentamento?")) {
        fetch(`${apiURL}/${id}`, { method: "DELETE" })
            .then(response => {
                if (response.ok) {
                    alert("Assentamento excluído com sucesso!");
                    carregarAssentamentos();
                } else {
                    return response.json().then(err => {
                        throw new Error(err.message || "Erro ao excluir assentamento.");
                    });
                }
            })
            .catch(error => console.error("Erro ao excluir assentamento:", error));
    }
}

/* Completar Cadastro */
function completarCadastro(id) {
    editarAssentamento(id);
    alert("Complete o cadastro com as informações pendentes.");
}

/* Fechar o Formulário */
function fecharFormulario() {
    const formContainer = document.getElementById("formContainer");
    formContainer.style.display = "none";
    formContainer.innerHTML = "";
    document.getElementById("cadastrarNovo").style.display = "block"; // Mostra o botão novamente
}
