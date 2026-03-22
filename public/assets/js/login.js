/**
 * ============================================
 * LOGIN - Filas Web
 * Autenticação do sistema
 * ============================================
 */

// Credenciais padrão do sistema
const CREDENCIAIS_PADRAO = {
    usuario: 'admin',
    senha: 'admin123'
};

// Verificar se usuário está logado
function isLogado() {
    return sessionStorage.getItem('filasWeb_logado') === 'true';
}

// Fazer login
function fazerLogin(usuario, senha) {
    // Verifica credenciais padrão (admin)
    if (usuario === CREDENCIAIS_PADRAO.usuario) {
        const senhaAdmin = localStorage.getItem('admin_senha') || CREDENCIAIS_PADRAO.senha;
        if (senha === senhaAdmin) {
            sessionStorage.setItem('filasWeb_logado', 'true');
            sessionStorage.setItem('filasWeb_usuario', usuario);
            sessionStorage.setItem('filasWeb_login', 'admin');
            return true;
        }
    }
    
    // Verifica profissionais cadastrados
    try {
        const profissionais = JSON.parse(localStorage.getItem('profissionais') || '[]');
        const profissional = profissionais.find(p => 
            (p.email === usuario || p.nome.toLowerCase() === usuario.toLowerCase()) && 
            p.senha === senha && 
            p.ativo
        );
        
        if (profissional) {
            sessionStorage.setItem('filasWeb_logado', 'true');
            sessionStorage.setItem('filasWeb_usuario', profissional.nome);
            sessionStorage.setItem('filasWeb_login', usuario);
            sessionStorage.setItem('filasWeb_profissional_id', profissional.id);
            return true;
        }
    } catch (e) {
        console.error('Erro ao verificar profissionais:', e);
    }
    
    return false;
}

// Fazer logout
function logout() {
    sessionStorage.removeItem('filasWeb_logado');
    sessionStorage.removeItem('filasWeb_usuario');
}

$(document).ready(function() {
    // Toggle mostrar/ocultar senha
    $('.btn-toggle-password').on('click', function() {
        const btn = $(this);
        const input = btn.siblings('#senha');
        const icon = btn.find('i');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
            icon.removeClass('fa-eye').addClass('fa-eye-slash');
            btn.attr('aria-label', 'Ocultar senha').attr('title', 'Ocultar senha');
        } else {
            input.attr('type', 'password');
            icon.removeClass('fa-eye-slash').addClass('fa-eye');
            btn.attr('aria-label', 'Mostrar senha').attr('title', 'Mostrar senha');
        }
    });

    $('#formLogin').submit(function(e) {
        e.preventDefault();
        
        const usuario = $('#usuario').val().trim();
        const senha = $('#senha').val();
        
        if (!usuario || !senha) {
            alert('Por favor, preencha usuário e senha.');
            return;
        }
        
        if (fazerLogin(usuario, senha)) {
            window.location.href = 'index.html';
        } else {
            alert('Usuário ou senha incorretos. Tente novamente.');
        }
    });

    // Recuperar Senha
    $('#formRecuperarSenha').submit(function(e) {
        e.preventDefault();
        const email = $('#emailRecuperar').val().trim();
        if (!email) {
            alert('Por favor, informe seu e-mail.');
            return;
        }
        // Simulação: sistema sem backend de e-mail - exibe mensagem informativa
        alert('Em um ambiente com servidor configurado, um link de recuperação seria enviado para: ' + email + '\n\nPor enquanto, entre em contato com o administrador do sistema.');
        var modalEl = document.getElementById('modalRecuperarSenha');
        if (modalEl && typeof bootstrap !== 'undefined') {
            var modal = bootstrap.Modal.getInstance(modalEl);
            if (modal) modal.hide();
        }
        $('#formRecuperarSenha')[0].reset();
    });
});
