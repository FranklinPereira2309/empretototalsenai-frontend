
function mostrarMenu() {
    const btnMenu = document.querySelector('.botao-menu');
    const menu = document.querySelector('#menu');
    const menuUsuario = document.getElementById('menu-usuario');

    const identificacao = localStorage.getItem('identificacao');

    window.onclick = function (event) {
        if (event.target === btnMenu) {
            menuUsuario.style.display = 'none';
            return;
        }

        menu.style.display = 'none';

    }

    if (menu.style.display === 'block') {
        menu.style.display = 'none';
    } else {
        menu.style.display = 'block';
    }



}

function mostrarMenuUsuario() {
    const menuUsuario = document.getElementById('menu-usuario');
    const btnMenuUsuario = document.querySelector('.botao-menu-usuario');
    const menu = document.querySelector('#menu');

    const identificacao = localStorage.getItem('identificacao');


    window.onclick = function (event) {
        if (event.target === btnMenuUsuario) {
            menu.style.display = 'none';
            return;
        }

        menuUsuario.style.display = 'none';
    }


    if (menuUsuario.style.display === 'block') {
        menuUsuario.style.display = 'none';
    } else {
        menuUsuario.style.display = 'block';
    }



}



function deslogarImediatamente() {
    localStorage.clear();

    return window.location.href = '../index.html';

}

function showPreview(id, videoId) {
    let iframe = document.querySelector('#iframe' + id);
    let allIframes = document.querySelectorAll('iframe');
    allIframes.forEach(function (frame) {
        frame.style.display = 'none';
    });
    iframe.style.display = 'block';
    iframe.src = 'https://www.youtube.com/embed/' + videoId;
}

function login() {

    let email = document.querySelector('#emailLogin').value;
    let password = document.querySelector('#passwordLogin').value;
    let cpf = document.querySelector('#cpfLogin').value;

    const url = "https://empretototalsenai.netlify.app/login";


    const login = {
        email: email.toLowerCase(),
        cpf: cpf.replace(/\D/g, ''),
        senha: password
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login)
    })
        .then(response => response.json())
        .then(data => {
            const mensagem = data.mensagem;
            const erro = data.erro;

            if (erro) {
                window.alert(erro);
                return;
            } else if (mensagem) {
                window.alert(mensagem);
                return;
            }

            window.alert('Login Efetuado!');

            if (window.confirm('Deseja ir para página de Dashboard?')) {
                window.location.href = '/html/dashboard-usuario.html';
            } else {

                window.location.href = '/index.html';
            }
            adicionarLocalStorage(data, 720);

        })
        .catch(error => {
            if (error.message === 'Failed to fetch') {
                console.log(error.message);

                return window.alert('Erro de conexão na Api! Ou conexão recusada!');

            } else {
                return console.log('Erro: ', error.message);

            }
        });
}


function loginEmpresa() {
    let email = document.querySelector('#emailLogin').value;
    let password = document.querySelector('#passwordLogin').value;
    let cnpj = document.querySelector('#cnpjLogin').value;

    const url = "https://empretototalsenai.netlify.app/loginEmpresa";


    const login = {
        email: email.toLowerCase(),
        cnpj: cnpj.replace(/\D/g, ''),
        senha: password
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(login)
    })
        .then(response => response.json())
        .then(data => {
            const mensagem = data.mensagem;
            const erro = data.erro;

            if (erro) {
                window.alert(erro);
                return;
            } else if (mensagem) {
                window.alert(mensagem);
                return;
            }
            window.alert('Login Efetuado!');
            adicionarLocalStorage(data, 720);
            window.location.href = '/html/dashboard-empresa.html';
        })
        .catch(error => {
            if (error.message === 'Failed to fetch') {
                console.log(error.message);

                return window.alert('Erro de conexão na Api! Ou conexão recusada!');

            } else {
                return console.log('Erro: ', error.message);

            }
        });
}



function adicionarLocalStorage(data, tempo) {
    if (data.usuario) {
        const { id, email, cpf, nome } = data.usuario;
        const { token } = data;
        const agora = new Date();
        const expiracaoToken = agora.getTime() + tempo * 60 * 1000;
        localStorage.setItem('id', id);
        localStorage.setItem('nome', nome);
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
        localStorage.setItem('expiracaoToken', expiracaoToken);
        localStorage.setItem('identificacao', cpf);

    } else if (data.empresa) {
        const { id, email, cnpj, nome } = data.empresa;
        const { token } = data;
        const agora = new Date();
        const expiracaoToken = agora.getTime() + tempo * 60 * 1000;
        localStorage.setItem('id', id);
        localStorage.setItem('nome', nome);
        localStorage.setItem('email', email);
        localStorage.setItem('token', token);
        localStorage.setItem('expiracaoToken', expiracaoToken);
        localStorage.setItem('identificacao', cnpj);
    }

}


function omitirSpan() {
    const erroConfirmaSenha = document.querySelector('#erroConfirmaSenha')
    document.querySelector('#senha').style.border = 'none';
    document.querySelector('#re-senha').style.border = 'none';
    erroConfirmaSenha.style.display = 'none';
}

