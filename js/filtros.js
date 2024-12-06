const area = document.querySelector('#profissional');
const modelo = document.querySelector('#modelo');
const data = document.querySelector('#data');
const contrato = document.querySelector('#contrato');
const pcd = document.querySelector('#pcd');
const salario = document.querySelector('#salario');
const limparFiltros = document.querySelector('#limparFiltros');
const vagasContainer = document.querySelector('#jobs-container');
const exibirCadastroDialogo = document.querySelector('dialog');

let dadosApi, tipoCurriculo, dadosFiltar;
vagasConcorrendoCurriculos = [];
let vagasFiltradas;

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    buscarTodasAsVagas();
});

function exibirModalIndex() {
    exibirCadastroDialogo.showModal();
}
function fecharModalIndex() {
    exibirCadastroDialogo.close();
}


vagasContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-cadastrar')) {
        const elementoPai = e.target.closest('.item');
        const elementoSpan = elementoPai.querySelectorAll('span');

        if (elementoSpan) {
            const valorSpanId = elementoSpan[0].textContent;
            const valorSpanIdEmpresa = elementoSpan[1].textContent;
            localStorage.setItem('idVaga', valorSpanId);

        }

    }
});

function meCadastrar() {
    const identificacao = localStorage.getItem('identificacao');

    if (!identificacao || Number(identificacao.length) >= 14) {
        if (window.confirm(`Conteúdo Restrito para Candidatos, deseja Logar?`)) {
            window.location.href = '/html/login-page.html';
        }
        return;
    }

    if (window.confirm('Deseja se Candidatar a Essa Vaga?')) {
        verificarExistenciaCurriculo();

    } else {
        return;
    }


}

function verificarExistenciaCurriculo() {
    const token = localStorage.getItem('token');
    const id_usuario = localStorage.getItem('id');
    if (token) {

        const url = 'https://empregototal.onrender.com/curriculos';
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

                    return window.alert(mensagem);

                }
                dadosApi = data;

                if (dadosApi) {

                    telaConfirmacaoCadCurriculo(dadosApi);
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}

function salvarCurriculoVaga() {
    const idVaga = localStorage.getItem('idVaga');
    const idCurriculo = localStorage.getItem('idCurriculo');

    const url = `https://empregototal.onrender.com/vagas_curriculos`;
    const token = localStorage.getItem('token');

    const dados = {
        vaga_id: idVaga,
        curriculo_id: idCurriculo
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dados)

    })
        .then(response => {
            if (response.status === 201) {
                window.alert(`Vaga Adicionada com Sucesso no Curriculo ${tipoCurriculo}`);

                window.location.href = `/html/dashboard-usuario.html`;
            }
            return response.json()
        })
        .then(data => {

            const mensagem = data.mensagem;

            window.alert(mensagem);

        })
        .catch(erro => { console.log('Erro: ', erro); });
}



function telaConfirmacaoCadCurriculo(curriculo) {
    const modalContainer = document.querySelector("#modal-container-index");
    const select = document.createElement('select');
    const button = document.querySelector('#salvarCurriculo');
    const p = document.querySelector('#alertaCadastradoIndex');

    const { cMedio, cTecnico, cProfissional } = curriculo;

    modalContainer.innerHTML = '';


    select.addEventListener('change', (e) => {
        e.stopPropagation();

        tipoCurriculo = select.value;


        if (tipoCurriculo === 'medio') {
            localStorage.setItem('idCurriculo', dadosApi.cMedio.id);

        }

        if (tipoCurriculo === 'tecnico') {
            localStorage.setItem('idCurriculo', dadosApi.cTecnico.id);

        }
        if (tipoCurriculo === 'profissional') {
            localStorage.setItem('idCurriculo', dadosApi.cProfissional.id);
        }



        if (tipoCurriculo) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }



    });

    let idVaga = localStorage.getItem('idVaga');


    if (vagasConcorrendoCurriculos.includes(Number(idVaga))) {
        p.style.color = 'red';
        p.textContent = `Um Curriculo seu já foi adicionado a está Vaga`;

    }

    select.innerHTML = `
        <option value="" hidden>Selecionar</option>    
    `


    if (vagasConcorrendoCurriculos.includes(Number(idVaga))) {
        select.innerHTML += `
            <option value="" disabled>Médio</option>
        `
        select.innerHTML += `
            <option value="" disabled>Técnico</option>
        `
        select.innerHTML += `
            <option value="" disabled>Profissional</option>
            `
    } else if (!vagasConcorrendoCurriculos.includes(Number(idVaga))) {
        if (cMedio) {
            select.innerHTML += `
                <option value="${cMedio.tipo}">${cMedio.tipo}</option>
            `
        }
        if (cTecnico) {
            select.innerHTML += `
            <option value="${cTecnico.tipo}">${cTecnico.tipo}</option>
            `
        }
        if (cProfissional) {
            select.innerHTML += `
                <option value="${cProfissional.tipo}">${cProfissional.tipo}</option>
            `
        }
    }


    modalContainer.appendChild(select);
    exibirModalIndex();
}


