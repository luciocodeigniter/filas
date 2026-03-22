/**
 * ============================================
 * CLASSIFICAÇÕES - JavaScript (API + CRUD)
 * ============================================
 */

const API_CLASSIFICACOES = '/api/classificacoes';

let classificacoes = [];
let classificacaoEmEdicao = null;
let classificacaoParaExcluir = null;

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {
    carregarListaClassificacoes();

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!classificacaoParaExcluir) return;

        try {
            await apiRequest(`${API_CLASSIFICACOES}/delete/${classificacaoParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Classificação excluída com sucesso!', 'success');

            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            classificacaoParaExcluir = null;
            carregarListaClassificacoes();

        } catch (e) {}
    });
});

/**
 * =========================
 * FORM
 * =========================
 */
$('#formClassificacao').on('reset', function () {
    setTimeout(() => {
        classificacaoEmEdicao = null;
        $('#btnCancelarEdicao').hide();
        $('#classificacaoId').val('');
    }, 0);
});

$('#formClassificacao').submit(async function (e) {
    e.preventDefault();

    const id = $('#classificacaoId').val();
    const nome = $('#nomeClassificacao').val().trim();
    const cor = $('#corClassificacao').val();
    const prioridade = parseInt($('#prioridadeClassificacao').val()) || 1;
    const tempoEstimado = $('#tempoEstimadoClassificacao').val();
    const ativo = $('#ativoClassificacao').is(':checked');

    if (!nome) {
        exibirNotificacao('Por favor, digite o nome da classificação!', 'warning');
        return;
    }

    const payload = {
        nome,
        cor,
        prioridade,
        tempo_estimado_min: tempoEstimado ? parseInt(tempoEstimado) : null,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_CLASSIFICACOES}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Classificação atualizada com sucesso!', 'success');
        } else {
            await apiRequest(`${API_CLASSIFICACOES}/create`, 'POST', payload);
            exibirNotificacao('Classificação cadastrada com sucesso!', 'success');
        }

        $('#formClassificacao')[0].reset();
        $('#ativoClassificacao').prop('checked', true);

        classificacaoEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaClassificacoes();

    } catch (e) {}
});

/**
 * =========================
 * AÇÕES
 * =========================
 */

function editarClassificacao(id) {
    const c = classificacoes.find(x => x.id == id);
    if (!c) return;

    classificacaoEmEdicao = c;

    $('#classificacaoId').val(c.id);
    $('#nomeClassificacao').val(c.nome);
    $('#corClassificacao').val(c.cor);
    $('#prioridadeClassificacao').val(c.prioridade || 1);
    $('#tempoEstimadoClassificacao').val(c.tempo_estimado_min || '');
    $('#ativoClassificacao').prop('checked', c.ativo != '0');

    $('#btnCancelarEdicao').show();
}

function excluirClassificacao(id) {
    const c = classificacoes.find(x => x.id == id);
    if (!c) return;

    classificacaoParaExcluir = c;

    $('#modalExcluirNome').text(c.nome);

    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function cancelarEdicao() {
    classificacaoEmEdicao = null;

    $('#formClassificacao')[0].reset();
    $('#classificacaoId').val('');
    $('#btnCancelarEdicao').hide();
}

/**
 * =========================
 * LISTAGEM
 * =========================
 */

async function carregarListaClassificacoes() {
    const container = $('#listaClassificacoes');
    container.empty();

    try {
        classificacoes = await apiRequest(API_CLASSIFICACOES);
    } catch (e) {
        container.html('<p class="text-danger">Erro ao carregar classificações</p>');
        return;
    }

    if (!classificacoes || !classificacoes.length) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-list fa-3x mb-3"></i>
                <p>Nenhuma classificação cadastrada</p>
            </div>
        `);
        return;
    }

    const ordenadas = [...classificacoes].sort(
        (a, b) => (a.prioridade || 99) - (b.prioridade || 99)
    );

    ordenadas.forEach(c => {
        const tempo = c.tempo_estimado_min != null
            ? `Até ${c.tempo_estimado_min} min`
            : '';

        const corClass = `risco-${c.cor}`;

        const item = $(`
            <div class="card mb-2 classificacao-item ${corClass} ${c.ativo == '0' ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${c.nome}</strong>
                            ${tempo ? `<br><small>${tempo}</small>` : ''}
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge ${c.ativo ? 'bg-success' : 'bg-secondary'}">
                                ${c.ativo == '1' ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-dark" onclick="editarClassificacao(${c.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirClassificacao(${c.id})">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `);

        container.append(item);
    });
}