function cadastrarLogin() {
    const nome = document.querySelector('#nome').value;
    const email = document.querySelector('#email').value;
    const cpf = document.querySelector('#cpf').value;
    const senha = document.querySelector('#senha').value;
    const repetirSenha = document.querySelector('#re-senha').value;
    const erroConfirmaSenha = document.querySelector('#erroConfirmaSenha');
    let senhaConfirmada;

    if (!nome || !email || !senha || !repetirSenha || !cpf) {
        return window.alert("Preencha todos os Campos!");
    }

    document.getElementById('registroForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    if (senha === repetirSenha) {
        senhaConfirmada = senha;
    } else {
        document.querySelector('#senha').style.border = '1px solid red';
        document.querySelector('#re-senha').style.border = '1px solid red';
        return erroConfirmaSenha.style.display = 'block';
    }



    const novoLogin = {
        nome: nome.charAt(0).toUpperCase() + nome.slice(1).toLowerCase(),
        email: email.toLowerCase(),
        cpf: cpf.replace(/\D/g, ''),
        senha: senhaConfirmada
    };

    const url = 'https://empretototalsenai.netlify.app/usuario';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoLogin)
    })
        .then(response => response.json())
        .then(data => {
            const mensagem = data.mensagem;
            const erro = data.erro;

            if (erro) {
                return window.alert(erro);
            } else if (mensagem) {
                return window.alert(mensagem);
            }

            document.querySelector('#nome').value = '';
            document.querySelector('#email').value = '';
            document.querySelector('#cpf').value = '';
            document.querySelector('#senha').value = '';
            document.querySelector('#re-senha').value = '';

            window.alert('Usuário registrado com sucesso!');

        })
        .catch((error) => {
            console.error('Erro:', error);
        });
}
function cadastrarLoginEmpresa() {
    let nome = document.querySelector('#nome').value;
    let email = document.querySelector('#email').value;
    let cnpj = document.querySelector('#cnpj').value;
    let senha = document.querySelector('#senha').value;
    const repetirSenha = document.querySelector('#re-senha').value;
    const erroConfirmaSenha = document.querySelector('#erroConfirmaSenha');
    let senhaConfirmada;

    if (!nome || !email || !senha || !repetirSenha || !cnpj) {
        return window.alert("Preencha todos os Campos!");
    }

    document.getElementById('registroForm').addEventListener('submit', function (event) {
        event.preventDefault();
    });

    let novoNome = capitalizePalavas(nome);

    if (senha === repetirSenha) {
        senhaConfirmada = senha;
    } else {
        document.querySelector('#senha').style.border = '1px solid red';
        document.querySelector('#re-senha').style.border = '1px solid red';

        return erroConfirmaSenha.style.display = 'block';
    }

    const novoLogin = {
        nome: novoNome,
        email: email.toLowerCase(),
        cnpj: cnpj.replace(/\D/g, ''),
        senha: senhaConfirmada
    };

    const url = 'https://empretototalsenai.netlify.app/empresa';

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoLogin)
    })
        .then(response => response.json())
        .then(data => {
            const mensagem = data.mensagem;
            const erro = data.erro;

            if (erro) {
                return window.alert(erro);
            } else if (mensagem) {
                return window.alert(mensagem);
            }

            document.querySelector('#nome').value = '';
            document.querySelector('#email').value = '';
            document.querySelector('#cnpj').value = '';
            document.querySelector('#senha').value = '';
            document.querySelector('#re-senha').value = '';

            window.alert('Usuário registrado com sucesso!');
        })
        .catch((error) => {
            console.error('Erro:', error);
        });
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

function tokenValido() {
    const token = localStorage.getItem('token');
    const expiracaoToken = localStorage.getItem('expiracaoToken');
    const agora = new Date().getTime();

    if (agora > expiracaoToken) {
        localStorage.clear();

        areaPesquisa.style.display = 'none';
        divUsuarioLogado.style.display = 'none';
        textoUsuarioLogado.innerHTML = '';
        loginButton.style.display = 'block';
    }
}

function capitalizePalavas(str) {
    return str.split(' ').map(word => {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

function aplicarMascara(valor, mascara) {
    let i = 0;
    const valorFormatado = valor.replace(/\D/g, '');
    return mascara.replace(/#/g, _ => valorFormatado[i++] || '');
}


function mascaraCPF(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '###.###.###-##');
}

function mascaraCNPJ(event) {
    const campo = event.target;
    campo.value = aplicarMascara(campo.value, '##.###.###/####-##');
}

document.addEventListener('DOMContentLoaded', (e) => {
    e.preventDefault();
    const identificacao = localStorage.getItem('identificacao');


    function timeStorage() {
        if (Number(identificacao.length) === 14) {
            window.location.href = '/html/login-page-enterprise.html';
        } else {

            window.location.href = '/html/login-page.html';
        }
        localStorage.clear();
        return window.alert('Sessão expirada. Você foi deslogado.');
    }

    function startSessionTimer() {
        const expirationTime = localStorage.getItem('expiracaoToken');
        if (!expirationTime) {
            document.getElementById('session-timer').style.display = 'none';
            return;
        }

        const expirationDate = new Date(parseInt(expirationTime, 10));
        const intervalId = setInterval(() => {
            const now = new Date();
            const timeRemaining = expirationDate - now;

            if (timeRemaining <= 0) {
                clearInterval(intervalId);
                timeStorage();
                return;
            }

            const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

            document.getElementById('time-remaining')
                .innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            document.getElementById('time-remaining').textContent = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
        }, 1000);
    }
    window.onload = startSessionTimer;
});


function mudarVisibilidadeSenha() {
    let olho = document.querySelector('.olho');
    let inputSenha = document.querySelector('#passwordLogin');
    inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
    olho.src = inputSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}
function mudarVisibilidadeSenhaCad() {
    let olho = document.querySelector('.olho1');

    let inputSenha = document.querySelector('#senha');

    inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';

    olho.src = inputSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'

}
function mudarVisibilidadeReSenhaCad() {
    let olho = document.querySelector('.olho2');
    let inputSenha = document.querySelector('#re-senha');
    inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
    olho.src = inputSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}


