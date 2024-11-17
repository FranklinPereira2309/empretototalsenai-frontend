const token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    const identificacao = localStorage.getItem('identificacao');

    if (!token) {
        return window.location.href = '/html/acesso-negado.html';
    }

    if (Number(identificacao.length) === 14) {

        nome ? titulo.textContent = `Dashboard - ${nome}` : 'Dashboard';
    } else {
        return window.location.href = '/html/acesso-negado-usuario.html';
    }

})

document.querySelector('#jobForm').addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();


    const titulo = document.querySelector('#titulo').value;
    const descricao = document.querySelector('#descricao').value;
    const habilidades = document.querySelector('#habilidades').value;
    const formacao = document.querySelector('#formacao').value;
    const localizacao = document.querySelector('#localizacao').value;
    const modalidade = document.querySelector('#modalidade').value;
    const salario = document.querySelector('#salario').value;
    const nome_empresa = document.querySelector('#nome_empresa').value;
    const setor_atuacao = document.querySelector('#setor_atuacao').value;
    const email = document.querySelector('#email').value;
    const cargo = document.querySelector('#cargo').value;
    const tipo_contrato = document.querySelector('#tipo_contrato').value;
    const horario = document.querySelector('#horario').value;
    const pcd = document.querySelector('#pcd').value;
    let _modalidade, _tipo, _pcd;
    


    if (
        !titulo ||
        !descricao ||
        !habilidades ||
        !formacao ||
        !localizacao ||
        !modalidade ||
        !nome_empresa ||
        !setor_atuacao ||
        !email ||
        !cargo ||
        !tipo_contrato ||
        !horario ||
        !pcd
    ) {
        return window.alert('Favor preencher os campos necessários!');
    } else {
        _modalidade = modalidade;
        _tipo = tipo_contrato;
        _pcd = pcd === 'sim'? true : false;
       
    }

       
    const idEmpresa = localStorage.getItem('id');
    

    const vaga = {
        titulo,
        descricao,
        habilidades,
        formacao,
        localizacao,
        modalidade: _modalidade,
        salario,
        nome_empresa,
        setor_atuacao,
        email,
        cargo,
        tipo_contrato: _tipo,
        horario,
        pcd: _pcd,
        empresa_id: idEmpresa
    }

    if (token) {
        const url = `http://localhost:3003/vagas`;


        fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(vaga)

        })
            .then(response => response.json())
            .then(data => {
                const mensagemErro = data.erro;
                const mensagem = data.mensagem;

                if (mensagemErro) {
                    return window.alert(mensagemErro);
                }
                if (mensagem) {
                    return window.alert(mensagem);
                }

                if (window.confirm('Gostaria de Cadastrar uma nova Vaga?')) {

                    return window.location.href = window.location.href;

                } else {
                    return window.location.href = '/html/dashboard-empresa.html';
                }



            })
            .catch(error => {
                console.log(error);
            })

    }
})

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