<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Filas Web</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --login-primary: #1d4ed8;
            --login-primary-dark: #1e40af;
            --login-bg: linear-gradient(135deg, #dbeafe 0%, #93c5fd 50%, #60a5fa 100%);
            --login-panel: linear-gradient(180deg, #2563eb 0%, #1d4ed8 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            background: var(--login-bg);
            background-attachment: fixed;
            padding: 20px;
            position: relative;
            overflow-x: hidden;
        }

        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image:
                radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(37, 99, 235, 0.2) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(29, 78, 216, 0.1) 0%, transparent 40%);
            pointer-events: none;
            z-index: 0;
        }

        body::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231d4ed8' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            opacity: 0.6;
            pointer-events: none;
            z-index: 0;
        }

        body>.login-wrapper {
            position: relative;
            z-index: 1;
        }

        .login-wrapper {
            width: 100%;
            max-width: 900px;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            display: flex;
            min-height: 520px;
        }

        .login-panel-info {
            flex: 1;
            background: var(--login-panel);
            padding: 3rem 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            overflow: hidden;
        }

        .login-panel-info .logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2.5rem;
            color: white;
        }

        .login-panel-info h1 {
            color: white;
            font-size: 1.75rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            letter-spacing: 0.5px;
        }

        .login-panel-info .subtitulo {
            color: rgba(255, 255, 255, 0.95);
            font-size: 1rem;
            margin-bottom: 1.5rem;
        }

        .login-panel-info .descricao {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.9rem;
            line-height: 1.6;
            margin-bottom: 2rem;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
            overflow: hidden;
            overflow-wrap: break-word;
        }

        .login-features {
            list-style: none;
            text-align: left;
            max-width: 280px;
            margin: 0 auto;
        }

        .login-features li {
            color: white;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .login-features li i {
            width: 28px;
            height: 28px;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .login-panel-form {
            flex: 1;
            padding: 3rem 2.5rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        .login-panel-form h2 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 0.35rem;
        }

        .login-panel-form .instrucao {
            color: #64748b;
            font-size: 0.95rem;
            margin-bottom: 2rem;
        }

        .form-floating {
            margin-bottom: 1.25rem;
        }

        .form-floating .form-control {
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            padding: 1rem 1rem 1rem 3rem;
            min-height: 56px;
            font-size: 1rem;
        }

        .form-floating .form-control:focus {
            border-color: var(--login-primary);
            box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.25);
        }

        .form-floating label {
            padding-left: 2.75rem;
            color: #64748b;
        }

        .input-icon {
            position: relative;
        }

        .input-icon .input-icon-left {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 1rem;
            z-index: 5;
            pointer-events: none;
        }

        .input-icon .form-control {
            padding-left: 2.75rem;
        }

        .input-icon-password .form-control {
            padding-right: 3rem;
        }

        .input-icon-password .btn-toggle-password {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #94a3b8;
            cursor: pointer;
            padding: 0.5rem;
            z-index: 5;
            transition: color 0.2s;
        }

        .input-icon-password .btn-toggle-password:hover {
            color: var(--login-primary);
        }

        .login-options {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }

        .form-check-input:checked {
            background-color: var(--login-primary);
            border-color: var(--login-primary);
        }

        .link-recuperar {
            color: var(--login-primary);
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 500;
        }

        .link-recuperar:hover {
            color: var(--login-primary-dark);
        }

        .btn-login {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--login-primary) 0%, var(--login-primary-dark) 100%);
            border: none;
            color: white;
            transition: all 0.3s ease;
        }

        .btn-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(29, 78, 216, 0.5);
            color: white;
        }

        .login-copyright {
            text-align: center;
            margin-top: 2rem;
            color: #94a3b8;
            font-size: 0.8rem;
        }

        @media (max-width: 768px) {
            .login-wrapper {
                flex-direction: column;
            }

            .login-panel-info {
                padding: 2rem 1.5rem;
            }

            .login-panel-info .descricao,
            .login-features {
                display: none;
            }
        }

        /* Modal Recuperar Senha */
        #modalRecuperarSenha .modal-header {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%) !important;
            border-radius: 0.375rem 0.375rem 0 0;
        }

        #modalRecuperarSenha .modal-content {
            border-radius: 16px;
            overflow: hidden;
            border: none;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        #modalRecuperarSenha .modal-body {
            padding: 2rem;
            text-align: center;
        }

        #modalRecuperarSenha .recuperar-icon {
            width: 80px;
            height: 80px;
            background: rgba(37, 99, 235, 0.1);
            border: 2px solid rgba(37, 99, 235, 0.3);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            font-size: 2rem;
            color: var(--login-primary);
        }

        #modalRecuperarSenha .recuperar-texto {
            color: #64748b;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1.5rem;
            max-width: 360px;
            margin-left: auto;
            margin-right: auto;
        }

        #modalRecuperarSenha .form-floating {
            text-align: left;
            margin-bottom: 1.5rem;
        }

        #modalRecuperarSenha .form-floating .form-control {
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            padding-left: 2.75rem;
        }

        #modalRecuperarSenha .form-floating .form-control:focus {
            border-color: var(--login-primary);
            box-shadow: 0 0 0 3px rgba(29, 78, 216, 0.2);
        }

        #modalRecuperarSenha .input-icon-modal {
            position: relative;
        }

        #modalRecuperarSenha .input-icon-modal i {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 1rem;
            z-index: 5;
        }

        #modalRecuperarSenha .btn-enviar-link {
            width: 100%;
            padding: 1rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--login-primary) 0%, var(--login-primary-dark) 100%);
            border: none;
            color: white;
            transition: all 0.3s ease;
        }

        #modalRecuperarSenha .btn-enviar-link:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -5px rgba(29, 78, 216, 0.5);
            color: white;
        }
    </style>
