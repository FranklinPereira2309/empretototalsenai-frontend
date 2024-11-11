const dialogModalNovaVaga = document.querySelector('#dialogNovaVaga');
const vagasContainer = document.querySelector('#vagas-container-empresa');
const novaDiv = document.createElement('div');
const modalEditarVaga = document.querySelector('#dialogEditarVaga');
const area = document.querySelector('#profissional');
const modelo = document.querySelector('#modelo');
const data = document.querySelector('#data');
const contrato = document.querySelector('#contrato');
const pcd = document.querySelector('#pcd');
const salario = document.querySelector('#salario');
const filters = document.querySelector('.filters');
let dadosParaFiltrar;
let idVaga;
const dialogVisualizarCurriculo = document.querySelector('#dialogVisualizarCurriculo');



document.addEventListener('DOMContentLoaded', () => {
    let titulo = document.querySelector('#titulo_dash_empresa');
    const nome = localStorage.getItem('nome');

    const identificacao = localStorage.getItem('identificacao');

    if (Number(identificacao.length) === 14) {

        nome ? titulo.textContent = `Dashboard - ${nome}` : 'Dashboard';
    } else {
        window.alert('Aréa Restrita para Empresas!');
        return window.location.href = '/html/dashboard-usuario.html';
    }

});

vagasContainer.addEventListener('click', (e) => {
    let valorSpanId, elementoSpan;
    let valorSpanIdCurriculo, elementoSpanIdCurriculo
    let elementoSpanIdAtualizarCurriculo;
    let elementoSpanIdIncluirCurriculo;
    let elementoSpanIncluir;
    let elementoSpanZero = '';
    let elementoSpanUm = '';
    let elementoSpanDois = '';
    let elementoSpanTres = '';

    if (e.target.classList.contains('btn-Excluir-Vaga')) {
        const elementoPai = e.target.closest('.item');

        elementoSpan = elementoPai.querySelector('span');

        if (elementoSpan) {
            valorSpanId = elementoSpan.textContent;

        }
    } else if (e.target.classList.contains('btn-Editar-Vaga')) {
        const elementoPai = e.target.closest('.item');

        elementoSpan = elementoPai.querySelector('span');

        if (elementoSpan) {
            valorSpanId = elementoSpan.textContent;


        }
    } else if (e.target.classList.contains('btn-selecionar')) {
        const elementoPai = e.target.closest('.items');

        elementoSpanIdCurriculo = elementoPai.querySelector('span');

        if (elementoSpanIdCurriculo) {
            valorSpanIdCurriculo = elementoSpanIdCurriculo.textContent;

        }
        cadastrarCandidato();

    } else if (e.target.classList.contains('btnDesativarVaga')) {
        const elementoPai = e.target.closest('.item1');

        elementoSpanIdAtualizarCurriculo = elementoPai.querySelectorAll('span');

        if (elementoSpanIdAtualizarCurriculo) {
            elementoSpanZero = elementoSpanIdAtualizarCurriculo[0].textContent;
            elementoSpanUm = elementoSpanIdAtualizarCurriculo[1].textContent;


        }
        localStorage.setItem('idCurriculoAlterarSelecionado', elementoSpanZero);
        localStorage.setItem('visualizar_curriculo', elementoSpanUm);

    } else if (e.target.classList.contains('btnAtivarVaga')) {
        const elementoPai = e.target.closest('.item2');

        elementoSpanIdAtualizarCurriculo = elementoPai.querySelectorAll('span');

        if (elementoSpanIdAtualizarCurriculo) {
            elementoSpanDois = elementoSpanIdAtualizarCurriculo[0].textContent;
            elementoSpanTres = elementoSpanIdAtualizarCurriculo[1].textContent;


        }
        localStorage.setItem('idCurriculoAlterarSelecionado', elementoSpanDois);
        localStorage.setItem('visualizar_curriculo', elementoSpanTres);

    }else if (e.target.classList.contains('btnIncluirSelecionar')) {
        const elementoPai = e.target.closest('.item');

        elementoSpanIdIncluirCurriculo = elementoPai.querySelectorAll('span');

        if (elementoSpanIdIncluirCurriculo) {
            elementoSpanIncluir = elementoSpanIdIncluirCurriculo[1].textContent;
            
                    

        }
        selecionarCurriculo();
        localStorage.setItem('idIncluirCurriculo', elementoSpanIncluir )
        

    } else {
        return;
    }

    localStorage.setItem('idCurriculoSelecionado', valorSpanIdCurriculo);
    localStorage.setItem('idVagaSelecionada', valorSpanId);


});


