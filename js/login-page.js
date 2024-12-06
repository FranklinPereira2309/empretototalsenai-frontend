document.addEventListener('DOMContentLoaded', (e) => {
    
    const identificacao = localStorage.getItem('identificacao');      
           
    
    if(identificacao && Number(identificacao.length) === 11) {
        return irPara = window.location.href = '/html/dashboard-usuario.html';
    }
    
});

function login() {

    let email = document.querySelector('#emailLogin').value;
    let password = document.querySelector('#passwordLogin').value;
    let cpf = document.querySelector('#cpfLogin').value;

    const url = "https://empregototal.onrender.com/login";


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

function mudarVisibilidadeSenha() {
    let olho = document.querySelector('.olho');
    let inputSenha = document.querySelector('#passwordLogin');
    inputSenha.type = inputSenha.type === 'password' ? 'text' : 'password';
    olho.src = inputSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}

