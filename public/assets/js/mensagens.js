/**
 * ============================================
 * MENSAGENS - JavaScript
 * CRUD de mensagens exibidas no Painel de Chamadas
 * ============================================
 */

const MENSAGENS_PADRAO = [
    { id: 1, titulo: 'Segurança', conteudo: 'Por favor, mantenha distância de segurança e use máscara nas dependências', ordem: 0, ativo: true },
    { id: 2, titulo: 'Higiene', conteudo: 'Higienize as mãos com álcool em gel', ordem: 1, ativo: true },
    { id: 3, titulo: 'Aguardar', conteudo: 'Aguarde ser chamado. Obrigado pela compreensão!', ordem: 2, ativo: true },
    { id: 4, titulo: 'Emergência', conteudo: 'Em caso de emergência, dirija-se à recepção', ordem: 3, ativo: true },
    { id: 5, titulo: 'Excelência', conteudo: 'Cuidando da sua saúde com excelência', ordem: 4, ativo: true }
];

let mensagens = [];
let mensagemEmEdicao = null;
let mensagemParaExcluir = null;

if (localStorage.getItem('mensagens')) {
    try {
        mensagens = JSON.parse(localStorage.getItem('mensagens'));
    } catch (e) {
        console.error('Erro ao carregar mensagens:', e);
        mensagens = [...MENSAGENS_PADRAO];
        salvarMensagens();
    }
} else {
    mensagens = [...MENSAGENS_PADRAO];
    salvarMensagens();
}

function salvarMensagens() {
    localStorage.setItem('mensagens', JSON.stringify(mensagens));
}

function getMensagens() {
    try {
        return JSON.parse(localStorage.getItem('mensagens') || '[]');
    } catch (e) {
        return [];
    }
}

$(document).ready(function() {
    carregarListaMensagens();
    
    $('#btnCancelarEdicao').on('click', cancelarEdicao);
    
    $('#btnConfirmarExcluir').on('click', function() {
        if (mensagemParaExcluir !== null) {
            mensagens = mensagens.filter(m => m.id !== mensagemParaExcluir.id);
            salvarMensagens();
            carregarListaMensagens();
            exibirNotificacao('Mensagem excluída com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
            mensagemParaExcluir = null;
        }
    });
});

$('#formMensagem').on('reset', function() {
    setTimeout(() => {
        $('#mensagemId').val('');
        $('#ativoMensagem').prop('checked', true);
        mensagemEmEdicao = null;
        $('#btnCancelarEdicao').hide();
    }, 0);
});

$('#formMensagem').submit(function(e) {
    e.preventDefault();
    
    const id = $('#mensagemId').val();
    const titulo = $('#tituloMensagem').val().trim();
    const conteudo = $('#conteudoMensagem').val().trim();
    const ordem = parseInt($('#ordemMensagem').val()) || 0;
    const ativo = $('#ativoMensagem').is(':checked');
    
    if (!conteudo) {
        exibirNotificacao('Por favor, digite o conteúdo da mensagem!', 'warning');
        return;
    }
    
    if (id) {
        const msg = mensagens.find(m => m.id == id);
        if (msg) {
            msg.titulo = titulo;
            msg.conteudo = conteudo;
            msg.ordem = ordem;
            msg.ativo = ativo;
            exibirNotificacao('Mensagem atualizada com sucesso!', 'success');
        }
    } else {
        const nova = {
            id: Date.now(),
            titulo: titulo,
            conteudo: conteudo,
            ordem: ordem,
            ativo: ativo
        };
        mensagens.push(nova);
        exibirNotificacao('Mensagem cadastrada com sucesso!', 'success');
    }
    
    salvarMensagens();
    $('#formMensagem')[0].reset();
    $('#ativoMensagem').prop('checked', true);
    mensagemEmEdicao = null;
    $('#btnCancelarEdicao').hide();
    carregarListaMensagens();
});

function cancelarEdicao() {
    mensagemEmEdicao = null;
    $('#formMensagem')[0].reset();
    $('#mensagemId').val('');
    $('#ativoMensagem').prop('checked', true);
    $('#btnCancelarEdicao').hide();
    carregarListaMensagens();
}

function editarMensagem(id) {
    const m = mensagens.find(x => x.id === id);
    if (!m) return;
    
    mensagemEmEdicao = m;
    $('#mensagemId').val(m.id);
    $('#tituloMensagem').val(m.titulo || '');
    $('#conteudoMensagem').val(m.conteudo || '');
    $('#ordemMensagem').val(m.ordem || 0);
    $('#ativoMensagem').prop('checked', m.ativo !== false);
    $('#btnCancelarEdicao').show();
}

function excluirMensagem(id) {
    const m = mensagens.find(x => x.id === id);
    if (!m) return;
    
    mensagemParaExcluir = m;
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function carregarListaMensagens() {
    const container = $('#listaMensagens');
    container.empty();
    
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
            <div class="card mb-2 ${!m.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            ${m.titulo ? `<strong class="text-info">${m.titulo}</strong><br>` : ''}
                            <small>${m.conteudo.substring(0, 80)}${m.conteudo.length > 80 ? '...' : ''}</small>
                        </div>
                        <div class="d-flex align-items-center gap-1 ms-2">
                            <span class="badge ${m.ativo ? 'bg-success' : 'bg-secondary'}">
                                ${m.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-primary" onclick="editarMensagem(${m.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirMensagem(${m.id})" title="Excluir">
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