function buscarTodasAsVagas() {
    const url = 'https://empregototal.onrender.com/todas_as_vagas';

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 404) {
                vagasContainer.innerHTML = '';
                vagasContainer.classList.add('card');
                vagasContainer.innerHTML = '<h3><strong>Não há Vagas Cadastradas no Momento!</strong></h3>';
            }
            return response.json()
        })
        .then(data => {

            let mensagem = data.mensagem;
            let erro = data.erro;


            if (erro) {
                return window.alert(erro);

            }
            if (mensagem) {
                return window.alert(mensagem);
            }
            dadosFiltar = data;
            exibirVagas(data);

        })
        .catch(erro => {
            console.log('erro: ', erro);

        })
}

function exibirVagas(vagas) {
    vagasContainer.innerHTML = '';

    if (vagas.length === 0) {
        vagasContainer.innerHTML = '<p class="jobs" style="text-align:center">Nenhuma vaga encontrada.</p>';
        return;
    }

    vagas.forEach((vaga) => {

        const imagem = document.createElement('img');
        const vagaDiv = document.createElement('div');
        const buttonCad = document.createElement('button');

        const vagaHTML = `
            <h3>${vaga.titulo}</h3>
            <p><strong>Empresa:</strong> ${vaga.nome_empresa}</p>
            <p><strong>Localização:</strong> ${vaga.localizacao}</p>
            <p><strong>Descrição:</strong> ${vaga.descricao}</p>
            <p><strong>Requisitos:</strong> ${vaga.habilidades}</p>
            <p><strong>Salário:</strong> ${formatarParaReal(vaga.salario)}</p>
            <p><strong>Email de contato:</strong> ${vaga.email}</p>
            <span style="display: none">${vaga.id}</span>
            <span style="display: none">${vaga.empresa_id}</span>
        `;

        imagem.classList.add('img-pcd-empresa');
        vaga.pcd ? imagem.src = '/assets/pcd1.jpeg' : imagem.style.display = 'none';

        buttonCad.textContent = "Me Candidatar para Vaga";
        buttonCad.classList.add('btn-cadastrar');
        buttonCad.onclick = meCadastrar;

        vagaDiv.classList.add('item');
        vagaDiv.innerHTML = vagaHTML;
        vagaDiv.appendChild(buttonCad);
        vagaDiv.appendChild(imagem);
        vagasContainer.appendChild(vagaDiv);
    });
}