function reloadPage() {

    window.location.href = window.location.href;

}

function visualizarVagaSelecionada() {
    let dadosEditarVagas;

    idVaga = localStorage.getItem('idVagaSelecionada');
    console.log(idVaga);

    const url = `https://empregototal.onrender.com/vaga/${idVaga}`;
    const token = localStorage.getItem('token');

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
            exibirVagasEmpresaParaEditar(data);


        })
        .catch(erro => {
            console.log(erro);

        })
}


function visualizarVagas() {
    const token = localStorage.getItem('token');

    const url = 'https://empregototal.onrender.com/vagas';

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            let mensagem = data.mensagem;

            if (mensagem) {
                return window.alert(mensagem);
            } else {
                dadosParaFiltrar = data;
                exibirVagasEmpresa(data);
            }
        })
        .catch(error => {
            console.log(error);
        })


}

function exibirVagasEmpresa(vagas) {
    localStorage.setItem('idVagaSelecionada', '');
    filters.style.display = 'block';

    if (vagas.length === 0) {
        filters.style.display = 'none';
        
        vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Nenhuma Vaga Cadastrada!</h1>';
        return;
    }
    vagasContainer.innerHTML = '';

    vagas.forEach((vaga) => {
        const btnEditar = document.createElement('button');
        const btnExcluir = document.createElement('button');
        const imagem = document.createElement('img');

        const vagaDiv = document.createElement('div');


        const vagaHTML = `
                        <br>  
                        <h2>${vaga.titulo}</h2>
                        <p><strong>Empresa:</strong> ${vaga.nome_empresa}</p>
                        <p><strong>Localização:</strong> ${vaga.localizacao}</p>
                        <p><strong>Descrição:</strong> ${vaga.descricao}</p>
                        <p><strong>Requisitos:</strong> ${vaga.habilidades}</p>
                        <p><strong>Salário:</strong> ${formatarParaReal(vaga.salario)}</p>
                        <p><strong>Email de contato:</strong> ${vaga.email}</p>
                        <span style="display: none">${vaga.id}</span>
                        
            `;

        imagem.classList.add('img-pcd-empresa');
        vaga.pcd ? imagem.src = '/assets/pcd1.jpeg' : imagem.style.display = 'none';
        btnEditar.textContent = 'Editar';
        btnExcluir.textContent = 'Excluir';
        btnEditar.classList.add('btn-Editar-Vaga');
        btnExcluir.classList.add('btn-Excluir-Vaga');
        btnEditar.onclick = editarVaga;
        btnExcluir.onclick = excluirVaga;
        vagaDiv.classList.add('item');
        vagaDiv.innerHTML = vagaHTML;
        vagaDiv.appendChild(btnEditar);
        vagaDiv.appendChild(btnExcluir);
        vagaDiv.appendChild(imagem);

        vagasContainer.appendChild(vagaDiv);
    });

}

