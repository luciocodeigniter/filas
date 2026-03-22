/**
 * ============================================
 * UNIDADES - JavaScript
 * Funções específicas da página de unidades
 * ============================================
 */

// Carregar unidades do localStorage
let unidades = [];
if (localStorage.getItem('unidades')) {
    try {
        unidades = JSON.parse(localStorage.getItem('unidades'));
    } catch (e) {
        console.error('Erro ao carregar unidades:', e);
    }
}

function salvarUnidades() {
    localStorage.setItem('unidades', JSON.stringify(unidades));
}

function getMunicipios() {
    try {
        return JSON.parse(localStorage.getItem('municipios') || '[]');
    } catch (e) {
        return [];
    }
}

function getMunicipioNome(id) {
    const municipios = getMunicipios();
    const municipio = municipios.find(m => m.id === id);
    return municipio ? municipio.nome : '-';
}

function carregarMunicipiosSelect() {
    const municipios = getMunicipios().filter(m => m.ativo !== false);
    const select = $('#municipioUnidade');
    select.find('option:not(:first)').remove();
    
    municipios.forEach(m => {
        select.append(`<option value="${m.id}">${m.nome}</option>`);
    });
    
    $('#msgSemMunicipios').toggle(municipios.length === 0);
}

$(document).ready(function() {
    carregarMunicipiosSelect();
    carregarListaUnidades();
    
    // Máscara de telefone
    $('#telefoneUnidade').mask('(00) 00000-0000');
});

$('#formUnidade').submit(function(e) {
    e.preventDefault();
    
    const nome = $('#nomeUnidade').val().trim();
    const municipioId = $('#municipioUnidade').val();
    const telefone = $('#telefoneUnidade').val();
    const email = $('#emailUnidade').val().trim();
    const ativo = $('#ativoUnidade').is(':checked');
    
    if (!nome) {
        exibirNotificacao('Por favor, digite o nome da unidade!', 'warning');
        return;
    }
    
    const unidade = {
        id: Date.now(),
        nome: nome,
        municipio_id: municipioId ? parseInt(municipioId) : null,
        telefone: telefone || '',
        email: email || '',
        ativo: ativo
    };
    
    unidades.push(unidade);
    salvarUnidades();
    
    exibirNotificacao('Unidade cadastrada com sucesso!', 'success');
    $('#formUnidade')[0].reset();
    $('#ativoUnidade').prop('checked', true);
    $('#municipioUnidade').val('');
    carregarListaUnidades();
});

function carregarListaUnidades() {
    const container = $('#listaUnidades');
    container.empty();
    
    if (unidades.length === 0) {
        container.html(`
            <div class="text-center text-muted py-4">
                <i class="fas fa-building fa-3x mb-3"></i>
                <p>Nenhuma unidade cadastrada</p>
            </div>
        `);
        return;
    }
    
    unidades.forEach(unidade => {
        const municipioNome = unidade.municipio_id ? getMunicipioNome(unidade.municipio_id) : null;
        const item = $(`
            <div class="card mb-2 ${!unidade.ativo ? 'opacity-50' : ''}">
                <div class="card-body py-2">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <h6 class="mb-1">${unidade.nome}</h6>
                            ${municipioNome ? `<small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${municipioNome}</small><br>` : ''}
                            ${unidade.telefone ? `<small class="text-muted"><i class="fas fa-phone"></i> ${unidade.telefone}</small><br>` : ''}
                            ${unidade.email ? `<small class="text-muted"><i class="fas fa-envelope"></i> ${unidade.email}</small>` : ''}
                        </div>
                        <span class="badge ${unidade.ativo ? 'bg-success' : 'bg-secondary'}">
                            ${unidade.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>
            </div>
        `);
        container.append(item);
    });
}