</head>

<body>
    <div class="login-wrapper">
        <!-- Painel Informacional -->
        <div class="login-panel-info">
            <div class="logo">
                <i class="fas fa-clipboard-list"></i>
            </div>
            <h1>Filas Web</h1>
            <p class="subtitulo">Sistema de Gestão de Filas</p>
            <p class="descricao">
                Sistema para controle de recepção, triagem e atendimento com painel de chamadas em tempo real.
            </p>
            <ul class="login-features">
                <li><i class="fas fa-lock"></i> Acesso seguro e protegido</li>
                <li><i class="fas fa-users"></i> Controle de recepção e triagem</li>
                <li><i class="fas fa-cogs"></i> Gestão de filas por prioridade</li>
                <li><i class="fas fa-chart-line"></i> Painel de chamadas em tempo real</li>
            </ul>
        </div>

        <!-- Painel do Formulário -->
        <div class="login-panel-form">
            <h2>Bem-vindo de volta!</h2>
            <p class="instrucao">Faça login para acessar o sistema</p>

            <?php if (!empty($message)): ?>
                <div id="infoMessage" class="alert alert-danger">
                    <?= $message; ?>
                </div>
            <?php endif; ?>

            <?php echo form_open("auth/login"); ?>
            <div class="form-floating input-icon">
                <i class="fas fa-user input-icon-left"></i>
                <input type="email" class="form-control" name="identity" id="identity"
                    placeholder="E-mail" required autocomplete="email">
                <label for="identity">E-mail válido</label>
            </div>

            <div class="form-floating input-icon input-icon-password">
                <i class="fas fa-lock input-icon-left"></i>
                <input type="password" class="form-control" name="password" id="password"
                    placeholder="Digite sua senha" required autocomplete="current-password">
                <label for="password">Senha</label>
                <button type="button" class="btn-toggle-password" aria-label="Mostrar senha" title="Mostrar senha">
                    <i class="fas fa-eye"></i>
                </button>
            </div>

            <div class="login-options">
                <div class="form-check">
                    <input class="form-check-input" value="1" type="checkbox" id="remember">
                    <label class="form-check-label" for="remember">Lembrar-me</label>
                </div>
                <a href="#" class="link-recuperar" data-bs-toggle="modal" data-bs-target="#modalRecuperarSenha">
                    Esqueci a senha
                </a>
            </div>

            <button type="submit" class="btn btn-login">
                Entrar no Sistema <i class="fas fa-arrow-right ms-2"></i>
            </button>
            </form>

            <p class="login-copyright">© 2026 Filas Web - Sistema de Gestão de Filas</p>
        </div>
    </div>

    <!-- Modal Recuperar Senha -->
    <div class="modal fade" id="modalRecuperarSenha" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header text-white">
                    <h5 class="modal-title"><i class="fas fa-key me-2"></i>Recuperar Senha</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <div class="recuperar-icon">
                        <i class="fas fa-envelope-open-text"></i>
                    </div>
                    <p class="recuperar-texto">
                        Informe seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
                    </p>
                    <form id="formRecuperarSenha">
                        <div class="form-floating input-icon-modal">
                            <i class="fas fa-envelope"></i>
                            <input type="email" class="form-control" id="emailRecuperar"
                                placeholder="seu@email.com" required autocomplete="email">
                            <label for="emailRecuperar">E-mail cadastrado</label>
                        </div>
                        <button type="submit" class="btn btn-enviar-link">
                            <i class="fas fa-paper-plane me-2"></i>Enviar Link de Recuperação
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        $('.btn-toggle-password').on('click', function() {
            const btn = $(this);
            const input = btn.siblings('#password');
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
    </script>
</body>

</html>