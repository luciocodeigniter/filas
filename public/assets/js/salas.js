/**
 * ============================================
 * SALAS - JavaScript (API + CRUD completo)
 * ============================================
 */

const API_SALAS = '/api/salas';

let salas = [];
let salaEmEdicao = null;
let salaParaExcluir = null;

/**
 * =========================
 * API HELPERS
 * =========================
 */

async function apiRequest(url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: data ? JSON.stringify(data) : null
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Erro na requisição');
        }

        return result;

    } catch (error) {
        console.error('Erro API:', error);
        exibirNotificacao(error.message || 'Erro inesperado', 'danger');
        throw error;
    }
}


/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {
    carregarListaSalas();

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!salaParaExcluir) return;

        try {
            await apiRequest(`${API_SALAS}/delete/${salaParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Sala excluída com sucesso!', 'success');

            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            salaParaExcluir = null;
            carregarListaSalas();

        } catch (e) { }
    });
});

/**
 * =========================
 * FORM
 * =========================
 */
$('#formSala').on('reset', function () {
    setTimeout(() => {
        salaEmEdicao = null;
        $('#btnCancelarEdicao').hide();
        $('#salaId').val('');
    }, 0);
});

$('#formSala').submit(async function (e) {
    e.preventDefault();

    const id = $('#salaId').val();
    const nome = $('#nomeSala').val().trim();
    const ativo = $('#ativoSala').is(':checked');

    if (!nome) {
        exibirNotificacao('Por favor, digite o nome da sala!', 'warning');
        return;
    }

    const payload = {
        nome,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_SALAS}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Sala atualizada com sucesso!', 'success');
        } else {
            await apiRequest(`${API_SALAS}/create`, 'POST', payload);
            exibirNotificacao('Sala cadastrada com sucesso!', 'success');
        }

        $('#formSala')[0].reset();
        $('#ativoSala').prop('checked', true);

        salaEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaSalas();

    } catch (e) { }
});

/**
 * =========================
 * AÇÕES
 * =========================
 */

function editarSala(id) {
    const sala = salas.find(s => s.id == id);
    if (!sala) return;

    salaEmEdicao = sala;

    $('#salaId').val(sala.id);
    $('#nomeSala').val(sala.nome);
    $('#ativoSala').prop('checked', sala.ativo != 0);

    $('#btnCancelarEdicao').show();
    $('#nomeSala').focus();
}

function excluirSala(id) {
    salaParaExcluir = { id };

    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

function cancelarEdicao() {
    salaEmEdicao = null;
    $('#formSala')[0].reset();
    $('#salaId').val('');
    $('#btnCancelarEdicao').hide();
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */

async function carregarListaSalas() {
    const container = $('#listaSalas');
    container.empty();

    try {
        salas = await apiRequest(API_SALAS);
    } catch (e) {
        console.error('Erro ao carregar salas:', e);
        container.html('<p class="text-danger">Erro ao carregar salas</p>');
        return;
    }

    if (!salas || !salas.length) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-door-open fa-3x mb-3"></i>
                <p>Nenhuma sala cadastrada</p>
            </div>
        `);
        return;
    }

    salas.forEach(sala => {
        const item = $(`
            <div class="card mb-2 ${!sala.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">
                            <i class="fas fa-door-open text-muted me-2"></i>${sala.nome}
                        </h6>
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge ${sala.ativo == '1' ? 'bg-success' : 'bg-danger'}">
                                ${sala.ativo == '1' ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-primary" onclick="editarSala(${sala.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirSala(${sala.id})">
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