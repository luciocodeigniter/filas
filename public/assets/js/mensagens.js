/**
 * ============================================
 * MENSAGENS - JavaScript (API)
 * CRUD de mensagens
 * ============================================
 */

const API_URL = '/api/mensagens';

let mensagens = [];
let mensagemEmEdicao = null;
let mensagemParaExcluir = null;

/**
 * =========================
 * INIT
 * =========================
 */
$(document).ready(function () {
    carregarListaMensagens();

    $('#btnCancelarEdicao').on('click', cancelarEdicao);

    $('#btnConfirmarExcluir').on('click', async function () {
        if (!mensagemParaExcluir) return;

        try {
            await apiRequest(`${API_URL}/delete/${mensagemParaExcluir.id}`, 'DELETE');

            exibirNotificacao('Mensagem excluída com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();

            mensagemParaExcluir = null;
            carregarListaMensagens();

        } catch (e) { }
    });
});

/**
 * RESET FORM
 */
$('#formMensagem').on('reset', function () {
    setTimeout(() => {
        $('#mensagemId').val('');
        $('#ativoMensagem').prop('checked', true);
        mensagemEmEdicao = null;
        $('#btnCancelarEdicao').hide();
    }, 0);
});

/**
 * SUBMIT
 */
$('#formMensagem').submit(async function (e) {
    e.preventDefault();

    const id = $('#mensagemId').val();
    const titulo = $('#tituloMensagem').val().trim();
    const conteudo = $('#conteudoMensagem').val().trim();
    const ordem = parseInt($('#ordemMensagem').val()) || 0;
    const ativo = $('#ativoMensagem').is(':checked');

    if (!conteudo) {
        exibirNotificacao('Por favor, digite o conteúdo da mensagem!', 'danger');
        return;
    }

    const payload = {
        titulo,
        conteudo,
        ordem,
        ativo
    };

    try {
        if (id) {
            await apiRequest(`${API_URL}/update/${id}`, 'PUT', payload);
            exibirNotificacao('Mensagem atualizada com sucesso!', 'success');
        } else {
            await apiRequest(`${API_URL}/create`, 'POST', payload);
            exibirNotificacao('Mensagem cadastrada com sucesso!', 'success');
        }

        $('#formMensagem')[0].reset();
        $('#ativoMensagem').prop('checked', true);
        mensagemEmEdicao = null;
        $('#btnCancelarEdicao').hide();

        carregarListaMensagens();

    } catch (e) { }
});

/**
 * CANCELAR EDIÇÃO
 */
function cancelarEdicao() {
    mensagemEmEdicao = null;

    $('#formMensagem')[0].reset();
    $('#mensagemId').val('');
    $('#ativoMensagem').prop('checked', true);
    $('#btnCancelarEdicao').hide();

    carregarListaMensagens();
}

/**
 * EDITAR
 */
function editarMensagem(id) {
    const m = mensagens.find(x => x.id == id);
    if (!m) return;

    mensagemEmEdicao = m;

    $('#mensagemId').val(m.id);
    $('#tituloMensagem').val(m.titulo || '');
    $('#conteudoMensagem').val(m.conteudo || '');
    $('#ordemMensagem').val(m.ordem || 0);
    $('#ativoMensagem').prop('checked', m.ativo == '1' || m.ativo === true);

    $('#btnCancelarEdicao').show();
}

/**
 * EXCLUIR
 */
function excluirMensagem(id) {
    const m = mensagens.find(x => x.id == id);
    if (!m) return;

    mensagemParaExcluir = m;

    $('#modalExcluirNome').text(m.titulo || 'Mensagem');
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

/**
 * LISTAR
 */
async function carregarListaMensagens() {
    const container = $('#listaMensagens');
    container.empty();

    try {
        mensagens = await apiRequest(API_URL);

        const ordenadas = [...mensagens].sort((a, b) => (a.ordem || 0) - (b.ordem || 0));

        if (ordenadas.length === 0) {
            container.html(`
                <div class="text-center text-muted py-4">
                    <i class="fas fa-bullhorn fa-3x mb-3"></i>
                    <p>Nenhuma mensagem cadastrada</p>
                </div>
            `);
            return;
        }

        ordenadas.forEach(m => {
            const item = $(`
                <div class="card mb-2 ${!m.ativo || m.ativo == '0' ? 'opacity-50' : ''}">
                    <div class="card-body py-2">
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                ${m.titulo ? `<strong class="text-info">${m.titulo}</strong><br>` : ''}
                                <small>${(m.conteudo || '').substring(0, 80)}${m.conteudo?.length > 80 ? '...' : ''}</small>
                            </div>
                            <div class="d-flex align-items-center gap-1 ms-2">
                                <span class="badge ${m.ativo == 1 ? 'bg-success' : 'bg-secondary'}">
                                    ${m.ativo == '1' ? 'Ativo' : 'Inativo'}
                                </span>
                                <button class="btn btn-sm btn-outline-primary" onclick="editarMensagem(${m.id})">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="btn btn-sm btn-outline-danger" onclick="excluirMensagem(${m.id})">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            container.append(item);
        });

    } catch (e) { }
}