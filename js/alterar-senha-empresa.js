const modal = document.querySelector('.container-modal');
const closeModalButton = document.querySelector('#closeModal');
const span = document.querySelector('#erroSenhaAtualizar');

document.addEventListener('DOMContentLoaded', () => {
    
    const token = localStorage.getItem('token');

    if (!token) {
        return window.location.href = '/html/acesso-negado.html';

    }    

});

closeModalButton.addEventListener('click', ()=> {
    modal.style.display = 'none'
    deslogarImediatamente();

})

modal.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target === modal) {
        modal.style.display = 'none';
        deslogarImediatamente();
    }
    
});

function mudarVisibilidadeSenhaAtual() {
    let olho = document.querySelector('.olho1');
    let inputSenhaAtual = document.querySelector('#senhaAtual');
    inputSenhaAtual.type = inputSenhaAtual.type === 'password' ? 'text' : 'password';
    olho.src = inputSenhaAtual.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}
function mudarVisibilidadeNovaSenha() {
    let olho = document.querySelector('.olho2');
    let inputNovaSenha = document.querySelector('#novaSenha');
    inputNovaSenha.type = inputNovaSenha.type === 'password' ? 'text' : 'password';
    olho.src = inputNovaSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}
function mudarVisibilidadeReNovaSenha() {
    let olho = document.querySelector('.olho3');
    let inputReNovaSenha = document.querySelector('#re-novaSenha');
    inputReNovaSenha.type = inputReNovaSenha.type === 'password' ? 'text' : 'password';
    olho.src = inputReNovaSenha.type === 'text' ? '../assets/olho-aberto.svg' : '../assets/olho-fechado.svg'
}

function corrigirInputs() {
    span.style.display = 'none';
    document.querySelector('#novaSenha').style.border = 'none';
    document.querySelector('#re-novaSenha').style.border = 'none'
}

function alterarNovaSenha() {
    const senhaAtual = document.querySelector('#senhaAtual').value;
    const novaSenha = document.querySelector('#novaSenha').value;
    const reNovaSenha = document.querySelector('#re-novaSenha').value;

    const token = localStorage.getItem('token');
    const url = 'https://empregototal.onrender.com/empresa_alterar_senha';

    if (!senhaAtual || !novaSenha || !reNovaSenha) {
        return window.alert('Prencha todos os dados!');
    }

    if (novaSenha !== reNovaSenha) {
        document.querySelector('#novaSenha').style.border = '1px solid red';
        document.querySelector('#re-novaSenha').style.border = '1px solid red'

        return span.style.display = 'block'
    }

    const senhas = {
        senhaAtual,
        novaSenha
    }

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(senhas)
    })
        .then(response => {
            if (response.status === 201) {
                // window.alert('Senha Alterada com Sucesso!');
                modal.style.display = 'block';
            }
            return response.json();
        })
        .then(data => {
            const mensagem = data.mensagem;
            const erro = data.erro;
            
            if (erro) {
                return window.alert(erro);
            }
            if (mensagem) {
                return window.alert(mensagem);
            }
            
            document.querySelector('#senhaAtual').value = '';
            document.querySelector('#novaSenha').value = '';
            document.querySelector('#re-novaSenha').value = '';
            
            
        })
        .catch(erro => {
            console.log(erro);

        })


}

function mostrarMenu() {
    const btnMenu = document.querySelector('.botao-menu');
    const menu = document.querySelector('#menu');
    const menuUsuario = document.getElementById('menu-usuario');

    

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

function deslogarImediatamente() {
    
    localStorage.clear();

    return window.location.href = '/index.html';

}

function closeModal() {
    modal.style.display = 'none';   
    deslogarImediatamente();       
}

