<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recepção - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/') ?>assets/css/style.css">
</head>

<body class="bg-light">
    <nav class="navbar navbar-dark bg-primary">
        <div class="container-fluid">
            <a href="<?php echo site_url('/') ?>" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-user-plus"></i> Recepção
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <div class="col-md-6">

                <form id="formCadastroPaciente">
                    <!-- Card 1: Dados da pessoa -->
                    <div class="card shadow mb-3">
                        <div class="card-header bg-primary text-white">
                            <h5><i class="fas fa-check"></i> Dados da pessoa</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <label for="nomePaciente" class="form-label">Nome Completo *</label>
                                <input type="text" class="form-control form-control-lg" id="nomePaciente"
                                    placeholder="Digite o nome do paciente" required>
                            </div>

                            <div class="mb-3">
                                <label for="cpfPaciente" class="form-label">CPF</label>
                                <input type="text" class="form-control" id="cpfPaciente"
                                    placeholder="000.000.000-00" maxlength="14">
                            </div>

                            <div class="mb-3">
                                <label for="telefonePaciente" class="form-label">Telefone</label>
                                <input type="text" class="form-control" id="telefonePaciente"
                                    placeholder="(00) 00000-0000" maxlength="15">
                            </div>

                            <div class="mb-5">
                                <label for="tipoAtendimento" class="form-label fw-bold">Tipo de atendimento</label>
                                <select class="form-select" id="tipoAtendimento">
                                    <option value="">Selecione o tipo de atendimento</option>
                                    <!-- Opções carregadas via JavaScript -->
                                </select>
                            </div>

                            <div class="d-grid">
                                <button type="submit" class="btn btn-primary btn-lg" id="btnEncaminharTriagem">
                                    <i class="fas fa-arrow-right"></i> Encaminhar para triagem
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

            <!-- Últimos Chamados -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-success text-white">
                        <h5><i class="fas fa-list"></i> Últimos Chamados</h5>
                    </div>
                    <div class="card-body text-center" style="min-height: 200px; max-height: 400px; overflow-y: auto;">
                        <div id="listaChamadas">
                            <div class="ultimos-chamados-vazio py-5">
                                <i class="fas fa-tv fa-4x text-muted mb-3"></i>
                                <p class="text-muted mb-0">Nenhuma chamada recente</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Estatísticas -->
                <div class="card shadow mt-3">
                    <div class="card-header bg-info text-white">
                        <h6><i class="fas fa-chart-bar"></i> Estatísticas do Dia</h6>
                    </div>
                    <div class="card-body">
                        <div class="row text-center">
                            <div class="col-4">
                                <h3 class="text-primary" id="totalSenhas">0</h3>
                                <small>Total de Senhas</small>
                            </div>
                            <div class="col-4">
                                <h3 class="text-success" id="senhasAtendidas">0</h3>
                                <small>Atendidas</small>
                            </div>
                            <div class="col-4">
                                <h3 class="text-warning" id="senhasAguardando">0</h3>
                                <small>Aguardando</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de Senha Gerada -->
    <div class="modal fade" id="modalSenhaGerada" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-success text-white no-print">
                    <h5 class="modal-title"><i class="fas fa-check-circle"></i> Senha Gerada com Sucesso!</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center p-5">
                    <div class="modal-body text-center p-5">

                        <div id="areaImpressao">
                            <div class="senha-gerada-display mb-4">
                                <h1 class="display-1 fw-bold text-primary" id="senhaGeradaNumero">A001</h1>
                            </div>

                            <h4 id="senhaGeradaNome">Nome</h4>

                            <p class="lead mt-3">
                                <span class="badge fs-5" id="senhaGeradaClassificacao">URGENTE</span>
                            </p>

                            <p class="text-muted">Aguarde ser chamado no painel</p>
                        </div>

                    </div>
                </div>
                <div class="modal-footer no-print">
                    <button type="button" class="btn btn-primary" onclick="imprimirSenha()">
                        <i class="fas fa-print"></i> Imprimir
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script src="<?php echo base_url('public/') ?>assets/js/script.js"></script>
    <script src="<?php echo base_url('public/') ?>assets/js/recepcao.js"></script>
</body>

</html>