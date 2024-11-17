let dadosApi;

document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const identificacao = localStorage.getItem('identificacao');

    if (!token) {
        return window.location.href = '/html/acesso-negado.html';

    }
    if (Number(identificacao.length) === 11) {

        nome ? titulo.textContent = `Dashboard - ${nome}` : 'Dashboard';
    } else {
        return window.location.href = '/html/acesso-negado-empresa.html';
    }
})

function consultarUsuariosCompletos() {

    const token = localStorage.getItem('token');

    const url = 'http://localhost:3003/usuarios_completos'

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {

            if (data.mensagem) {
                window.alert(data.mensagem);

                document.querySelector('#nome_completo').value = '';
                document.querySelector('#email').value = '';
                document.querySelector('#telefone').value = '';
                document.querySelector('#cep').value = '';
                document.querySelector('#logradouro').value = '';
                document.querySelector('#cidade').value = '';
                document.querySelector('#estado').value = '';
                document.querySelector('#bairro').value = '';
                document.querySelector('#numero').value = '';
                document.querySelector('#complemento').value = '';
                document.querySelector('#data_nascimento').value = '';
                document.querySelector('#genero').value = '';
            } else {
                exibirDadosApi(data);
                document.querySelector('#atualizarDadosPessoais').style.display = 'block';
                document.querySelector('#salvarDadosPessoais').style.display = 'none';


            }
        })
        .catch(error => {
            console.log(error);
        })
}

function cadastrarUsuario() {

    let nome_completo = document.querySelector('#nome_completo').value;
    let email = document.querySelector('#email').value;
    let telefone = document.querySelector('#telefone').value;
    let cep = document.querySelector('#cep').value;
    let logradouro = document.querySelector('#logradouro').value;
    let cidade = document.querySelector('#cidade').value;
    let estado = document.querySelector('#estado').value;
    let bairro = document.querySelector('#bairro').value;
    let numero = document.querySelector('#numero').value;
    let complemento = document.querySelector('#complemento').value;
    let data_nascimento = document.querySelector('#data_nascimento').value;
    let genero = document.querySelector('#genero').value;
    let valorGenero;



    document.getElementById('dadosForm').addEventListener('submit', function (event) {
        event.preventDefault();

    });

    if (
        !nome_completo ||
        !email ||
        !telefone ||
        !cep ||
        !logradouro ||
        !cidade ||
        !estado ||
        !bairro ||
        !numero ||
        !complemento ||
        !data_nascimento ||
        !genero) {
        return window.alert("Preencha todos os Dados!");
    } else {
        valorGenero = genero;
    }

    const token = localStorage.getItem('token');
    const _email = localStorage.getItem('email');
    const id_usuario = localStorage.getItem('id');
    const expiracaoToken = localStorage.getItem('expiracaoToken');

    const novoUsuario = {
        nome_completo: nome_completo.charAt(0).toUpperCase() + nome_completo.slice(1).toLowerCase(),
        email: email.toLowerCase(),
        telefone: telefone.replace(/\D/g, ''),
        cep: cep.replace(/\D/g, '',),
        logradouro,
        cidade,
        estado,
        bairro,
        numero,
        complemento,
        data_nascimento,
        genero: valorGenero,
        usuario_id: id_usuario
    };

    if (token) {

        const url = 'http://localhost:3003/usuarios_completos';
        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoUsuario)
        })
            .then(response => response.json())
            .then(data => {

                const erro = data.erro;
                const mensagem = data.mensagem;

                if (erro) {
                    return window.alert(mensagemErro);
                }
                if (mensagem) {
                    return window.alert(mensagem);
                }

                window.alert('Usuário registrado com sucesso!');


                window.location.href = '/html/cad-dados-pessoais.html';
            })
            .catch((error) => {
                console.error('Erro:', error);
            });
    }
}

function atualizarUsuario() {

    let nome_completo = document.querySelector('#nome_completo').value;
    let email = document.querySelector('#email').value;
    let telefone = document.querySelector('#telefone').value;
    let cep = document.querySelector('#cep').value;
    let logradouro = document.querySelector('#logradouro').value;
    let numero = document.querySelector('#numero').value;
    let bairro = document.querySelector('#bairro').value;
    let complemento = document.querySelector('#complemento').value;
    let cidade = document.querySelector('#cidade').value;
    let estado = document.querySelector('#estado').value;
    let data_nascimento = document.querySelector('#data_nascimento').value;
    let genero = document.querySelector('#genero').value;



    document.getElementById('dadosForm').addEventListener('submit', function (event) {
        event.preventDefault();


        if (
            !nome_completo ||
            !email ||
            !telefone ||
            !cep ||
            !logradouro ||
            !cidade ||
            !estado ||
            !bairro ||
            !numero ||
            !complemento ||
            !data_nascimento ||
            !genero) {
            return window.alert("Preencha todos os Dados!");
        } else {
            valorGenero = genero;
        }


        const url = `http://localhost:3003/usuarios_completos`;

        const token = localStorage.getItem('token');

        const usuarioAtualizado = {
            nome_completo: nome_completo.charAt(0).toUpperCase() + nome_completo.slice(1).toLowerCase(),
            email: email.toLowerCase(),
            telefone: telefone.replace(/\D/g, ''),
            cep: cep.replace(/\D/g, '',),
            logradouro,
            numero,
            bairro,
            complemento,
            cidade,
            estado,
            data_nascimento,
            genero

        }

        if (token) {
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(usuarioAtualizado)
            })
                .then(response => {
                    if(response.status === 201 ) {
                        window.location.href = '/html/cad-dados-pessoais.html';
                        return window.alert('Usuário atualizado com Sucesso!');
                    }
                    return response.json();
                        
                } )
                .then(data => {

                    const erro = data.erro;
                    const mensagem = data.mensagem;

                    if (erro) {
                        window.location.href = '/html/cad-dados-pessoais.html';
                        return window.alert(erro);
                    }
                    if (mensagem) {
                        return window.alert(mensagem);
                    }                    

                })
                .catch((error) => {
                    console.error('Erro:', error);
                });
        } else {
            console.log('Não houve token');

        }
    });



}

