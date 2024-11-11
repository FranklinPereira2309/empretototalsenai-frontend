let dadosApi;

function consultarApi() {
    const token = localStorage.getItem('token');
    // const id_usuario = localStorage.getItem('id');
    const url = 'https://empregototal.onrender.com/curriculosgeral';

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
                exibirDadosApi(data);
            }
        })
        .catch(error => {
            console.log(error);
        })
}

verificarExistenciaCurriculo();




function exibirDadosApi(dados) {
    document.querySelector('#nome').value = dados.nome;
    document.querySelector('#email').value = dados.email;
    document.querySelector('#telefone').value = dados.telefone;
    document.querySelector('#endereco').value = dados.endereco;
    document.querySelector('#objetivo').value = dados.objetivo;
    document.querySelector('#formacao').value = dados.formacao;
    document.querySelector('#experiencia').value = dados.experiencia;
    document.querySelector('#habilidades').value = dados.habilidades;
    document.querySelector('#idiomas').value = dados.idiomas;
    document.querySelector('#referencias').value = dados.refencias;
    document.querySelector('#tipo-formacao').value = dados.tipo;
}

function cadastrarCurriculo() {
    let nome = document.querySelector('#nome').value;
    let email = document.querySelector('#email').value;
    let telefone = document.querySelector('#telefone').value;
    let endereco = document.querySelector('#endereco').value;
    let formacao = document.querySelector('#formacao').value;
    let objetivo = document.querySelector('#objetivo').value;
    let experiencia = document.querySelector('#experiencia').value;
    let habilidades = document.querySelector('#habilidades').value;
    let idiomas = document.querySelector('#idiomas').value;
    let referencias = document.querySelector('#referencias').value;
    let tipo = document.querySelector('#tipo-formacao').value;

    let valorTipo;

    document.getElementById('formCurriculo').addEventListener('submit', function (event) {
        event.preventDefault();

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
            !referencias ||
            !tipo) {
            return window.alert("Preencha todos os Dados!");
        } else {
            valorTipo = tipo;
        }

        const token = localStorage.getItem('token');
        const _email = localStorage.getItem('email');
        const id_usuario = localStorage.getItem('id');
        const expiracaoToken = localStorage.getItem('expiracaoToken');
        const novoCurriculo = {
            nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
            email: email.toLowerCase(),
            telefone,
            endereco,
            formacao,
            objetivo,
            experiencia,
            habilidades,
            idiomas,
            referencias,
            tipo: valorTipo,
            usuario_id: id_usuario
        };

        if (token) {
            const url = 'https://empregototal.onrender.com/curriculo';
            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(novoCurriculo)
            })
                .then(response => response.json())
                .then(data => {

                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (mensagem) {
                        window.location.href = '/html/cad-curriculo.html';
                        return window.alert(mensagem);
                    }

                    if (erro) {
                        return window.alert(mensagem);
                    }

                    document.querySelector('#nome').value = '';
                    document.querySelector('#email').value = '';
                    document.querySelector('#telefone').value = '';
                    document.querySelector('#endereco').value = '';
                    document.querySelector('#formacao').value = '';
                    document.querySelector('#objetivo').value = '';
                    document.querySelector('#experiencia').value = '';
                    document.querySelector('#habilidades').value = '';
                    document.querySelector('#idiomas').value = '';
                    document.querySelector('#referencias').value = '';
                    document.querySelector('#tipo-formacao').value = '';

                    window.location.href = '/html/cad-curriculo.html';
                    window.alert('Curriculo registrado com sucesso!');
                })
                .catch((error) => {
                    console.error('Erro:', error);
                });
        }
    });
}


function verificarExistenciaCurriculo() {
    const token = localStorage.getItem('token');
    
    let dadosApi;

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

                    validandoLinksCamposCurriculos(dadosApi);
                }
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}

function validandoLinksCamposCurriculos(dados) {
    
    const { cMedio, cTecnico, cProfissional } = dados;

    if (cMedio && cTecnico && cProfissional) {
        document.querySelector('#nome').disabled = true;
        document.querySelector('#email').disabled = true;
        document.querySelector('#telefone').disabled = true;
        document.querySelector('#endereco').disabled = true;
        document.querySelector('#formacao').disabled = true;
        document.querySelector('#objetivo').disabled = true;
        document.querySelector('#experiencia').disabled = true;
        document.querySelector('#habilidades').disabled = true;
        document.querySelector('#idiomas').disabled = true;
        document.querySelector('#referencias').disabled = true;
        document.querySelector('#tipo-formacao').disabled = true;
        document.querySelector('#btnCurriculo').disabled = true;
        document.querySelector('#btnCurriculo').style.backgroundColor = 'lightgray';

        window.alert('Você não pode cadastrar mais Curriculos!');
        window.alert('Acesse MEUS CURRICULOS para visualiza-los.');
        window.location.href = '/html/dashboard-usuario.html';

    }
    
}

