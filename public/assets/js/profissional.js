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

        } catch (e) { }
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
        $('#senhaProfissional').prop('required', true);
        $('#spanSenha').html('*');
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

    if (!nome) return exibirNotificacao('Digite o nome!', 'danger');
    if (!id && (!senha || senha.length < 4)) return exibirNotificacao('Senha mínima 4 caracteres!', 'danger');
    if (unidadeIds.length === 0) return exibirNotificacao('Selecione ao menos uma unidade!', 'danger');
    if (tipoAtendimentoIds.length === 0) return exibirNotificacao('Selecione ao menos um tipo de atendimento!', 'danger');

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

    } catch (e) { }
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

        const unidadesNomes = (p.unidades || [])
            .map(u => `<span class="badge bg-primary me-1">${u.nome}</span>`)
            .join('') || '-';

        const tiposNomes = (p.tipos || [])
            .map(t => `<span class="badge bg-info me-1">${t.nome}</span>`)
            .join('') || '-';

        const row = $(`
            <tr class="${!p.ativo ? 'table-secondary' : ''}">
                <td>${p.first_name} ${p.last_name}</td>
                <td>${unidadesNomes}</td>
                <td>${tiposNomes}</td>
                <td>${p.email || ''}
                <br>
                    ${p.phone || ''}
                </td>
                <td>
                    <span class="badge ${p.active == '1' ? 'bg-success' : 'bg-danger'}">
                        ${p.active == '1' ? 'Ativo' : 'Inativo'}
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

    $('#senhaProfissional').prop('required', false);
    $('#spanSenha').html('(informe se quiser alterar)');

    $('#profissionalId').val(p.id);
    $('#nomeProfissional').val(p.first_name);
    $('#sobrenomeProfissional').val(p.last_name);
    $('#telefoneProfissional').val(p.phone);
    $('#emailProfissional').val(p.email);
    $('#ativoProfissional').prop('checked', p.active == '1');

    // limpa tudo
    $('.unidade-check').prop('checked', false);
    $('.tipo-atendimento-check').prop('checked', false);

    // ✅ marca unidades
    (p.unidades || []).forEach(u => {
        $(`#unidade_${u.id}`).prop('checked', true);
    });

    // ✅ marca tipos
    (p.tipos || []).forEach(t => {
        $(`#tipo_${t.id}`).prop('checked', true);
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