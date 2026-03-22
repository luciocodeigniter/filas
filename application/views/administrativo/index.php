<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrativo - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>
<body class="bg-light">
    <nav class="navbar navbar-dark bg-indigo text-white">
        <div class="container-fluid">
            <a href="index.html" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-cog"></i> Administrativo
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="card shadow">
            <div class="card-header bg-indigo text-white">
                <h5 class="mb-0"><i class="fas fa-cog"></i> Módulo Administrativo</h5>
            </div>
            <div class="card-body py-4">
                <div class="row g-3">
                    <div class="col-md-3">
                        <a href="<?php echo base_url('administrativo/municipios'); ?>" class="btn btn-outline-success btn-lg w-100 py-4">
                            <i class="fas fa-map-marker-alt fa-3x mb-2 d-block"></i>
                            Municípios
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="<?php echo base_url('administrativo/unidades'); ?>" class="btn btn-outline-secondary btn-lg w-100 py-4">
                            <i class="fas fa-building fa-3x mb-2 d-block"></i>
                            Unidades
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="salas.html" class="btn btn-outline-dark btn-lg w-100 py-4">
                            <i class="fas fa-door-open fa-3x mb-2 d-block"></i>
                            Salas
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="profissional.html" class="btn btn-outline-primary btn-lg w-100 py-4">
                            <i class="fas fa-user-tie fa-3x mb-2 d-block"></i>
                            Profissional
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="tipos_atendimentos.html" class="btn btn-outline-info btn-lg w-100 py-4">
                            <i class="fas fa-tasks fa-3x mb-2 d-block"></i>
                            Tipos de Atendimento
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="classificacoes.html" class="btn btn-outline-danger btn-lg w-100 py-4">
                            <i class="fas fa-heart-pulse fa-3x mb-2 d-block"></i>
                            Classificação de Risco
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="mensagens.html" class="btn btn-outline-info btn-lg w-100 py-4">
                            <i class="fas fa-bullhorn fa-3x mb-2 d-block"></i>
                            Mensagens
                        </a>
                    </div>
                    <div class="col-md-3">
                        <a href="alterar-senha.html" class="btn btn-outline-success btn-lg w-100 py-4">
                            <i class="fas fa-key fa-3x mb-2 d-block"></i>
                            Alterar senha
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
</body>
</html>