function exibirVagasEmpresaParaEditar(vagas) {
    const modalContainerVagas = document.querySelector('#modal-container-vagas');
    const div = document.createElement('div');
    div.style.textAlign = 'left';
    modalContainerVagas.innerHTML = '';

    vagas.forEach(vaga => {


        div.innerHTML = `
                <br>
                <h2 >${vaga.titulo}</h2>
                <div class="input-area">
                    <label for="nome">Título:</label>
                    <textarea rows=${1} cols=${40} id="tituloVagaEditar">${vaga.titulo}</textarea> 
                </div>
                <div class="input-area">
                    <label for="descricao">Descrição:</label>
                    <textarea rows=${1} cols=${40} id="descricaoVagaEditar" name="descricao">${vaga.descricao}</textarea>
                </div>
                <div class="input-area">
                    <label for="requisitos">Requsitos:</label>
                    <textarea rows=${1} cols=${40} id="requisitosVagaEditar" name="requisitos">${vaga.habilidades}</textarea>
                </div>
                <div class="input-area">
                    <label for="formacao">Formação:</label>
                    <textarea  rows=${1} cols=${40} id="formacaoVagaEditar" name="formacao">${vaga.formacao}</textarea>
                </div>
                <div class="input-area">
                    <label for="localizacao">Localização:</label>
                    <textarea rows=${1} cols=${40} id="localizacaoVagaEditar" name="localizacao">${vaga.localizacao}</textarea>
                </div>
                <div class="input-area">
                    <label for="modalidade">Modalidade:</label>       
                    <textarea  rows=${1} cols=${40} id="modalidadeVagaEditar" name="modalidade">${vaga.modalidade}</textarea>
                </div>
                <div class="input-area">
                    <label for="salario">Salário:</label>
                    <textarea rows=${1} cols=${40} id="salarioVagaEditar" name="salario">${vaga.salario}</textarea>
                </div>
                <div class="input-area">
                    <label for="nome">Nome da Empresa:</label>
                    <textarea rows=${1} cols=${40} id="nomeVagaEditar" name="nome">${vaga.nome_empresa}</textarea> 
                </div>
                <div class="input-area">
                    <label for="setor">Área de Atuação:</label>
                    <textarea  rows=${1} cols=${40} id="setorVagaEditar" name="setor">${vaga.setor_atuacao}</textarea>
                </div>
                <div class="input-area">
                    <label for="email">Email:</label>
                    <textarea rows=${1} cols=${40} id="emailVagaEditar" name="email">${vaga.email}</textarea>
                </div>    
                <div class="input-area">
                    <label for="descricao">Descrição da Empresa:</label>
                    <textarea  rows=${1} cols=${40} id="descricaoEmpresaVagaEditar" name="descricao">${vaga.cargo}</textarea>
                </div>
                <div class="input-area">
                    <label for="contrato">Tipo de Contrato:</label>
                    <textarea  rows=${1} cols=${40} id="contratoVagaEditar" name="contrato">${vaga.tipo_contrato}</textarea>
                </div>
                <div class="input-area">
                    <label for="horario">Horário de Expediente:</label>
                    <textarea  rows=${1} cols=${40} id="horarioVagaEditar" name="horario">${vaga.horario}</textarea>
                </div>
                <div class="input-area">
                    <label>Existe deficiência Pcd?</label>
                    <select id="selecionarPcdEditarVagas" name="selecionar">
                        <option ${vaga.pcd ? 'selected' : ''} value="${true}">Sim</option>
                        <option ${!vaga.pcd ? 'selected' : ''} value="${false}">Não</option>
                    </select>
               
                </div>
    
                `
        exibirModalEditaVagas();
        modalContainerVagas.appendChild(div);
        let pcd = document.querySelector('#selecionarPcdEditarVagas');
        document.querySelector('#selecionarPcdEditarVagas').addEventListener('click', () => {
            let _pcd = pcd.value;
            localStorage.setItem('_pcd', _pcd);

        });

    });

}

function exibirModalEditaVagas() {
    modalEditarVaga.showModal();

}
function fecharModalEditaVagas() {
    modalEditarVaga.close();
    reloadPage();
}

function editarVaga() {
    let intervalo = setInterval(() => {

        if (window.confirm('Deseja Editar essa Vaga?')) {
            clearInterval(intervalo);
            visualizarVagaSelecionada();
        } else {
            clearInterval(intervalo);
            return;
        }
    }, 0);
}


