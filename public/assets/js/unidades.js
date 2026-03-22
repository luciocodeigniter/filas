/**
 * ============================================
 * UNIDADES - JavaScript (API + CRUD completo)
 * ============================================
 */

const API_UNIDADES = '/api/unidades';
const API_MUNICIPIOS = '/api/municipios';

let unidades = [];
let municipios = [];
let unidadeEmEdicao = null;
let unidadeParaExcluir = null;

/**
 * =========================
 * API HELPER
 * =========================
 */
async function apiRequest(url, method = 'GET', data = null) {
    try {
        const response = await fetch(url, {
            method,
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
 * MUNICÍPIOS
 * =========================
 */
async function carregarMunicipios() {
    try {
        municipios = await apiRequest(API_MUNICIPIOS);
    } catch (e) {
        municipios = [];
    }
}

function getMunicipioNome(id) {
    const municipio = municipios.find(m => m.id == id);
    return municipio ? municipio.nome : '-';
}

async function carregarMunicipiosSelect() {
    await carregarMunicipios();

    const ativos = municipios.filter(m => m.ativo != 0);
    const select = $('#municipioUnidade');

    select.find('option:not(:first)').remove();

    ativos.forEach(m => {
        select.append(`<option value="${m.id}">${m.nome}</option>`);
    });

    $('#msgSemMunicipios').toggle(ativos.length === 0);
}

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {
    carregarMunicipiosSelect();
    carregarListaUnidades();

    $('#telefoneUnidade').mask('(00) 00000-0000');

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!unidadeParaExcluir) return;

        try {
            await apiRequest(`${API_UNIDADES}/delete/${unidadeParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Unidade excluída com sucesso!', 'success');

            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            unidadeParaExcluir = null;
            carregarListaUnidades();

        } catch (e) {}
    });
});

/**
 * =========================
 * FORM
 * =========================
 */
$('#formUnidade').on('reset', function () {
    setTimeout(() => {
        unidadeEmEdicao = null;
        $('#btnCancelarEdicao').hide();
        $('#unidadeId').val('');
    }, 0);
});

$('#formUnidade').submit(async function (e) {
    e.preventDefault();

    const id = $('#unidadeId').val();
    const nome = $('#nomeUnidade').val().trim();
    const municipioId = $('#municipioUnidade').val();
    const telefone = $('#telefoneUnidade').val();
    const email = $('#emailUnidade').val().trim();
    const ativo = $('#ativoUnidade').is(':checked');

    if (!nome) {
        exibirNotificacao('Por favor, digite o nome da unidade!', 'warning');
        return;
    }

    const payload = {
        nome,
        municipio_id: municipioId ? parseInt(municipioId) : null,
        telefone,
        email,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_UNIDADES}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Unidade atualizada com sucesso!', 'success');
        } else {
            await apiRequest(`${API_UNIDADES}/create`, 'POST', payload);
            exibirNotificacao('Unidade cadastrada com sucesso!', 'success');
        }

        $('#formUnidade')[0].reset();
        $('#ativoUnidade').prop('checked', true);
        $('#municipioUnidade').val('');

        unidadeEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaUnidades();

    } catch (e) {}
});

/**
 * =========================
 * AÇÕES
 * =========================
 */

function editarUnidade(id) {
    const unidade = unidades.find(u => u.id == id);
    if (!unidade) return;

    unidadeEmEdicao = unidade;

    $('#unidadeId').val(unidade.id);
    $('#nomeUnidade').val(unidade.nome);
    $('#municipioUnidade').val(unidade.municipio_id);
    $('#telefoneUnidade').val(unidade.telefone || '');
    $('#emailUnidade').val(unidade.email || '');
    $('#ativoUnidade').prop('checked', unidade.ativo != '0');

    $('#btnCancelarEdicao').show();
    $('#nomeUnidade').focus();
}

function excluirUnidade(id) {
    unidadeParaExcluir = { id };

    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'));
    modal.show();
}

function cancelarEdicao() {
    unidadeEmEdicao = null;
    $('#formUnidade')[0].reset();
    $('#unidadeId').val('');
    $('#btnCancelarEdicao').hide();
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */

async function carregarListaUnidades() {
    const container = $('#listaUnidades');
    container.empty();

    try {
        unidades = await apiRequest(API_UNIDADES);
    } catch (e) {
        container.html('<p class="text-danger">Erro ao carregar unidades</p>');
        return;
    }

    if (!unidades.length) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-building fa-3x mb-3"></i>
                <p>Nenhuma unidade cadastrada</p>
            </div>
        `);
        return;
    }

    unidades.forEach(unidade => {
        const municipioNome = unidade.municipio_id
            ? getMunicipioNome(unidade.municipio_id)
            : null;

        const item = $(`
            <div class="card mb-2 ${!unidade.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${unidade.nome}</h6>
                            ${municipioNome ? `<small class="text-muted"><i class="fas fa-map-marker-alt"></i> Município: ${municipioNome}</small><br>` : ''}
                            ${unidade.telefone ? `<small class="text-muted"><i class="fas fa-phone"></i> ${unidade.telefone}</small><br>` : ''}
                            ${unidade.email ? `<small class="text-muted"><i class="fas fa-envelope"></i> ${unidade.email}</small><br>` : ''}
                            ${unidade.ativo === '1' ? '<span class="badge bg-success">Ativo</span>' : '<span class="badge bg-danger">Inativo</span>'}
                        </div>
                        <div class="d-flex gap-1">
                            <button class="btn btn-sm btn-outline-primary" onclick="editarUnidade(${unidade.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirUnidade(${unidade.id})">
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
