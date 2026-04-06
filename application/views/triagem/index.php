<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Triagem - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>

<body class="bg-light">
    <nav class="navbar navbar-dark bg-info">
        <div class="container-fluid">
            <a href="<?php echo site_url('/'); ?>" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-clipboard-list"></i> Triagem
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"><i class="fas fa-heart-pulse"></i> Classificação de Risco</h5>
                    </div>
                    <div class="card-body">
                        <form id="formClassificacaoRisco">

                            <div class="mb-4">
                                <label for="motivoPrincipal" class="form-label fw-bold text-danger">Motivo principal</label>
                                <textarea class="form-control" name="motivo_principal" id="motivoPrincipal" rows="4"
                                    placeholder="Descreva a queixa principal..." required></textarea>
                            </div>

                            <div class="mb-4">
                                <label class="form-label">Classificação de Risco *</label>
                                <div class="classificacao-risco" id="listaClassificacaoRisco">
                                    <!-- Opções carregadas via JavaScript -->
                                </div>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-info btn-lg">
                                    <i class="fas fa-check"></i> Confirmar e Enviar para atendimento
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <!-- Últimos Chamados -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-success text-white">
                        <h5><i class="fas fa-list"></i> Últimos Chamados</h5>
                    </div>
                    <div class="card-body text-center" style="min-height: 200px; max-height: 600px; overflow-y: auto;">
                        <div id="listaChamadas">
                            <div class="ultimos-chamados-vazio py-5">
                                <i class="fas fa-tv fa-4x text-muted mb-3"></i>
                                <p class="text-muted mb-0">Nenhuma chamada recente</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/triagem.js"></script>
</body>

</html>