function salvarEditarVaga() {

    let _pcd = localStorage.getItem('_pcd');

    const titulo = document.querySelector('#tituloVagaEditar').value;
    const nome_empresa = document.querySelector('#nomeVagaEditar').value;
    const localizacao = document.querySelector('#localizacaoVagaEditar').value;
    const descricao = document.querySelector('#descricaoVagaEditar').value;
    const habilidades = document.querySelector('#requisitosVagaEditar').value;
    const email = document.querySelector('#emailVagaEditar').value;
    const formacao = document.querySelector('#formacaoVagaEditar').value;
    const modalidade = document.querySelector('#modalidadeVagaEditar').value;
    const tipo_contrato = document.querySelector('#contratoVagaEditar').value;
    const setor_atuacao = document.querySelector('#setorVagaEditar').value;
    const horario = document.querySelector('#horarioVagaEditar').value;
    const pcd = document.querySelector('#selecionarPcdEditarVagas').value;
    const salario = document.querySelector('#salarioVagaEditar').value;
    const cargo = document.querySelector('#descricaoEmpresaVagaEditar').value;



    if (
        !titulo ||
        !descricao ||
        !habilidades ||
        !formacao ||
        !localizacao ||
        !modalidade ||
        !salario ||
        !nome_empresa ||
        !setor_atuacao ||
        !email ||
        !cargo ||
        !tipo_contrato ||
        !horario ||
        !pcd
    ) {

        return window.alert('Preencha todos os campos!');

    }


    const novaVaga = {
        titulo,
        descricao,
        habilidades,
        formacao,
        localizacao,
        modalidade,
        salario,
        nome_empresa,
        setor_atuacao,
        email,
        cargo,
        tipo_contrato,
        horario,
        pcd: _pcd
    }


    const token = localStorage.getItem('token');
    const idVaga = localStorage.getItem('idVagaSelecionada');
    const url = `https://empregototal.onrender.com/vagas/${idVaga}`;

    if (token) {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaVaga)
        })
            .then(response => {
                if (response.status === 201) {
                    window.alert('Atualizaçãso realizada com Sucesso!');
                    reloadPage();

                }
                return response.json();
            })
            .then(data => {
                const erro = data.erro;
                const mensagem = data.mensagem;

                if (erro) {
                    return window.alert(erro);
                }
                if (mensagem) {
                    return window.alert(mensagem);
                }

            })
            .catch(erro => {
                console.log(erro);

            })
    }


}

function excluirVaga() {
    let intervalo = setInterval(() => {

        if (window.confirm('Deseja Excluir essa Vaga?')) {
            deletarVagaCadastrada();
            clearInterval(intervalo);
        } else {
            clearInterval(intervalo);
            return;
        }
    }, 0);
}

function toggleAtivarCurriculo() {
    const visualizar_curriculo = localStorage.getItem('visualizar_curriculo');
    
    let intervalo = setInterval(() => {
        
        if (window.confirm('Confirma a Ação para o  Curriculo Atual?')) {
            const alteracao = {
                visualizar_curriculo: visualizar_curriculo === true? false : true
            }
            
            const url = `https://empregototal.onrender.com/curriculo/${localStorage.getItem('idCurriculoAlterarSelecionado')}`;

            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alteracao)
            })
                .then(response => {
                    if (response.status === 201) {
                        window.alert('Alteração realizada com Sucesso!');
                        window.location.href = '/html/dashboard-empresa.html';
                    }
                    return response.json();
                })
                .then(data => {
                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (erro) {
                        return window.alert(erro);
                    }
                    if (mensagem) {
                        return window.alert(mensagem);
                    }

                })
                .catch(erro => {
                    console.log(erro);

                })
            clearInterval(intervalo);
            return;


        } else {
            clearInterval(intervalo);
            return
        }

    }, 0);
    
    
}
function toggleDesativarCurriculo() {
    const visualizar_curriculo = localStorage.getItem('visualizar_curriculo');
    let valor = '';

    let intervalo = setInterval(() => {
        if(visualizar_curriculo === true) {
            valor = true;
        }else {
            valor = false;
        }
        const alteracao = {
            visualizar_curriculo: valor
        }

        if (window.confirm('Confirma a Ação para o  Curriculo Atual?')) {
            
            const url = `https://empregototal.onrender.com/curriculo/${localStorage.getItem('idCurriculoAlterarSelecionado')}`;
            
            fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(alteracao)
            })
                .then(response => {
                    if (response.status === 201) {
                        window.alert('Alteração realizada com Sucesso!');
                        window.location.href = '/html/dashboard-empresa.html';
                    }
                    return response.json();
                })
                .then(data => {
                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (erro) {
                        return window.alert(erro);
                    }
                    if (mensagem) {
                        return window.alert(mensagem);
                    }

                })
                .catch(erro => {
                    console.log(erro);

                })
            clearInterval(intervalo);
            return;


        } else {
            clearInterval(intervalo);
            return
        }

    }, 0);

    
}

function selecionarCurriculo() {
    
    let intervalo = setInterval(() => {
        
        if (window.confirm('Confirma a Ação para o  Curriculo Atual?')) {
            const curriculo_id = localStorage.getItem('idIncluirCurriculo');
            const url = `https://empregototal.onrender.com/curriculo_selecionado`;

            const inclusao = {
                curriculo_id,
                visualizar_curriculo: true
            }
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(inclusao)
            })
                .then(response => {
                    if (response.status === 201) {
                        window.alert('Alteração realizada com Sucesso!');
                        window.location.href = '/html/dashboard-empresa.html';
                    }
                    return response.json();
                })
                .then(data => {
                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (erro) {
                        return window.alert(erro);
                    }
                    if (mensagem) {
                        return window.alert(mensagem);
                    }

                })
                .catch(erro => {
                    console.log(erro);

                })
            clearInterval(intervalo);
            return;


        } else {
            clearInterval(intervalo);
            return
        }

    }, 0);
}



