/**
 * ============================================
 * CLASSIFICAÇÕES DE RISCO - JavaScript
 * CRUD (nome, cor, prioridade, tempo_estimado_min, ativo)
 * ============================================
 */

const CLASSIFICACOES_PADRAO = [
    { id: 1, nome: 'EMERGÊNCIA', cor: 'vermelho', prioridade: 1, tempo_estimado_min: 0, ativo: true },
    { id: 2, nome: 'MUITO URGENTE', cor: 'laranja', prioridade: 2, tempo_estimado_min: 10, ativo: true },
    { id: 3, nome: 'URGENTE', cor: 'amarelo', prioridade: 3, tempo_estimado_min: 60, ativo: true },
    { id: 4, nome: 'POUCO URGENTE', cor: 'verde', prioridade: 4, tempo_estimado_min: 120, ativo: true },
    { id: 5, nome: 'NÃO URGENTE', cor: 'azul', prioridade: 5, tempo_estimado_min: 240, ativo: true }
];

let classificacoes = [];
let classificacaoEmEdicao = null;
let classificacaoParaExcluir = null;

if (localStorage.getItem('classificacoesRisco')) {
    try {
        classificacoes = JSON.parse(localStorage.getItem('classificacoesRisco'));
    } catch (e) {
        console.error('Erro ao carregar classificações:', e);
        classificacoes = [...CLASSIFICACOES_PADRAO];
    }
} else {
    classificacoes = [...CLASSIFICACOES_PADRAO];
    salvarClassificacoes();
}

function salvarClassificacoes() {
    localStorage.setItem('classificacoesRisco', JSON.stringify(classificacoes));
    if (typeof dadosMockados !== 'undefined') {
        dadosMockados.classificacoes = classificacoes.map(c => ({
            id: c.id,
            nome: c.nome,
            cor: c.cor,
            prioridade: c.prioridade
        }));
        if (typeof salvarDados === 'function') salvarDados();
    }
}

$(document).ready(function() {
    carregarListaClassificacoes();
    
    $('#btnCancelarEdicao').on('click', cancelarEdicao);
    
    $('#btnConfirmarExcluir').on('click', function() {
        if (classificacaoParaExcluir !== null) {
            classificacoes = classificacoes.filter(c => c.id !== classificacaoParaExcluir.id);
            salvarClassificacoes();
            carregarListaClassificacoes();
            exibirNotificacao('Classificação excluída com sucesso!', 'success');
            bootstrap.Modal.getInstance(document.getElementById('modalExcluir')).hide();
            classificacaoParaExcluir = null;
        }
    });
});

$('#formClassificacao').on('reset', function() {
    setTimeout(() => {
        $('#classificacaoId').val('');
        $('#ativoClassificacao').prop('checked', true);
        classificacaoEmEdicao = null;
        $('#btnCancelarEdicao').hide();
    }, 0);
});

$('#formClassificacao').submit(function(e) {
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
    
    if (id) {
        const classificacao = classificacoes.find(c => c.id == id);
        if (classificacao) {
            classificacao.nome = nome;
            classificacao.cor = cor;
            classificacao.prioridade = prioridade;
            classificacao.tempo_estimado_min = tempoEstimado ? parseInt(tempoEstimado) : null;
            classificacao.ativo = ativo;
            exibirNotificacao('Classificação atualizada com sucesso!', 'success');
        }
    } else {
        const nova = {
            id: Date.now(),
            nome: nome,
            cor: cor,
            prioridade: prioridade,
            tempo_estimado_min: tempoEstimado ? parseInt(tempoEstimado) : null,
            ativo: ativo
        };
        classificacoes.push(nova);
        exibirNotificacao('Classificação cadastrada com sucesso!', 'success');
    }
    
    salvarClassificacoes();
    $('#formClassificacao')[0].reset();
    $('#ativoClassificacao').prop('checked', true);
    classificacaoEmEdicao = null;
    $('#btnCancelarEdicao').hide();
    carregarListaClassificacoes();
});

function cancelarEdicao() {
    classificacaoEmEdicao = null;
    $('#formClassificacao')[0].reset();
    $('#classificacaoId').val('');
    $('#ativoClassificacao').prop('checked', true);
    $('#btnCancelarEdicao').hide();
    carregarListaClassificacoes();
}

function editarClassificacao(id) {
    const c = classificacoes.find(x => x.id === id);
    if (!c) return;
    
    classificacaoEmEdicao = c;
    $('#classificacaoId').val(c.id);
    $('#nomeClassificacao').val(c.nome);
    $('#corClassificacao').val(c.cor);
    $('#prioridadeClassificacao').val(c.prioridade || 1);
    $('#tempoEstimadoClassificacao').val(c.tempo_estimado_min || '');
    $('#ativoClassificacao').prop('checked', c.ativo !== false);
    $('#btnCancelarEdicao').show();
}

function excluirClassificacao(id) {
    const c = classificacoes.find(x => x.id === id);
    if (!c) return;
    
    classificacaoParaExcluir = c;
    $('#modalExcluirNome').text(c.nome);
    new bootstrap.Modal(document.getElementById('modalExcluir')).show();
}

function carregarListaClassificacoes() {
    const container = $('#listaClassificacoes');
    container.empty();
    
    const ordenadas = [...classificacoes].sort((a, b) => (a.prioridade || 99) - (b.prioridade || 99));
    
    ordenadas.forEach(c => {
        const tempo = c.tempo_estimado_min != null ? `Até ${c.tempo_estimado_min} min` : '';
        const corClass = `risco-${c.cor}`;
        const item = $(`
            <div class="card mb-2 classificacao-item ${corClass} ${!c.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>${c.nome}</strong>
                            ${tempo ? `<br><small>${tempo}</small>` : ''}
                        </div>
                        <div class="d-flex align-items-center gap-1">
                            <span class="badge ${c.ativo ? 'bg-success' : 'bg-secondary'}">
                                ${c.ativo ? 'Ativo' : 'Inativo'}
                            </span>
                            <button class="btn btn-sm btn-outline-dark" onclick="editarClassificacao(${c.id})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-sm btn-outline-danger" onclick="excluirClassificacao(${c.id})" title="Excluir">
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
