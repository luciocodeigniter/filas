/**
 * ============================================
 * TIPOS DE ATENDIMENTO - JavaScript
 * Funções específicas da página de tipos de atendimento
 * ============================================
 */

// Carregar tipos do localStorage
let tiposAtendimento = [];
if (localStorage.getItem('tiposAtendimento')) {
    try {
        tiposAtendimento = JSON.parse(localStorage.getItem('tiposAtendimento'));
    } catch (e) {
        console.error('Erro ao carregar tipos de atendimento:', e);
    }
}

function salvarTiposAtendimento() {
    localStorage.setItem('tiposAtendimento', JSON.stringify(tiposAtendimento));
}

$(document).ready(function() {
    carregarListaTiposAtendimento();
});

$('#formTipoAtendimento').submit(function(e) {
    e.preventDefault();
    
    const nome = $('#nomeTipoAtendimento').val().trim();
    const ativo = $('#ativoTipoAtendimento').is(':checked');
    
    if (!nome) {
        exibirNotificacao('Por favor, digite o nome do atendimento!', 'warning');
        return;
    }
    
    const tipo = {
        id: Date.now(),
        nome: nome,
        ativo: ativo
    };
    
    tiposAtendimento.push(tipo);
    salvarTiposAtendimento();
    
    exibirNotificacao('Tipo de atendimento cadastrado com sucesso!', 'success');
    $('#formTipoAtendimento')[0].reset();
    $('#ativoTipoAtendimento').prop('checked', true);
    carregarListaTiposAtendimento();
});

function carregarListaTiposAtendimento() {
    const container = $('#listaTiposAtendimento');
    container.empty();
    
    if (tiposAtendimento.length === 0) {
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
            <div class="card mb-2 ${!tipo.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <h6 class="mb-0">${tipo.nome}</h6>
                        <span class="badge ${tipo.ativo ? 'bg-success' : 'bg-secondary'}">
                            ${tipo.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
        `);
        container.append(item);
    });
}
