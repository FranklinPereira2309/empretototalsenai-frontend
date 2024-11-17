const dialogModalNovaVaga = document.querySelector('#dialogNovaVaga');
const vagasContainer = document.querySelector('#vagas-usuarios-container');
const vagasConcorrendoCurriculos = [];

document.addEventListener('DOMContentLoaded', () => {
    let titulo = document.querySelector('#titulo_dash_usuario');
    const nome = localStorage.getItem('nome');
    const token = localStorage.getItem('token');
    
    if(!token) {
        return window.location.href = `/html/acesso-negado.html`;
    }

    const identificacao = localStorage.getItem('identificacao');

    if (Number(identificacao.length) === 11) {

        nome ? titulo.textContent = `Dashboard - ${nome}` : 'Dashboard';
    } else {
        window.alert('Aréa Restrita para Candidatos!');
        return window.location.href = '/html/dashboard-empresa.html';
    }

    

})


vagasContainer.addEventListener('click', (e) => {    
   

    if (e.target.classList.contains('btn-cadastrar')) {
        const elementoPai = e.target.closest('.item');
        const elementoSpan = elementoPai.querySelector('span');

        if (elementoSpan) {
            const valorSpanId = elementoSpan.textContent;
            localStorage.setItem('idVaga', valorSpanId);

        }

    }else {
        return;
    }
    
    
    
});

function meCadastrarDash() {
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
    
    if (token) {

        const url = 'https://empretototalsenai.netlify.app/curriculos';
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
                
                telaConfirmacaoCadCurriculo(dadosApi);
               
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}

function salvarCurriculoVaga() {
    const idVaga = localStorage.getItem('idVaga');
    const idCurriculo = localStorage.getItem('idCurriculo');

    const url = `https://empretototalsenai.netlify.app/vagas_curriculos`;
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
                window.alert(`Vaga Adicionada com Sucesso no Curriculo ${tipoCurriculo}`)
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
    const modalContainer = document.querySelector("#modal-container-usuario");
    const dados = document.createElement('div');
    const select = document.createElement('select');
    const button = document.querySelector('#salvarCurriculo');
    const p = document.querySelector('#alertaCadastrado');
    let idVaga = localStorage.getItem('idVaga');
       

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
    
       

    select.innerHTML = `
        <option value="" hidden>Selecionar Curriculo</option>
    `;

    const { cMedio, cTecnico, cProfissional } = curriculo;
    
    
    
    
    
    if (vagasConcorrendoCurriculos.includes(Number(idVaga))) {
        p.style.color = 'red';
        p.textContent = `Um Curriculo seu já foi adicionado a está Vaga`;

    }

    
    
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
    }else if(!vagasConcorrendoCurriculos.includes(Number(idVaga))) {
        
        if(cMedio) {
            select.innerHTML += `
                <option value="${cMedio.tipo}">${cMedio.tipo}</option>
            `
        }
        if(cTecnico) {
            select.innerHTML += `
            <option value="${cTecnico.tipo}">${cTecnico.tipo}</option>
            `
        }
        if(cProfissional) {
            select.innerHTML += `
                <option value="${cProfissional.tipo}">${cProfissional.tipo}</option>
            `
        }
    }

    


    modalContainer.appendChild(select);
    exibirModalUsuario();
}


function buscarTodasAsVagasLogado() {
    const url = `https://empretototalsenai.netlify.app/todas_as_vagas_logado`;

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

            let mensagem = data.mensagem;


            if (mensagem) {
                return window.alert(mensagem);
            } else {
                exibirVagas(data);
                consultarBuscarIdVaga(); 
                                               
            }

        })
        .catch(erro => {
            console.log('erro: ', erro);

        })
}
function buscarTodasAsVagas() {
    const url = `https://empretototalsenai.netlify.app/todas_as_vagas`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            let mensagem = data.mensagem;


            if (mensagem) {
                return window.alert(mensagem);
            } else {
                exibirVagas(data);

            }

        })
        .catch(erro => {
            console.log('erro: ', erro);

        })
}

function consultarCurriculosVagas() {
    const token = localStorage.getItem('token');
    const url = `https://empretototalsenai.netlify.app/curriculos_vagas`;

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
                                  
            exibirCurriculosVagas(data);
            
            
        })
        .catch(erro => {
            console.log(erro);

        })
}

