<!DOCTYPE html>
<html lang="pt-BR">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Unidades - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>

<body class="bg-light">
    <nav class="navbar navbar-dark bg-secondary">
        <div class="container-fluid">
            <a href="<?php echo site_url('administrativo'); ?>" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-building"></i> Unidades
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <!-- Formulário -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"><i class="fas fa-building"></i> Cadastro de Unidade</h5>
                    </div>
                    <div class="card-body">
                        <form id="formUnidade">

                            <input type="hidden" id="unidadeId">

                            <div class="mb-3">
                                <label for="nomeUnidade" class="form-label">Nome da unidade *</label>
                                <input type="text" class="form-control" id="nomeUnidade"
                                    placeholder="Digite o nome da unidade" required>
                            </div>

                            <div class="mb-3">
                                <label for="municipioUnidade" class="form-label">Município</label>
                                <select class="form-select" required id="municipioUnidade">
                                    <option value="">Selecione o município ativo</option>
                                    <!-- Opções carregadas via JavaScript -->
                                </select>
                                <small class="text-muted d-block">Unidade vinculada ao município</small>
                                <small id="msgSemMunicipios" class="text-muted" style="display: none;">
                                    Nenhum município cadastrado. <a href="<?php echo site_url('administrativo/municipios'); ?>">Cadastrar municípios</a>
                                </small>
                            </div>

                            <div class="mb-3">
                                <label for="telefoneUnidade" class="form-label">Telefone</label>
                                <input type="text" class="form-control" id="telefoneUnidade"
                                    placeholder="(00) 00000-0000" maxlength="15">
                            </div>

                            <div class="mb-3">
                                <label for="emailUnidade" class="form-label">Email</label>
                                <input type="email" class="form-control" id="emailUnidade"
                                    placeholder="email@exemplo.com">
                            </div>

                            <div class="mb-4">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="ativoUnidade" checked>
                                    <label class="form-check-label" for="ativoUnidade">Ativo</label>
                                </div>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-secondary btn-lg">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                                <button type="button" class="btn btn-outline-secondary" id="btnCancelarEdicao" style="display: none;">
                                    <i class="fas fa-times"></i> Cancelar
                                </button>
                                <button type="reset" class="btn btn-outline-secondary">
                                    <i class="fas fa-eraser"></i> Limpar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Lista de Unidades -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-secondary text-white">
                        <h5 class="mb-0"><i class="fas fa-list"></i> Unidades Cadastradas</h5>
                    </div>
                    <div class="card-body" style="max-height: 500px; overflow-y: auto;">
                        <div id="listaUnidades">
                            <!-- Unidades serão inseridas aqui via JavaScript -->
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
                    <p>Deseja realmente excluir o registro <strong id="modalExcluirNome"></strong>?</p>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/unidades.js"></script>
</body>

</html>