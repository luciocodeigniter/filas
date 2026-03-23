/**
 * ============================================
 * TIPOS DE ATENDIMENTO - JavaScript (API + CRUD)
 * ============================================
 */

const API_TIPOS = '/api/tipos';

let tiposAtendimento = [];
let tipoEmEdicao = null;
let tipoParaExcluir = null;

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {
    carregarListaTiposAtendimento();

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!tipoParaExcluir) return;

        try {
            await apiRequest(`${API_TIPOS}/delete/${tipoParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Tipo excluído com sucesso!', 'success');

            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            tipoParaExcluir = null;
            carregarListaTiposAtendimento();

        } catch (e) {}
    });
});

/**
 * =========================
 * FORM
 * =========================
 */
$('#formTipoAtendimento').on('reset', function () {
    setTimeout(() => {
        tipoEmEdicao = null;
        $('#btnCancelarEdicao').hide();
        $('#tipoId').val('');
    }, 0);
});

$('#formTipoAtendimento').submit(async function (e) {
    e.preventDefault();

    const id = $('#tipoId').val();
    const nome = $('#nomeTipoAtendimento').val().trim();
    const ativo = $('#ativoTipoAtendimento').is(':checked');

    if (!nome) {
        exibirNotificacao('Por favor, digite o nome do atendimento!', 'warning');
        return;
    }

    const payload = {
        nome,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_TIPOS}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Tipo atualizado com sucesso!', 'success');
        } else {
            await apiRequest(`${API_TIPOS}/create`, 'POST', payload);
            exibirNotificacao('Tipo cadastrado com sucesso!', 'success');
        }

        $('#formTipoAtendimento')[0].reset();
        $('#ativoTipoAtendimento').prop('checked', true);

        tipoEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaTiposAtendimento();

    } catch (e) {}
});

/**
 * =========================
 * AÇÕES
 * =========================
 */

function editarTipo(id) {
    const tipo = tiposAtendimento.find(t => t.id == id);
    if (!tipo) return;

    tipoEmEdicao = tipo;

    $('#tipoId').val(tipo.id);
    $('#nomeTipoAtendimento').val(tipo.nome);
    $('#ativoTipoAtendimento').prop('checked', tipo.ativo != '0');

    $('#btnCancelarEdicao').show();
    $('#nomeTipoAtendimento').focus();
}

function excluirTipo(id) {
    const tipo = tiposAtendimento.find(t => t.id == id);
    if (!tipo) return;

    tipoParaExcluir = tipo;

    $('#modalExcluirNome').text(tipo.nome);

    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function cancelarEdicao() {
    tipoEmEdicao = null;

    $('#formTipoAtendimento')[0].reset();
    $('#tipoId').val('');
    $('#btnCancelarEdicao').hide();
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */

async function carregarListaTiposAtendimento() {
    const container = $('#listaTiposAtendimento');
    container.empty();

    try {
        tiposAtendimento = await apiRequest(API_TIPOS);
    } catch (e) {
        container.html('<p class="text-danger">Erro ao carregar tipos</p>');
        return;
    }

    if (!tiposAtendimento || !tiposAtendimento.length) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-tasks fa-3x mb-3"></i>
                <p>Nenhum tipo de atendimento cadastrado</p>
            </div>
        `);
        return;
    }

    tiposAtendimento.forEach(tipo => {
        const item = $(`
            <div class="card mb-2 ${tipo.ativo == '0' ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${tipo.nome}</h6>
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge ${tipo.ativo == '1' ? 'bg-success' : 'bg-danger'}">
                                ${tipo.ativo == '1' ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-primary" onclick="editarTipo(${tipo.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirTipo(${tipo.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        container.append(item);
    });
}