function deletarVagaCadastrada() {
    const token = localStorage.getItem('token');

    idVaga = localStorage.getItem('idVagaSelecionada');

    const url = `https://empregototal.onrender.com/vagas/${idVaga}`;

    fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 201) {
                window.alert('Vaga Excluída com Sucesso!');
                window.location.href = '/html/dashboard-empresa.html';
            }
            return response.json();
        })
        .then(data => {
            const erro = data.erro;
            const mensagem = data.mensagem;

            if (erro) {
                return window.alert(erro);
            }
            if (mensagem) {
                return window.alert(mensagem);
            }
        })
        .catch(erro => {
            console.log(erro);

        })
}


function cadastrarCandidato() {

    const curriculo_id = localStorage.getItem('idCurriculoSelecionado');
    const visualizar_curriculo = true;

    const url = `https://empregototal.onrender.com/curriculo_selecionado`;

    const curriculo = {
        curriculo_id,
        visualizar_curriculo
    }


    if (curriculo_id) {
        if (window.confirm('Deseja Selecionar o Curriculo Atual?')) {

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(curriculo)
            })
                .then(response => {
                    if (response.status === 201) {
                        window.alert('Curriculo adicionado com Sucesso!');
                    }
                    return response.json();
                })
                .then(data => {
                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (erro) {
                        return window.alert(erro);
                    }
                    if (mensagem) {
                        return window.alert(mensagem);
                    }


                })
                .catch(erro => {
                    console.log(erro);

                })


        } else {
            return
        }

    }






}

function exibirModalNovaVaga() {

    dialogModalNovaVaga.show();
}

function fecharModalNovaVaga() {

    dialogModalNovaVaga.close();
}