function exibirCurriculosVagas(dados) {
    vagasContainer.innerHTML = '';
    

    if (dados.length === 0 || !dados) {
        vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Nenhuma vaga encontrada!</h1>';
        return;
    }

    dados.forEach((dado) => {
        const vagaDiv = document.createElement('div');
        let dataFormatada = formarCampoData(dado);
        const imagem = document.createElement('img');
        const div = document.createElement('div');
        
        
        let tipo = dado.tipo;
        let novoTipo = '';
        tipo === 'medio'?  novoTipo = 'Médio' : '';
        tipo === 'tecnico'?  novoTipo ='Técnico' : '';
        tipo === 'profissional'?  novoTipo = 'Profissional' : '';
        
        const vagaHTML = `
        
        <h2>${dado.titulo} - Curriculo ${novoTipo}</h2>
        <p><strong>Nome da Empresa:</strong> ${dado.nome_empresa}</p>
        <p><strong>Descrição da Vaga:</strong> ${dado.descricao}</p>
        <p><strong>Setor Atuação:</strong> ${dado.setor_atuacao}</p>
        <p><strong>Localização:</strong> ${dado.localizacao}</p>
        <p><strong>Formação:</strong> ${dado.formacao}</p>
        <p><strong>Email de contato:</strong> ${dado.email}</p>
        <p><strong>Salário:</strong> ${dado.salario ? `R$ ${dado.salario}` : `Não informado!`}</p>
        <p><strong>Tipo Contrato:</strong> ${dado.tipo_contrato}</p>
        <p><strong>Modalidade:</strong> ${dado.modalidade}</p>
        <p>Data Cadastro: ${dataFormatada}</p>
        
        `;
        
        imagem.classList.add('img-pcd-usuario');
        dado.pcd? imagem.src = '/assets/pcd1.jpeg': imagem.style.display = 'none'; 
        vagaDiv.innerHTML = vagaHTML;
        div.classList.add('img-div-usuario');
        div.appendChild(imagem);
        vagaDiv.appendChild(div);
        vagasContainer.appendChild(vagaDiv);
        
        
        
    });
}

function fecharDialogModal() {
    window.location.href = window.location.href;
    dialogModalNovaVaga.close();    
}

function exibirModalUsuario() {
    dialogModalNovaVaga.showModal();
}

function exibirVagas(vagas) {
    vagasContainer.innerHTML = '';

    if (vagas.length === 0) {
        vagasContainer.innerHTML = '<h1 class="jobs" style="text-align:center">Nenhuma vaga encontrada!</h1>';
        return;
    }

    vagas.forEach((vaga) => {
        const vagaDiv = document.createElement('div');
        const btnCadastrar = document.createElement('button');
        const imagem = document.createElement('img');
        const div = document.createElement('div');


        const vagaHTML = `
                    
                    <h2>${vaga.titulo}</h2>
                    <p><strong>Empresa:</strong> ${vaga.nome_empresa}</p>
                    <p><strong>Localização:</strong> ${vaga.localizacao}</p>
                    <p><strong>Descrição:</strong> ${vaga.descricao}</p>
                    <p><strong>Requisitos:</strong> ${vaga.habilidades}</p>
                    <p><strong>Salário:</strong> ${vaga.salario ? `R$ ${vaga.salario}` : `Não informado!`}</p>
                    <p><strong>Email de contato:</strong> ${vaga.email}</p>
                    <span style="display: none">${vaga.id}</span>                    
                    
                `;
        imagem.classList.add('img-pcd-usuario');
        vaga.pcd? imagem.src = '/assets/pcd1.jpeg': imagem.style.display = 'none';
        btnCadastrar.classList.add('btn-cadastrar');
        btnCadastrar.textContent = 'Me Candidatar';
        btnCadastrar.onclick = meCadastrarDash;
        vagaDiv.classList.add('item');
        vagaDiv.innerHTML = vagaHTML;
        vagaDiv.appendChild(btnCadastrar);
        div.classList.add('img-div-usuario');
        div.appendChild(imagem)
        vagaDiv.appendChild(div);
        vagasContainer.appendChild(vagaDiv);
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


function consultarBuscarIdVaga() {
    
    const token = localStorage.getItem('token');
    const url = `https://empretototalsenai.netlify.app/curriculos_vagas`;

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

