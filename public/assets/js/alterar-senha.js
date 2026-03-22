/**
 * ============================================
 * ALTERAR SENHA - Filas Web
 * Tela para alteração de senha do usuário logado
 * ============================================
 */

const CREDENCIAIS_PADRAO = {
    usuario: 'admin',
    senha: 'admin123'
};

$(document).ready(function() {
    // Toggle mostrar/ocultar senha
    $('.btn-toggle-pwd').on('click', function() {
        const btn = $(this);
        const targetId = btn.data('target');
        const input = $('#' + targetId);
        const icon = btn.find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
        }
    });

    $('#formAlterarSenha').on('submit', function(e) {
        e.preventDefault();

        const senhaAtual = $('#senhaAtual').val();
        const novaSenha = $('#novaSenha').val();
        const confirmarSenha = $('#confirmarSenha').val();

        // Limpar validações anteriores
        $('.form-control').removeClass('is-invalid');
        let valido = true;

        // Validar senha atual
        if (!senhaAtual || senhaAtual.trim() === '') {
            $('#senhaAtual').addClass('is-invalid');
            valido = false;
        }

        // Validar nova senha (mín. 6 caracteres)
        if (!novaSenha || novaSenha.length < 6) {
            $('#novaSenha').addClass('is-invalid');
            $('#novaSenha').siblings('.invalid-feedback').text('Digite no mínimo 6 caracteres.');
            valido = false;
        }

        // Validar confirmação
        if (novaSenha !== confirmarSenha) {
            $('#confirmarSenha').addClass('is-invalid');
            $('#confirmarSenha').siblings('.invalid-feedback').text('As senhas não coincidem.');
            valido = false;
        }

        if (!valido) return;

        // Verificar senha atual e alterar
        const login = sessionStorage.getItem('filasWeb_login');
        const profissionalId = sessionStorage.getItem('filasWeb_profissional_id');

        if (login === 'admin') {
            const senhaAdminAtual = localStorage.getItem('admin_senha') || CREDENCIAIS_PADRAO.senha;
            if (senhaAtual !== senhaAdminAtual) {
                $('#senhaAtual').addClass('is-invalid');
                $('#senhaAtual').siblings('.invalid-feedback').text('Senha atual incorreta.');
                return;
            }
            localStorage.setItem('admin_senha', novaSenha);
            if (typeof exibirNotificacao === 'function') {
                exibirNotificacao('Senha alterada com sucesso!', 'success');
            } else {
                alert('Senha alterada com sucesso!');
            }
        } else {
            const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
            const usuarioNome = sessionStorage.getItem('filasWeb_usuario');
            let profissional = profissionalId 
                ? profissionais.find(p => p.id == profissionalId)
                : profissionais.find(p => p.nome === usuarioNome || p.email === login);
            if (!profissional) {
                alert('Usuário não encontrado. Faça login novamente.');
                window.location.href = 'login.html';
                return;
            }
            if (profissional.senha !== senhaAtual) {
                $('#senhaAtual').addClass('is-invalid');
                $('#senhaAtual').siblings('.invalid-feedback').text('Senha atual incorreta.');
                return;
            }
            profissional.senha = novaSenha;
            localStorage.setItem('profissionais', JSON.stringify(profissionais));
            if (typeof exibirNotificacao === 'function') {
                exibirNotificacao('Senha alterada com sucesso!', 'success');
            } else {
                alert('Senha alterada com sucesso!');
            }
        }

        $('#formAlterarSenha')[0].reset();
        $('.form-control').removeClass('is-invalid');
        setTimeout(() => window.location.href = 'index.html', 1500);
    });
});
