<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mensagens - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>
<body class="bg-light">
    <nav class="navbar navbar-dark bg-info">
        <div class="container-fluid">
            <a href="<?php echo site_url('administrativo'); ?>" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-bullhorn"></i> Mensagens
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="alert alert-info">
            <i class="fas fa-info-circle"></i> Estas mensagens aparecem no rodapé do <strong>Painel de Chamadas</strong>, em rotação automática.
        </div>
        <div class="row">
            <!-- Formulário -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-bullhorn"></i> Cadastro de Mensagem</h5>
                    </div>
                    <div class="card-body">
                        <form id="formMensagem">
                            <input type="hidden" id="mensagemId" value="">
                            
                            <div class="mb-3">
                                <label for="tituloMensagem" class="form-label">Título (identificação)</label>
                                <input type="text" class="form-control" id="tituloMensagem" 
                                       placeholder="Ex: Aviso de segurança">
                            </div>

                            <div class="mb-3">
                                <label for="conteudoMensagem" class="form-label">Conteúdo da mensagem *</label>
                                <textarea class="form-control" id="conteudoMensagem" rows="3" 
                                          placeholder="Texto que será exibido no painel de chamadas" required></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="ordemMensagem" class="form-label">Ordem de exibição</label>
                                <input type="number" class="form-control" id="ordemMensagem" 
                                       min="0" value="0">
                                <small class="text-muted">Menor número = exibido primeiro</small>
                            </div>

                            <div class="mb-4">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="ativoMensagem" checked>
                                    <label class="form-check-label" for="ativoMensagem">Ativo</label>
                                </div>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-info btn-lg">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                                <button type="button" class="btn btn-outline-secondary" id="btnCancelarEdicao" style="display: none;">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                                <button type="reset" class="btn btn-outline-info">
                                    <i class="fas fa-eraser"></i> Limpar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Lista de Mensagens -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-info text-white">
                        <h5 class="mb-0"><i class="fas fa-list"></i> Mensagens Cadastradas</h5>
                    </div>
                    <div class="card-body" style="max-height: 550px; overflow-y: auto;">
                        <div id="listaMensagens">
                            <!-- Mensagens serão inseridas aqui via JavaScript -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Confirmar Exclusão -->
    <div class="modal fade" id="modalExcluir" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title"><i class="fas fa-trash-alt"></i> Confirmar Exclusão</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>Deseja realmente excluir esta mensagem?</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" id="btnConfirmarExcluir">
                        <i class="fas fa-trash-alt"></i> Excluir
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="<?php echo base_url('public/') ?>assets/js/script.js"></script>
    <script src="<?php echo base_url('public/') ?>assets/js/mensagens.js"></script>
</body>
</html>
