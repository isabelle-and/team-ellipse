# team-ellipse
Repositório criado para a disciplina de Projeto I, do curso de Sistemas e Mídias Digitais, da UFC. 
###### consulta.html
* cria uma página web para consulta de assentamentos. A página possui um título, um campo de busca por nome do projeto e um campo de busca por município. Os resultados da busca são exibidos em uma tabela com colunas para o nome do projeto, código SIPRA, município e ações. Há também um botão para exibir mais assentamentos, caso haja mais resultados disponíveis.
###### dados.json 
* arquivo JSON contém dados sobre assentamentos. Cada objeto no array representa um assentamento.
###### index.html 
* página inicial simples que direciona o usuário para a página de consulta de assentamentos (consulta.html). Ela contém um título principal "Consulta de Assentamentos" e um botão que, ao ser clicado, redireciona o usuário para a página consulta.html.
###### script.js
* arquivo JavaScript controla a funcionalidade da página de consulta de assentamentos (consulta.html). Ele carrega os dados dos assentamentos do arquivo dados.json, ordena os dados pelo nome do projeto, exibe os primeiros 10 resultados na tabela, configura os botões de busca e o botão "Exibir mais assentamentos".
* permite buscar assentamentos por nome do projeto ou município, filtra os dados com base na busca e exibe os resultados, oculta o botão "Exibir mais assentamentos" quando uma busca é realizada.
* redireciona para a página relatorio.html com o nome do projeto selecionado, na página relatorio.html busca os dados do projeto no arquivo dados.json, exibe as informações do projeto em um formato de relatório.
###### app.py
* arquivo Python define uma API REST usando Flask para gerenciar dados de assentamentos armazenados em um arquivo JSON (dados.json).
* este script cria uma API completa para gerenciar os dados dos assentamentos, fornecendo endpoints para acessar, criar, atualizar e excluir assentamentos.
###### crud_script.js
*  arquivo JavaScript gerencia a interação com a API de dados de assentamentos que você definiu em seu arquivo app.py.
*  este script fornece uma interface de usuário para interagir com a API de dados de assentamento. Busca, exibição, criação, edição e exclusão de assentamentos por meio dos endpoints de API definidos em app.py.
###### crud_style.css
* arquivo CSS que estiliza a aparência da interface de gerenciamento de assentamentos associada ao arquivo JavaScript (crud_script.js) e à API.
###### crud.html
* define uma página web para um sistema de cadastro de assentamentos.
* com um formulário (formContainer) inicialmente oculto (display:none), usado para adicionar ou editar assentamentos, o formulário possui campos para "Nome do Projeto", "CÓD SIPRA" e "Município", todos obrigatórios (required),botões "Salvar" e "Cancelar" para submeter o formulário ou fechá-lo, exibe uma tabela (assentamentoTable) para listar os assentamentos, tabela com colunas para "Nome do Projeto", "Código SIPRA", "Município" e "Ações".
###### dados.json
* arquivo JSON que atua como um banco de dados, armazenando informações detalhadas sobre diversos assentamentos. 
###### conversorXlsxparaJason.html
* arquivo HTML que é um conversor que transforma arquivos XLSX (planilhas do Excel) em JSON (formato de dados usado em programação).