function visualizarCurriculoTipoParams() {
    const tipo = localStorage.getItem('tipoCurriculoSelecionado');
    const url = `https://empregototal.onrender.com/curriculos_tipo_params/${tipo}`;

    if (tipo === '') {
        return window.alert('O Tipo de Curriculo não foi selecionado!');
    };

    fetch(url, {
        method: 'GET',
        headers: {
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

            exibirCurriculoTipoParams(data);
            fecharDialogSelecionarCurriculo();

        })
        .catch(error => {
            console.log(error);

        })

}

function exibirCurriculoTipoParams(curriculos) {



    if (curriculos.length === 0) {
        vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Nenhum Curriculo encontrado!</h1>';
        return;
    }

    vagasContainer.innerHTML = '';


    curriculos.forEach((curriculo) => {
        const vagaDiv = document.createElement('div');
        const btnSelecionar = document.createElement('button');

        const vagaHTML = `
                            <br>  
                            <h2>${curriculo.nome}</h2>
                            <p><strong>Email p/ Contato:</strong> ${curriculo.email}</p>
                            <p><strong>Endereço:</strong> ${curriculo.endereco}</p>
                            <p><strong>Telefone:</strong> ${formatarTelefone(curriculo.telefone)}</p>                            
                            <p><strong>Objetivo:</strong> Complemento: ${curriculo.objetivo}</p>
                            <p><strong>Formação:</strong> ${curriculo.formacao}</p>
                            <p><strong>Experiência:</strong> ${curriculo.experiencia}</p>
                            <p><strong>Habilidades:</strong> ${curriculo.habilidades}</p>
                            <p><strong>Idioma(s):</strong> ${curriculo.idiomas}</p>
                            <p><strong>Referências:</strong> ${curriculo.referencias}</p>
                            <p><strong>Data do Cadastro:</strong> ${formatarCampoData(curriculo.data)} </p>
                            <span style="display: none">${curriculo.id}</span>
                            
                            
                        `;

        btnSelecionar.onclick = 'selecionarCandidato';
        btnSelecionar.textContent = 'Selecionar Candidato';
        btnSelecionar.classList.add('btn-selecionar');
        vagaDiv.classList.add('items');
        vagaDiv.innerHTML = vagaHTML;
        vagaDiv.appendChild(btnSelecionar);
        vagasContainer.appendChild(vagaDiv);


    });

}

function consultarTodosCurriculosSelecionados() {
    const url = `https://empregototal.onrender.com/curriculos_geral_selecionados`;

    fetch(url, {
        method: 'GET',
        headers: {
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
            exibirTodosCurriculosSelecionados(data);
            localStorage.setItem('idCurriculoAlterarSelecionado', '');
            localStorage.setItem('visualizar_curriculo', '')


        })
        .catch(erro => {
            console.log(erro);
        })
}
function exibirTodosCurriculosSelecionados(curriculos) {
    filters.style.display = 'none';

    localStorage.setItem('idVagaSelecionada', '');

    if (curriculos.length === 0) {
        vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Não há uma lista de Curriculos Selecionados!<h1>';

        return;
    }

    vagasContainer.innerHTML = '';

    curriculos.forEach((curriculo) => {
        const btnDescartar = document.createElement('button');
        const btnAtivar = document.createElement('button');
        const vagaDivDescartar = document.createElement('div');
        const vagaDivAtivar = document.createElement('div');

        function btnDescartarF() {
            btnDescartar.textContent = 'Descartar';
            btnDescartar.classList.add('btnDesativarVaga');
            btnDescartar.onclick = toggleDesativarCurriculo;

        }

        function btnAtivarF() {
            btnAtivar.textContent = 'Ativar';
            btnAtivar.classList.add('btnAtivarVaga');
            btnAtivar.onclick = toggleAtivarCurriculo;


        }


        if (curriculo.visualizar_curriculo) {
            const vagaHTML = `
                <br>  
                <h2>${curriculo.nome}</h2>
                <p><strong>Email para contato:</strong> ${curriculo.email}</p>
                <p><strong>Localização:</strong> ${curriculo.endereco}</p>
                <p><strong>Telefone de Contato:</strong> ${formatarTelefone(curriculo.telefone)}</p>
                <p><strong>Objetivo:</strong> ${curriculo.objetivo}</p>
                <p><strong>Formação:</strong> ${curriculo.formacao}</p>
                <p><strong>Experiência:</strong> ${curriculo.experiencia}</p>
                <p><strong>Habilidades:</strong> ${curriculo.habilidades}</p>
                <p><strong>Referências:</strong> ${curriculo.referencias}</p>
                <p><strong>Idiomas:</strong> ${curriculo.idiomas}</p>
                <p>Data de Inclusão: ${formatarCampoData(curriculo.data_cadastro)}</p>
                <span style="display: none">${curriculo.id}</span>
                <span style="display: none">${curriculo.visualizar_curriculo}</span>
                
                                
                `;
            btnDescartarF();
            vagaDivDescartar.classList.add('item1');
            vagaDivDescartar.innerHTML = vagaHTML;
            vagaDivDescartar.appendChild(btnDescartar);
            vagasContainer.appendChild(vagaDivDescartar);



        } else {
            const vagaHTML = `
                <br>  
                <h2 style="color: red">${curriculo.nome} - Curriculo Inativo </h2>
                <p disabled>Email para contato: ${curriculo.email}</p>
                <p disabled>Localização: ${curriculo.endereco}</p>
                <p disabled>Telefone de Contato: ${formatarTelefone(curriculo.telefone)}</p>
                <p disabled>Objetivo: ${curriculo.objetivo}</p>
                <p disabled>Formação: ${curriculo.formacao}</p>
                <p disabled>Experiência: ${curriculo.experiencia}</p>
                <p disabled>Habilidades: ${curriculo.habilidades}</p>
                <p disabled>Referências: ${curriculo.referencias}</p>
                <p disabled>Idiomas: ${curriculo.idiomas}</p>
                <p disabled>Data de Inclusão: ${formatarCampoData(curriculo.data_cadastro)}</p>
                <span style="display: none">${curriculo.id}</span>
                <span style="display: none">${curriculo.visualizar_curriculo}</span>
                
                                
                `;
            btnAtivarF();
            vagaDivAtivar.classList.add('item2');
            vagaDivAtivar.innerHTML = vagaHTML;
            vagaDivAtivar.appendChild(btnAtivar);
            vagasContainer.appendChild(vagaDivAtivar);
        }

    });


}

function exibirDialogSelecionarCurriculo() {
    dialogVisualizarCurriculo.showModal();

}
function fecharDialogSelecionarCurriculo() {
    dialogVisualizarCurriculo.close();

}

function selecionarTipoCurriculo() {
    localStorage.setItem('tipoCurriculoSelecionado', '');
    document.querySelector('#vagas-container-empresa').innerHTML = 'Selecione uma opção para visualizar os dados.';
    document.querySelector('.filters').style.display = 'none';
    const modalVisualizarCurriculos = document.querySelector('#modal-container-visualizar-curriculo');
    const div = document.createElement('div');
    const selectSelecionarTipoCurriculo = document.createElement('select');
    let tipoSelecionarTipoCurriculo;

    selectSelecionarTipoCurriculo.addEventListener('change', () => {
        tipoSelecionarTipoCurriculo = selectSelecionarTipoCurriculo.value;

        localStorage.setItem('tipoCurriculoSelecionado', tipoSelecionarTipoCurriculo);

    });

    modalVisualizarCurriculos.innerHTML = ''

    selectSelecionarTipoCurriculo.innerHTML = `
        <option value="" hidden>Tipo de Curriculo</option>
    `;
    selectSelecionarTipoCurriculo.innerHTML += `
        <option value="medio">Médio</option>
        `

    selectSelecionarTipoCurriculo.innerHTML += `
        <option value="tecnico">técnico</option>
        `


    selectSelecionarTipoCurriculo.innerHTML += `
        <option value="profissional">Profissional</option>
        `
    tipoSelecionarTipoCurriculo = selectSelecionarTipoCurriculo.value;

    div.appendChild(selectSelecionarTipoCurriculo);
    modalVisualizarCurriculos.appendChild(div);
    exibirDialogSelecionarCurriculo();

}


function visualizarTodosUsuariosCurriculos() {
    localStorage.setItem('idIncluirCurriculo', '');
    document.querySelector('.filters').style.display = 'none';
    const url = `https://empregototal.onrender.com/vagas_usuarios_curriculos`;

    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            if (response.status === 404) {
                reloadPage();
                vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Nenhuma Vaga cadastrada!</h1>';
            }
            return response.json();
        })
        .then(data => {
            const erro = data.erro;
            const mensagem = data.mensagem;
            if (erro) {
                return window.alert(erro);
            }
            if (mensagem) {
                return window.alert(mensagem);

            } else {
                exibirTodosUsuariosCurriculos(data);
            }

        })
        .catch(error => {
            console.log(error);

        })
}


