/**
 * ============================================
 * SALAS - JavaScript
 * CRUD de Salas (nome, ativo)
 * ============================================
 */

let salas = [];
if (localStorage.getItem('salas')) {
    try {
        salas = JSON.parse(localStorage.getItem('salas'));
    } catch (e) {
        console.error('Erro ao carregar salas:', e);
    }
}

function salvarSalas() {
    localStorage.setItem('salas', JSON.stringify(salas));
}

$(document).ready(function() {
    carregarListaSalas();
});

$('#formSala').submit(function(e) {
    e.preventDefault();
    
    const nome = $('#nomeSala').val().trim();
    const ativo = $('#ativoSala').is(':checked');
    
    if (!nome) {
        exibirNotificacao('Por favor, digite o nome da sala!', 'warning');
        return;
    }
    
    const sala = {
        id: Date.now(),
        nome: nome,
        ativo: ativo
    };
    
    salas.push(sala);
    salvarSalas();
    
    exibirNotificacao('Sala cadastrada com sucesso!', 'success');
    $('#formSala')[0].reset();
    $('#ativoSala').prop('checked', true);
    carregarListaSalas();
});

function carregarListaSalas() {
    const container = $('#listaSalas');
    container.empty();
    
    if (salas.length === 0) {
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
                        <h6 class="mb-0"><i class="fas fa-door-open text-muted me-2"></i>${sala.nome}</h6>
                        <span class="badge ${sala.ativo ? 'bg-success' : 'bg-secondary'}">
                            ${sala.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
        `);
        container.append(item);
    });
}
