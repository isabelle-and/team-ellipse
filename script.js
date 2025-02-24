document.addEventListener("DOMContentLoaded", () => {
    let dados = [];
    let resultadosVisiveis = 10;

    const urlParams = new URLSearchParams(window.location.search);
    const projetoSelecionado = urlParams.get("projeto");

    if (projetoSelecionado) {
        mostrarRelatorio(projetoSelecionado);
    } else {
        iniciarBusca();
    }

    function iniciarBusca() {
        fetch("dados.json")
            .then(response => response.json())
            .then(json => {
                dados = json.sort((a, b) => a["Nome do Projeto"].localeCompare(b["Nome do Projeto"]));
                exibirResultados(dados.slice(0, resultadosVisiveis));
                configurarBotoesBusca();
                mostrarBotaoExibirMais();
            })
            .catch(error => console.error("Erro ao carregar JSON:", error));
    }

    function configurarBotoesBusca() {
        const searchNome = document.getElementById("searchNome");
        const searchMunicipio = document.getElementById("searchMunicipio");
        const btnBuscarNome = document.getElementById("btnBuscarNome");
        const btnBuscarMunicipio = document.getElementById("btnBuscarMunicipio");

        btnBuscarNome.addEventListener("click", () => filtrarPorCampo("Nome do Projeto", searchNome.value));
        btnBuscarMunicipio.addEventListener("click", () => filtrarPorCampo("Município", searchMunicipio.value));

        searchNome.addEventListener("keypress", (e) => {
            if (e.key === "Enter") filtrarPorCampo("Nome do Projeto", searchNome.value);
        });

        searchMunicipio.addEventListener("keypress", (e) => {
            if (e.key === "Enter") filtrarPorCampo("Município", searchMunicipio.value);
        });
    }

    function filtrarPorCampo(campo, valor) {
        const resultadosFiltrados = dados.filter(item =>
            item[campo] && item[campo].toLowerCase().includes(valor.toLowerCase())
        );
        exibirResultados(resultadosFiltrados);
        ocultarBotaoExibirMais();
    }

    function exibirResultados(resultados) {
        const tabela = document.getElementById("resultsTable");
        tabela.innerHTML = "";

        if (resultados.length === 0) {
            tabela.innerHTML = "<tr><td colspan='4'>Nenhum resultado encontrado</td></tr>";
            return;
        }

        resultados.forEach(item => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${item["Nome do Projeto"] ? item["Nome do Projeto"] : "N/A"}</td>
                <td>${item["CÓD SIPRA"] ? item["CÓD SIPRA"] : "N/A"}</td>
                <td>${item["Município"] ? item["Município"] : "N/A"}</td>
                <td><button onclick="abrirRelatorio('${item["Nome do Projeto"].replace(/'/g, "\\'")}')">Ver Relatório</button></td>
            `;
            tabela.appendChild(linha);
        });
    }

    function mostrarBotaoExibirMais() {
        const btnExibirMais = document.getElementById("btnExibirMais");
        btnExibirMais.style.display = "block";
        btnExibirMais.addEventListener("click", () => {
            resultadosVisiveis += 10;
            exibirResultados(dados.slice(0, resultadosVisiveis));

            if (resultadosVisiveis >= dados.length) {
                ocultarBotaoExibirMais();
            }
        });
    }

    function ocultarBotaoExibirMais() {
        const btnExibirMais = document.getElementById("btnExibirMais");
        btnExibirMais.style.display = "none";
    }

    window.abrirRelatorio = function(nomeProjeto) {
        window.location.href = `relatorio.html?projeto=${encodeURIComponent(nomeProjeto)}`;
    };

    function mostrarRelatorio(nomeProjeto) {
        fetch("dados.json")
            .then(response => response.json())
            .then(json => {
                const item = json.find(proj => proj["Nome do Projeto"] === nomeProjeto);
                if (!item) {
                    document.getElementById("reportContent").innerHTML = "<p>Assentamento não encontrado.</p>";
                    return;
                }

                let relatorioHTML = `<h2>${item["Nome do Projeto"]}</h2><div class="relatorio-grid">`;
                for (const [chave, valor] of Object.entries(item)) {
                    relatorioHTML += `<div><strong>${chave}:</strong> ${valor ? valor : "N/A"}</div>`;
                }
                relatorioHTML += `</div>`;

                document.getElementById("reportContent").innerHTML = relatorioHTML;
            })
            .catch(error => console.error("Erro ao carregar JSON:", error));
    }
});
