<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profissional - Sistema de Senhas</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo base_url('public/'); ?>assets/css/style.css">
</head>
<body class="bg-light">
    <nav class="navbar navbar-dark bg-primary">
        <div class="container-fluid">
            <a href="<?php echo site_url('administrativo'); ?>" class="navbar-brand">
                <i class="fas fa-arrow-left"></i> Voltar
            </a>
            <span class="navbar-brand mb-0 h1">
                <i class="fas fa-user-tie"></i> Profissional
            </span>
            <span class="navbar-text text-white" id="relogio"></span>
        </div>
    </nav>

    <div class="container mt-4">
        <div class="row">
            <!-- Formulário -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fas fa-user-tie"></i> Cadastro de Profissional</h5>
                    </div>
                    <div class="card-body">
                        <form id="formProfissional">
                            <div class="mb-3">
                                <label for="nomeProfissional" class="form-label">Nome do profissional *</label>
                                <input type="text" class="form-control" id="nomeProfissional" 
                                       placeholder="Digite o nome do profissional" required>
                            </div>
                            <div class="mb-3">
                                <label for="sobrenomeProfissional" class="form-label">Sobrenome do profissional *</label>
                                <input type="text" class="form-control" id="sobrenomeProfissional" 
                                       placeholder="Digite o sobrenome do profissional" required>
                            </div>

                            <div class="mb-3">
                                <label for="telefoneProfissional" class="form-label">Telefone</label>
                                <input type="text" class="form-control" id="telefoneProfissional" 
                                       placeholder="(00) 00000-0000" maxlength="15">
                            </div>

                            <div class="mb-3">
                                <label for="emailProfissional" class="form-label">Email de acesso</label>
                                <input type="email" class="form-control" id="emailProfissional" 
                                       placeholder="email@exemplo.com">
                            </div>

                            <div class="mb-3">
                                <label for="senhaProfissional" class="form-label">Senha *</label>
                                <input type="password" class="form-control" id="senhaProfissional" 
                                       placeholder="Digite a senha" required minlength="4">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Associações *</label>
                                <ul class="nav nav-tabs" id="associacoesTab" role="tablist">
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link active" id="unidades-tab" data-bs-toggle="tab" data-bs-target="#unidades-panel" type="button" role="tab">
                                            <i class="fas fa-building"></i> Unidades
                                        </button>
                                    </li>
                                    <li class="nav-item" role="presentation">
                                        <button class="nav-link" id="atendimentos-tab" data-bs-toggle="tab" data-bs-target="#atendimentos-panel" type="button" role="tab">
                                            <i class="fas fa-tasks"></i> Tipos de Atendimento
                                        </button>
                                    </li>
                                </ul>
                                <div class="tab-content border border-top-0 rounded-bottom p-3 bg-light" style="max-height: 180px; overflow-y: auto;">
                                    <div class="tab-pane fade show active" id="unidades-panel" role="tabpanel">
                                        <div id="listaUnidadesCheckbox">
                                            <small class="text-muted">Nenhuma unidade cadastrada. <a href="unidades.html">Cadastrar unidades</a></small>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="atendimentos-panel" role="tabpanel">
                                        <div id="listaTiposAtendimentoCheckbox">
                                            <small class="text-muted">Nenhum tipo cadastrado. <a href="tipos_atendimentos.html">Cadastrar tipos</a></small>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-4">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="ativoProfissional" checked>
                                    <label class="form-check-label" for="ativoProfissional">Ativo</label>
                                </div>
                            </div>

                            <div class="d-grid gap-2">
                                <button type="submit" class="btn btn-primary btn-lg">
                                    <i class="fas fa-save"></i> Salvar
                                </button>
                                <button type="reset" class="btn btn-outline-primary">
                                    <i class="fas fa-eraser"></i> Limpar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Lista de Profissionais -->
            <div class="col-md-6">
                <div class="card shadow">
                    <div class="card-header bg-primary text-white">
                        <h5 class="mb-0"><i class="fas fa-list"></i> Profissionais Cadastrados</h5>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive" style="max-height: 500px; overflow-y: auto;">
                            <table class="table table-hover mb-0">
                                <thead class="table-light sticky-top">
                                    <tr>
                                        <th>Nome</th>
                                        <th>Perfil</th>
                                        <th>Unidades</th>
                                        <th>Atendimentos</th>
                                        <th>Contato</th>
                                        <th width="80">Ativo</th>
                                        <th width="100">Ações</th>
                                    </tr>
                                </thead>
                                <tbody id="listaProfissionais">
                                    <!-- Profissionais serão inseridos aqui via JavaScript -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Associar Unidades e Atendimentos -->
    <div class="modal fade" id="modalAssociarUnidades" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title"><i class="fas fa-link"></i> Associar Unidades e Tipos de Atendimento</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-3"><strong id="modalProfissionalNome"></strong></p>
                    <ul class="nav nav-tabs" id="modalAssociacoesTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="modal-unidades-tab" data-bs-toggle="tab" data-bs-target="#modal-unidades-panel" type="button" role="tab">
                                <i class="fas fa-building"></i> Unidades
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="modal-atendimentos-tab" data-bs-toggle="tab" data-bs-target="#modal-atendimentos-panel" type="button" role="tab">
                                <i class="fas fa-tasks"></i> Tipos de Atendimento
                            </button>
                        </li>
                    </ul>
                    <div class="tab-content border border-top-0 rounded-bottom p-3 mt-2">
                        <div class="tab-pane fade show active" id="modal-unidades-panel" role="tabpanel">
                            <label class="form-label">Selecione uma ou mais unidades:</label>
                            <div id="modalUnidadesCheckbox" class="border rounded p-3 bg-light" style="max-height: 200px; overflow-y: auto;">
                            </div>
                        </div>
                        <div class="tab-pane fade" id="modal-atendimentos-panel" role="tabpanel">
                            <label class="form-label">Selecione um ou mais tipos de atendimento:</label>
                            <div id="modalTiposAtendimentoCheckbox" class="border rounded p-3 bg-light" style="max-height: 200px; overflow-y: auto;">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnSalvarAssociacoes">
                        <i class="fas fa-save"></i> Salvar
                    </button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.7.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.mask/1.14.16/jquery.mask.min.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/script.js"></script>
    <script src="<?php echo base_url('public/'); ?>assets/js/profissional.js"></script>
</body>
</html>
