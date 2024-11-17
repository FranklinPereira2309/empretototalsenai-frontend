let dadosMedio = [];
let dadosProfissional = [];
let dadosTecnico = [];
let modalDialog = document.querySelector('dialog');
let editarModalMedio;
let editarModalTecnico;
let editarModalProfissional;
let tipoCurriculo = {};


function closeButtonModal() {
    modalDialog.close();
}

window.onclick = function (event) {
    if (event.target === modalDialog) {
        modalDialog.close();
    }
}

const token = localStorage.getItem('token');
const id_usuario = localStorage.getItem('id');
let dadosApi;

if (token) {
    const url = 'https://empregototalsenai.netlify.app/curriculos';
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            let mensagem = data.mensagem;

            if (mensagem) {
                document.querySelector('#medio').style.display = 'none';
                document.querySelector('#tecnico').style.display = 'none';
                document.querySelector('#profissional').style.display = 'none';
                document.querySelector('#tipoCurriculo').textContent = 'Não Disponível';
                document.querySelector('#resume-data').innerHTML = '';
                document.querySelector('#resume-data').innerHTML = `<p>Nenhum Curriculo Cadastrado!</p>`;;
                

                
            } else {
                dadosApi = data;

                validandoLinksCurriculos(dadosApi);

                if (dadosApi.cMedio) {
                    dadosMedio = dadosApi.cMedio;
                }
                if (dadosApi.cTecnico) {
                    dadosTecnico = dadosApi.cTecnico;
                }
                if (dadosApi.cProfissional) {
                    dadosProfissional = dadosApi.cProfissional;
                }
            }
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}

function formarCampoData(dados) {
    const dataCadastro = new Date(dados.data);
    const dia = String(dataCadastro.getDate()).padStart(2, '0');
    const mes = String(dataCadastro.getMonth() + 1).padStart(2, '0');
    const ano = dataCadastro.getFullYear();
    const dataFormatada = `${dia}-${mes}-${ano}`;

    return dataFormatada;
}

function validandoLinksCurriculos(dados) {
    const aMedio = document.querySelector('#medio')
    const aTecnico = document.querySelector('#tecnico');
    const aProfissional = document.querySelector('#profissional');

    aMedio.style.display = 'none';
    aTecnico.style.display = 'none';
    aProfissional.style.display = 'none';

    const { cMedio, cTecnico, cProfissional } = dados;

    cMedio ? aMedio.style.display = 'block' : false;
    cTecnico ? aTecnico.style.display = 'block' : false;
    cProfissional ? aProfissional.style.display = 'block' : false;
}

function exibirDadosCurriculo(dados) {
    const aMedio = document.querySelector('#medio')
    const aTecnico = document.querySelector('#tecnico');
    const aProfissional = document.querySelector('#profissional');

    let tipo = dados.tipo;
    let novoTipo = '';
    tipo === 'medio' ? novoTipo = 'Médio' : '';
    tipo === 'tecnico' ? novoTipo = 'Técnico' : '';
    tipo === 'profissional' ? novoTipo = 'Profissional' : '';

    document.querySelector('.imprimir').style.display = 'block';
    document.querySelector('.editar').style.display = 'block';
    document.querySelector('.excluir').style.display = 'block';

    const resumeContainer = document.querySelector('#resume-data');
    const div = document.createElement('div');
    div.classList.add('info');

    const descricao = {
        id: 'ID',
        nome: 'Nome',
        email: 'Email',
        data: 'Data de Cadastro',
        telefone: 'Telefone',
        endereco: 'Endereço',
        objetivo: 'Objetivo',
        formacao: 'Formação',
        experiencia: 'Experiência',
        habilidades: 'Habilidades',
        idiomas: 'Idiomas',
        referencias: 'Referências',
        tipo: 'Tipo',
        usuario_id: 'ID do Usuário'
    };

    resumeContainer.innerHTML = '';

    let dadosFormatados = formarCampoData(dados);


    div.innerHTML = `
                <h1>${dados.nome} - Tipo do Curriculo (${novoTipo})</h1>
                <p><strong>Email:</strong> ${dados.email}</p>
                <p><strong>Telefone:</strong> ${dados.telefone}</p>
                <p><strong>Endereço:</strong> ${dados.endereco}</p>
                <h6><strong>Data do Cadastro:</strong> ${dadosFormatados}</h6>

                <h2>Objetivo</h2>
                <p>${dados.objetivo}</p>

                <h2>Formação</h2>
                <p>${dados.formacao}</p>

                <h2>Experiência</h2>
                <p>${dados.experiencia}</p>

                <h2>Habilidades</h2>
                <p>${dados.habilidades}</p>

                <h2>Idiomas</h2>
                <p>${dados.idiomas}</p>

                <h2>Referências</h2>
                <p>${dados.referencias}</p>  
            `
    resumeContainer.appendChild(div);
}

function medio() {
    exibirDadosCurriculo(dadosMedio);
    tipoCurriculo = dadosMedio.tipo;
    editarModalMedio = true;
}
function tecnico() {
    exibirDadosCurriculo(dadosTecnico);
    tipoCurriculo = dadosTecnico.tipo;
    editarModalTecnico = true;
}
function profissional() {
    exibirDadosCurriculo(dadosProfissional);
    tipoCurriculo = dadosProfissional.tipo;
    editarModalProfissional = true;

}