function exibirTodosUsuariosCurriculos(curriculos) {

    
    
    if (curriculos.length === 0 || !curriculos) {
        
        vagasContainer.innerHTML = `<h3 class="jobs" style="text-align:center">Nenhma Informação Disponível!</h3>`
        return;
        
    }
    
    
    vagasContainer.innerHTML = '';
    
    curriculos.forEach((curriculo) => {
        const vagaDiv = document.createElement('div');
        const btnSelecionar = document.createElement('button');

        const vagaHTML = `
                            <br>  
                            <h2>${curriculo.nome_usuario} - <span style="font-weight: normal;">Descrição da Vaga: </span>${curriculo.titulo_vaga}</h2>
                            <p><strong>Cpf:</strong> ${formatarCpf(curriculo.cpf_usuario)}</p>
                            <p><strong>Email p/ Contato:</strong> ${curriculo.email_cadastrado}</p>
                            <p><strong>Endereço:</strong> ${curriculo.endereco_cadastrado}</p>
                            <p><strong>Telefone:</strong> ${formatarTelefone(curriculo.telefone_cadastrado)}</p>
                            <p><strong>Objetivo:</strong> Complemento: ${curriculo.objetivo}</p>
                            <p><strong>Formação:</strong> ${curriculo.formacao}</p>
                            <p><strong>Experiência:</strong> ${curriculo.experiencia}</p>
                            <p><strong>Habilidades:</strong> ${curriculo.habilidades}</p>
                            <p><strong>Idioma(s):</strong> ${curriculo.idiomas}</p>
                            <p><strong>Referências:</strong> ${curriculo.referencias}</p>
                            <p style="font-size: 12px">Data_Cadastro: ${formatarCampoData(curriculo.data_cadastro)} </p>
                            <span style="display: none">${curriculo.curriculo_id}</span>
                        `;
        btnSelecionar.textContent = 'Selecionar';
        btnSelecionar.classList.add('btnIncluirSelecionar');
        btnSelecionar.onclick = 'selecionarCurriculo';
        vagaDiv.classList.add('item');
        vagaDiv.innerHTML = vagaHTML;
        vagaDiv.appendChild(btnSelecionar);
        vagasContainer.appendChild(vagaDiv);


    });



}

