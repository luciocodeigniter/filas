/**
 * ============================================
 * PROFISSIONAIS - JavaScript (API + CRUD)
 * ============================================
 */

const API_PROFISSIONAIS = '/api/profissionais';
const API_UNIDADES = '/api/unidades';
const API_TIPOS = '/api/tipos';

let profissionais = [];
let unidades = [];
let tiposAtendimento = [];

let profissionalEmEdicao = null;
let profissionalParaExcluir = null;

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(async function () {
    await carregarDependencias();
    carregarListaProfissionais();

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!profissionalParaExcluir) return;

        try {
            await apiRequest(`${API_PROFISSIONAIS}/delete/${profissionalParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Profissional excluído com sucesso!', 'success');

            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            profissionalParaExcluir = null;
            carregarListaProfissionais();

        } catch (e) {}
    });

    $('#telefoneProfissional').mask('(00) 00000-0000');
});

/**
 * =========================
 * DEPENDÊNCIAS (API)
 * =========================
 */
async function carregarDependencias() {
    try {
        unidades = await apiRequest(API_UNIDADES);
        tiposAtendimento = await apiRequest(API_TIPOS);

        carregarUnidadesCheckbox();
        carregarTiposAtendimentoCheckbox();

    } catch (e) {
        console.error('Erro ao carregar dependências');
    }
}

/**
 * =========================
 * FORM
 * =========================
 */
$('#formProfissional').on('reset', function () {
    setTimeout(() => {
        $('.unidade-check').prop('checked', false);
        $('.tipo-atendimento-check').prop('checked', false);
        $('#ativoProfissional').prop('checked', true);
        profissionalEmEdicao = null;
        $('#profissionalId').val('');
        $('#btnCancelarEdicao').hide();
    }, 0);
});

$('#formProfissional').submit(async function (e) {
    e.preventDefault();

    const id = $('#profissionalId').val();
    const nome = $('#nomeProfissional').val().trim();
    const sobrenome = $('#sobrenomeProfissional').val().trim();
    const telefone = $('#telefoneProfissional').val();
    const email = $('#emailProfissional').val().trim();
    const senha = $('#senhaProfissional').val();
    const ativo = $('#ativoProfissional').is(':checked');

    const unidadeIds = $('.unidade-check:checked').map(function () {
        return $(this).val();
    }).get();

    const tipoAtendimentoIds = $('.tipo-atendimento-check:checked').map(function () {
        return $(this).val();
    }).get();

    if (!nome) return exibirNotificacao('Digite o nome!', 'warning');
    // if (!perfilAcesso) return exibirNotificacao('Selecione o perfil!', 'warning');
    if (!id && (!senha || senha.length < 4)) return exibirNotificacao('Senha mínima 4 caracteres!', 'warning');
    if (unidadeIds.length === 0) return exibirNotificacao('Selecione ao menos uma unidade!', 'warning');

    const payload = {
        nome,
        sobrenome,
        telefone,
        email,
        senha,
        unidade_ids: unidadeIds,
        tipo_atendimento_ids: tipoAtendimentoIds,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_PROFISSIONAIS}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Atualizado com sucesso!', 'success');
        } else {
            await apiRequest(`${API_PROFISSIONAIS}/create`, 'POST', payload);
            exibirNotificacao('Cadastrado com sucesso!', 'success');
        }

        $('#formProfissional')[0].reset();
        carregarListaProfissionais();

    } catch (e) {}
});

/**
 * =========================
 * CHECKBOXES
 * =========================
 */
function carregarUnidadesCheckbox() {
    const container = $('#listaUnidadesCheckbox');
    container.empty();

    const ativos = unidades.filter(u => u.ativo == '1');

    if (!ativos.length) {
        container.html('<small class="text-muted">Nenhuma unidade cadastrada</small>');
        return;
    }

    ativos.forEach(u => {
        container.append(`
            <div class="form-check">
                <input class="form-check-input unidade-check" type="checkbox" value="${u.id}" id="unidade_${u.id}">
                <label class="form-check-label">${u.nome}</label>
            </div>
        `);
    });
}

function carregarTiposAtendimentoCheckbox() {
    const container = $('#listaTiposAtendimentoCheckbox');
    container.empty();

    const ativos = tiposAtendimento.filter(t => t.ativo == '1');

    if (!ativos.length) {
        container.html('<small class="text-muted">Nenhum tipo cadastrado</small>');
        return;
    }

    ativos.forEach(t => {
        container.append(`
            <div class="form-check">
                <input class="form-check-input tipo-atendimento-check" type="checkbox" value="${t.id}" id="tipo_${t.id}">
                <label class="form-check-label">${t.nome}</label>
            </div>
        `);
    });
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */
async function carregarListaProfissionais() {
    const tbody = $('#listaProfissionais');
    tbody.empty();

    try {
        profissionais = await apiRequest(API_PROFISSIONAIS);
    } catch (e) {
        tbody.html('<tr><td colspan="7">Erro ao carregar</td></tr>');
        return;
    }

    if (!profissionais.length) {
        tbody.html(`<tr><td colspan="7" class="text-center">Nenhum cadastrado</td></tr>`);
        return;
    }

    profissionais.forEach(p => {

        const unidadesNomes = (p.unidade_ids || [])
            .map(id => unidades.find(u => u.id == id)?.nome)
            .filter(Boolean)
            .join(', ') || '-';

        const tiposNomes = (p.tipo_atendimento_ids || [])
            .map(id => tiposAtendimento.find(t => t.id == id)?.nome)
            .filter(Boolean)
            .join(', ') || '-';

        const row = $(`
            <tr class="${!p.ativo ? 'table-secondary' : ''}">
                <td>${p.nome}</td>
                <td>${p.perfil_acesso}</td>
                <td>${unidadesNomes}</td>
                <td>${tiposNomes}</td>
                <td>${p.email || '-'}</td>
                <td>
                    <span class="badge ${p.ativo == 1 ? 'bg-success' : 'bg-secondary'}">
                        ${p.ativo == 1 ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="editarProfissional(${p.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="excluirProfissional(${p.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `);

        tbody.append(row);
    });
}

/**
 * =========================
 * AÇÕES
 * =========================
 */
function editarProfissional(id) {
    const p = profissionais.find(x => x.id == id);
    if (!p) return;

    profissionalEmEdicao = p;

    $('#profissionalId').val(p.id);
    $('#nomeProfissional').val(p.firt_name);
    $('#sobrenomeProfissional').val(p.last_name);
    $('#telefoneProfissional').val(p.phone);
    $('#emailProfissional').val(p.email);
    // $('#perfilAcesso').val(p.perfil_acesso);
    $('#ativoProfissional').prop('checked', p.active == '1');

    $('.unidade-check').prop('checked', false);
    $('.tipo-atendimento-check').prop('checked', false);

    (p.unidade_ids || []).forEach(id => {
        $(`#unidade_${id}`).prop('checked', true);
    });

    (p.tipo_atendimento_ids || []).forEach(id => {
        $(`#tipo_${id}`).prop('checked', true);
    });

    $('#btnCancelarEdicao').show();
}

function excluirProfissional(id) {
    const p = profissionais.find(x => x.id == id);
    if (!p) return;

    profissionalParaExcluir = p;

    $('#modalExcluirNome').text(p.nome);
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function cancelarEdicao() {
    $('#formProfissional')[0].reset();
    $('#profissionalId').val('');
    $('#btnCancelarEdicao').hide();
    profissionalEmEdicao = null;
}