function formarCampoData(data) {
    const dataNascimento = new Date(data.data_nascimento);
    const dataFormatada = dataNascimento.toISOString().split('T')[0];

    return dataFormatada;
}

function exibirDadosApi(dados) {
    let dataFormata = formarCampoData(dados);



    document.querySelector('#nome_completo').value = dados.nome_completo;
    document.querySelector('#email').value = dados.email;
    document.querySelector('#telefone').value = formatarCelularPraExibir(dados.telefone);
    document.querySelector('#cep').value = formatarCepPraExibir(dados.cep);
    document.querySelector('#logradouro').value = dados.logradouro;
    document.querySelector('#cidade').value = dados.cidade;
    document.querySelector('#estado').value = dados.estado;
    document.querySelector('#bairro').value = dados.bairro;
    document.querySelector('#numero').value = dados.numero;
    document.querySelector('#complemento').value = dados.complemento;
    document.querySelector('#data_nascimento').value = dataFormata;
    document.querySelector('#genero').value = dados.genero;
}

function consultarCepApi() {
    let cep = document.querySelector('#cep').value;
    let novoCep = cep.replace(/\D/g, '');

    if (window.confirm('Consultar Cep?')) {
        viaCepApi(novoCep);

    } else {
        return
    }
}



function viaCepApi(cep) {
    const url = `http://localhost:3003/via_cep_api/${cep}`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }

    })
        .then(resp => {
            if(resp.status === 500) {
                return window.alert('Erro ao digitar o Cep, verifique o CEP digitado!');
            }
            if(resp.status === 404) {
                return window.alert('Cep NÃO encontrado!');
            }
            if(resp.status === 400) {
                return window.alert('Cep errado, verifique o CEP digitado!');
            }

            return  resp.json();
        })
        .then(data => {
            // const erro = data.erro;
            // const mensagem = data.mensagem;
            // if(erro) {
            //     return window.alert(erro);
            // }
            // if(mensagem) {
            //     return window.alert(mensagem)
            // }

            document.querySelector('#logradouro').value = data.logradouro || '';
            document.querySelector('#bairro').value = data.bairro || '';
            document.querySelector('#cidade').value = data.localidade || '';
            document.querySelector('#estado').value = data.uf || '';

        })
        .catch(error => {
            console.error('Erro ao consultar o CEP:', error.message);
        });
}

function aplicarMascara(valor, mascara) {
    let i = 0;
    const valorFormatado = valor.replace(/\D/g, '');
    return mascara.replace(/#/g, _ => valorFormatado[i++] || '');
}


function mascaraTelefone(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '(##) #####-####');
}

function formatarCelularPraExibir(celular) {
    return aplicarMascara(celular, '(##) #####-####');
}
function formatarCepPraExibir(cep) {
    return aplicarMascara(cep, '##.###-###');
}


function mascaraCPF(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '###.###.###-##');
}
function mascaraCEP(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '##.###-###');
}


function mascaraCNPJ(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '##.###.###/####-##');
}

{
    let divUsuarioLogado = document.querySelector('#usuarioLogado');
    let textoUsuarioLogado = document.querySelector('#emailLogado');
    let loginButton = document.querySelector('#area-menu');
    let areaPesquisa = document.querySelector('.area-pesquisa');
    let linksLogado = document.querySelectorAll('.link-logado');

    linksLogado.forEach(link => {
        link.style.display = 'none';
    });

    divUsuarioLogado.style.display = 'none';

    const _email = localStorage.getItem('email');
    const id_usuario = localStorage.getItem('id');

    if (id_usuario) {
        divUsuarioLogado.style.display = 'flex';
        textoUsuarioLogado.innerHTML = _email;
        linksLogado.forEach(link => {
            link.style.display = 'block';
        });
        loginButton.style.display = 'none';
    } else {
        areaPesquisa.style.display = 'none';
    }
}




consultarUsuariosCompletos();