function imprimirCurriculo() {
    const conteudo = document.querySelector('#resume-data').innerHTML;

    let curriculo = tipoCurriculo;

    let estilo = '<style>';
    estilo += `h2 {
        margin-bottom: 10px;
        border-bottom: 2px solid #333;
        padding-bottom: 6px;
        }`;
    estilo += '</style>';

    const win = window.open('', '', 'height = 800px, width = 600px');
    win.document.write('<html><head>');
    win.document.write('<title>Imprimir Curriculo - Emprego Total</title>');
    win.document.write(estilo);
    win.document.write('</head>');
    win.document.write('<body>');
    win.document.write(conteudo);
    win.document.write('</body></html>');
    win.print();


}



function exibirEditarCurriculo() {
    modalDialog.showModal();

    if (editarModalMedio) {
        editarModalMedio = false;
        editarModalCurriculo(dadosMedio);
    } else if (editarModalTecnico) {
        editarModalTecnico = false;
        editarModalCurriculo(dadosTecnico);
    } else if (editarModalProfissional) {
        editarModalProfissional = false;
        editarModalCurriculo(dadosProfissional);
    }

}

function editarCurriculo() {

    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const telefone = document.querySelector('#telefone').value;
    const endereco = document.querySelector('#endereco').value;
    const objetivo = document.querySelector('#objetivo').value;
    const formacao = document.querySelector('#formacao').value;
    const experiencia = document.querySelector('#experiencias').value;
    const habilidades = document.querySelector('#habilidades').value;
    const idiomas = document.querySelector('#idiomas').value;
    const referencias = document.querySelector('#referencias').value;



    const url = `https://empregototalsenai.netlify.app/curriculo`;

    let tipo = tipoCurriculo;

    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    if (
        !nome ||
        !email ||
        !telefone ||
        !endereco ||
        !formacao ||
        !objetivo ||
        !experiencia ||
        !habilidades ||
        !idiomas ||
        !referencias) {
        return window.alert("Preencha todos os Dados!");
    }


    const dadosAtualizados = {

        nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
        email: email.toLowerCase(),
        telefone: telefone.replace(/\D/g, ''),
        endereco,
        objetivo,
        formacao,
        experiencia,
        habilidades,
        idiomas,
        referencias,
        tipo,



    }

    if (token) {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosAtualizados)
        })
            .then(response => response.json())
            .then(data => {
                const mensagem = data.mensagem;
                const error = data.erro;

                if (error) {
                    return window.alert(error);

                } else if (mensagem) {
                    window.alert(mensagem);

                }

                modalDialog.close();

                window.location.href = '/html/curriculos.html';
            })
            .catch(error => {
                console.log('Erro: ', error);

            })

    }

}

function deletarCurriculo() {
    const tipo = tipoCurriculo;
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');

    const url = `https://empregototalsenai.netlify.app/curriculo/${id}/${tipo}`;



    if (window.confirm('Deseja Excluir?')) {

        if (token) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },

            })
                .then(response => response.json())
                .then(data => {
                    const mensagem = data.mensagem;
                    window.alert(mensagem);
                    window.location.href = '/html/curriculos.html';
                })
                .catch(error => {
                    console.log('Erro: ', error);

                })

        }
    } else {
        return
    }

}


function editarModalCurriculo(dados) {


    const modalContainer = document.querySelector('#modal-container');
    const div = document.createElement('div');
    div.style.textAlign = 'left';
    modalContainer.innerHTML = '';

    div.innerHTML = `
        <div class="input-area">
            <label for="nome">Nome:</label>
            <textarea rows=${1} cols=${40} id="nome">${dados.nome}</textarea> 
        </div>
        <div class="input-area">
            <label for="email">Email:</label>
            <textarea rows=${1} cols=${40} id="email">${dados.email}</textarea>
        </div>
        <div class="input-area">
            <label for="telefone">Telefone:</label>
            <textarea rows=${1} cols=${40} id="telefone">${formatarCelularPraExibir(dados.telefone)}</textarea>
        </div>
        <div class="input-area">
            <label for="endereco">Endereço:</label>
            <textarea rows=${1} cols=${40} id="endereco">${dados.endereco}</textarea>
        </div>
        <div class="input-area">
            <label for="objetivo">Objetivo:</label>
            <textarea rows=${1} cols=${40} id="objetivo">${dados.objetivo}</textarea>
        </div>
        <div class="input-area">
            <label for="formacao">Formação:</label>
            <textarea rows=${1} cols=${40} id="formacao">${dados.formacao}</textarea>
        </div>
        <div class="input-area">
            <label for="experiencia">Experiência:</label>
            <textarea  rows=${1} cols=${40} id="experiencias">${dados.experiencia}</textarea>
        </div>
        <div class="input-area">
            <label for="habilidade">Habilidade:</label>       
            <textarea  rows=${1} cols=${40} id="habilidades">${dados.habilidades}</textarea>
        </div>
        <div class="input-area">
            <label for="idiomas">Idiomas:</label>
            <textarea  rows=${1} cols=${40} id="idiomas">${dados.idiomas}</textarea>
        </div>
        <div class="input-area">
            <label for="referencia">Referência:</label>
            <textarea  rows=${1} cols=${40} id="referencias">${dados.referencias}</textarea>
        </div>
    `
    modalContainer.appendChild(div);
}


function formatarCelularPraExibir(celular) {
    return aplicarMascara(celular, '(##) #####-####');
}

// document.addEventListener('DOMContentLoaded', () => {
//     const identificacao = localStorage.getItem('identificacao');
//     if (!token) {
//         return window.location.href = '/html/acesso-negado.html';

//     }

//     if (Number(identificacao.length) === 11) {

//         nome ? titulo.textContent = `Dashboard - ${nome}` : 'Dashboard';
//     } else {
//         window.alert('Aréa Restrita para Candidatos!');
//         return window.location.href = '/html/dashboard-empresa.html';
//     }

// })