function formatarParaReal(valor) {

    let [inteiro, decimal] = valor.split('.');

    inteiro = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `R$ ${inteiro},${decimal}`;
}

function extrairSalarioNumerico(salario) {
    const salarioLimpo = salario.replace(/[^\d,-]/g, '').replace(',', '.');


    const salarioNumerico = parseFloat(salarioLimpo);

    return salarioNumerico;
}

{
    area.addEventListener('change', () => {
        let opcao = area.value.toLowerCase();
        let vagasFiltradasArea = filtrarArea(dadosParaFiltrar, opcao);

        exibirVagasEmpresa(vagasFiltradasArea);
    });

    modelo.addEventListener('change', () => {
        let opcao = modelo.value.toLowerCase();
        let vagasFiltradasModelo;

        vagasFiltradasModelo = filtrarModelo(dadosParaFiltrar, opcao);
        exibirVagasEmpresa(vagasFiltradasModelo);

        if (vagasFiltradas) {
            vagasFiltradasModelo = filtrarModelo(dadosParaFiltrar, opcao);
            exibirVagasEmpresa(vagasFiltradasModelo);
        }
    });

    data.addEventListener('change', () => {
        let opcao = data.value.toLowerCase();
        let vagasFiltradasData;

        vagasFiltradasData = filtrarData(dadosParaFiltrar, opcao);
        exibirVagasEmpresa(vagasFiltradasData);

        if (vagasFiltradas) {
            vagasFiltradasData = filtrarData(dadosParaFiltrar, opcao);
            exibirVagasEmpresa(vagasFiltradasData);
        }
    });

    contrato.addEventListener('change', () => {
        let opcao = contrato.value.toLowerCase();
        let vagasFiltradasContrato;

        vagasFiltradasContrato = filtrarContrato(dadosParaFiltrar, opcao);
        exibirVagasEmpresa(vagasFiltradasContrato);

        if (vagasFiltradas) {
            vagasFiltradasContrato = filtrarContrato(dadosParaFiltrar, opcao);
            exibirVagasEmpresa(vagasFiltradasContrato);
        }
    });

    pcd.addEventListener('change', () => {
        let opcao = pcd.value.toLowerCase();
        let vagasFiltradasPcd;

        vagasFiltradasPcd = filtrarPcd(dadosParaFiltrar, opcao);
        exibirVagasEmpresa(vagasFiltradasPcd);

        if (vagasFiltradas) {
            vagasFiltradasPcd = filtrarPcd(dadosParaFiltrar, opcao);

            exibirVagasEmpresa(vagasFiltradasPcd);
        }
    });

    salario.addEventListener('change', () => {
        let opcao = salario.value.toLowerCase();
        let vagasFiltradasSalario;

        vagasFiltradasSalario = filtrarSalario(dadosParaFiltrar, opcao);
        exibirVagasEmpresa(vagasFiltradasSalario);

        if (vagasFiltradas) {
            vagasFiltradasSalario = filtrarSalario(dadosParaFiltrar, opcao);
            exibirVagasEmpresa(vagasFiltradasSalario);
        }
    });


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

function formatarCampoData(dados) {
    const dataCadastro = new Date(dados);
    const dia = String(dataCadastro.getDate()).padStart(2, '0');
    const mes = String(dataCadastro.getMonth() + 1).padStart(2, '0');
    const ano = dataCadastro.getFullYear();
    const dataFormatada = `${dia}-${mes}-${ano}`;

    return dataFormatada;
}

function formatarTelefone(telefone) {
    if (telefone.length === 11) {
        return `(${telefone.slice(0, 2)}) ${telefone.slice(2, 7)}-${telefone.slice(7)}`;
    } else if (telefone.length === 10) {
        return `(${telefone.slice(0, 2)}) 9${telefone.slice(3, 7)}-${telefone.slice(6)}`;

    } else {
        return 'null';
    }

}

function formatarCpf(cpf) {
    if (cpf.length === 11) {
        return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;

    } else {
        return 'null';
    }

}