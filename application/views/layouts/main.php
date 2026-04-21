<?php
defined('BASEPATH') or exit('No direct script access allowed');
?>
<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'Sistema de Senhas' ?></title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>

<body class="bg-light">
    <nav class="navbar navbar-dark bg-primary">
        <div class="container-fluid">
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-hospital"></i> Sistema de Painel de Senhas
            </span>
            <div class="d-flex gap-2">
                <a href="alterar-senha.html" class="btn btn-outline-light btn-sm">
                    <i class="fas fa-key"></i> Alterar senha
                </a>
                <a href="<?php echo base_url('logout'); ?>" class="btn btn-outline-light btn-sm" onclick="sessionStorage.removeItem('filasWeb_logado'); sessionStorage.removeItem('filasWeb_usuario'); sessionStorage.removeItem('filasWeb_login'); sessionStorage.removeItem('filasWeb_profissional_id');">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </a>
            </div>
        </div>
    </nav>

    <?php echo $content; ?>

    <footer class="text-center mt-5 mb-3 text-muted">
        <p>&copy; <?php echo date('Y'); ?> Sistema de Painel de Senhas - Todos os direitos reservados</p>
    </footer>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>

    <script src="https://js.pusher.com/8.4.0/pusher.min.js"></script>

</body>

</html>