{
    area.addEventListener('change', () => {
        let opcao = area.value.toLowerCase();
        let vagasFiltradasArea = filtrarArea(dadosFiltar, opcao);

        exibirVagas(vagasFiltradasArea);
    });

    modelo.addEventListener('change', () => {
        let opcao = modelo.value.toLowerCase();
        let vagasFiltradasModelo;

        vagasFiltradasModelo = filtrarModelo(dadosFiltar, opcao);
        exibirVagas(vagasFiltradasModelo);

        if (vagasFiltradas) {
            vagasFiltradasModelo = filtrarModelo(vagasFiltradasModelo, opcao);
            exibirVagas(vagasFiltradasModelo);
        }
    });

    data.addEventListener('change', () => {
        let opcao = data.value.toLowerCase();
        let vagasFiltradasData;

        vagasFiltradasData = filtrarData(dadosFiltar, opcao);
        exibirVagas(vagasFiltradasData);

        if (vagasFiltradas) {
            vagasFiltradasData = filtrarData(vagasFiltradas, opcao);
            exibirVagas(vagasFiltradasData);
        }
    });

    contrato.addEventListener('change', () => {
        let opcao = contrato.value.toLowerCase();
        let vagasFiltradasContrato;

        vagasFiltradasContrato = filtrarContrato(dadosFiltar, opcao);
        exibirVagas(vagasFiltradasContrato);

        if (vagasFiltradas) {
            vagasFiltradasContrato = filtrarContrato(vagasFiltradas, opcao);
            exibirVagas(vagasFiltradasContrato);
        }
    });

    pcd.addEventListener('change', () => {
        let opcao = pcd.value.toLowerCase();
        let vagasFiltradasPcd;

        vagasFiltradasPcd = filtrarPcd(dadosFiltar, opcao);
        exibirVagas(vagasFiltradasPcd);

        if (vagasFiltradas) {
            vagasFiltradasPcd = filtrarPcd(vagasFiltradas, opcao);

            exibirVagas(vagasFiltradasPcd);
        }
    });

    salario.addEventListener('change', () => {
        let opcao = salario.value.toLowerCase();
        let vagasFiltradasSalario;

        vagasFiltradasSalario = filtrarSalario(dadosFiltar, opcao);
        exibirVagas(vagasFiltradasSalario);

        if (vagasFiltradas) {
            vagasFiltradasSalario = filtrarSalario(vagasFiltradas, opcao);
            exibirVagas(vagasFiltradasSalario);
        }
    });

    limparFiltros.addEventListener('change', () => {
        let opcao = limparFiltros.value.toLowerCase();

        if (opcao === 'limpar') {
            location.reload();
        }
    })

    function filtrarArea(vagas, opcao) {
        vagasFiltradas = vagas.filter((vaga) => vaga.setor_atuacao.toLowerCase() === opcao);

        if (opcao === 'todos') {
            vagasFiltradas = vagas;
            area.selectedIndex = 0;
        }

        return vagasFiltradas;
    }

    function filtrarModelo(vagas, opcao) {
        vagasFiltradas = vagas.filter((vaga) => vaga.modalidade.toLowerCase() === opcao);

        if (opcao === 'todos') {
            vagasFiltradas = vagas;
            modelo.selectedIndex = 0;
        }

        return vagasFiltradas;
    }

    function filtrarData(vagas, opcao) {
        let dataAtual = new Date()
        let vagasAtualizadasData = [];

        if (opcao === "semana") {
            const ultimaSemana = new Date();
            ultimaSemana.setDate(dataAtual.getDate() - 7);
            vagasAtualizadasData = vagas.filter(vaga => new Date(vaga.data) <= ultimaSemana);
        }
        if (opcao === "mes") {
            const ultimoMes = new Date();
            ultimoMes.setMonth(dataAtual.getMonth() - 1);
            vagasAtualizadasData = vagas.filter(vaga => new Date(vaga.data) <= ultimoMes);
        }
        if (opcao === "todos") {
            vagasAtualizadasData = vagas;
            data.selectedIndex = 0;
        }
        return vagasAtualizadasData;
    }

    function filtrarContrato(vagas, opcao) {
        vagasFiltradas = vagas.filter((vaga) => vaga.tipo_contrato === opcao);

        if (opcao === 'todos') {
            vagasFiltradas = vagas;
            contrato.selectedIndex = 0;
        }

        return vagasFiltradas;
    }

    function filtrarPcd(vagas, opcao) {
        let opcaoBoolean = opcao === 'sim' ? true : false;
        vagasFiltradas = vagas.filter((vaga) => vaga.pcd === opcaoBoolean);

        if (opcao === 'todos') {
            vagasFiltradas = vagas;
            pcd.selectedIndex = 0;
        }

        return vagasFiltradas;
    }

    function filtrarSalario(vagas, opcao) {
        if (opcao === 'mil') {
            vagasFiltradas = vagas.filter((vaga) => {
                const salarioNumerico = extrairSalarioNumerico(vaga.salario);
                return salarioNumerico <= 100000;
            });
        } else if (opcao === 'miladois') {
            vagasFiltradas = vagas.filter((vaga) => {
                const salarioNumerico = extrairSalarioNumerico(vaga.salario);
                return salarioNumerico >= 100100 && salarioNumerico <= 200100;
            });
        } else if (opcao === 'acimadois') {
            vagasFiltradas = vagas.filter((vaga) => {
                const salarioNumerico = extrairSalarioNumerico(vaga.salario);
                return salarioNumerico > 200000;
            });
        } else if (opcao === 'todos') {
            vagasFiltradas = vagas;
            salario.selectedIndex = 0;
        }

        return vagasFiltradas;
    }
}

function extrairSalarioNumerico(salario) {
    const salarioLimpo = salario.replace(/[^\d,-]/g, '').replace(',', '.');


    const salarioNumerico = parseFloat(salarioLimpo);

    return salarioNumerico;
}

function consultarBuscarIdVaga() {
    const token = localStorage.getItem('token');
    const url = `https://empregototal.onrender.com/curriculos_vagas`;


    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            const erro = data.erro;
            const mensagem = data.mensagem;

            if (erro) {
                return window.alert(erro);
            }
            if (mensagem) {
                return window.alert(mensagem);
            }

            data.forEach((dados) => {
                vagasConcorrendoCurriculos.push(dados.vaga_id);
            });


        })
        .catch(erro => {
            console.log(erro);

        })


}

const token = localStorage.getItem('token');

// if (token) {

//     consultarBuscarIdVaga();
// }


function formatarParaReal(valor) {

    let [inteiro, decimal] = valor.split('.');

    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `R$ ${inteiro},${decimal}`;
}